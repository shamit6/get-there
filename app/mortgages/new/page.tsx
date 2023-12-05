import MortgageForm from 'components/Mortgage/MortgageForm'
import { generateNewMortage } from 'utils/mortgageCalculator'

export default async function Page() {
  return <MortgageForm mortgage={generateNewMortage()} />
}
