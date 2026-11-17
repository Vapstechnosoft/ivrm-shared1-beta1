'use client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Printer, User, X } from 'lucide-react';
interface EmployeeProfileData {
    EmployeeCode: string;
    EmployeeName: string;
    Designation: string;
    InstitutionName: string;
    InstitutionAddress?: string;
    InstitutionCity?: string;
    InstitutionPincode?: string;
    ContactDetails: string[];
    EmailId: string;
    JoinDate: string;
    LeftDate: string;
    TotalServiceDays: number;
    BloodGroup: string;
    Address: string;
    Age: string | number;
    Religion: string;
    DOB: string;
    AadharCardNumber: string;
    FatherName: string;
    ProfilePhoto?: string;
}
interface ReportTemplateProps {
    schoolName?: string;
    schoolAddress?: string;
    employeeData: EmployeeProfileData | null;
    isLoading?: boolean;
    onPrint: () => void;
    onCancel: () => void;
}
export function EmployeeProfileReportTemplate({
    schoolName = '',
    schoolAddress = '',
    employeeData,
    isLoading = false,
    onPrint,
    onCancel
}: ReportTemplateProps) {
    // Format date to dd-MM-yyyy
    const formatDate = (dateString?: string) => {
        if (!dateString || dateString === '-') return '-';
        try {
            const date = new Date(dateString);
            if (Number.isNaN(date.getTime())) return '-';
            return format(date, 'dd-MM-yyyy');
        } catch {
            return '-';
        }
    };
    // Format contact details
    const formatContactDetails = (contacts: string[]): string => {
        if (!contacts || contacts.length === 0) return '-';
        return contacts.filter((c) => c && c.trim() !== '').join(', ');
    };
    return (
        <div className='mx-auto w-full max-w-[1000px] bg-white p-6 print:p-4'>
            {/* Report Header */}
            <div className='mb-6 space-y-1 border-gray-300 border-b pb-4 text-center'>
                <h1 className='mb-2 font-bold text-2xl text-gray-900'>{schoolName || 'Institution Name'}</h1>
                {schoolAddress && <div className='text-gray-600 text-sm'>{schoolAddress}</div>}
                <p className='mt-2 font-semibold text-gray-800'>EMPLOYEE PROFILE REPORT</p>
            </div>
            {/* Employee Details */}
            {isLoading ? (
                <div className='py-12 text-center text-gray-500'>Loading employee profile...</div>
            ) : employeeData ? (
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Details Grid - Left Column */}
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Employee Code:</p>
                                <p className='text-sm'>{employeeData.EmployeeCode || '-'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Name of Employee:</p>
                                <p className='text-sm'>{employeeData.EmployeeName || '-'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Designation:</p>
                                <p className='text-sm'>{employeeData.Designation || '-'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Institution Name:</p>
                                <p className='text-sm'>{employeeData.InstitutionName || '-'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Contact Details:</p>
                                <p className='text-sm'>{formatContactDetails(employeeData.ContactDetails)}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Email-Id:</p>
                                <p className='text-sm'>{employeeData.EmailId || '-'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Join Date:</p>
                                <p className='text-sm'>{formatDate(employeeData.JoinDate)}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Left Date:</p>
                                <p className='text-sm'>{formatDate(employeeData.LeftDate)}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Total no. Of Service:</p>
                                <p className='text-sm'>
                                    {employeeData.TotalServiceDays && employeeData.TotalServiceDays > 0
                                        ? `${employeeData.TotalServiceDays} Days`
                                        : '-'}
                                </p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Blood Group:</p>
                                <p className='text-sm'>{employeeData.BloodGroup || '-'}</p>
                            </div>
                            <div className='col-span-2 space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Address:</p>
                                <p className='text-sm'>{employeeData.Address || '-'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Age:</p>
                                <p className='text-sm'>{employeeData.Age || '-'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Religion:</p>
                                <p className='text-sm'>{employeeData.Religion || '-'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>DOB:</p>
                                <p className='text-sm'>{formatDate(employeeData.DOB)}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>AdharCard Number:</p>
                                <p className='text-sm'>{employeeData.AadharCardNumber || '-'}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Father Name:</p>
                                <p className='text-sm'>{employeeData.FatherName || '-'}</p>
                            </div>
                        </div>
                    </div>
                    {/* Photo Section - Right Column */}
                    <div className='flex flex-col items-center justify-start space-y-4'>
                        <div className='flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100'>
                            {employeeData.ProfilePhoto ? (
                                <img
                                    src={employeeData.ProfilePhoto}
                                    alt={employeeData.EmployeeName}
                                    className='h-full w-full object-cover'
                                />
                            ) : (
                                <User className='h-24 w-24 text-gray-400' />
                            )}
                        </div>
                        <p className='text-center text-muted-foreground text-sm'>Signature of Nodal Officer</p>
                    </div>
                </div>
            ) : (
                // Empty state - show template structure even without data
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Details Grid - Left Column */}
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Employee Code:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Name of Employee:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Designation:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Institution Name:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Contact Details:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Email-Id:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Join Date:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Left Date:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Total no. Of Service:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Blood Group:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='col-span-2 space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Address:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Age:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Religion:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>DOB:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>AdharCard Number:</p>
                                <p className='text-sm'>-</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>Father Name:</p>
                                <p className='text-sm'>-</p>
                            </div>
                        </div>
                    </div>
                    {/* Photo Section - Right Column */}
                    <div className='flex flex-col items-center justify-start space-y-4'>
                        <div className='flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100'>
                            <User className='h-24 w-24 text-gray-400' />
                        </div>
                        <p className='text-center text-muted-foreground text-sm'>Signature of Nodal Officer</p>
                    </div>
                </div>
            )}
            {/* Action Buttons */}
            <div className='mt-6 flex justify-end gap-3 border-gray-300 border-t pt-4 print:hidden'>
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
