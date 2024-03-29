import {BaseFileSystem} from '../Utils/BaseFileSystem';
import {UPLOADS_DIR} from '../Utils/Constants';
import {LocalFileSystem} from './FileSystems/Local';

export {FileSystemErrors, FileSystemError, FileSystemResponse} from '../Utils/BaseFileSystem';

export const fileSystem: BaseFileSystem = new LocalFileSystem(UPLOADS_DIR);
