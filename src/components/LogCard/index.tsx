import { View,Text } from '@tarojs/components'

type PropsType = {
  version : string
  date: string
  content: Array<object>
}

const Logs = (content):JSX.Element => {
 return content.map((e, i) => {
    return <Text key={i} className="pb-8 text-16">
      {i+1}. {e.data}
    </Text>
  })
}

export const LogCard = (props: PropsType): JSX.Element => {
  return (
    <View className="flex flex-col leading-28 mt-7 border-0 border-solid border-t-1 border-b-1 border-gray-200 bg-white flex-nowrap box-border pt-10 px-22 pb-15 w-full text-gray-600">
      <View className="flex justify-between text-18 mb-8 leading-32">
        <Text className="flex-1">{props.version}</Text>
        <Text className="text-16 text-gray-400">{props.date}</Text>
      </View>
        {
          Logs(props.content)
        }
    </View>
  )
}
