// currentTask will be the task that we use like npm run task, task maybe (dev, build ...etc)
const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");

/*
  Because I didn't bother making CSS part of our
  webpack workflow for this project I'm just
  manually copying our CSS file to the DIST folder. 
*/
class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy files", function () {
      // copy the first argument in the next argument
      fse.copySync("./app/style/main.css", "./dist/main.css");

      /*
        If you needed to copy another file or folder
        such as your "images" folder, you could just
        call fse.copySync() as many times as you need
        to here to cover all of your files/folders.
      */
    });
  }
}

config = {
  entry: "./app/Main.js", // entry point of our app
  output: {
    // output
    publicPath: "/",
    path: path.resolve(__dirname, "app"),
    filename: "bundled.js",
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      filename: "index.html", //create file called index.html in entry point
      template: "app/index-template.html", // this is static template created from npm run generate
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],

  //mod eof web pack
  mode: "development",
  module: {
    // rule here contain loader, each loader is an object based
    rules: [
      {
        // test here use regex that search for all file contain this regex and convert it
        test: /\.js$/,

        // we can put here files to exclude from convert
        exclude: /(node_modules)/,
        use: {
          // loader that used to convert jsx to vanilla js
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react",
              ["@babel/preset-env", { targets: { node: "12" } }],
            ],
          },
        },
      },
    ],
  },
};

if (currentTask == "webpackDev" || currentTask == "dev") {
  config.devtool = "source-map";
  config.devServer = {
    port: 3000, // port that will run our app
    contentBase: path.join(__dirname, "app"),
    hot: true, // reload when there is change
    historyApiFallback: { index: "index.html" },
  };
}

if (currentTask == "webpackBuild") {
  config.plugins.push(new CleanWebpackPlugin(), new RunAfterCompile());
  config.mode = "production"; // mode of webpack
  config.output = {
    // output
    publicPath: "/",
    path: path.resolve(__dirname, "dist"), //output folder name, here is "dist"
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  };
}

module.exports = config;
