import Layout from 'components/layout'
import MortgageForm from 'components/Mortgage/MortgageForm'
import { generateNewMortage } from 'utils/mortgageCalculator'

function MortgagePage() {
  return (
    <Layout>
      <MortgageForm mortgage={generateNewMortage()} />
    </Layout>
  )
}

export default MortgagePage
