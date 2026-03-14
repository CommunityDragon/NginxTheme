import { transformWithEsbuild } from "vite";

/**
 * Transform a raw TypeScript string into compiled JavaScript using vite-node.
 *
 * @param {string} code - Raw TypeScript source code.
 * @param {object} variables - Variables to inject (via define or custom transform).
 * @returns {Promise<string>} Transformed JavaScript code.
 */
export async function headerScript(variables = {}) {
  const { default: raw } = await import("../../assets/script?raw");
  const { code } = await transformWithEsbuild(raw, "virtual.ts", {
    minify: true,
    target: "es2015",
    supported: { "import-meta": true },
    define: Object.fromEntries(
      Object.entries(variables).map(([k, v]) => [
        `__${k}__`,
        JSON.stringify(v),
      ]),
    ),
  });

  return code;
}
