import { IButtonProps, Button, View } from 'native-base'

interface Props extends IButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

const ActionButton = ({ children, variant = 'primary', ...props }: Props) => {
  return (
    <View flexDirection="row" justifyContent="center">
      <Button
        w="100%"
        h={16}
        size="lg"
        borderRadius={18}
        borderWidth={1}
        _pressed={{
          bg: variant === 'primary' ? 'primary.700' : 'warmGray.200',
          _text: {
            color: 'secondary.900'
          }
        }}
        borderColor={variant === 'primary' ? 'transparent' : 'warmGray.50'}
        bg={variant === 'primary' ? 'primary.900' : 'warmGray.50'}
        _text={{
          color: variant === 'primary' ? 'secondary.900' : 'secondary.900',
          fontSize: 18,
          alignSelf: 'center',
          fontWeight: 'bold'
        }}
        variant="solid"
        {...props}
      >
        {children}
      </Button>
    </View>
  )
}

export default ActionButton
