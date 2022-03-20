import Taro from "@tarojs/taro";

/**
 * 保存缓存
 * @param key 缓存名
 * @param value 缓存内容
 * @returns
 */
export const setCache = (key: string, value: string | number |object[]) => {
  if(!key || !value) {
    return;
  }
  try {
    Taro.setStorageSync(key, value)
  } catch (error) {
    console.log(error)
  }
}

/**
 * 获取缓存的值
 * @param key 缓存的名字
 * @returns
 */
export const getCache = (key: string) => {
  if(!key) {
    return ;
  }
  try {
    const value =  Taro.getStorageSync(key)
    return value
  } catch (error) {
    console.log(error)
  }
}

/**
 * 删除缓存
 * @param key 缓存的名字
 */
export const removeCache = (key: string) => {
   if(!key) {
     return;
   }
   try {
     Taro.removeStorageSync(key)
   } catch (error) {
    console.log(error)
   }
}
