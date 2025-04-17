// utils/copyModule.ts
import { confirm } from '@inquirer/prompts';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { logMessages } from '../../core/common/message';
import { TEMP_DIR_PATH } from '../../core/common/paths';

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

async function revertCopiedFiles(paths: string[]) {
  for (const filePath of paths) {
    await fs.remove(filePath);
    logMessages([{ message: `Reverted: ${filePath}`, level: 'warn' }]);
  }
  logMessages([{ message: 'Module copy reverted', level: 'info' }]);
}

interface CopyOptions {
  sourcePath: string;
  targetPath?: string;
}

export async function copyClonedModuleToProject({
  sourcePath,
  targetPath = path.join(process.cwd(), 'project'),
}: CopyOptions): Promise<boolean> {
  const relativeFiles = getAllRelativeFiles(sourcePath, sourcePath);
  const copiedFilePaths: string[] = [];

  for (const relativeFile of relativeFiles) {
    const sourceFilePath = path.join(sourcePath, relativeFile);
    const targetBase = sourcePath.replace(TEMP_DIR_PATH, '');
    const targetFilePath = path.join(targetPath, targetBase, relativeFile);

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
