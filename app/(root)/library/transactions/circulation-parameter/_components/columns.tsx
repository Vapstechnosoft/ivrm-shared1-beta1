'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Switch } from '@/components/ui/switch';
import type { CirculationParameterGridData } from '@/types/library/transactions/circulationParameter';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit2 } from 'lucide-react';

interface ColumnProps {
    onEdit: (data: CirculationParameterGridData) => void;
    onToggleStatus: (data: CirculationParameterGridData) => void;
    isToggling?: boolean;
}

export const createCirculationParameterColumns = ({ onEdit, onToggleStatus, isToggling }: ColumnProps): ColumnDef<CirculationParameterGridData>[] => {
    return [
        {
            id: 'index',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
            cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
            enableSorting: false
        },
        {
            id: 'categoryOrType',
            accessorFn: (row) =>
                row.lbcpA_IssueRefFlg ||
                row.catgname ||
                row.lmB_BookType ||
                (row.BOOKFLAG === 'NBP' || row.lmB_BookTypeflag === 'NBP'
                    ? (row.lmC_CategoryName || 'Non-Book')
                    : 'Issue'),
            header: ({ column }) => <DataTableColumnHeader column={column} title='Book Type/Category' />,
            cell: ({ row }) => (
                <div>
                    {row.original.lbcpA_IssueRefFlg ||
                        row.original.catgname ||
                        row.original.lmB_BookType ||
                        (row.original.BOOKFLAG === 'NBP' || row.original.lmB_BookTypeflag === 'NBP'
                            ? (row.original.lmC_CategoryName || 'Non-Book')
                            : 'Issue')}
                </div>
            )
        },
        {
            id: 'targetGroup',
            accessorFn: (row) => {
                if (row.asmcL_ClassName) return `Class ${row.asmcL_ClassName}`;
                if ((row.schclgflag === 'STUDENT' || row.lbcpA_Flg === 'STUDENT') && row.type_Name) return `Class ${row.type_Name}`;
                return (
                    row.hrmgT_EmployeeGroupType ||
                    row.hrmD_DepartmentName ||
                    row.guest_Name ||
                    row.type_Name ||
                    row.schclgflag ||
                    '-'
                );
            },
            header: ({ column }) => <DataTableColumnHeader column={column} title='Member / Class' />,
            cell: ({ row }) => {
                const orig = row.original;
                const className = orig.asmcL_ClassName || ((orig.schclgflag === 'STUDENT' || orig.lbcpA_Flg === 'STUDENT') ? orig.type_Name : undefined);
                return (
                    <div>
                        {className
                            ? `Class ${className}`
                            : orig.hrmgT_EmployeeGroupType ||
                              orig.hrmD_DepartmentName ||
                              orig.guest_Name ||
                              orig.type_Name ||
                              orig.schclgflag ||
                              '-'}
                    </div>
                );
            }
        },
        {
            id: 'maxIssueItems',
            accessorFn: (row) =>
                row.param_NoOfItems ??
                row.lbcpaS_NoOfItems ??
                row.max_Issue_Items ??
                row.lmC_MaxIssueItems ??
                row.max_issue_items ??
                row.Max_Issue_Items ??
                0,
            header: ({ column }) => <DataTableColumnHeader column={column} title='No. Of Item' />,
            cell: ({ row }) => (
                <div>
                    {row.original.param_NoOfItems ??
                        row.original.lbcpaS_NoOfItems ??
                        row.original.max_Issue_Items ??
                        row.original.lmC_MaxIssueItems ??
                        row.original.max_issue_items ??
                        row.original.Max_Issue_Items ??
                        0}
                </div>
            )
        },
        {
            id: 'maxIssueDays',
            accessorFn: (row) =>
                row.param_IssueDays ??
                row.lbcpaS_IssueDays ??
                row.max_Issue_Days ??
                row.lmC_MaxIssueDays ??
                row.max_issue_days ??
                row.Max_Issue_Days ??
                0,
            header: ({ column }) => <DataTableColumnHeader column={column} title='Issue Days' />,
            cell: ({ row }) => (
                <div>
                    {row.original.param_IssueDays ??
                        row.original.lbcpaS_IssueDays ??
                        row.original.max_Issue_Days ??
                        row.original.lmC_MaxIssueDays ??
                        row.original.max_issue_days ??
                        row.original.Max_Issue_Days ??
                        0}
                </div>
            )
        },
        {
            id: 'maxRenewals',
            accessorFn: (row) =>
                row.param_NoOfRenewals ??
                row.lbcpaS_NoOfRenewals ??
                row.max_No_Renewals ??
                row.lmC_MaxRenewals ??
                row.max_no_renewals ??
                row.Max_No_Renewals ??
                0,
            header: ({ column }) => <DataTableColumnHeader column={column} title='Max Renewals' />,
            cell: ({ row }) => (
                <div>
                    {row.original.param_NoOfRenewals ??
                        row.original.lbcpaS_NoOfRenewals ??
                        row.original.max_No_Renewals ??
                        row.original.lmC_MaxRenewals ??
                        row.original.max_no_renewals ??
                        row.original.Max_No_Renewals ??
                        0}
                </div>
            )
        },
        {
            id: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => {
                const isActive =
                    row.original.param_ActiveFlg ??
                    row.original.circ_ActiveFlag ??
                    row.original.lbcpaS_ActiveFlg ??
                    row.original.lbcpa_ActiveFlg ??
                    row.original.lbcpA_ActiveFlg ??
                    row.original.lnbcpa_ActiveFlg ??
                    row.original.lmC_ActiveFlag ??
                    (row.original as any).asmcL_ActiveFlag ??
                    (row.original as any).hrmgT_ActiveFlag ??
                    (row.original as any).activeFlag ??
                    true;
                return (
                    <div className='flex items-center justify-center gap-2'>
                        <span className={`font-medium text-xs ${isActive ? 'text-green-700' : 'text-red-600'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                            checked={isActive}
                            onCheckedChange={() => onToggleStatus(row.original)}
                            className='data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 cursor-pointer'
                        />
                    </div>
                );
            }
        },
        {
            id: 'actions',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
            cell: ({ row }) => {
                const isActive =
                    row.original.param_ActiveFlg ??
                    row.original.circ_ActiveFlag ??
                    row.original.lbcpaS_ActiveFlg ??
                    row.original.lbcpa_ActiveFlg ??
                    row.original.lbcpA_ActiveFlg ??
                    row.original.lnbcpa_ActiveFlg ??
                    row.original.lmC_ActiveFlag ??
                    (row.original as any).asmcL_ActiveFlag ??
                    (row.original as any).hrmgT_ActiveFlag ??
                    (row.original as any).activeFlag ??
                    true;
                return (
                    <div className='flex items-center justify-center gap-2'>
                        <Button
                            variant='ghost'
                            size='icon'
                            disabled={!isActive}
                            onClick={() => onEdit(row.original)}
                            className='h-8 w-8 p-0 text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700'>
                            <Edit2 className='h-4 w-4' />
                        </Button>
                    </div>
                );
            }
        }
    ];
};
