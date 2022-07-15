import Button from 'components/button'
import { format } from 'date-fns'
import { useState } from 'react'
import NumberFormat from 'react-number-format'
import Collapsible from '../Collapsible/Collapsible'
import Field from '../Field'
import styles from './TargetPanel.module.scss'

export default function TargetPanel({
  endDate,
  targetAmount,
  onSubmit,
}: {
  endDate: Date
  targetAmount?: number
  onSubmit: (prop: { targetAmount?: number; endDate?: Date }) => void
}) {
  const [localEndDate, setEndDate] = useState<Date>(endDate)
  const [localTargetAmount, setTargetAmount] = useState<number | undefined>(
    targetAmount
  )
  const [selectedOption, setSelectedOption] = useState<'amount' | 'end-date'>(
    !!targetAmount ? 'amount' : 'end-date'
  )

  return (
    <Collapsible label="filter options:">
      <div className={styles.filterPanel}>
        <input
          id="end-date"
          type="radio"
          name="target"
          onClick={() => setSelectedOption('end-date')}
          checked={selectedOption === 'end-date'}
        />
        <Field label="Until date:" horizontal htmlFor="end-date">
          <input
            disabled={selectedOption === 'amount'}
            type="date"
            defaultValue={format(localEndDate, 'yyyy-MM-dd')}
            onChange={(e) => {
              setEndDate(e.target.valueAsDate!)
            }}
          />
        </Field>
        <input
          id="amount"
          type="radio"
          name="target"
          onClick={() => setSelectedOption('amount')}
          checked={selectedOption === 'amount'}
        />
        <Field label="Target:" horizontal htmlFor="amount">
          <NumberFormat
            onValueChange={({ floatValue }) => setTargetAmount(floatValue)}
            value={localTargetAmount}
            disabled={selectedOption === 'end-date'}
            placeholder="target amount"
            prefix="₪"
            thousandSeparator
            required
          />
        </Field>
        <Button
          primary
          onClick={() => {
            onSubmit(
              selectedOption === 'end-date'
                ? { endDate: localEndDate }
                : { targetAmount: localTargetAmount }
            )
          }}
        >
          Submit
        </Button>
      </div>
    </Collapsible>
  )
}
