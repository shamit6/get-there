import Field from 'components/Field'
import TextNumber from 'components/textNumber'
import React from 'react'
import { CalculatedMortgageSummery } from 'utils/types'
import styles from './Mortgage.module.scss'

export default function MortgageSummerySection({
  mortgageSummery,
}: {
  mortgageSummery?: CalculatedMortgageSummery
}) {
  return (
    <div className={styles.mortgageSummery}>
      <Field label="Loan amount">
        <div>
          <TextNumber
            value={mortgageSummery?.originalPrincipalPayment.toFixed(2)}
            prefix="₪"
          />
        </div>
      </Field>
      <Field label="Monthly payment">
        <div>
          <TextNumber
            value={mortgageSummery?.monthlyPayment.toFixed(2)}
            prefix="₪"
          />
        </div>
      </Field>
      <Field label="Max monthly payment">
        <div>
          <TextNumber
            value={mortgageSummery?.maxMonthlyPayment.toFixed(2)}
            prefix="₪"
          />
        </div>
      </Field>
      <Field label="Interest payment">
        <div>
          <TextNumber
            value={mortgageSummery?.interestPayment.toFixed(2)}
            prefix="₪"
          />
        </div>
      </Field>
      <Field label="Total payment">
        <div>
          <TextNumber
            value={mortgageSummery?.currencyRatio.toFixed(2)}
            prefix="₪"
          />
        </div>
      </Field>
      <Field label="Currency ratio">
        <div>
          <TextNumber
            value={mortgageSummery?.currencyRatio.toFixed(2)}
            prefix="₪"
          />
        </div>
      </Field>
    </div>
  )
}
