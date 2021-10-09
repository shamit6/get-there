import styles from './Field.module.scss'
import { ReactChild } from 'react'
import classnames from 'classnames'

export default function Field({
  label,
  horizontal,
  children,
}: {
  label?: string
  horizontal?: boolean
  children: ReactChild
}) {
  return (
    <div
      className={classnames(styles.field, { [styles.horizontal]: horizontal })}
    >
      {label && <label>{label}</label>}
      {children}
    </div>
  )
}
