import { z, ZodError } from 'zod';
// @ts-ignore
import rawConfig from '../../../config.mjs'; // relative to src
import { logMessages } from '../common/message';

const configSchema = z.object({
  dryRun: z.boolean(),
  verbose: z.boolean(),
  useCache: z.boolean(),
  overwrite: z.boolean(),
  custom: z.string(),
});

function formatZodErrors(error: ZodError): string {
  return Object.entries(error.format())
    .filter(([key]) => key !== '_errors')
    .map(([key, value]: any) => `- ${key}: ${value._errors.join(', ')}`)
    .join('\n');
}

export type UserConfig = z.infer<typeof configSchema>;

export const loadConfig = () => {
  const parsed = configSchema.safeParse(rawConfig);

  if (!parsed.success) {
    const formatted = formatZodErrors(parsed.error);
    logMessages([{ message: `Invalid configuration in config.mjs:\n${formatted}`, level: 'error' }]);
    process.exit(1);
  }

  return parsed.data;
};
