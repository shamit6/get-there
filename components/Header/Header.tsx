import Button from 'components/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import styles from './Header.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import classnames from 'classnames'
import Popper from '../Popper/Popper'

export default function Header() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user

  const NavEntry = ({ route, label }: { route: string; label: string }) => {
    return (
      <Link href={route}>
        <a
          className={classnames(styles.link, {
            [styles.selected]: router.pathname === route,
          })}
        >
          {label}
        </a>
      </Link>
    )
  }

  return (
    <header className={styles.header}>
      {user && (
        <nav className={styles.nav}>
          <NavEntry route="/" label="Home" />
          <NavEntry route="/transactions" label="Transactions" />
          <NavEntry route="/mortgage" label="Mortgage" />
        </nav>
      )}
      <div className={styles.login}>
        {!user ? (
          <Button text="Sign in" onClick={() => signIn()} linkTheme bordered />
        ) : (
          <>
            <Popper
              content={
                <Button
                  text="Sign out"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  linkTheme
                />
              }
            >
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
            </Popper>
          </>
        )}
      </div>
    </header>
  )
}
