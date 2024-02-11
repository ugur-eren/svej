import {createHash} from 'node:crypto';
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {BaseFileSystem, FileSystemResponse} from '../Utils/BaseFileSystem';

export class S3FileSystem implements BaseFileSystem {
  private bucket: string;
  private client: S3Client;

  public constructor({
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
  }: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  }) {
    this.bucket = bucket;

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
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      return {ok: true, response};
    } catch (err) {
      return {ok: false, error: err as Error};
    }
  }

  public async exists(path: string): Promise<boolean> {
    const response = await this.getHead(path);

    return !!(response.ok && response.response?.$metadata.httpStatusCode === 200);
  }

  public async read(path: string): Promise<FileSystemResponse<Buffer>> {
    if (!(await this.exists(path))) {
      return {ok: false, error: 'NotFound'};
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: path,
    });

    try {
      const response = await this.client.send(command);

      if (!response || !response.Body) {
        return {ok: false, error: 'Unknown'};
      }

      const byteArray = await response.Body.transformToByteArray();
      const buffer = Buffer.from(byteArray);

      return {ok: true, response: buffer};
    } catch (err) {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async readStream(path: string): Promise<FileSystemResponse<NodeJS.ReadableStream>> {
    if (!(await this.exists(path))) {
      return {ok: false, error: 'NotFound'};
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: path,
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
    } catch (err) {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async write(path: string, data: Buffer, mime: string): Promise<boolean> {
    const dataHash = createHash('md5').update(data).digest('base64');

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: path,
      Body: data,
      ContentType: mime,
      ContentMD5: dataHash,
    });

    try {
      await this.client.send(command);

      return true;
    } catch (err) {
      return false;
    }
  }

  public async delete(path: string): Promise<boolean> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: path,
    });

    try {
      await this.client.send(deleteCommand);
      return true;
    } catch (err) {
      return false;
    }
  }
}
