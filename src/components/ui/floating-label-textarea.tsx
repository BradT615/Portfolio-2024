import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useAutosizeTextArea } from '@/components/ui/autosize-textarea';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
  maxHeight?: number;
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, defaultValue, onChange, minHeight = 52, maxHeight = 400, ...props }, ref) => {
    const [hasContent, setHasContent] = React.useState(Boolean(value || defaultValue));
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [triggerAutoSize, setTriggerAutoSize] = React.useState('');

    React.useEffect(() => {
      if (typeof ref === 'function') {
        ref(textareaRef.current);
      } else if (ref) {
        ref.current = textareaRef.current;
      }
    }, [ref]);

    useAutosizeTextArea({
      textAreaRef: textareaRef,
      triggerAutoSize,
      maxHeight,
      minHeight,
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasContent(e.target.value.length > 0);
      setTriggerAutoSize(e.target.value);
      onChange?.(e);
    };

    React.useEffect(() => {
      setHasContent(Boolean(value));
      setTriggerAutoSize(value as string);
    }, [value]);

    React.useEffect(() => {
      setHasContent(Boolean(defaultValue));
      setTriggerAutoSize(defaultValue as string);
    }, [defaultValue]);

    return (
      <textarea
        {...props}
        value={value}
        defaultValue={defaultValue}
        placeholder=" "
        className={cn(
          'peer w-full bg-neutral-900 border border-neutral-700',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-600 focus-visible:border-neutral-600',
          'focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600',
          '[&::-webkit-autofill]:border-neutral-600',
          'px-3 py-2',
          hasContent && 'not-empty',
          className
        )}
        ref={textareaRef}
        onChange={handleChange}
      />
    );
  }
);
FloatingTextarea.displayName = 'FloatingTextarea';

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        'absolute start-2 z-10 origin-[0] transform',
        'text-sm font-thin text-neutral-300 duration-300 cursor-text bg-neutral-900',
        'top-3 scale-100',
        'peer-[.not-empty]:top-0 peer-[.not-empty]:-translate-y-1/2 peer-[.not-empty]:scale-75 peer-[.not-empty]:px-1',
        'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:px-1',
        'peer-[:-webkit-autofill]:top-0 peer-[:-webkit-autofill]:-translate-y-1/2 peer-[:-webkit-autofill]:scale-75 peer-[:-webkit-autofill]:px-1',
        'peer-[:-webkit-autofill:hover]:top-0 peer-[:-webkit-autofill:hover]:-translate-y-1/2 peer-[:-webkit-autofill:hover]:scale-75 peer-[:-webkit-autofill:hover]:px-1',
        'peer-[:-webkit-autofill:focus]:top-0 peer-[:-webkit-autofill:focus]:-translate-y-1/2 peer-[:-webkit-autofill:focus]:scale-75 peer-[:-webkit-autofill:focus]:px-1',
        'rtl:peer-focus:translate-x-1/4',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = 'FloatingLabel';

type FloatingLabelTextareaProps = TextareaProps & {
  label?: string;
  labelClassName?: string;
};

const FloatingLabelTextarea = React.forwardRef<
  React.ElementRef<typeof FloatingTextarea>,
  React.PropsWithoutRef<FloatingLabelTextareaProps>
>(({ id, label, labelClassName, className, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingTextarea ref={ref} id={id} className={className} {...props} />
      <FloatingLabel htmlFor={id} className={labelClassName}>
        {label}
      </FloatingLabel>
    </div>
  );
});
FloatingLabelTextarea.displayName = 'FloatingLabelTextarea';

export { FloatingTextarea, FloatingLabel, FloatingLabelTextarea };