import { parseTemplate } from "@lib/nginx-index";
import type { FunctionalComponent } from "preact";
import { hydrate, prerender as ssr } from "preact-iso";
import { App } from "./app";

const Root: FunctionalComponent = () => {
  const { path, files } = parseTemplate();
  return <App path={path} files={files} />;
};

if (typeof window !== "undefined") {
  hydrate(<Root />, document.getElementById("app"));
}

export async function prerender() {
  return await ssr(<App path="" files={[]} />);
}
