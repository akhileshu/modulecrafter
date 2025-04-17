import { Command } from 'commander';
import { confirm } from '@inquirer/prompts';
import fs from 'fs-extra';
import path from 'path';
import { getClosestPackageJsonPath } from '../../core/common/getClosestPkgJsonPath';
import { selectSubFolderIfMultiple } from '../../core/user-input/selectSubFolderIfMultiple';
import { getGitHubBlobUrl } from '../../core/git/getGitHubBlobUrl';
import { parseGitHubUrl } from '../../core/git/parseGitHubUrl';
import { copyClonedModuleToProject } from './copyClonedModuleToProject';
import { promptAndSyncDependencies } from './syncDependencies';
import { detectClonedRepoStructure } from '../../core/git/detectGitRepoType';
import { CommonCmdOptions } from '../../core/common/cmdWithCommonOptions';
import { createCliCommand } from '../..';
import { cloneRepo } from '../../core/git/cloneRepo';
import { TEMP_DIR_PATH } from '../../core/common/paths';

type AddModuleOptions = CommonCmdOptions & {};
export interface AddModuleParams {
  gitUrl: string;
}

export function addModule(program: Command) {
  createCliCommand('add', 'Add a module to the project')
    .argument('<git-url>', 'GitHub repository URL or subfolder URL')
    .action(async (gitUrl: string, options: AddModuleOptions) => {
      try {
        await importModuleToLocalProject(gitUrl);
      } catch (error) {
        console.error(error);
      }
    });
}

async function importModuleToLocalProject(gitUrl: string) {
  const gitMeta = parseGitHubUrl(gitUrl);
  if (!gitMeta) return;

  const isCloned = await cloneRepo(gitUrl, false);
  if (!isCloned) return;

  const localModulePath = path.join(TEMP_DIR_PATH, gitMeta.type === 'fullRepoUrl' ? '' : gitMeta.folderPath);
  if (!(await fs.pathExists(localModulePath))) return;

  const projectType = await detectClonedRepoStructure(localModulePath, gitMeta.type);

  if (projectType === 'monorepoWorkspace' || projectType === 'standaloneProject') {
    await handleMonorepo(localModulePath, gitMeta);
  } else {
    await handleRepoSubFolder(localModulePath, gitMeta, gitUrl);
  }
}

async function handleMonorepo(localModulePath: string, gitMeta: NonNullable<ReturnType<typeof parseGitHubUrl>>) {
  const folderToCopy = await selectSubFolderIfMultiple(localModulePath);
  if (!folderToCopy) return;

  const isCopied = await copyClonedModuleToProject({ sourcePath: folderToCopy });
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

  const isCopied = await copyClonedModuleToProject({ sourcePath: localModulePath });
  if (!isCopied) return;

  const pkgJsonPath = await getClosestPackageJsonPath(localModulePath, TEMP_DIR_PATH);
  if (!pkgJsonPath) return;

  const pkgBlobUrl = getGitHubBlobUrl(pkgJsonPath, gitMeta);
  promptAndSyncDependencies(pkgJsonPath, pkgBlobUrl);
}
