<script context="module">
  import githubApi from './../../instances/githubApi';
  import { GITHUB_USER, GITHUB_API_USER_REPOSITORIES } from '../../constants';

  async function load() {
    const path = GITHUB_API_USER_REPOSITORIES.replace('${user}', GITHUB_USER);
    const { data } = await githubApi.get(path, { params: { sort: 'updated' } });
    return data.filter((repository) => !repository.fork).map((repository) => ({
      id: repository.id,
      name: repository.name,
      owner: repository.owner.login,
      description: repository.description,
      url: repository.html_url
    }));
  }

  /**
   * @param {{ base: string, path: string, inner: string, query: {} }} location - requested location
   * @param {{ params: {} }} match - router match result
   * @param {{ redirect: redirectCallback }} helpers - preload helpers
   */
  export async function preload(location, match, helpers) {
    const data = await load();
    return { initialRepositories: data, initiallyLoaded: true };
  }

  /**
   * Return redirect instance.
   * @callback redirectCallback
   * @param {number} status
   * @param {string} url
   */
</script>

<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import createUrlWithBase from './../../helpers/createUrlWithBase';
  import isEnvironmentPlatformBrowser from './../../helpers/isEnvironmentPlatformBrowser';
  import { processing } from './../../stores';
  import { URL_INNER } from '../../constants';

  export let entry;
  export let nodePort;
  export let clientPort;
  export let serverPort;
  export let initialRepositories = [];
  export let initiallyLoaded = false;

  let repositories = initialRepositories;

  const urlToUndefinedRepository = URL_INNER.replace(':tag', 'lorem-ipsum-dolor-sit-amet');

  onMount(onInitialLoadingRequested);

  /**
   * @param {'node' | 'client' | 'server'} entry
   * @returns {string}
   */
  function resolveHostByEntry(entry) {
    const base = isEnvironmentPlatformBrowser() ? window.location.hostname : 'localhost';

    switch (entry) {
      case 'node':
        return `${base}:${nodePort}`;
      case 'client':
        return `${base}:${clientPort}`;
      case 'server':
        return `${base}:${serverPort}`;
    }
  }

  /**
   * @param {{ name: string }} repository
   * @returns {string}
   */
  function resolveInnerUrl(repository) {
    return createUrlWithBase(URL_INNER.replace(':tag', repository.name));
  }

  /**
   * @returns {{ class: string }}
   */
  function resolveRepositoryProps() {
    return { class: 'list-group-item list-group-item-action flex-column align-items-start' };
  }

  /**
   * @returns {Promise<void>}
   */
  function onInitialLoadingRequested() {
    if (initiallyLoaded) {
      return;
    }

    processing.set(true);
    load().then((data) => {
      repositories = data;
    }).finally(() => processing.set(false));
  }

  $: contentServeSource = entry === 'node' ? 'node js server side rendering app' : 'webpack development server';
</script>

<style src="./styles.pcss">

</style>

<svelte:head>
  <title>{repositories.length} repositories by @{GITHUB_USER} - Svelte server side rendering tool</title>
</svelte:head>

<br />
<br />

<div class="container">
  <div class="jumbotron">
    <h1 class="display-4">Hello from <a href="https://github.com/gustarus/svelte-ssr" target="_blank">svelte ssr</a> tool!</h1>
    <p class="lead">This is a webpack template with data loading from github open api.</p>
    <hr class="my-4">
    <p>
      Page is served by <strong class="text-info">{contentServeSource}</strong>.

      {#if entry === 'node'}
        Feel free to inspect page source to be sure that content is rendered by the <code>node</code> js app.
        Take a look at the page title which has been rendered by server side rendering tool.
      {:else}
        Feel free to inspect page source to be sure that there is no content rendered by the <code>node</code> js app.
      {/if}

      Try to get access to undefined repository page here: <a href={urlToUndefinedRepository}>{urlToUndefinedRepository}</a>.
    </p>

    <p>The following processes are launched:</p>
    <ul>
      <li>Server side rendering <code>node</code> js app on <a href={`http://${resolveHostByEntry('node')}`}>{resolveHostByEntry('node')}</a>.</li>

      {#if clientPort}
        <li>Webpack development server for <code>client</code> entry point on <a href={`http://${resolveHostByEntry('client')}`}>{resolveHostByEntry('client')}</a>.</li>
      {/if}

      {#if serverPort}
        <li>Webpack development server for <code>server</code> entry point on <a href={`http://${resolveHostByEntry('server')}`}>{resolveHostByEntry('server')}</a>.</li>
      {/if}
    </ul>
  </div>

  <h2>Repositories by {GITHUB_USER}</h2>
  <p class="lead">
    Click on repository to go to the inner page without server requests.
  </p>

  <div class="list-group">
    {#each repositories as repository (repository.id)}
      <Link to={resolveInnerUrl(repository)} getProps={resolveRepositoryProps}>
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{repository.name}</h5>
          <small>by @{repository.owner}</small>
        </div>

        <p class="mb-1">{repository.description || 'Without description'}</p>
        <a href={repository.url} target="_blank">{repository.url}</a>
      </Link>
    {/each}
  </div>
</div>

<br />
<br />
