import { forwardRef, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { cn } from '../../lib/cn';
import { ErrorMessage } from './ErrorMessage';
import { FaCalendarAlt } from 'react-icons/fa';

interface Props {
  value?: Date;
  onChange: (date: Date) => void;
  className?: string;
  error?: string;
  placeholder?: string;
  maxDate?: Date;
  minDate?: Date;
  minTime?: Date;
  maxTime?: Date;
}
export const DatePickerCustom = ({
  value,
  onChange,
  className,
  error,
  placeholder = '',
  maxDate,
  minDate,
  minTime,
  maxTime,
}: Props) => {
  const [date, setDate] = useState(value);

  useEffect(() => {
    setDate(value);
  }, [value]);

  const handleChange = (val: any) => {
    setDate(val);
    if (val) {
      onChange(val);
    }
  };
  const filterPassedTime = () => {
    const currentDate = new Date();
    const selectedDate = new Date('2024-08-01');

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <div className="w-full relative">
      <DatePicker
        selected={date}
        showTimeSelect
        maxDate={maxDate}
        minDate={minDate}
        minTime={minTime}
        maxTime={maxTime}
        filterTime={filterPassedTime}
        timeIntervals={15}
        dateFormat={'yyyy/MM/dd HH:mm'}
        onChange={handleChange}
        customInput={<CustomInput />}
        placeholderText={placeholder}
        name="startDate"
        className={cn(
          'focus:border-joc-primary w-full h-10 rounded-lg border border-gray-200 bg-transparent px-3 py-2 outline-none transition duration-150 focus:border-2',
          className,
          error ? 'border-red-600 focus:border-2 focus:border-red-600' : '',
        )}
      />
      <div className="absolute top-full">
        <ErrorMessage error={error} />
      </div>
    </div>
  );
};

const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, placeholder, className }, ref) => {
    return (
      <div className="relative">
        <input
          onClick={onClick}
          ref={ref}
          placeholder={placeholder}
          value={value}
          className={className}
        />
        <FaCalendarAlt
          size={20}
          className="absolute right-5 top-0 translate-y-1/2 text-[#9ca3af]"
        />
      </div>
    );
  },
);
CustomInput.displayName = 'DatePickerInput';
