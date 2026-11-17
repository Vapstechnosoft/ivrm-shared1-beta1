'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ISchoolSubjectTopicMapping } from '@/types/lesson-planner/transactions/school-subject-master-topic-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil } from 'lucide-react';
import { useCallback } from 'react';

export const SchoolSubjectTopicMappingColumns: ColumnDef<ISchoolSubjectTopicMapping>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>
    },
    // {
    //     id: 'section',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
    //     accessorFn: (row: any) => row.asmC_SectionName || row.asmS_SectionName || row.sectionName || '',
    //     cell: ({ row }) => <div>{row.getValue('section')}</div>
    // },

    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectName')}</div>
    },
    {
        accessorKey: 'lpmU_UnitName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Unit' />,
        cell: ({ row }) => <div>{row.getValue('lpmU_UnitName')}</div>
    },
    {
        accessorKey: 'lpmmT_TopicName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Main Topic' />,
        cell: ({ row }) => <div>{row.getValue('lpmmT_TopicName')}</div>
    },
    {
        accessorKey: 'lpmT_TopicName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Topic Name' />,
        cell: ({ row }) => <div>{row.getValue('lpmT_TopicName')}</div>
    },
    {
        accessorKey: 'lpmT_LessonPlan',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: ({ row }) => <div>{row.getValue('lpmT_LessonPlan')}</div>
    },
    {
        accessorKey: 'lpmT_TotalHrs',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Hours' />,
        cell: ({ row }) => <div>{row.getValue('lpmT_TotalHrs')}</div>
    },
    {
        accessorKey: 'lpmT_TotalPeriods',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Periods' />,
        cell: ({ row }) => <div>{row.getValue('lpmT_TotalPeriods')}</div>
    },
    {
        id: 'teacherGuide',
        header: ({ column }) => <DataTableColumnHeader column={column} title='T-Guide' />,
        cell: ({ row }) => <ViewFileCell rowData={row.original} type='Teacher Guide' />
    },
    {
        id: 'studentGuide',
        header: ({ column }) => <DataTableColumnHeader column={column} title='S-Guide' />,
        cell: ({ row }) => <ViewFileCell rowData={row.original} type='Student Guide' />
    },
    {
        id: 'materials',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Materials' />,
        cell: ({ row }) => <ViewFileCell rowData={row.original} type='Materials Needed' />
    },
    {
        id: 'reference',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reference' />,
        cell: ({ row }) => <ViewFileCell rowData={row.original} type='References' />
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: ISchoolSubjectTopicMapping }) {
    const { openEditForm, openToggleForm } = useFormContext<ISchoolSubjectTopicMapping>();

    const handleEdit = useCallback(
        (data: ISchoolSubjectTopicMapping) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: ISchoolSubjectTopicMapping) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <div className='flex items-center justify-center gap-2'>
            <Button variant='ghost' size='icon' onClick={() => handleEdit(rowData)} title='Edit'>
                <Pencil className='h-4 w-4 text-primary' />
            </Button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: true, delete: false }}
                onToggle={handleToggle}
                toggleConditionKey='lpmT_ActiveFlag'
            />
        </div>
    );
}

function ViewFileCell({ rowData, type }: { rowData: ISchoolSubjectTopicMapping; type: string }) {
    // Custom logic to trigger view file modal can be added here
    // Utilizing a context or prop drill to open the view file modal would be ideal
    // For now, we'll placeholder it as a button that will need to interact with the parent

    // We can emit a custom event or use a global store, or simpler: just expose a handler via context?
    // Given the architecture, we likely need to add a 'viewFile' method to our FormContext or similar.
    // Or just dispatch a custom event.

    return (
        <Button
            variant='ghost'
            size='icon'
            className='text-blue-500'
            onClick={() => document.dispatchEvent(new CustomEvent('view-files', { detail: { row: rowData, type } }))}>
            <Eye className='h-4 w-4' />
        </Button>
    );
}
