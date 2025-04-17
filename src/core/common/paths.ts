import path from 'path';

const TEMP_DIR = '.tmp-feature-modules';

/**
 * Absolute filesystem path to the temporary directory
 * any variable suffixing with Path shall has absolute filesystem path
 */
export const TEMP_DIR_PATH = path.resolve(process.cwd(), TEMP_DIR);
