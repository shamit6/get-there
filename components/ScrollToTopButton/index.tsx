import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import Button from '../button'
import styles from './ScrollToTopButton.module.scss'

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <Button
      text="Go up!"
      className={classNames(styles.button, { [styles.visible]: isVisible })}
      primary
      onClick={scrollToTop}
    />
  )
}
