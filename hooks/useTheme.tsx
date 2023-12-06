'use client'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { dark, light } from '../components/Charts/theme'
import { getDefaultTheme } from 'utils/theme'

export interface Theme {
  theme: any
  themeId: 'dark' | 'light'
  setThemeId(themeId: 'dark' | 'light'): void
}

const ThemeContext = createContext<Theme>({ themeId: 'light' } as Theme)

export function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const [themeId, setThemeId] = useState<'dark' | 'light'>(getDefaultTheme())
  const [theme, setTheme] = useState<any>()

  useEffect(() => {
    if (themeId === 'light') {
      setTheme(light.nivo)
    } else if (themeId === 'dark') {
      setTheme(dark.nivo)
    }
  }, [themeId])

  function handleThemeChange(newThemeId: 'dark' | 'light') {
    setDataThemeAttribute(newThemeId)
    setThemeId(newThemeId)
    localStorage.setItem('theme', newThemeId)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId,
        setThemeId: handleThemeChange,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const value = useContext(ThemeContext)
  return value
}

function setDataThemeAttribute(themeId: string) {
  global?.document?.body?.parentElement?.setAttribute('data-theme', themeId)
}
