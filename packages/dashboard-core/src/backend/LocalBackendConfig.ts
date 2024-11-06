import path from 'path';
import fs from 'fs';

// Get the current file's directory
const rootDir = process.cwd();

const filePathConfig = path.join(rootDir, 'config/core.env.json');
const localBackendConfig = JSON.parse(fs.readFileSync(filePathConfig, 'utf-8'));

export { localBackendConfig };
