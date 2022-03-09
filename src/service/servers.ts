import { getCache } from '@/utils/storage';
import HTTPREQUEST from "@/service/http"

export const  LoginBind = (data)=> {
  return HTTPREQUEST.post('/api/v1/account/bind',data)
}

export const getLogin = (param) => {
  return HTTPREQUEST.get('/api/v1/account/login/', {}, param)
}

export const freshLogin = (method, url, data?, param?) => {
  return HTTPREQUEST.custom(method,url,data,param)
}

export const getToday = (code) => {
  return HTTPREQUEST.get('/api/v1/schedule/today/', {}, code)
}

export const getNotices = () => {
  return HTTPREQUEST.get('/api/v1/admin/notice')
}

export const getUserInfo = (account) => {
  return HTTPREQUEST.get('/api/v1/info/', {}, account)
}
