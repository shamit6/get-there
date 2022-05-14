import React, { useEffect, useState } from 'react'
import Button from 'components/button'
import Add from 'components/button/plus.svg'
import { calcTotalSummery } from 'utils/mortgageCalculator'
import {
  CalculatedMortgageProgram,
  MortgageCourse,
  CalculatedMortgageSummery,
  MortgageType,
} from 'utils/types'
import MortgageCourseCompnent from './MortgageCourse'
import styles from './Mortgage.module.scss'
import {
  AmortizationScheduleTransaction,
  calcAmortizationSchedule,
} from 'utils/amortizationScheduleCalculator'
import MortgageSummerySection from './MortgageSummerySection'
import MortgagePaymentsCharts from './MortgagePaymentsCharts'

const defaultProgramData: MortgageCourse = {
  amount: 100000,
  periodInMonths: 240,
  interest: 3,
  returnType: 'Spitzer',
  type: MortgageType.NON_LINKED_FIXED,
}

export default function Mortgage() {
  const [programsData, setProgramsData] = useState<MortgageCourse[]>(
    Array(3).fill(defaultProgramData)
  )
  const [mortgageSummery, setMortgageSummery] =
    useState<CalculatedMortgageSummery>()
  const [programToFocus, setProgramToFocus] = useState(0)

  useEffect(() => {
    setMortgageSummery(calcTotalSummery(programsData))
  }, [programsData])

  const [amortizationSchedule, setAmortizationSchedule] =
    useState<AmortizationScheduleTransaction[]>()

  return (
    <>
      {programsData.map((programData, i) => (
        <MortgageCourseCompnent
          key={i}
          isFocus={i === programToFocus}
          programData={programData}
          onProgramCalc={(programData: CalculatedMortgageProgram) => {
            setProgramsData((prevState) => [
              ...prevState.slice(0, i),
              programData,
              ...prevState.slice(i + 1),
            ])
          }}
          onProgramRemove={() => {
            setProgramToFocus(Math.min(i, programsData.length - 2))
            setProgramsData((prevState) => [
              ...prevState.slice(0, i),
              ...prevState.slice(i + 1),
            ])
          }}
        />
      ))}
      <MortgageSummerySection mortgageSummery={mortgageSummery} />
      <div className={styles.actionBar}>
        <Button
          text="Amortization Schedule"
          onClick={() => {
            setAmortizationSchedule(calcAmortizationSchedule(programsData))
          }}
          bordered
          linkTheme
          tabIndex={1}
        />
        <Button
          text="Add program"
          onClick={() => {
            setProgramsData([...programsData, defaultProgramData])
            setProgramToFocus(programsData.length)
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
