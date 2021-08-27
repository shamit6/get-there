import Head from 'next/head'
import { signIn, signOut, useSession } from 'next-auth/client'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Layout.module.scss'
import { ReactNode } from 'react'
import Button from '../../components/button'

export default function Layout({ children }: { children: ReactNode }) {
  const [session, loading] = useSession()
  const user = session?.user

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.login}>
          {!session ? (
            <Button
              text="Sign in"
              onClick={() => signIn()}
              linkTheme
              bordered
            />
          ) : (
            <>
              <div className={styles.user}>
                <Image
                  src={user?.image!}
                  className={styles.avatar}
                  width={'20'}
                  height={'20'}
                  alt={user?.email!}
                />
                <span className={styles.name}>{user!.name}</span>
              </div>
              <Button
                text="Sign out"
                onClick={() => signOut({ callbackUrl: '/login' })}
                linkTheme
              />
            </>
          )}
        </div>
      </header>
      <nav className={styles.nav}>
        <Link href="/timeline">
          <a>Timeline</a>
        </Link>
        <Link href="/transactions">
          <a>Transactions</a>
        </Link>
      </nav>
      <Head>
        <title>Get-There</title>
        <meta name="description" content="Put your money where your mouth is" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
