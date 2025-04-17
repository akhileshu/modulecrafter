import { Command } from 'commander';

export interface CommonCmdOptions {
  manual?: boolean;
  verbose?: boolean;
}

export function cmdWithCommonOptions(cmd: Command) {
  return cmd
    .option('--manual', 'Enter settings interactively instead of using config file')
    .option('--verbose', 'Enable verbose logging');
}

