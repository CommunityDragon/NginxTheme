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
  const { template, script } = useLoaderData<typeof loader>();

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
          // biome-ignore lint/security/noDangerouslySetInnerHtml: inline scripts
          dangerouslySetInnerHTML={{ __html: script }}
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

export async function loader({ request }: LoaderFunctionArgs): Promise<{
  template: string;
  script: string;
}> {
  const [{ generateTemplate }, { getLocales }, { headerScript }] =
    await Promise.all([
      import("@/lib/server/nginx"),
      import("@/lib/server/lang"),
      import("@/lib/server/header"),
    ]);

  const locales = await getLocales();

  const [template, script] = await Promise.all([
    generateTemplate(request),
    headerScript({
      THEME_DEFAULT: import.meta.env.VITE_THEME_DEFAULT,
      THEME_STORAGE_KEY: import.meta.env.VITE_THEME_STORAGE_KEY,
      LOCALE_OPTIONS: locales,
      LOCALE_STORAGE_KEY: import.meta.env.VITE_LOCALE_STORAGE_KEY,
      SETTINGS_STORAGE_KEY: import.meta.env.VITE_SETTINGS_STORAGE_KEY,
    }),
  ]);

  return { template, script };
}
