import styles from './Field.module.scss'
import { ReactChild } from 'react'

export default function Field({
  label,
  children,
}: {
  label?: string
  children: ReactChild
}) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {children}
    </div>
  )
}
