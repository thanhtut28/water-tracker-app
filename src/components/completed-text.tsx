import { HStack, Text } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { makeStyledComponent } from '../utils/styled'
import { AnimatePresence, View } from 'moti'

const StyledView = makeStyledComponent(View)

const CompletedText = () => {
  return (
    <AnimatePresence>
      <StyledView
        from={{
          opacity: 0,
          marginBottom: -42
        }}
        animate={{
          opacity: 1,
          marginBottom: 0
        }}
      >
        <HStack alignItems="center" space={2}>
          <Text fontSize={24} fontWeight="bold">
            Completed
          </Text>
          <AntDesign name="checkcircle" size={24} color="#5cb85c" />
        </HStack>
      </StyledView>
    </AnimatePresence>
  )
}

export default CompletedText
