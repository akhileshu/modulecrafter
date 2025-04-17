#!/usr/bin/env node
import { Command } from 'commander';
import { addModule } from './commands/add';
import { initCommand } from './commands/initCommand';
import { listModules } from './commands/listModules';
import { loadConfig } from './core/config/loadConfig';
import { cmdWithCommonOptions } from './core/common/cmdWithCommonOptions';
import { mergeOptions } from './core/common/mergeOptions';

const program = new Command();
const userConfig = loadConfig();

export function createCliCommand(name: string, desc: string) {
  return cmdWithCommonOptions(program.command(name).description(desc));
}

program.name('feature-cli').description('CLI to inject feature modules into projects').version('1.0.0');

export interface ListCommandOptions {
  dryRun?: boolean;
  verbose?: boolean;
  useCachedRepo?: boolean;
}

createCliCommand('list', 'List available modules').action(async (options: ListCommandOptions) => {
  const finalOptions = mergeOptions<ListCommandOptions>(userConfig, options);
  await listModules({ options: finalOptions });
});

initCommand(program);
addModule(program);

// parse cli args and pass them to .action() cb
program.parse(process.argv);
