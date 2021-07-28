import React, { useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import ReactDatePicker from 'react-datepicker'
import styles from './Form.module.scss'
import 'react-datepicker/dist/react-datepicker.css'
import useTransaction from '../hooks/useTransactions'
import { TransactionConfig } from '../../utils/types'

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
  const { register, handleSubmit, watch, control } = useForm({
    shouldUseNativeValidation: false,
  })
  const router = useRouter()
  const { mutate } = useTransaction()
  const onSubmit = useCallback(
    async (data: TransactionConfig & { repeated: boolean }) => {
      const { repeated, timePeriod, periodAmount, endDate, amount, ...rest } =
        data

      const newTransactionData: TransactionConfig = {
        ...rest,
        amount: Number(amount),
      }
      if (repeated) {
        newTransactionData.timePeriod = timePeriod
        newTransactionData.periodAmount = Number(periodAmount)
        if (!!endDate) {
          newTransactionData.endDate = endDate
        }
      }

      await router.push('/transactions')

      await mutate((transactionConfigs: TransactionConfig[] | undefined) => {
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
    [transactionConfig]
  )

  const isRepeated = watch('repeated', !!transactionConfig?.timePeriod)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label>Amount: </label>
        <input
          type="number"
          placeholder="10,000"
          defaultValue={transactionConfig?.amount}
          {...register('amount', { required: true })}
        />
      </div>
      <div className={styles.field}>
        <label>Date: </label>
        <Controller
          control={control}
          name="date"
          rules={{ required: true }}
          defaultValue={transactionConfig?.date}
          render={({ field: { onChange, onBlur, value } }) => (
            <ReactDatePicker
              onChange={onChange}
              onBlur={onBlur}
              selected={value || transactionConfig?.date}
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
        <input
          type="checkbox"
          id="repeated"
          defaultChecked={!!transactionConfig?.timePeriod}
          {...register('repeated', { required: isRepeated })}
        />
        <label htmlFor="repeated">Repeated</label>
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
          render={({ field: { onChange, onBlur, value } }) => (
            <ReactDatePicker
              onChange={onChange}
              onBlur={onBlur}
              selected={value || transactionConfig?.endDate}
              popperPlacement="top"
            />
          )}
        />
      </div>
      <input type="submit" />
    </form>
  )
}
