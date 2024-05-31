import Button, { ButtonsGroup } from 'components/button'
import { format } from 'date-fns'
import useFilterOptions from 'hooks/useFilterOptions'
import { useState } from 'react'
import NumberFormat from 'react-number-format'
import Collapsible from '../Collapsible/Collapsible'
import Field from '../Field'
import styles from './TargetPanel.module.scss'
import { useTranslation } from 'hooks/useTranslation'

export default function TargetPanel() {
  const { filter, setFilter } = useFilterOptions()
  const { targetAmount, endDate } = filter
  const [localEndDate, setEndDate] = useState<Date | undefined>(endDate)
  const [localTargetAmount, setTargetAmount] = useState<number | undefined>(
    targetAmount
  )
  const [selectedOption, setSelectedOption] = useState<'amount' | 'end-date'>(
    targetAmount ? 'amount' : 'end-date'
  )
  const { t } = useTranslation()

  return (
    <Collapsible label={t('filerOptions')}>
      <div className={styles.filterPanel}>
        <div className={styles.filterPanelItem}>
          <input
            id="end-date"
            type="radio"
            name="target"
            onChange={() => setSelectedOption('end-date')}
            checked={selectedOption === 'end-date'}
          />
          <Field
            label={t('untilDate')}
            htmlFor="end-date"
            className={styles.filterPanelItemField}
          >
            <input
              disabled={selectedOption === 'amount'}
              type="date"
              defaultValue={
                localEndDate ? format(localEndDate, 'yyyy-MM-dd') : undefined
              }
              onChange={(e) => {
                setEndDate(e.target.valueAsDate!)
              }}
            />
          </Field>
        </div>
        <div className={styles.filterPanelItem}>
          <input
            id="amount"
            type="radio"
            name="target"
            onChange={() => setSelectedOption('amount')}
            checked={selectedOption === 'amount'}
          />
          <Field
            label={t('target')}
            htmlFor="amount"
            className={styles.filterPanelItemField}
          >
            <NumberFormat
              onValueChange={({ floatValue }) => setTargetAmount(floatValue)}
              value={localTargetAmount}
              disabled={selectedOption === 'end-date'}
              placeholder={t('targetAmount')}
              prefix="₪"
              thousandSeparator
              required
            />
          </Field>
        </div>
        <ButtonsGroup className={styles.buttons}>
          <Button
            primary
            onClick={() => {
              setFilter(
                selectedOption === 'end-date'
                  ? { endDate: localEndDate?.getTime() }
                  : { targetAmount: localTargetAmount }
              )
            }}
          >
            {t('filter')}
          </Button>
        </ButtonsGroup>
      </div>
    </Collapsible>
  )
}
