import { confirm } from '@inquirer/prompts';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';
import semver from 'semver';

import { getErrorMsg, logMessages } from '../../core/common/message';
import { safeReadJson } from '../../core/common/safe-read-json';

export async function promptAndSyncDependencies(pkgJsonPath: string, pkgBlobUrl: string): Promise<void> {
  const shouldReviewDependencies = await confirm({
    message: `Review dependencies using ${pkgBlobUrl}`,
    default: true,
  });

  if (!shouldReviewDependencies) return;

  const { data: remotePkgJson, success } = await safeReadJson<PackageJson>(pkgJsonPath);
  if (!success) {
    logMessages([{ message: 'Failed to read module package.json. Skipping dependency sync.', level: 'error' }]);
    return;
  }

  await syncDependencies(remotePkgJson);
}

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

async function syncDependencies(remotePkgJson: PackageJson): Promise<boolean> {
  const localPkgPath = path.join(process.cwd(), 'package.json');
  if (!(await fs.pathExists(localPkgPath))) {
    logMessages([{ message: 'No package.json found in this project.', level: 'error' }]);
    return false;
  }

  const localPkgJson = await fs.readJSON(localPkgPath);
  const versionConflicts: string[] = [];
  const prodDepsToInstall: string[] = [];
  const devDepsToInstall: string[] = [];

  const collectOutdatedDependencies = (deps: Record<string, string>, isDev: boolean) => {
    for (const [pkg, requiredVersion] of Object.entries(deps)) {
      const currentVersion = localPkgJson.dependencies?.[pkg] || localPkgJson.devDependencies?.[pkg];

      const isOutdated = !currentVersion || !semver.satisfies(semver.coerce(currentVersion) || '', requiredVersion);
      if (isOutdated) {
        versionConflicts.push(`${pkg}@${requiredVersion} (local: ${currentVersion || 'not installed'})`);
        isDev
          ? devDepsToInstall.push(`${pkg}@${requiredVersion}`)
          : prodDepsToInstall.push(`${pkg}@${requiredVersion}`);
      }
    }
  };

  collectOutdatedDependencies(remotePkgJson.dependencies ?? {}, false);
  collectOutdatedDependencies(remotePkgJson.devDependencies ?? {}, true);

  if (versionConflicts.length) {
    const userConfirmed = await confirm({
      message: `Dependency version conflicts detected:\n${versionConflicts.join('\n')}\nDo you want to continue and install them? (y/n): `,
      default: true,
    });
    if (!userConfirmed) return false;

    try {
      if (prodDepsToInstall.length) {
        execSync(`npm install ${prodDepsToInstall.join(' ')}`, {
          stdio: 'inherit',
          cwd: process.cwd(),
          timeout: 300_000,
          killSignal: 'SIGKILL',
        });
      }

      if (devDepsToInstall.length) {
        execSync(`npm install -D ${devDepsToInstall.join(' ')}`, {
          stdio: 'inherit',
          cwd: process.cwd(),
          timeout: 300_000,
          killSignal: 'SIGKILL',
        });
      }
    } catch (err) {
      logMessages([{ message: `Dependency install failed: ${getErrorMsg(err)}`, level: 'error' }]);
      return false;
    }
  }

  logMessages([{ message: `All dependencies are up to date.`, level: 'success' }]);
  return true;
}
