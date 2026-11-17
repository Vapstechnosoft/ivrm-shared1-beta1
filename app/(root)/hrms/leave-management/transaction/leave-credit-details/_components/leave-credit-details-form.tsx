'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { CarryForwardForm } from './carry-forward-form';
import type { LeaveCreditDetail } from './columns';
import { EncashmentForm } from './encashment-form';
interface LeaveCreditDetailsFormProps {
    activeTab: string;
    onSubmit: (data: LeaveCreditDetail) => void;
    onCancel: () => void;
    defaultValues?: Partial<LeaveCreditDetail>;
    // TODO: Replace with actual API data
    types?: Array<{ id: number; name: string }>;
    departments?: Array<{ id: number; name: string }>;
    designations?: Array<{ id: number; name: string }>;
    grades?: Array<{ id: number; name: string }>;
    leaveNames?: Array<{ id: number; name: string }>;
    encashmentScheduleOptions?: Array<{ id: number; name: string }>;
}
const MONTHS_ARRAY = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
// TODO: Replace with actual API calls - these are placeholder data structures
const defaultTypes: Array<{ id: number; name: string }> = [];
const defaultDepartments: Array<{ id: number; name: string }> = [];
const defaultDesignations: Array<{ id: number; name: string }> = [];
const defaultGrades: Array<{ id: number; name: string }> = [];
const defaultLeaveNames: Array<{ id: number; name: string }> = [];
const defaultEncashmentScheduleOptions: Array<{ id: number; name: string }> = [];
export function LeaveCreditDetailsForm({
    activeTab: initialActiveTab,
    onSubmit,
    onCancel,
    defaultValues,
    types = defaultTypes,
    departments = defaultDepartments,
    designations = defaultDesignations,
    grades = defaultGrades,
    leaveNames = defaultLeaveNames,
    encashmentScheduleOptions = defaultEncashmentScheduleOptions
}: LeaveCreditDetailsFormProps) {
    const [activeTab, setActiveTab] = useState(initialActiveTab);
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<
        LeaveCreditDetail & {
            maxLeaveApplicableEnabled: boolean;
            minServiceApplicableEnabled: boolean;
            minServiceYear: number;
            minServiceMonth: number;
            minServiceDays: number;
            minLeaveApplicableEnabled: boolean;
            minLeaveApplicable: number;
            encashmentType: 'Variable' | 'Fixed';
            encashmentScheduleEnabled: boolean;
            encashmentScheduleType: 'Year' | 'Month';
            selectedEncashmentSchedule: number[];
        }
    >({
        defaultValues: defaultValues || {
            type: [],
            department: [],
            designation: [],
            grade: [],
            leaveName: '',
            leaveCode: '',
            noOfDays: 0,
            maxLeaveApplicable: 0,
            maxLeaveApplicableEnabled: false,
            leaveCarryForward: false,
            leaveEncashment: false,
            leaveCreditMonthWise: false,
            creditMonths: [],
            minServiceApplicableEnabled: false,
            minServiceYear: 0,
            minServiceMonth: 0,
            minServiceDays: 0,
            minLeaveApplicableEnabled: false,
            minLeaveApplicable: 0,
            encashmentType: 'Variable',
            encashmentScheduleEnabled: false,
            encashmentScheduleType: 'Year',
            selectedEncashmentSchedule: [],
            months: MONTHS_ARRAY.reduce(
                (acc, m) => {
                    acc[m] = 0;
                    return acc;
                },
                {} as Record<string, number>
            )
        }
    });
    const leaveCreditMonthWise: boolean = watch('leaveCreditMonthWise') ?? false;
    const creditMonths = watch('creditMonths') || [];
    const handleMonthToggle = (month: string, checked: boolean) => {
        const currentMonths = creditMonths;
        if (checked) {
            setValue('creditMonths', [...currentMonths, month]);
        } else {
            setValue(
                'creditMonths',
                currentMonths.filter((m) => m !== month)
            );
        }
    };
    const handleAllMonthsToggle = (checked: boolean) => {
        if (checked) {
            setValue('creditMonths', MONTHS_ARRAY);
        } else {
            setValue('creditMonths', []);
        }
    };
    const allMonthsSelected: boolean = creditMonths.length === MONTHS_ARRAY.length;
    const onSubmitForm: SubmitHandler<any> = (data) => {
        onSubmit(data);
    };
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='Leave Credit'>Leave Credit</TabsTrigger>
                <TabsTrigger value='Carry Forward'>Carry Forward</TabsTrigger>
                <TabsTrigger value='Encashment'>Encashment</TabsTrigger>
            </TabsList>
            <TabsContent value='Leave Credit' className='mt-4'>
                <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-6'>
                    {/* Filters Section */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                        {/* Type */}
                        <div className='space-y-2'>
                            <Label className='font-medium text-sm'>
                                Type <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='type'
                                control={control}
                                rules={{ required: 'Type is required' }}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={types.map((t) => ({ label: t.name, value: t.id.toString() }))}
                                        onValueChange={(values) => field.onChange(values.map((v) => Number.parseInt(v)))}
                                        defaultValue={field.value?.map((v) => v.toString()) || []}
                                        placeholder='Select Types'
                                        maxHeight={200}
                                    />
                                )}
                            />
                            {errors.type && <FormError>{errors.type.message}</FormError>}
                        </div>
                        {/* Department */}
                        <div className='space-y-2'>
                            <Label className='font-medium text-sm'>
                                Department <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='department'
                                control={control}
                                rules={{ required: 'Department is required' }}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={departments.map((d) => ({ label: d.name, value: d.id.toString() }))}
                                        onValueChange={(values) => field.onChange(values.map((v) => Number.parseInt(v)))}
                                        defaultValue={field.value?.map((v) => v.toString()) || []}
                                        placeholder='Select Departments'
                                        maxHeight={200}
                                    />
                                )}
                            />
                            {errors.department && <FormError>{errors.department.message}</FormError>}
                        </div>
                        {/* Designation */}
                        <div className='space-y-2'>
                            <Label className='font-medium text-sm'>
                                Designation <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='designation'
                                control={control}
                                rules={{ required: 'Designation is required' }}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={designations.map((d) => ({ label: d.name, value: d.id.toString() }))}
                                        onValueChange={(values) => field.onChange(values.map((v) => Number.parseInt(v)))}
                                        defaultValue={field.value?.map((v) => v.toString()) || []}
                                        placeholder='Select Designations'
                                        maxHeight={200}
                                    />
                                )}
                            />
                            {errors.designation && <FormError>{errors.designation.message}</FormError>}
                        </div>
                        {/* Grade */}
                        <div className='space-y-2'>
                            <Label className='font-medium text-sm'>Grade</Label>
                            <Controller
                                name='grade'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={grades.map((g) => ({ label: g.name, value: g.id.toString() }))}
                                        onValueChange={(values) => field.onChange(values.map((v) => Number.parseInt(v)))}
                                        defaultValue={field.value?.map((v) => v.toString()) || []}
                                        placeholder='Select Grades'
                                        maxHeight={200}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    {/* Leave Property Fields */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='leave-name-select' className='font-medium text-sm'>
                                Leave Name <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='leaveId'
                                control={control}
                                rules={{ required: 'Leave Name is required' }}
                                render={({ field }) => {
                                    const stringValue = field.value ? String(field.value) : undefined;
                                    return (
                                        <Select
                                            value={stringValue}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                        >
                                            <SelectTrigger id='leave-name-select' className={errors.id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {leaveNames.map((leave) => (
                                                    <SelectItem key={leave.id} value={String(leave.id)}>
                                                        {leave.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    );
                                }}
                            />
                            {errors.leaveName && <FormError>{errors.leaveName.message}</FormError>}
                        </div>
                        <div>
                            <Label htmlFor='leave-code-input' className='font-medium text-sm'>
                                Leave code:
                            </Label>
                            <Controller
                                name='leaveCode'
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        id='leave-code-input'
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        placeholder='Enter leave code'
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Label htmlFor='no-of-days-input' className='font-medium text-sm'>
                                No of Days <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='noOfDays'
                                control={control}
                                rules={{ required: 'No of Days is required', min: { value: 0, message: 'Must be 0 or greater' } }}
                                render={({ field }) => (
                                    <InputText
                                        id='no-of-days-input'
                                        type='number'
                                        step='0.5'
                                        value={field.value || 0}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className={errors.noOfDays ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.noOfDays && <FormError>{errors.noOfDays.message}</FormError>}
                        </div>
                        <div>
                            <Label htmlFor='max-leave-applicable-input' className='font-medium text-sm'>
                                Max Leave Applicable <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='maxLeaveApplicable'
                                control={control}
                                rules={{ required: 'Max Leave Applicable is required', min: { value: 0, message: 'Must be 0 or greater' } }}
                                render={({ field }) => (
                                    <InputText
                                        id='max-leave-applicable-input'
                                        type='number'
                                        step='0.5'
                                        value={field.value || 0}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className={errors.maxLeaveApplicable ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.maxLeaveApplicable && <FormError>{errors.maxLeaveApplicable.message}</FormError>}
                        </div>
                    </div>
                    {/* Credit Month Selection */}
                    <div className='space-y-2'>
                        <div className='flex items-center space-x-2'>
                            <Controller
                                name='leaveCreditMonthWise'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox id='credit-month' checked={field.value || false} onCheckedChange={field.onChange} />
                                )}
                            />
                            <Label htmlFor='credit-month' className='cursor-pointer font-medium text-sm'>
                                Credit Month
                            </Label>
                        </div>
                        {leaveCreditMonthWise && (
                            <div className='max-h-[240px] space-y-2 overflow-y-auto rounded-md border p-3'>
                                <div className='flex items-center space-x-2 border-b pb-2'>
                                    <Checkbox id='all-months' checked={allMonthsSelected} onCheckedChange={handleAllMonthsToggle} />
                                    <Label htmlFor='all-months' className='cursor-pointer font-normal text-sm'>
                                        All
                                    </Label>
                                </div>
                                <div className='space-y-2'>
                                    {MONTHS_ARRAY.map((month) => (
                                        <div key={month} className='flex items-center space-x-2'>
                                            <Checkbox
                                                id={`month-${month}`}
                                                checked={creditMonths.includes(month)}
                                                onCheckedChange={(checked) => handleMonthToggle(month, checked as boolean)}
                                            />
                                            <Label htmlFor={`month-${month}`} className='cursor-pointer font-normal text-sm'>
                                                {month}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Action Buttons */}
                    <div className='flex justify-center gap-2 border-t pt-4'>
                        <Button type='button' variant='default' onClick={() => setActiveTab('Carry Forward')} className='min-w-[120px]'>
                            NEXT
                            <ChevronRight className='ml-2 h-4 w-4' />
                        </Button>
                        <Button type='button' variant='outline' onClick={onCancel} className='min-w-[120px]'>
                            <X className='mr-2 h-4 w-4' />
                            CANCEL
                        </Button>
                    </div>
                </form>
            </TabsContent>
            <TabsContent value='Carry Forward' className='mt-4'>
                <CarryForwardForm
                    control={control}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    watch={watch}
                    types={types}
                    departments={departments}
                    designations={designations}
                    grades={grades}
                    leaveNames={leaveNames}
                    onSubmit={onSubmitForm}
                    onCancel={onCancel}
                    onPrevious={() => setActiveTab('Leave Credit')}
                    onNext={() => setActiveTab('Encashment')}
                />
            </TabsContent>
            <TabsContent value='Encashment' className='mt-4'>
                <EncashmentForm
                    control={control}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    watch={watch}
                    setValue={setValue}
                    types={types}
                    departments={departments}
                    designations={designations}
                    grades={grades}
                    leaveNames={leaveNames}
                    encashmentScheduleOptions={encashmentScheduleOptions}
                    onSubmit={onSubmitForm}
                    onCancel={onCancel}
                    onPrevious={() => setActiveTab('Carry Forward')}
                />
            </TabsContent>
        </Tabs>
    );
}
