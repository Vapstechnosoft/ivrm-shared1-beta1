'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart3, Printer, X } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
const candidateReportSchema = z.object({
    institution: z.string().min(1, 'Institution is required'),
    candidateId: z.string().min(1, 'Candidate Name is required')
});
type FormFields = z.infer<typeof candidateReportSchema>;
interface CandidateReportFormProps {
    onGenerateReport?: (filters: FormFields) => void;
    isLoading?: boolean;
    className?: string;
}
// Mock data - replace with actual API calls
const institutions = ['Global Quality Training & Assessors PVT LTD', 'VAPS Technologies', 'ANI Technologies'];
const candidates = [
    { id: '1', name: 'Uma Mageshwari' },
    { id: '2', name: 'John Doe' },
    { id: '3', name: 'Jane Smith' }
];
export default function CandidateReportForm({ onGenerateReport, isLoading = false, className = '' }: CandidateReportFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(candidateReportSchema),
        mode: 'onChange'
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
    const handlePrint = () => {
        window.print();
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4 ${className}`}>
            <div className='flex flex-col gap-5'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Institution */}
                    <div className='space-y-2'>
                        <label className='block font-medium text-sm'>
                            Institution:<span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='institution'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {institutions.map((institution) => (
                                            <SelectItem key={institution} value={institution}>
                                                {institution}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.institution && <FormError>{errors.institution.message}</FormError>}
                    </div>
                    {/* Candidate Name */}
                    <div className='space-y-2'>
                        <label className='block font-medium text-sm'>
                            Candidate Name:<span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='candidateId'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {candidates.map((candidate) => (
                                            <SelectItem key={candidate.id} value={candidate.id}>
                                                {candidate.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.candidateId && <FormError>{errors.candidateId.message}</FormError>}
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex flex-row items-center justify-center gap-2 border-t pt-4'>
                <Button type='submit' isLoading={isSubmitting || isLoading} className='bg-orange-500 text-white hover:bg-orange-600'>
                    <BarChart3 className='mr-2 h-4 w-4' />
                    REPORT
                </Button>
                <Button type='button' variant='outline' onClick={() => window.location.reload()} disabled={isSubmitting || isLoading}>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
                <Button type='button' variant='outline' onClick={handlePrint} disabled={isSubmitting || isLoading}>
                    <Printer className='mr-2 h-4 w-4' />
                    PRINT
                </Button>
            </div>
        </form>
    );
}
