import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { ErrorMessage } from "./ErrorMessage";

type Props = {
  className?: string;
  error?: string;
  unit?: string;
};

type InputProps = Props &
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;

const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, unit, ...rest }, ref) => {
    return (
      <div className="w-full relative">
        <input
          className={cn(
            "h-10 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 outline-none transition duration-150 focus:border-2 focus:border-joc-primary disabled:bg-slate-100 disabled:text-slate-600",
            className,
            error ? "border-red-500 focus:border-red-500" : ""
          )}
          type="text"
          ref={ref}
          {...rest}
        />
        <div className="absolute top-full">
          <ErrorMessage error={error} />
        </div>
        {unit && (
          <div className="absolute -bottom-1 right-6 -translate-y-1/2">
            {unit}
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
