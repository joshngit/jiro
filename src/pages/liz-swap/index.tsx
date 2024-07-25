import { useWeb3Modal } from '@web3modal/ethers/react';

import '../../setup-walletconnect';
import { useCallback, useEffect, useState } from 'react';
import { SwapForm } from '../../components/SwapForm';
import { GetPriceResult, useContract } from '../../hooks/use-contract';
import { useAccount } from '../../hooks/use-account';

import lizAbi from '../../abis/LIZ_abi.json';

function LizSwap() {
  const contractAddress = import.meta.env['VITE_LIZ_SWAP_CONTRACT'];
  const { address, isConnected, balance } = useAccount();
  const { swap, getPrice, estimate } = useContract(
    contractAddress || '',
    lizAbi,
  );
  const [price, setPrice] = useState<GetPriceResult | undefined>();
  console.log('Address', address);

  const { open } = useWeb3Modal();

  const onConnect = useCallback(() => {
    open();
  }, [open]);

  const onSwap = useCallback(
    (amount: string) => {
      swap(amount);
    },
    [swap],
  );

  useEffect(() => {
    if (isConnected) {
      getPrice().then(setPrice);
    }
  }, [isConnected, getPrice]);

  return (
    <>
      <div className="container">
        <SwapForm
          ethBalance={balance || '-'}
          usdPrice={price?.priceInUsd}
          ethPrice={price?.priceInEth}
          isConnected={isConnected}
          connect={onConnect}
          submit={onSwap}
          estimate={estimate}
        />
      </div>
    </>
  );
}

export default LizSwap;
