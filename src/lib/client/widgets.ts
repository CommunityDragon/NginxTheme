import type { WidgetResolver } from "@/types/widgets";

// Use glob to load all widget components at build time
const widgetModules = import.meta.glob<{ default: React.FC }>(
  "/src/components/widgets/**/*.tsx",
  { eager: false },
);

export const widget =
  (path: string): WidgetResolver =>
  async () => {
    // Normalize the relative path to absolute from project root
    const normalizedPath = `/${path
      .replace(/\.tsx?$/, "") // Remove extension if present
      .replace(/^(?:\.\.\/)+src/, "src") // Convert relative to absolute from src
      .replace(/\/$/, "")}.tsx`;

    const module = widgetModules[normalizedPath];

    if (!module) {
      throw new Error(`Widget not found: ${path}`);
    }

    return {
      path,
      component: (await module()).default,
    };
  };
