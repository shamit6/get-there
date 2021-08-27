import { MouseEventHandler } from 'react'
import classnames from 'classnames'
import styles from './Button.module.scss'

export default function Button({
  text,
  onClick,
  linkTheme,
  bordered,
  icon,
}: {
  text: string
  onClick: MouseEventHandler<HTMLButtonElement>
  linkTheme?: boolean
  bordered?: boolean
  icon?: React.ReactNode
}) {
  return (
    <button
      className={classnames(styles.container, {
        [styles.linkButton]: linkTheme,
        [styles.bordered]: bordered,
      })}
      onClick={onClick}
    >
      {icon && <div className={styles.icon}>{icon}</div>}

      {text}
    </button>
  )
}
