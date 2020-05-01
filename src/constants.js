export const ENTRY = process.env.ENTRY;
export const PORT = process.env.PORT;

export const URL_DEFAULT = '/';
export const URL_INNER = '/repository/:tag/';
export const URL_UNRESOLVED = '/unresolved/:tag/';

export const GITHUB_USER = 'gustarus';

export const GITHUB_API_BASE = 'https://api.github.com';
export const GITHUB_API_USER_REPOSITORIES = '/users/${user}/repos';
export const GITHUB_API_USER_REPOSITORY = '/repos/${user}/${tag}';
