import fs from 'fs-extra';
import path from 'path';
import { table } from 'table';
import { configPaths } from '../paths/paths';

export async function renderAnalytics() {
  if (!(await fs.pathExists(configPaths.ANALYTICS_PATH))) {
    console.log('No analytics data found.');
    return;
  }

  const logs = await fs.readJson(configPaths.ANALYTICS_PATH);
  const rows = [
    ['Command', 'Repo URL', 'Success', 'Time'],
    ...logs.map((log: any) => [
      log.command,
      log.repoUrl,
      log.success ? '✅' : '❌',
      new Date(log.timestamp).toLocaleString(),
    ]),
  ];

  console.log(table(rows));
}
