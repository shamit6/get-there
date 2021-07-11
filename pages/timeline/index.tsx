import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Image from 'next/image'
import {TransactionConfig, TimePeriod} from '../../utils/types';
import {generateTransactionConfigsOccurances, addBalanaceToSortTransaction} from '../../utils/transactionsCalculator';

const transactionConfigs: TransactionConfig[] = [
  {
    type: 'salary', 
    date: new Date(2021, 1, 1), 
    amount: 10000, 
    interval: {timePeriod: TimePeriod.MONTH, amount:1}
  },
  {
    type: 'lease', 
    date: new Date(2021, 7, 1), 
    amount: 3000, 
    interval: {timePeriod: TimePeriod.MONTH, amount:1}
  },
  {
    type: 'credit card', 
    date: new Date(2021, 6, 10), 
    amount: -4000, 
    interval: {timePeriod: TimePeriod.MONTH, amount:1}
  },
]
const currentBalance = 24000;
const allTransactions = generateTransactionConfigsOccurances(transactionConfigs, new Date(2023, 1, 1));

function Timeline() {
  const transactionToView = addBalanaceToSortTransaction(
    allTransactions.filter(({date}) =>  date.getTime() >= Date.now()),
    {amount: 30000, updatedDate: new Date(2021, 6, 3)}
  );
  
  return (  
    <div style={{backgroundColor: '#dff3d8'}} >
    <VerticalTimeline>
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
      {transactionToView.map((transaction, index) => {
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
          <div style={{color: transaction.amount > 0 ? 'green': 'red'}}>
            {transaction.amount}
          </div>
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
