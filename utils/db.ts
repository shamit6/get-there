import type {TransactionConfig} from './types'

export function createOrUpdateTransaction(transaction: TransactionConfig ){
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]') as Array<TransactionConfig>;
  transactions.push(transaction)
  localStorage.setItem('transactions', JSON.stringify(transactions));
}