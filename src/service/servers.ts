import HTTPREQUEST from "@/service/http"

/**
 * 绑定教务系统账号
 * @param data 账号和密码的对象
 * @returns
 */
export const  LoginBind = (data)=> {
  return HTTPREQUEST.post('/api/v1/account/bind',data)
}

/**
 * 获取登录状态
 * @param param 微信登录码
 * @returns
 */
export const getLogin = (param) => {
  return HTTPREQUEST.get('/api/v1/account/login/', {}, param)
}

/**
 * 重新获取登录状态
 * @param method 请求方法
 * @param url 请求地址
 * @param data  携带的数据
 * @param param 携带的参数
 * @returns
 */
export const freshLogin = (method, url, data?, param?) => {
  return HTTPREQUEST.custom(method,url,data,param)
}

/**
 * 获取首页展示的上课信息
 * @returns
 */
export const getToday = () => {
  return HTTPREQUEST.get('/api/v1/schedule/today')
}

/**
 * 更新首页展示的上课信息
 * @returns
 */
export const updateToday = () => {
  return HTTPREQUEST.get('/api/v1/schedule/today/update')
}
/**
 * 获取公告信息
 * @returns
 */
export const getNotices = () => {
  return HTTPREQUEST.get('/api/v1/admin/notice')
}

/**
 * 获取用户信息
 * @returns
 */
export const getUserInfo = () => {
  return HTTPREQUEST.get('/api/v1/info')
}

/**
 * 获取课表页面需要渲染的课表信息
 * @returns
 */
export const getSchedule = () => {
  return HTTPREQUEST.get('/api/v1/schedule')
}

/**
 * 获取课表页面更新需要的课表信息
 * @returns
 */
export const updateSchedule = () => {
  return HTTPREQUEST.get('/api/v1/schedule/update')
}

/**
 * 获取成绩
 * @param term 学期
 * @param year 学年
 * @returns
 */
export const getAchievement = (term, year) => {
  return HTTPREQUEST.get(`/api/v1/score?term=${term}&year=${year}`)
}

/**
 * 获取当前年份
 * @returns
 */
export const getCurrentYear = () => {
  return HTTPREQUEST.get('/api/v1/score/get_current_year')
}
