import { ensureAuth } from 'utils/auth'
import TransactionTable from 'components/TransactionTable/TransactionTable'
import AssetsTable from 'components/AssetsTable/AssetsTable'

export default async function Page() {
  await ensureAuth()
  return (
    <div>
      <TransactionTable />
      <AssetsTable />
    </div>
  )
}
