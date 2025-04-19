import { select } from '@inquirer/prompts';
import fs from 'fs-extra';
import path from 'path';
import { configPaths } from '../paths/paths';

const REPO_URL = 'https://github.com/akhileshu/feature-modules.git';

/**
 *
 * @returns
 * ex:`modules/${framework}/${category}/${module}`
 * "modules/nextjs/auth/nextauth"
 */
export async function getModulePath() {
  const BASE_DIR_PATH = path.join(configPaths.REPO_DIR, 'modules');

  // 1. Ask for framework
  const framework = await select({
    message: 'Choose a framework/technology',
    choices: await fs.readdir(BASE_DIR_PATH).then((items) => items.map((item) => ({ name: item, value: item }))),
  });

  const frameworkPath = path.join(BASE_DIR_PATH, framework);

  // 2. Ask for category inside framework
  const categories = await fs.readdir(frameworkPath);
  const category = await select({
    message: 'Choose a category',
    choices: categories.map((cat) => ({ name: cat, value: cat })),
  });

  const categoryPath = path.join(frameworkPath, category);

  // 3. Ask for module inside category
  const modules = await fs.readdir(categoryPath);
  const module = await select({
    message: 'Choose a module',
    choices: modules.map((mod) => ({ name: mod, value: mod })),
  });

  const modulePath = path.join(configPaths.REPO_DIR, `modules/${framework}/${category}/${module}`); // .tmp-feature-modules/modules
  return modulePath;
}
