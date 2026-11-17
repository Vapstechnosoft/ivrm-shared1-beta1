'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCOEList } from '@/hooks/student-portal/masters/useAttendanceDetails';
import { getAcademicYeardropdown } from '@/server/student-portal/masters/attendance-details';
import type { IFeeAcademicYearDropdownList } from '@/types/fees/reports/reports';
import type { ICOEData } from '@/types/student-portal/masters/attendance-details';
import { Calendar, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { coeColumns } from './_components/columns';

const months = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
];

export default function COEPage() {
    // State for academic years and filters
    const [academicYears, setAcademicYears] = useState<IFeeAcademicYearDropdownList[]>([]);
    const [academicYearsLoading, setAcademicYearsLoading] = useState(true);
    const [academicYearsError, setAcademicYearsError] = useState<string | null>(null);

    const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [asclId, setAsclId] = useState<number>(1);
    const [amstId, setAmstId] = useState<number>(1);
    const [isInitialized, setIsInitialized] = useState(false);

    // Fetch academic years on component mount
    useEffect(() => {
        const loadAcademicYears = async () => {
            try {
                setAcademicYearsLoading(true);
                setAcademicYearsError(null);

                const years = await getAcademicYeardropdown();
                console.log('Fetched academic years raw:', years);

                // Handle different response formats
                let yearsArray: IFeeAcademicYearDropdownList[] = [];

                if (Array.isArray(years)) {
                    yearsArray = years;
                } else if (years && typeof years === 'object') {
                    // Check if it's an API response with data property
                    if ('data' in years && Array.isArray(years.data)) {
                        yearsArray = years.data;
                    } else if ('success' in years && Array.isArray(years.data)) {
                        yearsArray = years.data;
                    }
                }

                console.log('Processed academic years array:', yearsArray);
                setAcademicYears(yearsArray);

                // Auto-select first academic year when data loads
                if (yearsArray.length > 0) {
                    setSelectedAcademicYear(yearsArray[0].asmaY_Id);
                    setIsInitialized(true);
                    console.log('Auto-selected first academic year:', yearsArray[0].asmaY_Year, 'ID:', yearsArray[0].asmaY_Id);
                }
            } catch (error) {
                console.error('Failed to load academic years:', error);
                setAcademicYearsError('Failed to load academic years. Please try again.');
            } finally {
                setAcademicYearsLoading(false);
            }
        };

        loadAcademicYears();
    }, []);

    // Fetch COE data when filters change
    const {
        data: response,
        isLoading,
        error,
        refetch
    } = useCOEList(
        amstId, // AMST_Id = 1 (hardcoded)
        selectedAcademicYear || 0, // ASMAY_Id = selected academic year ID
        asclId, // ASMCL_Id = 1 (hardcoded)
        selectedMonth

        //15382,  1,   397,1        // Month_Id = selected month ID
    );

    const handleAcademicYearChange = (value: string) => {
        const yearId = Number.parseInt(value);
        setSelectedAcademicYear(yearId);
        console.log('Academic year changed to ID:', yearId);
    };

    const handleMonthChange = (value: string) => {
        const monthId = Number.parseInt(value);
        setSelectedMonth(monthId);
        console.log('Month changed to ID:', monthId);
    };

    const handleRefreshAcademicYears = async () => {
        try {
            setAcademicYearsLoading(true);
            setAcademicYearsError(null);

            const years = await getAcademicYeardropdown();
            let yearsArray: IFeeAcademicYearDropdownList[] = [];

            if (Array.isArray(years)) {
                yearsArray = years;
            } else if (years && typeof years === 'object') {
                if ('data' in years && Array.isArray(years.data)) {
                    yearsArray = years.data;
                } else if ('success' in years && Array.isArray(years.data)) {
                    yearsArray = years.data;
                }
            }

            setAcademicYears(yearsArray);

            if (yearsArray.length > 0 && !selectedAcademicYear) {
                setSelectedAcademicYear(yearsArray[0].asmaY_Id);
            }
        } catch (error) {
            console.error('Failed to refresh academic years:', error);
            setAcademicYearsError('Failed to refresh academic years. Please try again.');
        } finally {
            setAcademicYearsLoading(false);
        }
    };

    // Get selected academic year name
    const selectedAcademicYearData = academicYears.find((y) => y.asmaY_Id === selectedAcademicYear);
    const selectedAcademicYearName = selectedAcademicYearData?.asmaY_Year || '';
    const selectedMonthName = months.find((m) => m.id === selectedMonth)?.name || '';

    // Debug logs
    useEffect(() => {
        console.log('Current state:', {
            academicYears,
            academicYearsLoading,
            selectedAcademicYear,
            selectedAcademicYearName,
            isInitialized
        });
    }, [academicYears, academicYearsLoading, selectedAcademicYear, selectedAcademicYearName, isInitialized]);

    return (
        <FormProvider<ICOEData>>
            <COEPageContent
                response={response}
                isLoading={isLoading}
                academicYearsLoading={academicYearsLoading}
                academicYearsError={academicYearsError}
                error={error}
                refetch={refetch}
                academicYears={academicYears}
                selectedAcademicYear={selectedAcademicYear}
                onAcademicYearChange={handleAcademicYearChange}
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange}
                selectedAcademicYearName={selectedAcademicYearName}
                selectedMonthName={selectedMonthName}
                onRefreshAcademicYears={handleRefreshAcademicYears}
                isInitialized={isInitialized}
            />
        </FormProvider>
    );
}

function COEPageContent({
    response,
    isLoading,
    academicYearsLoading,
    academicYearsError,
    error,
    refetch,
    academicYears,
    selectedAcademicYear,
    onAcademicYearChange,
    selectedMonth,
    onMonthChange,
    selectedAcademicYearName,
    selectedMonthName,
    onRefreshAcademicYears,
    isInitialized
}: {
    response: any;
    isLoading: boolean;
    academicYearsLoading: boolean;
    academicYearsError: string | null;
    error: any;
    refetch: () => void;
    academicYears: IFeeAcademicYearDropdownList[];
    selectedAcademicYear: number | null;
    onAcademicYearChange: (value: string) => void;
    selectedMonth: number;
    onMonthChange: (value: string) => void;
    selectedAcademicYearName: string;
    selectedMonthName: string;
    onRefreshAcademicYears: () => void;
    isInitialized: boolean;
}) {
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-6 p-1'>
                {/* Header with Filters */}
                <div className='space-y-4'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='space-y-1'>
                            <h1 className='font-bold text-2xl tracking-tight'>COE Events</h1>
                            <p className='text-muted-foreground'>Calendar of Events</p>
                        </div>
                        <div className='flex gap-2'>
                            <Button onClick={onRefreshAcademicYears} variant='ghost' size='sm' disabled={academicYearsLoading}>
                                {academicYearsLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                                Refresh Years
                            </Button>
                            <Button onClick={refetch} variant='outline' size='sm' disabled={isLoading || !selectedAcademicYear}>
                                {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                                Refresh Events
                            </Button>
                        </div>
                    </div>

                    {/* Filters Card */}
                    <Card className='border shadow-sm'>
                        <CardContent className='p-4'>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {/* Academic Year Dropdown */}
                                <div className='space-y-2'>
                                    <Label htmlFor='academic-year' className='flex items-center gap-2'>
                                        <Calendar className='h-4 w-4' />
                                        Academic Year
                                        {academicYearsLoading && <Loader2 className='h-3 w-3 animate-spin' />}
                                    </Label>
                                    <Select
                                        value={selectedAcademicYear?.toString() || ''}
                                        onValueChange={onAcademicYearChange}
                                        disabled={academicYearsLoading}>
                                        <SelectTrigger id='academic-year' className='w-full'>
                                            {academicYearsLoading ? (
                                                <div className='flex items-center gap-2'>
                                                    <Loader2 className='h-4 w-4 animate-spin' />
                                                    Loading years...
                                                </div>
                                            ) : academicYearsError ? (
                                                <span className='text-destructive'>Error loading years</span>
                                            ) : academicYears.length === 0 ? (
                                                <span className='text-muted-foreground'>No academic years available</span>
                                            ) : (
                                                <SelectValue placeholder='Select academic year'>
                                                    {selectedAcademicYearName || 'Select academic year'}
                                                </SelectValue>
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYears.map((year, index) => (
                                                <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                    <div className='flex items-center justify-between'>
                                                        <span>
                                                            {year.asmaY_Year}
                                                            {index === 0 && !isInitialized && (
                                                                <span className='ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-primary text-xs'>
                                                                    Default
                                                                </span>
                                                            )}
                                                        </span>
                                                        {year.asmaY_Order}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {academicYearsError && <p className='text-destructive text-sm'>{academicYearsError}</p>}
                                    {!academicYearsLoading && academicYears.length > 0}
                                </div>

                                {/* Month Dropdown */}
                                <div className='space-y-2'>
                                    <Label htmlFor='month' className='flex items-center gap-2'>
                                        <Calendar className='h-4 w-4' />
                                        Month
                                    </Label>
                                    <Select value={selectedMonth.toString()} onValueChange={onMonthChange} disabled={!selectedAcademicYear}>
                                        <SelectTrigger id='month' className='w-full'>
                                            <SelectValue placeholder='Select month'>{selectedMonthName}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((month, index) => (
                                                <SelectItem key={month.id} value={month.id.toString()}>
                                                    <div className='flex items-center'>
                                                        <span>{month.name}</span>
                                                        {index === 0}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Info Display */}
                                {/* <div className='space-y-2'>
                  <Label className='text-muted-foreground'>Current Selection</Label>
                  <div className='p-3 bg-muted/50 rounded-md text-sm space-y-1'>
                    <div className="flex justify-between">
                      <span className="font-medium">Academic Year:</span>
                      <span className="font-semibold">
                        {selectedAcademicYearName || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Month:</span>
                      <span className="font-semibold">
                        {selectedMonthName}
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t">
                      <p className='text-xs text-muted-foreground'>
                        {academicYearsLoading 
                          ? 'Loading academic years...' 
                          : !selectedAcademicYear 
                            ? 'No academic year selected' 
                            : `Showing events for ${selectedAcademicYearName}, ${selectedMonthName}`
                        }
                      </p>
                    </div>
                  </div>
                </div> */}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Error display for academic years */}
                {academicYearsError && (
                    <Card className='border-destructive/50 bg-destructive/10'>
                        <CardContent className='p-4'>
                            <div className='flex items-start gap-3'>
                                <div className='flex-1'>
                                    <h3 className='font-semibold text-destructive'>Unable to load academic years</h3>
                                    <p className='mt-1 text-destructive/90 text-sm'>{academicYearsError}</p>
                                </div>
                                <Button
                                    onClick={onRefreshAcademicYears}
                                    variant='outline'
                                    size='sm'
                                    className='border-destructive text-destructive hover:bg-destructive/10'>
                                    Retry
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Show loading state while initializing */}
                {academicYearsLoading && (
                    <Card className='border-2 border-dashed'>
                        <CardContent className='p-8 text-center'>
                            <Loader2 className='mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground' />
                            <h3 className='mb-2 font-medium text-lg'>Loading Academic Years</h3>
                            <p className='text-muted-foreground'>Please wait while we load the academic years...</p>
                        </CardContent>
                    </Card>
                )}

                {/* Show when academic years are loaded but selection is being made */}
                {!academicYearsLoading && academicYears.length > 0 && !selectedAcademicYear && (
                    <Card className='border-2 border-dashed'>
                        <CardContent className='p-8 text-center'>
                            <Loader2 className='mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground' />
                            <h3 className='mb-2 font-medium text-lg'>Initializing Filters</h3>
                            <p className='text-muted-foreground'>Setting up default filters. The list will appear shortly...</p>
                        </CardContent>
                    </Card>
                )}

                {/* Data Table Section - Show when academic year is selected */}
                {selectedAcademicYear && !academicYearsLoading && (
                    <CollapsibleSection
                        defaultOpen
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        {error ? (
                            <div className='p-8 text-center'>
                                <div className='mb-2 text-destructive'>
                                    <Calendar className='mx-auto mb-4 h-12 w-12' />
                                    <h3 className='font-medium text-lg'>Unable to load events</h3>
                                    <p className='mt-1 text-sm'>{error.message || 'An error occurred'}</p>
                                </div>
                                <Button onClick={refetch} variant='outline' className='mt-4'>
                                    Try Again
                                </Button>
                            </div>
                        ) : (
                            <GenericDataTable<ICOEData>
                                {...tableProps}
                                columns={coeColumns}
                                isLoading={isLoading}
                                error={null}
                                columnPinning={{ right: ['actions'] }}
                                loadingMessage={`Loading COE Events for ${selectedAcademicYearName}, ${selectedMonthName}...`}
                                noDataTitle='No COE Events Found'
                                noDataDescription={`No events found for ${selectedAcademicYearName}, ${selectedMonthName}. Try selecting a different month or academic year.`}
                                errorTitle='Error Loading Data'
                            />
                        )}
                    </CollapsibleSection>
                )}

                {/* Show when no academic years are loaded */}
                {!academicYearsLoading && academicYears.length === 0 && !academicYearsError && (
                    <Card className='border-2 border-dashed'>
                        <CardContent className='p-8 text-center'>
                            <Calendar className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                            <h3 className='mb-2 font-medium text-lg'>No Academic Years Available</h3>
                            <p className='text-muted-foreground'>There are no academic years configured in the system.</p>
                            <Button onClick={onRefreshAcademicYears} variant='outline' className='mt-4'>
                                Refresh
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Forms */}
                <FormSections refetch={refetch} />
            </div>
        </div>
    );
}

function FormSections({ refetch }: { refetch: () => void }) {
    const { isAddFormOpen, isEditFormOpen, selectedRow, closeAddForm, addFormRef } = useFormContext<ICOEData>();

    useEffect(() => {
        if (isEditFormOpen && !selectedRow) {
            console.error('FormSections: Edit form open but selectedRow is undefined');
        }
    }, [isEditFormOpen, selectedRow]);

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        description='Fill in the details below to create a new mapping'
                        defaultOpen
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
