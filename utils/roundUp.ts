export function roundUp(originalNumber: number | undefined = 10_000): number {
  let closest = 10
  while (originalNumber / closest > 1) {
    closest = closest * 10
  }
  return closest * 100
}
