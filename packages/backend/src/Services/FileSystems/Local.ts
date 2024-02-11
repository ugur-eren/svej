import {join} from 'node:path';
import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {BaseFileSystem, FileSystemResponse} from '../../Utils/BaseFileSystem';

export class LocalFileSystem implements BaseFileSystem {
  private rootPath: string;

  public constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  public async exists(path: string): Promise<boolean> {
    const fullPath = join(this.rootPath, path);

    try {
      await fs.access(fullPath, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

  public async read(path: string): Promise<FileSystemResponse<Buffer>> {
    const fullPath = join(this.rootPath, path);

    if (!(await this.exists(fullPath))) {
      return {ok: false, error: 'NotFound'};
    }

    try {
      const data = await fs.readFile(fullPath);
      return {ok: true, response: data};
    } catch (err) {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async readStream(path: string): Promise<FileSystemResponse<NodeJS.ReadableStream>> {
    const fullPath = join(this.rootPath, path);

    if (!(await this.exists(fullPath))) {
      return {ok: false, error: 'NotFound'};
    }

    try {
      const stream = createReadStream(fullPath);
      return {ok: true, response: stream};
    } catch (err) {
      return {ok: false, error: 'Unknown'};
    }
  }

  public async write(path: string, data: Buffer): Promise<boolean> {
    const fullPath = join(this.rootPath, path);

    try {
      await fs.writeFile(fullPath, data);
      return true;
    } catch (err) {
      return false;
    }
  }

  public async delete(path: string): Promise<boolean> {
    const fullPath = join(this.rootPath, path);

    try {
      await fs.unlink(fullPath);
      return true;
    } catch (err) {
      return false;
    }
  }
}
