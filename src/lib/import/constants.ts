import type { PostStatus } from '@/lib/types/database';

export const HTML_IMPORT_LIMITS = {
  maxFiles: 150,
  maxHtmlCharsPerFile: 12 * 1024 * 1024,
  maxZipBytes: 32 * 1024 * 1024,
} as const;

export function isAllowedImportStatus(s: string): s is PostStatus {
  return s === 'draft' || s === 'published' || s === 'scheduled' || s === 'archived';
}
