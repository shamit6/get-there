import TransactionForm from 'components/TransactionForm'
import { ensureAuth } from 'utils/auth'

export default async function Page() {
  await ensureAuth()
  return <TransactionForm />
}
