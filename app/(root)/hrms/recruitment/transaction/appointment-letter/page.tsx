// Refactored by automation script on 2025-10-28T15:40:35.941Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/appointment-letter-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BaseEntity, createLocalCrud } from '@/lib/localdb';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, Edit, FileText, Plus, RefreshCw, Save, Trash2, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface AppointmentLetter extends BaseEntity {
    candidateName: string;
    candidateId: number;
    companyName: string;
    department: string;
    designation: string;
    qualification: string;
    maritalStatus: string;
    caste: string;
    dateOfJoining: string;
    probationPeriod: number;
    basicSalary: number;
    // Salary Details - Earning Head
    earningDetails: EarningDetail[];
    // Salary Details - Deduction Head
    deductionDetails: DeductionDetail[];
    // Document Details
    firstDocumentName: string;
    firstDocumentDate: string;
    appointmentRefNo: string;
    acknowledgmentRefNo: string;
    annualCTC: number;
    companyOwnerName: string;
    monthlyCTC: number;
    // Letter Generation Details
    secondDocumentName: string;
    secondDocumentDate: string;
    status: 'Draft' | 'Generated' | 'Sent' | 'Acknowledged';
    letterGeneratedDate?: string;
    letterSentDate?: string;
    acknowledgedDate?: string;
}
interface EarningDetail {
    serialNo: number;
    earningHead: string;
    amount: number;
    percentage: number;
    applicability: string;
    remarks: string;
}
interface DeductionDetail {
    serialNo: number;
    deductionHead: string;
    amount: number;
    percentage: number;
    applicability: string;
    remarks: string;
}
interface Candidate extends BaseEntity {
    firstName: string;
    middleName?: string;
    lastName: string;
    emailId: string;
    mobileNo: string;
    jobTitle: string;
    qualification: string;
    maritalStatus: string;
    caste: string;
    status: string;
}
type AppointmentLetterForm = {
    candidateId: string;
    companyName: string;
    department: string;
    designation: string;
    qualification: string;
    maritalStatus: string;
    caste: string;
    dateOfJoining: Date | undefined;
    probationPeriod: string;
    basicSalary: string;
    firstDocumentName: string;
    firstDocumentDate: Date | undefined;
    appointmentRefNo: string;
    acknowledgmentRefNo: string;
    annualCTC: string;
    companyOwnerName: string;
    monthlyCTC: string;
    secondDocumentName: string;
    secondDocumentDate: Date | undefined;
    sendWelcomeNotification: boolean;
};
export default function AppointmentLetterPage() {
    const [appointmentLetters, setAppointmentLetters] = useState<AppointmentLetter[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLetter, setEditingLetter] = useState<AppointmentLetter | null>(null);
    const [earningDetails, setEarningDetails] = useState<EarningDetail[]>([]);
    const [deductionDetails, setDeductionDetails] = useState<DeductionDetail[]>([]);
    const formRef = useRef<HTMLDivElement>(null);
    const appointmentDB = createLocalCrud<AppointmentLetter>('recruitment:appointment-letter');
    const candidateDB = createLocalCrud<Candidate>('recruitment:candidate');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm<AppointmentLetterForm>({
        mode: 'onChange',
        defaultValues: {
            dateOfJoining: undefined,
            probationPeriod: '6',
            firstDocumentName: 'Offer Letter',
            firstDocumentDate: undefined,
            secondDocumentName: 'Offer letter',
            secondDocumentDate: undefined,
            sendWelcomeNotification: true
        }
    });
    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setAppointmentLetters(appointmentDB.list());
            setCandidates(candidateDB.list());
        } catch (_error) {
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };
    const handleAddClick = () => {
        setIsFormOpen(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingLetter(null);
        setEarningDetails([]);
        setDeductionDetails([]);
        reset({
            dateOfJoining: undefined,
            probationPeriod: '6',
            firstDocumentName: 'Offer Letter',
            firstDocumentDate: undefined,
            secondDocumentName: 'Offer letter',
            secondDocumentDate: undefined,
            sendWelcomeNotification: true
        });
    };
    const onSubmit: SubmitHandler<AppointmentLetterForm> = async (data: AppointmentLetterForm) => {
        try {
            if (!data.dateOfJoining || !data.firstDocumentDate || !data.secondDocumentDate) {
                toast.error('Please fill all required date fields');
                return;
            }
            const candidate = candidates.find((c) => c.id.toString() === data.candidateId);
            if (!candidate) {
                toast.error('Please select a valid candidate');
                return;
            }
            const appointmentData: Omit<AppointmentLetter, 'id' | 'createdAt'> = {
                candidateName: `${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.trim(),
                candidateId: candidate.id,
                companyName: data.companyName,
                department: data.department,
                designation: data.designation,
                qualification: data.qualification,
                maritalStatus: data.maritalStatus,
                caste: data.caste,
                dateOfJoining: format(data.dateOfJoining, 'yyyy-MM-dd'),
                probationPeriod: Number.parseInt(data.probationPeriod),
                basicSalary: Number.parseFloat(data.basicSalary),
                earningDetails,
                deductionDetails,
                firstDocumentName: data.firstDocumentName,
                firstDocumentDate: format(data.firstDocumentDate, 'yyyy-MM-dd'),
                appointmentRefNo: data.appointmentRefNo,
                acknowledgmentRefNo: data.acknowledgmentRefNo,
                annualCTC: Number.parseFloat(data.annualCTC),
                companyOwnerName: data.companyOwnerName,
                monthlyCTC: Number.parseFloat(data.monthlyCTC),
                secondDocumentName: data.secondDocumentName,
                secondDocumentDate: format(data.secondDocumentDate, 'yyyy-MM-dd'),
                status: 'Draft'
            };
            if (editingLetter) {
                appointmentDB.update(editingLetter.id, appointmentData);
                toast.success('Appointment letter updated successfully');
            } else {
                appointmentDB.create(appointmentData);
                toast.success('Appointment letter created successfully');
            }
            handleFormClose();
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };
    const handleClear = () => {
        handleFormClose();
        toast.info('Form cleared');
    };
    const handleEdit = (letter: AppointmentLetter) => {
        setEditingLetter(letter);
        setEarningDetails(letter.earningDetails || []);
        setDeductionDetails(letter.deductionDetails || []);
        reset({
            candidateId: letter.candidateId.toString(),
            companyName: letter.companyName,
            department: letter.department,
            designation: letter.designation,
            qualification: letter.qualification,
            maritalStatus: letter.maritalStatus,
            caste: letter.caste,
            dateOfJoining: new Date(letter.dateOfJoining),
            probationPeriod: letter.probationPeriod.toString(),
            basicSalary: letter.basicSalary.toString(),
            firstDocumentName: letter.firstDocumentName,
            firstDocumentDate: new Date(letter.firstDocumentDate),
            appointmentRefNo: letter.appointmentRefNo,
            acknowledgmentRefNo: letter.acknowledgmentRefNo,
            annualCTC: letter.annualCTC.toString(),
            companyOwnerName: letter.companyOwnerName,
            monthlyCTC: letter.monthlyCTC.toString(),
            secondDocumentName: letter.secondDocumentName,
            secondDocumentDate: new Date(letter.secondDocumentDate),
            sendWelcomeNotification: true
        });
        setIsFormOpen(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };
    const handleDelete = async (letter: AppointmentLetter) => {
        try {
            appointmentDB.remove(letter.id);
            toast.success('Appointment letter deleted successfully');
            loadData();
        } catch (_error) {
            toast.error('Failed to delete appointment letter');
        }
    };
    const addEarningDetail = () => {
        setEarningDetails([
            ...earningDetails,
            {
                serialNo: earningDetails.length + 1,
                earningHead: '',
                amount: 0,
                percentage: 0,
                applicability: '',
                remarks: ''
            }
        ]);
    };
    const addDeductionDetail = () => {
        setDeductionDetails([
            ...deductionDetails,
            {
                serialNo: deductionDetails.length + 1,
                deductionHead: '',
                amount: 0,
                percentage: 0,
                applicability: '',
                remarks: ''
            }
        ]);
    };
    const removeEarningDetail = (index: number) => {
        setEarningDetails(earningDetails.filter((_, i) => i !== index));
    };
    const removeDeductionDetail = (index: number) => {
        setDeductionDetails(deductionDetails.filter((_, i) => i !== index));
    };
    const updateEarningDetail = (index: number, field: keyof EarningDetail, value: any) => {
        const updated = [...earningDetails];
        updated[index] = { ...updated[index], [field]: value };
        setEarningDetails(updated);
    };
    const updateDeductionDetail = (index: number, field: keyof DeductionDetail, value: any) => {
        const updated = [...deductionDetails];
        updated[index] = { ...updated[index], [field]: value };
        setDeductionDetails(updated);
    };
    const handleGenerateLetter = (_letter: AppointmentLetter, type: string) => {
        toast.success(`${type} generated successfully`);
        // Here you would implement actual letter generation logic
    };
    const getCandidateName = (candidateId: number) => {
        const candidate = candidates.find((c) => c.id === candidateId);
        return candidate ? `${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.trim() : 'Unknown';
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading
                            title='Appointment Letter Generation'
                            description='Generate and manage appointment letters for selected candidates'
                        />
                    </div>
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Generate Appointment Letter
                    </Button>
                </div>
                {/* Data Table Section - Collapsible but default open */}
                <CollapsibleSection
                    title='Appointment Letters Data'
                    description='View, search, and manage all appointment letters'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <AppointmentLetterTable
                        letters={appointmentLetters}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onGenerateLetter={handleGenerateLetter}
                        getCandidateName={getCandidateName}
                    />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef}>
                        <CollapsibleSection
                            title={editingLetter ? 'Edit Appointment Letter' : 'Appointment Letter Generation'}
                            description={
                                editingLetter
                                    ? 'Update appointment letter details'
                                    : 'Fill in appointment letter information across different sections'
                            }
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                                <Tabs defaultValue='candidate-details' className='w-full'>
                                    <TabsList className='grid w-full grid-cols-3'>
                                        <TabsTrigger value='candidate-details' className='flex items-center gap-2'>
                                            <User className='h-4 w-4' />
                                            Candidate Details
                                        </TabsTrigger>
                                        <TabsTrigger value='candidate-payroll' className='flex items-center gap-2'>
                                            <DollarSign className='h-4 w-4' />
                                            Candidate Payroll
                                        </TabsTrigger>
                                        <TabsTrigger value='letter-generation' className='flex items-center gap-2'>
                                            <FileText className='h-4 w-4' />
                                            Letter Generation
                                        </TabsTrigger>
                                    </TabsList>
                                    {/* Candidate Details Tab */}
                                    <TabsContent value='candidate-details' className='space-y-6'>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className='flex items-center gap-2'>
                                                    <User className='h-5 w-5' />
                                                    Candidate Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                    {/* Candidate Name */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Candidate Name <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Select onValueChange={(value) => setValue('candidateId', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select Candidate' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {candidates.map((candidate) => (
                                                                    <SelectItem key={candidate.id} value={candidate.id.toString()}>
                                                                        {`${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.trim()}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.candidateId && <FormError>Candidate selection is required</FormError>}
                                                    </div>
                                                    {/* Company Name */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Company Name <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Select onValueChange={(value) => setValue('companyName', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='--Select--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='Tech Solutions Ltd'>Tech Solutions Ltd</SelectItem>
                                                                <SelectItem value='Innovation Corp'>Innovation Corp</SelectItem>
                                                                <SelectItem value='Digital Systems'>Digital Systems</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.companyName && <FormError>Company is required</FormError>}
                                                    </div>
                                                    {/* Department */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Department <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Select onValueChange={(value) => setValue('department', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='--Select--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='Information Technology'>
                                                                    Information Technology
                                                                </SelectItem>
                                                                <SelectItem value='Human Resources'>Human Resources</SelectItem>
                                                                <SelectItem value='Finance'>Finance</SelectItem>
                                                                <SelectItem value='Operations'>Operations</SelectItem>
                                                                <SelectItem value='Marketing'>Marketing</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.department && <FormError>Department is required</FormError>}
                                                    </div>
                                                    {/* Designation */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Designation <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Select onValueChange={(value) => setValue('designation', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='--Select--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='Software Engineer'>Software Engineer</SelectItem>
                                                                <SelectItem value='Senior Software Engineer'>
                                                                    Senior Software Engineer
                                                                </SelectItem>
                                                                <SelectItem value='Team Lead'>Team Lead</SelectItem>
                                                                <SelectItem value='Project Manager'>Project Manager</SelectItem>
                                                                <SelectItem value='HR Executive'>HR Executive</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.designation && <FormError>Designation is required</FormError>}
                                                    </div>
                                                    {/* Qualification */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Qualification <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Select onValueChange={(value) => setValue('qualification', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='--Select--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='B.Tech'>B.Tech</SelectItem>
                                                                <SelectItem value='M.Tech'>M.Tech</SelectItem>
                                                                <SelectItem value='BCA'>BCA</SelectItem>
                                                                <SelectItem value='MCA'>MCA</SelectItem>
                                                                <SelectItem value='MBA'>MBA</SelectItem>
                                                                <SelectItem value='Other'>Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.qualification && <FormError>Qualification is required</FormError>}
                                                    </div>
                                                    {/* Marital Status */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Marital Status <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Select onValueChange={(value) => setValue('maritalStatus', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='--Select--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='Single'>Single</SelectItem>
                                                                <SelectItem value='Married'>Married</SelectItem>
                                                                <SelectItem value='Divorced'>Divorced</SelectItem>
                                                                <SelectItem value='Widowed'>Widowed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.maritalStatus && <FormError>Marital status is required</FormError>}
                                                    </div>
                                                    {/* Caste */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Caste <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Select onValueChange={(value) => setValue('caste', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='--Select--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='General'>General</SelectItem>
                                                                <SelectItem value='OBC'>OBC</SelectItem>
                                                                <SelectItem value='SC'>SC</SelectItem>
                                                                <SelectItem value='ST'>ST</SelectItem>
                                                                <SelectItem value='Other'>Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.caste && <FormError>Caste is required</FormError>}
                                                    </div>
                                                    {/* Date of Joining */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Date of Joining <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Controller
                                                            control={control}
                                                            name='dateOfJoining'
                                                            rules={{ required: 'Date of joining is required' }}
                                                            render={({ field }) => (
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant='outline'
                                                                            className={cn(
                                                                                'w-full justify-start text-left font-normal',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}>
                                                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                                                            {field.value
                                                                                ? format(field.value, 'dd-MM-yyyy')
                                                                                : 'Select Date'}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className='w-auto p-0' align='start'>
                                                                        <DatePickerWithYear
                                                                            mode='single'
                                                                            selected={field.value}
                                                                            onDayClick={(day) => field.onChange(day)}
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            )}
                                                        />
                                                        {errors.dateOfJoining && <FormError>{errors.dateOfJoining.message}</FormError>}
                                                    </div>
                                                    {/* Probation Period */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Probation Period (Months) <span className='text-red-500'>*</span>
                                                        </span>
                                                        <InputText
                                                            type='number'
                                                            placeholder='6'
                                                            {...register('probationPeriod', { required: 'Probation period is required' })}
                                                            error={errors.probationPeriod?.message}
                                                        />
                                                    </div>
                                                    {/* Basic Salary */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Basic Salary <span className='text-red-500'>*</span>
                                                        </span>
                                                        <InputText
                                                            type='number'
                                                            placeholder='Enter basic salary'
                                                            {...register('basicSalary', { required: 'Basic salary is required' })}
                                                            error={errors.basicSalary?.message}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    {/* Candidate Payroll Tab */}
                                    <TabsContent value='candidate-payroll' className='space-y-6'>
                                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                            {/* Salary Details - Earning Head */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className='flex items-center justify-between'>
                                                        <span className='flex items-center gap-2'>
                                                            <DollarSign className='h-5 w-5 text-green-600' />
                                                            Salary Details - Earning Head
                                                        </span>
                                                        <Button type='button' onClick={addEarningDetail} size='sm'>
                                                            <Plus className='h-4 w-4' />
                                                            Add
                                                        </Button>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='space-y-4'>
                                                        {earningDetails.map((earning, index) => (
                                                            <div key={index} className='grid grid-cols-6 gap-2 rounded border p-3'>
                                                                <div>
                                                                    <span className='font-medium text-xs'>Earning Head</span>
                                                                    <Select
                                                                        onValueChange={(value) =>
                                                                            updateEarningDetail(index, 'earningHead', value)
                                                                        }>
                                                                        <SelectTrigger className='h-8'>
                                                                            <SelectValue placeholder='Select' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value='Basic Pay'>Basic Pay</SelectItem>
                                                                            <SelectItem value='HRA'>HRA</SelectItem>
                                                                            <SelectItem value='Local Conveyance'>
                                                                                Local Conveyance
                                                                            </SelectItem>
                                                                            <SelectItem value='Medical Allowance'>
                                                                                Medical Allowance
                                                                            </SelectItem>
                                                                            <SelectItem value='Special Allowance'>
                                                                                Special Allowance
                                                                            </SelectItem>
                                                                            <SelectItem value='Conveyance Allowance'>
                                                                                Conveyance Allowance
                                                                            </SelectItem>
                                                                            <SelectItem value='Mobile Allowance'>
                                                                                Mobile Allowance
                                                                            </SelectItem>
                                                                            <SelectItem value='CCA'>CCA</SelectItem>
                                                                            <SelectItem value='LTA'>LTA</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div>
                                                                    <span className='font-medium text-xs'>Amount %</span>
                                                                    <InputText
                                                                        type='number'
                                                                        className='h-8'
                                                                        value={earning.percentage}
                                                                        onChange={(e) =>
                                                                            updateEarningDetail(
                                                                                index,
                                                                                'percentage',
                                                                                Number.parseFloat(e.target.value) || 0
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <span className='font-medium text-xs'>% Applicable</span>
                                                                    <InputText
                                                                        className='h-8'
                                                                        value={earning.applicability}
                                                                        onChange={(e) =>
                                                                            updateEarningDetail(index, 'applicability', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <span className='font-medium text-xs'>Amount</span>
                                                                    <InputText
                                                                        type='number'
                                                                        className='h-8'
                                                                        value={earning.amount}
                                                                        onChange={(e) =>
                                                                            updateEarningDetail(
                                                                                index,
                                                                                'amount',
                                                                                Number.parseFloat(e.target.value) || 0
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <span className='font-medium text-xs'>Remarks</span>
                                                                    <InputText
                                                                        className='h-8'
                                                                        value={earning.remarks}
                                                                        onChange={(e) =>
                                                                            updateEarningDetail(index, 'remarks', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className='flex items-end'>
                                                                    <Button
                                                                        type='button'
                                                                        variant='outline'
                                                                        size='sm'
                                                                        className='h-8 text-red-600'
                                                                        onClick={() => removeEarningDetail(index)}>
                                                                        <Trash2 className='h-4 w-4' />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {earningDetails.length === 0 && (
                                                            <div className='py-4 text-center text-gray-500'>
                                                                No earning details added. Click "Add" to add earning heads.
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            {/* Salary Details - Deduction Head */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className='flex items-center justify-between'>
                                                        <span className='flex items-center gap-2'>
                                                            <DollarSign className='h-5 w-5 text-red-600' />
                                                            Salary Details - Deduction Head
                                                        </span>
                                                        <Button type='button' onClick={addDeductionDetail} size='sm'>
                                                            <Plus className='h-4 w-4' />
                                                            Add
                                                        </Button>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className='space-y-4'>
                                                        {deductionDetails.map((deduction, index) => (
                                                            <div key={index} className='grid grid-cols-6 gap-2 rounded border p-3'>
                                                                <div>
                                                                    <span className='font-medium text-xs'>Deduction Head</span>
                                                                    <Select
                                                                        onValueChange={(value) =>
                                                                            updateDeductionDetail(index, 'deductionHead', value)
                                                                        }>
                                                                        <SelectTrigger className='h-8'>
                                                                            <SelectValue placeholder='Select' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value='EPF'>EPF</SelectItem>
                                                                            <SelectItem value='ESI'>ESI</SelectItem>
                                                                            <SelectItem value='Professional Tax'>
                                                                                Professional Tax
                                                                            </SelectItem>
                                                                            <SelectItem value='TDS'>TDS</SelectItem>
                                                                            <SelectItem value='Other'>Other</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div>
                                                                    <span className='font-medium text-xs'>Amount %</span>
                                                                    <InputText
                                                                        type='number'
                                                                        className='h-8'
                                                                        value={deduction.percentage}
                                                                        onChange={(e) =>
                                                                            updateDeductionDetail(
                                                                                index,
                                                                                'percentage',
                                                                                Number.parseFloat(e.target.value) || 0
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <span className='font-medium text-xs'>% Applicable</span>
                                                                    <InputText
                                                                        className='h-8'
                                                                        value={deduction.applicability}
                                                                        onChange={(e) =>
                                                                            updateDeductionDetail(index, 'applicability', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <span className='font-medium text-xs'>Amount</span>
                                                                    <InputText
                                                                        type='number'
                                                                        className='h-8'
                                                                        value={deduction.amount}
                                                                        onChange={(e) =>
                                                                            updateDeductionDetail(
                                                                                index,
                                                                                'amount',
                                                                                Number.parseFloat(e.target.value) || 0
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <span className='font-medium text-xs'>Remarks</span>
                                                                    <InputText
                                                                        className='h-8'
                                                                        value={deduction.remarks}
                                                                        onChange={(e) =>
                                                                            updateDeductionDetail(index, 'remarks', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className='flex items-end'>
                                                                    <Button
                                                                        type='button'
                                                                        variant='outline'
                                                                        size='sm'
                                                                        className='h-8 text-red-600'
                                                                        onClick={() => removeDeductionDetail(index)}>
                                                                        <Trash2 className='h-4 w-4' />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {deductionDetails.length === 0 && (
                                                            <div className='py-4 text-center text-gray-500'>
                                                                No deduction details added. Click "Add" to add deduction heads.
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>
                                    {/* Letter Generation Tab */}
                                    <TabsContent value='letter-generation' className='space-y-6'>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className='flex items-center gap-2'>
                                                    <FileText className='h-5 w-5' />
                                                    Document Submitted Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                                    {/* First Document Name */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            First Document Name <span className='text-red-500'>*</span>
                                                        </span>
                                                        <InputText
                                                            placeholder='Offer Letter'
                                                            {...register('firstDocumentName', {
                                                                required: 'First document name is required'
                                                            })}
                                                            error={errors.firstDocumentName?.message}
                                                        />
                                                    </div>
                                                    {/* Second Document Name */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Second Document Name <span className='text-red-500'>*</span>
                                                        </span>
                                                        <InputText
                                                            placeholder='Offer letter'
                                                            {...register('secondDocumentName', {
                                                                required: 'Second document name is required'
                                                            })}
                                                            error={errors.secondDocumentName?.message}
                                                        />
                                                    </div>
                                                    {/* First Document Date */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            First Document Date <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Controller
                                                            control={control}
                                                            name='firstDocumentDate'
                                                            rules={{ required: 'First document date is required' }}
                                                            render={({ field }) => (
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant='outline'
                                                                            className={cn(
                                                                                'w-full justify-start text-left font-normal',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}>
                                                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                                                            {field.value
                                                                                ? format(field.value, 'dd-MM-yyyy')
                                                                                : 'Select Date'}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className='w-auto p-0' align='start'>
                                                                        <DatePickerWithYear
                                                                            mode='single'
                                                                            selected={field.value}
                                                                            onDayClick={(day) => field.onChange(day)}
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            )}
                                                        />
                                                        {errors.firstDocumentDate && (
                                                            <FormError>{errors.firstDocumentDate.message}</FormError>
                                                        )}
                                                    </div>
                                                    {/* Second Document Date */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Second Document Date <span className='text-red-500'>*</span>
                                                        </span>
                                                        <Controller
                                                            control={control}
                                                            name='secondDocumentDate'
                                                            rules={{ required: 'Second document date is required' }}
                                                            render={({ field }) => (
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant='outline'
                                                                            className={cn(
                                                                                'w-full justify-start text-left font-normal',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}>
                                                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                                                            {field.value
                                                                                ? format(field.value, 'dd-MM-yyyy')
                                                                                : 'Select Date'}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className='w-auto p-0' align='start'>
                                                                        <DatePickerWithYear
                                                                            mode='single'
                                                                            selected={field.value}
                                                                            onDayClick={(day) => field.onChange(day)}
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            )}
                                                        />
                                                        {errors.secondDocumentDate && (
                                                            <FormError>{errors.secondDocumentDate.message}</FormError>
                                                        )}
                                                    </div>
                                                    {/* Appointment Ref No */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Appointment Ref. No. <span className='text-red-500'>*</span>
                                                        </span>
                                                        <InputText
                                                            placeholder='111'
                                                            {...register('appointmentRefNo', {
                                                                required: 'Appointment ref no is required'
                                                            })}
                                                            error={errors.appointmentRefNo?.message}
                                                        />
                                                    </div>
                                                    {/* Acknowledgment Ref No */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Acknowledgment Ref. No. <span className='text-red-500'>*</span>
                                                        </span>
                                                        <InputText
                                                            placeholder='111'
                                                            {...register('acknowledgmentRefNo', {
                                                                required: 'Acknowledgment ref no is required'
                                                            })}
                                                            error={errors.acknowledgmentRefNo?.message}
                                                        />
                                                    </div>
                                                    {/* Annual CTC */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Annual CTC <span className='text-red-500'>*</span>
                                                        </span>
                                                        <InputText
                                                            type='number'
                                                            placeholder='120000'
                                                            {...register('annualCTC', { required: 'Annual CTC is required' })}
                                                            error={errors.annualCTC?.message}
                                                        />
                                                    </div>
                                                    {/* Monthly CTC */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Monthly CTC <span className='text-red-500'>*</span>
                                                        </span>
                                                        <InputText
                                                            type='number'
                                                            placeholder='10000'
                                                            {...register('monthlyCTC', { required: 'Monthly CTC is required' })}
                                                            error={errors.monthlyCTC?.message}
                                                        />
                                                    </div>
                                                    {/* Company Owner Name */}
                                                    <div className='space-y-2'>
                                                        <span className='font-medium text-gray-700 text-sm'>
                                                            Company Owner Name <span className='text-red-500'>*</span>
                                                        </span>
                                                        <InputText
                                                            placeholder='Mr.Govindaswami M'
                                                            {...register('companyOwnerName', {
                                                                required: 'Company owner name is required'
                                                            })}
                                                            error={errors.companyOwnerName?.message}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Send Welcome Notification */}
                                                <div className='mt-6'>
                                                    <div className='flex items-center space-x-2'>
                                                        <Checkbox id='sendWelcomeNotification' {...register('sendWelcomeNotification')} />
                                                        <label
                                                            htmlFor='sendWelcomeNotification'
                                                            className='font-medium text-gray-700 text-sm'>
                                                            Send Welcome Notification !
                                                        </label>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                                {/* Form Actions */}
                                <div className='flex justify-center gap-4 border-t pt-6'>
                                    <Button type='button' variant='outline' onClick={handleClear}>
                                        <X className='mr-2 h-4 w-4' />
                                        Clear
                                    </Button>
                                    <Button type='submit' disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <div className='flex items-center'>
                                                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                                                Saving...
                                            </div>
                                        ) : (
                                            <div className='flex items-center'>
                                                <Save className='mr-2 h-4 w-4' />
                                                {editingLetter ? 'Update Letter' : 'Save & Proceed'}
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </div>
    );
}
interface AppointmentLetterTableProps {
    letters: AppointmentLetter[];
    isLoading: boolean;
    onEdit: (letter: AppointmentLetter) => void;
    onDelete: (letter: AppointmentLetter) => void;
    onGenerateLetter: (letter: AppointmentLetter, type: string) => void;
    getCandidateName: (candidateId: number) => string;
}
function AppointmentLetterTable({
    letters,
    isLoading,
    onEdit,
    onDelete,
    onGenerateLetter,
    getCandidateName: _getCandidateName
}: AppointmentLetterTableProps) {
    const letterColumns: ColumnDef<AppointmentLetter>[] = [
        {
            id: 'serialNumber',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        {
            accessorKey: 'candidateName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Candidate Name' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('candidateName')}</div>
        },
        {
            accessorKey: 'designation',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Designation' />,
            cell: ({ row }) => <div>{row.getValue('designation')}</div>
        },
        {
            accessorKey: 'department',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
            cell: ({ row }) => <div>{row.getValue('department')}</div>
        },
        {
            accessorKey: 'dateOfJoining',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Joining Date' />,
            cell: ({ row }) => <div>{new Date(row.getValue('dateOfJoining')).toLocaleDateString()}</div>
        },
        {
            accessorKey: 'annualCTC',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Annual CTC' />,
            cell: ({ row }) => <div>₹{(row.getValue('annualCTC') as number).toLocaleString()}</div>
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const statusColors = {
                    Draft: 'bg-yellow-100 text-yellow-800',
                    Generated: 'bg-blue-100 text-blue-800',
                    Sent: 'bg-green-100 text-green-800',
                    Acknowledged: 'bg-purple-100 text-purple-800'
                };
                return <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const letter = row.original;
                return (
                    <div className='flex flex-wrap items-center gap-1'>
                        <Button variant='outline' size='sm' onClick={() => onEdit(letter)} className='text-blue-600 hover:text-blue-800'>
                            <Edit className='h-3 w-3' />
                        </Button>
                        <Button variant='outline' size='sm' onClick={() => onDelete(letter)} className='text-red-600 hover:text-red-800'>
                            <Trash2 className='h-3 w-3' />
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onGenerateLetter(letter, 'Appointment Letter')}
                            className='text-green-600 hover:text-green-800'>
                            Appointment Letter
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onGenerateLetter(letter, 'Salary Statement')}
                            className='text-purple-600 hover:text-purple-800'>
                            Salary Statement
                        </Button>
                    </div>
                );
            }
        }
    ];
    return (
        <GenericDataTable isLoading={isLoading} columns={letterColumns} data={letters} totalItems={letters.length} showViewOptions={true} />
    );
}
