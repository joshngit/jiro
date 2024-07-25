import React from 'react';
import Select, { Props as ReactSelectProps, components } from 'react-select';
import { cn } from '../../lib/cn';
import { ErrorMessage } from './ErrorMessage';

export type Option = {
  label: string;
  value: number;
};

type Props = {
  options: Option[];
  classNames?: string;
  error?: string | undefined;
  customOptionComponent?: React.ComponentType<any>;
};

const ReactSelect = ({
  options,
  classNames,
  error,
  placeholder,
  customOptionComponent,
  ...rest
}: ReactSelectProps<Option> & Props) => {
  return (
    <div className="w-full relative">
      <Select
        options={options}
        required={false}
        placeholder={placeholder}
        classNames={{
          control: ({ isFocused }) =>
            cn(
              'w-full !rounded-lg border bg-transparent !outline-none !shadow-none p-[1px]',
              isFocused ? '!border-joc-primary !border-2' : '!border-gray-200',
              error ? '!border-red-600' : '',
              classNames,
            ),
          menu: () => cn('z-10'),
          placeholder: () => cn('!text-[#9ca3af]'),
        }}
        components={{
          Option: customOptionComponent ?? components.Option,
        }}
        {...rest}
      />
      <div className="absolute top-full">
        <ErrorMessage error={error} />
      </div>
    </div>
  );
};

export default ReactSelect;
