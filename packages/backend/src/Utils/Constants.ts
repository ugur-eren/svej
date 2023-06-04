import path from 'path';

// Uploads folder in the root directory of the project, not the workspace
export const UPLOADS_DIR = path.join(__dirname, '..', '..', '..', '..', 'uploads');
