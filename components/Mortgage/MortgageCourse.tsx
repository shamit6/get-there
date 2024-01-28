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
import { Controller, useFormContext, useWatch } from 'react-hook-form'

export default function MortgageProgram({
  onProgramRemove,
  isFocus,
  index,
}: {
  onProgramRemove(): void
  isFocus: boolean
  index: number
}) {
  const { control, register, setFocus } = useFormContext()
  const course = useWatch({ name: `courses.${index}` })
  const [calculatedMortgageProgram, setCalculatedMortgageProgram] = useState(
    {} as CalculatedMortgageProgram
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
    if (course.periodInMonths && course.interest) {
      const calculatedMortgageProgram = calcDisplayedMortgageProgram(course)
      setCalculatedMortgageProgram(calculatedMortgageProgram)
    }
  }, [course])
  return (
    <div className={styles.mortgageProgramRow}>
      <div className={styles.mortgageProgramBasic}>
        <Field label="Amount">
          <Controller
            control={control}
            name={`courses.${index}.amount`}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur } }) => (
              <NumberFormat
                onValueChange={({ floatValue }) => {
                  onChange(floatValue)
                }}
                onBlur={onBlur}
                defaultValue={course.amount}
                thousandSeparator
                placeholder="amount"
                suffix="₪"
                required
                tabIndex={1}
                getInputRef={inputRef}
              />
            )}
          />
        </Field>
        <Field label="Period in months">
          <Controller
            control={control}
            name={`courses.${index}.periodInMonths`}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <NumberFormat
                onValueChange={({ floatValue }) => onChange(floatValue)}
                onBlur={onBlur}
                defaultValue={course.periodInMonths}
                thousandSeparator
                required
                tabIndex={1}
                placeholder="period in months"
              />
            )}
          />
        </Field>
        <Field label="Interest">
          <Controller
            control={control}
            name={`courses.${index}.interest`}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <NumberFormat
                onValueChange={({ floatValue }) => onChange(floatValue)}
                onBlur={onBlur}
                defaultValue={course.interest}
                thousandSeparator
                required
                tabIndex={1}
                placeholder="interest"
                suffix="%"
              />
            )}
          />
        </Field>
        <Field label="Type">
          <Controller
            control={control}
            name={`courses.${index}.type`}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <select
                tabIndex={1}
                defaultValue={course.type}
                onChange={onChange}
                onBlur={onBlur}
              >
                <option value={MortgageType.LINKED_FIXED}>linked fixed</option>
                <option value={MortgageType.NON_LINKED_FIXED}>
                  non-linked fixed
                </option>
              </select>
            )}
          />
        </Field>
        <Field label="Returns type">
          <Controller
            control={control}
            name={`courses.${index}.returnType`}
            rules={{ required: true }}
            defaultValue={course.returnType}
            render={({ field: { onChange, onBlur, value } }) => (
              <select
                value={value}
                tabIndex={1}
                onChange={onChange}
                onBlur={onBlur}
              >
                <option value={ReturnType.Shpitzer}>Spitzer</option>
              </select>
            )}
          />
        </Field>
        <Field label="Monthly payment">
          <div>
            <TextNumber value={monthlyPayment?.toFixed(0)} suffix="₪" />
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
          type="button"
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
                  {...register(`courses.${index}.earlyPayoffType`)}
                  defaultValue={course.earlyPayoffType}
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
                <Controller
                  control={control}
                  name={`courses.${index}.earlyPayoffMonths`}
                  rules={{ required: !!course.earlyPayoffType }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <NumberFormat
                      onValueChange={({ floatValue }) => onChange(floatValue)}
                      onBlur={onBlur}
                      defaultValue={course.earlyPayoffMonths}
                      thousandSeparator
                      required={!!course.earlyPayoffType}
                      tabIndex={1}
                      placeholder="after x months"
                    />
                  )}
                />
              </Field>
              <Field>
                <Controller
                  control={control}
                  name={`courses.${index}.earlyPayoffAmount`}
                  rules={{ required: !!course.earlyPayoffType }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <NumberFormat
                      onValueChange={({ floatValue }) => {
                        onChange(floatValue)
                      }}
                      onBlur={onBlur}
                      value={
                        course.earlyPayoffType ===
                        MortgageEarlyPayoffType.COMPLETE
                          ? earlyPayoffAmount?.toFixed(0)
                          : value
                      }
                      thousandSeparator
                      required={!!course.earlyPayoffType}
                      tabIndex={1}
                      placeholder="early payoff amount"
                      suffix="₪"
                      disabled={
                        course.earlyPayoffType !==
                        MortgageEarlyPayoffType.PARTIAL
                      }
                    />
                  )}
                />
              </Field>
              <Field>
                <select
                  {...register(`courses.${index}.earlyPayoffPurpose`, {
                    required: !!course.earlyPayoffType,
                  })}
                  defaultValue={course.earlyPayoffPurpose}
                  disabled={
                    course.earlyPayoffType === MortgageEarlyPayoffType.COMPLETE
                  }
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
                <Controller
                  control={control}
                  name={`courses.${index}.expectedCpiChange`}
                  defaultValue={course.earlyPayoffAmount}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <NumberFormat
                      onValueChange={({ floatValue }) => onChange(floatValue)}
                      onBlur={onBlur}
                      value={value}
                      disabled={!isMortgageCourseCpiLinked(course)}
                      tabIndex={1}
                      placeholder="CPI interest"
                      suffix="%"
                    />
                  )}
                />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
