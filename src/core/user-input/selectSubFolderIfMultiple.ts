import fs from 'fs-extra';
import path from 'path';
import { select } from '@inquirer/prompts';

/**
 * If multiple subfolders exist, prompts user to choose one.
 * If only one, returns it. If none, returns null.
 */
export async function selectSubFolderIfMultiple(basePath: string): Promise<string | null> {
  const allItems = await fs.readdir(basePath);
  const subFolders = allItems.filter((item) => fs.statSync(path.join(basePath, item)).isDirectory());

  if (subFolders.length === 0) return null;
  if (subFolders.length === 1) return path.join(basePath, subFolders[0]);

  const choice = await select({
    message: 'Multiple folders found. Choose one to inject',
    choices: subFolders.map((f) => ({ name: f, value: path.join(basePath, f) })),
  });

  return choice;
}
