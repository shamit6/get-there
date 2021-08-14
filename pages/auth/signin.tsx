import { ClientSafeProvider, getProviders, signIn } from 'next-auth/client'
import Layout from '../../components/layout'
import googleStyles from './Google.module.scss'
import styles from './Signin.module.scss'
import Icon from './btn_google_dark_normal_ios.svg'

export default function SignIn({
  providers,
}: {
  providers: Record<string, ClientSafeProvider>
}) {
  return (
    <Layout>
      <div className={styles.wrapper}>
        <div
          className={googleStyles['g-sign-in-button']}
          onClick={() => signIn(providers.google.id)}
        >
          <div className={googleStyles['content-wrapper']}>
            <div className={googleStyles['logo-wrapper']}>
              <Icon />
            </div>
            <span className={googleStyles['text-container']}>
              <span>Sign in with Google</span>
            </span>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
