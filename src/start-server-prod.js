import { server } from 'universal-webpack';
import webpack from 'webpack';
import settings from '../webpack/universal-webpack-settings';
import configuration from '../webpack/webpack.config.prod';

configuration.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      BABEL_ENV: JSON.stringify('production/server'),
      HOST: process.env.HOST && process.env.HOST,
      PORT: process.env.PORT,
      API_PATH: process.env.API_PATH && JSON.stringify(process.env.API_PATH),
      WEBSOCKETS: process.env.WEBSOCKETS,
    },
    __CLIENT__: false,
    __SERVER__: true,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true,
    __SSR__: true,
    __DEBUG__: true,
  }),
);

server(configuration, settings);
