import { View } from '@tarojs/components'

type PropsType = {
  content: object
}

export const CCard = (props: PropsType): JSX.Element => {
  return (
    <View className='bg-white border-2 border-gray-200 rounded-md shadow-xl bg-blend-screen p-8 rounded-xl'>
      <View className='p-4'>
        {props.content}
      </View>
    </View>
  )
}
