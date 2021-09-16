import styles from './Loader.module.scss'
import Money from '../../svgs/money.svg'

export default function Loader() {
  return (
    <div className={styles.loader}>
      <Money />
    </div>
  )
}
