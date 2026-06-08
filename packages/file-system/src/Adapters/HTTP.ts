import {BaseFileSystem, FileSystemResponse, FileSystemStatsResponse} from './Base';

/**
 * Adapter for HTTP storage endpoints that implements the BaseFileSystem interface.
 * The base endpoint should include a %fileKey% placeholder, e.g. "http://example.com/%fileKey%".
 * Any headers or other RequestInit options can be provided via the constructor and will be merged with per-request options.
 * This implementation uses standard HTTP methods: GET, HEAD, PUT, DELETE.
 */
export class HTTPFileSystem implements BaseFileSystem {
  private baseEndpoint: string;
  private requestInit?: RequestInit;

  public constructor({
    baseEndpoint,
    requestInit,
  }: {
    baseEndpoint: string;
    requestInit?: RequestInit;
  }) {
    this.baseEndpoint = baseEndpoint;
    this.requestInit = requestInit;
  }

  private resolveUrl(key: string): string {
    return this.baseEndpoint.replace('%fileKey%', encodeURIComponent(key));
  }

  private fetchWithKey(key: string, requestInit: RequestInit): Promise<Response> {
    return fetch(this.resolveUrl(key), {
      ...this.requestInit,
      ...requestInit,
    });
  }

  private async head(
    key: string,
  ): Promise<{ok: true; response: Response} | {ok: false; error: Error}> {
    try {
      const response = await this.fetchWithKey(key, {
        method: 'HEAD',
      });

      return {ok: true, response};
    } catch (err) {
      return {ok: false, error: err as Error};
    }
  }

  public async stats(key: string): Promise<FileSystemResponse<FileSystemStatsResponse>> {
    const head = await this.head(key);

    if (!head.ok) {
      return {ok: false, error: 'Unknown'};
    }

    if (!head.response.ok) {
      return {ok: false, error: head.response.status === 404 ? 'NotFound' : 'Unknown'};
    }

    const length = head.response.headers.get('content-length');
    const size = length ? Number(length) : 0;

    return {
      ok: true,
      response: {
        size,
        lastModified: new Date(0),
      },
    };
  }

  public async exists(key: string): Promise<boolean> {
    const head = await this.head(key);
    return head.ok ? head.response.ok : false;
  }

  public async read(key: string): Promise<FileSystemResponse<Buffer>> {
    try {
      const response = await this.fetchWithKey(key, {
        method: 'GET',
      });

      if (!response.ok) {
        return {ok: false, error: response.status === 404 ? 'NotFound' : 'Unknown'};
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      return {ok: true, response: buffer};
    } catch {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async readStream(
    key: string,
    config?: {start?: number; end?: number},
  ): Promise<FileSystemResponse<NodeJS.ReadableStream>> {
    try {
      const headers: Record<string, string> = {};

      if (config?.start !== undefined || config?.end !== undefined) {
        const start = config?.start ?? 0;
        const end = config?.end !== undefined ? config.end : '';
        headers.range = `bytes=${start}-${end}`;
      }

      const response = await this.fetchWithKey(key, {
        method: 'GET',
        headers,
      });

      if (!response.ok || !response.body) {
        return {ok: false, error: response.status === 404 ? 'NotFound' : 'Unknown'};
      }

      return {ok: true, response: response.body as unknown as NodeJS.ReadableStream};
    } catch {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async write(key: string, data: Buffer, mime: string): Promise<boolean> {
    try {
      const response = await this.fetchWithKey(key, {
        method: 'PUT',
        headers: {
          'content-type': mime,
        },
        body: new Uint8Array(data),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  public async delete(key: string): Promise<boolean> {
    try {
      const response = await this.fetchWithKey(key, {
        method: 'DELETE',
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}
