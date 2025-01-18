import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, defaultValue, onChange, ...props }, ref) => {
    const [isAutofilling, setIsAutofilling] = React.useState(false);
    const [hasContent, setHasContent] = React.useState(Boolean(value || defaultValue));
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Merge refs
    React.useEffect(() => {
      if (typeof ref === 'function') {
        ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    // Handle autofill detection
    React.useEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.target instanceof HTMLInputElement) {
            const isAutofilled = 
              window.getComputedStyle(mutation.target, ':-webkit-autofill').getPropertyValue('background-color') !== '' ||
              input.matches(':-webkit-autofill');
            setIsAutofilling(isAutofilled);
          }
        });
      });

      observer.observe(input, {
        attributes: true,
        attributeFilter: ['style'],
      });

      return () => observer.disconnect();
    }, []);

    // Handle value changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasContent(e.target.value.length > 0);
      onChange?.(e);
    };

    // Update hasContent when value prop changes
    React.useEffect(() => {
      setHasContent(Boolean(value));
    }, [value]);

    // Set initial hasContent state
    React.useEffect(() => {
      setHasContent(Boolean(defaultValue));
    }, [defaultValue]);

    return (
      <input
        placeholder=" "
        className={cn(
          'peer w-full rounded-md bg-[#0a0c22] border border-[#97a1b8]',
          'h-9 px-3 py-1 text-base md:text-sm',
          'shadow-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#97a1b8] focus-visible:border-[#97a1b8]',
          'focus:outline-none focus:ring-1 focus:ring-[#97a1b8] focus:border-[#97a1b8]',
          '[&::-webkit-autofill]:border-[#97a1b8]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasContent && 'not-empty',
          isAutofilling && 'animate-autofill',
          className
        )}
        ref={inputRef}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onAnimationStart={(e) => {
          if (e.animationName === 'onAutofill') {
            setIsAutofilling(true);
          }
        }}
        onAnimationEnd={(e) => {
          if (e.animationName === 'onAutofillCancel') {
            setIsAutofilling(false);
          }
        }}
        {...props}
      />
    );
  }
);
FloatingInput.displayName = 'FloatingInput';

const FloatingLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      className={cn(
        'absolute start-2 top-2 z-10 origin-[0] transform',
        'text-sm font-thin text-[#b6c2de] duration-300 cursor-text bg-[#0a0c22]',
        'top-1/2 -translate-y-1/2 scale-100',
        'peer-[.not-empty]:top-2 peer-[.not-empty]:-translate-y-[18px] peer-[.not-empty]:scale-75 peer-[.not-empty]:px-1',
        'peer-focus:top-2 peer-focus:-translate-y-[18px] peer-focus:scale-75 peer-focus:px-1',
        'peer-[:-webkit-autofill]:top-2 peer-[:-webkit-autofill]:-translate-y-[18px] peer-[:-webkit-autofill]:scale-75 peer-[:-webkit-autofill]:px-1',
        'peer-[:-webkit-autofill:hover]:top-2 peer-[:-webkit-autofill:hover]:-translate-y-[18px] peer-[:-webkit-autofill:hover]:scale-75 peer-[:-webkit-autofill:hover]:px-1',
        'peer-[:-webkit-autofill:focus]:top-2 peer-[:-webkit-autofill:focus]:-translate-y-[18px] peer-[:-webkit-autofill:focus]:scale-75 peer-[:-webkit-autofill:focus]:px-1',
        'rtl:peer-focus:translate-x-1/4',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = 'FloatingLabel';

type FloatingLabelInputProps = InputProps & {
  label?: string;
  labelClassName?: string;
};

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, labelClassName, className, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} className={className} {...props} />
      <FloatingLabel htmlFor={id} className={labelClassName}>
        {label}
      </FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingInput, FloatingLabel, FloatingLabelInput };