import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { BrowserProvider, formatUnits } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

export const useAccount = () => {
  const supportedChainId = Number(import.meta.env['VITE_CHAIN_ID']);
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [balance, setBalance] = useState<string | undefined>();

  const isValidNetwork = useMemo(
    () => chainId === supportedChainId,
    [supportedChainId, chainId],
  );

  useEffect(() => {
    (async () => {
      if (walletProvider && isValidNetwork && address) {
        const ethersProvider = new BrowserProvider(walletProvider);
        try {
          const balance = await ethersProvider.getBalance(address);
          setBalance(Number(formatUnits(balance, 18)).toFixed(4));
        } catch (err) {
          setBalance(undefined);
        }
      } else {
        setBalance(undefined);
      }
    })();
  }, [address, isValidNetwork, walletProvider]);

  return {
    address,
    isConnected,
    balance,
  };
};
