module.exports = function (api) {
  api.cache(true);
  const presets = ['razzle/babel'];
  const plugins = [
    'lodash',
    '@babel/plugin-proposal-export-default-from', // Stage 1
    '@babel/plugin-syntax-export-namespace-from', // Stage 4
    '@babel/plugin-proposal-throw-expressions', // Stage 2
    [
      // needed by Storybook 6.2, see https://github.com/nrwl/nx/issues/3657
      // the loose mode setup is used by create-react-app, see
      // https://github.com/facebook/create-react-app/blob/2d1829eaf6ff1308da00720fa9984620dd0fb296/packages/babel-preset-react-app/create.js#L152
      require('@babel/plugin-proposal-class-properties').default,
      {
        loose: true,
      },
    ],
    [
      'babel-plugin-root-import', // Required for the ~ imports to work
      {
        rootPathSuffix: 'src',
      },
    ],
    [
      'react-intl', // React Intl extractor, required for the whole i18n infrastructure to work
      {
        messagesDir: './build/messages/',
      },
    ],
    '@loadable/babel-plugin', // Required by the @loadable plugin
  ];

  return {
    plugins,
    presets,
  };
};
