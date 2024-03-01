import { extendTheme } from 'native-base'

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark'
}

const colors = {
  primary: {
    50: '#D2D4FB',
    100: '#CBCDFB',
    200: '#BDBFFA',
    300: '#AFB2F9',
    400: '#A0A4F7',
    500: '#9296F6',
    600: '#8489F5',
    700: '#767BF4',
    800: '#686DF3',
    900: '#5A60F2',
    950: '#5359F1'
  },
  secondary: {
    50: '#EEF2F6',
    100: '#CFD9E7',
    200: '#B1C1D8',
    300: '#92A9C9',
    400: '#7491B9',
    500: '#5578AA',
    600: '#446088',
    700: '#334866',
    800: '#223044',
    900: '#090c0f'
  }
}

export default extendTheme({ config, colors })
