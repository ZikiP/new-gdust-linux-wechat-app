import { useThrottle } from '~/src/utils/Throttle';
import { freshLogin } from './servers';
import Taro from "@tarojs/taro"
import { HTTP_STATUS } from '~/config/httpConfig'
import { setCache } from "../utils/storage"
import { loginLoad } from './handleService';
import getBaseUrl from './baseUrl';

// 拦截器

const customInterceptor = (chain) => {
  console.log(chain)
  const BASE_URL = getBaseUrl()
  const requestParams = chain.requestParams
  const url = (requestParams.url).replace(BASE_URL,'')
  const method = requestParams.method
  const data = requestParams.data

  Taro.showLoading({
    title: '加载中',
  })

  return chain.proceed(requestParams).then(res => {
    Taro.hideLoading()
    // 只要请求成功，不管返回什么状态码，都走这个回调
    if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
      return new Promise<void>(function(resolve,reject) {
        Taro.showToast({
          title: '服务器出错',
          icon: 'error',
          duration: 1500
        })
        resolve()
      });

    } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
      return Promise.reject({ desc: "服务端出现了问题" })

    } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {

      // pageToLogin()
      // TODO 根据自身业务修改
      return Promise.reject({ desc: "没有权限访问" });

    } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
      setCache('mzsm',1)
      useThrottle(()=>{ //节流
        loginLoad().then(function () {
          freshLogin(method,url,data).then(function (res) {
            if (res.statusCode === 200) {
              return new Promise((resolve, reject) => {
                resolve(res)
            })
            }else {
              return new Promise((resolve, reject) => {
                reject()
                Taro.showToast({
                  title: '请稍后再试',
                  icon: 'none',
                  duration: 1500
                })
              })
            }
          })
        }).catch(error=>console.log(error))
      }, 3000)
      return Promise.reject({ desc: "需要鉴权" })

    } else if (res.statusCode === HTTP_STATUS.SERVER_ERROR) {
      return new Promise<void>(function(resolve,reject) {
        Taro.showToast({
          title: '服务器出错，请稍后再试',
          icon: 'error',
          duration: 1500
        })
        resolve()
      });
    } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
      return res.data
    } else {
      return Promise.reject(res.data)
    }
  }).catch(error=> {
    Taro.hideLoading()
    return Promise.reject(error)
  })
}

const interceptors = [customInterceptor]

export default interceptors
