<script>
  import { Link } from 'svelte-routing';
  import createUrlWithBase from './../../helpers/createUrlWithBase';
  import { URL_DEFAULT } from './../../constants';

  export let tag;

  function getButtonProps() {
    return { class: 'btn btn-danger' };
  }
</script>

<style src="./styles.pcss">

</style>

<svelte:head>
  <title>Repository {tag} not found - Svelte server side rendering tool</title>
</svelte:head>

<br />
<br />

<div class="container">
  <div class="alert alert-danger">
    <h4 class="alert-heading">Repository {tag} not found.</h4>
    <p>Previously requested repository <code>{tag}</code> not found and you have been redirected to this page from the inner page.</p>
    <hr />
    <Link to={createUrlWithBase(URL_DEFAULT)} getProps={getButtonProps}>Home page</Link>
  </div>
</div>

<br />
<br />
