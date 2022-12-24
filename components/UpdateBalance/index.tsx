import React, { useState } from 'react'
import styles from './UpdateBalance.module.scss'
import Popover from 'components/Popover'
import Icon from './info.svg'
import { UpdateBalanceModal } from './UpdateBalanceModal'

export default function UpdateBalance() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <UpdateBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Popover
        content={
          <div className={styles.balanceDisclaimer}>
            This is your estimated current balance. isn't it correct? click{' '}
            <a onClick={() => setIsModalOpen(true)}>here</a> to update
          </div>
        }
        triggerElementStyles={{ height: '24px' }}
      >
        <Icon />
      </Popover>
    </>
  )
}
