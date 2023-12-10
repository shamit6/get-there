'use client'

import { PropsWithChildren } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Button from 'components/button'
import styles from './Header.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import classnames from 'classnames'
import Popper from '../Popover'
import Logo from '../../public/logo.svg'
import { useTheme } from 'hooks/useTheme'
import { ThemeToggle } from 'components/ThemeToggle/ThemeToggle'
import LanguageSelector from 'components/LanguageSelector/LanguageSelector'
import Logout from './logout.svg'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'hooks/useTranslation'

const NavEntry = ({
  route,
  children,
  logo,
}: PropsWithChildren<{ logo?: boolean; route: string }>) => {
  const pathname = usePathname()

  return (
    <Link
      href={route}
      className={classnames(styles.link, {
        [styles.selected]: pathname === route,
        [styles.logo]: logo,
      })}
    >
      {children}
    </Link>
  )
}

export default function Header() {
  const { data: session } = useSession()
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
          <NavEntry route="/transactions">{t('transactions')}</NavEntry>
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
                    icon={<Logout />}
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
