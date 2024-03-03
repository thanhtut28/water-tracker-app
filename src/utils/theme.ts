import { extendTheme } from 'native-base'

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark'
}

const colors = {
  primary: {
    50: '#E2D3FB',
    100: '#DECBFB',
    200: '#D4BDFA',
    300: '#CBAFF9',
    400: '#C2A1F8',
    500: '#B993F6',
    600: '#B085F5',
    700: '#A676F4',
    800: '#9D68F3',
    900: '#945AF2',
    950: '#8F53F1'
  },
  secondary: {
    50: '#4B417B',
    100: '#483E76',
    200: '#41396C',
    300: '#3B3462',
    400: '#352E58',
    500: '#2F294E',
    600: '#292444',
    700: '#231F3A',
    800: '#1D1930',
    900: '#171426',
    950: '#141121'
  }
}

export default extendTheme({ config, colors })
