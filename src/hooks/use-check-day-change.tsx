import { isSameDay } from 'date-fns'
import { useEffect } from 'react'
import { convertDate } from '../utils/convert-date'
import db from '../utils/db'

export default function useCheckDayChange(
  setIntakeCount: React.Dispatch<React.SetStateAction<number>>
) {
  useEffect(() => {
    const checkDayChange = async () => {
      try {
        console.log('checking')
        const currentDate = new Date()
        let lastUpdated
        db.transaction(tx => {
          tx.executeSql(
            'select last_updated from intake_tracker_info',
            [],
            (_, { rows }) => {
              lastUpdated = rows._array[0].last_updated
              if (lastUpdated) {
                const shouldResetIntakeCount = !isSameDay(
                  currentDate,
                  new Date(lastUpdated)
                )
                if (shouldResetIntakeCount) {
                  setIntakeCount(0)
                  const dateString = convertDate(currentDate)
                  db.transaction(tx => {
                    tx.executeSql(
                      'update intake_tracker_info set last_updated = ?, intake_count = 0;',
                      [dateString]
                    )
                  })
                }
              }
            }
          )
        })
      } catch (e) {
        console.error(e)
      }
    }
    checkDayChange()
  }, [])
}
