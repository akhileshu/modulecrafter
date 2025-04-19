import fs from 'fs-extra';
import path from 'path';
import { configPaths } from '../paths/paths';

export type Analytic = {
  command: string;
  repoUrl: string;
  timestamp: number;
  success: boolean;
  errorMessage: string | null;
};

export async function logAnalytics(data: Analytic) {
  const logs = (await fs.readJson(configPaths.ANALYTICS_PATH).catch(() => [])) as any[];
  logs.push(data);
  await fs.writeJson(configPaths.ANALYTICS_PATH, logs, { spaces: 2 });
}
