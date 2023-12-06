import { ensureAuth } from 'utils/auth'
import TransactionsList from './TransactionsList'

export default async function Page() {
  await ensureAuth()
  return <TransactionsList />
}
