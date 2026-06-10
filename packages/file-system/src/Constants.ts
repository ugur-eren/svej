import path from 'node:path';
import os from 'node:os';

export const TEMP_DIR = os.tmpdir();

// Uploads folder in the root directory of the project, not the workspace
export const UPLOADS_DIR = path.join(__dirname, '..', '..', '..', 'uploads');
