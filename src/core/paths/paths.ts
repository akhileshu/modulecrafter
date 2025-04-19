import path from 'path';
import os from 'node:os';
import fs from 'fs-extra';
import { Analytic } from '../analytics/logAnalytics';
import { defaultConfig } from '../config/default-config';

/**
 * any variable suffixing with Path shall has absolute filesystem path
 */

const APP_NAME = 'modulecrafter-cli';

const CONFIG_DIR = path.join(os.homedir(), '.config', APP_NAME);
const ANALYTICS_PATH = path.join(CONFIG_DIR, 'analytics.json');
// const CONFIG_FILE_PATH = path.join(CONFIG_DIR, 'config.json');
const CONFIG_FILE_PATH = path.join(CONFIG_DIR, 'config.mjs');
const REPO_DIR = path.join(os.homedir(), APP_NAME, 'repos');

export const configPaths = {
  ANALYTICS_PATH,
  CONFIG_FILE_PATH,
  REPO_DIR,
};

/**
 * Call the function to ensure directories and files exist before starting the main process
 */
export async function createDirAndFiles() {
  if (!(await fs.pathExists(REPO_DIR))) {
    fs.mkdirSync(REPO_DIR, { recursive: true });
    console.log(`Repo directory created: ${REPO_DIR}`);
  }
  if (!(await fs.pathExists(CONFIG_DIR))) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
    console.log(`Config directory created: ${CONFIG_DIR}`);
  }
  if (!(await fs.pathExists(CONFIG_FILE_PATH))) {
    await fs.writeFile(CONFIG_FILE_PATH, defaultConfig);
    console.log(`Config file created: ${CONFIG_FILE_PATH}`);
  }
  if (!(await fs.pathExists(ANALYTICS_PATH))) {
    const defaultAnalytics: Analytic[] = [];
    await fs.writeJson(ANALYTICS_PATH, defaultAnalytics, { spaces: 2 });
    console.log(`Analytics file created: ${ANALYTICS_PATH}`);
  }

  console.log(configPaths);
}
