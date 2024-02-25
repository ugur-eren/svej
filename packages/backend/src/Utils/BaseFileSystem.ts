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
  /**
   * Currently only supports getting the size of the object.
   */
  public abstract stats(key: string): Promise<
    FileSystemResponse<{
      /** The size of the object in bytes. */
      size: number;
    }>
  >;

  public abstract exists(key: string): Promise<boolean>;

  public abstract read(key: string): Promise<FileSystemResponse<Buffer>>;
  public abstract readStream(
    key: string,
    config?: {start?: number; end?: number},
  ): Promise<FileSystemResponse<NodeJS.ReadableStream>>;

  public abstract write(key: string, data: Buffer, mime: string): Promise<boolean>;

  public abstract delete(key: string): Promise<boolean>;
}
