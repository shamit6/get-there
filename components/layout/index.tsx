import Head from 'next/head'
import styles from './Layout.module.scss'
import { ReactNode } from 'react'
import Header from 'components/Header/Header'
import UpdateBalance from 'components/UpdateBalance'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Get-There</title>
        <meta name="description" content="Put your money where your mouth is" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <div className={styles.wrapper}>
        <Header />
        <div >

        <UpdateBalance />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <div id="modal-root"></div>
    </>
  )
}
