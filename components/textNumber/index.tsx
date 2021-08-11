import NumberFormat, { NumberFormatProps } from 'react-number-format'

export default function TextNumber(props: Partial<NumberFormatProps>) {
  return <NumberFormat {...props} thousandSeparator={true} displayType="text" />
}
