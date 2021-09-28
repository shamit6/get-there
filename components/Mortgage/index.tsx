import React, { useEffect, useState } from 'react'
import Button from '../../components/button'
import Add from '../../components/button/plus.svg'
import Field from '../../components/Field'
import Layout from '../../components/layout'
import TextNumber from '../../components/textNumber'
import { calcTotalSummery } from '../../utils/mortgageCalculator'
import {
  CalculatedMortgageProgram,
  MortgageProgramData,
  MortgageSummeryCalculation,
} from '../../utils/types'
import MortgageProgram from './MortgageProgram'
import styles from './Mortgage.module.scss'

const defaultProgramData = {
  amount: 100000,
  periodInMonths: 240,
  interest: 3,
  returnType: 'spitzer',
  type: 'non-linked-fixed',
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

  return (
    <Layout>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          text="Add program"
          onClick={() => {
            setProgramsData([...programsData, defaultProgramData])
            setProgramToFocus(programsData.length)
          }}
          bordered
          linkTheme
          icon={<Add />}
          tabIndex={1}
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
    </Layout>
  )
}
