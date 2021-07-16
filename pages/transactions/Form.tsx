import React, { FunctionComponent } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import ReactDatePicker from 'react-datepicker'
import styles from './Form.module.scss'
import type { TransactionConfig } from '../../utils/types'
import { createOrUpdateTransaction } from '../../utils/db'
import 'react-datepicker/dist/react-datepicker.css'

export default function Form({
  transactionConfig,
}: {
  transactionConfig?: TransactionConfig
}) {
  const { register, handleSubmit, watch, control } = useForm({
    shouldUseNativeValidation: false,
  })
  const router = useRouter()
  const onSubmit = (data: TransactionConfig & { repeated: boolean }) => {
    const { repeated, interval, ...rest } = data

    const newTransaction: TransactionConfig = {
      ...rest,
      id: transactionConfig?.id,
    }
    if (repeated) {
      newTransaction.interval = interval
    }
    createOrUpdateTransaction(newTransaction)
    router.push('/transactions')
  }

  const isRepeated = watch('repeated', !!transactionConfig?.interval?.amount)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label>Amount: </label>
        <input
          type="number"
          placeholder="10,000"
          defaultValue={transactionConfig?.amount.toLocaleString('he')}
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
          defaultChecked={!!transactionConfig?.interval?.amount}
          {...register('repeated', { required: isRepeated })}
        />
        <label htmlFor="repeated">Repeated</label>
      </div>
      <div className={styles.field}>
        <label>In: </label>
        <input
          type="number"
          defaultValue={transactionConfig?.interval?.amount || 1}
          disabled={!isRepeated}
          style={{ width: '4 em', marginRight: '.7em' }}
          {...register('interval.amount', { required: isRepeated })}
        />
        <select
          {...register('interval.timePeriod')}
          defaultValue={transactionConfig?.interval?.timePeriod || 'month'}
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
          name="interval.endDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <ReactDatePicker
              onChange={onChange}
              onBlur={onBlur}
              selected={value || transactionConfig?.interval?.endDate}
              popperPlacement="top"
            />
          )}
        />
      </div>
      <input type="submit" />
    </form>
  )
}
