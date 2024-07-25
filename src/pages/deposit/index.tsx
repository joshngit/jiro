import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Deposit as DepositForm, DepositSchema } from '../../schemas';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import jiroAbi from '../../abis/JIRO_abi.json';
import { useContract } from '../../hooks/use-contract';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_ERROR_MESSAGE } from '../../constants/common';
import { useDataContext } from '../../contexts/DataContext';
import { paths } from '../../routes/paths';

export function Deposit() {
  const contractAddress = import.meta.env['VITE_JIRO_CONTRACT'] || '';
  const { deposit } = useContract(contractAddress, jiroAbi);
  const navigate = useNavigate();
  const { fetchBalanceOf } = useDataContext();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<DepositForm>({
    resolver: zodResolver(DepositSchema),
  });

  const onSubmit: SubmitHandler<DepositForm> = useCallback(
    async (data: DepositForm) => {
      try {
        const response: any = await deposit(data.amount);
        if (response?.data) {
          fetchBalanceOf();
          toast.success('入金が完了しました');
          navigate(paths.joc.url);
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error?.message ?? DEFAULT_ERROR_MESSAGE);
      }
    },
    [deposit, navigate, fetchBalanceOf],
  );

  return (
    <section className="bg-white py-6">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-12">
            <label htmlFor="amount" className="min-w-20">
              ⼊⾦額
            </label>
            <Input
              id="amount"
              unit="円"
              placeholder="金額"
              {...register('amount')}
              error={errors.amount?.message}
            />
          </div>
          <div className="text-center">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              ⼊⾦
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
