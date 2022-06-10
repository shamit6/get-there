import Layout from 'components/layout'
import Loader from 'components/loader'
import MortgageForm from 'components/Mortgage/MortgageForm'
import useEnsureLogin from 'hooks/useEnsureLogin'
import useMortgages from 'hooks/useMortgages'
import { useRouter } from 'next/router'

function MortgagePage() {
  useEnsureLogin()
  const router = useRouter()
  const { isLoading, mortgages } = useMortgages()

  const mortgage = mortgages?.find(({ id }) => router.query.id === id)
  console.log(mortgages, mortgage)

  return (
    <Layout>
      {isLoading ? <Loader /> : <MortgageForm mortgage={mortgage!} />}
    </Layout>
  )
}

export default MortgagePage
