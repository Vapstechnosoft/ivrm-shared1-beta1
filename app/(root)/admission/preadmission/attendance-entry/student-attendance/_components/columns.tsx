'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { StudentAttendanceStudent } from '@/server/admission/preadmission/attendance-entry/student_attendance';
import type { ColumnDef } from '@tanstack/react-table';

export const studentAttendanceColumns: ColumnDef<StudentAttendanceStudent>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL. NO.' className='w-[80px] text-center' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-[80px] text-center font-medium'>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'studentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('studentName')}</div>
    },
    {
        accessorKey: 'amsT_AdmNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Admission No.' />,
        cell: ({ row }) => <div>{row.getValue('amsT_AdmNo')}</div>
    },
    {
        accessorKey: 'amaY_RollNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Roll No.' className='text-center' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('amaY_RollNo')}</div>
    },
    {
        id: 'attendance',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Attendance' className='text-center' />,
        cell: ({ row }) => {
            return (
                <div className='flex justify-center'>
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label='Select row'
                        className='translate-y-[2px]'
                    />
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false
    }
];
