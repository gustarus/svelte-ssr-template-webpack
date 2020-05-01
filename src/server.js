import path from 'path';
import {
  createCatchMiddleware,
  createRedirectMiddleware,
  createRenderMiddleware,
  createServer,
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
  verbose: true,
  debug: true
}));

// redirect all not resolved requests to the base
app.use(createRedirectMiddleware({ base, verbose: true }));

// log into console all errors
app.use(createCatchMiddleware({ verbose: true }));

// listen desired port by the server
app.listen(port, () => console.log(`Server is ready on ':${port}'`));
