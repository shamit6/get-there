import styles from './Arrow.module.scss'
import classnames from 'classnames'

export enum Direction {
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LEFT = 'left',
}

export default function Arrow({
  className,
  direction = Direction.RIGHT,
}: {
  className: string
  direction?: Direction
}) {
  return (
    <div className={classnames(styles.arrow, styles[direction], className)} />
  )
}
