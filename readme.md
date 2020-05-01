# Svelte ssr tool webpack template ![with love](https://img.shields.io/badge/-with_love-ff69b4?style=flat-square) ![hardcore](https://img.shields.io/badge/-fat_free-green?style=flat-square)
This template has been built specially for demonstration of cooperation between [svelte](https://github.com/sveltejs/svelte), [svelte-ssr](https://github.com/gustarus/svelte-ssr) and [webpack](https://github.com/webpack/webpack) to perform server side rendering requests.
This is like [sapper](https://github.com/sveltejs/sapper) but not (🤷‍♀️).

## How to install it
**1. Clone the repository**
```bash
git clone https://github.com/gustarus/svelte-ssr-template-webpack.git
```

**2. Step into the template folder**
```bash
cd ./svelte-ssr-template-webpack
```

**3. Install dependencies**

If you are using `nvm`, switch to desired `node.js` version.
```bash
nvm install
```

Use `npm` to install dependencies.
```bash
npm install
```

## How to use it
### Launch development server
This command will launch `webpack-dev-server` for `client` and `server` entry points and `node.js` server to perform server side rendering requests.
```bash
npm start
```

### Build for production
This command will launch `webpack` to build assets for `client` and `server` entry points. 
```bash
npm run build
```

### Launch production server
This command will launch only `node.js` server to serve compiled with `npm run build` assets. 
```bash
npm run production
```

If you want to use different base path, pass `base` argument to the command.
With the following command template will be served from `localhost:3000/foo/`. 
```bash
npm run production -- --base /foo/ 
```
