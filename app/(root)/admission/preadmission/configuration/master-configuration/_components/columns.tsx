'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useMasterConfiguration } from '@/hooks/admission/preadmission/useConfigurations';
import type { IMasterConfiguration } from '@/types/admission/preadmission/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';

export const masterConfigurationColumns: ColumnDef<IMasterConfiguration>[] = [
    {
        accessorKey: 'asmcC_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className='w-full pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false,
        size: 60
    },
    {
        accessorKey: 'institution_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Institute Name' />,
        cell: ({ row }) => <div>{row.getValue('institution_name') || '—'}</div>,
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'trust_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Trust Name' />,
        cell: ({ row }) => <div>{row.getValue('trust_name') || '—'}</div>,
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'academic_year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('academic_year') || '—'}</div>,
        enableSorting: true,
        enableHiding: false
    },
    {
        id: 'actions',
        header: () => <div className='text-center'>Actions</div>,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false,
        enableHiding: false,
        size: 100
    }
];

/* -------------------------------------------------------------------------- */
/*                     EDIT BUTTON → opens pre-filled form                    */
/* -------------------------------------------------------------------------- */
function ActionButtonsCell({ rowData }: { rowData: IMasterConfiguration }) {
    const { openEditForm } = useFormContext<IMasterConfiguration>();

    const handleEdit = useCallback(() => {
        const editPayload = {
            ispaC_Id: rowData.ispaC_Id ?? 0,
            asmaY_Id: rowData.asmaY_Id,
            amC_Id: rowData.amC_Id,
            academic_year: rowData.academic_year ?? '',
            trust_name: rowData.trust_name ?? '',
            institution_name: rowData.institution_name ?? '',
            ispaC_EnquiryApplFlag: rowData.ispaC_EnquiryApplFlag ?? 0,
            ispaC_ApplIssueFlag: rowData.ispaC_ApplIssueFlag ?? 0,
            ispaC_EnqSMSFlag: rowData.ispaC_EnqSMSFlag ?? 0,
            ispaC_EnqMailFlag: rowData.ispaC_EnqMailFlag ?? 0,
            ispaC_EnqMailBackground: rowData.ispaC_EnqMailBackground ?? 0,
            ispaC_ApplFeeFlag: rowData.ispaC_ApplFeeFlag ?? 0,
            ispaC_ApplnDownladFlag: rowData.ispaC_ApplnDownladFlag ?? 0,
            ispaC_ApplSMSFlag: rowData.ispaC_ApplSMSFlag ?? 0,
            ispaC_ApplMailFlag: rowData.ispaC_ApplMailFlag ?? 0,
            ispaC_ApplMailBackground: rowData.ispaC_ApplMailBackground ?? 0,
            ispaC_DOBMaxAgeFlag: rowData.ispaC_DOBMaxAgeFlag ?? 0,
            ispaC_DOBMinAgeFlag: rowData.ispaC_DOBMinAgeFlag ?? 0,
            ispaC_ApplCutOffDateFlag: rowData.ispaC_ApplCutOffDateFlag ?? 0,
            ispaC_ApplNoGenFlag: rowData.ispaC_ApplNoGenFlag ?? 0,
            ispaC_DefaultStatusFlag: rowData.ispaC_DefaultStatusFlag ?? 0,
            ispaC_OralTestBy: rowData.ispaC_OralTestBy ?? 0,
            ispaC_EnquiryNoGenFlag: rowData.ispaC_EnquiryNoGenFlag ?? 0,
            ispaC_RgNoGenFlag: rowData.ispaC_RgNoGenFlag ?? 0,
            ispaC_RegSMSFlag: rowData.ispaC_RegSMSFlag ?? 0,
            ispaC_RegMailFlag: rowData.ispaC_RegMailFlag ?? 0,
            ispaC_RegMailBackground: rowData.ispaC_RegMailBackground ?? 0,
            ispaC_AdmCategoryFlag: rowData.ispaC_AdmCategoryFlag ?? 0,
            ispaC_WrittenTestApplFlag: rowData.ispaC_WrittenTestApplFlag ?? 0,
            ispaC_MarksEntry: rowData.ispaC_MarksEntry ?? 0,
            ispaC_OralTestApplFlag: rowData.ispaC_OralTestApplFlag ?? 0,
            ispaC_SeatBlockFlag: rowData.ispaC_SeatBlockFlag ?? 0,
            ispaC_FatherAliveFlag: rowData.ispaC_FatherAliveFlag ?? 0,
            ispaC_MotherAliveFlag: rowData.ispaC_MotherAliveFlag ?? 0,
            ispaC_MaritalStatusFlag: rowData.ispaC_MaritalStatusFlag ?? 0,
            ispaC_FeePaymentFlag: rowData.ispaC_FeePaymentFlag ?? 0,
            ispaC_AdmissionTransfer: rowData.ispaC_AdmissionTransfer ?? 0,
            ispaC_EnableSiblingsLink: rowData.ispaC_EnableSiblingsLink ?? 0,
            ispaC_SibblingConcessionFlag: rowData.ispaC_SibblingConcessionFlag ?? 0,
            ispaC_ParentConcessionFlag: rowData.ispaC_ParentConcessionFlag ?? 0,
            ispaC_ECSFlag: rowData.ispaC_ECSFlag ?? 0,
            ispaC_HostelFlag: rowData.ispaC_HostelFlag ?? 0,
            ispaC_TransaportFlag: rowData.ispaC_TransaportFlag ?? 0,
            ispaC_GymFlag: rowData.ispaC_GymFlag ?? 0,
            ispaC_EnquiryNo_ApplNo_RegNo: rowData.ispaC_EnquiryNo_ApplNo_RegNo ?? 0,
            ispaC_OralByMax_Marks: rowData.ispaC_OralByMax_Marks ?? 0,
            ispaC_OralByMin_Marks: rowData.ispaC_OralByMin_Marks ?? 0,
            ispaC_ProspectusFlag: rowData.ispaC_ProspectusFlag ?? 0,
            ispaC_Transfer_Settings_Flag: rowData.ispaC_Transfer_Settings_Flag ?? 0,
            ispaC_Transfer_Settings_after_payment_Flag: rowData.ispaC_Transfer_Settings_after_payment_Flag ?? 0,
            ispaC_ProsptFeeApp: rowData.ispaC_ProsptFeeApp ?? 0,
            ispaC_OralTestSchApplFlag: rowData.ispaC_OralTestSchApplFlag ?? 0,
            ispaC_OralMarksFlag: rowData.ispaC_OralMarksFlag ?? 0,
            ispaC_RegFeeFlag: rowData.ispaC_RegFeeFlag ?? 0,
            ispaC_WrittenTestSchApplFlag: rowData.ispaC_WrittenTestSchApplFlag ?? 0,
            ispaC_CommonScheduleFlag: rowData.ispaC_CommonScheduleFlag ?? 0,
            ispaC_NoofApplications: rowData.ispaC_NoofApplications ?? 0,
            ispaC_Healthapp: rowData.ispaC_Healthapp ?? 0,
            ispaC_FullPaymentCompFlg: rowData.ispaC_FullPaymentCompFlg ?? 0,
            ispaC_OfflineFee_Flag: rowData.ispaC_OfflineFee_Flag ?? 0,
            ispaC_ApplNoIncrementFlg: Boolean(rowData.ispaC_ApplNoIncrementFlg),
            ispaC_ApplNoIncrementBy: rowData.ispaC_ApplNoIncrementBy ?? 0
        };
        openEditForm(editPayload);
    }, [rowData, openEditForm]);

    return (
        <div className='flex justify-center'>
            <ActionButtons rowData={rowData} buttons={{ edit: true, toggle: false, delete: false }} onEdit={handleEdit} />
        </div>
    );
}

export function MasterConfigurationTable() {
    const { data, isLoading, error } = useMasterConfiguration();

    // Extract table data with useMemo
    const tableData = useMemo(() => {
        if (!data) {
            return [];
        }
        if (Array.isArray(data)) {
            return data;
        }
        if (Array.isArray(data.data)) {
            return data.data;
        }
        if (Array.isArray(data.records)) {
            return data.records;
        }
        if (Array.isArray(data.result)) {
            return data.result;
        }
        return [];
    }, [data]);

    const tableProps = useDataTableProps({
        data: tableData,
        pageSize: 10
    });

    if (isLoading) {
        return (
            <div className='flex h-40 items-center justify-center text-muted-foreground'>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Loading master configurations...
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex h-40 flex-col items-center justify-center text-red-600'>
                <p className='font-semibold'>Error loading data</p>
                <p className='text-sm'>{error.message || 'Unknown error occurred'}</p>
            </div>
        );
    }

    return <GenericDataTable<IMasterConfiguration> columns={masterConfigurationColumns} isLoading={isLoading} {...tableProps} />;
}
