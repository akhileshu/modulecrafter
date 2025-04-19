// configManager.ts
interface Config {
  verbose: boolean;
  useCache: boolean;
  overwrite: boolean;
}

interface CommonOptions {
  manual: boolean;
  verbose: boolean;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;
  private commonOptions: CommonOptions;

  private constructor() {
    this.config = {
      verbose: false,
      useCache: true,
      overwrite: false,
    };
    this.commonOptions = {
      manual: false,
      verbose: false,
    };
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // Method to set both the config and common options
  public setOptions(options: { verbose: boolean; manual: boolean; useCache: boolean; overwrite: boolean }) {
    this.config = {
      ...this.config, // Merge current config with new options
      verbose: options.verbose,
      useCache: options.useCache,
      overwrite: options.overwrite,
    };
    this.commonOptions = {
      ...this.commonOptions, // Merge current common options with new options
      manual: options.manual,
      verbose: options.verbose, // You can override verbose in both
    };
  }

  // Method to get the current config options
  /*
  bug:
  this.config - {verbose: true, useCache: true, overwrite: false}
  */
  public getConfig(): Config {
    return this.config;
  }

  // Method to get the common options (including verbose and manual)
  public getCommonOptions(): CommonOptions {
    return this.commonOptions;
  }
}

export { ConfigManager };
