import { useEffect } from 'react';
import { useAccount } from '../../hooks/use-account';
import { format } from 'date-fns-tz';

import { Actions } from './components/Actions';
import { Balance } from './components/Balance';
import { RecurringOrder } from './components/RecurringOrder';
import { INTERVAL_OPTIONS } from '../../utils/interval-options';
import { convertFromJST } from '../../utils/convert-time';
import { useDataContext } from '../../contexts/DataContext';

const parsedDate = (timestamp: number) => {
  return format(
    convertFromJST(new Date(timestamp * 1000)),
    'yyyy年MM月dd日 HH:mm',
  );
};

const getIntervalLabel = (interval: string) => {
  return (
    INTERVAL_OPTIONS.find((option) => option.value === Number(interval))
      ?.label ?? ''
  );
};

export function JocPage() {
  const { address } = useAccount();
  const { amount, roDebts, fetchBalanceOf, fetchRoDebts } = useDataContext();

  useEffect(() => {
    if (address) {
      fetchBalanceOf();
      fetchRoDebts();
    }
  }, [address, fetchBalanceOf, fetchRoDebts]);

  return (
    <div>
      <div className="container mb-2">
        <Balance title="残高" amount={amount} />
        <Actions />
        <p className="mt-8 text-gray-400">口座振替</p>
      </div>
      <div className="bg-white">
        {roDebts.length > 0 &&
          roDebts.map((roDebt, index) => (
            <RecurringOrder
              key={index}
              address={roDebt.to}
              amount={Number(roDebt.amount)}
              startDate={parsedDate(Number(roDebt.start))}
              endDate={parsedDate(Number(roDebt.end))}
              interval={getIntervalLabel(roDebt.interval)}
            />
          ))}
      </div>
    </div>
  );
}
