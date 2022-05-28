import React, { useState } from 'react'
import Button, { ButtonsGroup } from 'components/button'
import Add from 'components/button/plus.svg'
import { generateNewMortageCourse } from 'utils/mortgageCalculator'
import { CalculatedMortgageProgram } from 'utils/types'
import MortgageCourseCompnent from './MortgageCourse'
import styles from './Mortgage.module.scss'
import { useCurrentMortgage } from 'hooks/useCurrentMortgage'
import { Section } from 'components/Field'

export default function Mortgage() {
  const { currentMortgage, setCurrentMortgage } = useCurrentMortgage()

  const mortgageCourses = currentMortgage?.courses || []
  const [programToFocus, setProgramToFocus] = useState(0)

  return (
    <Section label="Courses" direction="column">
      {mortgageCourses.map((course, i) => (
        <MortgageCourseCompnent
          key={course.id}
          isFocus={i === programToFocus}
          programData={course}
          onProgramCalc={(programData: CalculatedMortgageProgram) => {
            setCurrentMortgage((prevState) => {
              const courses = prevState?.courses!
              return {
                ...prevState,
                courses: [
                  ...courses.slice(0, i),
                  programData,
                  ...courses.slice(i + 1),
                ],
              }
            })
          }}
          onProgramRemove={() => {
            setProgramToFocus(Math.min(i, mortgageCourses.length - 2))
            setCurrentMortgage((prevState) => {
              const courses = prevState?.courses!
              return {
                ...prevState,
                courses: [...courses.slice(0, i), ...courses.slice(i + 1)],
              }
            })
          }}
        />
      ))}
      <ButtonsGroup>
        <Button
          text="Add program"
          onClick={() => {
            setCurrentMortgage((prevState) => {
              const courses = prevState?.courses!
              return {
                ...prevState,
                courses: [...courses, generateNewMortageCourse()],
              }
            })
            setProgramToFocus(mortgageCourses.length)
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
