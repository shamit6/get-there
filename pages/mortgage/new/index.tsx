import Layout from 'components/layout'
import MortgageForm from 'components/Mortgage/MortgageForm'
import { CurrentMortgageProvider } from 'hooks/useCurrentMortgage'
import { generateNewMortage } from 'utils/mortgageCalculator'

function MortgagePage() {
  return (
    <Layout>
      <CurrentMortgageProvider mortgage={generateNewMortage()}>
        <MortgageForm />
      </CurrentMortgageProvider>
    </Layout>
  )
}

export default MortgagePage
