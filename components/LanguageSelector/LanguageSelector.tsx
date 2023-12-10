import Popper from 'components/Popover'
import LanguageIcon from './language.svg'
import Button from 'components/button'
import { setLocale } from 'app/actions/setLocale'
import { useTranslation } from 'hooks/useTranslation'

function LanguageLink({
  locale,
  language,
}: {
  locale: string
  language: string
}) {
  const { locale: currentLocale } = useTranslation()
  return (
    <div style={{ display: 'block', textDecoration: 'none' }}>
      <Button
        text={language}
        linkTheme
        disabled={locale === currentLocale}
        onClick={async () => {
          await setLocale(locale)
          location.reload()
        }}
      />
    </div>
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
