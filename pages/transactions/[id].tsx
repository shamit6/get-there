import Form from './Form';
import { useRouter } from 'next/router'
import { TransactionConfig } from '../../utils/types';
import { useEffect, useState } from 'react';
import { getTransactionById } from '../../utils/db';

function New2() {
  const [transaction, setTransaction] = useState<TransactionConfig>();
  const router = useRouter();
  const id = Number(useRouter().query.id);
  
  useEffect(() => {
    const transaction = getTransactionById(id);
    setTransaction(transaction);
  }, []);

  return <Form transactionConfig={transaction}/>
}
export default New2
