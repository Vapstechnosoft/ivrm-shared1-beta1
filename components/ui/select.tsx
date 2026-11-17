'use client';

import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';

// Custom Context for search functionality
const SelectSearchContext = React.createContext<{
    searchable?: boolean;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    filteredItems: Set<string>;
    isMobile: boolean;
}>({
    searchable: true,
    searchQuery: '',
    setSearchQuery: () => {},
    filteredItems: new Set(),
    isMobile: false
});

// Fixed Select component - removing the forwardRef and properly extending the SelectPrimitive.Root
interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
    searchable?: boolean;
}

const Select = ({ children, searchable = true, onOpenChange, ...props }: SelectProps & { onOpenChange?: (open: boolean) => void }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filteredItems, setFilteredItems] = React.useState<Set<string>>(new Set());

    // Check if device is mobile
    const isMobile = React.useMemo(() => {
        if (typeof window !== 'undefined') {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }
        return false;
    }, []);

    // Clear search when the dropdown closes using onOpenChange from Radix
    const handleOpenChange = React.useCallback(
        (open: boolean) => {
            if (!open) {
                setSearchQuery('');
            }

            if (typeof onOpenChange === 'function') {
                try {
                    onOpenChange(open);
                } catch {
                    // swallow errors from consumer-provided handler
                }
            }
        },
        [onOpenChange]
    );

    // Reset search query when the selected value changes (clears typed search after selection)
    React.useEffect(() => {
        if (props.value !== undefined && props.value !== null) {
            setSearchQuery('');
        }
    }, [props.value]);

    // Create a function to collect all item values for filtering
    const collectItemValues = React.useCallback((children: React.ReactNode): string[] => {
        const values: string[] = [];

        React.Children.forEach(children, (child) => {
            if (!React.isValidElement(child)) return;

            if (child.type === SelectItem) {
                const value = child.props.value;
                const textContent = React.isValidElement(child.props.children) ? '' : String(child.props.children);

                if (value) values.push(`${value}:::${textContent}`);
            }

            if (child.props.children) {
                values.push(...collectItemValues(child.props.children));
            }
        });

        return values;
    }, []);

    // Filter items when search query changes ( PREVIOUS CODE)
    // React.useEffect(() => {
    //     if (!searchable || !searchQuery) {
    //         setFilteredItems(new Set());
    //         return;
    //     }

    //     const allItems = collectItemValues(children);
    //     const lowerQuery = searchQuery.toLowerCase();

    //     const filtered = new Set(
    //         allItems
    //             .filter((item) => {
    //                 const [value, text] = item.split(':::');
    //                 return text.toLowerCase().includes(lowerQuery) || value.toLowerCase().includes(lowerQuery);
    //             })
    //             .map((item) => item.split(':::')[0])
    //     );

    //     setFilteredItems(filtered);
    // }, [children, searchable, searchQuery, collectItemValues]);

    //Update filtered items for fixing search isses in  academic year and trailing Spaces error.
    React.useEffect(() => {
        if (!searchable || !searchQuery) {
            setFilteredItems(new Set());
            return;
        }

        const query = searchQuery.trimEnd().toLowerCase();
        const isNumericQuery = /^\d+$/.test(query);

        const allItems = collectItemValues(children);

        const startsWithMatches: string[] = [];
        const containsMatches: string[] = [];

        allItems.forEach((item) => {
            const [value, text] = item.split(':::');
            const lowerText = text.toLowerCase();
            const lowerValue = value.toLowerCase();

            // ✅ Detect academic year (YYYY-YYYY)
            const isAcademicYear = /^\d{4}-\d{4}$/.test(text);

            if (isAcademicYear && isNumericQuery) {
                const [startYear, endYear] = text.split('-');

                // ✅ STRICT: match ONLY from start of full year
                if (startYear.startsWith(query) || endYear.startsWith(query)) {
                    startsWithMatches.push(value);
                }

                return; // 🚫 do NOT fall into normal string logic
            }

            // ✅ Normal string logic
            if (lowerText.startsWith(query) || lowerValue.startsWith(query)) {
                startsWithMatches.push(value);
            } else if (lowerText.includes(query) || lowerValue.includes(query)) {
                containsMatches.push(value);
            }
        });

        // ✅ Starts-with items come first
        setFilteredItems(new Set([...startsWithMatches, ...containsMatches]));
    }, [children, searchable, searchQuery, collectItemValues]);

    // Normalize common "empty" values to undefined so Radix shows placeholder.
    // Treat empty string, null, and numeric/string zero as empty (many forms use 0 as 'no selection').
    const { value, ...restProps } = props as any;
    const normalizedValue = value === '' || value === null || value === 0 || value === '0' ? undefined : value;

    const contextValue = React.useMemo(
        () => ({
            searchable,
            searchQuery,
            setSearchQuery,
            filteredItems,
            isMobile
        }),
        [searchable, searchQuery, filteredItems, isMobile]
    );

    return (
        <SelectSearchContext.Provider value={contextValue}>
            <SelectPrimitive.Root value={normalizedValue} {...restProps} onOpenChange={handleOpenChange}>
                {children}
            </SelectPrimitive.Root>
        </SelectSearchContext.Provider>
    );
};
Select.displayName = 'Select';

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            className
        )}
        {...props}>
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDownIcon className='h-4 w-4 opacity-50' />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn('absolute top-0 right-0 left-0 z-10 flex cursor-default items-center justify-center py-1', className)}
        {...props}>
        <ChevronUpIcon className='h-4 w-4' />
    </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn('absolute right-0 bottom-0 left-0 z-10 flex cursor-default items-center justify-center py-1', className)}
        {...props}>
        <ChevronDownIcon className='h-4 w-4' />
    </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

// Search input component for Select
const SelectSearch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
    const { searchQuery, setSearchQuery, isMobile } = React.useContext(SelectSearchContext);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Focus maintenance logic to handle Radix UI focus interference using useLayoutEffect for sync execution
    React.useLayoutEffect(() => {
        if (!isMobile && inputRef.current) {
            // Checks focus on mount and updates
            const checkFocus = () => {
                if (inputRef.current && document.activeElement !== inputRef.current) {
                    inputRef.current.focus();
                }
            };

            // Immediate check
            checkFocus();

            // Retrying after a tick to beat Radix's focus management (e.g. when items change)
            const timeoutId = setTimeout(checkFocus, 20);

            return () => clearTimeout(timeoutId);
        }
    }); // Run on every render

    const [localValue, setLocalValue] = React.useState(searchQuery);

    React.useEffect(() => {
        setLocalValue(searchQuery);
    }, [searchQuery]);

    const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const newValue = e.target.value.replace(/^\s+/, '');
        setLocalValue(newValue);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            setSearchQuery(newValue);
        }, 300);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Prevent the select from closing when typing
        if (e.key !== 'Escape' && e.key !== 'Tab' && e.key !== 'Enter') {
            e.stopPropagation();
        }

        // Handle Enter key to prevent form submission
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        // Ensure input maintains focus
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.stopPropagation();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Prevent blur event from bubbling up
        e.stopPropagation();
    };

    return (
        <div className='sticky top-0 z-20 border-b bg-popover p-2'>
            <div className='flex items-center rounded-md border px-2 py-1'>
                <MagnifyingGlassIcon className='mr-2 h-4 w-4 text-muted-foreground' />
                <input
                    ref={inputRef}
                    className={cn('flex-1 bg-transparent text-sm outline-none', className)}
                    value={localValue}
                    onChange={handleInputChange}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='off'
                    spellCheck='false'
                    {...props}
                />
            </div>
        </div>
    );
});
SelectSearch.displayName = 'SelectSearch';

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => {
    const { searchable, searchQuery, filteredItems } = React.useContext(SelectSearchContext);

    // Check if we should show "No Data Found" - only when actively searching and no matches
    const showNoResults = !!searchQuery && filteredItems.size === 0;

    const [isPointerEventsEnabled, setIsPointerEventsEnabled] = React.useState(true);

    // Prevent focus stealing by mouse hover during filtering updates
    React.useEffect(() => {
        setIsPointerEventsEnabled(false);
        const timer = setTimeout(() => setIsPointerEventsEnabled(true), 100);
        return () => clearTimeout(timer);
    }, [filteredItems]); // Re-enable pointer events after list updates

    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={ref}
                className={cn(
                    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-56 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in',
                    position === 'popper' &&
                        'data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1',
                    !isPointerEventsEnabled && 'pointer-events-none', // Disable pointer events during updates
                    className
                )}
                position={position}
                onCloseAutoFocus={(e) => {
                    // Prevent auto-focus behavior that might interfere with search input
                    if (searchable) {
                        e.preventDefault();
                    }
                }}
                onPointerDownOutside={(e) => {
                    // Don't close when interacting with search input
                    if ((e.target as HTMLElement)?.closest('[role="combobox"]')) {
                        e.preventDefault();
                    }
                }}
                {...props}>
                <SelectScrollUpButton />
                {searchable && <SelectSearch placeholder='Search...' />}
                <SelectPrimitive.Viewport
                    className={cn(
                        'p-1',
                        position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
                    )}>
                    {showNoResults ? <div className='px-2 py-6 text-center text-muted-foreground text-sm'>No Data Found</div> : children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label ref={ref} className={cn('px-2 py-1.5 font-semibold text-sm', className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & { textValue?: string }
>(({ className, children, textValue, ...props }, ref) => {
    const { filteredItems, searchQuery } = React.useContext(SelectSearchContext);

    // If filtering is active and this item is not in filtered set, hide it
    // We use display: none instead of returning null to keep the component mounted
    // This helps maintain focus stability in Radix UI
    const isHidden = searchQuery && !filteredItems.has(props.value as string);

    return (
        <SelectPrimitive.Item
            ref={ref}
            className={cn(
                'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground data-[disabled]:opacity-50',
                isHidden && 'hidden',
                className
            )}
            {...props}
            // Ensure functionality is disabled when hidden
            disabled={isHidden || props.disabled}
            data-hidden={isHidden}>
            <span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center'>
                <SelectPrimitive.ItemIndicator>
                    <CheckIcon className='h-4 w-4' />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
    SelectSearch
};
