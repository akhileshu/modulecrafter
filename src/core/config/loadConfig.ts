import { z, ZodError } from 'zod';

import { logMessages } from '../common/message';
import { configPaths } from '../paths/paths';


const configSchema = z.object({
  verbose: z.boolean(),
  useCache: z.boolean(),
  overwrite: z.boolean(),
});

function formatZodErrors(error: ZodError): string {
  return Object.entries(error.format())
    .filter(([key]) => key !== '_errors')
    .map(([key, value]: any) => `- ${key}: ${value._errors.join(', ')}`)
    .join('\n');
}

export type UserConfig = z.infer<typeof configSchema>;

export const loadConfig = async () => {
  const rawConfig = await import(configPaths.CONFIG_FILE_PATH);
  // const parsed = configSchema.safeParse(rawConfig.default.config); // for named export
  const parsed = configSchema.safeParse(rawConfig.default); // for default export

  if (!parsed.success) {
    const formatted = formatZodErrors(parsed.error);
    logMessages([{ message: `Invalid configuration in config.mjs:\n${formatted}`, level: 'error' }]);
    process.exit(1);
  }

  return parsed.data;
};

