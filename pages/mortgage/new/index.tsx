import Layout from 'components/layout'
import MortgageComp from 'components/Mortgage'
import classNames from 'classnames'
import styles from 'components/TransactionForm/Form.module.scss'
import { useForm, Controller } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import Button from 'components/button'

function MortgagePage() {
  const { register, handleSubmit, watch, control, formState } = useForm({
    shouldUseNativeValidation: false,
  })

  return (
    <Layout>
      <div>
        <form
          className={classNames(styles.form, {
            [styles.submitted]: formState.isSubmitted,
          })}
          style={{ maxWidth: 'auto', flexDirection: 'column' }}
          onSubmit={handleSubmit(() => {
            console.log('submitred');
            
          })}
          noValidate
        >
          <div className={styles.field}>
            <label>Funding Rate</label>
            <Controller
              control={control}
              name="fundingRate"
              rules={{ required: true }}
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
      </div>
    </Layout>
  )
}

export default MortgagePage
