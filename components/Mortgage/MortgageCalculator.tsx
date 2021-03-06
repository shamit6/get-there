import React, { useState } from 'react'
import Button, { ButtonsGroup } from 'components/button'
import Add from 'components/button/plus.svg'
import { generateNewMortageCourse } from 'utils/mortgageCalculator'
import MortgageCourseComponent from './MortgageCourse'
import { Section } from 'components/Field'
import { useFieldArray, useFormContext } from 'react-hook-form'

export default function Mortgage() {
  const {control} = useFormContext();  
  const [programToFocus, setProgramToFocus] = useState(0)
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "courses",
  });

  return (
    <Section label="Courses" direction="column">
      {fields.map(({id}, i) => (
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
            append([generateNewMortageCourse()])
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
