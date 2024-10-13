'use client'
import React, { useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
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
  const { register, handleSubmit, watch, control, formState } =
    useForm<TransactionFormProps>({
      shouldUseNativeValidation: false,
      defaultValues: getTransactionConfigDefaultFormValues(transactionConfig),
    })

  const router = useRouter()
  const { upsertTransaction, deleteTransaction } = useTransaction()
  const onSubmit = useCallback(
    (data: TransactionFormProps) => {
      const { repeated, timePeriod, periodAmount, endDate, amount, ...rest } =
        data

      const newTransactionData: Partial<TransactionConfig> = {
        ...rest,
        amount: Number(amount),
        id: transactionConfig?.id,
      }
      if (repeated) {
        newTransactionData.timePeriod = timePeriod
        newTransactionData.periodAmount = Number(periodAmount)
        newTransactionData.endDate = endDate
      }

      void upsertTransaction(newTransactionData)
      router.push('/manage')
    },
    [upsertTransaction, router]
  )

  const onDelete = useCallback(() => {
    void deleteTransaction(transactionConfig?.id!)
    router.push('/manage')
  }, [deleteTransaction, transactionConfig, router])

  const isRepeated = watch('repeated', !!transactionConfig?.timePeriod)
  const endDateEl = useRef<HTMLInputElement>(null)
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames('max-w-[21em]', {
        submitted: formState.isSubmitted,
      })}
      noValidate
    >
      <PageHeader title="Transaction">
        {transactionConfig?.id && (
          <Button
            text="delete"
            bordered
            onClick={() => onDelete()}
            icon={<Delete />}
          />
        )}
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
      <hr className="w-full border-0" />
      <Field htmlFor="repeated" label="Repeated" horizontal>
        <input
          type="checkbox"
          id="repeated"
          defaultChecked={!!transactionConfig?.timePeriod}
          {...register('repeated', { required: isRepeated })}
        />
      </Field>
      <hr className="w-full border-0" />
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
            <div className="flex items-center">
              <input
                ref={endDateEl}
                type="date"
                onChange={(e) => {
                  onChange(e.target.valueAsDate)
                }}
                disabled={!isRepeated}
                value={value ? format(value, 'yyyy-MM-dd') : undefined}
                className="flex-grow"
              />
              <div
                className="ml-1 text-error-color cursor-pointer opacity-70 hover:opacity-100"
                onClick={() => {
                  onChange(null)
                  endDateEl.current!.value = ''
                }}
              >
                X
              </div>
            </div>
          )}
        />
      </Field>
      <hr className="w-full border-0" />
      <ButtonsGroup centered className="flex-1">
        <Button text="Save" primary />
      </ButtonsGroup>
    </form>
  )
}
