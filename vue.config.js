module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    https:true
  },
  publicPath: '',

  pluginOptions: {
    cordovaPath: 'src-cordova'
  }
}
