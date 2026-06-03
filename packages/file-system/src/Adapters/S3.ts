import {createHash} from 'node:crypto';
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {BaseFileSystem, FileSystemResponse} from './Base';

/**
 * Adapter for AWS S3 that implements the BaseFileSystem interface.
 * This class provides methods to interact with S3, such as reading, writing, and deleting files.
 * It uses the @aws-sdk/client-s3 library to communicate with S3.
 * Note: Ensure that the appropriate permissions and credentials are set up for the S3 bucket being accessed.
 * This implementation assumes that the bucket already exists and that the necessary AWS credentials are configured for authentication.
 */
export class S3FileSystem implements BaseFileSystem {
  private bucketName: string;
  private client: S3Client;

  public constructor({
    bucketName,
    region,
    accessKeyId,
    secretAccessKey,
  }: {
    bucketName: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  }) {
    this.bucketName = bucketName;

    this.client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  private async getHead(key: string) {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      return {ok: true, response};
    } catch (err) {
      return {ok: false, error: err as Error};
    }
  }

  private checkExists(response: Awaited<ReturnType<typeof this.getHead>>) {
    return response.ok && response.response?.$metadata.httpStatusCode === 200;
  }

  public async stats(key: string): Promise<FileSystemResponse<{size: number}>> {
    const response = await this.getHead(key);

    if (!this.checkExists(response)) {
      return {ok: false, error: 'NotFound'};
    }

    const size = response.response?.ContentLength || 0;

    return {
      ok: true,
      response: {
        size,
      },
    };
  }

  public async exists(key: string): Promise<boolean> {
    const response = await this.getHead(key);

    return this.checkExists(response);
  }

  public async read(key: string): Promise<FileSystemResponse<Buffer>> {
    if (!(await this.exists(key))) {
      return {ok: false, error: 'NotFound'};
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const response = await this.client.send(command);

      if (!response || !response.Body) {
        return {ok: false, error: 'Unknown'};
      }

      const byteArray = await response.Body.transformToByteArray();
      const buffer = Buffer.from(byteArray);

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

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Range: config ? `bytes=${config.start || 0}-${config.end || ''}` : undefined,
    });

    try {
      const response = await this.client.send(command);

      if (!response || !response.Body) {
        return {ok: false, error: 'Unknown'};
      }

      if ('pipe' in response.Body && typeof response.Body.pipe === 'function') {
        return {ok: true, response: response.Body};
      }

      return {ok: false, error: 'Unknown'};
    } catch {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async write(key: string, data: Buffer, mime: string): Promise<boolean> {
    const dataHash = createHash('md5').update(new Uint8Array(data)).digest('base64');

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: data,
      ContentType: mime,
      ContentMD5: dataHash,
    });

    try {
      await this.client.send(command);

      return true;
    } catch {
      return false;
    }
  }

  public async delete(key: string): Promise<boolean> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.client.send(deleteCommand);
      return true;
    } catch {
      return false;
    }
  }
}
