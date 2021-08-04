import { MouseEventHandler } from 'react'
import classnames from 'classnames'
import styles from './Button.module.scss'

export default function Button({
  text,
  onClick,
  linkTheme,
  bordered,
}: {
  text: string
  onClick: MouseEventHandler<HTMLButtonElement>
  linkTheme?: boolean
  bordered?: boolean
}) {
  return (
    <button
      className={classnames({
        [styles.linkButton]: linkTheme,
        [styles.bordered]: bordered,
      })}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
