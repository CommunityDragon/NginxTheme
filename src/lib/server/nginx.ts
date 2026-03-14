interface Entry {
  name: string;
  type: string;
  mtime?: string | null;
  size?: number | null;
}

/**
 * Format a file size in bytes into a human-readable string (e.g., "1.2 KB").
 *
 * @param bytes - The size in bytes.
 * @returns Formatted size string.
 */
function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format a UTC timestamp into a readable date string (e.g., "2025-Mar-15 14:30").
 *
 * @param mtime - The timestamp string (ISO format or any date parsable by Date).
 * @returns Formatted date string.
 */
function formatDate(mtime: string): string {
  const date = new Date(mtime);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getUTCMonth()];
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Generate the HTML content for a directory listing table, including a header
 * with the current path and rows for parent directory and each entry.
 *
 * @param entries - Array of directory entries from the communitydragon JSON API.
 * @param currentPath - The path being listed (e.g., "/some/dir/").
 * @returns HTML string to be inserted into the template.
 */
function generateIndex(entries: Entry[], currentPath: string): string {
  let displayPath = currentPath;
  if (!displayPath.endsWith("/")) displayPath += "/";
  if (displayPath === "/") displayPath = "/";

  const header = `<h1>${displayPath}</h1>`;
  const rows = [];

  // parent directory link unless at root
  if (currentPath !== "/") {
    rows.push(`<tr>
      <td class="link"><a href="../" title="..">../</a></td>
      <td class="size">-</td>
      <td class="date"></td>
    </tr>`);
  }

  entries.forEach((entry) => {
    const name = entry.name;
    const type = entry.type;
    const mtime = entry.mtime;
    const size = entry.size;

    const link = type === "directory" ? `${name}/` : name;
    const sizeDisplay = type === "directory" ? "-" : formatSize(size ?? 0);
    const dateDisplay = mtime ? formatDate(mtime) : "";

    rows.push(`<tr>
      <td class="link"><a href="${link}" title="${name}">${name}${type === "directory" ? "/" : ""}</a></td>
      <td class="size">${sizeDisplay}</td>
      <td class="date">${dateDisplay}</td>
    </tr>`);
  });

  const table = `
    <table id="list">
      <thead>
        <tr>
          <th style="width:55%"><a href="?C=N&amp;O=A">File Name</a>&nbsp;<a href="?C=N&amp;O=D">&nbsp;&darr;&nbsp;</a></th>
          <th style="width:20%"><a href="?C=S&amp;O=A">File Size</a>&nbsp;<a href="?C=S&amp;O=D">&nbsp;&darr;&nbsp;</a></th>
          <th style="width:25%"><a href="?C=M&amp;O=A">Date</a>&nbsp;<a href="?C=M&amp;O=D">&nbsp;&darr;&nbsp;</a></th>
        </tr>
      </thead>
      <tbody>
        ${rows.join("")}
      </tbody>
    </table>
  `;

  return header + table;
}

/**
 * Generates the nginx index template based on the requested path.
 *
 * @param request the request object
 * @returns the nginx index template
 */
export async function generateTemplate(request: Request): Promise<string> {
  if (request.method !== "GET") return "";

  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!pathname.endsWith("/")) return "";

  const targetUrl = `https://raw.communitydragon.org/json${pathname}`;

  try {
    const response = await fetch(targetUrl);
    if (response.status !== 200) return "";

    const entries = await response.json();
    const template = generateIndex(entries, pathname);

    return template;
  } catch (err) {
    console.error("RAW asset error:", err);
    return "";
  }
}
