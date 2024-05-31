import styles from './Field.module.scss'
import React, { ReactChild } from 'react'
import classnames from 'classnames'

export default function Field({
  label,
  horizontal,
  children,
  htmlFor,
  className,
}: {
  label?: string
  horizontal?: boolean
  children?: ReactChild
  htmlFor?: string
  className?: string
}) {
  return (
    <div
      className={classnames(
        styles.field,
        { [styles.horizontal]: horizontal },
        className
      )}
    >
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      <span />
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

export function PageHeader({
  children,
  title,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  )
}
