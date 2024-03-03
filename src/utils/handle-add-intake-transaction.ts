import { convertDate, convertDateTimeToDate } from './convert-date'
import db from './db'

export function handleAddIntakeTransaction(count: number) {
  const dateTimeString = convertDate(new Date())
  const dateString = convertDateTimeToDate(dateTimeString)

  db.transaction(tx => {
    tx.executeSql('insert into intakes (intake_datetime) values (?);', [
      dateTimeString
    ])
    tx.executeSql(
      'update intake_tracker_info set last_updated = ?, intake_count = ?;',
      [dateTimeString, count]
    )
    tx.executeSql(
      'select history_id from daily_intake_history where intake_date = ?;',
      [dateString],
      (_, { rows }) => {
        const historyId = rows?._array[0]?.history_id
        console.log('histryo', rows)
        if (historyId) {
          tx.executeSql(
            'update daily_intake_history set total_intake = ? where history_id = ?',
            [count, historyId]
          )
          return
        } else {
          tx.executeSql(
            'insert into daily_intake_history (intake_date, total_intake) values (?, ?);',
            [dateString, count]
          )
        }
      }
    )
  })
}
