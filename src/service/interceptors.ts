import { getCache } from '@/utils/storage';
import { freshLogin } from './servers';
import { getLogin } from '~/src/service/servers';
import Taro from "@tarojs/taro"
import { pageToLogin } from "@/utils/errorHandle"
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
      return Promise.reject({ desc: '请求资源不存在' })

    } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
      return Promise.reject({ desc: "服务端出现了问题" })

    } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {

      pageToLogin()
      // TODO 根据自身业务修改
      return Promise.reject({ desc: "没有权限访问" });

    } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
      setCache('mzsm',1)
      loginLoad().then(function () {
        freshLogin(method,url,data).then(function (res) {
          if (res.statusCode === 200) {
            return new Promise((resolve, reject) => {
              resolve(res)
          })
          }else {
            return new Promise((resolve, reject) => {
              reject(res)
            })
          }
        })
      }).catch(error=>console.log(error))

      return Promise.reject({ desc: "需要鉴权" })

    } else if (res.statusCode === HTTP_STATUS.SERVER_ERROR) {
      return new Promise<void>(function(resolve,reject) {
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
