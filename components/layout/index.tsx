import Head from 'next/head'
import styles from './Layout.module.scss'
import { ReactNode } from 'react'
import Header from 'components/Header/Header'
import { useRouter } from 'next/router'

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Get-There</title>
        <meta name="description" content="Put your money where your mouth is" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      </Head>
      <div className={styles.wrapper}>
        {router.pathname !== '/login' && <Header />}
        <div className={styles.content}>{children}</div>
      </div>
      <div id="modal-root"></div>
    </>
  )
}
