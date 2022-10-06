import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react'
import Layout from 'components/layout'
import styles from './Login.module.scss'
import GoogleIcon from './google-logo.svg'
import Image from 'next/image'
import DemoUser from './demo-user.png'

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
          <div className={styles.icon}>
            <Image alt="demo user" src={DemoUser} height={24} width={24} />
          </div>
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
