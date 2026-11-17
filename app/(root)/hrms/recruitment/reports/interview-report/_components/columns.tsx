'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
export interface InterviewRecord {
    id: number;
    candidateName: string;
    interviewRound: string;
    interviewerName: string;
    interviewDate: string;
    interviewVenue: string;
    interviewFeedback: string;
    candidateStatus: 'Short Listed' | 'Selected' | 'Rejected' | 'In Progress';
    createdAt: string;
}
interface InterviewRecordColumnsProps {
    onEdit?: (row: InterviewRecord) => void;
    onDelete?: (row: InterviewRecord) => void;
}
export const getInterviewRecordColumns = ({ onEdit, onDelete }: InterviewRecordColumnsProps = {}): ColumnDef<InterviewRecord>[] => [
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL. No.' />,
        cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'candidateName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Candidate Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('candidateName')}</div>
    },
    {
        accessorKey: 'interviewRound',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Round' />,
        cell: ({ row }) => <div>{row.getValue('interviewRound')}</div>
    },
    {
        accessorKey: 'interviewerName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Interviewer Name' />,
        cell: ({ row }) => <div>{row.getValue('interviewerName')}</div>
    },
    {
        accessorKey: 'interviewDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Date' />,
        cell: ({ row }) => {
            const date = row.getValue('interviewDate') as string;
            // Format date as DD-MM-YYYY to match image format
            if (date) {
                const d = new Date(date);
                return <div>{d.toLocaleDateString('en-GB')}</div>;
            }
            return <div>-</div>;
        }
    },
    {
        accessorKey: 'interviewVenue',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Venue' />,
        cell: ({ row }) => <div>{row.getValue('interviewVenue')}</div>
    },
    {
        accessorKey: 'interviewFeedback',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Feedback' />,
        cell: ({ row }) => <div>{row.getValue('interviewFeedback')}</div>
    },
    {
        accessorKey: 'candidateStatus',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Candidate Status' />,
        cell: ({ row }) => <div>{row.getValue('candidateStatus')}</div>
    }
];
export const interviewReportColumns = getInterviewRecordColumns();
