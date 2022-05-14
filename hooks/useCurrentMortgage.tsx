import React, { createContext, useState, useContext, ReactElement } from 'react'
import { Mortgage } from 'utils/types'

interface CurrentMortgageContextProps {
  currentMortgage: Partial<Mortgage> | null
  setCurrentMortgage:  React.Dispatch<React.SetStateAction<Partial<Mortgage> | null>>
}

const CurrentMortgageContext = createContext<CurrentMortgageContextProps>({
  currentMortgage: null,
  setCurrentMortgage: () => null,
})

export function CurrentMortgageProvider({
  children,
}: React.PropsWithChildren<{}>): ReactElement {
  const [value, setValue] = useState<Partial<Mortgage> | null>(null)

  return (
    <CurrentMortgageContext.Provider
      value={{ currentMortgage: value, setCurrentMortgage: setValue }}
    >
      {children}
    </CurrentMortgageContext.Provider>
  )
}

export function useCurrentMortgage() {
  return useContext(CurrentMortgageContext)
}
