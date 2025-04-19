import { describe, it, vi, beforeEach, afterEach, expect, Mock } from 'vitest';
import { listModules } from '../commands/listModules';
import fs from 'fs-extra';
/*

vi.mock('fs-extra');
vi.mock('../lib');

describe('listModules', () => {
  const mockLogMessages = vi.fn();
  const fakeModulesStructure = {
    nextjs: {
      auth: { description: 'Authentication module' },
      payments: { description: 'Payments module' },
    },
    react: {
      cart: { description: 'Shopping cart feature' },
    },
  };

  beforeEach(() => {
    vi.spyOn(lib, 'logMessages').mockImplementation(mockLogMessages);
    vi.spyOn(lib, 'cloneRepo').mockResolvedValue(true);

    vi.spyOn(fs, 'readdir').mockImplementation(async (dirPath: string) => {
      if (dirPath.endsWith('/modules')) return Object.keys(fakeModulesStructure);
      for (const cat in fakeModulesStructure) {
        if (dirPath.endsWith(`/modules/${cat}`)) return Object.keys(fakeModulesStructure[cat]);
      }
      return [];
    });

    vi.spyOn(lib, 'getMeta').mockImplementation(async (modulePath: string) => {
      const [_, cat, mod] = modulePath.split('/');
      return fakeModulesStructure[cat]?.[mod] || null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockLogMessages.mockClear();
  });

  it('should list all modules and their descriptions', async () => {
    await listModules({ options: { dryRun: false, useCachedRepo: false } });

    expect(lib.cloneRepo).toHaveBeenCalled();
    expect(mockLogMessages).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('nextjs') }),
        expect.objectContaining({ message: expect.stringContaining('auth: Authentication module') }),
        expect.objectContaining({ message: expect.stringContaining('payments: Payments module') }),
        expect.objectContaining({ message: expect.stringContaining('react') }),
        expect.objectContaining({ message: expect.stringContaining('cart: Shopping cart feature') }),
      ]),
    );
  });

  it('should log an error when reading fails', async () => {
    (fs.readdir as unknown as Mock).mockRejectedValueOnce(new Error('Failed to read'));

    await listModules({ options: { dryRun: false, useCachedRepo: false } });

    expect(mockLogMessages).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining('Error while reading module structure'),
          level: 'error',
        }),
      ]),
    );
  });
});

*/