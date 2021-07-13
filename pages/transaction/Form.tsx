import React from "react";
import { useForm } from "react-hook-form";
import styles from './Form.module.css';

export default function Form() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <p>
        <label>Amount: </label>
        <input
          type="number"
          placeholder="10,000"
          {...register("amount", { required: true, maxLength: 80 })}
        />
      </p>
      <p>
        <label>Date: </label>
        <input
          type="date"
          {...register("amount", { required: true, maxLength: 80 })}
        />
      </p>
      <p>
        <label>Type: </label>
        <input
          type="text"
          placeholder="Salary"
          {...register("type", { required: true, maxLength: 100 })}
          />
      </p>
      <p>
          <input type="checkbox" id="repeated" {...register("type")}/>
          <label htmlFor="repeated">Repeated</label>
      </p>
      <p>
        <label>In: </label>
        <input
          type="number"
          defaultValue={1}
          style={{width: '4em', marginRight: '.7em'}}
          {...register("interval.amount")}
        />
        <select {...register("interval.timePeriod")}>
          <option value="week">weeks</option>
          <option value="month">month</option>
          <option value="year">year</option>
        </select>
      </p>
      <input type="submit" />
    </form>
  );
}

