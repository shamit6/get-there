import { PropsWithChildren } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Button from 'components/button'
import { useRouter } from 'next/router'
import styles from './Header.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import classnames from 'classnames'
import Popper from '../Popover'
import Logo from '../../public/logo.svg'
import { useTheme } from 'hooks/useTheme'
import { ThemeToggle } from 'components/ThemeToggle/ThemeToggle'
import { useTranslation } from 'next-i18next'
import LanguageSelector from 'components/LanguageSelector/LanguageSelector'

const NavEntry = ({
  route,
  children,
  logo,
}: PropsWithChildren<{ logo?: boolean; route: string }>) => {
  const router = useRouter()

  return (
    <Link
      href={route}
      className={classnames(styles.link, {
        [styles.selected]: router.pathname === route,
        [styles.logo]: logo,
      })}
    >
      {children}
    </Link>
  )
}

export default function Header() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { themeId, setThemeId } = useTheme()
  const { t } = useTranslation()
  const user = session?.user

  return (
    <header className={styles.header}>
      {user && (
        <nav className={styles.nav}>
          <NavEntry logo route="/">
            <Logo />
          </NavEntry>
          <NavEntry route="/transactions">Transactions</NavEntry>
          <NavEntry route="/mortgages">{t('mortgage')}</NavEntry>
        </nav>
      )}
      <div className={styles.login}>
        {!user ? (
          <Button text="Sign in" onClick={() => signIn()} linkTheme bordered />
        ) : (
          <>
            <Popper
              content={
                <>
                  <Button linkTheme style={{ margin: 'auto' }}>
                    <ThemeToggle
                      theme={themeId}
                      onClick={() => {
                        setThemeId(themeId === 'light' ? 'dark' : 'light')
                      }}
                    />
                  </Button>
                  <LanguageSelector />
                  <Button
                    text="Sign out"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    linkTheme
                  />
                </>
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
