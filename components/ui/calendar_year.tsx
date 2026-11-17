'use client';

import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker, type DropdownProps } from 'react-day-picker';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarYear({ className, classNames, showOutsideDays = true, selected, ...props }: CalendarProps) {
    // Helper to derive an initial month from `selected` (Date | Date[] | Range)
    const getInitialMonthFromSelected = (): Date => {
        const sel = selected as any;
        if (!sel) return props.month || new Date();

        if (sel instanceof Date) return sel;

        if (Array.isArray(sel) && sel.length > 0 && sel[0] instanceof Date) return sel[0];

        if (typeof sel === 'object' && 'from' in sel && sel.from instanceof Date) return sel.from;

        return props.month || new Date();
    };

    // Reference to track the current displayed month
    const [currentMonth, setCurrentMonth] = React.useState<Date>(getInitialMonthFromSelected());

    // State to track calendar open status
    const [_calendarOpen, setCalendarOpen] = React.useState<boolean>(false);

    // Update the internal month state when the `month` prop or `selected` prop changes
    React.useEffect(() => {
        if (props.month) {
            setCurrentMonth(props.month);
            return;
        }

        const next = getInitialMonthFromSelected();
        if (next) setCurrentMonth(next);
    }, [props.month, selected]);

    // Range of years to show in the year dropdown
    const years = React.useMemo(() => {
        const currentYear = new Date().getFullYear();
        const endYear = props.toDate ? props.toDate.getFullYear() : currentYear;
        const startYear = endYear - 50; // adjust range as desired

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
            {/* Calendar Container with fixed positioning */}
            <div className={cn('overflow-hidden rounded-md border bg-popover shadow-md', 'flex w-auto flex-col', className)}>
                {/* Year Selector - inside the calendar container */}
                <div className='flex justify-end px-2 pt-1 pb-0'>
                    <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange} searchable={false}>
                        <SelectTrigger className='h-6 w-20 px-2 text-xs focus:ring-0'>
                            <SelectValue>{currentMonth.getFullYear()}</SelectValue>
                        </SelectTrigger>
                        <SelectContent position='popper' sideOffset={4} className='max-h-40'>
                            <ScrollArea className='h-40'>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()} className='py-1 text-xs'>
                                        {year}
                                    </SelectItem>
                                ))}
                            </ScrollArea>
                        </SelectContent>
                    </Select>
                </div>

                {/* Main Calendar */}
                <DayPicker
                    showOutsideDays={showOutsideDays}
                    className={cn('p-1 py-2', className)}
                    classNames={{
                        months: 'flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0',
                        month: 'space-y-2',
                        vhidden: 'vhidden hidden',
                        caption: 'flex justify-center pt-0 relative items-center',
                        caption_label: 'text-xs font-medium',
                        caption_dropdowns: cn('flex justify-between gap-1', props.captionLayout === 'dropdown' && 'w-full'),
                        nav: 'space-x-1 flex items-center',
                        nav_button: cn(buttonVariants({ variant: 'outline' }), 'h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100'),
                        nav_button_previous: 'absolute left-1',
                        nav_button_next: 'absolute right-1',
                        table: 'w-full border-collapse space-y-1',
                        head_row: 'flex',
                        head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]',
                        row: 'flex w-full mt-1',
                        cell: 'text-center text-xs p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                        day: cn(buttonVariants({ variant: 'ghost' }), 'h-7 w-8 p-0 font-normal aria-selected:opacity-100'),
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

                            // Skip rendering year dropdown in the original component
                            if (dropdownProps.name === 'year') {
                                return null;
                            }

                            return (
                                <Select
                                    value={value?.toString()}
                                    onValueChange={(value) => {
                                        handleChange(value);
                                    }}
                                    searchable={false}>
                                    <SelectTrigger className='h-6 pr-1.5 text-xs focus:ring-0'>
                                        <SelectValue>{selected?.props?.children}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent position='popper' sideOffset={4} className='max-h-40'>
                                        <ScrollArea className='h-40'>
                                            {options.map((option, id: number) => (
                                                <SelectItem
                                                    key={`${option.props.value}-${id}`}
                                                    value={option.props.value?.toString() ?? ''}
                                                    className='py-1 text-xs'>
                                                    {option.props.children}
                                                </SelectItem>
                                            ))}
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                            );
                        },
                        IconLeft: () => <ChevronLeft className='h-3 w-3' />,
                        IconRight: () => <ChevronRight className='h-3 w-3' />
                    }}
                    month={currentMonth}
                    selected={selected as any}
                    onMonthChange={handleMonthChange}
                    {...props}
                    onDayClick={(day, modifiers, e) => {
                        props.onDayClick?.(day, modifiers, e);
                        if (modifiers.selected && !props.mode?.includes('range')) {
                            // Close the calendar when a date is selected (for single mode)
                            setCalendarOpen(false);
                        }
                    }}
                />
            </div>
        </div>
    );
}
CalendarYear.displayName = 'Calendar Year';

export { CalendarYear };
