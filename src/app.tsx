import Taro from '@tarojs/taro'
import { Component } from 'react'
import 'windi.css'
import './app.scss'

class App extends Component {

  onLaunch () {
    // 小程序进行更新（强制
    const updateManager = Taro.getUpdateManager()
    updateManager.onUpdateReady(() => {
      Taro.showModal({
        title: '更新检测', // 此处可自定义提示标题
        content: '检测到新版本，请重启小程序', // 此处可自定义提示消息内容
        showCancel: false,
        success: function (res) {
        if (res.confirm) {
            updateManager.applyUpdate() //应用版本更新
          }
        }
      })
      })

    updateManager.onUpdateFailed(function () { //失败的监听
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
