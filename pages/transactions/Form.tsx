import React, {FunctionComponent} from "react";
import { useForm } from "react-hook-form";
import styles from './Form.module.css';
import type {TransactionConfig} from '../../utils/types';
import {createOrUpdateTransaction} from '../../utils/db';
import { useRouter } from 'next/router';

export default function Form({transactionConfig} : {transactionConfig?: TransactionConfig}) {
  const { register, handleSubmit, watch} = useForm();
  const router = useRouter()
  const onSubmit = (data: TransactionConfig & {repeated: boolean}) => {
    const {repeated, interval, ...rest} = data;
    createOrUpdateTransaction(repeated? {interval, ...rest} : rest);
    router.push('/transactions');
  };
  
  const isRepeated = watch("repeated", !!transactionConfig?.interval);
  console.log('isRepeated', isRepeated);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <p>
        <label>Amount: </label>
        <input
          type="number"
          placeholder="10,000"
          defaultValue={transactionConfig?.amount}
          {...register("amount", { required: true})}
        />
      </p>
      <p>
        <label>Date: </label>
        <input
          type="date"
          defaultValue={transactionConfig?.date.getTime()}
          {...register("date", { required: true})}
        />
      </p>
      <p>
        <label>Type: </label>
        <input
          type="text"
          placeholder="Salary"
          defaultValue={transactionConfig?.type}
          {...register("type", { required: true})}
          />
      </p>
      <p>
          <input type="checkbox" id="repeated" {...register("repeated", { required: isRepeated})}/>
          <label htmlFor="repeated">Repeated</label>
      </p>
      <p>
        <label>In: </label>
        <input
          type="number"
          defaultValue={transactionConfig?.interval?.amount || 1}
          disabled={!isRepeated}
          style={{width: '4 em', marginRight: '.7em'}}
          {...register("interval.amount", { required: isRepeated})}
        />
        <select 
          {...register("interval.timePeriod")} 
          defaultValue={transactionConfig?.interval?.timePeriod}
          disabled={!isRepeated}
        >
          <option value="week">weeks</option>
          <option value="month">months</option>
          <option value="year">years</option>
        </select>
      </p>
      <p>
        <label>End Date: </label>
        <input
          type="date"
          defaultValue={transactionConfig?.interval?.endDate?.getTime()}
          disabled={!isRepeated}
          {...register("interval.endDate", { required: isRepeated})}
        />
      </p>
      <input type="submit"/>
    </form>
  );
}

