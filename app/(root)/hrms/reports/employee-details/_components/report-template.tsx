'use client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, X } from 'lucide-react';
import { useMemo } from 'react';
interface Employee {
    id: string;
    employeeCode: string;
    employeeName: string;
    fatherName: string;
    mobileNo: string;
    emailId: string;
    dateOfBirth: string;
    emergencyContactNumber: string;
    dateOfJoining: string;
    dateOfLeaving?: string;
    dateOfConfirmation?: string;
    employeeType?: string;
    groupType?: string;
    departmentName: string;
    designationName: string;
    status: 'Working' | 'Left';
    reasonForLeaving?: string;
    remarks?: string;
}
interface ReportTemplateProps {
    schoolName?: string;
    schoolAddress?: string;
    reportData: Employee[];
    selectedHeaders: string[];
    isLoading?: boolean;
    onExport: () => void;
    onCancel: () => void;
}
export function EmployeeDetailsReportTemplate({
    schoolName = '',
    schoolAddress = '',
    reportData,
    selectedHeaders,
    isLoading = false,
    onExport,
    onCancel
}: ReportTemplateProps) {
    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (Number.isNaN(date.getTime())) return '-';
            return format(date, 'dd-MM-yyyy');
        } catch {
            return '-';
        }
    };
    // Get all possible columns based on available headers - matching the exact format from the image
    const allColumns = [
        'Sl.No',
        'Employee Code',
        'Employee Name',
        'Father Name',
        'Mobile No.',
        'Email id', // Note: lowercase 'id' to match image
        'Date Of Birth',
        'Emergency Contact Number',
        'Date Of confirmation',
        'Employee Type',
        'Group Type',
        'Department',
        'Designation',
        'Status',
        'Date Of Joining',
        'Date Of Leaving',
        'Reason For Leaving',
        'Remarks'
    ];
    // Filter columns based on selected headers (always include Sl.No)
    // If no headers selected, show all standard columns to maintain table structure
    // Ensure we always have at least Sl.No column
    const visibleColumns = useMemo(() => {
        // Ensure selectedHeaders is an array
        const headers = Array.isArray(selectedHeaders) ? selectedHeaders : [];
        if (headers.length > 0) {
            // Filter out 'Sl.No' from selected headers and add it at the beginning
            const filteredHeaders = headers.filter((h) => h && h !== 'Sl.No' && h.trim() !== '');
            return ['Sl.No', ...filteredHeaders];
        }
        // Show all columns when no headers selected
        return allColumns;
    }, [selectedHeaders]);
    // Get cell value for a specific column
    const getCellValue = (employee: Employee, column: string, index: number): string => {
        if (column === 'Sl.No') {
            return String(index + 1);
        }
        switch (column) {
            case 'Employee Code':
                return employee.employeeCode || '-';
            case 'Employee Name':
                return employee.employeeName || '-';
            case 'Father Name':
                return employee.fatherName || '-';
            case 'Mobile No.':
                return employee.mobileNo || '-';
            case 'Email Id':
            case 'Email id': // Handle both cases
                return employee.emailId || '-';
            case 'Date Of Birth':
                return formatDate(employee.dateOfBirth);
            case 'Emergency Contact Number':
                return employee.emergencyContactNumber || '-';
            case 'Date Of confirmation':
                return formatDate(employee.dateOfConfirmation);
            case 'Employee Type':
                return employee.employeeType || '-';
            case 'Group Type':
                return employee.groupType || '-';
            case 'Department':
                return employee.departmentName || '-';
            case 'Designation':
                return employee.designationName || '-';
            case 'Status':
                return employee.status || '-';
            case 'Date Of Joining':
                return formatDate(employee.dateOfJoining);
            case 'Date Of Leaving':
                return formatDate(employee.dateOfLeaving);
            case 'Reason For Leaving':
                return employee.reasonForLeaving || '-';
            case 'Remarks':
                return employee.remarks || '-';
            default:
                return '-';
        }
    };
    return (
        <div className='mx-auto w-full max-w-[1600px] bg-white p-6 print:p-4'>
            {/* Report Header */}
            <div className='mb-6 text-center'>
                <h1 className='mb-2 font-bold text-2xl text-gray-900 uppercase'>EMPLOYEE DETAILS REPORT</h1>
                {schoolName && <div className='mb-1 font-semibold text-gray-800 text-lg'>{schoolName}</div>}
                {schoolAddress && <div className='text-gray-600 text-sm'>{schoolAddress}</div>}
            </div>
            {/* Report Table */}
            <div className='mb-6 overflow-x-auto'>
                {visibleColumns.length > 0 ? (
                    <table className='w-full border-collapse border border-gray-300 text-sm'>
                        <thead>
                            <tr className='bg-gray-100'>
                                {visibleColumns.map((column) => (
                                    <th
                                        key={column}
                                        className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={visibleColumns.length}
                                        className='border border-gray-300 px-4 py-8 text-center text-gray-500'>
                                        Loading employee details...
                                    </td>
                                </tr>
                            ) : reportData.length === 0 ? (
                                // Show empty row with dashes to maintain table structure
                                <tr>
                                    {visibleColumns.map((column) => (
                                        <td key={column} className='border border-gray-300 px-2 py-2 text-center'>
                                            -
                                        </td>
                                    ))}
                                </tr>
                            ) : (
                                reportData.map((employee, index) => (
                                    <tr key={employee.id || index} className='hover:bg-gray-50'>
                                        {visibleColumns.map((column) => (
                                            <td
                                                key={column}
                                                className={`border border-gray-300 px-2 py-2 ${
                                                    column === 'Sl.No' || column.includes('Date') || column === 'Status'
                                                        ? 'text-center'
                                                        : 'text-left'
                                                }`}>
                                                {getCellValue(employee, column, index)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : (
                    <div className='border border-gray-300 p-8 text-center text-gray-500'>No columns available to display</div>
                )}
            </div>
            {/* Action Buttons */}
            <div className='flex justify-end gap-3 print:hidden'>
                <Button variant='outline' onClick={onCancel} prefix={<X className='size-4' />}>
                    CANCEL
                </Button>
                <Button variant='outline' onClick={onExport} prefix={<Download className='size-4' />}>
                    EXPORT TO EXCEL
                </Button>
            </div>
        </div>
    );
}
