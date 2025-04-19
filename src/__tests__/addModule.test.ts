import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs-extra';

/*


vi.mock('fs-extra');
vi.mock('../lib');

const mockCloneRepo = lib.cloneRepo as unknown as ReturnType<typeof vi.fn>;
const mockGetMeta = lib.getMeta as unknown as ReturnType<typeof vi.fn>;
const mockLogMessages = lib.logMessages as unknown as ReturnType<typeof vi.fn>;

const baseParams = {
  category: 'nextjs',
  module: 'auth',
  options: { dryRun: false, useCachedRepo: true },
};

describe('addModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not continue if cloneRepo fails', async () => {
    mockCloneRepo.mockResolvedValue(false);
    await addModuleLogic(baseParams);
    expect(mockGetMeta).not.toHaveBeenCalled();
  });

  it('should not continue if getMeta fails', async () => {
    mockCloneRepo.mockResolvedValue(true);
    mockGetMeta.mockResolvedValue(null);
    await addModuleLogic(baseParams);
    expect(mockLogMessages).toHaveBeenCalledWith(
      expect.arrayContaining([{ message: expect.any(String), level: 'error' }]),
    );
  });

  it('should copy files when meta is valid', async () => {
    mockCloneRepo.mockResolvedValue(true);
    mockGetMeta.mockResolvedValue({
      targetPaths: [{ source: 'file.js', destination: 'file.js' }],
      dependencies: [],
    });
    (fs.pathExists as any).mockResolvedValue(false);
    (fs.copy as any).mockResolvedValue(undefined);

    await addModuleLogic(baseParams);
    expect(fs.copy).toHaveBeenCalled();
  });

  it('should skip copying if destination already exists', async () => {
    mockCloneRepo.mockResolvedValue(true);
    mockGetMeta.mockResolvedValue({
      targetPaths: [{ source: 'file.js', destination: 'file.js' }],
    });
    (fs.pathExists as any).mockResolvedValue(true);

    await addModuleLogic(baseParams);
    expect(fs.copy).not.toHaveBeenCalled();
  });
});


*/