import path from 'path';
import { Command } from 'commander';
import confirm from '@inquirer/confirm';
import input from '@inquirer/input';
import fs from 'fs-extra';
import { configTemplate } from '../core/config/configTemplate';
import { logMessages } from '../core/common/message';
import { configPaths } from '../core/paths/paths';

export async function createConfigFile({ force = false }: { force: boolean }) {
  if (!force && (await fs.pathExists(configPaths.CONFIG_FILE_PATH))) {
    logMessages([
      {
        message: `config.mjs already exists at ${configPaths.CONFIG_FILE_PATH}. Use --force to overwrite it.`,
        level: 'success',
      },
    ]);
    return;
  }

  if (force) {
    logMessages([{ message: 'Force option enabled. Overwriting existing config.mjs file.', level: 'info' }]);
  }

  const verbose = await confirm({ message: 'Enable verbose logs?', default: false });
  const useCache = await confirm({ message: 'Enable caching?', default: true });
  const overwrite = await confirm({ message: 'Allow file overwrite?', default: false });

  const configContent = configTemplate
    .replace('{{verbose}}', String(verbose))
    .replace('{{useCache}}', String(useCache))
    .replace('{{overwrite}}', String(overwrite));

  await fs.writeFile(configPaths.CONFIG_FILE_PATH, configContent.trimStart());
  logMessages([{ message: `config.mjs has been created at ${configPaths.CONFIG_FILE_PATH}`, level: 'success' }]);
}
