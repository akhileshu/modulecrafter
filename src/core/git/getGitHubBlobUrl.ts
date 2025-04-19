import path from 'path';
import { configPaths } from '../paths/paths';

/**
 *
 * localPath ex: /home/akhilesh/software-projects/feature-cli/.tmp-feature-modules/package.json
 * parsedGitInfo ex: https://github.com/akhileshu/e-commerce-app-nextjs/blob/main/package.json
 *
 */
export function getGitHubBlobUrl(
  localPath: string,
  parsedGitInfo: {
    user: string;
    repo: string;
    branch: string;
  },
): string {
  const gitHubBlobUrl = localPath.replace(
    configPaths.REPO_DIR,
    `https://github.com/${parsedGitInfo.user}/${parsedGitInfo.repo}/blob/${parsedGitInfo.branch}`,
  );
  return gitHubBlobUrl;
}
