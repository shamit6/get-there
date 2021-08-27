import { MouseEventHandler } from 'react'
import classnames from 'classnames'
import styles from './Button.module.scss'

export default function Button({
  text,
  onClick,
  linkTheme,
  bordered,
  primary,
  icon,
  className,
}: {
  text: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  linkTheme?: boolean
  bordered?: boolean
  primary?: boolean
  icon?: React.ReactNode
  className?: string
}) {
  return (
    <button
      className={classnames(
        styles.container,
        {
          [styles.linkButton]: linkTheme,
          [styles.bordered]: bordered,
          [styles.primary]: primary,
        },
        className
      )}
      onClick={onClick}
    >
      {icon && <div className={styles.icon}>{icon}</div>}

      {text}
    </button>
  )
}
