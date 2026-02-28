import fs from "node:fs";
import path from "node:path";
import type { PluginOption } from "vite";

/**
 * Options for configuring the nginxIndex plugin.
 */
interface Options {
  /**
   * If true, the original index.html will be removed from the build output.
   * Useful when you only want header.html and footer.html.
   * @default false
   */
  removeIndex?: boolean;
}

interface Entry {
  name: string;
  type: string;
  mtime?: string | null;
  size?: number | null;
}

/**
 * Vite plugin that emulates nginx's `autoindex` behavior for a development server
 * and extracts header/footer from index.html at build time.
 *
 * The plugin works in two modes:
 * - **Build**: Looks for the marker `{{index}}` in index.html, splits the file into
 *   header.html and footer.html, and optionally removes the original index.html.
 * - **Development**: Proxies requests to `raw.communitydragon.org` for files not found
 *   locally, and injects dynamic directory listings into any HTML response that
 *   contains a `<template id="table-index">` element. The listing data is fetched
 *   from `raw.communitydragon.org/json`.
 *
 * @param options - Configuration options.
 * @returns A Vite plugin object.
 */
export const nginxIndex = (options?: Options): PluginOption => {
  return {
    name: "fancy-index",
    enforce: "post",

    /**
     * At build time, extract header and footer from index.html using the `{{index}}` marker.
     * Emits header.html and footer.html as separate assets.
     */
    generateBundle(_, bundle) {
      const indexHtml = bundle["index.html"];
      if (indexHtml) {
        // biome-ignore lint/complexity/useLiteralKeys: The typing is incorrect
        const htmlContent = indexHtml["source"];
        const marker = "{{index}}";
        const markerIndex = htmlContent.indexOf(marker);

        if (markerIndex === -1) {
          throw new Error(
            `Marker "${marker}" not found in index.html. Ensure it exists exactly as shown.`,
          );
        }

        const header = `${htmlContent.substring(0, markerIndex)}<h1>`;
        const footer = htmlContent.substring(markerIndex + marker.length);

        this.emitFile({
          type: "asset",
          fileName: "header.html",
          source: header,
        });

        this.emitFile({
          type: "asset",
          fileName: "footer.html",
          source: footer,
        });

        if (options?.removeIndex) {
          delete bundle["index.html"];
        }
      }
    },

    /**
     * In development, add a middleware that proxies missing files to
     * raw.communitydragon.org and serves them with correct headers.
     */
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "GET") return next();

        const url = new URL(req.originalUrl, `http://${req.headers.host}`);
        const pathname = url.pathname;

        // skip internal Vite requests
        if (
          pathname.startsWith("/@") ||
          pathname.startsWith("/node_modules/") ||
          pathname === "/favicon.ico"
        ) {
          return next();
        }

        // directories are handled by transformIndexHtml
        if (pathname.endsWith("/")) {
          return next();
        }

        // check if the file exists locally (project root or public dir)
        const root = server.config.root;
        const publicDir = server.config.publicDir;
        const localPath = path.join(root, pathname);
        const publicPath = path.join(publicDir, pathname);

        try {
          if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
            return next();
          }
          if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
            return next();
          }
        } catch {
          // ignore stat errors
        }

        // proxy to communitydragon
        const targetUrl = `https://raw.communitydragon.org${pathname}`;
        try {
          const response = await fetch(targetUrl);
          res.statusCode = response.status;

          // copy headers, skipping problematic ones
          response.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (
              !["content-encoding", "transfer-encoding", "connection"].includes(
                lowerKey,
              )
            ) {
              res.setHeader(key, value);
            }
          });

          const buffer = await response.arrayBuffer();
          res.end(Buffer.from(buffer));
        } catch (err) {
          console.error("[fancy-index] Proxy error:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end("Proxy error");
          }
        }
      });
    },

    /**
     * In development, for directory requests (paths ending with '/'), fetch a JSON
     * directory listing from communitydragon and inject it into the HTML template.
     * The injection replaces the content of `<template id="table-index">`.
     */
    async transformIndexHtml(html, ctx) {
      // only run in dev server
      if (
        process.env.NODE_ENV !== "development" ||
        ctx.server.config.command !== "serve"
      ) {
        return html;
      }

      const pathname = ctx.originalUrl.split("?")[0];
      if (!pathname.endsWith("/")) return html;

      const jsonUrl = `https://raw.communitydragon.org/json${pathname}`;
      try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
          console.warn(
            `[fancy-index] ${jsonUrl} returned ${response.status} – skipping injection`,
          );
          return html;
        }

        const entries = await response.json();
        const templateContent = generateDirectoryHTML(entries, pathname);

        const templateRegex = /<template\s+id="table-index">(.*?)<\/template>/s;
        const match = html.match(templateRegex);
        if (!match) {
          console.warn('Could not find <template id="table-index"> in HTML');
          return html;
        }

        return html.replace(
          templateRegex,
          `<template id="table-index">${templateContent}</template>`,
        );
      } catch (error) {
        console.error("Error generating index table:", error);
        return html;
      }
    },
  };
};

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
function generateDirectoryHTML(entries: Entry[], currentPath: string): string {
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
    const sizeDisplay = type === "directory" ? "-" : formatSize(size);
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
