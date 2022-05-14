import React, { useEffect, useState } from 'react'
import Button from 'components/button'
import Add from 'components/button/plus.svg'
import { calcTotalSummery, generateNewMortageCourse } from 'utils/mortgageCalculator'
import {
  CalculatedMortgageProgram,
  MortgageCourse,
  CalculatedMortgageSummery,
} from 'utils/types'
import MortgageCourseCompnent from './MortgageCourse'
import styles from './Mortgage.module.scss'
import {
  AmortizationScheduleTransaction,
  calcAmortizationSchedule,
} from 'utils/amortizationScheduleCalculator'
import MortgageSummerySection from './MortgageSummerySection'
import MortgagePaymentsCharts from './MortgagePaymentsCharts'
import { useCurrentMortgage } from 'hooks/useCurrentMortgage'
import { remove } from 'lodash'

export default function Mortgage() {
  const { currentMortgage, setCurrentMortgage } = useCurrentMortgage()
  console.log('currentMortgagecurrentMortgage', currentMortgage);
  
  const mortgageCourses = currentMortgage?.courses || []
  const [mortgageSummery, setMortgageSummery] =
    useState<CalculatedMortgageSummery>()
  const [programToFocus, setProgramToFocus] = useState(0)

  useEffect(() => {
    if (mortgageCourses.length > 0) {
      setMortgageSummery(calcTotalSummery(mortgageCourses))
    }
  }, [mortgageCourses])

  const [amortizationSchedule, setAmortizationSchedule] =
    useState<AmortizationScheduleTransaction[]>()

  return (
    <>
      {mortgageCourses.map((course, i) => (
        <MortgageCourseCompnent
          key={course.id}
          isFocus={i === programToFocus}
          programData={course}
          onProgramCalc={(programData: CalculatedMortgageProgram) => {
            setCurrentMortgage((prevState) => {
              const courses = prevState?.courses!
              return {
                ...prevState,
                courses: [
                  ...courses.slice(0, i),
                  programData,
                  ...courses.slice(i + 1),
                ],
              }
            })
          }}
          onProgramRemove={() => {
            setProgramToFocus(Math.min(i, mortgageCourses.length - 2))
            setCurrentMortgage((prevState) => {
              const courses = prevState?.courses!
              return {
                ...prevState,
                courses: [
                  ...courses.slice(0, i),
                  ...courses.slice(i + 1),
                ],
              }
            })
          }}
        />
      ))}
      <MortgageSummerySection mortgageSummery={mortgageSummery} />
      <div className={styles.actionBar}>
        <Button
          text="Amortization Schedule"
          onClick={() => {
            setAmortizationSchedule(calcAmortizationSchedule(mortgageCourses))
          }}
          bordered
          linkTheme
          tabIndex={1}
        />
        <Button
          text="Add program"
          onClick={() => {
            setCurrentMortgage((prevState) => {
              const courses = prevState?.courses!
              return {
                ...prevState,
                courses: [
                  ...courses,
                  generateNewMortageCourse(),
                ],
              }
            })
            setProgramToFocus(mortgageCourses.length)
          }}
          bordered
          linkTheme
          icon={<Add />}
          tabIndex={2}
        />
      </div>
      {amortizationSchedule && (
        <MortgagePaymentsCharts
          mortgagePaymentsSchedule={amortizationSchedule}
        />
      )}
    </>
  )
}
