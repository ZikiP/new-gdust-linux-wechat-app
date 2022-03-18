const getBaseUrl = () => {
  let BASE_URL = '';
  if (process.env.NODE_ENV === 'development') {
    //开发环境 - 根据请求不同返回不同的BASE_URL
    BASE_URL = 'http://farmer2333.top:5000'
  } else {
    // 生产环境
    BASE_URL = 'https://egk.diyxi.top'
  }
  return BASE_URL
}

export default getBaseUrl;
