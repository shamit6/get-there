import React, { useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import overrideStyles from './Form.module.scss'
import styles from 'components/Field/Field.module.scss'
import NumberFormat from 'react-number-format'
import useTransaction from 'hooks/useTransactions'
import { TransactionConfig } from 'utils/types'
import { format } from 'date-fns'
import Button from 'components/button'
import classNames from 'classnames'

export default function Form({
  transactionConfig,
}: {
  transactionConfig?: TransactionConfig
}) {
  const { register, handleSubmit, watch, control, formState } = useForm({
    shouldUseNativeValidation: false,
  })

  const router = useRouter()
  const { upsertTrasaction } = useTransaction()
  const onSubmit = useCallback(
    async (data: TransactionConfig & { repeated: boolean }) => {
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
      <div className={styles.field}>
        <label>Amount</label>
        <Controller
          control={control}
          name="amount"
          rules={{ required: true }}
          defaultValue={transactionConfig?.amount}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <NumberFormat
                onValueChange={({ value }) => onChange(value)}
                onBlur={onBlur}
                value={value}
                placeholder="₪40,000"
                thousandSeparator={true}
                prefix={'₪'}
                required
              />
              <span />
            </>
          )}
        />
      </div>
      <div className={styles.field}>
        <label>Date</label>
        <Controller
          control={control}
          name="date"
          rules={{ required: true }}
          defaultValue={transactionConfig?.date}
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
      </div>
      <div className={styles.field}>
        <label>Type</label>
        <input
          id="type"
          type="text"
          placeholder="Salary"
          defaultValue={transactionConfig?.type}
          required
        />
        <span />
      </div>
      <div className={overrideStyles.repeatedField}>
        <label htmlFor="repeated">Repeated</label>
        <input
          type="checkbox"
          id="repeated"
          defaultChecked={!!transactionConfig?.timePeriod}
          {...register('repeated', { required: isRepeated })}
        />
      </div>
      <div className={styles.field}>
        <label>In</label>
        <input
          type="number"
          defaultValue={transactionConfig?.periodAmount || 1}
          disabled={!isRepeated}
          {...register('periodAmount', { required: isRepeated })}
          required={isRepeated}
        />
        <span />
        <select
          {...register('timePeriod')}
          defaultValue={transactionConfig?.timePeriod || 'month'}
          disabled={!isRepeated}
          style={{ marginLeft: '1em' }}
        >
          <option value="week">weeks</option>
          <option value="month">months</option>
          <option value="year">years</option>
        </select>
      </div>
      <div className={styles.field}>
        <label>End Date</label>
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
      </div>
      <hr />
      <Button text="submit" primary className={styles.submitButton} />
    </form>
  )
}
