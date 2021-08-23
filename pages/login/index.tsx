import { ClientSafeProvider, getProviders, signIn } from 'next-auth/client'
import Layout from '../../components/layout'
import styles from './Login.module.scss'
import GoogleIcon from './google-logo.svg'

export default function Login({
  providers,
}: {
  providers: Record<string, ClientSafeProvider>
}) {
  return (
    <Layout>
      <div className={styles.wrapper}>
        <button
          className={styles.googleButton}
          onClick={() => signIn(providers.google.id)}
        >
          <div className={styles.icon}>
            <GoogleIcon />
          </div>
          Sign in with Google
        </button>
        <button
          className={styles.googleButton}
          onClick={() => signIn(providers.demo.id)}
        >
          <div className={styles.icon}></div>
          Sign in with demo user
        </button>
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
