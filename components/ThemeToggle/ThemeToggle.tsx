import style from './ThemeToggle.module.scss'
import classnames from 'classnames'

interface ThemeToggleProps {
  theme: 'dark' | 'light'
  onClick(): void
}

export function ThemeToggle({ theme, onClick }: ThemeToggleProps) {
  return (
    <div className={style.themeToggle}>
      <label
        htmlFor="themeToggle"
        className={classnames({ [style.checked]: theme === 'light' })}
      ></label>
      <input
        type="checkbox"
        id="themeToggle"
        checked={theme === 'light'}
        onChange={onClick}
      />
    </div>
  )
}
