import {Config} from '@svej/common';
import multer from 'multer';

export default multer({storage: multer.memoryStorage(), limits: {fileSize: Config.maxFileSize}});
