import Taro from "@tarojs/taro"
import { getCache, setCache } from "../utils/storage"
import { getLogin } from "./servers"

/**
 * 判断用户是否进行登录，如果登录了返回resolve，
 * 如果没有登录，调用getLogin函数进行登录
 * @returns
 */
export const loginLoad = () => {
  if(getCache('account') != '') {
    return new Promise<void>((resolve,rej)=>{
      resolve()
    })
  }
  return new Promise<void>((resolve,rej)=> {
    Taro.login({
      success: function (res) {
        if (res.code) {
          const  login = async() => {
            const data:any = await getLogin(res.code)
            setCache('token',data.detail.token)
            setCache('account',data.detail.account)
            setCache('openid',data.detail.openid)
            if (data.detail.account === null) {
              // 跳转绑定
              session_login().then(()=>{
                resolve()
              });
            } else {
              resolve()
            }
          }
          login().catch(error=>console.log(error))
        } else {
          rej('登录失败！' + res.errMsg)
        }
      }
    })
  })
}

/**
 * 判断用户有无绑定教务系统账号，如果没有则跳转至绑定页面
 * @returns
 */
export const session_login =()=> {
  return new Promise<void>(function (resolve, reject) {
    let account = getCache('account') || null
    let token = getCache('token') || null
    let mzsm = getCache('masm') || null
    if (mzsm == '') {
      return
    }
    if (account && token) {
      setCache('session_id', token)
      setCache('account', getCache('account'))
      Taro.reLaunch({
        url: '/pages/index/index'
      })
      resolve();
    } else {
      Taro.showModal({
        title: '提示',
        content: '你好鸭，请先绑定教务系统哦~',
        showCancel: false,
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            setTimeout(function () {
              // 跳转到个人页面
              Taro.navigateTo({
                url: '/pages/more/Login/index'
              })
            }, 0)
          }
        }
      })
    }
  })
}
