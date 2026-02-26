/**
 * Represents a file or directory entry from the server‑generated directory listing.
 */
export interface FileEntry {
  /**
   * Display name of the file/directory.
   */
  name: string;

  /**
   * URL path to the resource (may end with '/' for directories).
   */
  link: string;

  /**
   * Parsed size information, or null if size is not available (e.g. '-').
   */
  size: { raw: string; bytes: number; unit: string } | null;

  /**
   * Last modified date.
   */
  date: Date|null;

  /**
   * Whether this entry is a directory.
   */
  isDirectory: boolean;
}

/**
 * Data extracted from the server‑side HTML template.
 */
export interface FileIndex {
  /**
   * Current directory path as shown in the <h1>.
   */
  currentPath: string;

  /**
   * List of file/directory entries.
   */
  files: FileEntry[];
}

export type SortColumn = 'name' | 'size' | 'date';
export type SortDirection = 'asc' | 'desc';