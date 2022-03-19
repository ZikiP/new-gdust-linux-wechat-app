import { View, Text, ScrollView, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { getCurrentInstance, useDidShow, useTabItemTap } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { loginLoad } from '~/src/service/handleService'
import { getSchedule, updateSchedule } from '~/src/service/servers'
import formatTime from '~/src/utils/formatTime'
import { getCache, setCache } from '~/src/utils/storage'
import Left from '@img/core/common/left_g.png'
import Right from '@img/core/common/right_g.png'
import Down from '@img/core/common/down_w.png'

const ClassSchedule = (): JSX.Element => {

  const classInfo ={
    days: ['一', '二', '三', '四', '五', '六', '日'],
    weeks: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周', '第八周', '第九周', '第十周', '十一周', '十二周', '十三周', '十四周', '十五周', '十六周', '十七周', '十八周', '十九周', '二十周', '二十一周', '二十二周', '二十三周', '二十四周', '二十五周', '二十六周'],
    time:[ //课程时间与指针位置的映射，{begin:课程开始,end:结束时间,top:指针距开始top格数}
      {
        begin: '0:00',
        end: '8:29',
        beginTop: -4,
        endTop: -4
      },
      {
        begin: '8:30',
        end: '10:05',
        beginTop: 0,
        endTop: 200
      },
      {
        begin: '10:06',
        end: '10:24',
        beginTop: 204,
        endTop: 204
      },
      {
        begin: '10:25',
        end: '12:00',
        beginTop: 208,
        endTop: 408
      },
      {
        begin: '12:01',
        end: '14:39',
        beginTop: 414,
        endTop: 414
      },
      {
        begin: '14:40',
        end: '16:15',
        beginTop: 420,
        endTop: 620
      },
      {
        begin: '16:15',
        end: '16:29',
        beginTop: 624,
        endTop: 624
      },
      {
        begin: '16:30',
        end: '18:05',
        beginTop: 628,
        endTop: 828
      },
      {
        begin: '18:06',
        end: '19:29',
        beginTop: 834,
        endTop: 834
      },
      {
        begin: '19:30',
        end: '21:05',
        beginTop: 840,
        endTop: 1040
      },
      {
        begin: '20:41',
        end: '20:49',
        beginTop: 1044,
        endTop: 1044
      },
      {
        begin: '20:50',
        end: '23:59',
        beginTop: 1048,
        endTop: 1254
      },
    ]
  }
  const [timelineTop, setTimelineTop] = useState<number>(0)
  const [scroll_left, setScroll_left] = useState<number>(0)
  const [delayShow, setDelayShow] = useState<boolean>(true)
  const [targetLessons, setTargetLessons] = useState<Array<any>>([])
  const [targetX, setTargetX] = useState<number>(0) //target x轴top距离
  const [targetY, setTargetY] = useState<number>(0) //target y轴left距离
  const [targetDay, setTargetDay] = useState<number>(0) //target day
  const [targetWid, setTargetWid] = useState<number>(0) //target wid
  const [targetI, setTargetI] = useState<number>(0) //target 第几个active
  const [targeLen, setTargetLen] = useState<number>(0) //target 课程长度
  const [blur, setBlur] = useState<boolean>(false)
  const [today, setToday] = useState<number>(0) //当前星期数
  const [toweek, setToweek] = useState<number>(1) //当前周数
  const [week, setWeek] = useState<number>(1) //视图周数（999 表示学期视图）
  const [month, setMonth] = useState<number>(0) //当前月份数
  const [lessons, setLessons] = useState<Array<any>>([]) //课程data
  const [dates, setDates] = useState<Array<any>>([]) //本周日期
  const [changeLook, setChangeLook] = useState<boolean>(false) // 底部卡片视图是否切换

  useEffect(()=> {
    loginLoad().then(()=> {
      getClassSchedule().catch(err=> {
        kbRender([])
        console.log(err);
      })
    }).catch(err => {
      console.log(err)
    })
  },[])

  useDidShow(() => {
    // 计算timeline时针位置
    function parseMinute(str) {
      return str.split(':')[0] * 60 + parseInt(str.split(':')[1]);
    }
    function compareDate(str1, str2) {
      return parseMinute(str1) <= parseMinute(str2);
    }
    let nowTime = formatTime(new Date(), 'h:m')
    classInfo.time.forEach((e,i)=> {
      if (compareDate(e.begin, nowTime) && compareDate(nowTime, e.end)) {
        setTimelineTop(Math.round(e.beginTop + (e.endTop - e.beginTop) * (parseMinute(nowTime) - parseMinute(e.begin)) / 100))
      }
    })
    const nowWeek = new Date().getDay();
    setScroll_left((nowWeek === 6 || nowWeek === 0)? 102 :0)
    console.log(timelineTop)
  })

  Taro.usePullDownRefresh(()=> {
    updateClassSchedule()
  })
  /**
   * 获取课表页面课表信息
   * @returns
   */
  const getClassSchedule = async() => {
    if(getCache('kb') !== '') {
      Taro.showToast({
        icon: 'none',
        title: '加载缓存',
        duration: 1500
      })
      kbRender(getCache('kb'))
      return new Promise<void>((resolve, reject) => {
        resolve()
      })
    }

    Taro.showNavigationBarLoading()
      const res:any = await getSchedule()
      let data = res.detail
      if(data) {
        kbRender(data)
        setCache('kb',data)
        Taro.hideNavigationBarLoading();
        return new Promise<void>((resolve, reject) => {
          resolve()
        })
      }

  }

  /**
   * 渲染课表
   * @param data
   */
  const kbRender= (data:any) => {
    let today = parseInt(data.today); //星期几，0周日,1周一
    today = today === 0 ? 6 : today - 1; //0周一,1周二...6周日
    let week = data.week // 当前周
    let toweek = week
    if (today === 6) {
      toweek -= 1
      if (week != 1) {
        week -= 1
      }
    }
    let lessons = data.lessons
    //各周日期计算
    var nowD = new Date()
    let dates = classInfo.weeks.slice(0) as any//0:第1周,1:第2周,..19:第20周
    dates = dates.map((e,m)=> {
      let idates = classInfo.days.slice(0) as any //0:周一,1:周二,..6:周日
      idates = idates.map((e,i)=> {
        let d = (m === (week - 1) && i === today) ? nowD : new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate() - ((week - 1 - m) * 7 + (today - i)));
        return {
          month: d.getMonth() + 1,
          date: d.getDate()
        }
      })
      return idates;
    })
    setToday(today)
    setWeek(week)
    setToweek(toweek)
    setLessons(lessons)
    setDates(dates)
    setMonth(dates[week-1][0].month)
  }

  /**
   * 更新课表页面信息
   * @returns
   */
  const updateClassSchedule = async() => {
    const res:any = await updateSchedule()
    const data =res.detail
    console.log(data)
    if(data) {
      kbRender(data)
      setCache('kb',data)
      Taro.hideNavigationBarLoading()
      Taro.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      })
      return new Promise<void>((resolve, reject) => {
        resolve()
      })
    }
  }

  /**
   * 更新视图所在位置
   * @param e 触摸事件
   */
  const onScroll = (e) => {
    // 防抖
    let t = setTimeout(()=> {
      setScroll_left(e.detail.scrollLeft)
    },500)
    if (t) {
      clearTimeout(t)
    }
  }

  /**
   *
   * @param day
   * @param wid
   * @param cid
   * @returns
   */
  const showDetail =(day:any, wid:any, cid:any)=> {
    let ilessons = lessons[day][wid]
    let targetI = 0
    ilessons[cid].target = true
    if (week != 999) {
      ilessons = ilessons.filter((e)=> {
        return e.weeks_arr.indexOf(week)!== -1
      })
    }
    ilessons.map((e,i)=>{
      if (ilessons.length === 1) {
        e.left = 0
      }else {
        //笼罩层卡片防止超出课表区域
        //周一~周四0~3:n lessons.length>=2*n+1时，设置left0为-n*128，否则设置为-60*(lessons.length-1)；
        //周日~周五6~4:n lessons.length>=2*(6-n)+1时，设置left0为-(7-n-lessons.length)*128，否则设置为-60*(lessons.length-1)；
        let left0 = -60 * (ilessons.length - 1)
        if (day <=3 && ilessons.length >=2 * day +1) {
          left0 = -day * 128;
        } else if (day >= 4 && ilessons.length >= 2 * (6 - day) + 1){
          left0 = -(7 - day - ilessons.length) * 128;
        }
        e.left = left0 + 128 * i;
      }
      return e
    })
    ilessons.forEach((e,i) => {
      if (e.target) {
        targetI = i;
        ilessons[i].target = false
      }
    });
    if (!ilessons.length) {
      return false
    }
    setTargetX(day * 129 + 35 + 8)
    setTargetY(wid%2==0? wid * 206 + Math.floor(wid / 2) * 4 + 62: wid * 206 + Math.floor(wid / 2) * 4 + 68)
    setTargetDay(day)
    setTargetI(targetI)
    setTargetWid(wid)
    setTargetLessons(ilessons)
    setTargetLen(ilessons.length)
    setBlur(true)
  }

  const hideDetail = () => {
      setBlur(false) ,
      setTargetLessons([]),
      setTargetX(0),
      setTargetY(0),
      setTargetDay(0),
      setTargetWid(0),
      setTargetI(0),
      setTargetLen(0)
  }

  const returnCurrent = () => {
    setWeek(toweek)
  }
  const swiperChangeBtn = (direction) => {
    let flag = 0
    if (delayShow) {
      setDelayShow(false)
      if (week == 1 && direction === 'left') {
        flag = 0;
      } else if (direction == 'left') {
        flag = -1
      } else if (direction == 'right') {
        flag = 1
      }
      setWeek(week+flag)
    }
    setDelayShow(true)
  }
  const currentChange = (e) => {
    if (!changeLook) {
      setChangeLook(true)
      let current = e.detail.current
      setWeek(current+1)
      setChangeLook(false)
    }
  }
  const infoCardTop = (e,cid) => {
    e.stopPropagation();// 防止事件冒泡。
    if(targetI === cid) {
      return false
    }
    setTargetI(cid)
  }
  const topList = ():JSX.Element => {
    return <View className={`absolute top-0 left-0 flex w-910rpx h-30 pl-5 border-0 border-b-1 border-solid border-gray-200 ml-18 text-gray-600 overflow-hidden ${blur? 'filter-blur-3px':''}`}>
      {
        dates[week-1] &&
        dates[week-1].map((item, index) => (
          <View key={index} className='flex flex-1 flex-col items-stretch justify-center text-center w-60 mr-5 text-14 leading-16'>
            <Text className='text-gray-600'>{item.date === 1? item.month + '月' : item.date}</Text>
            <Text className='text-gray-600'>周{classInfo.days[index]}</Text>
          </View>
        ))
      }
    </View>
  }
  const kbCards = ():JSX.Element => {
    return <View className={`${blur? 'filter-blur-3px ':''}absolute w-910rpx h-1248rpx top-0 left-0 flex flex-1 items-stretch pt-4 pr-0 pb-6 pl-5 ml-35rpx mt-60rpx pb-100rpx overflow-hidden kb-cards-transition`}>
        {
          lessons &&
          lessons.map((day_lesson, day)=> {
            // 每一列为一组
            return <View key={day} className='relative flex flex-1 flex-col items-stretch w-120rpx h-full bg-transparent mr-5'>
              {/* today 0周一,1周二 */}
              {
                // 在今天的那一列渲染一个半透明遮罩
                today === day && toweek === week?
                <>
                  <View className='absolute w-120rpx -top-4 -bottom-6 z-1 opacity-60 transition-all duration-100 mask-bg' style={`background:-webkit-gradient(linear,left top,left bottom,from(#eff7ff),color-stop(${(timelineTop+4)/1260}, #8cc4ff),to(#eff7ff));`}></View>
                  <View className='hidden absolute left-0 right-0 top-1_2 -mt-1 w-120rpx h-5rpx theme-bg-color z-99 opacity-60 kb-timeline'
                  style={`display:block !important; top:${timelineTop}rpx`}
                  ></View>
                </>
                :
                ''
              }
              {
                // 渲染当天的6节课
                day_lesson.map((item, wid)=> {
                  return <View key={wid} className={`relative z-10 w-60 min-h-200rpx rounded-xl ${wid%2==0?'mb-4':'mb-6'}`}>
                    {
                      day_lesson[wid].map((cards,cid)=> {
                        return cards.weeks_arr.map((iweek, index)=> {
                         return (parseInt(iweek) === week || week === 999)?
                          <View style={`height: ${cards.section*100}rpx`}
                          onClick={()=>showDetail(day,wid,cid)}
                          className={`mb-4 absolute z-11 w-60 min-h-200rpx py-0 px-5 text-center box-border ${parseInt(iweek) === week || week === 999? cards.color:''} rounded-xl flex flex-col flex-nowrap overflow-hidden text-white`}
                          key={index}
                          >
                            {
                              // 判断上课地点是数字还是中文
                              <Text className={parseInt(cards.place)< 99999 ?'text-16 py-15rpx px-0':'text-18 py-15rpx px-0 leading-20'}>{cards.place}</Text>
                            }
                            <View className='flex flex-1 items-center justify-center '>
                              <Text className='text-25rpx leading-27rpx pb-5rpx'style={`-webkit-line-clamp:${3*(cards.section-1)};`}>{cards.name}</Text>
                            </View>
                          </View>
                          :
                          ''
                        })
                      })
                    }
                  </View>
                })
              }
            </View>
          })
        }
    </View>
  }

  const mask = ():JSX.Element => {
    return <>
     {blur?
      <View onClick={hideDetail}
        className="absolute z-998 top-0 left-0 right-0 w-910rpx h-1248rpx pt-68rpx pr-0 pb-100rpx pl-45rpx mask-transition"
      >
        <View className='absolute z-999 w-120rpx' style={`top:${targetY}rpx; left:${targetX}rpx;`}>
          {
            targetLessons &&
            targetLessons.map((cards,cid)=> {
              return <View style={`height:${cards.section*100}rpx !important; left:${cards.left}rpx`}
                className={`absolute z-11 w-120rpx min-h-200rpx py-0 px-5 text-center box-border rounded-xl flex flex-col overflow-hidden text-white shadow-xl flex-nowrap
                kb-detail-transition
                ${cards.color} ${targetI === cid ? 'kb-detail-active':''}`}
                onClick={(e)=>infoCardTop(e,cid)}
              >
                {
                    // 判断上课地点是数字还是中文
                    <Text className={parseInt(cards.place)< 99999 ?'text-16 py-15rpx px-0':'text-18 py-15rpx px-0 leading-20'}>{cards.place}</Text>
                }
                <View className='flex flex-1 items-center justify-center overflow-hidden'>
                  <Text className='text-25rpx pb-5rpx mask-card-content'style={`-webkit-line-clamp:${3*(cards.section-1)};`}>{cards.name}</Text>
                </View>
              </View>
            })
          }
        </View>
      </View>
      :
      ''
      }
    </>
  }

  const bottomCard = ():JSX.Element => {
    return <View catchMove
      className={`fixed z-1000 left-0 right-0 bottom-0 w-full h-500rpx flex flex-col items-stretch rounded-t-lg pb-30rpx bg-blue-300 text-14 kb-detail-transition
        bottom-card-transform ${blur? 'bottom-card-open-transform':''}
      `}
    >
      {
        (!blur)
        ?
        <View className='text-white h-100rpx w-full flex items-center'>
          {
            week != 99999?
            <>
            {
              <Text className='w-150rpx'>{}</Text>
            }
            {
              week != 99999?
              <View className='flex flex-1 flex-row relative text-16 h-full my-0'>
                <View className='absolute z-999 top-0 w-50rpx h-full flex items-center justify-center left-70rpx'
                  onClick={() => swiperChangeBtn('left')}
                >
                  <Image className='w-30rpx h-30rpx opacity-50' src={Left}></Image>
                </View>
                <Swiper
                  circular
                  className='h-full w-full'
                  onChange={(e)=>currentChange(e)} current={week-1}
                  duration={300}
                >
                  {
                    classInfo.weeks.map((e,i)=> {
                      return <SwiperItem key={i} className='flex justify-center items-center w-full h-full text-center'>
                        <Text  className={`text-15 ${i===toweek-1?'font-bold':'' }`}>{e}</Text>
                      </SwiperItem>
                    })
                  }
                </Swiper>
                <View className='absolute z-999 top-0 w-50rpx h-full flex items-center justify-center right-70rpx'
                  onClick={() => swiperChangeBtn('right')}
                >
                  <Image className='w-30rpx h-30rpx opacity-50' src={Right}></Image>
                </View>
              </View>

              :
              ''
            }
            {
              <Text className='w-150rpx py-10 px-5 text-center' onClick={()=>returnCurrent()}>{toweek===week?`星期${classInfo.days[today]}`:`返回第${toweek}周` }</Text>
            }
            </>
            :
            <View>
              <Text className='w-150rpx py-10 px-5 text-center'>{toweek}周周{classInfo.days[today]}</Text>
            </View>
          }
        </View>
        :
        <>
          <View className='text-white h-100rpx w-full flex items-center'>
            <Text className='w-150rpx text-16 py-10 px-5 text-center'>{`${week!=99999? week+'周周'+classInfo.days[targetDay]:'星期'+classInfo.days[targetDay]}`}</Text>
            <Text className='text-16 flex-1 w-250rpx text-left pl-5'>{targetWid*2+1}-{targetWid*2+targetLessons[targetI].section}节</Text>
            <Image className="w-15 h-15 py-25rpx px-35rpx" src={Down} onClick={() => hideDetail()}></Image>
          </View>
        </>

      }
      <View className={`flex flex-nowrap w-full h-350rpx bg-blue-300 box-border p;-10 overflow-hidden ${blur?'opacity-100 transform translate-y-0rpx':'opacity-0 transform translate-y-400rpx'}`}>
        {
          targetLessons.map((e,cid) => {
            return <View key={cid} className='w-full h-400rpx flex flex-col flex-nowrap items-stretch text-white box-border py-0 px-5 kb-detail-transition'>
              <View className='flex items-center h-100rpx w-580rpx pt-o pr-0 pl-10'>
                <Text className='text-20'>{e.name}</Text>
              </View>
              <View className='relative flex flex-1 flex-col items-stretch justify-center pl-15rpx'>
                <View className='relative z-2 flex items-center flex-nowrap whitespace-nowrap text-14 py-3 px-0'>
                  <Text className='flex-shrink-0 text-18'>任课教师：{e.teacher}</Text>
                </View>
                <View className='relative z-2 flex items-center flex-nowrap whitespace-nowrap text-14 py-3 px-0'>
                  <Text className='flex-shrink-0 text-18'>上课地点：{e.place}</Text>
                </View>
                <View className='relative z-2 flex items-center flex-nowrap whitespace-nowrap text-14 py-3 px-0'>
                  <Text className='flex-shrink-0 text-18'>课程周数：{e.weeks_text}</Text>
                </View>
              </View>
            </View>
          })
        }
      </View>
    </View>
  }

  return (
    <View className='bg-white pb-0 w-full h-full absolute overflow-hidden'>
      <View className={
        blur?
        'relative w-full h-1328rpx flex flex-row mian-box-transition pb-500rpx'
        :
        'relative w-full h-1328rpx flex flex-row pb-50 mian-box-transition'}>
        <View className={
          blur?
          'absolute top-0 left-0 z-100 text-14 flex flex-shrink-0 w-35rpx h-full flex-col items-stretch bg-white border-0 border-r-1 border-solid border-gray-200 mb-6 text-gray-600 pb-100rpx overflow-hidden filter-blur-3px'
          :
          'absolute top-0 left-0 z-100 text-14 flex flex-shrink-0 w-35rpx h-full flex-col items-stretch bg-white border-0 border-r-1 border-solid border-gray-200 mb-6 text-gray-600 pb-100rpx overflow-hidden'}>
          <View className='h-30 text-14 leading-15 flex flex-col items-center justify-center border-0 border-b-1 border-b-gray-200  border-solid text-gray-600'>
            {week != 999?
              <>
              <Text>{month}</Text>
              <Text>月</Text>
              </>
              :
              ''
            }
          </View>
          <View className="pt-4 h-50 leading-50 text-center">1</View>
          <View className="mb-4 h-50 leading-50 text-center">2</View>
          <View className='h-50 leading-50 text-center'>3</View>
          <View className="mb-6 h-50 leading-50 text-center">4</View>
          <View className='h-50 leading-50 text-center'>5</View>
          <View className="mb-4 h-50 leading-50 text-center">6</View>
          <View className='h-50 leading-50 text-center'>7</View>
          <View className="mb-6 h-50 leading-50 text-center">8</View>
          <View className='h-50 leading-50 text-center'>9</View>
          <View className="mb-4 h-50 leading-50 text-center">10</View>
          <View className='h-50 leading-50 text-center'>11</View>
          <View className='h-50 leading-50 text-center'>12</View>
          <View className="absolute left-0 top-1_2 mt-29 w-0 h-0 leading-0 border-10 border-solid border-transparent border-l-blue-600 opacity-60" style={`top:${timelineTop}rpx`}></View>
        </View>
        <ScrollView className='flex flex-1 w-full h-1416rpx flex-col items-stretch scroll-transition'
          onScroll={onScroll}
          scrollX
          scrollLeft={scroll_left}
          enableFlex
        >
          {/* 头部星期数 */}
          {
            week != 999 ?
            topList()
            :
            ''
          }
          {/* 课表视图 */}
          {
            kbCards()
          }
          {/* 遮罩层 */}
          {
            mask()
          }
          {/* 底部 */}
          {
            bottomCard()
          }

        </ScrollView>
      </View>

    </View>
  )
}
export default ClassSchedule
