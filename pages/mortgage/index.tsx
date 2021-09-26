import { sumBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import Button from '../../components/button'
import Add from '../../components/button/plus.svg'
import Field from '../../components/Field'
import Layout from '../../components/layout'
import { calcMonthPayment } from '../../utils/mortgageCalculator'
import { MortgageProgramData } from '../../utils/types'

interface CalculatedMortgageProgram extends MortgageProgramData {
  montlyPayment: number
}

function MortgageProgram({
  programData,
  onProgramCalc,
}: {
  programData: Partial<MortgageProgramData>
  onProgramCalc(data: CalculatedMortgageProgram): void
}) {
  const [mortgageProgram, setMortgageProgram] =
    useState<Partial<MortgageProgramData>>(programData)
  const [montlyPayment, setMontlyPayment] = useState(
    calcMonthPayment(programData)
  )

  useEffect(() => {
    const newAmountlyPayment = calcMonthPayment(mortgageProgram)
    setMontlyPayment(newAmountlyPayment)
    // @ts-ignore
    onProgramCalc({ ...mortgageProgram, montlyPayment: newAmountlyPayment })
  }, [mortgageProgram])
  return (
    <div style={{ display: 'flex' }}>
      <Field label="Amount">
        <NumberFormat
          placeholder="amout"
          value={mortgageProgram.amount || ''}
          thousandSeparator={true}
          prefix="₪"
          onValueChange={({ value }) => {
            setMortgageProgram({ ...mortgageProgram, amount: Number(value) })
          }}
        />
      </Field>
      <Field label="Type">
        <select
          onChange={(e) => {
            setMortgageProgram({ ...mortgageProgram, type: e.target.value })
          }}
        >
          <option value={mortgageProgram.type}>non-linked fixed</option>
        </select>
      </Field>
      <Field label="Returns type">
        <select
          onChange={(e) => {
            setMortgageProgram({
              ...mortgageProgram,
              returnType: e.target.value,
            })
          }}
        >
          <option value={mortgageProgram.returnType}>spitzer</option>
        </select>
      </Field>
      <Field label="period in months">
        <input
          placeholder="Period in months"
          value={mortgageProgram.periodInMonths || ''}
          type="number"
          onChange={(e) => {
            setMortgageProgram({
              ...mortgageProgram,
              periodInMonths: Number(e.target.value),
            })
          }}
        />
      </Field>
      <Field label="Interest">
        <NumberFormat
          placeholder="interest"
          suffix="%"
          value={mortgageProgram.interest || ''}
          onValueChange={({ value }) => {
            setMortgageProgram({
              ...mortgageProgram,
              interest: Number(value),
            })
          }}
        />
      </Field>
      <Field label="Montly payment">
        <NumberFormat
          disabled
          thousandSeparator={true}
          prefix="₪"
          value={montlyPayment?.toFixed(0)}
          fixedDecimalScale
        />
      </Field>
    </div>
  )
}

export default function Mortgage() {
  const [programsData, setProgramsData] = useState<
    Partial<CalculatedMortgageProgram>[]
  >([
    {
      amount: 100000,
      periodInMonths: 240,
      interest: 3,
      returnType: 'spitzer',
      type: 'non-linked-fixed',
    },
  ])
  const [totalPayment, setTotalPayment] = useState(0)

  useEffect(() => {
    setTotalPayment(sumBy(programsData, 'montlyPayment') || 0)
  }, [programsData])

  return (
    <Layout>
      {programsData.map((programData, i) => (
        <MortgageProgram
          key={i}
          programData={programData}
          onProgramCalc={(programData: CalculatedMortgageProgram) => {
            setProgramsData([
              ...programsData.slice(0, i),
              programData,
              ...programsData.slice(i + 1),
            ])
          }}
        />
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          text="Add program"
          onClick={() => {
            setProgramsData([...programsData, {}])
          }}
          bordered
          linkTheme
          icon={<Add />}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <Field label="Montly payment">
          <NumberFormat
            disabled
            thousandSeparator={true}
            prefix="₪"
            value={totalPayment.toFixed(0)}
            fixedDecimalScale
          />
        </Field>
      </div>
    </Layout>
  )
}
