import { View, Text, Image, Form, Input, Button } from "@tarojs/components"
import Cj from '@img/core/cj.png'
import { useEffect, useRef, useState } from "react"
import { getAchievement, getCurrentYear } from "~/src/service/servers"
import { getCache, setCache } from "~/src/utils/storage"
import Taro from "@tarojs/taro"
import { useThrottle } from "~/src/utils/Throttle"

type InputType = "year" | "term"
interface ICurrent {
  fn: Function,
  timer: any
}

const Achievement = ():JSX.Element => {

  const [achievementDatas, setAchievementDatas] = useState<Array<object>>([])
  const [year, setYear] = useState<number>()
  const [term, setTerm] = useState<number>()

  useEffect(()=> {
    getAchievementCache()
  },[])

  Taro.useShareAppMessage( res => {
    return {
      title: '快来e广科查询你的期末成绩单',
      path: '/subPackages/Achievement/index'
    }
  })

  Taro.useShareTimeline(() => {
    return {
      title: '快来e广科查询你的期末成绩单',
      path: '/subPackages/Achievement/index'
    }
  })

  const getAchievementCache = () => {
    if(getCache('achievement') != '') {
      console.log('加载缓存')
      setAchievementDatas(getCache('achievement'))
      Taro.showToast({
        title: '加载历史记录',
        icon: 'none',
        duration: 1000
      })
      Taro.stopPullDownRefresh()
    }
  }

  /**
   * 处理请求到的数据
   * @param data
   * @returns 处理好的对象数组
   */
  const dealData = (data) => {
    setCache('year', data.year)
    setCache('term', data.term)
    let dataList:Array<object> = []
    for (const i in data.score) {
      const course_name =  data.score[i].course_name
      const teacher = data.score[i].teacher
      const credit = data.score[i].credit
      const result = data.score[i].exam_result
      const grade_point = data.score[i].grade_point
      const datas = {
        course_name,
        teacher,
        credit,
        result,
        grade_point
      }
      dataList.push(datas)
    }
    return dataList
  }





  const formSubmit = async() => {
    if (!year || !term) {
      Taro.showModal({
        title: '提醒',
        content: '学年和学期不能为空哦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return false
          }
        }
      })
    } else {
      getAchievementInfo()
    }
  }


  const getAchievementInfo = useThrottle(
    async() => {
      const res:any = await getAchievement(term, year)
        if (res.code === 200) {
          if (Object.keys(res.detail.score).length != 0){
            Taro.showToast({
              title: '查询成功',
              icon: 'success',
              duration: 1000
            })
            const cjDates = dealData(res.detail)
            setAchievementDatas(cjDates)
            setCache('achievement', cjDates)
          }else {
            Taro.showToast({
              title: '查询失败',
              icon: 'error',
              duration: 1000
            })
          }
        }else {
          Taro.showToast({
            title: '查询失败',
            icon: 'error',
            duration: 1000
          })
        }
    }, 1000)

  function handleChange(type: InputType, event) {
    const { value } = event.detail;
    if (type === "year") {
      setYear(value);
    } else {
      setTerm(value);
    }
  }

  const cjCard = ():JSX.Element => {
    return <View className="mt-20rpx">
      {
        achievementDatas &&
        achievementDatas.map((e:any, i)=> {
          return <View key={i} className='flex flex-col border-0 border-t-1 border-solid border-gray-200 py-20rpx'>
            <View className="flex justify-between text-16 text-gray-600 px-20rpx">
              <Text className="font-semibold">{e.course_name}</Text>
              <Text>教师：{e.teacher}</Text>
            </View>
            <View className="flex justify-center text-14 text-gray-500 mt-20rpx">
              <Text className="w-33_100 text-center">学分：{e.credit}</Text>
              <Text className="w-33_100 text-center">绩点：{e.grade_point}</Text>
              <Text className="w-33_100 text-center">总成绩：{e.result}</Text>
            </View>
          </View>
        })
      }
    </View>



  }

  return <View className="px-30rpx">
    <View className="flex flex-row flex-nowrap justify-end items-center py-50rpx px-25rpx">
      <Text className="text-20 font-semibold text-gray-600 mr-30rpx">成绩查询</Text>
      <Image className="w-150rpx h-150rpx opacity-80" src={Cj}></Image>
    </View>
    <View className="h-full bg-white p-30rpx pb-0 mb-100rpx rounded-xl shadow-2xl ">
      <View className=''>
        <Form onSubmit={formSubmit}>
          <View className='flex h-80rpx justify-center items-center'>
            <View className='flex'>
              <Input className='input-border border-0 border-b-1 w-120rpx px-20rpx'
                type='text'
                onInput={(e): void => { handleChange("year", e) }}
                placeholder='xxxx'
              />
              <Text className='text-18 text-gray-600'>学年</Text>
            </View>
            <View className='flex'>
              <Input className='input-border border-0 border-b-1 w-50rpx px-20rpx'
                type='text'
                onInput={(e): void => { handleChange("term", e) }}
                placeholder='1'
              />
              <Text className='text-18 text-gray-600'>学期</Text>
            </View>
            <View className="ml-20rpx">
              <Button className='theme-bg-color text-15 text-white h-50rpx leading-50rpx' formType="submit">查询</Button>
            </View>
          </View>
        </Form>
      </View>
      <View>
        {
          getCache('achievement')?
        <View className="flex justify-center text-center tracking-widest mt-20rpx pt-20rpx border-0 border-t-1 border-solid border-gray-200">
          <Text className="font-medium text-18">{getCache('year')}</Text><Text className="text-18">学年第</Text>
          <Text className="font-medium text-18">{getCache('term')}</Text><Text className="text-18">学期</Text>
        </View>
        :
        ''
        }
        {
          cjCard()
        }
      </View>
    </View>

  </View>
}

export default Achievement
