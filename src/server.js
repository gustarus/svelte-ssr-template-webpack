import path from 'path';
import {
  cleanServerInstanceOnExit,
  createCatchMiddleware,
  createMatchMiddleware,
  createRedirectMiddleware,
  createRenderMiddleware,
  createServer,
  createServerInstance,
  createStaticMiddleware,
  resolveCommandOptions
} from 'svelte-ssr/server';
import component, { preload } from './App.svelte';
import configure from './configure';

// configure the environment initially
configure();

// create plain express server
const app = createServer();

// resolve command line arguments
const { port, base, staticProxyPort, staticPathToDirectory } = resolveCommandOptions();

// define additional component props
const componentProps = { entry: 'node', nodePort: port };


// mock custom server request to show the ability of matching with custom routes with base folder
app.use(createMatchMiddleware({ base, match: '/sitemap.xml', verbose: true }, (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>')
}));

// serve static content with the magic middleware
// if both development severs are running - this middleware
// serve files from client development server port
app.use(createStaticMiddleware({ base, staticProxyPort, staticPathToDirectory, verbose: true }));

// serve content to render based on desired template
// and render request content inside the target
const targetSelector = '#root';
const pathToTemplate = path.resolve(__dirname, '..', 'build', 'client', 'index.html');
app.use(createRenderMiddleware({
  base,
  component,
  componentProps,
  preload,
  pathToTemplate,
  targetSelector,
  removeWhitespace: true,
  verbose: true,
  debug: true
}));

// redirect all not resolved requests to the base
app.use(createRedirectMiddleware({ base, verbose: true }));

// log into console all errors
app.use(createCatchMiddleware({ verbose: true }));

// listen desired port by the server and clean server instance on node application exit event
const instance = createServerInstance(app, port, () => console.log(`Server is ready on ':${port}'`));
cleanServerInstanceOnExit(instance);
