module.exports = {
  publicPath: "/",
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:7071",
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    devtool: "source-map",
  },
  transpileDependencies: ["vuetify"],
};
