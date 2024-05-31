import React, { useState } from 'react'
import Button, { ButtonsGroup } from 'components/button'
import Add from 'components/button/plus.svg'
import { generateNewMortgageCourse } from 'utils/mortgageCalculator'
import MortgageCourseComponent from './MortgageCourse'
import { Section } from 'components/Field'
import { useFieldArray, useFormContext } from 'react-hook-form'

export default function Mortgage() {
  const { control } = useFormContext()
  const [programToFocus, setProgramToFocus] = useState(0)
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'courses',
  })

  return (
    <Section label="Courses" direction="column">
      {fields.map(({ id }, i) => (
        <MortgageCourseComponent
          key={id}
          index={i}
          isFocus={i === programToFocus}
          onProgramRemove={() => {
            remove(i)
            setProgramToFocus(Math.min(i, fields.length - 2))
          }}
        />
      ))}
      <ButtonsGroup>
        <Button
          text="Add program"
          onClick={() => {
            setProgramToFocus(fields.length)
            append([generateNewMortgageCourse()])
          }}
          bordered
          linkTheme
          icon={<Add />}
          type="button"
          tabIndex={2}
        />
      </ButtonsGroup>
    </Section>
  )
}
