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

export type FileSystemStatsResponse = {
  /** The size of the object in bytes. */
  size: number;

  /** The last modified date of the object. */
  lastModified: Date;
};

export abstract class BaseFileSystem {
  /**
   * Returns the stats of the object at the given key.
   * If the object does not exist, it should return a `NotFound` error.
   * @param key The key of the object to get the stats for.
   */
  public abstract stats(key: string): Promise<FileSystemResponse<FileSystemStatsResponse>>;

  /**
   * Checks if an object exists at the given key.
   * It should return `true` if the object exists, and `false` if it does not exist.
   * @param key The key of the object to check for existence.
   */
  public abstract exists(key: string): Promise<boolean>;

  /**
   * Reads the object at the given key and returns its contents as a Buffer.
   * If the object does not exist, it should return a `NotFound` error.
   * @param key The key of the object to read.
   */
  public abstract read(key: string): Promise<FileSystemResponse<Buffer>>;

  /**
   * Reads the object at the given key and returns its contents as a ReadableStream.
   * If the object does not exist, it should return a `NotFound` error.
   * @param key The key of the object to read.
   * @param config Optional configuration for reading the stream, such as start and end byte positions.
   */
  public abstract readStream(
    key: string,
    config?: {start?: number; end?: number},
  ): Promise<FileSystemResponse<NodeJS.ReadableStream>>;

  /**
   * Writes the given data to the object at the specified key with the provided MIME type.
   * If the write operation is successful, it should return `true`. If it fails, it should return `false`.
   * @param key The key of the object to write.
   * @param data The data to write.
   * @param mime The MIME type of the data.
   */
  public abstract write(key: string, data: Buffer, mime: string): Promise<boolean>;

  /**
   * Deletes the object at the given key.
   * If the deletion is successful, it should return `true` otherwise it should return `false`.
   * @param key The key of the object to delete.
   */
  public abstract delete(key: string): Promise<boolean>;
}
