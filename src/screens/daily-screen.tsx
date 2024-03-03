import {
  Box,
  Center,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
  View,
  useColorModeValue
} from 'native-base'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  startOfWeek,
  subWeeks,
  format,
  eachDayOfInterval,
  subDays,
  getDate
} from 'date-fns'
import { View as MotiView } from 'moti'
import db from '../utils/db'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'moti'
import { makeStyledComponent } from '../utils/styled'

const StyledView = makeStyledComponent(MotiView)

const intakeGoal = 8

interface WeekDay {
  date: string
  weekDay: string
  totalIntake: number
}

export default function DailyScreen() {
  const [weekDays, setWeekDays] = useState<WeekDay[]>([])
  const averageIntake = Math.floor(
    weekDays.reduce(
      (accumulator, currentValue) => accumulator + currentValue.totalIntake,
      0
    ) / intakeGoal
  )

  console.log(averageIntake)

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM daily_intake_history WHERE intake_date BETWEEN date('now', '-7 days') AND date('now')`,
        [],
        (_, { rows }) => {
          const intakeHistory = rows._array
          const tempArr = []
          for (let i = 6; i >= 0; i--) {
            const currentDate = subDays(new Date(), i)
            const weekDay = format(currentDate, 'EEEEEE')
            const date = currentDate.toISOString().split('T')[0]
            const intake = intakeHistory.find(
              intake => intake.intake_date === date
            )
            tempArr.push({
              date,
              weekDay,
              totalIntake: intake ? intake.total_intake : 0
            })
          }
          setWeekDays(tempArr)
        }
      )
    })
  }, [])

  return (
    <Box
      w="full"
      flex={1}
      bg={useColorModeValue('warmGray.50', 'secondary.900')}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <VStack space={20} p={10} flex={1} justifyContent="space-between">
          <HStack space={4} alignItems="center">
            <Box bg="warmGray.50" p={4} borderRadius={26}>
              <Icon
                as={MaterialCommunityIcons}
                name="water-outline"
                size={9}
                color="warmGray.700"
              />
            </Box>
            <VStack>
              <Text color="warmGray.400">Average</Text>
              <Text fontSize={24} fontWeight="bold">
                {averageIntake} Glasses
              </Text>
            </VStack>
          </HStack>

          <AnimatePresence>
            <HStack
              justifyContent="center"
              space={2}
              alignItems="flex-end"
              height="300"
            >
              {weekDays.map((day, i) => (
                <HistoryBar {...day} key={day.date} index={i} />
              ))}
            </HStack>
          </AnimatePresence>
          <View />
        </VStack>
      </SafeAreaView>
    </Box>
  )
}

interface BarProps {
  totalIntake: number
  weekDay: string
  index: number
}

const HistoryBar = ({ totalIntake, weekDay, index }: BarProps) => {
  const MAX_BAR_HEIGHT = 300
  const CALCULATED_BAR_HEIGHT =
    totalIntake > 0 ? (totalIntake / intakeGoal) * MAX_BAR_HEIGHT : 20
  const isGoalAchieved = totalIntake === intakeGoal

  return (
    <VStack alignItems="center" space={2}>
      <StyledView
        from={{ height: 0, opacity: 0 }}
        animate={{ height: CALCULATED_BAR_HEIGHT, opacity: 1 }}
        transition={{ type: 'timing', duration: 800, delay: index * 100 }}
      >
        <Pressable>
          <Box
            w="40px"
            borderRadius={20}
            alignItems="center"
            h="100%"
            py={3}
            bg={isGoalAchieved ? 'primary.900' : 'warmGray.50'}
          >
            <VStack alignItems="center" justifyContent="space-between" flex={1}>
              <Text
                fontSize={18}
                fontWeight="medium"
                color={isGoalAchieved ? 'warmGray.50' : 'warmGray.500'}
              >
                {totalIntake}
              </Text>
              {isGoalAchieved && (
                <StyledView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 800, delay: index * 200 }}
                >
                  <Icon
                    as={Feather}
                    name="check"
                    size={4}
                    color="warmGray.50"
                  />
                </StyledView>
              )}
            </VStack>
          </Box>
        </Pressable>
      </StyledView>
      <Text fontSize={12} color="warmGray.400" fontWeight="medium">
        {weekDay}
      </Text>
    </VStack>
  )
}
