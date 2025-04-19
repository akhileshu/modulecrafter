#!/usr/bin/env node
import { Command } from 'commander';
import { AddModuleOptions, importModuleToLocalProject } from './commands/add';
import { createConfigFile } from './commands/initCommand';
import { renderAnalytics } from './core/analytics/renderAnalytics';
import { cmdWithCommonOptions, CommonCmdOptions } from './core/common/cmdWithCommonOptions';
import { showPaths } from './core/paths/showPaths';
import { listStoredRepos } from './core/git/listStoredRepos';
import { createFromMonorepo } from './core/git/createFromMonorepo';
import { loadConfig } from './core/config/loadConfig';
import { ConfigManager } from './core/config/configManager';
import { setCommonOptions } from './core/config/setCommonOptions';

const program = new Command();

const configManager = ConfigManager.getInstance();

export function createCliCommand(name: string, desc: string) {
  return cmdWithCommonOptions(program.command(name).description(desc));
}

program.name('modcraft').description('CLI to inject feature modules into projects').version('1.0.0');

export interface ListCommandOptions {
  verbose?: boolean;
  useCachedRepo?: boolean;
}
interface InitCommandOptions {
  force: boolean;
}
// createCliCommand('list', 'List available modules').action(async (options: ListCommandOptions) => {
//   const userConfig = await loadConfig();
//   const finalOptions = mergeOptions<ListCommandOptions>(userConfig, options);
//   await listModules({ options: finalOptions });
// });

createCliCommand('analytics', 'Show CLI usage analytics').action(async () => {
  await renderAnalytics();
});

createCliCommand('show-repos', 'List all cached GitHub repos').action(async () => {
  await listStoredRepos();
});
createCliCommand('show-paths', 'Show all the configured paths for the app').action(async () => {
  showPaths();
});

createCliCommand('init', 'Setup config.mjs file')
  .option('--force', 'Overwrite config.mjs if it already exists')
  .action(async (options: InitCommandOptions) => {
    await createConfigFile({ force: options.force });
  });

createCliCommand('add', 'Add a module to the project')
  .argument('<git-url>', 'GitHub repository URL or subfolder URL')
  .action(async (gitUrl: string, options: AddModuleOptions) => {
    await setCommonOptions(options);
    
    // const effectiveOptions: AddModuleOptions = {
    //   ...options,
    //   verbose: options.verbose ?? config.verbose ?? false,
    // };
    // await importModuleToLocalProject({ gitUrl, options: effectiveOptions, useCache: config.useCache });
    await importModuleToLocalProject({ gitUrl});
  });

createCliCommand('create-from', 'Extract project from monorepo workspace')
  .argument('<url>', 'GitHub URL of the monorepo subfolder')
  .argument('[name]', 'Optional project name')
  .action(async (url, name, options: CommonCmdOptions) => {
    await setCommonOptions(options);
    await createFromMonorepo(url, name);
  });

// parse cli args and pass them to .action() cb
program.parse(process.argv);
