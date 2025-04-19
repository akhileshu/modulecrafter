import { createDirAndFiles } from '../src/core/paths/paths';

createDirAndFiles().catch((err) => {
  console.error('Error during pre-build setup:', err);
  process.exit(1); // Exit with error code if setup fails
});
