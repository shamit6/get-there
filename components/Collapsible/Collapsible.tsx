import Arrow, { Direction } from 'components/arrow'
import Button from 'components/button'
import { useState } from 'react'
import styles from './Collapsible.module.scss'

export default function Collapsible({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button
        linkTheme
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={1}
        type="button"
        style={{ fontSize: '1.2em' }}
      >
        <Arrow
          className={styles.arrow}
          direction={isOpen ? Direction.DOWN : Direction.RIGHT}
        />
        {label}
      </Button>
      {isOpen && <>{children}</>}
    </div>
  )
}
