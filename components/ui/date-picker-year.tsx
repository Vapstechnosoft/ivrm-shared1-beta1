'use client';

import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker, type DropdownProps } from 'react-day-picker';
import { format } from 'date-fns';

export type DatePickerYearProps = React.ComponentProps<typeof DayPicker> & {
    onSelect?: (date: Date | undefined) => void;
};

/**
 * Date Picker Component with Direct Year Selection
 * This component displays a calendar with a clickable year selector in the header
 * allowing users to directly select the year without navigating month by month.
 */
function DatePickerWithYear({ className, classNames, showOutsideDays = true, selected, ...props }: DatePickerYearProps) {
    // State to track the current displayed month
    const [currentMonth, setCurrentMonth] = React.useState<Date>(props.month || new Date());

    // Update the internal month state when the prop changes
    React.useEffect(() => {
        if (props.month) {
            setCurrentMonth(props.month);
        }
    }, [props.month]);

    // Update the currentMonth state when the selected date changes
    React.useEffect(() => {
        if (selected) {
            if (selected instanceof Date) {
                setCurrentMonth(selected);
            } else if (Array.isArray(selected) && selected.length > 0 && selected[0] instanceof Date) {
                setCurrentMonth(selected[0]);
            } else if (typeof selected === 'object' && 'from' in selected && selected.from instanceof Date) {
                setCurrentMonth(selected.from);
            }
        }
    }, [selected]);

    // Range of years to show in the year dropdown (1950 to 50 years in the future)
    const years = React.useMemo(() => {
        const currentYear = new Date().getFullYear();
        const endYear = props.toDate ? props.toDate.getFullYear() : currentYear + 50;
        const startYear = Math.max(1950, currentYear - 100); // Go back 100 years from current

        return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    }, [props.toDate]);

    // Handle year change
    const handleYearChange = (year: string) => {
        const newYear = Number.parseInt(year);
        const newDate = new Date(currentMonth);
        newDate.setFullYear(newYear);

        setCurrentMonth(newDate);

        // Call the onMonthChange prop if provided
        props.onMonthChange?.(newDate);
    };

    // Custom month change handler to update our internal state
    const handleMonthChange = (month: Date) => {
        setCurrentMonth(month);

        // Call the original onMonthChange if provided
        props.onMonthChange?.(month);
    };

    return (
        <div className='relative'>
            {/* Calendar Container */}
            <div className={cn('overflow-hidden rounded-md border bg-popover shadow-md', 'flex w-auto flex-col', className)}>
                {/* Main Calendar */}
                <DayPicker
                    showOutsideDays={showOutsideDays}
                    captionLayout='buttons'
                    className={cn('p-1 py-2', className)}
                    classNames={{
                        months: 'flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0',
                        month: 'space-y-2',
                        vhidden: 'vhidden hidden',
                        caption: 'flex justify-center pt-2 pb-1 relative items-center gap-2',
                        caption_label: 'text-sm font-medium',
                        caption_dropdowns: cn('flex justify-between gap-1'),
                        nav: 'space-x-1 flex items-center',
                        nav_button: cn(buttonVariants({ variant: 'outline' }), 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'),
                        nav_button_previous: 'absolute left-1',
                        nav_button_next: 'absolute right-1',
                        table: 'w-full border-collapse space-y-1',
                        head_row: 'flex',
                        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                        row: 'flex w-full mt-2',
                        cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                        day: cn(buttonVariants({ variant: 'ghost' }), 'h-9 w-9 p-0 font-normal aria-selected:opacity-100'),
                        day_selected:
                            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                        day_today: 'bg-accent text-accent-foreground',
                        day_outside: 'text-muted-foreground opacity-50',
                        day_disabled: 'text-muted-foreground opacity-50',
                        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                        day_hidden: 'invisible',
                        ...classNames
                    }}
                    components={{
                        Dropdown: ({ value, onChange, children, ...dropdownProps }: DropdownProps) => {
                            // Only show month dropdown from the original component
                            const options = React.Children.toArray(children) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];
                            const selected = options.find((child) => child.props.value === value);
                            const handleChange = (value: string) => {
                                const changeEvent = {
                                    target: { value }
                                } as React.ChangeEvent<HTMLSelectElement>;
                                onChange?.(changeEvent);
                            };

                            // Skip rendering year dropdown in the original component - we handle it separately
                            if (dropdownProps.name === 'year') {
                                return null;
                            }

                            // Render month dropdown
                            return (
                                <Select
                                    value={value?.toString()}
                                    onValueChange={(value) => {
                                        handleChange(value);
                                    }}
                                    searchable={false}>
                                    <SelectTrigger className='h-7 px-2 text-sm font-medium focus:ring-0'>
                                        <SelectValue>{selected?.props?.children}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent position='popper' sideOffset={4} className='max-h-40'>
                                        <ScrollArea className='h-40'>
                                            {options.map((option, id: number) => (
                                                <SelectItem
                                                    key={`${option.props.value}-${id}`}
                                                    value={option.props.value?.toString() ?? ''}
                                                    className='py-1 text-sm'>
                                                    {option.props.children}
                                                </SelectItem>
                                            ))}
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                            );
                        },
                        CaptionLabel: ({ displayMonth }: { displayMonth: Date }) => {
                            // Custom caption that displays month name and clickable year selector
                            return (
                                <div className='flex items-center justify-center gap-2'>
                                    <span className='text-sm font-medium'>{format(displayMonth, 'MMMM')}</span>
                                    {/* Year Selector - prominent, clickable, and styled like part of the header */}
                                    <Select 
                                        value={currentMonth.getFullYear().toString()} 
                                        onValueChange={handleYearChange} 
                                        searchable={false}
                                    >
                                        <SelectTrigger className='h-auto w-auto px-2 py-1 text-sm font-medium cursor-pointer border-0 bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary/20'>
                                            <SelectValue className='font-medium'>{currentMonth.getFullYear()}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent position='popper' sideOffset={4} className='max-h-60 w-28'>
                                            <ScrollArea className='h-60'>
                                                {[...years].reverse().map((year) => (
                                                    <SelectItem 
                                                        key={year} 
                                                        value={year.toString()} 
                                                        className='py-2 text-sm cursor-pointer'
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </ScrollArea>
                                        </SelectContent>
                                    </Select>
                                </div>
                            );
                        },
                        IconLeft: ({ ...props }) => <ChevronLeft className='h-4 w-4' />,
                        IconRight: ({ ...props }) => <ChevronRight className='h-4 w-4' />
                    }}
                    month={currentMonth}
                    onMonthChange={handleMonthChange}
                    {...props}
                    onDayClick={(day, modifiers, e) => {
                        // Call the original onDayClick if provided
                        if (props.onDayClick) {
                            props.onDayClick(day, modifiers, e);
                        } else if (props.onSelect) {
                            // If onDayClick is not provided but onSelect is, use onSelect for compatibility
                            props.onSelect(day);
                        }
                    }}
                />
            </div>
        </div>
    );
}

DatePickerWithYear.displayName = 'DatePickerWithYear';

export { DatePickerWithYear };

