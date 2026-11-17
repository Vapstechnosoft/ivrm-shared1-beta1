'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
    useReportDepartments,
    useReportDesignations,
    useReportGroupTypes,
    useReportEmployees,
    useEmployeeLetterDetails
} from '@/hooks/hrms/useReports';
import { Loader2, Search, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { LetterRenderer } from './_components/letter-templates';
import { printEmployeeLetter } from './_components/print-utils';

interface FilterFormValues {
    groupTypeId: string;
    departmentId: string;
    designationId: string;
    employeeId: string;
    letterType: string;
    hrmeR_Current_Date: Date | undefined;
    hrmE_DOJ: Date | undefined;
    hrmeR_DOI: Date | undefined;
    hrmeR_DOR: Date | undefined;
    DoResignation: Date | undefined;
    hrmeR_DOd: Date | undefined;
    hrmeR_DOter: Date | undefined;
    hrmeR_DOp: Date | undefined;
    bankaddress: string;
    staffLevel: string;
    startingBasic: string;
    staffDesignation: string;
}

const LETTER_TYPES = [
    { label: 'Teaching Staff Offer Letter', value: 'offerletter' },
    { label: 'Non Teaching Staff Offer Letter', value: 'Non Teaching offerletter' },
    { label: 'Experience Certificate', value: 'experienceletter' },
    { label: 'Service Certificate', value: 'servicecertificate' },
    { label: 'Teaching Staff Appointment Letter', value: 'appontmentletter' },
    { label: 'Non Teaching Staff Appointment Letter', value: 'nonteachingappontmentletter' },
    { label: 'Confirmation Letter', value: 'confirmationletter' },
    { label: 'Termination Letter', value: 'Terminationletter' },
    { label: 'Relieving Letter', value: 'relievingLetter' },
    { label: 'Account Opening', value: 'accountopening' }
];

export default function EmployeeOfferLetterPage() {
    return (
        <FormProvider>
            <EmployeeOfferLetterContent />
        </FormProvider>
    );
}

function EmployeeOfferLetterContent() {
    const [letterDetails, setLetterDetails] = useState<any>(null);
    const { control, handleSubmit, watch, setValue } = useForm<FilterFormValues>({
        defaultValues: {
            groupTypeId: '',
            departmentId: '',
            designationId: '',
            employeeId: '',
            letterType: 'offerletter',
            hrmeR_Current_Date: new Date(),
            hrmE_DOJ: undefined,
            hrmeR_DOI: undefined,
            hrmeR_DOR: undefined,
            DoResignation: undefined,
            hrmeR_DOd: undefined,
            hrmeR_DOter: undefined,
            hrmeR_DOp: undefined,
            bankaddress: '',
            staffLevel: '',
            startingBasic: '',
            staffDesignation: ''
        }
    });

    const watchedGroupType = watch('groupTypeId');
    const watchedDepartment = watch('departmentId');
    const watchedDesignation = watch('designationId');
    const watchedLetterType = watch('letterType');

    // Queries
    const { data: groupTypesData } = useReportGroupTypes();
    const { data: departmentsData } = useReportDepartments(watchedGroupType);
    const { data: designationsData } = useReportDesignations(watchedGroupType, watchedDepartment);

    const { data: employeesData } = useReportEmployees(
        Number(watchedDesignation),
        Number(watchedDepartment),
        Number(watchedGroupType)
    );

    const { mutate: fetchDetails, isPending } = useEmployeeLetterDetails();

    const onSubmit = (data: FilterFormValues) => {
        if (!data.employeeId || !data.letterType) {
            toast.error('Please select an Employee and Letter Type');
            return;
        }

        fetchDetails({
            designationId: Number(data.designationId),
            deptId: Number(data.departmentId),
            groupTypeId: Number(data.groupTypeId),
            employeeId: Number(data.employeeId)
        }, {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    setLetterDetails(res.data);
                    toast.success('Details fetched successfully');
                } else {
                    toast.error(res.message || 'No data found');
                }
            }
        });
    };

    const handlePrint = () => {
        if (!letterDetails) {
            toast.error('Please search for an employee first');
            return;
        }
        printEmployeeLetter(letterDetails, watch());
    };

    return (
        <div className='container min-h-screen space-y-4 p-2'>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold tracking-tight'>Employee Offer and Experience Report</h2>
            </div>

            <CollapsibleSection defaultOpen={true} title="Report Criteria" variant='outline' className='shadow-sm'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        {/* 左：Filter dropdowns */}
                        <div className='space-y-4 border p-4 rounded-lg bg-muted/10'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label>Group Type <span className='text-destructive'>*</span></Label>
                                    <Controller name='groupTypeId' control={control} render={({ field }) => (
                                        <Select onValueChange={(val) => { field.onChange(val); setValue('departmentId', ''); setValue('designationId', ''); setValue('employeeId', ''); }} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {groupTypesData?.data?.map((gt: any) => (
                                                    <SelectItem key={gt.key} value={gt.key.toString()}>{gt.value}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </div>

                                <div className='space-y-2'>
                                    <Label>Department <span className='text-destructive'>*</span></Label>
                                    <Controller name='departmentId' control={control} render={({ field }) => (
                                        <Select onValueChange={(val) => { field.onChange(val); setValue('designationId', ''); setValue('employeeId', ''); }} value={field.value} disabled={!watchedGroupType}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {departmentsData?.data?.map((d: any) => (
                                                    <SelectItem key={d.hrmD_Id} value={d.hrmD_Id.toString()}>{d.hrmD_DepartmentName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </div>

                                <div className='space-y-2'>
                                    <Label>Designation <span className='text-destructive'>*</span></Label>
                                    <Controller name='designationId' control={control} render={({ field }) => (
                                        <Select onValueChange={(val) => { field.onChange(val); setValue('employeeId', ''); }} value={field.value} disabled={!watchedDepartment}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {designationsData?.data?.map((d: any) => (
                                                    <SelectItem key={d.hrmdeS_Id} value={d.hrmdeS_Id.toString()}>{d.hrmdeS_DesignationName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </div>

                                <div className='space-y-2'>
                                    <Label>Employee <span className='text-destructive'>*</span></Label>
                                    <Controller name='employeeId' control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!watchedDesignation}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {employeesData?.data?.map((e: any) => (
                                                    <SelectItem key={e.hrmE_Id} value={e.hrmE_Id.toString()}>
                                                        {e.employeeName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
                                <div className='space-y-2'>
                                    <Label>Current Date <span className='text-destructive'>*</span></Label>
                                    <Controller name='hrmeR_Current_Date' control={control} render={({ field }) => (
                                        <DatePicker date={field.value} setDate={field.onChange} />
                                    )} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Date of Joining</Label>
                                    <Controller name='hrmE_DOJ' control={control} render={({ field }) => (
                                        <DatePicker date={field.value} setDate={field.onChange} />
                                    )} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Date of Interview</Label>
                                    <Controller name='hrmeR_DOI' control={control} render={({ field }) => (
                                        <DatePicker date={field.value} setDate={field.onChange} />
                                    )} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Date of Response</Label>
                                    <Controller name='hrmeR_DOR' control={control} render={({ field }) => (
                                        <DatePicker date={field.value} setDate={field.onChange} />
                                    )} />
                                </div>
                                {watchedLetterType === 'relievingLetter' && (
                                    <div className='space-y-2'>
                                        <Label>Date of Resignation</Label>
                                        <Controller name='DoResignation' control={control} render={({ field }) => (
                                            <DatePicker date={field.value} setDate={field.onChange} />
                                        )} />
                                    </div>
                                )}
                                {watchedLetterType === 'Terminationletter' && (
                                    <>
                                        <div className='space-y-2'>
                                            <Label>Date of Due</Label>
                                            <Controller name='hrmeR_DOd' control={control} render={({ field }) => (
                                                <DatePicker date={field.value} setDate={field.onChange} />
                                            )} />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Last Working Day</Label>
                                            <Controller name='hrmeR_DOter' control={control} render={({ field }) => (
                                                <DatePicker date={field.value} setDate={field.onChange} />
                                            )} />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Date of Probation</Label>
                                            <Controller name='hrmeR_DOp' control={control} render={({ field }) => (
                                                <DatePicker date={field.value} setDate={field.onChange} />
                                            )} />
                                        </div>
                                    </>
                                )}
                                {(watchedLetterType === 'offerletter' || watchedLetterType === 'Non Teaching offerletter' || watchedLetterType === 'appontmentletter' || watchedLetterType === 'nonteachingappontmentletter') && (
                                    <>
                                        <div className='space-y-2'>
                                            <Label>Staff Category Level</Label>
                                            <Controller name='staffLevel' control={control} render={({ field }) => (
                                                <Input {...field} placeholder="Enter Level" />
                                            )} />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Starting Basic</Label>
                                            <Controller name='startingBasic' control={control} render={({ field }) => (
                                                <Input {...field} placeholder="Enter Salary" />
                                            )} />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Designation (Override)</Label>
                                            <Controller name='staffDesignation' control={control} render={({ field }) => (
                                                <Input {...field} placeholder="Enter Designation" />
                                            )} />
                                        </div>
                                    </>
                                )}
                                {watchedLetterType === 'accountopening' && (
                                    <div className='col-span-full space-y-2'>
                                        <Label>Bank Address</Label>
                                        <Controller name='bankaddress' control={control} render={({ field }) => (
                                            <textarea
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter Bank Address"
                                                {...field}
                                            />
                                        )} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 右：Letter Type radios */}
                        <div className='space-y-4 border p-4 rounded-lg bg-muted/10'>
                            <Label className='font-bold'>Select Letter Type</Label>
                            <Controller name='letterType' control={control} render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} value={field.value} className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                    {LETTER_TYPES.map((type) => (
                                        <div key={type.value} className="flex items-center space-x-2 p-1 hover:bg-muted/20 rounded">
                                            <RadioGroupItem value={type.value} id={`type-${type.value}`} />
                                            <Label htmlFor={`type-${type.value}`} className="cursor-pointer text-xs">{type.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )} />
                        </div>
                    </div>

                    <div className='flex justify-end gap-2'>
                        <Button type='button' variant="outline" onClick={() => { setValue('groupTypeId', ''); setLetterDetails(null); }}>Cancel</Button>
                        <Button type='submit' disabled={isPending} className='w-32'>
                            {isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className='mr-2 h-4 w-4' />}
                            Search
                        </Button>
                    </div>
                </form>
            </CollapsibleSection>

            {
                letterDetails && (
                    <CollapsibleSection title="Letter Preview" defaultOpen={true} className='shadow-md border'
                        rightElement={
                            <Button variant='outline' size='sm' onClick={handlePrint} className='gap-2'>
                                <Printer className='h-4 w-4' />
                                Print
                            </Button>
                        }
                    >
                        <div className="bg-muted p-4 sm:p-8 flex justify-center overflow-x-auto">
                            <div className="shadow-2xl border bg-white" style={{ width: '8.5in', minHeight: '11in' }}>
                                <LetterRenderer details={letterDetails} formData={watch()} setValue={setValue} />
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-sm text-muted-foreground italic">Note: Some fields (Level, Salary) are editable in the printed version if manual entry is required.</p>
                        </div>
                    </CollapsibleSection>
                )
            }
        </div >
    );
}
