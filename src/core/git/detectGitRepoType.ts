import fs from 'fs-extra';
import path from 'path';

type GitRepoStructure = 'standaloneProject' | 'repoSubfolder' | 'monorepoWorkspace';

/**
 * example :
 * 
 * https://github.com/akhileshu/e-commerce-app-nextjs/tree/main/src/app/admin - repo subfolder
 * https://github.com/akhileshu/feature-modules/tree/main/modules/nextjs/auth/next-auth - monoreppo workspace
 * https://github.com/akhileshu/akhilesh-portfolio  - standalone project
 */
export const detectClonedRepoStructure = async (
  clonedModulePath: string,
  gitHubUrlType: 'repoSubfolderUrl' | 'fullRepoUrl',
): Promise<GitRepoStructure> => {
  const packageJsonPath = path.join(clonedModulePath, 'package.json');
  const hasPackageJson = await fs.pathExists(packageJsonPath);

  if (!hasPackageJson) return 'repoSubfolder';
  if (gitHubUrlType === 'repoSubfolderUrl') return 'monorepoWorkspace';
  return 'standaloneProject';
};
