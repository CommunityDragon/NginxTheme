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

export function sortFiles(
  files: FileEntry[],
  column: SortColumn,
  direction: SortDirection,
): FileEntry[] {
  return [...files].sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) {
      return a.isDirectory ? -1 : 1;
    }

    let comparison = 0;
    if (column === 'name') {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) comparison = -1;
      if (nameA > nameB) comparison = 1;
    } else if (column === 'size') {
      const sizeA = a.size?.bytes ?? -1;
      const sizeB = b.size?.bytes ?? -1;
      comparison = sizeA - sizeB;
    } else if (column === 'date') {
      comparison = a.date.getTime() - b.date.getTime();
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}