import { getStocks } from 'db/stocks'
import { useCallback } from 'react'
import useSWR from 'swr'
import type { Stock } from 'utils/types'

function upsertToStockList(list: Stock[], stock: Stock) {
  if (!stock.id) {
    return [...list, stock]
  } else {
    const index = list.findIndex((s) => s.id === stock.id)
    if (index === -1) {
      return [...list, stock]
    } else {
      return [...list.slice(0, index), stock, ...list.slice(index + 1)]
    }
  }
}

export default function useStocks() {
  const { data, mutate, error } = useSWR<Stock[]>('/api/stocks', getStocks)

  const upsertStock = useCallback(
    async (stock: Stock) => {
      await mutate(
        async () => {
          const { id, ...stockData } = stock
          const isNewStock = !id
          const url = isNewStock ? '/api/stocks' : `/api/stocks/${id}`

          const upsertedStock = await fetch(url, {
            method: isNewStock ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stockData),
          })
            .then((r) => r.json())
            .then(({ stockBuyDate, ...rest }) => ({
              ...rest,
              stockBuyDate: new Date(stockBuyDate),
            }))

          return upsertToStockList(data || [], upsertedStock)
        },
        {
          optimisticData: (stocks = []) => {
            return upsertToStockList(stocks, stock)
          },
          populateCache: true,
          rollbackOnError: true,
        }
      )
    },
    [mutate, data]
  )

  const deleteStock = useCallback(
    async (stockId: string) => {
      await mutate(
        async (stocks = []) => {
          await fetch(`/api/stocks/${stockId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          })
          return stocks.filter((stock) => stock.id !== stockId)
        },
        {
          optimisticData: (stocks = []) =>
            stocks.filter((stock) => stock.id !== stockId),
          populateCache: true,
          rollbackOnError: true,
        }
      )
    },
    [mutate]
  )

  return {
    stocks: data || [],
    isLoading: !error && !data,
    isError: error,
    upsertStock,
    deleteStock,
  }
}
