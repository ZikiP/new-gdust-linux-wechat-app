import { Image, Text, View } from '@tarojs/components'
import './index.scss'
import { CCard } from '@components/CCard'
import { Notice } from '@components/Notice'
import Kb from '@img/core/kb.png'
import Cj from '@img/core/cj.png'
import Dfd from '@img/core/df@disabled.png'
import Jyd from '@img/core/jy@disabled.png'
import Zsd from '@img/core/zs@disabled.png'
import Taro, { useReady } from '@tarojs/taro'
import {setCache, getCache} from '@/utils/storage'

type navItem = {
  icon: string,
  text: string,
  url: string,
  available: boolean
}

type navType = Array<navItem>

const Index = (): JSX.Element => {
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
      url: '',
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

  const navCard = () => {
    return <View className='grid grid-cols-4 gap-x-4 gap-y-12 py-8'>
      {
        navList &&
        navList.map((item, index) => (
          <View key={index} className='flex flex-col items-center' onClick={() => goView(item.url,item.available)}>
            <Image className='w-50 h-50 mb-8' src={item.icon} />
            {
              item.available?
              <Text className='text-14 text-gray-600'>{item.text}</Text>
              :
              <Text className='text-14 text-gray-400'>{item.text}</Text>
            }
          </View>
        ))
      }
    </View>
  }

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

  // 相当于onReady函数，页面初次渲染之后触发（只是初次，下一次页面渲染就没他什么事），只触发一次。
  useReady(() => {
    var content = '使用本小程序(e广科)\r\n即代表同意以下条款：\r\n1.e广科提供内容或服务仅供于个人学习、研究或欣赏娱乐等用途。\r\n2.使用e广科绑定教务系统，即同意e广科代理取得教务系统个人相关信息，包括成绩与课表等\r\n3.e广科提供的内容均会缓存在e广科后台，用户使用时自动更新\r\n4.取得信息均以本校教务系统为准，e广科无法保证信息的实时性\r\n5.使用本工具风险由您自行承担，e广科不承担任何责任'
    // 免责声明
    if(getCache('mzsm') == '')
    Taro.showModal({
      title: '免责声明',
      content: content,
      confirmColor: "#1f7bff",
      showCancel: false,
      success: () => {
        setCache('mzsm',1)
      }
    })


  })

  return (
    <View className='Index'>
      <View className='p-8'>
        <CCard content={navCard()} />
      </View>
      <View className='p-8'>
        <Notice title={'系统公告'} content={'欢迎使用e广科，e广科是一款丰富校园生活的小程序，教务系统每晚8点钟关闭，期间小程序将无法登录以及无法刷新课表。如有建议和异常欢迎您反馈，我们将会第一时间处理。'}/>
      </View>
      <View className='p-8'>
        <Notice title={'课表安排'} content={''}/>
      </View>
    </View>
  )

}

export default Index
