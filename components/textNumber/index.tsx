import NumberFormat, { NumberFormatProps } from 'react-number-format'

export default function TextNumber(props: Partial<NumberFormatProps>) {
  return (
    <NumberFormat
      displayType="text"
      {...props}
      thousandSeparator={true}
      renderText={(formattedValue) => formattedValue}
    />
  )
}
