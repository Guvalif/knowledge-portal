module.exports = (env, options) => ({
  entry: {
    'assets/app': `${__dirname}/src/index.ts`,
  },

  output: {
    path: __dirname,
    filename: '[name].js',
  },

  resolve: {
    extensions: [ '.js', '.ts', '.tsx' ],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },

  optimization: {
    splitChunks: {
      name: 'assets/vendor',
      chunks: 'initial',
    },
  },

  devServer: {
    static: {
      directory: '.',
    },
    open: true,
    hot: false,
    liveReload: true,
    port: 8080,
  },
});
