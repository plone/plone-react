import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import autoprefixer from 'autoprefixer';
import paths from '../configs/paths';

const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, './dist');

const BASE_CSS_LOADER = {
  loader: 'css-loader',
  options: {
    importLoaders: 2,
    sourceMap: true,
    localIdentName: '[name]__[local]___[hash:base64:5]',
  },
};

const POST_CSS_LOADER = {
  loader: require.resolve('postcss-loader'),
  options: {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ],
        flexbox: 'no-2009',
      }),
    ],
  },
};

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    main: paths.appClientIndexJs,
  },
  output: {
    path: paths.appBuild,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          BASE_CSS_LOADER,
          POST_CSS_LOADER,
          {
            loader: 'less-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          BASE_CSS_LOADER,
          POST_CSS_LOADER,
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: paths.appBuild,
        use: [
          {
            loader: 'style-loader',
          },
          BASE_CSS_LOADER,
          POST_CSS_LOADER,
        ],
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
        use: [
          {
            loader: 'file-loader?name=[name].[ext]?[hash]',
          },
          {
            loader: 'image-webpack-loader',
            options: {
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // Specifying webp here will create a WEBP version of your JPG/PNG images
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/fontwoff',
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules', paths.appNodeModules],
    extensions: ['.json', '.js', '.jsx'],
    alias: {
      '../../theme.config$': path.join(__dirname, '../theme/site/theme.config'),
    },
  },
  resolveLoader: {
    modules: [paths.appNodeModules, paths.ownNodeModules],
  },
  plugins: [
    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
    // css files from the extract-text-plugin loader
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash].css',
    }),
    // optimizations
    new CopyWebpackPlugin([
      {
        context: 'src/static',
        from: '**/*',
        to: './',
      },
    ]),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
};
