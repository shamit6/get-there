import { Asset } from '@prisma/client'

const YEAR_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 365

export function calcCurrentEstimatedAssetValue(asset: Asset) {
  const { cashValue, cashValueDate, increasingValueRate } = asset

  return (
    cashValue *
    (1 +
      (((new Date().getTime() - cashValueDate.getTime()) /
        YEAR_IN_MILLISECONDS) *
        (increasingValueRate ?? 0)) /
        100)
  )
}
