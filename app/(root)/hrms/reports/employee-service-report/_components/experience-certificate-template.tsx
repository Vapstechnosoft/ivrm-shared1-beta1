'use client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Printer, X } from 'lucide-react';
interface EmployeeData {
    employeeName: string;
    employeeCode?: string;
    designation: string;
    department?: string;
    dateOfJoining: string;
    employmentType?: 'Permanent' | 'Probationary';
    gender?: 'Male' | 'Female' | 'Other';
}
interface ExperienceCertificateTemplateProps {
    employeeData: EmployeeData | null;
    currentDate: Date;
    signatoryName?: string;
    signatoryDesignation?: string;
    isLoading?: boolean;
    onPrint: () => void;
    onCancel: () => void;
}
export function ExperienceCertificateTemplate({
    employeeData,
    currentDate,
    signatoryName = 'Signatory Name',
    signatoryDesignation = 'Signatory Designation',
    isLoading = false,
    onPrint,
    onCancel
}: ExperienceCertificateTemplateProps) {
    // Format date
    const formattedDate = format(currentDate, 'dd-MM-yyyy');
    const formattedJoiningDate = employeeData?.dateOfJoining ? format(new Date(employeeData.dateOfJoining), 'dd-MM-yyyy') : '';
    // Determine title (Mr/Ms/Mrs) - with space after
    const getTitle = () => {
        if (!employeeData?.gender) return 'Mr/Ms.';
        if (employeeData.gender === 'Female') return 'Ms.';
        return 'Mr.';
    };
    // Determine employment type text
    const getEmploymentType = () => {
        if (employeeData?.employmentType === 'Permanent') return 'Permanent';
        if (employeeData?.employmentType === 'Probationary') return 'Probationary';
        return 'Permanent/Probationary';
    };
    if (isLoading) {
        return (
            <div className='mx-auto w-full max-w-[800px] bg-white p-8 print:p-6'>
                <div className='flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-12 text-center text-gray-500'>
                    Loading experience certificate...
                </div>
            </div>
        );
    }
    // Always show template structure, even without data
    if (!employeeData) {
        return (
            <div className='mx-auto w-full max-w-[800px] bg-white p-8 print:p-6'>
                {/* Date - Right Aligned */}
                <div className='mb-6 text-right'>
                    <p className='font-medium text-gray-700 text-sm'>DATE: {formattedDate}</p>
                </div>
                {/* Heading - Centered */}
                <div className='mb-8 text-center'>
                    <h1 className='font-bold text-blue-600 text-xl uppercase'>TO WHOMSOEVER IT MAY CONCERN</h1>
                </div>
                {/* Body Text - Empty State */}
                <div className='mb-8 space-y-4 text-justify'>
                    <p className='text-base text-gray-800 leading-relaxed'>
                        This is to certify that <strong>Mr/Ms. -</strong> is a <strong>Permanent/Probationary</strong> employee of Our
                        Institution working as a <strong>-</strong>.
                    </p>
                </div>
                {/* Signatory - Left Aligned */}
                <div className='mt-16 space-y-1 text-left'>
                    <p className='font-medium text-gray-800 text-sm'>{signatoryName}</p>
                    <p className='font-semibold text-gray-900 text-sm uppercase'>{signatoryDesignation}</p>
                </div>
                {/* Action Buttons */}
                <div className='mt-8 flex justify-end gap-3 print:hidden'>
                    <Button variant='outline' onClick={onCancel} prefix={<X className='size-4' />}>
                        CANCEL
                    </Button>
                    <Button variant='outline' onClick={onPrint} prefix={<Printer className='size-4' />}>
                        PRINT
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div className='mx-auto w-full max-w-[800px] bg-white p-8 print:p-6'>
            {/* Date - Right Aligned */}
            <div className='mb-6 text-right'>
                <p className='font-medium text-gray-700 text-sm'>DATE: {formattedDate}</p>
            </div>
            {/* Heading - Centered */}
            <div className='mb-8 text-center'>
                <h1 className='font-bold text-blue-600 text-xl uppercase'>TO WHOMSOEVER IT MAY CONCERN</h1>
            </div>
            {/* Body Text */}
            <div className='mb-8 space-y-4 text-justify'>
                <p className='text-base text-gray-800 leading-relaxed'>
                    This is to certify that{' '}
                    <strong>
                        {getTitle()} {employeeData.employeeName}
                    </strong>{' '}
                    is a <strong>{getEmploymentType()}</strong> employee of Our Institution working as a{' '}
                    <strong>{employeeData.designation}</strong>
                    {formattedJoiningDate && ` since ${formattedJoiningDate}`}.
                </p>
            </div>
            {/* Signatory - Left Aligned */}
            <div className='mt-16 space-y-1 text-left'>
                <p className='font-medium text-gray-800 text-sm'>{signatoryName}</p>
                <p className='font-semibold text-gray-900 text-sm uppercase'>{signatoryDesignation}</p>
            </div>
            {/* Action Buttons */}
            <div className='mt-8 flex justify-end gap-3 print:hidden'>
                <Button variant='outline' onClick={onCancel} prefix={<X className='size-4' />}>
                    CANCEL
                </Button>
                <Button variant='outline' onClick={onPrint} prefix={<Printer className='size-4' />}>
                    PRINT
                </Button>
            </div>
        </div>
    );
}
