import {BaseFileSystem} from './Adapters/Base';
import {LocalFileSystem} from './Adapters/Local';
import {UPLOADS_DIR} from './Constants';

export const FileSystem: BaseFileSystem = new LocalFileSystem(UPLOADS_DIR);
