import React, { ReactNode, useRef, useState } from 'react'
import { Popover, ArrowContainer } from 'react-tiny-popover'
import styles from './Popover.module.scss'

export default function SimplePopover({
  content,
  children,
}: React.PropsWithChildren<{ content: ReactNode }>) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const clickMeButtonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['bottom', 'top', 'right', 'left']}
      padding={3}
      onClickOutside={() => setIsPopoverOpen(false)}
      ref={clickMeButtonRef}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor="#fa9898"
          arrowSize={7}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          <div className={styles.contentContainer}>{content}</div>
        </ArrowContainer>
      )}
    >
      <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{children}</div>
    </Popover>
  )
}
