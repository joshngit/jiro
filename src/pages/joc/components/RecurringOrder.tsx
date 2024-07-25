import { cn } from '../../../lib/cn';

interface Props {
  address: string;
  amount: number;
  startDate: string;
  endDate: string;
  interval: string;
  className?: string;
}

export function RecurringOrder({
  address,
  amount,
  startDate,
  endDate,
  interval,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'p-4 flex flex-col gap-2 border-0 border-t-2 border-b-2',
        className,
      )}
    >
      <div className="">
        <span className="text-sm">{address}</span>
      </div>
      <div className="flex justify-end">
        <div className="text-2xl">
          {amount} <span className="text-sm">円</span>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <span className="line-clamp-1">
          {startDate}〜{endDate}
        </span>
        <span>{interval}</span>
      </div>
    </div>
  );
}
