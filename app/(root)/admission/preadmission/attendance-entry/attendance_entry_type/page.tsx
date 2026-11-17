'use client';

import { Button } from '@/components/ui/button';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAttendanceEntryType, useClassDropdownList } from '@/hooks/admission/preadmission/useAttendanceEntry';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import { saveAttendanceEntryType, updateAttendanceEntryType } from '@/server/admission/preadmission/attendance-entry/attendance_entry_type';
import type { IAttendanceEntryTypeList } from '@/types/admission/preadmission/attendance_entry';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { entryTypeColumns } from './_components/columns';
import { EditContext } from './entry-type-context';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function EntryTypePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useAttendanceEntryType(searchParams);

    return (
        <FormProvider<IAttendanceEntryTypeList>>
            <EntryTypePageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function EntryTypePageContent({
    response,
    isLoading,
    error,
    refetchAll
}: { response: any; isLoading: boolean; error: any; refetchAll: () => void }) {
    // const { openAddForm } = useFormContext<IAttendanceEntryTypeList>();
    const [editingRecord, setEditingRecord] = useState<IAttendanceEntryTypeList | null>(null);

    // useDataTableProps parses the standard API response structure (data, total, page, etc.)
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <EntryForm
                    title={editingRecord ? 'EDIT ATTENDANCE ENTRY TYPE' : 'ATTENDANCE ENTRY TYPE'}
                    onClose={() => setEditingRecord(null)}
                    refetchAll={refetchAll}
                    editingRecord={editingRecord}
                    setEditingRecord={setEditingRecord}
                />

                <EditContext.Provider value={{ setEditingRecord }}>
                    <CollapsibleSection
                        defaultOpen={true}
                        title='ATTENDANCE ENTRY TYPE LIST'
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <GenericDataTable<IAttendanceEntryTypeList>
                            {...tableProps}
                            columns={entryTypeColumns as any}
                            isLoading={isLoading}
                            error={error}
                            showViewOptions={false}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading entry types...'
                            noDataTitle='No Entry Types Found'
                            noDataDescription='Create your first entry type'
                            errorTitle='Error Loading Data'
                        />
                    </CollapsibleSection>
                </EditContext.Provider>
            </div>
        </div>
    );
}

// Reusable Form Component
function EntryForm({
    title,
    onClose: _onClose, // Rename to unused
    refetchAll,
    editingRecord,
    setEditingRecord
}: {
    title: string;
    onClose: () => void;
    refetchAll: () => void;
    editingRecord: IAttendanceEntryTypeList | null;
    setEditingRecord: (record: IAttendanceEntryTypeList | null) => void;
}) {
    const queryClient = useQueryClient();
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | undefined>();
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [entryType, setEntryType] = useState<string>('Daily Once');

    // Fetch Academic Year dropdown
    const { data: academicYearResponse, isLoading: isLoadingAcademicYear } = useAcademicYearDropdown();
    const academicYears = academicYearResponse?.data || [];

    // Auto-select the latest Academic Year by default (only when not editing)
    // Auto-select the latest Academic Year by default or set from editing record
    // Auto-select the latest Academic Year by default or set from editing record
    // Unified logic for initializing form state
    useEffect(() => {
        if (editingRecord) {
            // Edit Mode: Prioritize setting values from the record
            // Ensure ID is a number
            const recordYearId = Number(editingRecord.asmaY_Id);
            setSelectedAcademicYearId(recordYearId);

            // Note: We cast to string for the multiselect
            setSelectedClasses([String(editingRecord.asmcL_Id)]);

            const entryTypeReverseMap: Record<string, string> = {
                D: 'Daily Once',
                DT: 'Daily Twice',
                M: 'Monthly',
                SW: 'Subject Wise'
            };
            setEntryType(entryTypeReverseMap[editingRecord.asaeT_Att_Type] || 'Daily Once');
        } else {
            // Create Mode: Auto-select first year if nothing selected and years exist
            if (academicYears.length > 0 && !selectedAcademicYearId) {
                setSelectedAcademicYearId(academicYears[0].asmaY_Id);
            }
        }
    }, [editingRecord, academicYears]); // Depend primarily on the record and list availability

    // Fetch Class dropdown based on selected Academic Year
    const { data: classDropdownResponse, isLoading: isLoadingClasses } = useClassDropdownList(selectedAcademicYearId);

    const classListRaw = classDropdownResponse?.data || classDropdownResponse;
    const classOptions = Array.isArray(classListRaw)
        ? classListRaw.map((item: any) => ({
              label: item.asmcL_ClassName,
              value: String(item.asmcL_Id)
          }))
        : [];

    // Save mutation (Create)
    const saveMutation = useMutation({
        mutationFn: saveAttendanceEntryType,
        onSuccess: async (data) => {
            if (data?.success) {
                toast.success(data.message || 'Attendance entry types saved successfully');
                // Refresh table
                await refetchAll();
                // Force refresh class dropdown
                await queryClient.invalidateQueries({ queryKey: ['CLASS_DROPDOWN_LIST'] });
                // Clear form
                handleClear();
            } else {
                toast.error(data?.message || 'Failed to save attendance entry type');
            }
        },
        onError: (error: any) => {
            toast.error(error?.message || 'An error occurred while saving');
        }
    });

    // Update mutation (Edit)
    const updateMutation = useMutation({
        mutationFn: updateAttendanceEntryType,
        onSuccess: async (data) => {
            if (data?.success) {
                toast.success(data.message || 'Attendance entry type updated successfully');
                // Refresh table
                await refetchAll();
                // Force refresh class dropdown
                await queryClient.invalidateQueries({ queryKey: ['CLASS_DROPDOWN_LIST'] });
                // Clear form
                handleClear();
            } else {
                toast.error(data?.message || 'Failed to update attendance entry type');
            }
        },
        onError: (error: any) => {
            toast.error(error?.message || 'An error occurred while updating');
        }
    });

    // Form validation and submission
    const handleSave = () => {
        // Validate required fields
        if (!selectedAcademicYearId) {
            toast.error('Please select an Academic Year');
            return;
        }

        if (selectedClasses.length === 0) {
            toast.error('Please select at least one Class');
            return;
        }

        if (!entryType) {
            toast.error('Please select an Entry Type');
            return;
        }

        // Map entry type to backend codes
        const entryTypeMap: Record<string, string> = {
            'Daily Once': 'D',
            'Daily Twice': 'DT',
            Monthly: 'M',
            'Subject Wise': 'SW'
        };

        // Check if editing or creating
        if (editingRecord) {
            // Update mode - PUT request
            const updatePayload = {
                asaeT_Id: editingRecord.asaeT_Id,
                asaeT_Att_Type: entryTypeMap[entryType] || 'D'
            };
            updateMutation.mutate(updatePayload);
        } else {
            // Create mode - POST request
            const payload = {
                asmaY_Id: selectedAcademicYearId,
                asaeT_Att_Type: entryTypeMap[entryType] || 'D',
                classes: selectedClasses.map((classId) => ({
                    asmcL_Id: Number(classId)
                }))
            };
            saveMutation.mutate(payload);
        }
    };

    // Clear form
    const handleClear = () => {
        setSelectedClasses([]);
        setEntryType('Daily Once');
        setEditingRecord(null);
    };

    return (
        <CollapsibleSection
            title={title}
            defaultOpen={true}
            variant='outline'
            size='md'
            className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
            <div className='relative p-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
                    {/* Academic Year */}
                    <div className='space-y-4 md:col-span-12 lg:col-span-8 lg:col-start-3'>
                        <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
                            <Label className='text-right font-medium md:col-span-1'>
                                Academic Year:<span className='text-destructive'>*</span>
                            </Label>
                            <div className='md:col-span-3'>
                                {isLoadingAcademicYear ? (
                                    <div className='flex h-10 w-full items-center space-x-2 rounded-md border bg-muted/50 px-3 md:w-[280px]'>
                                        <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                                        <span className='text-muted-foreground text-sm'>Loading years...</span>
                                    </div>
                                ) : (
                                    <Select
                                        value={selectedAcademicYearId?.toString()}
                                        onValueChange={(value) => {
                                            setSelectedAcademicYearId(Number(value));
                                            setSelectedClasses([]); // Reset classes when year changes
                                        }}
                                        disabled={true}>
                                        <SelectTrigger className='w-full md:w-[280px]'>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYears.map((year: any) => (
                                                <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                    {year.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        {/* Class MultiSelect */}
                        <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-4'>
                            <Label className='pt-2 text-right font-medium md:col-span-1'>
                                Class:<span className='text-destructive'>*</span>
                            </Label>
                            <div className='w-full md:col-span-3 md:w-[280px]'>
                                {isLoadingClasses ? (
                                    <div className='flex h-[200px] flex-col items-center justify-center rounded-md border bg-muted/10 p-4'>
                                        <Loader2 className='mb-2 h-6 w-6 animate-spin text-primary' />
                                        <span className='text-muted-foreground text-sm'>Loading classes...</span>
                                    </div>
                                ) : (
                                    <CustomMultiSelectBox
                                        options={classOptions}
                                        value={selectedClasses}
                                        onChange={setSelectedClasses}
                                        isSearchRequired={true}
                                        height='200px'
                                        placeholder='search here...'
                                        disabled={!selectedAcademicYearId || !!editingRecord}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Entry Type Radio Group */}
                        <div className='flex justify-center pt-4'>
                            <RadioGroup
                                defaultValue='daily-once'
                                value={entryType}
                                onValueChange={setEntryType}
                                className='flex flex-wrap items-center gap-6'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Daily Once' id='r1' />
                                    <Label htmlFor='r1'>Daily Once</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Daily Twice' id='r2' />
                                    <Label htmlFor='r2'>Daily Twice</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Monthly' id='r3' />
                                    <Label htmlFor='r3'>Monthly</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Subject Wise' id='r4' />
                                    <Label htmlFor='r4'>Subject Wise</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex justify-center gap-4 pt-8'>
                    <Button
                        className='w-32 bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                        onClick={handleSave}
                        disabled={
                            saveMutation.isPending ||
                            updateMutation.isPending ||
                            !selectedAcademicYearId ||
                            selectedClasses.length === 0 ||
                            !entryType
                        }>
                        <Save className='mr-2 h-4 w-4' />
                        {saveMutation.isPending || updateMutation.isPending
                            ? editingRecord
                                ? 'UPDATING...'
                                : 'SAVING...'
                            : editingRecord
                              ? 'UPDATE'
                              : 'SAVE'}
                    </Button>
                    <Button
                        variant='destructive'
                        className='w-32 bg-[#f97316] text-white hover:bg-[#ea580c]'
                        onClick={handleClear}
                        disabled={saveMutation.isPending || updateMutation.isPending}>
                        <X className='mr-2 h-4 w-4' />
                        CLEAR
                    </Button>
                </div>
            </div>
        </CollapsibleSection>
    );
}
