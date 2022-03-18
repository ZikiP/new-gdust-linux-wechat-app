import { View, Text, Image } from "@tarojs/components"
import { useState } from "react"
import Gx from '@img/more/gx.png'
import { useReady } from "@tarojs/taro"

const About = (): JSX.Element => {
  const [isShow, setIsShow] = useState(false)
  const [year, setYear] = useState<number>()

  useReady(() => {
    setYear(new Date().getFullYear())
  })

  return (
    <View className="p-0 flex-1">
      <View className="bg-white h-50 flex items-center px-22 box-border border-0 border-b-1 border-solid border-b-gray-200 ">
        <View className="flex flex-1 items-center">
          <Text className="text-gray-600 pr-5 text-18">e广科</Text>
          <Text className="theme-color mt-3 border-1 border-solid text-14 theme-border-color leading-17 px-4 mr-5">v0.3.0</Text>
          <Text className="theme-color mt-3 border-1 border-solid text-14 theme-border-color leading-17 px-4">正式版</Text>
        </View>
        <View className="theme-color">
          {isShow ? <Text  onClick={() => setIsShow(!isShow)}>简介</Text> : <Text onClick={() => setIsShow(!isShow)}>更新日志</Text>}
        </View>
      </View>
      <View className="">
        {
          isShow ?
            <View className="flex flex-col items-stretch">
              <View className="flex flex-col leading-28 mt-7 border-0 border-solid border-t-1 border-b-1 border-gray-200 bg-white flex-nowrap box-border pt-10 px-22 pb-15 w-full text-gray-600">
                <View className="flex justify-between text-18  mb-8 leading-32">
                  <Text className="flex-1">v0.3.0</Text>
                  <Text className="text-16 text-gray-400">2022.02.16</Text>
                </View>
                <Text className="pb-8 text-16">1. 新增成绩查询</Text>
                <Text className="pb-8 text-16">2. 新增系统公告</Text>
                <Text className="pb-8 text-16">3. 修复刷新异常</Text>
              </View>
              <View className="flex flex-col leading-28 mt-7 border-0 border-solid border-t-1 border-b-1 border-gray-200 bg-white flex-nowrap box-border pt-10 px-22 pb-15 w-full text-gray-600">
                <View className="flex justify-between text-18  mb-8 leading-32">
                  <Text className="flex-1">v0.2.1 </Text>
                  <Text className="text-16 text-gray-400">2022.02.15</Text>
                </View>
                <Text className="pb-8 text-16">1. 修复首页错位问题</Text>
              </View>
              <View className="flex flex-col leading-28 mt-7 border-0 border-solid border-t-1 border-b-1 border-gray-200 bg-white flex-nowrap box-border pt-10 px-22 pb-15 w-full text-gray-600">
                <View className="flex justify-between text-18  mb-8 leading-32">
                  <Text className="flex-1">v0.2.0 公测版</Text>
                  <Text className="text-16 text-gray-400">2022.02.14</Text>
                </View>
                <Text className="pb-8 text-16">1. 提交审核版本</Text>
              </View>
            </View>
            :
            <View className="flex flex-col leading-28 mt-7 border-0 border-solid border-t-1 border-b-1 border-gray-200 bg-white flex-nowrap box-border pt-10 px-22 pb-15 w-full">
              <Text className="text-18 text-gray-600 mb-8">简介</Text>
              <View className="flex flex-col border-0 border-l-4 pl-7 mb-8 text-14 text-gray-500 border-solid border-gray-300">
                <Text>e广科</Text>
                <Text>Github：https://github.com/GK-GNU-Linux/gdust-linux-wechat-app</Text>
              </View>
              <Text className="pb-7 text-15 text-gray-600">e广科，前端源码fork自广科小喵微信小程序，修改并适配e广科后端程序，由e广科团队开发并运营的微信小程序。</Text>
              <Text className="pb-7 text-15 text-gray-600">提供多元化的校园功能，有别于公众号的一种全新的连接用户与服务的方式，无需下载与安装即可在微信内被便捷地获取和传播，同时具有出色的使用体验。</Text>
              <Text className="text-18 text-gray-600 mb-8">免责声明</Text>
              <View className="flex flex-col border-0 border-l-4 pl-7 mb-8 text-14 text-gray-500 border-solid border-gray-300">
                <Text >使用本小程序(e广科)即代表同意以下条款：</Text>
                <Text >1.e广科提供内容或服务仅供于个人学习、研究或欣赏娱乐等用途。</Text>
                <Text >2.使用e广科绑定教务系统，即同意e广科代理取得教务系统个人相关信息，包括成绩与课表等</Text>
                <Text >3.e广科提供的内容均会缓存在e广科后台，用户使用时自动更新</Text>
                <Text >4.取得信息均以本校教务系统为准，e广科无法保证信息的实时性</Text>
                <Text >5.使用本工具风险由您自行承担，e广科不承担任何责任</Text>
              </View>
            </View>
        }
      </View>
      {/* else */}

      <View className="text-15 items-center pt-30 px-0 pb-7 text-gray-400">
        <View className="h-16 leading-16 flex  mb-3 justify-center">
          <Image className="w-14 h-14 mr-2" src={Gx}></Image>
          <Text>e广科</Text>
        </View>
        <View className="flex justify-center">Copyright @ 2012-{year} All Rights Reserved</View>
      </View>
    </View>
  )
}

export default About
