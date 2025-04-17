import path from 'path';
import { Command } from 'commander';
import confirm from '@inquirer/confirm';
import input from '@inquirer/input';
import fs from 'fs-extra';
import { configTemplate } from '../core/config/configTemplate';
import { logMessages } from '../core/common/message';

const CONFIG_PATH = path.resolve(process.cwd(), 'config.mjs');

export function initCommand(program: Command) {
  program
    .command('init')
    .description('Create a config.mjs file if it does not exist')
    .action(async () => {
      if (await fs.pathExists(CONFIG_PATH)) {
        logMessages([{ message: 'config.mjs already exists.', level: 'success' }]);
        return;
      }

      const dryRun = await confirm({ message: 'Enable dry run?', default: true });
      const verbose = await confirm({ message: 'Enable verbose logs?', default: false });
      const useCache = await confirm({ message: 'Enable caching?', default: true });
      const overwrite = await confirm({ message: 'Allow file overwrite?', default: false });
      const custom = await input({ message: 'Path to custom folder?', default: './modules' });

      const configContent = configTemplate
        .replace('{{dryRun}}', String(dryRun))
        .replace('{{verbose}}', String(verbose))
        .replace('{{useCache}}', String(useCache))
        .replace('{{overwrite}}', String(overwrite))
        .replace('{{custom}}', custom);

      await fs.writeFile(CONFIG_PATH, configContent.trimStart());
      logMessages([{ message: 'config.mjs has been created.', level: 'success' }]);
    });
}
