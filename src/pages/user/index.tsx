import { OpenData, View, Navigator,Text } from '@tarojs/components'
import { useDidShow, useReady } from '@tarojs/taro'
import { useState } from 'react'
import { loginLoad } from '~/src/service/handleService'
import { getUserInfo } from '~/src/service/servers'
import { getCache } from '~/src/utils/storage'
import UCard from '@/components/UCard'
import Issue from '@img/more/issue.png'
import About from '@img/more/aboutmiao.png'
import Taro from '@tarojs/taro'

type infoType = {
  class_name: string
  department_name: string
  name: string
  student_number: string
}

const cardList =[
  {
    icon: Issue,
    title: '意见反馈',
    url:''
  },
  {
    icon: About,
    title: '关于e广科',
    url: '/pages/more/About/index'
  }
]

const User = (): JSX.Element =>  {

  const[userInfo, setUserInfo] = useState<infoType>(Object)

  useReady(() => {
    loginLoad().then(()=> {
      getData();
    })
  })

  /**
   * 获取用户信息
   */
  const getData = async() => {
    const userInfoRes: any = await getUserInfo()
    setUserInfo(userInfoRes.detail)
  }

  /**
   * 根据不同的url进行跳转
   * @param url 目的地址
   */
  const goView = (url: string) => {
      Taro.navigateTo({
        url
      })
  }

  return (
    <View>
      <View className='theme-bg-color h-80 '></View>
       <View className='bg-white w-95_100 h-135 border-solid border-gray-100 border-1 mx-auto shadow-2xl rounded-xl relative -top-30'>
          <View className='flex justify-center'>
            <View >
              <View className='w-60 h-60 border-solid border border-gray-100 circle overflow-hidden bg-dark-200 relative -top-30' ><OpenData type='userAvatarUrl'/></View>
              <View className='username-color w-60 text-center relative -top-20'>{userInfo?.name}</View>
            </View>
          </View>
        <View className='grid grid-cols-3 gap-x-4 py-8 text-center relative -top-15 text-gray-600 text-14'>
          <View>
            <View className='mb-5'>学号</View>
            <View>{userInfo?.student_number}</View>
          </View>
          <View>
            <View className='mb-5'>系别</View>
            <View>{userInfo?.department_name}</View>
          </View>
          <View>
            <View className='mb-5'>班级</View>
            <View>{userInfo?.class_name}</View>
          </View>
        </View>
      </View>
      <View className='py-0 shadow-2xl w-95_100 mx-auto relative -top-15 text-gray-600 text-14 BG'>
      {
        cardList &&
        cardList.map((item, index) => {
          return (
          <View key={index} className='flex flex-col items-left' onClick={() => goView(item.url)}>
            <UCard icon={item.icon} title={item.title} url={item.url}></UCard>
          </View>
          )
        }
        )
      }
      </View>
      <Navigator url='../more/Login/index' className='text-18 leading-45 h-45 bg-red-400 w-95_100 items-center text-white rounded-xl mt-0 mx-9 mb-5 absolute bottom-0'>
        <Text className='flex justify-center'>切换绑定</Text>
      </Navigator>
    </View>

  )
}


export default User
