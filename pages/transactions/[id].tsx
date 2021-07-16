import Form from './Form';
import { useRouter } from 'next/router'
import { TransactionConfig } from '../../utils/types';
import { useEffect, useState } from 'react';
import { getTransactionById } from '../../utils/db';

function New2() {
  const [transaction, setTransaction] = useState<TransactionConfig>();
  const [loaded, isLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) {
      const transaction = getTransactionById(id);
      setTransaction(transaction);
      isLoaded(true);
    }
  }, [router]);

  return loaded && <Form transactionConfig={transaction}/>
}
export default New2
