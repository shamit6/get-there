import React, { ReactNode, useRef, useState } from 'react'
import { Popover, ArrowContainer, PopoverPosition } from 'react-tiny-popover'
import styles from './Popover.module.scss'

export default function SimplePopover({
  content,
  children,
  triggerElementStyles,
  positions
}: React.PropsWithChildren<{
  content: ReactNode
  triggerElementStyles?: React.CSSProperties
  positions?: PopoverPosition[]
}>) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const clickMeButtonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={positions ?? ['bottom', 'top', 'right', 'left']}
      padding={3}
      onClickOutside={() => setIsPopoverOpen(false)}
      ref={clickMeButtonRef}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor="var(--primary-color)"
          arrowSize={7}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          <div className={styles.contentContainer}>{content}</div>
        </ArrowContainer>
      )}
    >
      <div
        style={{
          display: 'inline-block',
          cursor: 'pointer',
          ...triggerElementStyles,
        }}
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        {children}
      </div>
    </Popover>
  )
}
