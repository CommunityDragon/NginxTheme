import {
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./style.css";

export function Layout({ children }: { children: React.ReactNode }) {
  const template = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="description"
          content="A community made to manage a custom API that serves static data."
        />
        <Meta />
        <Links />
        <script
          /** biome-ignore lint/security/noDangerouslySetInnerHtml: inline scripts */
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            try {
              var settingsStorageKey = '${import.meta.env.VITE_SETTINGS_STORAGE_KEY}';
              var themeStorageKey = '${import.meta.env.VITE_THEME_STORAGE_KEY}';
              var themeDefault = '${import.meta.env.VITE_THEME_DEFAULT}';
              var storedSettings = localStorage.getItem(settingsStorageKey) ?? "null";
              var storedTheme = localStorage.getItem(themeStorageKey);
              var theme = storedTheme || themeDefault;
              var root = document.documentElement;
              var appliedTheme = theme;
              if (theme === 'system') {
                appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              root.classList.add(appliedTheme);
              window.__INITIAL_THEME__ = theme;
              var settings = JSON.parse(storedSettings);
              window.__INITIAL_SETTINGS__ = settings;
            } catch (e) {
              var fallback = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              document.documentElement.classList.add(fallback);
              window.__INITIAL_THEME__ = 'system';
              window.__INITIAL_SETTINGS__ = null;
            }
          })();
        `,
          }}
        />
      </head>
      <body className="group/body overscroll-none antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)] theme-default">
        {children}
        <template
          id="nginx-index"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: nginx index template
          dangerouslySetInnerHTML={{ __html: template }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (request.method !== "GET") return "";

  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!pathname.endsWith("/")) {
    return "";
  }

  const targetUrl = `https://raw.communitydragon.org/json${pathname}`;

  try {
    const response = await fetch(targetUrl);
    if (response.status !== 200) return "";

    const entries = await response.json();
    const { generateIndex } = await import("@/lib/server/nginx");
    return generateIndex(entries, pathname);
  } catch (err) {
    console.error("RAW asset error:", err);
    return "";
  }
}
