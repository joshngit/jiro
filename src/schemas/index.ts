import { z } from 'zod';

export const DepositSchema = z.object({
  amount: z.string().min(1, { message: '金額は必須です' }),
});

export const WithdrawSchema = z.object({
  amount: z.string().min(1, { message: '金額は必須です' }),
});

export const TransferSchema = z.object({
  to: z.string().min(1, { message: '住所は必須です' }),
  amount: z.string().min(1, { message: '金額は必須です' }),
});

export const RecurringOrderSchema = z
  .object({
    to: z.string().min(1, { message: '住所は必須です' }),
    start: z
      .date({
        required_error: '開始日は必須です',
      })
      .refine((val) => val > new Date(), {
        message: '開始日は現在の日付より後にする必要があります',
      }),
    end: z.date({
      required_error: '終了日は必須です',
    }),
    interval: z.number({
      required_error: '間隔が必要です',
    }),
    amount: z.string().min(1, { message: '金額は必須です' }),
  })
  .refine((val) => val.start < val.end, {
    message: '終了日は開始日より後にする必要があります',
    path: ['end'],
  });

export type Deposit = z.infer<typeof DepositSchema>;

export type WithdrawForm = z.infer<typeof WithdrawSchema>;

export type TransferForm = z.infer<typeof TransferSchema>;

export type MakeRecurringOrderPayload = z.infer<typeof RecurringOrderSchema>;
