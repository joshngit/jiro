import { modal } from '../setup-walletconnect';
import Header from '../components/Header';
import { useAccount } from '../hooks/use-account';
import { convertAddress } from '../utils/convert-address';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDataContext } from '../contexts/DataContext';

type Steps = 'connect' | 'disconnecting' | 'disconnect';

export function DefaultLayout() {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState<Steps>('disconnect');
  const { resetData } = useDataContext();

  useEffect(() => {
    if (isConnected && address) {
      setStep('connect');
    } else {
      setStep('disconnect');
    }
  }, [isConnected, address]);

  const title = useMemo(() => {
    if (step === 'disconnect') {
      return 'Connect';
    }
    if (step === 'disconnecting') {
      return 'Disconnect';
    }
    if (step === 'connect' && isConnected && address) {
      return convertAddress(address);
    }
    return 'Connect';
  }, [isConnected, address, step]);

  const onConnect = useCallback(() => {
    if (!address || !isConnected) {
      modal.open();
    }
    if (address && isConnected && step === 'connect') {
      setStep('disconnecting');
    }
    if (address && isConnected && step === 'disconnecting') {
      modal.disconnect();
      resetData();
    }
  }, [address, isConnected, step, resetData]);

  return (
    <div className="bg-joc min-h-screen">
      <Header title={title} onClick={onConnect} />
      <Outlet />
      <Toaster />
    </div>
  );
}
