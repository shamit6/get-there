import { ensureAuth } from 'utils/auth'
import TransactionsList from './TransactionsList'
import AssetsTable from 'components/AssetsTable/AssetsTable'

export default async function Page() {
  await ensureAuth()
  return (
    <div>
      <TransactionsList />
      <AssetsTable />
    </div>
  )
}
