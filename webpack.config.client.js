const path = require('path');
const yargs = require('yargs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin, HashedModuleIdsPlugin } = require('webpack');
const { addWebpackProductionHash, createWebpackClientConfig } = require('svelte-ssr/webpack');

const { base, nodePort, clientPort, serverPort } = yargs.argv;

const config = production => createWebpackClientConfig({
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
            emitCss: true,
            hydratable: true,
            hotReload: true,
            dev: !production,
            preprocess: require('svelte-preprocess')({ postcss: true })
          }
        }
      },
      {
        test: [/\.css$/, /\.pcss$/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: !production }
          },
          'css-loader',
          'postcss-loader'
        ]
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
      'process.env.ENTRY': JSON.stringify('client'),
      'process.env.NODE_PORT': JSON.stringify(parseInt(nodePort, 10)),
      'process.env.CLIENT_PORT': JSON.stringify(parseInt(clientPort, 10)),
      'process.env.SERVER_PORT': JSON.stringify(parseInt(serverPort, 10))
    }),

    new CleanWebpackPlugin(),
    new HashedModuleIdsPlugin(),

    new MiniCssExtractPlugin({
      filename: addWebpackProductionHash('[name].css', production)
    }),

    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'src', 'index.html')
    })
  ]
}, { production });

module.exports = (_, { mode }) => {
  return config(mode === 'production');
};
