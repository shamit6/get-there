import { format } from 'date-fns'
import { useRouter } from 'next/router'
import useTransaction from '../../hooks/useTransactions'
import styles from './Transactions.module.scss'
import Layout from '../../components/layout'
import Loader from '../../components/loader'
import useBalanceStatus from '../../hooks/useBalanceStatus'
import Add from '../../components/button/plus.svg'
import Button from '../../components/button'
import useEnsureLogin from '../../hooks/useEnsureLogin'

function List() {
  useEnsureLogin()
  const router = useRouter()
  const { isLoading: isLoadingBalance } = useBalanceStatus(true)
  const { transactions, isLoading } = useTransaction()

  return (
    <Layout>
      {isLoading || isLoadingBalance ? (
        <Loader />
      ) : (
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.title}>Transactions</div>
            <Button
              text="New transaction"
              onClick={() => router.push('/transactions/new')}
              bordered
              linkTheme
              icon={<Add />}
            />
          </div>
          <table className={styles.transactionTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Type</th>
                <th>Amount</th>
                <th>When</th>
                <th>Interval</th>
              </tr>
            </thead>
            <tbody>
              {(transactions ?? []).map((transaction) => (
                <tr
                  key={transaction.id}
                  className={styles.tableRow}
                  onClick={() => router.push(`/transactions/${transaction.id}`)}
                >
                  <td>{transaction.type}</td>
                  <td>{transaction.amount.toLocaleString('he')}</td>
                  <td>{format(transaction.date, 'dd/MM/yyyy')}</td>
                  <td>
                    {transaction.timePeriod &&
                      `every ${transaction.periodAmount} ${transaction.timePeriod}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
export default List
