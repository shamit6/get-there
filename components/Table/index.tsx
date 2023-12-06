'use client'
import classNames from 'classnames'
import styles from './Table.module.scss'

type Column = {
  path: string | string[]
  name: string
  format?: (...value: any[]) => string | number
}

type Row = {
  id?: string
  [key: string]: any
}

function getPathValue(row: Row, path: string | string[]) {
  if (!Array.isArray(path)) {
    return row[path]
  }

  return path.map((currentPath: string) => row[currentPath])
}

function formatCell(row: Row, column: Column) {
  const value = getPathValue(row, column.path)
  if (!column.format) {
    return value
  }

  if (Array.isArray(column.path)) {
    return column.format(...value)
  }

  return column.format(value)
}

export default function Table({
  rows,
  classes,
  columns,
  onRowClick,
}: {
  rows?: Row[]
  columns: Column[]
  classes?: { root?: string; header?: string; row?: string }
  onRowClick(rowId?: string): void
}) {
  return (
    <table className={classNames(styles.root, classes?.root)}>
      <thead>
        <tr className={classNames(styles.header, classes?.header)}>
          {columns.map((column: Column) => (
            <th key={column.name}>{column.name}</th>
          ))}
        </tr>
      </thead>
      {!!rows && (
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={classNames(styles.row, classes?.row)}
              onClick={() => onRowClick(row.id)}
            >
              {columns.map((column) => {
                return (
                  <td key={`${row.id}|${column.path}`}>
                    {formatCell(row, column)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  )
}
