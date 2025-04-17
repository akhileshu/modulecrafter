export const configTemplate = `
// config.mjs

/**
 * @typedef {Object} Config
 * @property {boolean} dryRun
 * @property {boolean} verbose
 * @property {boolean} useCache
 * @property {boolean} overwrite
 * @property {string} custom - Path to custom folder
 */

/** @type {Config} */
const config = {
  dryRun: {{dryRun}},
  verbose: {{verbose}},
  useCache: {{useCache}},
  overwrite: {{overwrite}},
  custom: '{{custom}}',
};

export default config;
`;
