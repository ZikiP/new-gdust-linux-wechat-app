import Taro from "@tarojs/taro";

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
