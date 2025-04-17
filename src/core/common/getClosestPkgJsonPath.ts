import path from 'path';
import fs from 'fs-extra';

export async function getClosestPackageJsonPath(startDir: string, stopAtDir: string): Promise<string | null> {
  let currentDir = path.resolve(startDir);
  const rootDir = path.resolve(stopAtDir);

  while (currentDir.startsWith(rootDir)) {
    const pkgPath = path.join(currentDir, 'package.json');
    if (await fs.pathExists(pkgPath)) return pkgPath;

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break; // reached root of filesystem
    currentDir = parentDir;
  }

  return null;
}
