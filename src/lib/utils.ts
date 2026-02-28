import type { FileEntry } from "@typings/files";
import { type ClassValue, clsx } from "clsx";
import {
  Binary,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  type LucideIcon,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SortColumn = "name" | "size" | "date";
type SortDirection = "asc" | "desc";

export function getFileIcon(fileName: string, isDirectory: boolean) {
  if (isDirectory) return Folder;
  if (!fileName.includes(".")) return Binary;

  const extension = fileName.split(".").pop()?.toLowerCase();

  const iconMap: Record<string, LucideIcon> = {
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
    "7z": FileArchive,
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
 * Sorts an array of FileEntry, always keeping the parent directory ("../") at the top.
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

  // Helper to wrap a comparator and always put the parent directory first
  const withParentPriority = (
    compareFn: (a: FileEntry, b: FileEntry) => number,
  ) => {
    return (a: FileEntry, b: FileEntry): number => {
      const aIsParent = a.link === "../";
      const bIsParent = b.link === "../";

      if (aIsParent && !bIsParent) return -1; // parent comes first
      if (!aIsParent && bIsParent) return 1; // parent comes first
      if (aIsParent && bIsParent) return 0; // both parent (shouldn't happen)

      // Normal comparison
      return compareFn(a, b);
    };
  };

  // Default sort: directories first, then name natural order
  if (column == null) {
    return sorted.sort(
      withParentPriority((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1;
        }
        return naturalCompare(a.name, b.name);
      }),
    );
  }

  // Column‑based sort – direction defaults to 'asc'
  const dir = direction ?? "asc";
  const multiplier = dir === "asc" ? 1 : -1;

  return sorted.sort(
    withParentPriority((a, b) => {
      let cmp = 0;

      switch (column) {
        case "name":
          cmp = naturalCompare(a.name, b.name);
          break;

        case "size":
          if (a.size === null && b.size === null) cmp = 0;
          else if (a.size === null)
            cmp = 1; // nulls last
          else if (b.size === null) cmp = -1;
          else cmp = a.size.bytes - b.size.bytes;
          break;

        case "date":
          if (a.date === null && b.date === null) cmp = 0;
          else if (a.date === null) cmp = 1;
          else if (b.date === null) cmp = -1;
          else cmp = a.date.getTime() - b.date.getTime();
          break;

        default: {
          // Exhaustiveness check
          const _: never = column;
          return 0;
        }
      }

      return cmp * multiplier;
    }),
  );
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

/**
 * Escapes special characters for use in a regular expression.
 */
export const escapeRegex = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Fetches the file list for a given patch version.
 */
export const fetchFilelist = async (patch: string): Promise<string> => {
  const response = await fetch(`/${patch}/cdragon/files.exported.txt`);
  if (!response.ok) throw new Error("Failed to fetch file list");
  return response.text();
};
