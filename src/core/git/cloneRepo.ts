import fs from 'fs-extra';
import path from 'path';
import simpleGit from 'simple-git';
import { logMessages } from '../common/message';
import { parseGitHubUrl } from './parseGitHubUrl';
import { TEMP_DIR_PATH } from '../common/paths';

export async function removeTempDir() {
  await fs.remove(TEMP_DIR_PATH);
}

export async function cloneRepo(repoUrl: string, useCachedRepo?: boolean): Promise<boolean> {
  const repoExists = fs.existsSync(TEMP_DIR_PATH);

  if (useCachedRepo && repoExists) {
    logMessages([{ message: 'Using cached repository (skipping clone)...', emoji: '📦' }]);
    return true;
  }
  const git = simpleGit();
  try {
    await removeTempDir();
    logMessages([{ message: 'Cloning module repository...' }]);
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) return false;
    await git.clone(parsed.repoUrl, TEMP_DIR_PATH, ['--branch', parsed.branch]);
    return true;
  } catch (err) {
    logMessages([
      { message: 'Failed to clone the module repo.', level: 'error' },
      { message: `Please check if this repo exists and you have access: ${repoUrl}`, level: 'warn' },
    ]);
    await removeTempDir();
    return false;
  }
}

