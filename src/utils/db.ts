import { Platform } from 'react-native'
import * as SQLite from 'expo-sqlite'
function openDatabase() {
  if (Platform.OS === 'web') {
    return {
      transaction: () => {
        return {
          executeSql: () => {}
        }
      }
    }
  }

  const db = SQLite.openDatabase('db.db')
  return db
}

const db = openDatabase()
export default db
