import React, { useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import styles from './Form.module.scss'
import NumberFormat from 'react-number-format'
import useTransaction from '../../../hooks/useTransactions'
import { TransactionConfig } from '../../../utils/types'
import { format } from 'date-fns'

function upsertToTrasactioList(
  list: TransactionConfig[],
  transaction: TransactionConfig
) {
  if (!transaction.id) {
    return [...list, transaction]
  } else {
    const a = list.reduce<TransactionConfig[]>((acc, curr) => {
      if (curr.id === transaction.id) {
        return [...acc, transaction]
      } else {
        return [...acc, curr]
      }
    }, [])
    return a
  }
}

export default function Form({
  transactionConfig,
}: {
  transactionConfig?: TransactionConfig
}) {
  const { register, handleSubmit, watch, control, setValue } = useForm({
    shouldUseNativeValidation: false,
  })
  const router = useRouter()
  const { mutate } = useTransaction()
  const onSubmit = useCallback(
    async (data: TransactionConfig & { repeated: boolean }) => {
      const { repeated, timePeriod, periodAmount, endDate, amount, ...rest } =
        data
      console.log(data)

      const newTransactionData: TransactionConfig = {
        ...rest,
        amount: Number(amount),
      }
      if (repeated) {
        newTransactionData.timePeriod = timePeriod
        newTransactionData.periodAmount = Number(periodAmount)
        newTransactionData.endDate = endDate
      }

      await router.push('/transactions')

      await mutate((transactionConfigs: TransactionConfig[] | undefined) => {
        'mutatemutate'
        return upsertToTrasactioList(transactionConfigs || [], {
          ...newTransactionData,
          id: transactionConfig?.id,
        })
      }, false)

      const isNewTransaction = !transactionConfig?.id
      const url = isNewTransaction
        ? '/api/transaction-configs'
        : `/api/transaction-configs/${transactionConfig!.id}`
      fetch(url, {
        method: isNewTransaction ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransactionData),
      }).then(() => {
        return mutate()
      })
    },
    [transactionConfig, mutate, router]
  )

  const isRepeated = watch('repeated', !!transactionConfig?.timePeriod)
  const endDateEl = useRef<HTMLInputElement>(null)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label>Amount: </label>
        <Controller
          control={control}
          name="amount"
          rules={{ required: true }}
          defaultValue={transactionConfig?.amount}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumberFormat
              onValueChange={({ value }) => onChange(value)}
              onBlur={onBlur}
              value={value}
              placeholder="₪40,000"
              thousandSeparator={true}
              prefix={'₪'}
            />
          )}
        />
      </div>
      <div className={styles.field}>
        <label>Date: </label>
        <Controller
          control={control}
          name="date"
          rules={{ required: true }}
          defaultValue={transactionConfig?.date}
          render={({ field: { onChange, value } }) => (
            <input
              type="date"
              onChange={(e) => {
                onChange(e.target.valueAsDate)
              }}
              value={value && format(value, 'yyyy-MM-dd')}
            />
          )}
        />
      </div>
      <div className={styles.field}>
        <label>Type: </label>
        <input
          id="type"
          type="text"
          placeholder="Salary"
          defaultValue={transactionConfig?.type}
          {...register('type', { required: true })}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="repeated">Repeated:</label>
        <input
          type="checkbox"
          id="repeated"
          defaultChecked={!!transactionConfig?.timePeriod}
          {...register('repeated', { required: isRepeated })}
        />
      </div>
      <div className={styles.field}>
        <label>In: </label>
        <input
          type="number"
          defaultValue={transactionConfig?.periodAmount || 1}
          disabled={!isRepeated}
          style={{ width: '4 em', marginRight: '.7em' }}
          {...register('periodAmount', { required: isRepeated })}
        />
        <select
          {...register('timePeriod')}
          defaultValue={transactionConfig?.timePeriod || 'month'}
          disabled={!isRepeated}
        >
          <option value="week">weeks</option>
          <option value="month">months</option>
          <option value="year">years</option>
        </select>
      </div>
      <div className={styles.field}>
        <label>End Date: </label>
        <Controller
          control={control}
          name="endDate"
          defaultValue={transactionConfig?.endDate}
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
                className={styles.clearInput}
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
      </div>
      <input type="submit" />
    </form>
  )
}
