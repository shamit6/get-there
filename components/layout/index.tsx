import Head from 'next/head'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Layout.module.scss'
import { ReactNode } from 'react'
import Button from 'components/button'
import UpdateBalance from 'components/UpdateBalance'
import { useRouter } from 'next/router'

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user

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
                    src={
                      user?.image ??
                      'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/V8BNOaftJmYSAdW0ROdfRQw4cuWPEXxKwCLcDEAEiGQoBRBD___________8BGJ6i0f_______wE/s72-c-k-no/photo.jpg'
                    }
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
        {session?.user && (
          <nav className={styles.nav}>
            {router.pathname !== '/' && (
              <Link href="/">
                <a>Home</a>
              </Link>
            )}

            {router.pathname !== '/transactions' && (
              <Link href="/transactions">
                <a>Transactions</a>
              </Link>
            )}

            {router.pathname !== '/mortgage' && (
              <Link href="/mortgage">
                <a>Mortgage</a>
              </Link>
            )}

            {/* TODO: show only if balance not updated today */}
            <UpdateBalance />
          </nav>
        )}
        <div className={styles.content}>{children}</div>
      </div>
      <div id="modal-root"></div>
    </>
  )
}
