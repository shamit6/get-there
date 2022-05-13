import React, { useEffect, useRef, useState } from 'react'
import NumberFormat from 'react-number-format'
import Arrow, { Direction } from 'components/arrow'
import Button from 'components/button'
import Remove from 'components/button/delete.svg'
import Field from 'components/Field'
import TextNumber from 'components/textNumber'
import { calcDisplayedMortgageProgram } from 'utils/amortizationScheduleCalculator'
import {
  CalculatedMortgageProgram,
  MortgageEarlyPayoffPurpose,
  MortgageEarlyPayoffType,
  MortgageCourse,
  MortgageType,
  ReturnType,
} from 'utils/types'
import styles from './Mortgage.module.scss'
import { isMortgageCourseCpiLinked } from 'utils/mortgageCalculator'

export default function MortgageProgram({
  programData,
  onProgramCalc,
  onProgramRemove,
  isFocus,
}: {
  programData: MortgageCourse
  onProgramCalc(data: CalculatedMortgageProgram): void
  onProgramRemove(): void
  isFocus: boolean
}) {
  const [mortgageProgram, setMortgageProgram] =
    useState<MortgageCourse>(programData)
  const [calculatedMortgageProgram, setCalculatedMortgageProgram] = useState(
    calcDisplayedMortgageProgram(programData)
  )
  const [isAdvanceOptionsOpen, setIsAdvanceOptionsOpen] = useState(false)
  const { monthlyPayment, earlyPayoffAmount } = calculatedMortgageProgram

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isFocus) {
      inputRef.current?.select()
    }
  }, [inputRef, isFocus])

  useEffect(() => {
    const calculatedMortgageProgram =
      calcDisplayedMortgageProgram(mortgageProgram)
    setCalculatedMortgageProgram(calculatedMortgageProgram)
    onProgramCalc(calculatedMortgageProgram)
  }, [mortgageProgram])
  return (
    <div className={styles.mortgageProgramRow}>
      <div className={styles.mortgageProgramBasic}>
        <Field label="Amount">
          <NumberFormat
            placeholder="amout"
            value={mortgageProgram.amount || ''}
            thousandSeparator={true}
            prefix="₪"
            onValueChange={({ value }) => {
              setMortgageProgram({ ...mortgageProgram, amount: Number(value) })
            }}
            tabIndex={1}
            getInputRef={inputRef}
          />
        </Field>
        <Field label="Period in months">
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
            tabIndex={1}
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
            tabIndex={1}
          />
        </Field>
        <Field label="Type">
          <select
            onChange={(e) => {
              setMortgageProgram({
                ...mortgageProgram,
                type: e.target.value as MortgageType,
              })
            }}
            tabIndex={1}
            value={mortgageProgram.type}
          >
            <option value={MortgageType.LINKED_FIXED}>
              {MortgageType.LINKED_FIXED}
            </option>
            <option value={MortgageType.NON_LINKED_FIXED}>
              {MortgageType.NON_LINKED_FIXED}
            </option>
          </select>
        </Field>
        <Field label="Returns type">
          <select
            onChange={(e) => {
              setMortgageProgram({
                ...mortgageProgram,
                returnType: e.target.value as ReturnType,
              })
            }}
            tabIndex={1}
          >
            <option value={mortgageProgram.returnType}>Spitzer</option>
          </select>
        </Field>
        <Field label="Monthly payment">
          <div>
            <TextNumber value={monthlyPayment?.toFixed(0)} prefix="₪" />
          </div>
        </Field>
        <div className={styles.removeButtonContainer}>
          <Button
            text=""
            linkTheme
            icon={<Remove />}
            className={styles.removeButton}
            onClick={onProgramRemove}
            tabIndex={2}
          />
        </div>
      </div>
      <div className={styles.mortgageProgramAdvance}>
        <Button
          linkTheme
          className={styles.advanceOptionCollapse}
          onClick={() => setIsAdvanceOptionsOpen(!isAdvanceOptionsOpen)}
          tabIndex={1}
        >
          <Arrow
            className={styles.arrow}
            direction={isAdvanceOptionsOpen ? Direction.DOWN : Direction.RIGHT}
          />
          advance option
        </Button>
        {isAdvanceOptionsOpen && (
          <div className={styles.mortgageProgramAdvanceOption}>
            <div className={styles.mortgageProgramAdvanceOptionBlock}>
              <Field label="Early payoff" horizontal>
                <select
                  value={mortgageProgram.earlyPayoffType}
                  onChange={(e) => {
                    setMortgageProgram({
                      ...mortgageProgram,
                      earlyPayoffType: e.target
                        .value as MortgageEarlyPayoffType,
                    })
                  }}
                  tabIndex={1}
                >
                  <option></option>
                  <option value={MortgageEarlyPayoffType.COMPLETE}>
                    complete
                  </option>
                  <option value={MortgageEarlyPayoffType.PARTIAL}>
                    partial
                  </option>
                </select>
              </Field>
              <Field>
                <input
                  placeholder="after x months"
                  value={mortgageProgram.earlyPayoffMonths || ''}
                  type="number"
                  onChange={(e) => {
                    setMortgageProgram({
                      ...mortgageProgram,
                      earlyPayoffMonths: Number(e.target.value),
                    })
                  }}
                  tabIndex={1}
                />
              </Field>
              <Field>
                <NumberFormat
                  placeholder="Early payoff amount"
                  value={earlyPayoffAmount?.toFixed(0) || ''}
                  thousandSeparator={true}
                  prefix="₪"
                  disabled={mortgageProgram.earlyPayoffType === 'complete'}
                  onValueChange={({ value }) => {
                    setMortgageProgram({
                      ...mortgageProgram,
                      earlyPayoffAmount: Number(value),
                    })
                  }}
                  tabIndex={1}
                  getInputRef={inputRef}
                />
              </Field>
              <Field>
                <select
                  value={mortgageProgram.earlyPayoffPurpose}
                  onChange={(e) => {
                    setMortgageProgram({
                      ...mortgageProgram,
                      earlyPayoffPurpose: e.target
                        .value as MortgageEarlyPayoffPurpose,
                    })
                  }}
                  disabled={mortgageProgram.earlyPayoffType === 'complete'}
                  tabIndex={1}
                >
                  <option
                    value={MortgageEarlyPayoffPurpose.SHORTENING_DURATION}
                  >
                    shortening period
                  </option>
                  <option value={MortgageEarlyPayoffPurpose.REDUCING_PAYMENT}>
                    reducinng monthly payment
                  </option>
                </select>
              </Field>
            </div>
            <div className={styles.mortgageProgramAdvanceOptionBlock}>
              <Field label="CPI interest" horizontal>
                <NumberFormat
                  placeholder="interest"
                  suffix="%"
                  value={mortgageProgram.expectedCpiChange || ''}
                  disabled={!isMortgageCourseCpiLinked(mortgageProgram)}
                  onValueChange={({ floatValue }) => {
                    setMortgageProgram({
                      ...mortgageProgram,
                      expectedCpiChange: floatValue,
                    })
                  }}
                  tabIndex={1}
                />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
