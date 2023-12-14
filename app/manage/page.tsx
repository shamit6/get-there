import { ensureAuth } from 'utils/auth'
import TransactionTable from 'components/TransactionTable/TransactionTable'
import AssetsTable from 'components/AssetsTable/AssetsTable'
import MortgagesList from 'components/MortgagesList/MortgagesList'

export default async function Page() {
  await ensureAuth()
  return (
    <div>
      <TransactionTable />
      <AssetsTable />
      <MortgagesList />
    </div>
  )
}
