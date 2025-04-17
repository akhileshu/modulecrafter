import path from 'path';
import { TEMP_DIR_PATH } from '..';

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
    TEMP_DIR_PATH,
    `https://github.com/${parsedGitInfo.user}/${parsedGitInfo.repo}/blob/${parsedGitInfo.branch}`,
  );
  return gitHubBlobUrl;
}
