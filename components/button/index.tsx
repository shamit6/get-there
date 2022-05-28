import classnames from 'classnames'
import styles from './Button.module.scss'

interface ButtonProps extends React.ComponentProps<'button'> {
  text?: string
  linkTheme?: boolean
  bordered?: boolean
  primary?: boolean
  icon?: React.ReactNode
  disabled?: boolean
}

export default function Button({
  text,
  onClick,
  linkTheme,
  bordered,
  primary,
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
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
      {...props}
    >
      {icon && <div className={styles.icon}>{icon}</div>}

      {text || children}
    </button>
  )
}

export function ButtonsGroup({
  children,
  className,
  centered,
}: React.PropsWithChildren<{ className?: string; centered?: boolean }>) {
  return (
    <div className={classnames(styles.group, { [styles.centered]: centered }, className)}>
      {children}
    </div>
  )
}
