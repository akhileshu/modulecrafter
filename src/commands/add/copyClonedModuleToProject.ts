// utils/copyModule.ts
import { confirm } from '@inquirer/prompts';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { logMessages } from '../../core/common/message';
import { configPaths } from '../../core/paths/paths';
import { getLocalRepoPath } from '../../core/git/cloneRepo';
import { parseGitHubUrl } from '../../core/git/parseGitHubUrl';

function getAllRelativeFiles(dir: string, baseDir: string): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const relativePath = path.relative(baseDir, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getAllRelativeFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

function shouldExclude(filePath: string, excludePatterns: string[] = []): boolean {
  const normalizedPath = path.normalize(filePath);
  return excludePatterns.some((pattern) => normalizedPath.startsWith(path.normalize(pattern)));
}

function generateUniqueHash(str: string): string {
  const salt = crypto.randomBytes(4).toString('hex'); // random 8-char salt
  return crypto
    .createHash('md5')
    .update(str + salt)
    .digest('hex')
    .slice(0, 6);
}

/**
 *  we sometimes left we empty folders after reverting , but thats ok for now
 */
async function revertCopiedFiles(paths: string[]) {
  for (const filePath of paths) {
    await fs.remove(filePath);
    logMessages([{ message: `Reverted: ${filePath}`, level: 'warn' }]);
  }
  logMessages([{ message: 'Module copy reverted', level: 'info' }]);
}

interface CopyOptions {
  sourceDir: string;
  targetDir?: string;
  gitUrl: string;
}

/**
 * 
 * todo :
 * 
 * need to better handle dir , paths for copy in case of standalone / monorepo workspace / repo subfolder
 */
export async function copyClonedModuleToProject({
  sourceDir, //"/home/akhilesh/modulecrafter-cli/repos/akhileshu/akhilesh-portfolio/src/components/app"
  targetDir = path.join(process.cwd(), 'projects'),
  gitUrl,
}: CopyOptions): Promise<boolean> {
  const gitMeta = parseGitHubUrl(gitUrl);
  if (!gitMeta) return false;
  if (!(await fs.pathExists(sourceDir))) {
    console.error(`Source directory does not exist: ${sourceDir}`);
    return false;
  }
  const parentDir = path.dirname(sourceDir); // one level above sourceDir
  const relativeFiles = getAllRelativeFiles(sourceDir, parentDir);

  // const relativeFiles = getAllRelativeFiles(sourceDir, parentDir); // all paths relative to components dir
  if (relativeFiles.length === 0) {
    console.warn(`No files found in source directory: ${sourceDir}`);
    return false;
  }
  const copiedFilePaths: string[] = [];
  const localRepoPath = getLocalRepoPath(gitUrl);
  if (!localRepoPath) return false;

  for (const relativeFile of relativeFiles) {
    const sourceFilePath = path.join(parentDir, relativeFile); //(.../components , app/...)
    /*
    const sourceFilePath = path.join(sourceDir, relativeFile); //"/home/akhilesh/modulecrafter-cli/repos/akhileshu/akhilesh-portfolio/src/components/app/ExpandableText.tsx"
    const targetBaseDir2 = sourceDir.replace(localRepoPath, ''); //"/src/components/app"
    const targetBaseDir3 = path.relative(
      path.join(localRepoPath, gitMeta.type === 'repoSubfolderUrl' ? gitMeta.folderPath : ''),
      sourceDir,
    ); //"/src/components/app"
    const targetBaseDir = path.relative(localRepoPath, sourceDir); //"/src/components/app"
    const targetFilePath = path.join(targetDir, targetBaseDir, relativeFile); //"/home/akhilesh/software-projects/feature-cli/src/components/app/ExpandableText.tsx"
*/
    const targetFilePath = path.join(targetDir, relativeFile);
    await fs.ensureDir(path.dirname(targetFilePath));

    if (await fs.pathExists(targetFilePath)) {
      const hash = generateUniqueHash(relativeFile);
      const { dir, name, ext } = path.parse(targetFilePath);
      const conflictPath = path.join(dir, `${name}__${hash}${ext}`);

      await fs.copy(sourceFilePath, conflictPath);
      copiedFilePaths.push(conflictPath);

      logMessages([
        {
          message: `Conflict: ${relativeFile} already exists. Copied as ${path.basename(conflictPath)}`,
          level: 'warn',
        },
      ]);
    } else {
      await fs.copy(sourceFilePath, targetFilePath);
      copiedFilePaths.push(targetFilePath);

      logMessages([{ message: `Copied: ${relativeFile}` }]);
    }
  }

  if (copiedFilePaths.length === 0) {
    logMessages([{ message: 'No files copied.' }]);
    return false;
  }

  logMessages([{ message: 'Copied files:' }, ...copiedFilePaths.map((file) => ({ message: `  ${file}` }))]);

  const userAcceptedChanges = await confirm({ message: 'Do you want to keep these changes?' });

  if (!userAcceptedChanges) {
    await revertCopiedFiles(copiedFilePaths);
    return false;
  }

  logMessages([{ message: 'Module copy completed', level: 'success' }]);
  return true;
}
