'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export interface EarningDetail {
    id: number;
    earningHead: string;
    amount: number;
    percentage: number;
}
export interface DeductionDetail {
    id: number;
    deductionHead: string;
    amount: number;
    percentage: number;
}
export interface AppointmentLetter {
    id: number;
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
    createdAt: string;
}
interface AppointmentLetterColumnsProps {
    onEdit: (row: AppointmentLetter) => void;
    onDelete: (row: AppointmentLetter) => void;
}
export const getAppointmentLetterColumns = ({ onEdit, onDelete }: AppointmentLetterColumnsProps): ColumnDef<AppointmentLetter>[] => [
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' />,
        cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
        enableSorting: false
    },
    // TODO: Add other columns based on the entity fields
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const entity = row.original;
            return (
                <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' onClick={() => onEdit(entity)}>
                        <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='sm' className='text-red-600' onClick={() => onDelete(entity)}>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            );
        }
    }
];
