import { ReactChild } from 'react'
import ReactDOM from 'react-dom'
import styles from './Modal.module.scss'

export default function Modal({
  isOpen,
  children,
}: {
  isOpen: boolean
  children: ReactChild
}) {
  return isOpen
    ? ReactDOM.createPortal(
        <div className={styles.overlay}>
          <div className={styles.container}>{children}</div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
      )
    : null
}
