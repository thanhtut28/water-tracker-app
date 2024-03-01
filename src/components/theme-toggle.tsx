import { HStack, Switch, Text, useColorMode } from 'native-base'

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <HStack alignItems="center" space={2}>
      <Text>Dark</Text>
      <Switch isChecked={colorMode === 'light'} onToggle={toggleColorMode} />
      <Text>Light</Text>
    </HStack>
  )
}

export default ThemeToggle
