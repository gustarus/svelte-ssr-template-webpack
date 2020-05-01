const path = require('path');
const yargs = require('yargs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin, HashedModuleIdsPlugin } = require('webpack');
const { addWebpackProductionHash, createWebpackServerConfig } = require('svelte-ssr/webpack');

const { base, nodePort, clientPort, serverPort } = yargs.argv;

const config = production => createWebpackServerConfig({
  stats: 'minimal',

  resolve: {
    extensions: ['.mjs', '.js', '.svelte', '.json'],
    alias: {
      svelte: path.resolve(__dirname, 'node_modules', 'svelte')
    }
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: false,
            generate: 'ssr',
            hydratable: true,
            hotReload: true,
            dev: !production,
            preprocess: require('svelte-preprocess')({ postcss: true })
          }
        }
      },
      {
        test: [/\.css$/, /\.pcss$/],
        loader: 'null-loader'
      },
      {
        test: [/\.svg$/, /\.jpe?g$/, /\.png$/, /\.woff2$/, /\.woff$/, /\.ttf$/, /\.eot$/],
        loader: 'file-loader',
        options: {
          name: addWebpackProductionHash('[name].[ext]', production)
        }
      }
    ]
  },

  plugins: [
    new DefinePlugin({
      'process.env.BASE': JSON.stringify(base),
      'process.env.ENTRY': JSON.stringify('server'),
      'process.env.NODE_PORT': JSON.stringify(parseInt(nodePort, 10)),
      'process.env.CLIENT_PORT': JSON.stringify(parseInt(clientPort, 10)),
      'process.env.SERVER_PORT': JSON.stringify(parseInt(serverPort, 10))
    }),

    new CleanWebpackPlugin(),
    new HashedModuleIdsPlugin()
  ]
}, { production });

module.exports = (_, { mode }) => {
  return config(mode === 'production');
};
