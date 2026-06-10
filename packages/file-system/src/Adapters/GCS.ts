import {FileMetadata, Storage, type Bucket} from '@google-cloud/storage';
import {BaseFileSystem, FileSystemResponse, FileSystemStatsResponse} from './Base';

/**
 * Adapter for Google Cloud Storage (GCS) that implements the BaseFileSystem interface.
 * This class provides methods to interact with GCS, such as reading, writing, and deleting files.
 * It uses the @google-cloud/storage library to communicate with GCS.
 * Note: Ensure that the appropriate permissions and credentials are set up for the GCS bucket being accessed.
 * This implementation assumes that the bucket already exists and that the necessary ADC (Application Default Credentials) are configured for authentication.
 */
export class GCSFileSystem implements BaseFileSystem {
  private bucketName: string;
  private bucket: Bucket;
  private storage: Storage;

  public constructor({bucketName}: {bucketName: string}) {
    this.bucketName = bucketName;

    this.storage = new Storage();
    this.bucket = this.storage.bucket(this.bucketName);
  }

  private async getHead(
    key: string,
  ): Promise<{ok: true; response: FileMetadata} | {ok: false; error: Error}> {
    try {
      const [response] = await this.bucket.file(key).getMetadata();
      return {ok: true, response};
    } catch (err) {
      return {ok: false, error: err as Error};
    }
  }

  public async stats(key: string): Promise<FileSystemResponse<FileSystemStatsResponse>> {
    const head = await this.getHead(key);

    if (!head.ok) {
      return {ok: false, error: 'NotFound'};
    }

    const size = head.response.size ? Number(head.response.size) : 0;

    return {
      ok: true,
      response: {
        size,
        lastModified: head.response.updated ? new Date(head.response.updated) : new Date(0),
      },
    };
  }

  public async exists(key: string): Promise<boolean> {
    let exists = false;

    try {
      const [response] = await this.bucket.file(key).exists();
      exists = response;
    } catch {
      exists = false;
    }

    return exists;
  }

  public async read(key: string): Promise<FileSystemResponse<Buffer>> {
    if (!(await this.exists(key))) {
      return {ok: false, error: 'NotFound'};
    }

    try {
      const [buffer] = await this.bucket.file(key).download();

      return {ok: true, response: buffer};
    } catch {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async readStream(
    key: string,
    config?: {start?: number; end?: number},
  ): Promise<FileSystemResponse<NodeJS.ReadableStream>> {
    if (!(await this.exists(key))) {
      return {ok: false, error: 'NotFound'};
    }

    try {
      const response = this.bucket.file(key).createReadStream({
        start: config?.start,
        end: config?.end,
      });

      return {ok: true, response};
    } catch {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async write(key: string, data: Buffer, mime: string): Promise<boolean> {
    try {
      await this.bucket.file(key).save(data, {
        contentType: mime,
        validation: 'crc32c',
      });

      return true;
    } catch {
      return false;
    }
  }

  public async delete(key: string): Promise<boolean> {
    try {
      await this.bucket.file(key).delete();
      return true;
    } catch {
      return false;
    }
  }
}
