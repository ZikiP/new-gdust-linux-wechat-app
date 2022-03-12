import { View,Image, Button} from '@tarojs/components'

type PropsType = {
  icon: string
  title: string
  url: string
}


export const UCard = (props: PropsType): JSX.Element => {
  console.log(props.url)
  return <View>
    {
      props.url === ''?
      <Button openType='feedback' className='w-full text-14 text-gray-600 px-0'>
      <View className='flex h-42 items-center px-16 border-0 border-t-1 border-solid border-gray-200'>
        <Image className='w-15 h-15 mr-8' src={props.icon}></Image>
        <View text-gray-600 text-14>{props.title}</View>
      </View>
    </Button>
    :
    <Button className='w-full text-14 text-gray-600 px-0'>
      <View className='flex h-42 items-center px-16 border-0 border-t-1 border-solid border-gray-200'>
        <Image className='w-15 h-15 mr-8' src={props.icon}></Image>
        <View text-gray-600 text-14>{props.title}</View>
      </View>
    </Button>
    }
  </View>

}

export default UCard
