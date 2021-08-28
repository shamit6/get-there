import CountUp from 'react-countup'
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
  return (
    <CountUp
      prefix={prefix}
      start={0}
      end={number}
      delay={delay}
      duration={duration}
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
