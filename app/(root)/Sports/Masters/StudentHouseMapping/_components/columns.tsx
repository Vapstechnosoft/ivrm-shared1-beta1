'use client';

import { ColumnDef } from '@tanstack/react-table';
import { StudentHouseMappingDTO } from '@/types/sports/masters/student-house-mapping';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

// Define the columns
export const columns = (
    onEdit: (data: StudentHouseMappingDTO) => void,
    onDelete: (id: number, activeFlag: boolean) => void
): ColumnDef<StudentHouseMappingDTO>[] => [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'index',
            header: 'SL. No.',
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: 'asmaY_Year',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Year
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'spccmH_HouseName',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        House Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'studentname',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Student Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'amsT_AdmNo',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Adm No.
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'asmcL_ClassName',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Class
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'asmC_SectionName',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Section
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'spccsH_Remarks',
            header: 'Remark',
        },
        {
            accessorKey: 'spccmH_ActiveFlag',
            header: 'Active',
            cell: ({ row }) => (
                <Badge variant={row.original.spccmH_ActiveFlag ? 'success' : 'destructive'}>
                    {row.original.spccmH_ActiveFlag ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(record)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center space-x-2">
                            <span className={record.spccmH_ActiveFlag ? "text-green-600" : "text-red-600"}>
                                {record.spccmH_ActiveFlag ? "Active" : "Inactive"}
                            </span>
                            <Switch
                                checked={record.spccmH_ActiveFlag}
                                onCheckedChange={() => onDelete(record.spccsH_Id!, record.spccmH_ActiveFlag!)}
                            />
                        </div>
                    </div>
                );
            },
        },
    ];
