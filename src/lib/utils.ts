import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  Folder,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileCode,
  Binary,
} from "lucide-react";
import { FileEntry } from "@typings/files";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type SortColumn = 'name' | 'size' | 'date';
type SortDirection = 'asc' | 'desc';



export function getFileIcon(fileName: string, isDirectory: boolean) {
  if (isDirectory) return Folder;
  if (!fileName.includes('.')) return Binary;

  const extension = fileName.split('.').pop()?.toLowerCase();

  const iconMap: Record<string, any> = {
    txt: FileText,
    md: FileText,
    rtf: FileText,
    doc: FileSpreadsheet,
    docx: FileSpreadsheet,
    xls: FileSpreadsheet,
    xlsx: FileSpreadsheet,
    csv: FileSpreadsheet,
    ppt: FileSpreadsheet,
    pptx: FileSpreadsheet,
    jpg: FileImage,
    jpeg: FileImage,
    png: FileImage,
    gif: FileImage,
    svg: FileImage,
    webp: FileImage,
    mp4: FileVideo,
    avi: FileVideo,
    mov: FileVideo,
    mkv: FileVideo,
    mp3: FileAudio,
    wav: FileAudio,
    flac: FileAudio,
    ogg: FileAudio,
    zip: FileArchive,
    rar: FileArchive,
    '7z': FileArchive,
    tar: FileArchive,
    gz: FileArchive,
    js: FileCode,
    ts: FileCode,
    jsx: FileCode,
    tsx: FileCode,
    html: FileCode,
    css: FileCode,
    json: FileCode,
    xml: FileCode,
    py: FileCode,
    java: FileCode,
    cpp: FileCode,
    c: FileCode,
    bin: Binary,
  };

  return extension && extension in iconMap ? iconMap[extension] : File;
}

/**
 * Sorts an array of FileEntry.
 * If no column is provided, sorts directories first, then files, each group by name using natural order.
 * If a column is provided, sorts by that column (respecting direction), ignoring directory/file type.
 *
 * @param files - The array to sort (not mutated).
 * @param column - Optional column to sort by. If null/undefined, default directory‑first natural sort is applied.
 * @param direction - Optional sort direction. Defaults to 'asc' when column is given. Ignored in default sort.
 * @returns A new sorted array.
 */
export function sortFiles(
  files: FileEntry[],
  column?: SortColumn | null,
  direction?: SortDirection | null,
): FileEntry[] {
  const sorted = [...files];

  // Default sort: directories first, then files, both sorted by name (natural, case‑insensitive)
  if (column == null) {
    return sorted.sort((a, b) => {
      // Directories first
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      // Same type → natural sort by name
      return naturalCompare(a.name, b.name);
    });
  }

  // Column‑based sort – direction defaults to 'asc'
  const dir = direction ?? 'asc';
  const multiplier = dir === 'asc' ? 1 : -1;

  return sorted.sort((a, b) => {
    let cmp = 0;

    switch (column) {
      case 'name':
        cmp = naturalCompare(a.name, b.name);
        break;

      case 'size':
        // Nulls always last
        if (a.size === null && b.size === null) cmp = 0;
        else if (a.size === null) cmp = 1;      // a is null → a after b
        else if (b.size === null) cmp = -1;     // b is null → a before b
        else cmp = a.size.bytes - b.size.bytes;
        break;

      case 'date':
        if (a.date === null && b.date === null) cmp = 0;
        else if (a.date === null) cmp = 1;
        else if (b.date === null) cmp = -1;
        else cmp = a.date.getTime() - b.date.getTime();
        break;

      default:
        // Exhaustiveness check
        const _: never = column;
        return 0;
    }

    return cmp * multiplier;
  });
}

/**
 * Compares two strings using natural order (numeric substrings are compared numerically).
 * Case‑insensitive.
 */
function naturalCompare(a: string, b: string): number {
  const re = /(\d+)|(\D+)/g;
  const aParts = a.toLowerCase().match(re) ?? [];
  const bParts = b.toLowerCase().match(re) ?? [];

  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    const aPart = aParts[i];
    const bPart = bParts[i];

    const aIsNum = /^\d+$/.test(aPart);
    const bIsNum = /^\d+$/.test(bPart);

    if (aIsNum && bIsNum) {
      const numDiff = parseInt(aPart, 10) - parseInt(bPart, 10);
      if (numDiff !== 0) return numDiff;
    } else {
      const strDiff = aPart.localeCompare(bPart);
      if (strDiff !== 0) return strDiff;
    }
  }

  // Shorter string comes first if all equal parts so far
  return aParts.length - bParts.length;
}
