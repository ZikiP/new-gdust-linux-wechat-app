import { View,Text} from '@tarojs/components'

type PropsType = {
  title: any
  content: any
}


export const Notice = (props: PropsType): JSX.Element => {
  return (
    <View className='bg-white  shadow-2xl bg-blend-screen py-8 pr-2 rounded-xl'>
      <View className='py-4 pr-2'>
        <View className='h-20 flex justify-between border-0 border-l-8 border-solid border-blue-400'>
          <Text className='text-xs notice-color line ml-9'>{props.title}</Text>
          <Text className='text-14 notice-color mr-8'>{'MORE >'}</Text>
        </View>
        <View className='text-14 px-16 mt-16 text-gray-600'>
          {props.content}
        </View>
      </View>
    </View>
  )
}
