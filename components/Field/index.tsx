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
  children?: ReactChild
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

export function Section({
  label,
  direction,
  children,
}: React.PropsWithChildren<{ label?: string; direction?: 'column' | 'row' }>) {
  return (
    <div className={classnames(styles.section)}>
      {label && <label>{label}</label>}
      <div
        className={classnames(styles.sectionItems, {
          [styles.vertical]: direction === 'column',
        })}
      >
        {children}
      </div>
    </div>
  )
}
