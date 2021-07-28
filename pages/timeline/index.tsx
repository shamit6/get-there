import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import Image from 'next/image'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { TransactionConfig } from '../../utils/prisma'
import {
  generateTransactionConfigsOccurances,
  addBalanaceToSortTransaction,
} from '../../utils/transactionsCalculator'

function Timeline() {
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

  const { data: transactions } = useSWR(
    '/api/transaction-configs',
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((transactionConfigs: TransactionConfig[]) => {
          return transactionConfigs.map(({ date, endDate, ...rest }) => ({
            ...rest,
            date: new Date(date),
            endDate: endDate ? new Date(endDate) : undefined,
          }))
        }),
    {}
  )

  if (!transactions || !balanceStatus) {
    return 'loading'
  }

  const allTransactionsOccurances = generateTransactionConfigsOccurances(
    //@ts-ignore
    transactions,
    new Date(2025, 1, 1)
  )
  const transactionToView = addBalanaceToSortTransaction(
    allTransactionsOccurances.filter(
      ({ date }) => date.getTime() >= Date.now()
    ),
    balanceStatus!
  )

  return (
    <div>
      <VerticalTimeline animate={false}>
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
        {transactionToView.map((transaction, index) => (
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
            <div>{`balance: ${transaction.amount!.toLocaleString('he')}`}</div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  )
}
export default Timeline
