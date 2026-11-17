'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import type { IStudentFeedbackList } from '@/types/student-portal/masters/attendance-details';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const studentFeedBackColumns: ColumnDef<IStudentFeedbackList>[] = [
    {
        accessorKey: 'lmaL_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;

            return <div className='w-full pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'asgfE_FeedBack',
        header: ({ column }) => <DataTableColumnHeader column={column} title='FeedBack' />,
        cell: ({ row }) => <div>{row.getValue('asgfE_FeedBack')}</div>
    },
    {
        accessorKey: 'asgfE_FeedbackDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Feedback Date' />,
        cell: ({ row }) => {
            const dateValue = row.getValue('asgfE_FeedbackDate');
            if (!dateValue) return <div>-</div>;

            try {
                const formatted = format(new Date(dateValue as string | number | Date), 'MM/dd/yyyy hh:mma');
                return <div>{formatted}</div>;
            } catch (error) {
                return <div>{String(dateValue)}</div>;
            }
        }
    }
];

function ActionButtonsCell({ rowData }: { rowData: IStudentFeedbackList }) {
    return <ActionButtons rowData={rowData} buttons={{ edit: true, toggle: true, delete: false }} toggleConditionKey='lmaL_ActiveFlag' />;
}
