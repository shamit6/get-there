import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Image from 'next/image'
import {TimelineTransaction, TimePeriod} from '../../utils/types';
import {generateTransactionConfigsOccurances, addBalanaceToSortTransaction} from '../../utils/transactionsCalculator';
import {getAllTransactions} from '../../utils/db';
import { useEffect, useState } from 'react';

const currentBalance = 24000;

function Timeline() {
  const [transactions, setTransactions] = useState<TimelineTransaction[]>([]);
  useEffect(() => {
    const allTransactions = generateTransactionConfigsOccurances(getAllTransactions(), new Date(2023, 1, 1));
    const transactionToView = addBalanaceToSortTransaction(
      allTransactions.filter(({date}) =>  date.getTime() >= Date.now()),
      {amount: 30000, updatedDate: new Date(2021, 6, 3)}
      );

      setTransactions(transactionToView);
  }, []);
    
  return (  
    <div>
    <VerticalTimeline animate={false}>
      <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{}}
            contentArrowStyle={{ borderRight: '7px solid #fff' }}
            date={new Date().toDateString()}
            iconStyle={{ background: 'rgb(255, 255, 255)', color: '#fff', padding: '10px'}}
          >
          <div>
            {`current balance: ${currentBalance}`}
          </div>
        </VerticalTimelineElement>
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
