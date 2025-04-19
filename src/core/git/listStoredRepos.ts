import fs from 'fs-extra';
import path from 'path';
import { configPaths } from '../paths/paths';

export async function listStoredRepos() {
  if (!(await fs.pathExists(configPaths.REPO_DIR))) {
    console.log('No repos cached yet.');
    return;
  }

  const users = await fs.readdir(configPaths.REPO_DIR);
  const table = [];

  for (const user of users) {
    const reposPath = path.join(configPaths.REPO_DIR, user);
    const repos = await fs.readdir(reposPath);

    for (const repo of repos) {
      const fullPath = path.join(reposPath, repo);
      const stats = await fs.stat(fullPath);
      table.push([`${user}/${repo}`, new Date(stats.mtime).toLocaleString()]);
    }
  }

  console.log('\nStored GitHub Repos:');
  console.table(table.map(([name, time]) => ({ Repo: name, 'Last Modified': time })));
}
