'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

// Interfaces for List Data
export interface IFixingDayPeriodList {
    ttfdP_Id: number;
    asmaY_Year: string;
    ttmC_CategoryName: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    staffName: string;
    ismS_SubjectName: string;
    ttmD_DayName: string;
    ttmP_PeriodName: string;
    ttfdP_ActiveFlag: boolean;
}

export interface IFixingDayStaffList {
    ttfdS_Id: number;
    asmaY_Year: string;
    staffName: string;
    ttmD_DayName: string;
    ttfdS_SUbSelcFlag: boolean;
    ttfdS_ActiveFlag: boolean;
}

export interface IFixingDaySubjectList {
    ttfdsU_Id: number;
    asmaY_Year: string;
    ismS_SubjectName: string;
    ttmD_DayName: string;
    ttfdsU_SUbSelcFlag: boolean;
    ttfdsU_ActiveFlag: boolean;
}

export interface IFixingPeriodStaffList {
    ttfpS_Id: number;
    asmaY_Year: string;
    staffName: string;
    ttmP_PeriodName: string;
    ttfpS_SUbSelcFlag: boolean;
    ttfpS_ActiveFlag: boolean;
}

export interface IFixingPeriodSubjectList {
    ttfpsU_Id: number;
    asmaY_Year: string;
    ismS_SubjectName: string;
    ttmP_PeriodName: string;
    ttfpsU_SUbSelcFlag: boolean;
    ttfpsU_ActiveFlag: boolean;
}

// --- Action Cell Components ---
function ActionButtonsCell<T>({
    rowData,
    idKey,
    toggleKey,
    showView = false
}: { rowData: T; idKey: string; toggleKey: string; showView?: boolean }) {
    const { openEditForm, openToggleForm, openDeleteForm, openDetailsView } = useFormContext<T>();

    const handleEdit = useCallback(
        (data: T) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: T) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleDelete = useCallback(
        (data: T) => {
            if (openDeleteForm) openDeleteForm(data);
        },
        [openDeleteForm]
    );

    const handleView = useCallback(
        (data: T) => {
            if (openDetailsView) openDetailsView(data);
        },
        [openDetailsView]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{
                edit: true,
                toggle: true,
                delete: true
                //view: showView
            }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={handleDelete}
            //onView={handleView}
            toggleConditionKey={toggleKey}
        />
    );
}

// --- Columns ---

// 1. Day Period
// 1. Day Period
export const dayPeriodColumns: ColumnDef<IFixingDayPeriodList>[] = [
    {
        accessorKey: 'ttfdP_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const index = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{index}</div>;
        },
        enableSorting: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ttmC_CategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmC_SectionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'staffName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Staff' />,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject' />,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ttmD_DayName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Day' />,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ttmP_PeriodName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Period' />,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row) => row,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} idKey='ttfdP_Id' toggleKey='ttfdP_ActiveFlag' showView={false} />,
        enableSorting: false,
        enableHiding: false
    }
];

// 2. Day Staff
export const dayStaffColumns: ColumnDef<IFixingDayStaffList>[] = [
    {
        accessorKey: 'ttfdS_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const index = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{index}</div>;
        },
        enableSorting: false
    },
    { accessorKey: 'asmaY_Year', header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' /> },
    { accessorKey: 'staffName', header: ({ column }) => <DataTableColumnHeader column={column} title='Staff' /> },
    { accessorKey: 'ttmD_DayName', header: ({ column }) => <DataTableColumnHeader column={column} title='Day' /> },
    {
        accessorKey: 'ttfdS_SUbSelcFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class-Section Wise' />,
        cell: ({ row }) => (row.original.ttfdS_SUbSelcFlag ? 'Yes' : 'No')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row) => row,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} idKey='ttfdS_Id' toggleKey='ttfdS_ActiveFlag' showView={true} />
    }
];

// 3. Day Subject
export const daySubjectColumns: ColumnDef<IFixingDaySubjectList>[] = [
    {
        accessorKey: 'ttfdsU_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const index = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{index}</div>;
        },
        enableSorting: false
    },
    { accessorKey: 'asmaY_Year', header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' /> },
    { accessorKey: 'ismS_SubjectName', header: ({ column }) => <DataTableColumnHeader column={column} title='Subject' /> },
    { accessorKey: 'ttmD_DayName', header: ({ column }) => <DataTableColumnHeader column={column} title='Day' /> },
    {
        accessorKey: 'ttfdsU_SUbSelcFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class-Section Wise' />,
        cell: ({ row }) => (row.original.ttfdsU_SUbSelcFlag ? 'Yes' : 'No')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row) => row,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} idKey='ttfdsU_Id' toggleKey='ttfdsU_ActiveFlag' showView={true} />
    }
];

// 4. Period Staff
export const periodStaffColumns: ColumnDef<IFixingPeriodStaffList>[] = [
    {
        accessorKey: 'ttfpS_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const index = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{index}</div>;
        },
        enableSorting: false
    },
    { accessorKey: 'asmaY_Year', header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' /> },
    { accessorKey: 'staffName', header: ({ column }) => <DataTableColumnHeader column={column} title='Staff' /> },
    { accessorKey: 'ttmP_PeriodName', header: ({ column }) => <DataTableColumnHeader column={column} title='Period' /> },
    {
        accessorKey: 'ttfpS_SUbSelcFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class-Section Wise' />,
        cell: ({ row }) => (row.original.ttfpS_SUbSelcFlag ? 'Yes' : 'No')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row) => row,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} idKey='ttfpS_Id' toggleKey='ttfpS_ActiveFlag' showView={true} />
    }
];

// 5. Period Subject
export const periodSubjectColumns: ColumnDef<IFixingPeriodSubjectList>[] = [
    {
        accessorKey: 'ttfpsU_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const index = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{index}</div>;
        },
        enableSorting: false
    },
    { accessorKey: 'asmaY_Year', header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' /> },
    { accessorKey: 'ismS_SubjectName', header: ({ column }) => <DataTableColumnHeader column={column} title='Subject' /> },
    { accessorKey: 'ttmP_PeriodName', header: ({ column }) => <DataTableColumnHeader column={column} title='Period' /> },
    {
        accessorKey: 'ttfpsU_SUbSelcFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class-Section Wise' />,
        cell: ({ row }) => (row.original.ttfpsU_SUbSelcFlag ? 'Yes' : 'No')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row) => row,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} idKey='ttfpsU_Id' toggleKey='ttfpsU_ActiveFlag' showView={true} />
    }
];
