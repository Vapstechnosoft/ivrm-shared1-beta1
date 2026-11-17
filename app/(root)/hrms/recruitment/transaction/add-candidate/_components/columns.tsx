'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
export interface QualificationDetail {
    id: number;
    qualification: string;
    board: string;
    year: string;
    percentage: string;
}
export interface ExperienceDetail {
    id: number;
    company: string;
    designation: string;
    from: string;
    to: string;
    experience: string;
}
export interface FamilyDetail {
    id: number;
    name: string;
    relation: string;
    occupation: string;
    contactNo: string;
}
export interface LanguageDetail {
    id: number;
    language: string;
    read: boolean;
    write: boolean;
    speak: boolean;
}
export interface DocumentDetail {
    id: number;
    documentType: string;
    fileName: string;
    filePath: string;
}
export interface Candidate {
    id: number;
    // Personal Details
    firstName: string;
    middleName?: string;
    lastName: string;
    skill: string;
    mobileNo: string;
    emailId: string;
    qualification: string;
    jobTitle: string;
    currentCompany?: string;
    totalExp: string;
    lastCTC: string;
    expectedCTC: string;
    applicationDate: string;
    interviewDate: string;
    dateOfBirth: string;
    // Additional Details
    nationality: string;
    religion: string;
    caste: string;
    gender: string;
    maritalStatus: string;
    bloodGroup: string;
    positionType: string;
    position: string;
    aadharNo?: string;
    panCardNo?: string;
    refHR?: string;
    source?: string;
    remark?: string;
    consultency?: string;
    resumeCV?: string;
    // Address
    localAddressLine1: string;
    localAddressLine2?: string;
    localPlace: string;
    localPincode: string;
    permanentAddressLine1: string;
    permanentAddressLine2?: string;
    permanentPlace: string;
    permanentPincode: string;
    sameAsLocalAddress: boolean;
    // Qualifications
    qualifications: QualificationDetail[];
    // Experience
    experiences: ExperienceDetail[];
    // Family
    familyMembers: FamilyDetail[];
    // Languages
    languages: LanguageDetail[];
    // Documents
    documents: DocumentDetail[];
    status: string;
    createdAt: string;
}
interface CandidateColumnsProps {
    onEdit: (row: Candidate) => void;
    onDelete: (row: Candidate) => void;
}
export const getCandidateColumns = ({ onEdit, onDelete }: CandidateColumnsProps): ColumnDef<Candidate>[] => [
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' />,
        cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'firstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Candidate Name' />,
        cell: ({ row }) => {
            const candidate = row.original;
            return <div className='font-medium'>{`${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.trim()}</div>;
        }
    },
    {
        accessorKey: 'applicationDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date Of Application' />,
        cell: ({ row }) => <div>{new Date(row.getValue('applicationDate')).toLocaleDateString()}</div>
    },
    {
        accessorKey: 'jobTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Applied Position' />,
        cell: ({ row }) => <div>{row.getValue('jobTitle')}</div>
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => <div>{row.getValue('status')}</div>
    },
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
export const candidateColumns = getCandidateColumns({
    onEdit: () => {},
    onDelete: () => {}
});
