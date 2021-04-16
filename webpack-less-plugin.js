const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCssFlexBugFixes = require('postcss-flexbugs-fixes');
const postcssLoadConfig = require('postcss-load-config');

const hasPostCssConfig = () => {
  try {
    return !!postcssLoadConfig.sync();
  } catch (_error) {
    return false;
  }
};

const defaultOptions = {
  postcss: {
    dev: {
      sourceMap: true,
      ident: 'postcss',
    },
    prod: {
      sourceMap: false,
      ident: 'postcss',
    },
    plugins: [
      PostCssFlexBugFixes,
      autoprefixer({
        flexbox: 'no-2009',
      }),
    ],
  },
  less: {
    dev: {
      sourceMap: true,
    },
    prod: {
      sourceMap: true,
    },
  },
  css: {
    dev: {
      sourceMap: true,
      importLoaders: 2,
      modules: {
        auto: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    },
    prod: {
      sourceMap: false,
      importLoaders: 1,
      modules: {
        auto: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    },
  },
  style: {},
};

module.exports = (userOptions = {}) => ({
  modifyWebpackConfig({
    env: { target, dev },
    webpackConfig: defaultConfig,
    webpackObject,
    options: { pluginOptions, razzleOptions, webpackOptions },
    paths,
  }) {
    const isServer = target !== 'web';
    const constantEnv = dev ? 'dev' : 'prod';

    const config = Object.assign({}, defaultConfig);
    const { registry } = userOptions;
    if (!registry) {
      throw new Error(
        'You need to pass an AddonsConfigurationRegistry object as option',
      );
    }

    const options = Object.assign({}, defaultOptions, userOptions);

    const styleLoader = {
      loader: require.resolve('style-loader'),
      options: options.style,
    };

    const cssLoader = {
      loader: require.resolve('css-loader'),
      options: options.css[constantEnv],
    };

    // resolveUrlLoader is not compatible with semantic-ui-react
    // See https://github.com/Semantic-Org/Semantic-UI-React/issues/3761
    // Maybe also https://github.com/Semantic-Org/Semantic-UI-React/issues/3844
    // const resolveUrlLoader = {
    //   loader: require.resolve('resolve-url-loader'),
    //   options: options.resolveUrl[constantEnv],
    // };

    const postCssLoader = {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: hasPostCssConfig()
          ? undefined
          : Object.assign({}, options.postcss[constantEnv], {
              plugins: options.postcss.plugins,
            }),
      },
    };
    // console.dir(postCssLoader, { depth: null });

    const lessLoader = {
      loader: require.resolve('less-loader'),
      options: Object.assign({}, options.less[constantEnv]),
    };

    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.less$/,
        include: [
          path.resolve('./theme'),
          /node_modules\/@plone\/volto\/theme/,
          /plone\.volto\/theme/,
          /node_modules\/semantic-ui-less/,
          ...Object.values(registry.getResolveAliases()),
        ],
        use: isServer
          ? [
              {
                loader: require.resolve('css-loader'),
                options: Object.assign({}, options.css[constantEnv], {
                  onlyLocals: true,
                }),
              },
              // resolveUrlLoader,
              postCssLoader,
              lessLoader,
            ]
          : [
              dev ? styleLoader : MiniCssExtractPlugin.loader,
              cssLoader,
              postCssLoader,
              // resolveUrlLoader,
              lessLoader,
            ],
      },
    ];

    return config;
  },
});
