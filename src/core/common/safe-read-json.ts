import fs from 'fs-extra';

export async function safeReadJson<T = any>(
  filePath: string,
  defaultValue: T = {} as T,
): Promise<{ data: T; success: boolean }> {
  try {
    if (await fs.pathExists(filePath)) {
      const data = await fs.readJson(filePath);
      return { data, success: true };
    }
  } catch (err) {
    // Optional: log the error
  }

  return { data: defaultValue, success: false };
}
