import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TransferForm, TransferSchema } from '../../schemas';
import { DEFAULT_ERROR_MESSAGE } from '../../constants/common';
import toast from 'react-hot-toast';
import { useContract } from '../../hooks/use-contract';
import jiroAbi from '../../abis/JIRO_abi.json';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';

export function Transfer() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<TransferForm>({
    resolver: zodResolver(TransferSchema),
  });

  const navigate = useNavigate();
  const contractAddress = import.meta.env['VITE_JIRO_CONTRACT'] || '';
  const { transfer } = useContract(contractAddress, jiroAbi);

  const onSubmit: SubmitHandler<TransferForm> = useCallback(
    async (data: TransferForm) => {
      try {
        const response = await transfer(data);
        if (response) {
          toast.success('成功');
          navigate(paths.joc.url);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message ?? DEFAULT_ERROR_MESSAGE);
      }
    },
    [transfer, navigate],
  );
  return (
    <section className="bg-white py-6">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-6">
            <label htmlFor="to" className="min-w-20">
              振替先
            </label>
            <Input
              id="to"
              placeholder="宛先"
              {...register('to')}
              error={errors.to?.message}
            />
          </div>
          <div className="flex items-center mb-12">
            <label htmlFor="amount" className="min-w-20">
              ⾦額
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
              振込
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
