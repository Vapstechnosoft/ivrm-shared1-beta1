'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart3, FileSpreadsheet, Printer } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
const interviewReportSchema = z.object({
    fromDate: z.string().min(1, 'From Date is required'),
    toDate: z.string().min(1, 'To Date is required'),
    status: z.string().min(1, 'Status is required'),
    interviewRound: z.string().min(1, 'Interview Round is required'),
    grade: z.string().optional()
});
type FormFields = z.infer<typeof interviewReportSchema>;
interface InterviewReportFormProps {
    onGenerateReport?: (filters: FormFields) => void;
    className?: string;
}
export default function InterviewReportForm({ onGenerateReport, className = '' }: InterviewReportFormProps) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(interviewReportSchema),
        mode: 'onChange',
        defaultValues: {
            status: 'All',
            interviewRound: 'All',
            grade: 'All'
        }
    });
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // Call the parent handler to generate report
            onGenerateReport?.(data);
            toast.success('Report generated successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate report');
        }
    };
    const handleExportToExcel = () => {
        // TODO: Implement Excel export
        toast.info('Exporting to Excel...');
    };
    const handlePrint = () => {
        window.print();
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4 ${className}`}>
            <div className='flex flex-col gap-5'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Left Column */}
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                From Date:<span className='text-red-500'>*</span>
                            </label>
                            <div className='relative'>
                                <InputText
                                    type='date'
                                    placeholder='Enter date'
                                    {...register('fromDate')}
                                    error={errors.fromDate?.message}
                                />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>Status:</label>
                            <Controller
                                name='status'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className='rounded-md border bg-gray-50 p-4'>
                                        <div className='flex flex-col gap-3'>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='All' id='all' />
                                                <label htmlFor='all' className='cursor-pointer font-normal text-sm'>
                                                    All
                                                </label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='UpComing' id='upcoming' />
                                                <label htmlFor='upcoming' className='cursor-pointer font-normal text-sm'>
                                                    UpComing
                                                </label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='InProgress' id='inprogress' />
                                                <label htmlFor='inprogress' className='cursor-pointer font-normal text-sm'>
                                                    InProgress
                                                </label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='Completed' id='completed' />
                                                <label htmlFor='completed' className='cursor-pointer font-normal text-sm'>
                                                    Completed
                                                </label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.status && <FormError>{errors.status.message}</FormError>}
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                To Date:<span className='text-red-500'>*</span>
                            </label>
                            <div className='relative'>
                                <InputText type='date' placeholder='Enter date' {...register('toDate')} error={errors.toDate?.message} />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Interview Rounds:<span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='interviewRound'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--All--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='All'>--All--</SelectItem>
                                            <SelectItem value='Technical Round'>Technical Round</SelectItem>
                                            <SelectItem value='HR Round'>HR Round</SelectItem>
                                            <SelectItem value='Management Round'>Management Round</SelectItem>
                                            <SelectItem value='Technical + HR'>Technical + HR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.interviewRound && <FormError>{errors.interviewRound.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>Grade:</label>
                            <Controller
                                name='grade'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--All--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='All'>--All--</SelectItem>
                                            <SelectItem value='A'>A</SelectItem>
                                            <SelectItem value='B'>B</SelectItem>
                                            <SelectItem value='C'>C</SelectItem>
                                            <SelectItem value='D'>D</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex flex-row items-center justify-center gap-2 border-t pt-4'>
                <Button
                    type='submit'
                    isLoading={isSubmitting}
                    className='bg-orange-500 text-white hover:bg-orange-600'
                    disabled={isSubmitting}>
                    <BarChart3 className='mr-2 h-4 w-4' />
                    REPORT
                </Button>
                <Button type='button' variant='outline' onClick={handleExportToExcel} disabled={isSubmitting}>
                    <FileSpreadsheet className='mr-2 h-4 w-4' />
                    EXPORT TO EXCEL
                </Button>
                <Button type='button' variant='outline' onClick={handlePrint} disabled={isSubmitting}>
                    <Printer className='mr-2 h-4 w-4' />
                    PRINT
                </Button>
            </div>
        </form>
    );
}
