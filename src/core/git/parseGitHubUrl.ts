export type GitHubRepoInfo =
  | {
      type: 'repoSubfolderUrl';
      repoUrl: string;
      branch: string;
      folderPath: string;
      user: string;
      repo: string;
    }
  | {
      type: 'fullRepoUrl';
      repoUrl: string;
      branch: string;
      user: string;
      repo: string;
    };

export function parseGitHubUrl(url: string): GitHubRepoInfo | null {
  try {
    const cleanUrl = url.replace(/\/$/, ''); // remove trailing slash
    const treeMatch = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.*))?/);

    if (treeMatch) {
      const [_, user, repo, branch, folderPath] = treeMatch;
      const cleanRepo = repo.replace(/\.git$/, '');
      if (folderPath) {
        return {
          type: 'repoSubfolderUrl',
          repoUrl: `https://github.com/${user}/${cleanRepo}.git`,
          branch,
          folderPath,
          user,
          repo,
        };
      } else {
        return {
          type: 'fullRepoUrl',
          repoUrl: `https://github.com/${user}/${repo}.git`,
          branch,
          user,
          repo,
        };
      }
    }

    const plainRepoMatch = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)(?:\.git)?$/);
    if (plainRepoMatch) {
      const [_, user, repo] = plainRepoMatch;
      const cleanRepo = repo.replace(/\.git$/, '');
      return {
        type: 'fullRepoUrl',
        repoUrl: `https://github.com/${user}/${cleanRepo}.git`,
        branch: 'main', // fallback default
        user,
        repo,
      };
    }

    return null;
  } catch {
    return null;
  }
}
