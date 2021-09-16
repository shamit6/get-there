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
  disabled,
}: {
  text: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  linkTheme?: boolean
  bordered?: boolean
  primary?: boolean
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
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
      disabled={disabled}
    >
      {icon && <div className={styles.icon}>{icon}</div>}

      {text}
    </button>
  )
}
