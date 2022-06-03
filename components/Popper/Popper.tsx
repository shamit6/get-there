import React, { ReactNode, useState } from 'react'
import Popper from '@mui/material/Popper'

export default function SimplePopper({
  content,
  children,
}: React.PropsWithChildren<{ content: ReactNode }>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  return (
    <div>
      <div aria-describedby={id} onClick={handleClick}>
        {children}
      </div>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        {content}
      </Popper>
    </div>
  )
}
