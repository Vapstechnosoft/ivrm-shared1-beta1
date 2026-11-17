'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { FormProvider } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import type { IExamSubjectGroupingDetails } from '@/types/exam/exam-module/exam-mapping';
import type { IFeeTDetails } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';

interface FeeDetailsProps {
    onClose: () => void;
    data: IFeeTDetails[];
    loading: boolean;
}

export default function FeeDetails({ onClose, data, loading }: FeeDetailsProps) {
    const tableProps = useDataTableProps({
        data: data,
        total: data.length,
        pageIndex: 0,
        pageSize: 5
    });

    return (
        <FormProvider<IExamSubjectGroupingDetails>>
            <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
                <div className='relative mx-auto w-[75%] rounded-2xl bg-white p-6 shadow-xl'>
                    {/* Header Section */}
                    <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <Heading title='Fee Details' />
                        <Button
                            variant='secondary'
                            onClick={onClose}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            Close
                        </Button>
                    </div>

                    {/* Data Table */}
                    <GenericDataTable<IFeeTDetails>
                        {...tableProps}
                        columns={feeDetailsColumn}
                        isLoading={loading}
                        columnPinning={{ right: ['actions'] }}
                        noDataTitle='No Data Found'
                        noDataDescription='No Fee Details available.'
                        errorTitle='Error Loading Data'
                        showViewOptions={false}
                    />
                </div>
            </div>
        </FormProvider>
    );
}

export const feeDetailsColumn: ColumnDef<IFeeTDetails>[] = [
    {
        accessorKey: 'fmG_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('fmG_GroupName')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_CurrentYrCharges',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Charges' />,
        cell: ({ row }) => <div>{row.getValue('fsS_TotalToBePaid')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_ConcessionAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Concession' />,
        cell: ({ row }) => <div>{row.getValue('fsS_ConcessionAmount')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_WaivedAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total WaivedOff' />,
        cell: ({ row }) => <div>{row.getValue('fsS_WaivedAmount')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_AdjustedAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Adjustment' />,
        cell: ({ row }) => <div>{row.getValue('fsS_AdjustedAmount')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_TotalToBePaid',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Payable' />,
        cell: ({ row }) => <div>{row.getValue('fsS_TotalToBePaid')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_PaidAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Paid Amount' />,
        cell: ({ row }) => <div>{row.getValue('fsS_PaidAmount')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_ToBePaid',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Outstanding' />,
        cell: ({ row }) => <div>{row.getValue('fsS_ToBePaid')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_RefundAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Refund' />,
        cell: ({ row }) => <div>{row.getValue('fsS_RefundAmount')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_RunningExcessAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Excess' />,
        cell: ({ row }) => <div>{row.getValue('fsS_RunningExcessAmount')}</div>,
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'fsS_FineAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Fine' />,
        cell: ({ row }) => <div>{row.getValue('fsS_FineAmount')}</div>,
        enableHiding: true,
        enableSorting: false
    }
];
