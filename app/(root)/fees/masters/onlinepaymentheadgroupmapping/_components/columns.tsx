'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { getAcademicYearDropdown, getOnlinePaymentHeadGroupEdit } from '@/server/fees/masters/online_payment_head_group';
import type { IMasterOnlinePaymentHeadgroupList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const masterClassYearlyCategoryColumns: ColumnDef<IMasterOnlinePaymentHeadgroupList>[] = [
    {
        accessorKey: 'fopM_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className='pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'institutionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Institution Name' />,
        cell: ({ row }) => <div>{row.getValue('institutionName')}</div>
    },

    {
        accessorKey: 'className',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('className')}</div>
    },
    {
        accessorKey: 'submerchandId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub Merchant Id' />,
        cell: ({ row }) => <div>{row.getValue('submerchandId')}</div>
    },
    {
        accessorKey: 'groupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('groupName')}</div>
    },
    {
        accessorKey: 'headName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Head Name' />,
        cell: ({ row }) => <div>{row.getValue('headName')}</div>
    },
    {
        accessorKey: 'installmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment' />,
        cell: ({ row }) => <div>{row.getValue('installmentName')}</div>
    },
    {
        accessorKey: 'termName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Term' />,
        cell: ({ row }) => <div>{row.getValue('termName')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({
    rowData
}: {
    rowData: IMasterOnlinePaymentHeadgroupList;
}) {
    const { openToggleForm, openEditForm, openDeleteForm } = useFormContext<IMasterOnlinePaymentHeadgroupList>();

    const handleToggle = useCallback((data: IMasterOnlinePaymentHeadgroupList) => openToggleForm(data), [openToggleForm]);

    const handleEdit = useCallback(
        async (data: IMasterOnlinePaymentHeadgroupList) => {
            try {
                const fopM_Id = data.fopM_Id;

                // console.log('🟣 [HOOK] fopM_Id:', fopM_Id);
                const response = await getOnlinePaymentHeadGroupEdit(fopM_Id);

                const academicyeardata = await getAcademicYearDropdown();

                //  console.log('🟣 [HOOK] academicYearData:', academicyeardata);

                const asmaY_Id = Number(academicyeardata?.data?.[0]?.asmaY_Id ?? 0);

                if (response?.success && response?.data) {
                    const dataArray = (response as any).data;
                    const apiData = dataArray[0];

                    const transformedData = {
                        fopM_Id: apiData.fopM_Id,
                        asmaY_Id: asmaY_Id,
                        asmcL_ID: apiData.asmcL_Id,
                        className: data.className,
                        fpgd_id: apiData.fpgd_id,
                        subMerchantId: data.subMerchantId,
                        fmg_id: apiData.fmg_id,
                        groupName: data.groupName,
                        fmh_HeadId: apiData.fmH_Id,
                        headName: data.headSearchTerm,
                        fti_id: apiData.fti_id,
                        installmentName: data.installmentName,
                        fmt_id: apiData.fmt_id,
                        termName: data.terms,
                        institutionName: apiData.mI_Name,
                        mI_Id: apiData.mI_Id
                    };

                    openEditForm(transformedData as any);
                } else {
                    toast.error('Failed to fetch edit data');
                }
            } catch (error) {
                console.error('Error opening edit form:', error);
                toast.error('An error occurred while loading edit data');
            }
        },
        [openEditForm]
    );

    // Delete Handler
    const handleDelete = useCallback(
        async (data: IMasterOnlinePaymentHeadgroupList) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, delete: true }} // Delete button added
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={handleDelete} // Pass delete handler
            toggleConditionKey='fycC_ActiveFlag'
        />
    );
}
