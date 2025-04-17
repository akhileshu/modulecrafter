export type Meta = {
  description?: string;
  targetPaths?: { source: string; destination: string }[];
  dependencies?: string[];
  postInstall?: string[];
};
