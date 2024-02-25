import {join} from 'node:path';
import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {BaseFileSystem, FileSystemResponse} from '../../Utils/BaseFileSystem';

export class LocalFileSystem implements BaseFileSystem {
  private rootPath: string;

  public constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  public async stats(key: string): Promise<FileSystemResponse<{size: number}>> {
    const fullPath = join(this.rootPath, key);

    if (!(await this.exists(key))) {
      return {ok: false, error: 'NotFound'};
    }

    try {
      const stats = await fs.stat(fullPath);
      return {ok: true, response: {size: stats.size}};
    } catch (err) {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async exists(key: string): Promise<boolean> {
    const fullPath = join(this.rootPath, key);

    try {
      await fs.access(fullPath, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

  public async read(key: string): Promise<FileSystemResponse<Buffer>> {
    const fullPath = join(this.rootPath, key);

    if (!(await this.exists(key))) {
      return {ok: false, error: 'NotFound'};
    }

    try {
      const data = await fs.readFile(fullPath);
      return {ok: true, response: data};
    } catch (err) {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async readStream(
    key: string,
    config?: {start?: number; end?: number},
  ): Promise<FileSystemResponse<NodeJS.ReadableStream>> {
    const fullPath = join(this.rootPath, key);

    if (!(await this.exists(key))) {
      return {ok: false, error: 'NotFound'};
    }

    try {
      const stream = createReadStream(fullPath, {start: config?.start, end: config?.end});
      return {ok: true, response: stream};
    } catch (err) {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async write(key: string, data: Buffer): Promise<boolean> {
    const fullPath = join(this.rootPath, key);

    try {
      await fs.writeFile(fullPath, data);
      return true;
    } catch (err) {
      return false;
    }
  }

  public async delete(key: string): Promise<boolean> {
    const fullPath = join(this.rootPath, key);

    try {
      await fs.unlink(fullPath);
      return true;
    } catch (err) {
      return false;
    }
  }
}
