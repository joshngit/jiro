import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { WithdrawForm, WithdrawSchema } from '../../schemas';
import { useContract } from '../../hooks/use-contract';
import jiroAbi from '../../abis/JIRO_abi.json';
import toast from 'react-hot-toast';
import { DEFAULT_ERROR_MESSAGE } from '../../constants/common';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';

export function Withdraw() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<WithdrawForm>({
    resolver: zodResolver(WithdrawSchema),
  });

  const navigate = useNavigate();
  const contractAddress = import.meta.env['VITE_JIRO_CONTRACT'] || '';
  const { withdraw } = useContract(contractAddress, jiroAbi);

  const onSubmit: SubmitHandler<WithdrawForm> = useCallback(
    async (data: WithdrawForm) => {
      try {
        const response: any = await withdraw(data.amount);
        if (response?.data) {
          toast.success('成功');
          navigate(paths.joc.url);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message ?? DEFAULT_ERROR_MESSAGE);
      }
      console.log(data);
    },
    [withdraw, navigate],
  );
  return (
    <section className="bg-white py-6">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-12">
            <label htmlFor="amount" className="min-w-20">
              出⾦額
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
            <Button isLoading={isSubmitting} disabled={isSubmitting}>
              出⾦
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
