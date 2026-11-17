'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useMasterFeeInstallmentyId } from '@/hooks/fees/useMasters';
import type { IMasterFeesInstallmentList } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const feeInstallmentColumns: ColumnDef<IMasterFeesInstallmentList>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex} </div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'fmI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Master Installment' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('fmI_Name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmI_No_Of_Installments',
        header: ({ column }) => <DataTableColumnHeader column={column} title='No. of Installments' />,
        cell: ({ row }) => <div>{row.getValue('fmI_No_Of_Installments')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    // {
    //     accessorKey: 'fmI_Installment_Type',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Installment Type' />,
    //     cell: ({ row }) => {
    //         const type = row.getValue('fmI_Installment_Type') as string;
    //         return <div>{type === '1' ? 'Monthly' : type === '2' ? 'Quarterly' : type}</div>;
    //     },
    //     enableSorting: true,
    //     enableHiding: true
    // },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 120,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({
    rowData
}: {
    rowData: IMasterFeesInstallmentList;
}) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterFeesInstallmentList>();

    const sanitizeRowForEdit = (r: any) => {
        if (!r || typeof r !== 'object') return r;
        const copy: any = { ...r };
        const raw = copy.fmI_Id ?? copy.id ?? copy.fmIId;
        if (raw === null || raw === undefined) {
            copy.fmI_Id = undefined;
        } else if (typeof raw === 'number') {
            copy.fmI_Id = raw > 0 ? raw : undefined;
        } else if (typeof raw === 'string') {
            const t = raw.trim();
            const lower = t.toLowerCase();
            if (t === '' || lower === 'undefined' || lower === '$undefined') copy.fmI_Id = undefined;
            else {
                const n = Number(t);
                copy.fmI_Id = !Number.isNaN(n) && Number.isInteger(n) && n > 0 ? n : undefined;
            }
        }

        if (typeof copy.fmI_ActiveFlag === 'string') {
            const lower = copy.fmI_ActiveFlag.toLowerCase?.() ?? '';
            if (lower === 'true') copy.fmI_ActiveFlag = true;
            else if (lower === 'false') copy.fmI_ActiveFlag = false;
            else copy.fmI_ActiveFlag = undefined;
        }

        const inst = copy.fydto ?? copy.installments;
        if (Array.isArray(inst)) {
            copy.fydto = inst.map((it: any) => ({
                ...it,
                ftI_Id: (() => {
                    const v = it?.ftI_Id ?? it?.id;
                    if (v === null || v === undefined) return undefined;
                    if (typeof v === 'number') return v > 0 ? v : undefined;
                    if (typeof v === 'string') {
                        const tt = v.trim();
                        const ll = tt.toLowerCase();
                        if (tt === '' || ll === 'undefined' || ll === '$undefined') return undefined;
                        const nv = Number(tt);
                        return !Number.isNaN(nv) && Number.isInteger(nv) && nv > 0 ? nv : undefined;
                    }
                    return undefined;
                })()
            }));
        }

        return copy;
    };
    const [fetchId, setFetchId] = useState<number>(0);

    const { data: fetchedData, isFetching, error } = useMasterFeeInstallmentyId(fetchId);

    useEffect(() => {
        if (error) {
            toast.error('Failed to load installment details');
            setFetchId(0);
        }
    }, [error]);

    useEffect(() => {
        if (!isFetching && fetchId && fetchedData) {
            const anyData = fetchedData as any;
            let payload = anyData?.data ?? anyData;

            if (payload?.$values) payload = payload.$values;

            if (payload?.data) {
                payload = payload.data;
                if (payload?.$values) payload = payload.$values;
            }

            let record: any = null;

            if (Array.isArray(payload)) {
                record = payload[0];
            } else if (payload && typeof payload === 'object') {
                record = payload;
            }

            if (record) {
                const enriched: any = {
                    ...record,
                    fmI_Id: record.fmI_Id ?? (fetchId as any) ?? (rowData as any)?.fmI_Id,
                    mI_Id: record.mI_Id ?? (rowData as any)?.mI_Id,
                    fmI_ActiveFlag:
                        record.fmI_ActiveFlag ??
                        record.fmI_ActiceFlag ??
                        (rowData as any)?.fmI_ActiveFlag ??
                        (rowData as any)?.fmI_ActiceFlag
                };

                if (typeof enriched.fmI_Id === 'string') {
                    const num = Number(enriched.fmI_Id);
                    if (!Number.isNaN(num)) enriched.fmI_Id = num;
                    else if (String(enriched.fmI_Id).toLowerCase().includes('undefined')) {
                        enriched.fmI_Id = (fetchId as any) ?? (rowData as any)?.fmI_Id;
                    }
                }

                if (typeof enriched.fmI_ActiveFlag === 'string') {
                    const lower = enriched.fmI_ActiveFlag.toLowerCase?.() ?? '';
                    if (lower === 'true') enriched.fmI_ActiveFlag = true;
                    else if (lower === 'false') enriched.fmI_ActiveFlag = false;
                    else if (lower.includes('undefined')) {
                        enriched.fmI_ActiveFlag = (rowData as any)?.fmI_ActiveFlag ?? (rowData as any)?.fmI_ActiceFlag ?? true;
                    } else {
                        const num = Number(enriched.fmI_ActiveFlag);
                        if (!Number.isNaN(num)) enriched.fmI_ActiveFlag = num;
                    }
                }
                openEditForm(sanitizeRowForEdit(enriched) as any);
            } else {
                const fallback = {
                    ...(anyData as any),
                    fmI_Id: (fetchId as any) ?? (rowData as any)?.fmI_Id ?? (rowData as any)?.id,
                    mI_Id: (rowData as any)?.mI_Id
                };
                const sanitizedData = sanitizeRowForEdit(fallback);
                openEditForm(sanitizedData as any);
            }
            setFetchId(0);
        }
    }, [isFetching, fetchId, fetchedData, openEditForm]);

    const handleEdit = useCallback(
        (data: IMasterFeesInstallmentList) => {
            // Accept multiple possible id field names coming from different backends
            const candidate = (data as any)?.fmI_Id ?? (data as any)?.fmIId ?? (data as any)?.fmi_id ?? (data as any)?.id;

            const sanitize = (id: any): number | undefined => {
                if (id === null || id === undefined) return undefined;
                if (typeof id === 'number') return id > 0 ? id : undefined;
                if (typeof id === 'string') {
                    const trimmed = id.trim();
                    const lower = trimmed.toLowerCase();
                    if (lower === '' || lower.includes('undefined') || lower === '$undefined') return undefined;
                    const n = Number(trimmed);
                    if (!Number.isNaN(n) && Number.isInteger(n) && n > 0) return n;
                }
                return undefined;
            };

            const id = sanitize(candidate);

            if (id) {
                // store id and trigger fetch to auto-fill the form
                // Do NOT open the edit form yet — wait for the API response to populate
                // and open the form in the fetch effect. This ensures the form only
                // displays after we have the full data.
                setFetchId(id);
            } else {
                const sanitizedData = sanitizeRowForEdit({
                    ...data,
                    fmI_Id: sanitize((data as any)?.fmI_Id) ?? sanitize((data as any)?.id)
                });
                openEditForm(sanitizedData as any);
            }
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterFeesInstallmentList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='fmI_ActiceFlag'
        />
    );
}
