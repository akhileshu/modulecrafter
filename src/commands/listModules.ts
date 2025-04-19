import fs from 'fs-extra';
import path from 'path';
import { ListCommandOptions } from '..';

export interface ListModulesParams {
  options: ListCommandOptions;
}
/**
 *
 * this function or cmd needs improvements and not currently functional
 */
export async function listModules({ options }: ListModulesParams) {
  /*
  const { dryRun = false, useCachedRepo = false } = options;
  const cloned = await cloneRepo(useCachedRepo);
  if (!cloned) return;

  try {
    const BASE_DIR_PATH = path.join(configPaths.REPO_DIR, 'modules'); // .tmp-feature-modules/modules
    const categories = await fs.readdir(BASE_DIR_PATH);

    for (const cat of categories) {
      const CAT_DIR_PATH = path.join(BASE_DIR_PATH, cat);
      const modules = await fs.readdir(CAT_DIR_PATH);
      logMessages([{ message: `\n${cat}`, level: 'success' }]);
      for (const mod of modules) {
        const meta = await getMeta(`modules/${cat}/${mod}`);
        if (meta) {
          logMessages([{ message: `  - ${mod}: ${meta.description || ''} (meta.json exists)` }]);
        } else {
          logMessages([{ message: `  - ${mod}: No meta.json (Custom folder required)` }]);
        }
      }
    }
  } catch (err) {
    logMessages([{ message: `Error while reading module structure: ${getErrorMsg(err)}`, level: 'error' }]);
  } finally {
  }

  */
}
