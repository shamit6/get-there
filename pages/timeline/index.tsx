import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { TimelineTransaction } from '../../utils/types'
import {
  generateTransactionConfigsOccurances,
  addBalanaceToSortTransaction,
} from '../../utils/transactionsCalculator'
import { getAllTransactions, getBalanceStatus } from '../../utils/db'
import useSWR from 'swr'

function Timeline() {
  const [transactions, setTransactions] = useState<TimelineTransaction[]>([])
  const router = useRouter()
  const { error, data: balanceStatus } = useSWR(
    '/api/balance-statuses?last=true',
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then(({ createdAt, amount }) => ({
          createdAt: new Date(createdAt),
          amount,
        }))
  )

  useEffect(() => {
    if (balanceStatus) {
      const allTransactions = generateTransactionConfigsOccurances(
        getAllTransactions(),
        new Date(2030, 1, 1)
      )

      const transactionToView = addBalanaceToSortTransaction(
        allTransactions.filter(({ date }) => date.getTime() >= Date.now()),
        balanceStatus
      )

      setTransactions(transactionToView)
    }
  }, [router, balanceStatus])
  if (!error && !balanceStatus) {
    return 'loading'
  }

  return (
    <div>
      <VerticalTimeline animate={false}>
        {balanceStatus && (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{}}
            contentArrowStyle={{ borderRight: '7px solid #fff' }}
            date={format(balanceStatus.createdAt, 'dd/MM/yyyy')}
            iconStyle={{
              background: 'rgb(255, 255, 255)',
              color: '#fff',
              padding: '10px',
            }}
          >
            <div>{`balance was updated tp: ${balanceStatus.amount}`}</div>
          </VerticalTimelineElement>
        )}
        {transactions.map((transaction, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{}}
            contentArrowStyle={{ borderRight: '7px solid #fff' }}
            date={transaction.date.toDateString()}
            iconStyle={{
              background: 'rgb(255, 255, 255)',
              color: '#fff',
              padding: '10px',
            }}
            icon={
              <Image
                src={
                  transaction.amount > 0
                    ? '/financial-profit.png'
                    : '/recession.png'
                }
                alt="Vercel Logo"
                width={50}
                height={50}
              />
            }
          >
            <span>{`${transaction.type}:  `}</span>
            <span style={{ color: transaction.amount > 0 ? 'green' : 'red' }}>
              {transaction.amount.toLocaleString('he')}
            </span>
            <div>{`balance: ${transaction.balance!.toLocaleString('he')}`}</div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  )
}
export default Timeline
