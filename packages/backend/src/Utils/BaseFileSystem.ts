/* eslint max-classes-per-file: "off" */

export const FileSystemErrors = ['Unknown', 'NotFound'] as const;
export type FileSystemError = (typeof FileSystemErrors)[number];

export type FileSystemResponse<TResponse> =
  | {
      ok: true;
      response: TResponse;
    }
  | {
      ok: false;
      error: FileSystemError;
    };

export abstract class BaseFileSystem {
  public abstract exists(key: string): Promise<boolean>;

  public abstract read(key: string): Promise<FileSystemResponse<Buffer>>;
  public abstract readStream(key: string): Promise<FileSystemResponse<NodeJS.ReadableStream>>;

  public abstract write(key: string, data: Buffer, mime: string): Promise<boolean>;

  public abstract delete(key: string): Promise<boolean>;
}
