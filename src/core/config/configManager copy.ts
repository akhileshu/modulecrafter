import { CommonCmdOptions } from '../common/cmdWithCommonOptions';

/**
 * @Usage_Example
 * const configManager = ConfigManager.getInstance();
 * configManager.setOptions({ verbose: true, manual: false });

 * const options = configManager.getOptions();
 * console.log(options.verbose); // true
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private options: CommonCmdOptions = {
    verbose: false,
    manual: false,
  };

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  setOptions(options: CommonCmdOptions): void {
    this.options = { ...this.options, ...options };
  }

  getOptions(): CommonCmdOptions {
    return this.options;
  }
}
