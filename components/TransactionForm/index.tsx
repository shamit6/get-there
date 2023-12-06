'use client'
import React, { useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import overrideStyles from './Form.module.scss'
import styles from 'components/Field/Field.module.scss'
import NumberFormat from 'react-number-format'
import useTransaction from 'hooks/useTransactions'
import { TimePeriod, TransactionConfig } from 'utils/types'
import { format } from 'date-fns'
import Button, { ButtonsGroup } from 'components/button'
import classNames from 'classnames'
import Field, { PageHeader } from 'components/Field'
import Delete from 'components/button/delete.svg'

interface TransactionFormProps extends TransactionConfig {
  repeated: boolean
}

function getTransactionConfigDefaultFormValues(
  transactionConfig?: TransactionConfig
) {
  return {
    timePeriod: TimePeriod.MONTH,
    periodAmount: 1,
    ...(transactionConfig || {}),
  }
}

export default function Form({
  transactionConfig,
}: {
  transactionConfig?: TransactionConfig
}) {
  const { register, handleSubmit, watch, control, formState, getValues } =
    useForm<TransactionFormProps>({
      shouldUseNativeValidation: false,
      defaultValues: getTransactionConfigDefaultFormValues(transactionConfig),
    })

  const router = useRouter()
  const { upsertTrasaction, deleteTrasaction } = useTransaction()
  const onSubmit = useCallback(
    async (data: TransactionFormProps) => {
      const { repeated, timePeriod, periodAmount, endDate, amount, ...rest } =
        data

      const newTransactionData: TransactionConfig = {
        ...rest,
        amount: Number(amount),
        id: transactionConfig?.id,
      }
      if (repeated) {
        newTransactionData.timePeriod = timePeriod
        newTransactionData.periodAmount = Number(periodAmount)
        newTransactionData.endDate = endDate
      }

      upsertTrasaction(newTransactionData)

      await router.push('/transactions')
    },
    [upsertTrasaction, router]
  )

  const onDelete = useCallback(async () => {
    deleteTrasaction(transactionConfig?.id!)
    await router.push('/transactions')
  }, [deleteTrasaction, transactionConfig, router])


  const isRepeated = watch('repeated', !!transactionConfig?.timePeriod)
  const endDateEl = useRef<HTMLInputElement>(null)
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames(styles.form, overrideStyles.form, {
        [styles.submitted]: formState.isSubmitted,
      })}
      noValidate
    >
      <PageHeader title="Transaction">
        {transactionConfig?.id && <Button
          text="delete"
          bordered
          onClick={() => onDelete()}
          icon={<Delete />}
        />}
      </PageHeader>
      <Field label="Amount">
        <Controller
          control={control}
          name="amount"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumberFormat
              onValueChange={({ value }) => onChange(value)}
              onBlur={onBlur}
              value={value}
              placeholder="₪40,000"
              thousandSeparator={true}
              prefix={'₪'}
              required
            />
          )}
        />
      </Field>
      <Field label="Date">
        <Controller
          control={control}
          name="date"
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
      <Field label="Type">
        <input
          id="type"
          type="text"
          placeholder="Salary"
          required
          {...register('type', { required: true })}
        />
      </Field>
      <hr />
      <Field htmlFor="repeated" label="Repeated" horizontal>
        <input
          type="checkbox"
          id="repeated"
          defaultChecked={!!transactionConfig?.timePeriod}
          {...register('repeated', { required: isRepeated })}
        />
      </Field>
      <hr />
      <Field label="In">
        <input
          type="number"
          disabled={!isRepeated}
          {...register('periodAmount', { required: isRepeated })}
          required={isRepeated}
        />
      </Field>
      <Field label=" ">
        <select {...register('timePeriod')} disabled={!isRepeated}>
          <option value="week">weeks</option>
          <option value="month">months</option>
          <option value="year">years</option>
        </select>
      </Field>
      <Field label="End Date">
        <Controller
          control={control}
          name="endDate"
          render={({ field: { onChange, value } }) => (
            <>
              <input
                ref={endDateEl}
                type="date"
                onChange={(e) => {
                  onChange(e.target.valueAsDate)
                }}
                disabled={!isRepeated}
                value={value ? format(value, 'yyyy-MM-dd') : undefined}
              />
              <div
                className={overrideStyles.clearInput}
                onClick={() => {
                  onChange(null)
                  endDateEl.current!.value = ''
                }}
              >
                X
              </div>
            </>
          )}
        />
      </Field>
      <hr />
      <ButtonsGroup centered className={overrideStyles.submitGroupButton}>
        <Button text="Save" primary />
      </ButtonsGroup>
    </form>
  )
}
