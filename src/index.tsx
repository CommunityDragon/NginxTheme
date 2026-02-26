import type { FunctionalComponent } from 'preact';
import { hydrate, prerender as ssr } from 'preact-iso';
import { parseTemplate } from '@lib/nginx-index';
import { App } from './app';

const Root: FunctionalComponent = () => {
  const { currentPath, files } = parseTemplate();
  return <App currentPath={currentPath} files={files} />;
};

if (typeof window !== 'undefined') {
  hydrate(<Root />, document.getElementById('app'));
}

export async function prerender() {
  return await ssr(<App currentPath="" files={[]} />);
}