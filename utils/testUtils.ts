export function numberValuesToFixed<T>(object: T, fractionDigits?: number): T {
  const roundedObject = object

  Object.entries(object).forEach(([key, value]) => {
    // @ts-ignore
    roundedObject[key] =
      typeof value !== 'number' ? value : Number(value.toFixed(fractionDigits))
  })

  return roundedObject
}
