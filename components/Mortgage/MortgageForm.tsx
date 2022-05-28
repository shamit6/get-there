import MortgageComp from './MortgageCalculator'
import classNames from 'classnames'
import styles from 'components/Field/Field.module.scss'
import { useForm, Controller } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import Button, { ButtonsGroup } from 'components/button'
import { useCurrentMortgage } from 'hooks/useCurrentMortgage'
import Field, { Section } from 'components/Field'
import { Bank } from '@prisma/client'
import { format } from 'date-fns'
import MortgageSummerySection from './MortgageSummerySection'
import { useState } from 'react'
import {
  AmortizationScheduleTransaction,
  calcAmortizationSchedule,
} from 'utils/amortizationScheduleCalculator'
import MortgagePaymentsCharts from './MortgagePaymentsCharts'

function MortgageForm() {
  const { register, handleSubmit, watch, control, formState } = useForm({
    shouldUseNativeValidation: false,
  })
  const { currentMortgage, setCurrentMortgage } = useCurrentMortgage()
  const [amortizationSchedule, setAmortizationSchedule] =
    useState<AmortizationScheduleTransaction[]>()

  return (
    <form
      className={classNames(styles.form, {
        [styles.submitted]: formState.isSubmitted,
      })}
      style={{ flexDirection: 'column', width: 'fit-content' }}
      onSubmit={handleSubmit((data) => {
        console.log('submitred', data)
      })}
      noValidate
    >
      <MortgageComp />
      <Section label="Propose Details">
        <Field label="Funding Rate">
          <Controller
            control={control}
            name="fundingRate"
            rules={{ required: true }}
            defaultValue={currentMortgage?.fundingRate}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <NumberFormat
                  onValueChange={({ value }) => onChange(value)}
                  onBlur={onBlur}
                  value={value}
                  placeholder="3%"
                  suffix="%"
                  required
                />
                <span />
              </>
            )}
          />
        </Field>
        <Field label="Bank">
          <Controller
            control={control}
            name="bank"
            rules={{ required: true }}
            defaultValue={currentMortgage?.bank ?? ''}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <select
                  onChange={(e) => {
                    onChange(e.target.value as Bank)
                  }}
                  onBlur={onBlur}
                  value={value}
                  required
                >
                  <option value="" disabled hidden>
                    Select a bank
                  </option>
                  {Object.entries(Bank).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <span />
              </>
            )}
          />
        </Field>
        <Field label="Income">
          <Controller
            control={control}
            name="income"
            rules={{ required: true }}
            defaultValue={currentMortgage?.income}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <NumberFormat
                  onValueChange={({ value }) => onChange(value)}
                  onBlur={onBlur}
                  value={value}
                  placeholder="income"
                  prefix="₪"
                  thousandSeparator
                  required
                />
                <span />
              </>
            )}
          />
        </Field>
        <Field label="Market Value">
          <Controller
            control={control}
            name="marketValue"
            rules={{ required: true }}
            defaultValue={currentMortgage?.marketValue}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <NumberFormat
                  onValueChange={({ value }) => onChange(value)}
                  onBlur={onBlur}
                  value={value}
                  placeholder="market value"
                  prefix="₪"
                  thousandSeparator
                  required
                />
                <span />
              </>
            )}
          />
        </Field>
        <Field label="Offering Date">
          <Controller
            control={control}
            name="offeringDate"
            rules={{ required: true }}
            defaultValue={currentMortgage?.offeringDate}
            render={({ field: { onChange, value } }) => (
              <>
                <input
                  type="date"
                  onChange={(e) => {
                    onChange(e.target.valueAsDate)
                  }}
                  value={value && format(value, 'yyyy-MM-dd')}
                  required
                />
                <span />
              </>
            )}
          />
        </Field>
        <Field label="Address">
          <>
            <input
              id="type"
              type="text"
              placeholder="Salary"
              defaultValue={currentMortgage?.address}
            />
            <span />
          </>
        </Field>
      </Section>
      <MortgageSummerySection />
      <ButtonsGroup>
        <Button
          text="Amortization Schedule"
          onClick={() => {
            setAmortizationSchedule(
              calcAmortizationSchedule(currentMortgage?.courses!)
            )
          }}
          type="button"
          bordered
          linkTheme
          tabIndex={1}
        />
        <Button text="submit" primary className={styles.submitButton} />
      </ButtonsGroup>
      {amortizationSchedule && (
        <MortgagePaymentsCharts
          mortgagePaymentsSchedule={amortizationSchedule}
        />
      )}
    </form>
  )
}

export default MortgageForm
