import { ImageSourcePropType } from 'react-native'
import { Box, VStack, Heading, Image } from 'native-base'

interface Props {
  image: ImageSourcePropType
  children: React.ReactNode
}

const Masthead = ({ image, children }: Props) => {
  return (
    <VStack h="300px" pb={5}>
      <Image
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        w="full"
        h="300px"
        resizeMode="cover"
        source={image}
        alt="Masthead Image"
      />
      {children}
    </VStack>
  )
}

export default Masthead
