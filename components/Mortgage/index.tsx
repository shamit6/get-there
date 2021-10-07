import React, { useEffect, useState } from 'react'
import Button from 'components/button'
import Add from 'components/button/plus.svg'
import Field from 'components/Field'
import TextNumber from 'components/textNumber'
import { calcTotalSummery } from 'utils/mortgageCalculator'
import {
  CalculatedMortgageProgram,
  MortgageProgramData,
  MortgageSummeryCalculation,
  MortgageType,
} from 'utils/types'
import MortgageProgram from './MortgageProgram'
import styles from './Mortgage.module.scss'
import {
  amortizationPaymantsToBurndown,
  AmortizationScheduleTransaction,
  calcAmortizationSchedule,
} from 'utils/amortizationScheduleCalculator'
import { LineChart } from '../Charts'
import { addMonths, format } from 'date-fns'

const defaultProgramData = {
  amount: 100000,
  periodInMonths: 240,
  interest: 3,
  returnType: 'spitzer',
  type: MortgageType.NON_LINKED_FIXED,
}

export default function Mortgage() {
  const [programsData, setProgramsData] = useState<MortgageProgramData[]>(
    Array(3).fill(defaultProgramData)
  )
  const [mortgageSummery, setMortgageSummery] =
    useState<MortgageSummeryCalculation>()
  const [programToFocus, setProgramToFocus] = useState(0)

  useEffect(() => {
    setMortgageSummery(calcTotalSummery(programsData))
  }, [programsData])

  const [amortizationSchedule, setAmortizationSchedule] =
    useState<AmortizationScheduleTransaction[]>()

  const today = new Date()

  return (
    <>
      {programsData.map((programData, i) => (
        <MortgageProgram
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
      <div className={styles.mortgageSummery}>
        <Field label="Monthly payment">
          <div>
            <TextNumber
              value={mortgageSummery?.monthlyPayment?.toFixed(2)}
              prefix="₪"
            />
          </div>
        </Field>
        <Field label="Interest payment">
          <div>
            <TextNumber
              value={mortgageSummery?.totalInterestPayment?.toFixed(2)}
              prefix="₪"
            />
          </div>
        </Field>
        <Field label="Total payment">
          <div>
            <TextNumber
              value={mortgageSummery?.totalPayment?.toFixed(2)}
              prefix="₪"
            />
          </div>
        </Field>
      </div>
      {amortizationSchedule && (
        <div className={styles.amortizationCharts}>
          <LineChart
            anchor="bottom-left"
            minY={0}
            data={[
              {
                id: 'Payment Burndown',
                color: '#b7094c',
                data: amortizationPaymantsToBurndown(
                  amortizationSchedule.map((d) => d.totalPayment)
                ).map((amount, index) => ({
                  x: format(addMonths(new Date(), index), 'dd/MM/yyyy'),
                  y: amount,
                })),
              },
            ]}
          />

          <LineChart
            anchor="bottom-left"
            minY={0}
            data={[
              {
                id: 'Total Payment',
                color: '#892b64',
                data: amortizationSchedule.map((d, index) => ({
                  x: format(addMonths(new Date(), index), 'dd/MM/yyyy'),
                  y: d.totalPayment,
                })),
              },
            ]}
          />

          <LineChart
            anchor="bottom-left"
            minY={0}
            data={[
              {
                id: 'Interest Payment',
                color: '#5c4d7d',
                data: amortizationSchedule.map((d, index) => ({
                  x: format(addMonths(new Date(), index), 'dd/MM/yyyy'),
                  y: d.interestPayment,
                })),
              },
              {
                id: 'Principal Payment',
                color: '#2e6f95',
                data: amortizationSchedule.map((d, index) => ({
                  x: format(addMonths(new Date(), index), 'dd/MM/yyyy'),
                  y: d.principalPayment,
                })),
              },
            ]}
          />
        </div>
      )}
    </>
  )
}
