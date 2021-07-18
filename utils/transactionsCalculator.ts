import type {TransactionConfig, Transaction, TimePeriod, BalanceStatus, TimelineTransaction} from "./types";
import {addWeeks, addMonths, addYears, isAfter, min} from "date-fns";

function getNextIntervalTimeFunc(timePeriod: TimePeriod): (date: Date | number, amount: number) => Date {
  switch (timePeriod) {
    case 'week':
      return addWeeks;
    case 'month':
      return addMonths;
    default:
      return addYears;
  }
} 

function generateTransactionConfigOccurances(transactionConfig: TransactionConfig, untilDate: Date): Transaction[] {
  const {date, interval, type, amount} = transactionConfig;
  const transactionOccurances: Transaction[] = [{amount, type, date}];
  
  if (!interval) {
    return transactionOccurances;
  }

  let currentDate = date;
  const getNextIntervalTime = getNextIntervalTimeFunc(interval!.timePeriod);
  const generateUntilDate = interval!.endDate? min([untilDate, interval!.endDate]) : untilDate;

  while (!isAfter(currentDate, generateUntilDate)) {
    currentDate = getNextIntervalTime(currentDate, interval!.amount);
    transactionOccurances.push({amount, type, date: currentDate});
  }

  return transactionOccurances;
}

export function generateTransactionConfigsOccurances(transactionConfigs: TransactionConfig[], untilDate: Date): Transaction[] {
  const transactionConfigsOccurances = transactionConfigs.flatMap(
    transactionConfig => generateTransactionConfigOccurances(transactionConfig, untilDate)
  )
  return transactionConfigsOccurances.sort(function compare(t1, t2){
    return t1.date.getTime() - t2.date.getTime();
  });
}

export function addBalanaceToSortTransaction(transactions: Transaction[], balanceStatus: BalanceStatus) {
  const transactionsWithBalance: TimelineTransaction[] = [];
  const {createdAt, amount}  = balanceStatus;
  let currentAmount = amount;
  
  transactions.forEach(transaction => {    
    if (!isAfter(transaction.date, createdAt)) {      
      transactionsWithBalance.push(transaction);
    } else {      
      currentAmount += transaction.amount;
      transactionsWithBalance.push({...transaction, balance: currentAmount});
    }
  });

  return transactionsWithBalance;
}

export function getCurrentBalanceAmount(transactionConfigs: TransactionConfig[], balanceStatus: BalanceStatus){
  if (transactionConfigs.length === 0) {
    return balanceStatus.amount;
  }
  
  const transactionsUntilNow = generateTransactionConfigsOccurances(transactionConfigs, new Date());
  const transactionsWithBlance = addBalanaceToSortTransaction(transactionsUntilNow, balanceStatus);

  return transactionsWithBlance[transactionsWithBlance.length - 1].balance;
}
