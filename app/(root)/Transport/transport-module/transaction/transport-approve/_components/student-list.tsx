'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveTransportApprovedList } from '@/server/transport/transport-module/transaction/transport-approve';
import type { IApproveRejectPayload, IStudentData } from '@/types/transport/transport-module/transaction/transport-approve';
import type { ColumnDef } from '@tanstack/react-table';
import { Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface StudentListProps {
    data: IStudentData[];
    searchParams: any;
    onRefresh: () => void;
}

export default function StudentList({ data, searchParams, onRefresh }: StudentListProps) {
    const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
    const [smsSelected, setSmsSelected] = useState<Record<number, boolean>>({});
    const [emailSelected, setEmailSelected] = useState<Record<number, boolean>>({});
    const [tableData, setTableData] = useState<IStudentData[]>(data);
    const [isLoading, setIsLoading] = useState(false);

    // Checkbox toggles
    const toggleAll = (checked: boolean) => {
        const newSelected: Record<number, boolean> = {};
        if (checked) {
            tableData.forEach((row, index) => {
                newSelected[index] = true;
            });
        }
        setSelectedRows(newSelected);
    };

    const toggleRow = (index: number, checked: boolean) => {
        setSelectedRows((prev) => ({ ...prev, [index]: checked }));
    };

    const toggleSms = (index: number, checked: boolean) => {
        setSmsSelected((prev) => ({ ...prev, [index]: checked }));
    };

    const toggleEmail = (index: number, checked: boolean) => {
        setEmailSelected((prev) => ({ ...prev, [index]: checked }));
    };

    const handleSave = async (flag: 'A' | 'R') => {
        const selectedIndices = Object.keys(selectedRows)
            .filter((k) => selectedRows[Number(k)])
            .map(Number);
        if (selectedIndices.length === 0) {
            toast.warning('Please select at least one student');
            return;
        }

        const selectedData = selectedIndices.map((index) => {
            const row = tableData[index];
            return {
                ...row,
                chksms: smsSelected[index] || false,
                chkemail: emailSelected[index] || false
            };
        });

        setIsLoading(true);
        try {
            const payload: IApproveRejectPayload = {
                data_array: selectedData,
                ASMAY_Id: searchParams.ASMAY_Id,
                ASMCL_Id: searchParams.ASMCL_Id,
                Flag: flag,
                smsclick: selectedData
                    .filter((d) => d.chksms)
                    .map((d) => ({ AMST_Id: d.amsT_Id, studentname: d.studentname, remarks1: d.remarks1, ASTA_Id: 0 })),
                emailclick: selectedData
                    .filter((d) => d.chkemail)
                    .map((d) => ({
                        AMST_Id: d.amsT_Id,
                        studentname: d.studentname,
                        studentremarkemail1: d.studentremarkemail1,
                        ASTA_Id: 0
                    }))
            };

            const response = await saveTransportApprovedList(payload);
            if (response && response.returnval === true) {
                toast.success(response.message || 'Saved successfully');
                onRefresh();
            } else {
                toast.error(response.message || 'Failed to save');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const columns: ColumnDef<IStudentData>[] = [
        {
            id: 'select',
            header: () => (
                <Checkbox
                    checked={tableData.length > 0 && Object.keys(selectedRows).length === tableData.length}
                    onCheckedChange={(val) => toggleAll(!!val)}
                />
            ),
            cell: ({ row }) => <Checkbox checked={!!selectedRows[row.index]} onCheckedChange={(val) => toggleRow(row.index, !!val)} />
        },
        {
            id: 'sms',
            header: 'SMS',
            cell: ({ row }) => <Checkbox checked={!!smsSelected[row.index]} onCheckedChange={(val) => toggleSms(row.index, !!val)} />
        },
        {
            id: 'email',
            header: 'Email',
            cell: ({ row }) => <Checkbox checked={!!emailSelected[row.index]} onCheckedChange={(val) => toggleEmail(row.index, !!val)} />
        },
        {
            header: 'SL.No',
            cell: ({ row }) => row.index + 1
        },
        {
            accessorKey: 'studentname',
            header: 'Student Name'
        },
        {
            accessorKey: 'applicationno',
            header: 'App No'
        },
        {
            accessorKey: 'amsT_AdmNo',
            header: 'Adm No'
        },
        {
            accessorKey: 'asmcL_ClassName',
            header: 'Class'
        },
        {
            accessorKey: 'pickuplocation',
            header: 'Pickup Location'
        },
        {
            accessorKey: 'drouplocation',
            header: 'Drop Location'
        },
        // ... (Simplified for brevity, would include all columns)
        {
            header: 'Pickup Session',
            cell: ({ row }) => (
                <Select
                    disabled={!selectedRows[row.index]}
                    value={row.original.PickUp_Session?.toString()}
                    onValueChange={(val) => {
                        const newData = [...tableData];
                        newData[row.index].PickUp_Session = Number(val);
                        setTableData(newData);
                    }}>
                    <SelectTrigger className='w-[150px]'>
                        <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                        {row.original.sesslist_list_p?.map((s: any) => (
                            <SelectItem key={s.trmS_Id} value={s.trmS_Id.toString()}>
                                {s.trmS_SessionName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        },
        {
            header: 'Drop Session',
            cell: ({ row }) => (
                <Select
                    disabled={!selectedRows[row.index]}
                    value={row.original.Drop_Session?.toString()}
                    onValueChange={(val) => {
                        const newData = [...tableData];
                        newData[row.index].Drop_Session = Number(val);
                        setTableData(newData);
                    }}>
                    <SelectTrigger className='w-[150px]'>
                        <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                        {row.original.sesslist_list_d?.map((s: any) => (
                            <SelectItem key={s.trmS_Id} value={s.trmS_Id.toString()}>
                                {s.trmS_SessionName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        },
        {
            header: 'Remarks (SMS)',
            cell: ({ row }) =>
                smsSelected[row.index] ? (
                    <Input
                        value={row.original.remarks1 || ''}
                        onChange={(e) => {
                            const newData = [...tableData];
                            newData[row.index].remarks1 = e.target.value;
                            setTableData(newData);
                        }}
                    />
                ) : null
        }
    ];

    return (
        <div className='space-y-4'>
            <GenericDataTable data={tableData} columns={columns} total={tableData.length} isLoading={isLoading} />
            <div className='flex justify-center space-x-4'>
                <Button onClick={() => handleSave('A')} disabled={isLoading} className='bg-primary hover:bg-primary/90'>
                    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
                    Approve
                </Button>
                <Button onClick={() => handleSave('R')} disabled={isLoading} variant='destructive'>
                    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <X className='mr-2 h-4 w-4' />}
                    Reject
                </Button>
            </div>
        </div>
    );
}
