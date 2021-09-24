import CountUp from 'react-countup'
import { useEffect } from 'react'
import style from './Ticker.module.scss'
import classnames from 'classnames'

const suffix = '₪'

export default function Ticker({
  number,
  label,
  small,
  delay = 0,
  duration = 5,
  prefix,
}: {
  number: number
  label: string
  small?: boolean
  delay?: number
  duration?: number
  prefix?: string
}) {
  useEffect(() => {
    localStorage.setItem(label, `${number}`)
  }, [number])
  const previousValue = Number(localStorage.getItem(label))
  const valueChanged = previousValue !== number

  return (
    <CountUp
      prefix={prefix}
      start={previousValue}
      end={number}
      delay={valueChanged ? delay : 0}
      duration={valueChanged ? duration : 0}
      formattingFn={(value) =>
        `${prefix ?? ''}${value.toLocaleString('he')}${suffix}`
      }
    >
      {({ countUpRef }) => (
        <div
          className={classnames({ [style.ticker]: true, [style.small]: small })}
        >
          <span>{label}</span>
          <span className={style.amount} ref={countUpRef} />
        </div>
      )}
    </CountUp>
  )
}
