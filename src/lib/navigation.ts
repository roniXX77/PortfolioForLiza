export const categories = [
  "video",
  "photography",
  "participation",
  "canvases",
] as const;
export function sitePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return import.meta.env.BASE_URL.replace(/\/$/, "") + path;
}

export const archivePath = sitePath("/projects/digital-archive/");
