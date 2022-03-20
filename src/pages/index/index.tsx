import { Image, Text, View } from '@tarojs/components'
import './index.scss'
import { CCard } from '@components/CCard'
import { Notice } from '@components/Notice'
import Kb from '@img/core/kb.png'
import Cj from '@img/core/cj.png'
import Dfd from '@img/core/df@disabled.png'
import Jyd from '@img/core/jy@disabled.png'
import Zsd from '@img/core/zs@disabled.png'
import Taro, { useDidShow, useReady } from '@tarojs/taro'
import {setCache, getCache} from '@/utils/storage'
import { loginLoad, session_login } from '~/src/service/handleService'
import { getNotices, getToday, updateToday } from '~/src/service/servers'
import { useState } from 'react'

type navItem = {
  icon: string,
  text: string,
  url: string,
  available: boolean
}

type scheduleItem = {
  name: string,
  time: string,
  place: string
}


type navType = Array<navItem>

const Index = (): JSX.Element => {

  const [scheduleList, setScheduleList] = useState<Array<object>>([])
  const [notice, setNotice] =useState<Array<object>>([])

  const navList: navType = [
    {
      icon: Kb,
      text: '课程表',
      url: '/subPackages/classSchedule/index',
      available: true
    },
    {
      icon: Cj,
      text: '查询成绩',
      url: '/subPackages/Achievement/index',
      available: true
    },
    {
      icon: Jyd,
      text: '借阅信息',
      url: '',
      available: false
    },
    {
      icon: Dfd,
      text: '电费查询',
      url: '',
      available: false
    },
    {
      icon: Zsd,
      text: '图书馆空位',
      url: '',
      available: false
    }
  ]

  /**
   * 下拉刷新首页展示的今日课表
   */
  Taro.usePullDownRefresh(() => {
    updateScheduleInfo()
  })

  Taro.useShareAppMessage( res => {
    return {
      title: 'e广科',
      desc:'e广科，你的校园小助手',
      path: '/pages/index/index'
    }
  })

  /**
   * 渲染首页展示所需要的卡片
   * @returns 首页展示卡片
   */
  const navCard = () => {
    return <View className='grid grid-cols-4 gap-x-4 gap-y-12 py-8'>
      {
        navList &&
        navList.map((item, index) => (
          <View key={index} className='flex flex-col items-center' onClick={() => goView(item.url,item.available)}>
            <Image className='w-50 h-50 mb-8' src={item.icon} />
              <Text className={item.available? 'text-14 text-gray-600':'text-14 text-gray-400'}>{item.text}</Text>
          </View>
        ))
      }
    </View>
  }

  /**
   * 渲染首页需要展示的课表
   * @returns 首页展示的今日课表
   */
  const scheduleCard = () => {
    return <>
      {
        scheduleList.length === 0
        ?
        <View className='flex justify-center h-57 leading-57'>
          '今天没有课~😆'
        </View>
        :
        scheduleList.map((item: scheduleItem, index) => (
        <View key={index} className='flex justify-between h-57 px-5 border-0 border-b-1 border-solid border-gray-100'>
          <View className=''>
            <View className='mt-6 text-gray-600 text-16'>{item.name}</View>
            <View className='mt-6 text-gray-400'>{item.time}</View>
          </View>
          <View className='leading-57 text-16 text-gray-600'>
            {item.place}
          </View>
        </View>
        ))
    }
    </>

  }

  /**
   * 点击跳转功能
   * @param url 由navList定义的跳转目的地址
   * @param available 由navList定义的该功能是否开放
   */
  const goView = (url: string, available: boolean) => {
    if (available) {
      Taro.navigateTo({
        url
      })
    }else {
      Taro.showToast({
        title: '功能暂未开放',
        icon: 'none',
        duration: 1000
      })
    }
  }

  /**
   * 跳转到课表页面
   */
  const goSchedule = () => {
    Taro.navigateTo({
      url:'../../subPackages/classSchedule/index'
    })
  }

  /**
   * 发送异步请求拿到今日课表信息
   */
  const getScheduleInfo = () => {
    loginLoad().then( async() =>{
      const res:any  = await getToday()
      setScheduleList(res.detail)
    }).catch(e=>console.log(e));
  }

  /**
   * 发送异步请求跟新今日课表信息
   */
  const updateScheduleInfo = async() => {
    loginLoad().then( async() =>{
      const res:any = await updateToday()
      if(res.message === 'success') {
        setScheduleList(res.detail)
        Taro.showToast({
          title: '刷新成功',
          icon: 'success',
          duration: 1500
        })
      }

    }).catch(e=>console.log(e));
  }

  /**
   * 发送异步请求获取今日公告
   */
  const getNoticesInfo =  async () => {
    const res: any = await getNotices()
    if (res.message === 'success') {
      setNotice(res.detail)
    }
  }

  useDidShow(() => {
    //
    if(getCache('mzsm') != '' && getCache('token') == '') {
      session_login()
    }
  })
  // 相当于onReady函数，页面初次渲染之后触发（只是初次，下一次页面渲染就没他什么事），只触发一次。
  useReady(() => {
    getScheduleInfo()
    getNoticesInfo()
    // \r\n的换行只有在真机测试才能生效
    var content = '使用本小程序(e广科)\r\n即代表同意以下条款：\r\n1.e广科提供内容或服务仅供于个人学习、研究或欣赏娱乐等用途。\r\n2.使用e广科绑定教务系统，即同意e广科代理取得教务系统个人相关信息，包括成绩与课表等\r\n3.e广科提供的内容均会缓存在e广科后台，用户使用时自动更新\r\n4.取得信息均以本校教务系统为准，e广科无法保证信息的实时性\r\n5.使用本工具风险由您自行承担，e广科不承担任何责任'
    // 免责声明
    if(getCache('mzsm') === '')
    Taro.showModal({
      title: '免责声明',
      content: content,
      confirmColor: "#1f7bff",
      showCancel: false,
      success: () => {
        setCache('mzsm',1)
        session_login()
      }
    })


  })

  return (
    <View className='Index'>
      <View className='p-8'>
        <CCard content={navCard()} />
      </View>
      <View className='p-8' onClick={() => goSchedule()}>
        <Notice title={'课表安排'} content={scheduleCard()}/>
      </View>
      <View className='p-8'>
        {
          notice &&
          notice.map((e: any,i) => {
            return <View className='mb-30rpx'>
              <Notice key={e.id} title={'系统公告'} content={e.body}/>
            </View>

          })
        }
      </View>
    </View>
  )

}

export default Index
