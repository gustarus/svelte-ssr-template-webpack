import DefaultPage from './pages/DefaultPage';
import InnerPage from './pages/InnerPage';
import UnresolvedPage from './pages/UnresolvedPage';
import { URL_DEFAULT, URL_INNER, URL_UNRESOLVED } from './constants';

export default [
  { path: URL_DEFAULT, component: DefaultPage, exact: true },
  { path: URL_INNER, component: InnerPage, exact: true },
  { path: URL_UNRESOLVED, component: UnresolvedPage, exact: true }
];
