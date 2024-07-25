import { IoReloadSharp } from 'react-icons/io5';
import { cn } from '../../lib/cn';

interface Props {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const Button = ({
  children,
  className,
  disabled,
  isLoading,
  ...rest
}: Props &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) => {
  return (
    <button
      className={cn(
        'bg-joc-primary text-joc-primary py-4 px-20 rounded-md',
        disabled ? 'opacity-50' : '',
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {isLoading ? (
        <IoReloadSharp className="animate-spin" size={24} />
      ) : (
        children
      )}
    </button>
  );
};
