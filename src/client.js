// import core dependencies
import { renderClient } from 'svelte-ssr/client';
import configure from './configure';
import component from './App.svelte';

// import application styles
import 'bootstrap/dist/css/bootstrap.css';
import './styles/global.pcss';

// configure the environment initially
configure();

// render application inside the target
renderClient({ component, target: '#root' });

