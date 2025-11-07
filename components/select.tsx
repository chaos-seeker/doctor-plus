import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    placeholder = 'انتخاب کنید',
    disabled,
    className,
    name,
    onChange,
    onValueChange,
    onBlur,
  },
  ref,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const selectedValue = value !== undefined ? value : internalValue;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue) ?? null,
    [options, selectedValue],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    onBlur?.();
  }, [onBlur]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled || disabled) return;

    if (value === undefined) {
      setInternalValue(option.value);
    }

    onChange?.(option.value);
    onValueChange?.(option.value);
    close();
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <input
        ref={ref}
        type="hidden"
        name={name}
        value={selectedValue ?? ''}
        readOnly
      />
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((state) => !state)}
        className={cn(
          'focus-visible:border-primary focus-visible:ring-primary/20 flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2',
          disabled && 'cursor-not-allowed opacity-60',
        )}
        disabled={disabled}
      >
        <span
          className={cn(
            'truncate text-right',
            !selectedOption && 'text-gray-400',
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen ? 'rotate-180' : 'rotate-0',
          )}
        />
      </button>
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-y-auto py-1 text-sm">
            {options.length === 0 && (
              <li className="px-3 py-2 text-gray-400">گزینه‌ای موجود نیست</li>
            )}
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={cn(
                      'hover:bg-primary/5 flex w-full items-center justify-between px-3 py-2 text-right transition',
                      isSelected && 'text-primary',
                      option.disabled &&
                        'cursor-not-allowed text-gray-300 hover:bg-transparent',
                    )}
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
});
