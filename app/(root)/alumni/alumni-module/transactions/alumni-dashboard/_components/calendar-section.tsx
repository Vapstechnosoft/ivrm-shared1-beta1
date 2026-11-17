'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CalendarSectionProps {
    events: any[];
}

export default function CalendarSection({ events }: CalendarSectionProps) {
    // Helper to get event name from either format
    const getEventName = (event: any) => event.coemE_EventName || event.coeme_eventname || event.coemE_EventName || 'Event';

    // Helper to get start date from either format
    const getStartDate = (event: any) => event.coeE_EStartDate || event.coee_estartdate || null;

    // Helper to get end date from either format
    const getEndDate = (event: any) => event.coeE_EEndDate || event.coee_eenddate || null;

    // Safe date format function
    const safeFormat = (dateStr: string | null, formatStr: string) => {
        if (!dateStr) return '-';
        try {
            return format(new Date(dateStr), formatStr);
        } catch {
            return dateStr;
        }
    };

    return (
        <Card className='h-full'>
            <CardHeader className='border-b bg-muted/20'>
                <CardTitle className='flex items-center text-lg'>
                    <CalendarIcon className='mr-2 h-5 w-5 text-primary' />
                    Upcoming Events
                </CardTitle>
            </CardHeader>
            <CardContent className='pt-6'>
                {events.length === 0 ? (
                    <div className='flex h-48 flex-col items-center justify-center text-muted-foreground'>
                        <CalendarIcon className='mb-2 h-12 w-12 opacity-20' />
                        <p>No events found</p>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {events.map((event, idx) => {
                            const startDate = getStartDate(event);
                            const endDate = getEndDate(event);
                            return (
                                <div
                                    key={idx}
                                    className='group relative pl-8 before:absolute before:top-1 before:left-0 before:h-4 before:w-4 before:rounded-full before:bg-primary/20 before:transition-colors hover:before:bg-primary'>
                                    <div className='flex flex-col space-y-1'>
                                        <span className='font-semibold text-primary text-xs uppercase tracking-wider'>
                                            {safeFormat(startDate, 'MMMM')}
                                        </span>
                                        <h4 className='font-bold text-base transition-colors group-hover:text-primary'>
                                            {getEventName(event)}
                                        </h4>
                                        <div className='flex items-center space-x-4 text-muted-foreground text-xs'>
                                            <div className='flex items-center'>
                                                <CalendarIcon className='mr-1 h-3 w-3' />
                                                {safeFormat(startDate, 'dd MMM yyyy')}
                                                {endDate && endDate !== startDate && <> - {safeFormat(endDate, 'dd MMM yyyy')}</>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
