import React, { useState } from 'react'
import styles from './UpdateBalance.module.scss'
import Popover from 'components/Popover'
import Icon from './info.svg'
import { UpdateBalanceModal } from './UpdateBalanceModal'
import { useTranslation } from 'hooks/useTranslation'

export default function UpdateBalance() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <UpdateBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Popover
        content={
          <div className={styles.balanceDisclaimer}>
            {t('updateBalanceMessage')}{' '}
            <a onClick={() => setIsModalOpen(true)}>{t('here')}</a>
          </div>
        }
        triggerElementStyles={{ height: '24px' }}
      >
        <Icon />
      </Popover>
    </>
  )
}
