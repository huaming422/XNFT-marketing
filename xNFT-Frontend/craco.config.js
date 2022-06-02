const fs = require('fs');
const webpack = require('webpack');
const CracoAlias = require('craco-alias');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const net = process.env.REACT_APP_HOST_TYPE;

const plugins =
  net === 'mainnet'
    ? [
        // new BundleAnalyzerPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          terserOptions: {
            mangle: true,
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        }),
        new ESLintPlugin({
          extensions: ['ts', 'tsx'],
          formatter: require.resolve('react-dev-utils/eslintFormatter'),
          eslintPath: require.resolve('eslint'),
          context: './src',
          cache: true,
          threads: false,
          cwd: fs.realpathSync(process.cwd()),
          resolvePluginsRelativeTo: __dirname,
          baseConfig: {
            extends: [require.resolve('eslint-config-react-app/base')],
            rules: {
              'react/react-in-jsx-scope': 'error',
            },
          },
        }),
      ]
    : [
        // new BundleAnalyzerPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new ESLintPlugin({
          extensions: ['ts', 'tsx'],
          formatter: require.resolve('react-dev-utils/eslintFormatter'),
          eslintPath: require.resolve('eslint'),
          context: './src',
          cache: true,
          threads: false,
          cwd: fs.realpathSync(process.cwd()),
          resolvePluginsRelativeTo: __dirname,
          baseConfig: {
            extends: [require.resolve('eslint-config-react-app/base')],
            rules: {
              'react/react-in-jsx-scope': 'error',
            },
          },
        }),
      ];

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.extend.json',
      },
    },
  ],
  webpack: {
    configure: (webpackConfig) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin',
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },
    plugins,
  },
  eslint: {
    enable: false,
  },
};
