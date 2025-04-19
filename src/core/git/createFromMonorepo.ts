import { execSync } from 'child_process';
import { cloneRepo, getLocalRepoPath } from './cloneRepo';
import fs from 'fs-extra';
import path from 'path';
import { parseGitHubUrl } from './parseGitHubUrl';
import { confirm } from '@inquirer/prompts';

export async function createFromMonorepo(gitUrl: string, name?: string) {
  const gitMeta = parseGitHubUrl(gitUrl);
  if (!gitMeta || gitMeta.type !== 'repoSubfolderUrl') return;

  const cloned = await cloneRepo(gitUrl);
  if (!cloned) return;

  const localRepoPath = getLocalRepoPath(gitUrl);
  if (!localRepoPath) return false;

  const sourcePath = path.join(localRepoPath, gitMeta.folderPath);
  if (!(await fs.pathExists(sourcePath))) {
    console.log('❌ Subfolder not found in repo.');
    return;
  }

  const targetDir = path.resolve(name || path.basename(gitMeta.folderPath));
  await fs.copy(sourcePath, targetDir);

  console.log(`📁 Copied to: ${targetDir}`);
  try {
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to install dependencies');
    return;
  }

  const open = await confirm({ message: 'Open in VSCode?', default: true });
  if (open) execSync(`code "${targetDir}"`);
}
