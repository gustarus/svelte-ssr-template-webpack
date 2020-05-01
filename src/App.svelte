<script context="module">
  import { pick } from 'svelte-routing/src/utils';
  import routes from './routes';

  /**
   * @param {{ base: string, path: string, inner: string, query: {} }} location - requested location
   * @param {resolveCallback} resolve - resolve prepared result
   * @param {{ redirect: redirectCallback }} helpers - preload helpers
   * @returns any
   */
  export async function preload(location, resolve, helpers) {
    // try to match route with routes collection
    const match = pick(routes, location.inner);
    if (!match) {
      // redirect to the base if no routes match
      // if no url passed to the redirect helper
      // redirect will be resolved to the base
      return helpers.redirect(301);
    }

    // resolve preload method if exported from the matched route
    const preload = match && match.route && match.route.component && match.route.component.preload;
    // preload route props if required
    const candidate = preload ? await preload(location, match, helpers) : {};
    // return mapped object to resolve which route have to receive props later
    return resolve(candidate, data => ({ preloaded: { [match.route.path]: data } }));
  }

  /**
   * Return resolved candidate.
   * @callback resolveCallback
   * @param {any} candidate
   * @param {callback} prepare
   */

  /**
   * Return redirect instance.
   * @callback redirectCallback
   * @param {number} status
   * @param {string} url
   */
</script>

<script>
  import { Router, Route } from 'svelte-routing';
  import { resolveNormalizedPath } from 'svelte-ssr';
  import { base as storeBase, processing as processingStore } from './stores';

  // resolve entry point code
  export let entry = process.env.ENTRY;
  // resolve entry point port
  export let nodePort = process.env.NODE_PORT;
  // resolve entry point port
  export let clientPort = process.env.CLIENT_PORT;
  // resolve entry point port
  export let serverPort = process.env.SERVER_PORT;
  // html base tag value
  export let base = process.env.BASE;
  // this property will be available
  // only in server side rendering scenario
  export let path = undefined;
  // data which was preloaded
  // from preload method
  export let preloaded = {};

  // initially set base path
  storeBase.set(base);

  function resolveRouteProps(route) {
    const { component, exact } = route;

    // resolve preloaded route props
    const props = preloaded[route.path] || {};

    // resolve path without extra slashes between parts
    const path = resolveNormalizedPath(`${base}/${route.path}`);
    return { path, component, exact, entry, nodePort, clientPort, serverPort, ...props };
  }
</script>

<div id="app" class:blurred={$processingStore}>
  <Router url={path}>
    {#each routes as route (route.path)}
      <Route {...resolveRouteProps(route)} />
    {/each}
  </Router>
</div>

{#if $processingStore}
  <div id="processing" class="d-flex justify-content-center align-items-center">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
{/if}
