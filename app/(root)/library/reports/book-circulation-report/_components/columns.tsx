'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IBookCirculationReportGridData } from '@/types/library/reports/book-circulation-report';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

const SharedColumns: ColumnDef<IBookCirculationReportGridData>[] = [
    {
        id: 'slNo',
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
        accessorKey: 'lmb_BookTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Title' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BookTitle')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmbano_AccessionNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Accession No' />,
        cell: ({ row }) => <div>{row.getValue('lmbano_AccessionNo')}</div>,
        enableSorting: true
    }
];

const StatusDateColumns: ColumnDef<IBookCirculationReportGridData>[] = [
    {
        accessorKey: 'lbtr_Status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Transaction Status' />,
        cell: ({ row }) => <div>{row.getValue('lbtr_Status')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lbtr_IssuedDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Issue Date' />,
        cell: ({ row }) => {
            const date = row.getValue('lbtr_IssuedDate') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'lbtr_DueDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Due Date' />,
        cell: ({ row }) => {
            const date = row.getValue('lbtr_DueDate') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'lbtr_ReturnedDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Return Date' />,
        cell: ({ row }) => {
            const date = row.getValue('lbtr_ReturnedDate') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'lbtr_FineCollected',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fine Collected' />,
        cell: ({ row }) => <div>{row.getValue('lbtr_FineCollected')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lbtr_TotalFine',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Fine' />,
        cell: ({ row }) => <div>{row.getValue('lbtr_TotalFine')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'lmb_BookType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Book Type' />,
        cell: ({ row }) => <div>{row.getValue('lmb_BookType')}</div>,
        enableSorting: true
    }
];

export const getColumns = (memberType: string): ColumnDef<IBookCirculationReportGridData>[] => {
    let specificColumns: ColumnDef<IBookCirculationReportGridData>[] = [];

    if (memberType === 'Student') {
        specificColumns = [
            {
                accessorKey: 'amsT_AdmNo',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Adm No.' />,
                cell: ({ row }) => <div>{row.getValue('amsT_AdmNo')}</div>,
                enableSorting: true
            },
            {
                accessorKey: 'amsT_Name',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
                cell: ({ row }) => <div>{row.getValue('amsT_Name')}</div>,
                enableSorting: true
            },
            {
                accessorKey: 'asmcL_ClassName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
                cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>,
                enableSorting: true
            },
            {
                accessorKey: 'asmC_SectionName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
                cell: ({ row }) => <div>{row.getValue('asmC_SectionName')}</div>,
                enableSorting: true
            },
            {
                accessorKey: 'amaY_RollNo',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Roll No.' />,
                cell: ({ row }) => <div>{row.getValue('amaY_RollNo')}</div>,
                enableSorting: true
            },
            {
                accessorKey: 'latedays',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Late Return Days' />,
                cell: ({ row }) => {
                    const days = row.getValue('latedays') as number;
                    return <div>{days > 0 ? days : '--'}</div>;
                },
                enableSorting: true
            }
        ];
    } else if (memberType === 'Staff') {
        specificColumns = [
            {
                accessorKey: 'empName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Staff Name' />,
                cell: ({ row }) => <div>{row.getValue('empName')}</div>,
                enableSorting: true
            },
            {
                accessorKey: 'hrmE_EmployeeCode',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Staff Code' />,
                cell: ({ row }) => <div>{row.getValue('hrmE_EmployeeCode')}</div>,
                enableSorting: true
            }
        ];
    } else if (memberType === 'Guest') {
        specificColumns = [
            {
                accessorKey: 'lbtR_GuestName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Guest Name' />,
                cell: ({ row }) => <div>{row.getValue('lbtR_GuestName')}</div>,
                enableSorting: true
            },
            {
                accessorKey: 'lbtR_GuestEmailId',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Mail' />,
                cell: ({ row }) => <div>{row.getValue('lbtR_GuestEmailId')}</div>,
                enableSorting: true
            },
            {
                accessorKey: 'lbtR_GuestContactNo',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Contact' />,
                cell: ({ row }) => <div>{row.getValue('lbtR_GuestContactNo')}</div>,
                enableSorting: true
            }
        ];
    } else if (memberType === 'Department') {
        specificColumns = [
            {
                accessorKey: 'hrmD_DepartmentName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Department Name' />,
                cell: ({ row }) => <div>{row.getValue('hrmD_DepartmentName')}</div>,
                enableSorting: true
            }
        ];
    }

    // Combine: Shared + Specific + Status/Dates
    // Adjust order if necessary. Legacy:
    // Student: SlNo, Title, Acc, BookType?, AdmNo, Name, Class, Sec, Roll, Status, Issue, Due, Return, LateDays, Fine...
    // The legacy order is a bit mixed. I'll stick to a logical grouping:
    // Shared Info -> Specific Member Info -> Dates/Status -> Fines

    return [...SharedColumns, ...specificColumns, ...StatusDateColumns];
};
