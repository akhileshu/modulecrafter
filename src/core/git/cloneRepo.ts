import fs from 'fs-extra';
import path from 'path';
import simpleGit from 'simple-git';
import { logMessages } from '../common/message';
import { parseGitHubUrl } from './parseGitHubUrl';
import { configPaths } from '../paths/paths';
import { confirm } from '@inquirer/prompts';
import { ConfigManager } from '../config/configManager';

export function getLocalRepoPath(gitUrl: string) {
  const parsed = parseGitHubUrl(gitUrl);
  if (!parsed) return null;
  const localRepoPath = path.join(configPaths.REPO_DIR, parsed.user, parsed.repo);
  return localRepoPath;
}

const config = ConfigManager.getInstance().getConfig();

export async function cloneRepo(gitUrl: string): Promise<boolean> {
  const commonOptions = ConfigManager.getInstance().getCommonOptions();
  const localRepoPath = getLocalRepoPath(gitUrl);
  if (!localRepoPath) return false;
  const repoExists = fs.existsSync(localRepoPath);

  let useCache =
    repoExists && commonOptions.manual
      ? await confirm({ message: 'Use cached repo?', default: true })
      : config.useCache;

  if (useCache && repoExists) {
    logMessages([{ message: 'Using cached repository (skipping clone)...', emoji: '📦' }]);
    return true;
  }
  const git = simpleGit();
  try {
    const parsed = parseGitHubUrl(gitUrl);
    await fs.remove(localRepoPath);
    logMessages([{ message: 'Cloning module repository...' }]);

    if (!parsed) return false;
    await git.clone(parsed.repoUrl, localRepoPath, ['--branch', parsed.branch]);
    
    return true;
  } catch (err) {
    logMessages([
      { message: 'Failed to clone the module repo.', level: 'error' },
      { message: `Please check if this repo exists and you have access: ${gitUrl}`, level: 'warn' },
    ]);
    await fs.remove(localRepoPath);
    return false;
  }
}
