/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '../../components/ui/Button';
import { DatePickerCustom } from '../../components/ui/DatePicker';
import Input from '../../components/ui/Input';
import 'react-datepicker/dist/react-datepicker.css';
import ReactSelect from '../../components/ui/Select';
import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import jiroAbi from '../../abis/JIRO_abi.json';
import { MakeRecurringOrderPayload, RecurringOrderSchema } from '../../schemas';
import { useContract } from '../../hooks/use-contract';
import { useAccount } from '../../hooks/use-account';
import { convertToJST } from '../../utils/convert-time';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { INTERVAL_OPTIONS } from '../../utils/interval-options';
import { DEFAULT_ERROR_MESSAGE } from '../../constants/common';
import { useDataContext } from '../../contexts/DataContext';
import { addMinutes, isSameDay, setHours, setMinutes } from 'date-fns';
import { paths } from '../../routes/paths';

const INTERVAL_TIME = 15;

export function RecurringOrderPage() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const contractAddress = import.meta.env['VITE_JIRO_CONTRACT'] || '';
  const { makeRecurringOrder } = useContract(contractAddress, jiroAbi);
  const dateNow = new Date();
  const minutes = dateNow.getMinutes();
  const { fetchRoDebts } = useDataContext();
  const {
    handleSubmit,
    control,
    register,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MakeRecurringOrderPayload>({
    resolver: zodResolver(RecurringOrderSchema),
  });
  const startDate = watch('start');
  const endDate = watch('end');

  const onSubmit: SubmitHandler<MakeRecurringOrderPayload> = useCallback(
    async (data) => {
      try {
        data.start = convertToJST(data.start);
        data.end = convertToJST(data.end);
        const response: any = await makeRecurringOrder(data);
        if (response?.data) {
          fetchRoDebts();
          toast.success('成功');
          navigate(paths.joc.url);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message ?? DEFAULT_ERROR_MESSAGE);
      }
    },
    [makeRecurringOrder, navigate, fetchRoDebts],
  );

  const onChangeInterval = useCallback(
    (val: any) => {
      setValue('interval', val.value);
      trigger('interval');
    },
    [setValue, trigger],
  );

  const minStartTime = useMemo(() => {
    return setMinutes(dateNow, minutes + INTERVAL_TIME);
  }, [dateNow, minutes]);

  const maxStartTime = useMemo(() => {
    return setHours(setMinutes(dateNow, 59), 23);
  }, [dateNow]);

  const minEndTime = useMemo(() => {
    return startDate
      ? addMinutes(
          setMinutes(startDate, startDate?.getMinutes()),
          INTERVAL_TIME,
        )
      : undefined;
  }, [startDate]);

  const maxEndTime = useMemo(() => {
    return startDate ? setHours(setMinutes(startDate, 59), 23) : undefined;
  }, [startDate]);

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
          <div className="flex items-center my-6">
            <label htmlFor="start-date" className="min-w-20">
              開始
            </label>
            <Controller
              control={control}
              name="start"
              render={({ field: { onChange, value } }) => {
                const isSameCurrentDate = value
                  ? isSameDay(value, dateNow)
                  : true;

                return (
                  <DatePickerCustom
                    onChange={onChange}
                    error={errors.start?.message}
                    placeholder="開始日"
                    value={value}
                    // minDate={dateNow}
                    maxDate={endDate}
                    minTime={isSameCurrentDate ? minStartTime : undefined}
                    maxTime={isSameCurrentDate ? maxStartTime : undefined}
                  />
                );
              }}
            />
          </div>
          <div className="flex items-center my-6">
            <label htmlFor="end-date" className="min-w-20">
              終了
            </label>
            <Controller
              control={control}
              name="end"
              render={({ field: { onChange, value } }) => (
                <DatePickerCustom
                  onChange={onChange}
                  error={errors.end?.message}
                  placeholder="終了日"
                  value={value}
                  minDate={minEndTime || dateNow}
                  minTime={minEndTime}
                  maxTime={maxEndTime}
                />
              )}
            />
          </div>
          <div className="flex items-center my-6">
            <label htmlFor="end-date" className="min-w-20">
              間隔
            </label>
            <ReactSelect
              options={INTERVAL_OPTIONS}
              className="w-full"
              onChange={onChangeInterval}
              error={errors.interval?.message}
              placeholder="間隔"
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
            <Button
              disabled={!isConnected || isSubmitting}
              isLoading={isSubmitting}
            >
              作成
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
