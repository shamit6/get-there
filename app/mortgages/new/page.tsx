import MortgageForm from 'components/Mortgage/MortgageForm'
import { generateNewMortgage } from 'utils/mortgageCalculator'

export default async function Page() {
  return <MortgageForm mortgage={generateNewMortgage()} />
}
