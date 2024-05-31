'use client'
import { Asset } from '@prisma/client'
import classNames from 'classnames'
import Field, { PageHeader } from 'components/Field'
import Button, { ButtonsGroup } from 'components/button'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import overrideStyles from './AssetForm.module.scss'
import styles from 'components/Field/Field.module.scss'
import Delete from 'components/button/delete.svg'
import { useTranslation } from 'hooks/useTranslation'
import { format } from 'date-fns'
import useAssets from 'hooks/useAssets'
import { useRouter } from 'next/navigation'

export default function Form({ asset }: { asset?: Asset }) {
  const { register, handleSubmit, watch, control, formState, getValues } =
    useForm<Asset>({
      shouldUseNativeValidation: false,
      defaultValues: { timePeriod: 'month', ...asset },
    })
  const router = useRouter()
  const { upsertAsset, deleteAsset } = useAssets()
  const onSubmit = useCallback(
    async (data: Asset) => {
      let { ...asset } = data

      if (!asset.periodicIncomeAmount) {
        asset.periodAmount = null
        asset.timePeriod = null
      }
      upsertAsset(asset)
    },
    [upsertAsset]
  )
  const onDelete = useCallback(() => {
    deleteAsset(asset!.id)
    router.push('/transactions')
  }, [deleteAsset])

  const { t } = useTranslation()
  const isRepeated = watch('periodicIncomeAmount') !== undefined
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames(styles.form, overrideStyles.form, {
        [styles.submitted]: formState.isSubmitted,
      })}
      noValidate
    >
      <PageHeader title={t('asset')}>
        {asset?.id && (
          <Button
            text={t('delete')}
            bordered
            onClick={() => onDelete()}
            icon={<Delete />}
          />
        )}
      </PageHeader>
      <Field label={t('assetType')}>
        <input
          id="type"
          type="text"
          placeholder={t('assetTypePlaceholder')}
          required
          {...register('type', { required: true })}
          defaultValue={asset?.type}
        />
      </Field>
      <Field label={t('assetValue')}>
        <Controller
          control={control}
          name="cashValue"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumberFormat
              onValueChange={({ value }) => onChange(Number(value))}
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
      <Field label={t('assetValueDate')}>
        <Controller
          control={control}
          name="cashValueDate"
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
      <Field label={t('assetIncreasingValueRate')}>
        <Controller
          control={control}
          name="increasingValueRate"
          render={({ field: { onChange, onBlur, value } }) => (
            <NumberFormat
              onValueChange={({ floatValue }) => onChange(Number(floatValue))}
              onBlur={onBlur}
              value={value}
              thousandSeparator
              required
              tabIndex={1}
              placeholder="3%"
              suffix="%"
            />
          )}
        />
      </Field>
      <Field label={t('assetPeriodicIncomeAmount')}>
        <Controller
          control={control}
          name="periodicIncomeAmount"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumberFormat
              onValueChange={({ value }) =>
                onChange(value ? Number(value) : undefined)
              }
              onBlur={onBlur}
              value={value}
              placeholder="₪4,000"
              thousandSeparator={true}
              prefix={'₪'}
              required
            />
          )}
        />
      </Field>
      <Field label={t('assetTimePeriod')}>
        <input
          type="number"
          disabled={!isRepeated}
          {...register('periodAmount', {
            required: isRepeated,
            setValueAs: (value) => Number(value),
          })}
          defaultValue={asset?.periodAmount ?? undefined}
          required={isRepeated}
          className={overrideStyles.periodAmountField}
          placeholder="1"
        />
      </Field>
      <Field label=" ">
        <select
          {...register('timePeriod')}
          className={overrideStyles.timePeriodField}
          disabled={!isRepeated}
          defaultValue={asset?.timePeriod ?? undefined}
        >
          <option value="week">{t('week')}</option>
          <option value="month">{t('month')}</option>
          <option value="year">{t('year')}</option>
        </select>
      </Field>
      <hr />
      <ButtonsGroup centered className={overrideStyles.submitGroupButton}>
        <Button text={t('save')} primary />
      </ButtonsGroup>
    </form>
  )
}
