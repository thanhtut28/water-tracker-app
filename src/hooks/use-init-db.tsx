import { useEffect } from 'react'
import { convertDate } from '../utils/convert-date'
import db from '../utils/db'

export default function useInitDb(
  setIntakeCount: React.Dispatch<React.SetStateAction<number>>
) {
  useEffect(() => {
    db.transaction(tx => {
      //   tx.executeSql('drop table if exists intakes')
      //   tx.executeSql('drop table if exists daily_intake_history')
      //   tx.executeSql('drop table if exists intake_tracker_info')
      tx.executeSql(
        'create table if not exists intakes (intake_id integer primary key autoincrement not null,intake_datetime datetime);'
      )

      tx.executeSql(
        'create table if not exists daily_intake_history (history_id integer primary key autoincrement not null, intake_date date, total_intake integer);'
      )
      // metadata table just one row
      tx.executeSql(
        'create table if not exists intake_tracker_info (info_id integer primary key autoincrement not null, last_updated datetime, intake_count integer);'
      )
    })
    db.transaction(tx => {
      tx.executeSql(
        'SELECT intake_count FROM intake_tracker_info',
        [],
        (_, { rows }) => {
          const trackerInfo = rows._array
          if (trackerInfo.length === 0) {
            const dateString = convertDate(new Date())
            tx.executeSql(
              'insert into intake_tracker_info (last_updated, intake_count) values (?, 0)',
              [dateString]
            )
            return
          }
          setIntakeCount(parseInt(trackerInfo[0].intake_count))
        }
      )
    })
  }, [])
}
