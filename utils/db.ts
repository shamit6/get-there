import type {BalanceStatus, TransactionConfig} from './types'

function serialize(transactions: TransactionConfig[]) {
  const serializedList = transactions.map(transaction => {
    const {date, interval, ...rest} = transaction;
    const serialized = {...rest, date: transaction.date.getTime()};

    if (interval) {
      const {endDate} = interval;
      // @ts-ignore
      serialized.interval = {...interval, endDate: endDate && endDate.getTime()};
    }
    return serialized
  })

  return JSON.stringify(serializedList);
}

function diserialize(transactions: string) {
  const diserializedList = JSON.parse(transactions);
  //@ts-ignore
  return diserializedList.map(transaction => {
    const {date, interval, amount, ...rest} = transaction;
    const diserialized = {...rest, date: new Date(Number(transaction.date)), amount: Number(amount as string)};
    if (transaction.interval) {
      const {endDate} = interval;
      // @ts-ignore
      diserialized.interval = {...interval, endDate: endDate && new Date(Number(endDate)), amount: Number(interval.amount as string)};
    }
    return diserialized;

  })
}

export function createOrUpdateTransaction(transaction: TransactionConfig){
  const transactions = diserialize(localStorage.getItem('transactions') || '[]') as Array<TransactionConfig>;
  if (transaction.id) {
    transactions.push(...transactions.filter(({id}) => id !== transaction.id), transaction);
  } else {
    const newId =  Math.max(0, ...transactions.map(({id}) => id!)) + 1;
    transactions.push({...transaction, id: newId})
  }
  localStorage.setItem('transactions', serialize(transactions));
}

export function getAllTransactions(){
  return diserialize(localStorage.getItem('transactions') || '[]') as Array<TransactionConfig>;
}
export function getTransactionById(id: number){
  return getAllTransactions().find((({id: _id})=> _id === id))
}

export function createOrUpdateBalanceStatus(amount: number) {
  localStorage.setItem('currentBalance', JSON.stringify({amount, updatedDate: new Date().getTime()}));
}

export function getBalanceStatus(): BalanceStatus | null {
  const serializedBalance = localStorage.getItem('currentBalance');

  if (!serializedBalance) {
    return null;
  }

  const {amount, updatedDate} = JSON.parse(serializedBalance);
  return {amount: Number(amount), updatedDate: new Date(updatedDate)}
}