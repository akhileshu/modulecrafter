import { CommonCmdOptions } from '../common/cmdWithCommonOptions';
import { ConfigManager } from '../config/configManager';
import { loadConfig } from '../config/loadConfig';

export async function setCommonOptions(options: CommonCmdOptions = {}) {
  const config = await loadConfig();
  const configManager = ConfigManager.getInstance();

  configManager.setOptions({
    ...config,
    verbose: options.verbose ?? config.verbose ?? false,
    manual: options.manual ?? false,
  });
}
