import { Center, VStack, View, useColorModeValue } from 'native-base'
import Wave from '../components/wave'
import ActionButton from '../components/action-button'
import { useEffect, useState } from 'react'
import db from '../utils/db'
import { isSameDay } from 'date-fns'
import { convertDate } from '../utils/convert-date'

interface Intake {
  intake_id: number
  intake_datetime: Date
}

interface DailyIntakeHistory {
  history_id: number
  intake_date: Date
  total_intake: number
}

interface IntakeTrackerInfo {
  info_id: number
  last_updated: Date
  intake_count: number
}

const MainScreen = () => {
  const [intakeCount, setIntakeCount] = useState<number>(0)
  const intakeGoal = 8

  const percentCalculated = (intakeCount / intakeGoal) * 100

  useEffect(() => {
    db.transaction(tx => {
      // tx.executeSql('drop table if exists intakes')
      // tx.executeSql('drop table if exists intake_tracker_info')
      tx.executeSql(
        'create table if not exists intakes (intake_id integer primary key autoincrement not null,intake_datetime datetime);',
        []
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
    const interval = setInterval(checkDayChange, 10000)
    return () => clearInterval(interval)
  }, [])

  db.transaction(tx => {
    tx.executeSql('select * from intakes;', [], (_, { rows }) => {
      const a = rows._array
      console.log('intakes', a)
    })
    tx.executeSql('select * from intake_tracker_info;', [], (_, { rows }) => {
      const a = rows._array
      console.log('tacker_info', a)
    })
  })

  const handleAddIntake = () => {
    if (intakeCount < intakeGoal) {
      //convert js-date to sqlite-date
      const dateString = convertDate(new Date())
      const updatedCount = intakeCount + 1

      db.transaction(tx => {
        tx.executeSql('insert into intakes (intake_datetime) values (?);', [
          dateString
        ])
        tx.executeSql(
          'update intake_tracker_info set last_updated = ?, intake_count = ?;',
          [dateString, updatedCount]
        )
      })

      setIntakeCount(prev => prev + 1)
    }
  }

  return (
    <Center
      flex={1}
      px={8}
      py={16}
      bg={useColorModeValue('warmGray.50', 'secondary.900')}
    >
      <VStack
        flex={1}
        justifyContent="space-between"
        alignItems="center"
        space={10}
      >
        <View />
        <Wave size={200} value={percentCalculated} />
        <VStack space={2}>
          <ActionButton onPress={handleAddIntake}>Drink</ActionButton>
        </VStack>
      </VStack>
    </Center>
  )
}

export default MainScreen
