import { Button, Form, Input, Text, View, Image } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro';
import { useState } from 'react';
import { LoginBind } from '~/src/service/servers';
import { getCache, setCache } from '~/src/utils/storage';
import Logo from '@img/more/logo.png'
import Wave from '@img/more/wave.png'


type InputType = "username" | "password"

const Login = (): JSX.Element => {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useReady(()=> {

  })

  function handleChange(type: InputType, event) {
    const { value } = event.detail;
    if (type === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
  }

  const formSubmit = () => {
    if (!username || !password) {
      Taro.showModal({
        title: '提醒',
        content: '用户名和密码不能为空哦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return false
          }
        }
      })
    } else {
      const loginData = {
        account: username
        , password
      }
      const login = async () => {
        const loginRes: any = await LoginBind(loginData)
        if (loginRes && loginRes.message === "账号绑定成功") {
          setCache('token', loginRes.detail.token)
          setCache('account', loginRes.detail.account)
          setCache('openid', loginRes.detail.openid)
          Taro.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            // 直接跳转回首页
            Taro.reLaunch({
              url: '/pages/index/index'
            })
          }, 1000)
        } else {
          Taro.showModal({
            title: '绑定失败',
            content: '检查一下用户名或密码哦',
            showCancel: false
          })
        }
      }
      login().catch((error) => { console.log(error) })
    }
  }
  return (
    <View className='theme-bg-color items-stretch p-0 h-full w-full absolute overflow-hidden -top-50 '>
      <View className='bg-gray-200 flex flex-1 relative z-10 flex-col items-stretch justify-center w-full h-full pb-225 animate-rise'>
        <View className='relative flex flex-1 felx-col items-stretch animate-bd-rise'>
          <Form onSubmit={formSubmit} className='bg-gray-200 flex flex-1 flex-col items-stretch justify-center'>
            <View className='flex mx-auto items-center py-12 px-5 w-92_100 h-30 my-20 mx-3_100 bg-white rounded-xl input-border'>
              <Text className='text-gray-600 text-18 h-16 leading-16 py-0 px-13 border-0 border-r-2 border-solid border-gray-300 '>帐号</Text>
              <Input className='pl-13' type='text' onInput={(e): void => { handleChange("username", e) }} placeholder='请输入学号' />
            </View>
            <View className='flex mx-auto items-center py-12 px-5 my-20 w-92_100 h-30 mx-3_100 bg-white rounded-xl input-border'>
              <Text className='text-gray-600 text-18 h-16 leading-16 py-0 px-13 border-0 border-solid border-r-2 border-gray-300'>密码</Text>
              <Input className='pl-13' type='text' onInput={(e): void => { handleChange("password", e) }} placeholder='请输入密码' />
            </View>
          <View className="w-95_100 mx-auto tracking-widest">
            <Button className='theme-bg-color mt-50 text-white' formType="submit">确认绑定</Button>
          </View>
          </Form>
        </View>
      </View>
    </View>
  )
}


export default Login
