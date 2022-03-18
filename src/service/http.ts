import Taro from '@tarojs/taro'
import { getCache } from '@/utils/storage';
import interceptors from './interceptors'
import getBaseUrl from './baseUrl'


type paramsType = {
  url: string,
  data?: object | null,
  param?: string | null,
  contentType?: string | null
}

interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem))

class httpRequest {
  baseOptions(params, method) {
    let { url, data, param } = params;
    const BASE_URL = getBaseUrl()
    let contentType = "application/json;charset=UTF-8";
    contentType = params.contentType || contentType;
    param = params.param || '';
    const session_id = getCache('token') || null
    let header = {}
    if (session_id != '') {
      header = {
        'content-type': contentType,
        'Authorization': 'Bearer ' + getCache('token')
      }
    }
    const option = {
      url: BASE_URL + url + param,  //地址
      data: data,   //传参
      method: method, //请求方式
      timeout: 5000, // 超时时间
      header: header
    };
    return Taro.request(option);
  }

  custom(method, url, data?, param?) {
    let option: paramsType = { url, data, param };
    return this.baseOptions(option,method)
  }

  get(url, data?, param?) {
    let option:paramsType = { url, data, param };
    return this.baseOptions(option, "GET");
  }

  post(url, data?, param?, contentType?) {
    let params:paramsType = { url, data, param, contentType };
    return this.baseOptions(params, "POST");
  }

  put(url, data?) {
    let option:paramsType = { url, data };
    return this.baseOptions(option, "PUT");
  }

  delete(url, data?) {
    let option:paramsType = { url, data };
    return this.baseOptions(option, "DELETE");
  }

}

export default new httpRequest()
