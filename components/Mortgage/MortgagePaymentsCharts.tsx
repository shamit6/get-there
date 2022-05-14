import React from 'react'
import styles from './Mortgage.module.scss'
import {
  amortizationPaymantsToBurndown,
  AmortizationScheduleTransaction,
} from 'utils/amortizationScheduleCalculator'
import { LineChart } from '../Charts'
import { addMonths, format } from 'date-fns'

export default function MortgagePaymentsCharts({
  mortgagePaymentsSchedule,
}: {
  mortgagePaymentsSchedule: AmortizationScheduleTransaction[]
}) {
  return (
    <div className={styles.amortizationCharts}>
      <LineChart
        anchor="bottom-left"
        minY={0}
        data={[
          {
            id: 'Payment Burndown',
            color: '#b7094c',
            data: amortizationPaymantsToBurndown(
              mortgagePaymentsSchedule.map((d) => d.totalPayment)
            ).map((amount, index) => ({
              x: format(addMonths(new Date(), index), 'dd/MM/yyyy'),
              y: amount,
            })),
          },
        ]}
      />
      <LineChart
        anchor="bottom-left"
        minY={0}
        data={[
          {
            id: 'Total Payment',
            color: '#892b64',
            data: mortgagePaymentsSchedule.map((d, index) => ({
              x: format(addMonths(new Date(), index), 'dd/MM/yyyy'),
              y: d.totalPayment,
            })),
          },
        ]}
      />
      <LineChart
        anchor="bottom-left"
        minY={0}
        data={[
          {
            id: 'Interest Payment',
            color: '#5c4d7d',
            data: mortgagePaymentsSchedule.map((d, index) => ({
              x: format(addMonths(new Date(), index), 'dd/MM/yyyy'),
              y: d.interestPayment,
            })),
          },
          {
            id: 'Principal Payment',
            color: '#2e6f95',
            data: mortgagePaymentsSchedule.map((d, index) => ({
              x: format(addMonths(new Date(), index), 'dd/MM/yyyy'),
              y: d.principalPayment,
            })),
          },
        ]}
      />
    </div>
  )
}
