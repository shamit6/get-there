import Layout from 'components/layout'
import MortgageForm from 'components/Mortgage/MortgageForm'
import { useCurrentMortgage } from 'hooks/useCurrentMortgage'
import { useEffect } from 'react'
import { generateNewMortage } from 'utils/mortgageCalculator'

function MortgagePage() {
  const {setCurrentMortgage} = useCurrentMortgage()

  useEffect(() => {
    const a  = generateNewMortage()
    console.log('new ', a);
    
    setCurrentMortgage(generateNewMortage())
  }, [])

  return (
    <Layout>
      <MortgageForm />
    </Layout>
  )
}

export default MortgagePage
