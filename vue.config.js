// const webpack = require("webpack");
// 引入等比适配插件
// const px2rem = require('postcss-px2rem')
// // 配置基本大小
// const postcss = px2rem({
//   // 基准大小 baseSize，需要和rem.js中相同
//   remUnit: 16
// })
module.exports = {
  productionSourceMap: false,
  lintOnSave: true,
  transpileDependencies: ["vue-draggable-next"],
  devServer: {
    host: '192.168.1.88',
    port: 9990,
    overlay: {
      warning: false,
      errors: false,
    },
  },
  // css: {
  //   //查看CSS属于哪个css文件
  //   sourceMap: true,
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         postcss
  //       ]
  //     }
  //   }
  // },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
  },
  publicPath: "./",
  //https://cli.vuejs.org/zh/guide/html-and-static-assets.html#html
  chainWebpack: (config) => {
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");
    //自下定义title
    config.plugin("html").tap((args) => {
      args[0].title = "智慧安全系统";
      return args;
    });

    // 或者
    // 修改它的选项：
    // config.plugin('prefetch').tap(options => {
    //   options[0].fileBlacklist = options[0].fileBlacklist || []
    //   options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
    //   return options
    // })
  },
  // configureWebpack: {
  //     plugins: [
  //         new webpack.optimize.MinChunkSizePlugin({
  //             minChunkSize: 100000 // 通过合并小于 minChunkSize 大小的 chunk，将 chunk 体积保持在指定大小限制以上
  //         })
  //     ]
  // }
};
