'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useImperativeHandle } from 'react';

interface UseAutosizeTextAreaProps {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  minHeight?: number;
  maxHeight?: number;
  triggerAutoSize: string;
}

export const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
}: UseAutosizeTextAreaProps) => {
  const maxHeightRef = React.useRef(maxHeight);
  const minHeightRef = React.useRef(minHeight);
  
  // Initialize the textarea
  React.useEffect(() => {
    const offsetBorder = 6;
    const textAreaElement = textAreaRef.current;
    
    if (textAreaElement) {
      textAreaElement.style.minHeight = `${minHeightRef.current + offsetBorder}px`;
      if (maxHeightRef.current > minHeightRef.current) {
        textAreaElement.style.maxHeight = `${maxHeightRef.current}px`;
      }
    }
  }, [textAreaRef]); // Add textAreaRef as dependency

  // Handle resizing
  React.useEffect(() => {
    const offsetBorder = 6;
    const textAreaElement = textAreaRef.current;
    const maxHeight = maxHeightRef.current;
    const minHeight = minHeightRef.current;
    
    if (!textAreaElement) return;

    const adjustHeight = () => {
      textAreaElement.style.height = `${minHeight + offsetBorder}px`;
      const scrollHeight = textAreaElement.scrollHeight;

      const newHeight = Math.min(scrollHeight + offsetBorder, maxHeight);
      textAreaElement.style.height = `${newHeight}px`;
    };

    adjustHeight();
    
    // Add resize observer to handle window/parent resize events
    const resizeObserver = new ResizeObserver(adjustHeight);
    resizeObserver.observe(textAreaElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [textAreaRef, triggerAutoSize]); // Add textAreaRef as dependency
};

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  maxHeight: number;
  minHeight: number;
  focus: () => void;
};

type AutosizeTextAreaProps = {
  maxHeight?: number;
  minHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutosizeTextarea = React.forwardRef<AutosizeTextAreaRef, AutosizeTextAreaProps>(
  (
    {
      maxHeight = Number.MAX_SAFE_INTEGER,
      minHeight = 52,
      className,
      onChange,
      value,
      ...props
    }: AutosizeTextAreaProps,
    ref: React.Ref<AutosizeTextAreaRef>,
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [triggerAutoSize, setTriggerAutoSize] = React.useState('');

    useAutosizeTextArea({
      textAreaRef,
      triggerAutoSize,
      maxHeight,
      minHeight,
    });

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef?.current?.focus(),
      maxHeight,
      minHeight,
    }));

    React.useEffect(() => {
      if (typeof value === 'string') {
        setTriggerAutoSize(value);
      }
    }, [value, props.defaultValue]);

    return (
      <textarea
        {...props}
        value={value}
        ref={textAreaRef}
        className={cn(
          'peer w-full rounded-md border border-neutral-700 bg-background px-3 py-2 text-sm',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-600 focus-visible:border-neutral-600',
          'focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600',
          'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        onChange={(e) => {
          setTriggerAutoSize(e.target.value);
          onChange?.(e);
        }}
      />
    );
  },
);

AutosizeTextarea.displayName = 'AutosizeTextarea';