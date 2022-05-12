import React, { useEffect, useState } from 'react'
import Button from '../../components/button'
import Add from '../../components/button/plus.svg'
import Field from '../../components/Field'
import TextNumber from '../../components/textNumber'
import { calcTotalSummery } from '../../utils/mortgageCalculator'
import {
  CalculatedMortgageProgram,
  MortgageCourse,
  MortgageSummeryCalculation,
  MortgageType,
  Mortgage,
  Bank,
} from '../../utils/types'
import MortgageProgram from './MortgageProgram'
import styles from './Mortgage.module.scss'
import {
  amortizationPaymantsToBurndown,
  AmortizationScheduleTransaction,
  calcAmortizationSchedule,
} from '../../utils/amortizationScheduleCalculator'
import { LineChart } from '../Charts'
import { addMonths, format } from 'date-fns'
import NumberFormat from 'react-number-format'

const defaultMortgageCourse: MortgageCourse = {
  amount: 100000,
  periodInMonths: 240,
  interest: 3,
  returnType: 'Spitzer',
  type: MortgageType.NON_LINKED_FIXED,
}

export default function MortgagePage() {
  const [mortgageCourses, setMortgageCourses] = useState<MortgageCourse[]>(
    Array(3).fill(defaultMortgageCourse)
  )
  const [mortgageDetails, setMortgageDetails] =
    useState<Omit<Mortgage, 'courses'>>()

  const [mortgageSummery, setMortgageSummery] =
    useState<MortgageSummeryCalculation>()
  const [programToFocus, setProgramToFocus] = useState(0)

  useEffect(() => {
    setMortgageSummery(calcTotalSummery(mortgageCourses))
  }, [mortgageCourses])

  const [amortizationSchedule, setAmortizationSchedule] =
    useState<AmortizationScheduleTransaction[]>()

  const today = new Date()

  const handleAmortizationSchedule = () => {
    fetch('/api/mortgage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mortgageCourses),
    })
    setAmortizationSchedule(calcAmortizationSchedule(mortgageCourses))
  }

  return (
    <>
      <div className={styles.details}>
        <Field label="Bank">
          <select
            // onChange={(e) => {
            //   setMortgageProgram({
            //     ...mortgageProgram,
            //     type: e.target.value as MortgageType,
            //   })
            // }}
            tabIndex={1}
            value={mortgageDetails?.bank}
          >
            {Object.values(Bank).map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Funding Rate">
          <NumberFormat
            placeholder="Funding Rate"
            value={mortgageDetails?.fundingRate || 75}
            prefix="%"
            // onValueChange={({ value }) => {
            //   setMortgageProgram({ ...mortgageProgram, amount: Number(value) })
            // }}
            tabIndex={1}
            // getInputRef={inputRef}
          />
        </Field>
        <Field label="Income">
          <NumberFormat
            placeholder="Income"
            value={mortgageDetails?.income || 1000}
            prefix="₪"
            // onValueChange={({ value }) => {
            //   setMortgageProgram({ ...mortgageProgram, amount: Number(value) })
            // }}
            tabIndex={1}
            thousandSeparator
            // getInputRef={inputRef}
          />
        </Field>
        <Field label="Start Date">
          <input
            type="date"
            placeholder="Start Date"
            value={format(
              mortgageDetails?.offeringDate || new Date(),
              'yyyy-MM-dd'
            )}
            // onValueChange={({ value }) => {
            //   setMortgageProgram({ ...mortgageProgram, amount: Number(value) })
            // }}
            tabIndex={1}
            // getInputRef={inputRef}
          />
        </Field>
        <Field label="Market Value">
          <NumberFormat
            placeholder="Market Value"
            value={mortgageDetails?.marketValue || 2000000}
            prefix="₪"
            // onValueChange={({ value }) => {
            //   setMortgageProgram({ ...mortgageProgram, amount: Number(value) })
            // }}
            tabIndex={1}
            thousandSeparator
            // getInputRef={inputRef}
          />
        </Field>
        <Field label="Adress">
          <input
            type="text"
            placeholder="Adress"
            value={mortgageDetails?.adderss}
            // onValueChange={({ value }) => {
            //   setMortgageProgram({ ...mortgageProgram, amount: Number(value) })
            // }}
            tabIndex={1}
            // getInputRef={inputRef}
          />
        </Field>
      </div>
      <div>
        {mortgageCourses.map((programData, i) => (
          <MortgageProgram
            key={i}
            isFocus={i === programToFocus}
            programData={programData}
            onProgramCalc={(programData: CalculatedMortgageProgram) => {
              setMortgageCourses((prevState) => [
                ...prevState.slice(0, i),
                programData,
                ...prevState.slice(i + 1),
              ])
            }}
            onProgramRemove={() => {
              setProgramToFocus(Math.min(i, mortgageCourses.length - 2))
              setMortgageCourses((prevState) => [
                ...prevState.slice(0, i),
                ...prevState.slice(i + 1),
              ])
            }}
          />
        ))}

        <div className={styles.actionBar}>
          <Button
            text="Amortization Schedule"
            onClick={handleAmortizationSchedule}
            bordered
            linkTheme
            tabIndex={1}
          />
          <Button
            text="Add program"
            onClick={() => {
              setMortgageCourses([...mortgageCourses, defaultMortgageCourse])
              setProgramToFocus(mortgageCourses.length)
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
      </div>
    </>
  )
}
