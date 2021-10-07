import { format } from 'date-fns'
import React, { useState } from 'react'
import TextNumber from 'components/textNumber'
import useBalanceStatus from 'hooks/useBalanceStatus'
import useTransaction from 'hooks/useTransactions'
import { calcCurrentBalanceAmount } from 'utils/transactionsCalculator'
import Button from '../button'
import Modal from '../Modal'
import styles from './UpdateBalance.module.scss'

function UpdateBalanceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose(): void
}) {
  const [editedAmount, setEditedAmount] = useState(0)

  const { balanceStatuses, updateBalanceStatus, isLoading } =
    useBalanceStatus(true)
  const { transactions, isLoading: isLoadingTransactions } = useTransaction()

  if (isLoadingTransactions || isLoading) {
    return null
  }

  const isThereAnyBalance = !!balanceStatuses?.[0]

  const currentBalanceAmount = isThereAnyBalance
    ? calcCurrentBalanceAmount(transactions!, balanceStatuses?.[0]!)
    : 0

  const currentBalanceStatus = balanceStatuses![0]

  return (
    <Modal isOpen={isOpen}>
      <>
        {isThereAnyBalance && (
          <p>
            Current estimated balance is{' '}
            {currentBalanceAmount.toLocaleString('he', {
              style: 'currency',
              currency: 'ILS',
              maximumFractionDigits: 0,
            })}
            <br />
            Last updated was on{' '}
            {format(currentBalanceStatus!.createdAt, 'dd/MM/yyyy  ')} for{' '}
            {currentBalanceStatus!.amount.toLocaleString('he', {
              style: 'currency',
              currency: 'ILS',
              maximumFractionDigits: 0,
            })}
          </p>
        )}
        <div>
          <label>New amount: </label>
          <TextNumber
            displayType="input"
            placeholder="40,000"
            onValueChange={(values) => {
              const { floatValue } = values
              setEditedAmount(Math.floor(floatValue!))
            }}
          />{' '}
          ₪
        </div>
        <div className={styles.buttonsPanel}>
          <Button
            text="Cancel"
            onClick={async () => {
              onClose()
            }}
          />
          <Button
            text="Update Balance"
            onClick={async () => {
              updateBalanceStatus(editedAmount!)
              onClose()
            }}
            disabled={!editedAmount}
            primary
          />
        </div>
      </>
    </Modal>
  )
}

export default function UpdateBalance() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <div
        className={styles.balanceDisclaimer}
        onClick={() => setIsModalOpen(true)}
      >
        Balance not updated?
      </div>
      <UpdateBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
