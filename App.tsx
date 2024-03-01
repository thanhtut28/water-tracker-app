import { StatusBar } from 'expo-status-bar'
import { Center } from 'native-base'
import AppContainer from './src/components/app-container'
import Navigator from './src'

export default function App() {
  return (
    <AppContainer>
      <Navigator />
    </AppContainer>
  )
}
