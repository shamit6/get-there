import Head from 'next/head'
import styles from './Layout.module.scss'
import { ReactNode } from 'react'
import Header from 'components/Header/Header'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import { useTheme } from 'hooks/useTheme'

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { themeId } = useTheme()

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Get-There</title>
      </Head>
      <main className={classnames(styles.wrapper, `theme-${themeId}`)}>
        {router.pathname !== '/login' && <Header />}
        <div className={styles.content}>{children}</div>
      </main>
      <div id="modal-root"></div>
    </>
  )
}
