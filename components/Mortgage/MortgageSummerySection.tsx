import Field, { Section } from 'components/Field'
import TextNumber from 'components/textNumber'
import React, { useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { calcTotalSummery } from 'utils/mortgageCalculator'
import { CalculatedMortgageSummery } from 'utils/types'

export default function MortgageSummerySection() {
  const mortgageCourses = useWatch({ name: 'courses' })
  const [mortgageSummery, setMortgageSummery] =
    useState<CalculatedMortgageSummery>()

  useEffect(() => {
    if (
      mortgageCourses?.length > 0 &&
      mortgageCourses.every(
        (course: any) => course.periodInMonths && course.interest
      )
    ) {
      setMortgageSummery(calcTotalSummery(mortgageCourses))
    }
  }, [mortgageCourses])

  if (!mortgageSummery) {
    return null
  }

  return (
    <Section label="Total Payment">
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
            value={mortgageSummery?.totalPayment.toFixed(2)}
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
    </Section>
  )
}
