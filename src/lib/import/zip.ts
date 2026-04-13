import { strFromU8, unzipSync } from 'fflate';

export type ZipHtmlEntry = { path: string; html: string };

function isSafeZipPath(path: string): boolean {
  const p = path.replace(/\\/g, '/');
  if (!p || p.endsWith('/')) return false;
  if (p.includes('..')) return false;
  if (p.startsWith('/') || /^[a-zA-Z]:/.test(p)) return false;
  return true;
}

/**
 * Extract .html / .htm entries from a ZIP buffer (browser or Node).
 * Skips unsafe paths and non-HTML assets.
 */
export function extractHtmlFilesFromZip(buffer: ArrayBuffer): ZipHtmlEntry[] {
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(new Uint8Array(buffer));
  } catch {
    return [];
  }

  const out: ZipHtmlEntry[] = [];
  for (const path of Object.keys(files)) {
    if (!isSafeZipPath(path)) continue;
    if (!/\.(html|htm)$/i.test(path)) continue;
    const u8 = files[path];
    if (!u8?.length) continue;
    try {
      const html = strFromU8(u8);
      if (!html.trim()) continue;
      out.push({ path: path.replace(/\\/g, '/'), html });
    } catch {
      // skip invalid entries
    }
  }

  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}
