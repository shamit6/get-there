'use client'
import { format } from 'date-fns'
import React, { useState } from 'react'
import useBalanceStatus from 'hooks/useBalanceStatus'
import useTransaction from 'hooks/useTransactions'
import Button, { ButtonsGroup } from '../button'
import Modal from '../Modal'
import Field from 'components/Field'
import NumberFormat from 'react-number-format'
import useTransactionsView from 'hooks/useTransactionsView'

export function UpdateBalanceModal({
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

  const { currentBalanceAmount } = useTransactionsView()

  const currentBalanceStatus = balanceStatuses?.[0]

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
        <Field label="New amount:" horizontal>
          <NumberFormat
            onValueChange={(values) => {
              const { floatValue } = values
              setEditedAmount(Math.floor(floatValue!))
            }}
            thousandSeparator
            placeholder="new amount"
            suffix="₪"
            tabIndex={1}
          />
        </Field>
        <ButtonsGroup>
          <Button
            text={`${isThereAnyBalance ? 'Update' : 'Set'} Balance`}
            onClick={async () => {
              updateBalanceStatus(editedAmount!)
              onClose()
            }}
            disabled={!editedAmount}
            primary
          />
          <Button
            text="Cancel"
            onClick={async () => {
              onClose()
            }}
          />
        </ButtonsGroup>
      </>
    </Modal>
  )
}
