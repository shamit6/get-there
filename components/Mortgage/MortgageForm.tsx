'use client'
import MortgageComp from './MortgageCalculator'
import classNames from 'classnames'
import styles from 'components/Field/Field.module.scss'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import Button, { ButtonsGroup } from 'components/button'
import Field, { PageHeader, Section } from 'components/Field'
import { Bank } from '@prisma/client'
import { format } from 'date-fns'
import MortgageSummerySection from './MortgageSummerySection'
import { useCallback, useState } from 'react'
import {
  AmortizationScheduleTransaction,
  calcAmortizationSchedule,
} from 'utils/amortizationScheduleCalculator'
import MortgagePaymentsCharts from './MortgagePaymentsCharts'
import { Mortgage } from 'utils/types'
import useMortgages from 'hooks/useMortgages'
import { useRouter } from 'next/navigation'
import Delete from 'components/button/delete.svg'

function MortgageForm({ mortgage }: { mortgage: Partial<Mortgage> }) {
  const formsMethods = useForm({
    shouldUseNativeValidation: false,
    defaultValues: mortgage,
  })

  const { handleSubmit, watch, control, formState } = formsMethods
  const [amortizationSchedule, setAmortizationSchedule] =
    useState<AmortizationScheduleTransaction[]>()
  const { upsertMortgage, deleteMortgage } = useMortgages()
  const router = useRouter()
  const courses = watch('courses')

  const onDelete = useCallback(() => {
    void deleteMortgage(mortgage?.id!)
    router.push('/mortgages')
  }, [deleteMortgage, mortgage, router])

  return (
    <FormProvider {...formsMethods}>
      <form
        className={classNames(styles.form, {
          [styles.submitted]: formState.isSubmitted,
        })}
        style={{ flexDirection: 'column', width: 'fit-content' }}
        onSubmit={handleSubmit((data) => {
          data.courses?.forEach((course) => {
            if (!course.earlyPayoffType) {
              course.earlyPayoffMonths = undefined
              course.earlyPayoffPurpose = undefined
              course.earlyPayoffAmount = undefined
            }
          })
          void upsertMortgage(data as Mortgage)

          router.push('/mortgages')
        })}
        noValidate
      >
        <PageHeader title="Mortgage">
          {mortgage?.id && (
            <Button
              text="delete"
              bordered
              onClick={() => onDelete()}
              icon={<Delete />}
            />
          )}
        </PageHeader>
        <MortgageComp />
        <Section label="Propose Details">
          <Field label="Funding Rate">
            <Controller
              control={control}
              name="fundingRate"
              rules={{ required: true }}
              defaultValue={mortgage.fundingRate}
              render={({ field: { onChange, onBlur, value } }) => (
                <NumberFormat
                  onValueChange={({ floatValue }) => onChange(floatValue)}
                  onBlur={onBlur}
                  value={value}
                  placeholder="3%"
                  suffix="%"
                  required
                />
              )}
            />
          </Field>
          <Field label="Bank">
            <Controller
              control={control}
              name="bank"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur } }) => (
                <>
                  <select
                    onChange={(e) => {
                      onChange(e.target.value as Bank)
                    }}
                    defaultValue={mortgage.bank ?? ''}
                    onBlur={onBlur}
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
                </>
              )}
            />
          </Field>
          <Field label="Income">
            <Controller
              control={control}
              name="income"
              rules={{ required: true }}
              defaultValue={mortgage.income}
              render={({ field: { onChange, onBlur, value } }) => (
                <NumberFormat
                  onValueChange={({ floatValue }) => onChange(floatValue)}
                  onBlur={onBlur}
                  value={value}
                  placeholder="income"
                  prefix="₪"
                  thousandSeparator
                  required
                />
              )}
            />
          </Field>
          <Field label="Market Value">
            <Controller
              control={control}
              name="marketValue"
              rules={{ required: true }}
              defaultValue={mortgage.marketValue}
              render={({ field: { onChange, onBlur, value } }) => (
                <NumberFormat
                  onValueChange={({ floatValue }) => onChange(floatValue)}
                  onBlur={onBlur}
                  value={value}
                  placeholder="market value"
                  prefix="₪"
                  thousandSeparator
                  required
                />
              )}
            />
          </Field>
          <Field label="Offering Date">
            <Controller
              defaultValue={mortgage.offeringDate}
              control={control}
              name="offeringDate"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <input
                  type="date"
                  onChange={(e) => {
                    onChange(e.target.valueAsDate)
                  }}
                  value={value && format(value, 'yyyy-MM-dd')}
                  required
                />
              )}
            />
          </Field>
          <Field label="Address">
            <input
              id="type"
              type="text"
              placeholder="address"
              defaultValue={mortgage.address}
            />
          </Field>
        </Section>
        <MortgageSummerySection />
        <ButtonsGroup>
          <Button text="Save" primary className={styles.submitButton} />
          <Button
            text="Amortization Schedule"
            onClick={() => {
              setAmortizationSchedule(calcAmortizationSchedule(courses!))
            }}
            type="button"
            bordered
            linkTheme
            tabIndex={1}
          />
        </ButtonsGroup>
        {amortizationSchedule && (
          <MortgagePaymentsCharts
            startDate={mortgage.offeringDate!}
            mortgagePaymentsSchedule={amortizationSchedule}
          />
        )}
      </form>
    </FormProvider>
  )
}

export default MortgageForm
