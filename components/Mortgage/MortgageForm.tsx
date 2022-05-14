import MortgageComp from './MortgageCalculator'
import classNames from 'classnames'
import styles from 'components/Field/Field.module.scss'
import { useForm, Controller } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import Button from 'components/button'
import { useCurrentMortgage } from 'hooks/useCurrentMortgage'

function MortgageForm() {
  const { register, handleSubmit, watch, control, formState } = useForm({
    shouldUseNativeValidation: false,
  })
  const {currentMortgage} = useCurrentMortgage()

  return (
    <form
      className={classNames(styles.form, {
        [styles.submitted]: formState.isSubmitted,
      })}
      style={{ flexDirection: 'column' }}
      onSubmit={handleSubmit(() => {
        console.log('submitred')
      })}
      noValidate
    >
      <div className={styles.field}>
        <label>Funding Rate</label>
        <Controller
          control={control}
          name="fundingRate"
          rules={{ required: true }}
          defaultValue={currentMortgage?.fundingRate}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <NumberFormat
                onValueChange={({ value }) => onChange(value)}
                onBlur={onBlur}
                value={value}
                placeholder="3%"
                suffix="%"
                required
              />
              <span />
            </>
          )}
        />
      </div>
      <MortgageComp />

      <Button text="submit" primary className={styles.submitButton} />
    </form>
  )
}

export default MortgageForm
