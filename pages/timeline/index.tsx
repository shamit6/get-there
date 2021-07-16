import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Image from 'next/image'
import {BalanceStatus, TimelineTransaction, TimePeriod} from '../../utils/types';
import {generateTransactionConfigsOccurances, addBalanaceToSortTransaction} from '../../utils/transactionsCalculator';
import {getAllTransactions, getBalanceStatus} from '../../utils/db';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

function Timeline() {
  const [transactions, setTransactions] = useState<TimelineTransaction[]>([]);
  const [balanceStatus, setBalanceStatus] = useState<BalanceStatus>();
  const router = useRouter();

  useEffect(() => {
    const allTransactions = generateTransactionConfigsOccurances(getAllTransactions(), new Date(2023, 1, 1));
    const transactionToView = addBalanaceToSortTransaction(
      allTransactions.filter(({date}) =>  date.getTime() >= Date.now()),
      {amount: 30000, updatedDate: new Date(2021, 6, 3)}
      );

      setTransactions(transactionToView);

    const balanceStatus = getBalanceStatus();
    if (!balanceStatus) {
      router.replace('/transactions');
    } else {
      setBalanceStatus(balanceStatus);
    }
  }, []);

  return (  
    <div>
    <VerticalTimeline animate={false}>
      {balanceStatus && <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{}}
            contentArrowStyle={{ borderRight: '7px solid #fff' }}
            date={format(balanceStatus.updatedDate, 'dd/MM/yyyy')}
            iconStyle={{ background: 'rgb(255, 255, 255)', color: '#fff', padding: '10px'}}
          >
          <div>
            {`balance was updated tp: ${balanceStatus.amount}`}
          </div>
        </VerticalTimelineElement>}
      {transactions.map((transaction, index) => {
        return (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{}}
            contentArrowStyle={{ borderRight: '7px solid #fff' }}
            date={transaction.date.toDateString()}
            iconStyle={{ background: 'rgb(255, 255, 255)', color: '#fff', padding: '10px'}}
            icon={<Image 
            src={transaction.amount > 0 ? "/financial-profit.png" : "/recession.png"} 
            alt="Vercel Logo" 
            width={50} 
            height={50} />}
          >
          <span>
            {`${transaction.type}:  `}
          </span>
          <span style={{color: transaction.amount > 0 ? 'green': 'red'}}>
            {transaction.amount}
          </span>
          <div>
            {`balance: ${transaction.balance}`}
          </div>
        </VerticalTimelineElement>
        )
      })}
    </VerticalTimeline>
    </div>
  )
}
export default Timeline
