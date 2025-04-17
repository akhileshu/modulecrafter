/**
 * Merge CLI options with config file.
 * CLI options override config values.
 * Order matters: userConfig provides a default , options (CLI input) overrides it if specified
 */
export function mergeOptions<T extends object>(config: Partial<T>, cliOptions: Partial<T>): T {
  // todo : can we extract only required fields per cmd , as T is cmdOptionsType
  return {
    ...config,
    ...cliOptions,
  } as T;
}
