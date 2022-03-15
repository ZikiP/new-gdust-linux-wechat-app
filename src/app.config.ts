export default {
  pages: [
    'pages/index/index',
    'pages/user/index',
    'pages/more/login',
    'pages/more/about',
  ],
  subPackages: [
    { root:'subPackages/classSchedule', pages:['index']}
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarTitleText: 'e广科',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#079df2',
    // 开启下拉刷新
    enablePullDownRefresh: true
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
  },
  // lazyCodeLoading: "requiredComponents" // 按需注入代码

}
