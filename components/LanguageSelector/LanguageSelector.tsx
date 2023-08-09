// language selector component with popover to select hebrew or english language svg
import Popper from 'components/Popover'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import LanguageIcon from './language.svg'
import Button from 'components/button'
import Link from 'next/link'

function LanguageLink({
  locale,
  language,
}: {
  locale: string
  language: string
}) {
  const { i18n } = useTranslation()
  return (
    <Link
      href="/"
      locale={locale}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <Button text={language} linkTheme disabled={i18n.language === locale} />
    </Link>
  )
}

export default function LanguageSelector() {
  const { t } = useTranslation()

  return (
    <Popper
      positions={['right', 'left']}
      content={
        <div>
          <LanguageLink locale="he" language="עברית" />
          <LanguageLink locale="en" language="English" />
        </div>
      }
    >
      <Button icon={<LanguageIcon />} text={t('language')} linkTheme />
    </Popper>
  )
}
