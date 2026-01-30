/* eslint-env node */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

require('dotenv').config();

const STORE_URL = process.env.STORE_URL;
const THEME_ID = process.env.THEME_ID;

module.exports = (env, argv) => {
  const mode = argv.mode || 'production';

  console.info({
    MODE: mode,
    STORE_URL: STORE_URL || '(not set)',
    THEME_ID: THEME_ID || '(not set)',
  });

  const config = {
    mode,
    entry: './src/tailwind.css',
    output: {
      path: path.resolve(__dirname, 'assets'),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'tailwind.css',
      }),
    ],
  };

  if (mode === 'development') {
    config.devtool = 'source-map';
    config.plugins.push(
      new WebpackShellPluginNext({
        onBuildStart: {
          scripts: ['echo Webpack build in progress...'],
        },
        onBuildEnd: {
          scripts: [
            'echo Build complete',
            `shopify theme dev -s ${STORE_URL}${THEME_ID ? ` -t ${THEME_ID}` : ''} --port 1234`,
          ],
          parallel: true,
        },
      })
    );
  }

  return config;
};