import { format } from 'date-fns'
import React, { useState } from 'react'
import useBalanceStatus from 'hooks/useBalanceStatus'
import Button, { ButtonsGroup } from '../button'
import Modal from '../Modal'
import Field from 'components/Field'
import NumberFormat from 'react-number-format'
import useTransactionsView from 'hooks/useTransactionsView'
import { useTranslation } from 'hooks/useTranslation'

export function UpdateBalanceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose(): void
}) {
  const [editedAmount, setEditedAmount] = useState(0)

  const { balanceStatuses, updateBalanceStatus } = useBalanceStatus()
  const { currentBalanceAmount } = useTransactionsView()

  const isThereAnyBalance = !!balanceStatuses?.[0]
  const currentBalanceStatus = balanceStatuses?.[0]

  const { t, locale } = useTranslation()

  return (
    <Modal isOpen={isOpen}>
      <>
        {isThereAnyBalance && (
          <p>
            {t('currentEstimatedBalanceIs', {
              amount: currentBalanceAmount?.toLocaleString(locale, {
                style: 'currency',
                currency: 'ILS',
                maximumFractionDigits: 0,
              }),
            })}
            <br />
            {t('lastBalanceUpdate', {
              date: format(currentBalanceStatus!.createdAt, 'P'),
              amount: currentBalanceStatus!.amount.toLocaleString(locale, {
                style: 'currency',
                currency: 'ILS',
                maximumFractionDigits: 0,
              }),
            })}
          </p>
        )}
        <Field label={t('newBalanceAmount')} horizontal>
          <NumberFormat
            onValueChange={(values) => {
              const { floatValue } = values
              setEditedAmount(Math.floor(floatValue!))
            }}
            thousandSeparator
            placeholder="30,000₪"
            suffix="₪"
            tabIndex={1}
          />
        </Field>
        <ButtonsGroup>
          <Button
            text={t('updateBalance')}
            onClick={() => {
              void updateBalanceStatus(editedAmount!)
              onClose()
            }}
            disabled={!editedAmount}
            primary
          />
          <Button
            text={t('cancel')}
            onClick={async () => {
              onClose()
            }}
          />
        </ButtonsGroup>
      </>
    </Modal>
  )
}
