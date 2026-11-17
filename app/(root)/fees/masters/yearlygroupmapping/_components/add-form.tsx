'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { useFeeMasterHead, useFeeMasterInstallment } from '@/hooks/fees/useMasters';
import { masterClassSchema } from '@/schemas/fees/masters';
import { getFeeGroupBeasedOnAcademicYear } from '@/server/fees/masters/groupsgrouping';
import { addMasterYearlyGroupMapping } from '@/server/fees/masters/yearly_group_mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';

import { useEffect, useMemo, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterClassSchema.addOrUpdate>;

interface yearlyGroupMappingFormProps {
    onSuccess?: () => void;
}

interface IHeadInstallment {
    id: number;
    fmH_Id: string;
    fmI_Id: string;
    fineApplicable: boolean;
    active: boolean;
    commonAmount: boolean;
}

interface ApiSearchparams {
    ASMAY_Id?: number;
    FMG_Id?: number;
    MI_Id?: number;
    page?: number;
    page_size?: number;
    search?: string;
    sort_by?: string;
    [key: string]: any;
}

export default function YearlyFeeGroupMapping({ onSuccess }: yearlyGroupMappingFormProps) {
    const { data: academicYearOptions } = useAcademicYearDropdown();

    const [showClearButton, setShowClearButton] = useState(false);

    const [feeGroups, setFeeGroups] = useState<any[]>([]);
    // const { data: feeGroupResponse } = useMasterFeeGroupDropdown() as {
    //     data?: {
    //         success?: boolean;
    //         message?: string;
    //         data?: { fmG_Id: number; feeGroups: string }[];
    //     };
    // };

    const {
        control,
        setValue,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            academicYear: '',
            classCategory: '',
            headInstallments: [
                {
                    id: 1,
                    fmH_Id: '',
                    fmI_Id: '',
                    fineApplicable: false,
                    active: false,
                    commonAmount: false
                }
            ]
        }
    });

    const { data: feeHeadResponse, isLoading: isLoadingHeads } = useFeeMasterHead();
    const { data: installmentResponse, isLoading: isLoadingInstallments } = useFeeMasterInstallment();

    const academicYears = Array.isArray(academicYearOptions?.data) ? academicYearOptions.data : [];
    //const feeGroups = Array.isArray(feeGroupResponse?.data) ? feeGroupResponse.data : [];

    const feeHeads = Array.isArray(feeHeadResponse?.data?.data)
        ? feeHeadResponse.data.data
        : Array.isArray(feeHeadResponse?.data)
          ? feeHeadResponse.data
          : [];

    const installments = Array.isArray(installmentResponse?.data?.data)
        ? installmentResponse.data.data
        : Array.isArray(installmentResponse?.data)
          ? installmentResponse.data
          : [];

    const [academicYear, setAcademicYear] = useState<string | null>(null);
    const [feeGroup, setFeeGroup] = useState<string | null>(null);

    const [headInstallments, setHeadInstallments] = useState<IHeadInstallment[]>([
        {
            id: 1,
            fmH_Id: '',
            fmI_Id: '',
            fineApplicable: false,
            active: false,
            commonAmount: false
        }
    ]);

    const apiSearchParams: ApiSearchparams | null = useMemo(() => {
        if (academicYear && feeGroup) {
            return {
                ASMAY_Id: Number(academicYear),
                FMG_Id: Number(feeGroup)
            };
        }
        return null;
    }, [academicYear, feeGroup]);

    // const { refetch: refetchAll } = useMasterAllFeeHead(
    //     academicYear ? Number(academicYear) : 0,
    //     apiSearchParams ? apiSearchParams : undefined
    // );

    // useEffect(() => {
    //     if (academicYear && feeGroup) {
    //         refetchAll();
    //     }
    // }, [academicYear, feeGroup, refetchAll]);

    const selectedAsmayId = watch('academicYear');

    useEffect(() => {
        const fetchFeeGroups = async () => {
            if (selectedAsmayId) {
                try {
                    const response = await getFeeGroupBeasedOnAcademicYear(Number(selectedAsmayId));

                    console.log('Fee groups:', response);

                    if (response.success && response.data) {
                        // Remove duplicate entries based on fmG_Id
                        const uniqueGroups = response.data.reduce((acc: any[], current: any) => {
                            const exists = acc.find((item) => item.fmG_Id === current.fmG_Id);
                            if (!exists) {
                                acc.push(current);
                            }
                            return acc;
                        }, []);

                        setFeeGroups(uniqueGroups);
                    } else {
                        setFeeGroups([]);
                        toast.error(response.message || 'No fee groups found for this academic year');
                    }
                } catch (error) {
                    console.error('Error fetching fee groups:', error);
                    setFeeGroups([]);
                    toast.error('Failed to fetch fee groups');
                }
            } else {
                setFeeGroups([]);
                setFeeGroup(null);
                setValue('classCategory', '');
            }
        };

        fetchFeeGroups();
    }, [selectedAsmayId, setValue]);

    const headInstallmentColumns: ColumnDef<IHeadInstallment>[] = [
        // {
        //     id: 'select',
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label='Select all'
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        //     size: 24
        // },
        {
            accessorKey: 'id',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageSize = table.getState().pagination.pageSize;
                const continuousIndex = pageIndex * pageSize + row.index + 1;
                return <div>{continuousIndex}</div>;
            }
        },
        {
            accessorKey: 'fmH_Id',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Head' />,
            cell: ({ row }) => (
                <Controller
                    name={`headInstallments.${row.index}.fmH_Id`}
                    control={control}
                    render={({ field, fieldState }) => (
                        <div>
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    const updated = [...headInstallments];
                                    updated[row.index].fmH_Id = value;
                                    setHeadInstallments(updated);
                                }}>
                                <SelectTrigger className={fieldState.error ? 'border-red-500' : ''}>
                                    <SelectValue placeholder='Select Head' />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingHeads ? (
                                        <div className='px-2 py-1 text-gray-500 text-sm'>Loading...</div>
                                    ) : feeHeads.length > 0 ? (
                                        feeHeads.map((h: any) => (
                                            <SelectItem key={h.fmH_Id} value={String(h.fmH_Id)}>
                                                {h.fmH_FeeName}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className='px-2 py-1 text-gray-500 text-sm'>No fee heads available</div>
                                    )}
                                </SelectContent>
                            </Select>
                            {fieldState.error && <p className='mt-1 text-red-500 text-xs'>{fieldState.error.message}</p>}
                        </div>
                    )}
                />
            )
        },
        {
            accessorKey: 'fmI_Id',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Installment' />,
            cell: ({ row }) => (
                <Controller
                    name={`headInstallments.${row.index}.fmI_Id`}
                    control={control}
                    render={({ field, fieldState }) => (
                        <div>
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    const updated = [...headInstallments];
                                    updated[row.index].fmI_Id = value;
                                    setHeadInstallments(updated);
                                }}>
                                <SelectTrigger className={fieldState.error ? 'border-red-500' : ''}>
                                    <SelectValue placeholder='Select Installment' />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingInstallments ? (
                                        <div className='px-2 py-1 text-gray-500 text-sm'>Loading...</div>
                                    ) : installments.length > 0 ? (
                                        installments.map((i: any) => (
                                            <SelectItem key={i.fmI_Id} value={String(i.fmI_Id)}>
                                                {i.fmI_Name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className='px-2 py-1 text-gray-500 text-sm'>No installments available</div>
                                    )}
                                </SelectContent>
                            </Select>
                            {fieldState.error && <p className='mt-1 text-red-500 text-xs'>{fieldState.error.message}</p>}
                        </div>
                    )}
                />
            )
        },
        {
            accessorKey: 'fineApplicable',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Fine' />,
            cell: ({ row }) => (
                <Checkbox
                    checked={row.original.fineApplicable}
                    onCheckedChange={(v) => {
                        const updated = [...headInstallments];
                        updated[row.index].fineApplicable = !!v;
                        setHeadInstallments(updated);
                        setValue('headInstallments', updated);
                    }}
                />
            )
        },
        {
            accessorKey: 'active',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Active' />,
            cell: ({ row }) => (
                <Checkbox
                    checked={row.original.active}
                    onCheckedChange={(v) => {
                        const updated = [...headInstallments];
                        updated[row.index].active = !!v;
                        setHeadInstallments(updated);
                        setValue('headInstallments', updated);
                    }}
                />
            )
        },
        {
            accessorKey: 'commonAmount',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Common Amount' />,
            cell: ({ row }) => (
                <Checkbox
                    checked={row.original.commonAmount}
                    onCheckedChange={(v) => {
                        const updated = [...headInstallments];
                        updated[row.index].commonAmount = !!v;
                        setHeadInstallments(updated);
                        setValue('headInstallments', updated);
                    }}
                />
            )
        }
    ];

    // const addRow = () => {
    //     const nextId = headInstallments.length ? Math.max(...headInstallments.map((h) => h.id)) + 1 : 1;
    //     const newHeadInstallments = [
    //         ...headInstallments,
    //         {
    //             id: nextId,
    //             fmH_Id: '',
    //             fmI_Id: '',
    //             fineApplicable: false,
    //             active: false,
    //             commonAmount: false
    //         }
    //     ];
    //     setHeadInstallments(newHeadInstallments);
    //     setValue('headInstallments', newHeadInstallments);
    // };

    const addRow = () => {
        const nextId = headInstallments.length ? Math.max(...headInstallments.map((h) => h.id)) + 1 : 1;

        const newHeadInstallments = [
            ...headInstallments,
            {
                id: nextId,
                fmH_Id: '',
                fmI_Id: '',
                fineApplicable: false,
                active: false,
                commonAmount: false
            }
        ];

        setHeadInstallments(newHeadInstallments);
        setValue('headInstallments', newHeadInstallments);

        // show Clear button after first add
        setShowClearButton(true);
    };

    // const clearRows = () => {
    //     const defaultHeadInstallments = [
    //         {
    //             id: 1,
    //             fmH_Id: '',
    //             fmI_Id: '',
    //             fineApplicable: false,
    //             active: false,
    //             commonAmount: false
    //         }
    //     ];
    //     setHeadInstallments(defaultHeadInstallments);
    //     setValue('headInstallments', defaultHeadInstallments);
    //     reset();
    // };

    const clearRows = () => {
        if (headInstallments.length > 1) {
            const newList = headInstallments.slice(0, -1); // remove last row
            setHeadInstallments(newList);
            setValue('headInstallments', newList);

            if (newList.length === 1) {
                setShowClearButton(false); // hide Clear button again
            }
        }
    };

    const saveRows: SubmitHandler<FormFields> = async (data) => {
        const payload = {
            // mI_Id: 30,
            asmaY_Id: Number(data.academicYear),
            fmG_Id: Number(data.classCategory),
            // userId: 21602,
            feeHeads: data.headInstallments.map((h) => ({
                fmH_Id: Number(h.fmH_Id),
                fmI_Id: Number(h.fmI_Id),
                fineApplicable: h.fineApplicable ? 'Y' : 'N',
                commonAmount: h.commonAmount ? 'Y' : 'N',
                active: h.active ? '1' : '0',
                fyghM_Id: 0
            }))
        };
        console.log('Payload to save:', JSON.stringify(payload));
        try {
            const res = await addMasterYearlyGroupMapping(payload);
            const ok = res && (res.success === undefined || res.success === true);
            if (ok) {
                toast.success(res?.message);
                clearRows();
                try {
                    reset();
                    onSuccess?.();

                    //await refetchAll();
                } catch (fetchErr) {
                    console.error('Error fetching table after save:', fetchErr);
                }
            } else {
                toast.error(res?.message || 'Failed to save: Unknown error');
            }
        } catch (err) {
            console.error(err);
            toast.error((err as any)?.message || 'Error saving data');
        }
    };

    return (
        <div className='mt-5 space-y-6'>
            <Card>
                {/* <CardHeader>
                    <CardTitle className='text-blue-700'>YEARLY FEE GROUP MAPPING</CardTitle>
                </CardHeader> */}
                <CardContent className='mt-10 grid grid-cols-2 items-center gap-4'>
                    <div>
                        <Label>
                            Academic Year <span className='text-red-500'>*</span>
                        </Label>

                        <Select
                            onValueChange={(value) => {
                                setAcademicYear(value);
                                setValue('academicYear', value);
                            }}
                            value={academicYear || ''}>
                            <SelectTrigger className={errors.academicYear ? 'border-red-500' : ''}>
                                <SelectValue placeholder='Select Year' />
                            </SelectTrigger>

                            <SelectContent>
                                {academicYears.length ? (
                                    academicYears.map((y: any) => (
                                        <SelectItem key={y.asmaY_Id} value={y.asmaY_Id?.toString() || ''}>
                                            {y.asmaY_Year}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className='px-2 py-1 text-gray-500 text-sm'>No academic years available</div>
                                )}
                            </SelectContent>
                        </Select>

                        {errors.academicYear && <p className='mt-1 text-red-500 text-sm'>{errors.academicYear.message}</p>}
                    </div>

                    <div>
                        <Label>
                            Fee Group <span className='text-red-500'>*</span>
                        </Label>

                        <Select
                            onValueChange={(value) => {
                                setFeeGroup(value);
                                setValue('classCategory', value);
                            }}
                            value={feeGroup || ''}>
                            <SelectTrigger className={errors.classCategory ? 'border-red-500' : ''}>
                                <SelectValue placeholder='Select Group' />
                            </SelectTrigger>

                            <SelectContent>
                                {feeGroups.length ? (
                                    feeGroups.map((f: any) => (
                                        <SelectItem key={f.fmG_Id} value={f.fmG_Id?.toString() || ''}>
                                            {f.fmG_GroupName}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className='px-2 py-1 text-gray-500 text-sm'>No fee groups available</div>
                                )}
                            </SelectContent>
                        </Select>

                        {errors.classCategory && <p className='mt-1 text-red-500 text-sm'>{errors.classCategory.message}</p>}
                    </div>
                </CardContent>
            </Card>

            {academicYear && feeGroup && (
                <Card>
                    <CardHeader>
                        <CardTitle className='text-blue-700'>HEAD INSTALLMENT LIST</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GenericDataTable
                            columns={headInstallmentColumns}
                            data={headInstallments}
                            totalItems={headInstallments.length}
                            isLoading={false}
                        />
                        {errors.headInstallments && <p className='mt-2 text-red-500 text-sm'>{errors.headInstallments.message}</p>}

                        <div className='mt-4 flex items-center justify-end gap-2'>
                            <Button className='w-36' variant='accent' size='sm' onClick={addRow} type='button'>
                                Add another row
                            </Button>
                            <Button
                                className='w-24'
                                variant='success'
                                size='sm'
                                onClick={handleSubmit(saveRows)}
                                type='button'
                                disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                            {/* <Button className='w-24' variant='danger' size='sm' onClick={clearRows} type='button'>
                                Clear
                            </Button> */}

                            {showClearButton && (
                                <Button className='w-24' variant='danger' size='sm' onClick={clearRows} type='button'>
                                    Remove
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
