import type { FileEntry, FileIndex } from '@typings/files';

/**
 * Parses a human‑readable size string (e.g. "279.2 KiB", "41.6 KiB", or "-")
 * into a structured object with raw string, byte count, and unit.
 * Returns null for the placeholder "-".
 *
 * @param sizeStr - Size string from the template.
 * @returns Parsed size object or null.
 */
export const parseSize = (sizeStr: string): { raw: string; bytes: number; unit: string } | null => {
  if (sizeStr === '-') return null;

  const match = sizeStr.match(/^([\d.]+)\s*([A-Za-z]+)?$/);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2] || 'B';

  const units: Record<string, number> = {
    B: 1,
    KB: 1000,
    MB: 1000 ** 2,
    GB: 1000 ** 3,
    KiB: 1024,
    MiB: 1024 ** 2,
    GiB: 1024 ** 3,
  };
  const multiplier = units[unit] || 1;

  return {
    raw: sizeStr,
    bytes: value * multiplier,
    unit,
  };
}

/**
 * Parses a date string like "2020-Jan-14 03:03" into a JavaScript Date object.
 * Handles three‑letter month abbreviations.
 *
 * @param dateStr - Date string from the template.
 * @returns Corresponding Date object.
 */
export const parseDate = (dateStr: string): Date|null => {
  if (dateStr.length <= 0 || dateStr === '-') return null;

  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };

  const [dayMonthYear, time] = dateStr.split(' ');
  const [year, monthAbbr, day] = dayMonthYear.split('-');
  const month = months[monthAbbr] || '01';

  return new Date(`${year}-${month}-${day}T${time}:00`);
}

/**
 * Extracts directory path and file entries from the hidden <template id="table-index">
 * that is rendered by the server. This function runs only on the client.
 *
 * @returns FileIndex containing the current path and parsed file entries.
 */
export const parseTemplate = (): FileIndex => {
  if (typeof document === 'undefined') {
    return { path: '', files: [] };
  }

  const template = document.getElementById('table-index') as HTMLTemplateElement;
  if (!template) {
    return { path: '', files: [] };
  }

  const h1 = template.content.querySelector('h1');
  const path = h1?.textContent?.trim() || '';

  const tbody = template.content.querySelector('tbody');
  if (!tbody) {
    return { path, files: [] };
  }

  const files: FileEntry[] = Array.from(tbody.querySelectorAll('tr')).map((row) => {
    const linkCell = row.querySelector('td.link a');
    const sizeCell = row.querySelector('td.size');
    const dateCell = row.querySelector('td.date');

    const name = linkCell?.textContent?.trim() || '';
    const link = linkCell?.getAttribute('href') || '';
    const sizeRaw = sizeCell?.textContent?.trim() || '-';
    const dateRaw = dateCell?.textContent?.trim() || '';

    const isDirectory = link.endsWith('/');
    const size = parseSize(sizeRaw);
    const date = parseDate(dateRaw);

    return { name, link, size, date, isDirectory };
  });

  return { path, files };
}