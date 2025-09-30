import * as React from 'react';

import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number | readonly string[] | undefined;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, ...props }, ref) => {
    const isControlled = value !== undefined;
    const { defaultValue, ...restProps } = props;
    const inputValue = isControlled ? value : defaultValue;
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (type === 'number') {
        const numValue = e.target.value === '' ? '' : Number(e.target.value);
        onChange?.({
          ...e,
          target: {
            ...e.target,
            value: numValue,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      } else {
        onChange?.(e);
      }
    };
    return (
      <input
        type={type}
        className={cn(
          'flex h-8 w-full rounded-md border border-input bg-bg-card px-2 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        value={inputValue ?? ''}
        onChange={handleChange}
        {...restProps}
      />
    );
  },
);
Input.displayName = 'Input';

export interface ExpandedInputProps extends Omit<InputProps, 'prefix'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const ExpandedInput = ({
  suffix,
  prefix,
  className,
  ...props
}: ExpandedInputProps) => {
  const paddingClasses = [suffix && 'pr-8', prefix && 'pl-9']
    .filter(Boolean)
    .join(' ');
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          {prefix}
        </span>
      )}
      <Input className={cn(className, paddingClasses)} {...props} />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  );
};

const SearchInput = (props: InputProps) => {
  return (
    <ExpandedInput prefix={<Search className="h-4 w-4" />} {...props} />
  );
};

type Value = string | readonly string[] | number | undefined;

export const InnerBlurInput = React.forwardRef<
  HTMLInputElement,
  InputProps & { value: Value; onChange(value: Value): void }
>(({ value, onChange, ...props }, ref) => {
  const [val, setVal] = React.useState<Value>();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback((e) => {
      setVal(e.target.value);
    }, []);

  const handleBlur: React.FocusEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        onChange?.(e.target.value);
      },
      [onChange],
    );

  React.useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <Input
      {...props}
      value={val}
      onBlur={handleBlur}
      onChange={handleChange}
      ref={ref}
    ></Input>
  );
});

// Dev-only whyDidYouRender flag removed (typing not defined) to avoid TS error.

export const BlurInput = React.memo(InnerBlurInput);

export { ExpandedInput, Input, SearchInput };

type NumberInputProps = { onChange?(value: number): void } & InputProps;

export const NumberInput = React.forwardRef<
  HTMLInputElement,
  NumberInputProps & { value: Value; onChange(value: Value): void }
>(function NumberInput({ onChange, ...props }, ref) {
  return (
    <Input
      type="number"
      onChange={(ev) => {
        const value = ev.target.value;
        onChange?.(value === '' ? 0 : Number(value)); // convert to number
      }}
      {...props}
      ref={ref}
    ></Input>
  );
});
