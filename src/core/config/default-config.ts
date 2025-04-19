export const defaultConfig = `
// config.mjs

/**
 * @typedef {Object} Config
 * @property {boolean} verbose - Enable detailed logs during CLI operations
 * @property {boolean} useCache - Reuse previously cloned repositories from local cache instead of cloning again
 * @property {boolean} overwrite - Overwrite existing files in project if a file with the same name exists
 */

/** @type {Config} */
const config = {
  verbose: false,
  useCache: true,
  overwrite: false,
};

export default config;

`;