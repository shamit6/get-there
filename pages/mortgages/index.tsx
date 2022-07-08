import { format } from 'date-fns'
import { useRouter } from 'next/router'
import styles from './Transactions.module.scss'
import Layout from 'components/layout'
import Loader from 'components/loader'
import Add from 'components/button/plus.svg'
import Button from 'components/button'
import useEnsureLogin from '../../hooks/useEnsureLogin'
import useMortgages from 'hooks/useMortgages'
import { sumBy } from 'lodash'
import { PageHeader } from 'components/Field'

export default function Mortgages() {
  useEnsureLogin()
  const router = useRouter()
  const { isLoading, mortgages } = useMortgages()

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.content}>
          <PageHeader title="Mortgages">
            <Button
              text="New mortgage"
              onClick={() => router.push('/mortgages/new')}
              bordered
              linkTheme
              icon={<Add />}
            />
          </PageHeader>
          <table className={styles.transactionTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Bank</th>
                <th>Amount</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {(mortgages ?? []).map((mortgages) => (
                <tr
                  key={mortgages.id}
                  className={styles.tableRow}
                  onClick={() => router.push(`/mortgages/${mortgages.id}`)}
                >
                  <td>{mortgages.bank}</td>
                  <td>{sumBy(mortgages.courses, 'amount')}</td>
                  <td>{format(mortgages.offeringDate, 'dd/MM/yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}

// // @ts-ignore
// export default function Mortgages({ fallback }) {
//   return (
//     <SWRConfig value={{ fallback }}>
//       <Layout>
//         <ErrorBoundary fallback={() => <Loader />}>
//           <Suspense fallback={<Loader />}>
//             <MortgagesPage />
//           </Suspense>
//         </ErrorBoundary>
//       </Layout>
//     </SWRConfig>
//   )
// }

// export async function getServerSideProps() {

//   return {
//     props: {
//       fallback: {
//         '/api/mortgages': [],
//       },
//     },
//   }
// }
