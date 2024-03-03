import { Box, Center, VStack, View, useColorModeValue } from 'native-base'
import Wave from '../components/wave'
import ActionButton from '../components/action-button'
import { useEffect, useState } from 'react'
import db from '../utils/db'
import { isSameDay } from 'date-fns'
import { convertDate, convertDateTimeToDate } from '../utils/convert-date'
import useInitDb from '../hooks/use-init-db'
import useCheckDayChange from '../hooks/use-check-day-change'
import { handleAddIntakeTransaction } from '../utils/handle-add-intake-transaction'
import CompletedText from '../components/completed-text'
import Masthead from '../components/masthtead'

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

  useInitDb(setIntakeCount)

  useCheckDayChange(setIntakeCount)

  db.transaction(tx => {
    tx.executeSql('select * from intakes;', [], (_, { rows }) => {
      const a = rows._array
      console.log('intakes', a)
    })
    tx.executeSql('select * from intake_tracker_info;', [], (_, { rows }) => {
      const a = rows._array
      console.log('tacker_info', a)
    })
    tx.executeSql('select * from daily_intake_history;', [], (_, { rows }) => {
      const a = rows._array
      console.log('daily', a)
    })
  })

  const handleAddIntake = () => {
    if (intakeCount < intakeGoal) {
      //convert js-date to sqlite-date

      const updatedCount = intakeCount + 1

      handleAddIntakeTransaction(updatedCount)

      setIntakeCount(prev => prev + 1)
    }
  }

  return (
    <Box
      w="full"
      flex={1}
      bg={useColorModeValue('warmGray.50', 'secondary.900')}
    >
      <Masthead image={require('../assets/demons.jpg')}>
        <View />
      </Masthead>
      <Center
        flex={1}
        px={4}
        py={10}
        mt="-20px"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        bg={useColorModeValue('warmGray.50', 'secondary.900')}
      >
        {intakeCount === intakeGoal ? (
          <CompletedText />
        ) : (
          <VStack justifyContent="space-between" flex={1} alignItems="center">
            <View />
            <Wave size={200} value={percentCalculated} />

            <VStack space={2}>
              <ActionButton onPress={handleAddIntake}>Drink</ActionButton>
            </VStack>
          </VStack>
        )}
      </Center>
    </Box>
  )
}

export default MainScreen
