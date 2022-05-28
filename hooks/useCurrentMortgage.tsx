import React, { createContext, useState, useContext, ReactElement } from 'react'
import { Mortgage } from 'utils/types'

interface CurrentMortgageContextProps {
  currentMortgage: Partial<Mortgage>
  setCurrentMortgage:  React.Dispatch<React.SetStateAction<Partial<Mortgage>>>
}

const CurrentMortgageContext = createContext<CurrentMortgageContextProps>({
  currentMortgage: {},
  setCurrentMortgage: () => {},
})

export function CurrentMortgageProvider({
  children,
  mortgage
}: React.PropsWithChildren<{mortgage: Partial<Mortgage>}>): ReactElement {
  const [value, setValue] = useState<Partial<Mortgage>>(mortgage)

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
