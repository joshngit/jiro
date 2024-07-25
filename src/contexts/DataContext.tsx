import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useContract } from '../hooks/use-contract';
import jiroAbi from '../abis/JIRO_abi.json';
import { useAccount } from '../hooks/use-account';

type RoDebt = {
  from: string;
  to: string;
  start: string;
  end: string;
  interval: string;
  amount: string;
};

interface DataContext {
  fetchBalanceOf: () => void;
  fetchRoDebts: () => void;
  resetData: () => void;
  amount: bigint;
  roDebts: RoDebt[];
}

export const DataContext = createContext<DataContext>({
  fetchBalanceOf: () => {},
  fetchRoDebts: () => {},
  resetData: () => {},
  amount: 0n,
  roDebts: [],
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const contractAddress = import.meta.env['VITE_JIRO_CONTRACT'] || '';
  const { balanceOf, getRoDebts } = useContract(contractAddress, jiroAbi);
  const [amount, setAmount] = useState<bigint>(0n);
  const [roDebts, setRoDebts] = useState<RoDebt[]>([]);

  const fetchBalanceOf = useCallback(() => {
    if (!address) return;
    balanceOf(address).then((result) => {
      setAmount(result ?? 0n);
    });
  }, [balanceOf, address]);

  const fetchRoDebts = useCallback(() => {
    if (!address) return;
    getRoDebts(address).then((result) => {
      setRoDebts(result ?? []);
    });
  }, [getRoDebts, address]);

  const resetData = useCallback(() => {
    setAmount(0n);
    setRoDebts([]);
  }, [setAmount, setRoDebts]);

  const value = useMemo(
    () => ({
      fetchBalanceOf,
      fetchRoDebts,
      resetData,
      amount,
      roDebts,
    }),
    [fetchBalanceOf, fetchRoDebts, amount, roDebts, resetData],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
