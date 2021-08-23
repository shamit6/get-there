import CountUp from 'react-countup'
import style from './Ticker.module.scss'

export default function Ticker({
  number,
  label,
}: {
  number: number
  label: string
}) {
  return (
    <CountUp start={0} end={number} delay={0} duration={5}>
      {({ countUpRef }) => (
        <div className={style.ticker}>
          <span>{label}</span>
          <span ref={countUpRef} />
        </div>
      )}
    </CountUp>
  )
}
