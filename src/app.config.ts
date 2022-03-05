export default {
  pages: [
    'pages/index/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarTitleText: 'e广科',
    navigationBarTextStyle: 'white',
  },
  tabBar: {
    color: "#8a8a8a",
    selectedColor: "#1296db",
    backgroundColor: '#FFF',
    borderStyle: "white",
    list: [{
      pagePath: 'pages/index/index',
      text: '首页',
      iconPath: 'assets/images/index/index.png',
      selectedIconPath: 'assets/images/index/index@active.png'
    }, {
      pagePath: 'pages/user/index',
      text: '个人',
      iconPath: 'assets/images/index/more.png',
      selectedIconPath: 'assets/images/index/more@active.png'
    }],
  }
}
