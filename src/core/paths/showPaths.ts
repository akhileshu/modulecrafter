import { configPaths } from './paths';

export function showPaths() {
  console.log('Configured Paths:');
  console.log(`Analytics Path: ${configPaths.ANALYTICS_PATH}`);
  console.log(`Config File Path: ${configPaths.CONFIG_FILE_PATH}`);
  console.log(`Repos Directory: ${configPaths.REPO_DIR}`);
}
