import { format } from 'date-fns';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAllTransactions } from '../../utils/db';
import { TransactionConfig } from '../../utils/types';
import styles from './Transactions.module.scss';

function List() {
  const [transactions, setTransactions] = useState<TransactionConfig[]>([]);
  const router = useRouter();

  useEffect(() => {
    const allTransactions = getAllTransactions();
    
    setTransactions(allTransactions);
  }, []);
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link href="/timeline">
          <a>Timeline</a>
        </Link>
        <Link href="/transaction/new">
          <a>New Transaction</a>
        </Link>
      </div>
      <div className={styles.content}>
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
            {transactions.map(transaction => {
              return (
                <tr key={transaction.id} className={styles.tableRow} onClick={() => router.push(`/transactions/${transaction.id}`)}>
                  <td>{transaction.type}</td>
                  <td>{transaction.amount}</td>
                  <td>{format(transaction.date, 'dd/MM/yyyy')}</td>
                  <td>{transaction.interval && `every ${transaction.interval.amount} ${transaction.interval.timePeriod}`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className={styles.balancePanel}>
          <span>
            Current Balance: 
          </span>
          <input value={40000}/>
          <button>Update Balance</button>
        </div>
      </div>
    </div>
  )
}
export default List