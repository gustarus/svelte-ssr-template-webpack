<script context="module">
  import createUrlWithBase from './../../helpers/createUrlWithBase';
  import githubApi from './../../instances/githubApi';
  import { URL_UNRESOLVED, GITHUB_USER, GITHUB_API_USER_REPOSITORY } from '../../constants';

  async function load(tag) {
    const path = GITHUB_API_USER_REPOSITORY
      .replace('${user}', GITHUB_USER)
      .replace('${tag}', tag);

    const { data } = await githubApi.get(path);
    return {
      id: data.id,
      name: data.name,
      owner: data.owner.login,
      description: data.description,
      url: data.html_url
    };
  }

  /**
   * @param {{ base: string, path: string, inner: string, query: {} }} location - requested location
   * @param {{ params: {} }} match - router match result
   * @param {{ redirect: redirectCallback }} helpers - preload helpers
   */
  export async function preload(location, match, helpers) {
    const { tag } = match.params;

    try {
      const data = await load(tag);
      return { tag, initialRepository: data, initiallyLoaded: true };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const url = URL_UNRESOLVED.replace(':tag', tag);
        return helpers.redirect(302, url);
      }

      throw error;
    }
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
  import { processing } from './../../stores';
  import { URL_DEFAULT } from '../../constants';

  export let tag;
  export let initialRepository = {};
  export let initiallyLoaded = false;

  // page data
  let repository = initialRepository;

  onMount(onInitialLoadingRequested);

  async function onInitialLoadingRequested() {
    if (initiallyLoaded) {
      return;
    }

    processing.set(true);
    load(tag).then((data) => {
      repository = data;
    }).catch((error) => {
      if (error.response && error.response.status === 404) {
        window.location.href = URL_UNRESOLVED.replace(':tag', tag);
        return;
      }

      throw error;
    }).finally(() => processing.set(false));
  }

  function getButtonProps() {
    return { class: 'btn btn-primary' };
  }
</script>

<style src="./styles.pcss">

</style>

<svelte:head>
  <title>Repository {repository.name} by @${GITHUB_USER}</title>
</svelte:head>

<br />
<br />

<div class="container">
  <div class="jumbotron">
    <h1 class="display-4">Repository <a href={repository.url} target="_blank">{repository.name}</a></h1>
    <p class="lead">{repository.description || 'Without description'}</p>
    <hr class="my-4">
    <p>
      <Link to={createUrlWithBase(URL_DEFAULT)} getProps={getButtonProps}>Home page</Link>
    </p>
  </div>
</div>

<br />
<br />
