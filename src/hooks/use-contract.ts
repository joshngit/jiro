import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import {
  BrowserProvider,
  Contract,
  formatUnits,
  InterfaceAbi,
  parseEther,
} from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { MakeRecurringOrderPayload, TransferForm } from '../schemas';
import toast from 'react-hot-toast';
import { DEFAULT_ERROR_MESSAGE } from '../constants/common';

export type GetPriceResult = {
  priceInUsd: string;
  priceInEth: string;
};

export type EstimateResult = {
  usdAmount: string;
  tokenAmount: string;
};

export const useContract = (contractAddress: string, abi: InterfaceAbi) => {
  const { walletProvider } = useWeb3ModalProvider();
  const [contract, setContract] = useState<Contract | undefined>();

  useEffect(() => {
    if (contractAddress && walletProvider) {
      const ethersProvider = new BrowserProvider(walletProvider);
      ethersProvider
        .getSigner()
        .then((signer) => {
          setContract(new Contract(contractAddress, abi, signer));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [contractAddress, walletProvider, abi]);

  const executor = useCallback(
    async <Res>(fnName: string, fn: Promise<Res>) => {
      try {
        const result = await fn;
        if ((result as any).hash) {
          const hash = (result as any).hash;
          console.log('hash', hash);
          if (walletProvider) {
            const provider = new BrowserProvider(walletProvider);
            const tx = await provider.getTransaction(hash);
            if (tx) {
              await tx.wait(1);
            }
          }
        }
        return result;
      } catch (err) {
        console.log(`${fnName} execute error`, err);
        toast.error(DEFAULT_ERROR_MESSAGE);
        return undefined;
      }
    },
    [walletProvider],
  );

  const getPrice = useCallback(async () => {
    if (!contract) {
      return;
    }
    const price = await executor<GetPriceResult>(
      'getPrice',
      contract.getPrice(),
    );
    const result = {
      priceInUsd: formatUnits(price?.priceInUsd || '', 8).replace(/0+$/g, ''),
      priceInEth: Number(formatUnits(price?.priceInEth || '', 18)).toFixed(6),
    };
    return result;
  }, [contract, executor]);

  const estimate = useCallback(
    async (ethAmount: string) => {
      if (!contract) {
        return;
      }
      const estimatedPrice = await executor<EstimateResult>(
        'estimate',
        contract.estimate(parseEther(ethAmount.toString())),
      );
      const result = Number(
        formatUnits(estimatedPrice?.tokenAmount || '', 18),
      ).toFixed(2);
      return result;
    },
    [contract, executor],
  );

  const swap = useCallback(
    async (ethAmount: string) => {
      if (!contract) {
        return;
      }
      const result = await executor<boolean>(
        'swap',
        contract.swap({
          value: parseEther(ethAmount.toString()),
          gasLimit: 200000,
        }),
      );
      console.log(result);
      return result;
    },
    [contract, executor],
  );

  const deposit = useCallback(
    async (amount: string) => {
      if (!contract) {
        return;
      }
      const result = await executor<boolean>(
        'deposit',
        contract.deposit(amount.toString(), { gasLimit: 200000 }),
      );
      return result;
    },
    [contract, executor],
  );

  const withdraw = useCallback(
    async (amount: string) => {
      if (!contract) {
        return;
      }
      const result = await executor<boolean>(
        'withdraw',
        contract.withdraw(amount.toString(), { gasLimit: 200000 }),
      );
      return result;
    },
    [contract, executor],
  );

  const transfer = useCallback(
    async (payload: TransferForm) => {
      if (!contract) {
        return;
      }
      const result = await executor<boolean>(
        'transfer',
        contract.transfer(payload.to, payload.amount.toString(), {
          gasLimit: 200000,
        }),
      );
      return result;
    },
    [contract, executor],
  );

  const balanceOf = useCallback(
    async (address: string) => {
      if (!contract) {
        return;
      }
      try {
        const result = await executor<bigint>(
          'balanceOf',
          contract.balanceOf(address, { gasLimit: 200000 }),
        );
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    [contract, executor],
  );

  const makeRecurringOrder = useCallback(
    async (payload: MakeRecurringOrderPayload) => {
      if (!contract) {
        return;
      }
      const result = await executor<boolean>(
        'makeReccuringOrder',
        contract.makeReccuringOrder(
          payload.to,
          Math.floor(payload.start.getTime() / 1000),
          Math.floor(payload.end.getTime() / 1000),
          payload.interval,
          payload.amount.toString(),
          { gasLimit: 400000 },
        ),
      );
      return result;
    },
    [contract, executor],
  );

  const getRoDebts = useCallback(
    async (address: string) => {
      if (!contract) {
        return;
      }
      const countResponse = await executor<bigint>(
        'getRoDebtLength',
        contract.getRoDebtLength(address),
      );

      const result: any[] = [];

      const count = Number(countResponse?.toString() || '0');

      for (let i = 0; i < count; i++) {
        const roIndexResponse = await executor<bigint>(
          'roDebts',
          contract.roDebts(address, i),
        );
        const roIndex = Number(roIndexResponse?.toString() || '-1');
        if (roIndex > -1) {
          const ro = await executor<any>(
            'getReccuringOrder',
            contract.getReccuringOrder(roIndex),
          );

          result.push({
            from: ro.from.toString(),
            to: ro.to.toString(),
            start: ro.start.toString(),
            end: ro.end.toString(),
            interval: ro.interval.toString(),
            amount: ro.amount.toString(),
          });
        }
      }
      return result;
    },
    [contract, executor],
  );

  return {
    getPrice,
    estimate,
    swap,
    deposit,
    makeRecurringOrder,
    balanceOf,
    getRoDebts,
    withdraw,
    transfer,
  };
};
