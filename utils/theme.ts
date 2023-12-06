function isBrowserDefaultDark() {
  return !!global?.matchMedia('(prefers-color-scheme: dark)').matches
}

export function getDefaultTheme(): 'dark' | 'light' {
  try {
    const localStorageTheme = localStorage.getItem('theme')
    if (localStorageTheme === 'dark' || localStorageTheme === 'light') {
      return localStorageTheme
    }
    const browserDefault = isBrowserDefaultDark() ? 'dark' : 'light'
    return browserDefault
  } catch (error) {
    return 'light'
  }
}
