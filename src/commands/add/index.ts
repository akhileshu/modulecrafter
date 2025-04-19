import { confirm } from '@inquirer/prompts';
import fs from 'fs-extra';
import path from 'path';
import { CommonCmdOptions } from '../../core/common/cmdWithCommonOptions';
import { getClosestPackageJsonPath } from '../../core/common/getClosestPkgJsonPath';
import { cloneRepo, getLocalRepoPath } from '../../core/git/cloneRepo';
import { detectClonedRepoStructure } from '../../core/git/detectGitRepoType';
import { getGitHubBlobUrl } from '../../core/git/getGitHubBlobUrl';
import { parseGitHubUrl } from '../../core/git/parseGitHubUrl';
import { selectSubFolderIfMultiple } from '../../core/user-input/selectSubFolderIfMultiple';
import { copyClonedModuleToProject } from './copyClonedModuleToProject';
import { promptAndSyncDependencies } from './syncDependencies';

import { logAnalytics } from '../../core/analytics/logAnalytics';
import { logMessages } from '../../core/common/message';
import { configPaths } from '../../core/paths/paths';

export type AddModuleOptions = CommonCmdOptions & {};

export interface ImportModuleParams {
  gitUrl: string;
  // options: AddModuleOptions;
  // useCache: boolean;
}

// export async function importModuleToLocalProject({ gitUrl, options, useCache }: ImportModuleParams): Promise<void> {
export async function importModuleToLocalProject({ gitUrl }: ImportModuleParams): Promise<void> {
  const gitMeta = parseGitHubUrl(gitUrl);
  if (!gitMeta) {
    /*
    This creates an Error object but doesn’t have a stack trace yet if it hasn't been thrown.
    Fix: Throw and catch to capture full error

    function createError(msg: string): Error {
      try {
        throw new Error(msg);
      } catch (e) {
        return e as Error;
      }
    }

    error: createError('parseGitHubUrl failure')
    */
    logMessages([
      { message: `Failed to parse GitHub URL: ${gitUrl}`, level: 'error', error: new Error('parseGitHubUrl failure') },
    ]);
    return;
  }

  const isCloned = await cloneRepo(gitUrl);
  if (!isCloned) return;

  const localRepoPath = getLocalRepoPath(gitUrl);
  if (!localRepoPath) return;

  const localModulePath = path.join(localRepoPath, gitMeta.type === 'fullRepoUrl' ? '' : gitMeta.folderPath);
  if (!(await fs.pathExists(localModulePath))) return;

  const projectType = await detectClonedRepoStructure(localModulePath, gitMeta.type);

  if (projectType === 'monorepoWorkspace' || projectType === 'standaloneProject') {
    await handleMonorepo(localModulePath, gitMeta, gitUrl);
  } else {
    await handleRepoSubFolder(localModulePath, gitMeta, gitUrl);
  }
}

async function handleMonorepo(
  localModulePath: string,
  gitMeta: NonNullable<ReturnType<typeof parseGitHubUrl>>,
  gitUrl: string,
) {
  const folderToCopy = await selectSubFolderIfMultiple(localModulePath);
  if (!folderToCopy) return;

  //todo : using process.cwd() in deleted directory caused issues , need better error handling
  const isCopied = await copyClonedModuleToProject({ sourceDir: folderToCopy, targetDir: process.cwd(), gitUrl });
  if (!isCopied) return;

  const pkgJsonPath = path.join(localModulePath, 'package.json');
  const pkgBlobUrl = getGitHubBlobUrl(pkgJsonPath, gitMeta);
  promptAndSyncDependencies(pkgJsonPath, pkgBlobUrl);
}

async function handleRepoSubFolder(
  localModulePath: string,
  gitMeta: NonNullable<ReturnType<typeof parseGitHubUrl>>,
  gitUrl: string,
) {
  const shouldContinue = await confirm({
    message: `The URL points to a subfolder of a repo. Do you want to copy everything from ${gitUrl}?`,
    default: false,
  });
  if (!shouldContinue) return;

  const targetDir =
    gitMeta.type === 'repoSubfolderUrl' ? path.dirname(path.join(process.cwd(), gitMeta.folderPath)) : process.cwd();
  const isCopied = await copyClonedModuleToProject({ sourceDir: localModulePath, targetDir: targetDir, gitUrl });
  if (!isCopied) return;

  const pkgJsonPath = await getClosestPackageJsonPath(localModulePath, configPaths.REPO_DIR);
  if (!pkgJsonPath) return;

  const pkgBlobUrl = getGitHubBlobUrl(pkgJsonPath, gitMeta);

  await logAnalytics({
    command: 'add',
    repoUrl: gitUrl,
    timestamp: Date.now(),
    success: true,
    errorMessage: null,
  });

  promptAndSyncDependencies(pkgJsonPath, pkgBlobUrl);
}
