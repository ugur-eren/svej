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
  public abstract exists(path: string): Promise<boolean>;

  public abstract read(path: string): Promise<FileSystemResponse<Buffer>>;
  public abstract readStream(path: string): Promise<FileSystemResponse<NodeJS.ReadableStream>>;

  public abstract write(path: string, data: Buffer, mime: string): Promise<boolean>;

  public abstract delete(path: string): Promise<boolean>;
}
