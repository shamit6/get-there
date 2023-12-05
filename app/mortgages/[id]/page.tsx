'use client'
import MortgageForm from 'components/Mortgage/MortgageForm'
import useMortgages from 'hooks/useMortgages'

export default function Page({ params }: { params: { id: string } }) {
  const { mortgages } = useMortgages()
  const mortgage = mortgages?.find(({ id }) => params.id === id)

  return <MortgageForm mortgage={mortgage!} />
}
