'use client';

import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { MappedEventCoe } from '@/types/coe/master-coe';
import type { ColumnDef } from '@tanstack/react-table';
import { Briefcase, Eye, FileImage, FileVideo, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ListViewDialog } from './list-view-dialog';
import { getMappedEventDetails } from '@/server/coe/masters/masterevent';

export const mappingColumns: ColumnDef<MappedEventCoe>[] = [
    {
        accessorKey: 'coeE_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} className='w-full pl-6' title='Sl. No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
    },
    {
        accessorKey: 'coemE_EventName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Event Name' />,
        cell: ({ row }) => <div>{row.getValue('coemE_EventName')}</div>,
    },
    {
        accessorKey: 'images',
        header: 'Images',
        cell: ({ row }) => (
            <ListViewDialog
                title="Images List"
                type="image"
                data={row.original.images_listCoe || []}
                fetchData={async () => {
                    console.log("row original", row.original.coeE_Id);
                    const res = await getMappedEventDetails(row.original.coeE_Id);
                    console.log("res image list", res);
                    return (res.data.edit_images_list as any[]) || [];
                }}
                trigger={
                    <Button variant='ghost' size='icon' className='h-8 w-8 text-green-600'>
                        <FileImage className='h-4 w-4' />
                    </Button>
                }
            />
        ),
    },
    {
        accessorKey: 'videos',
        header: 'Videos',
        cell: ({ row }) => (
            <ListViewDialog
                title="Videos List"
                type="video"
                data={row.original.videos_list || []}
                fetchData={async () => {
                    const res = await getMappedEventDetails(row.original.coeE_Id);
                    return (res.data.edit_videos_list as any[]) || [];
                }}
                trigger={
                    <Button variant='ghost' size='icon' className='h-8 w-8 text-blue-600'>
                        <FileVideo className='h-4 w-4' />
                    </Button>
                }
            />
        ),
    },
    {
        accessorKey: 'classes',
        header: 'Classes',
        cell: ({ row }) => (
            <ListViewDialog
                title="Classes List"
                type="class"
                data={row.original.stu_class_list || []}
                fetchData={async () => {
                    const res = await getMappedEventDetails(row.original.coeE_Id);
                    return (res.data.edit_stu_class_list as any[]) || [];
                }}
                trigger={
                    <Button variant='ghost' size='icon' className='h-8 w-8 text-blue-600'>
                        <Eye className='h-4 w-4' />
                    </Button>
                }
            />
        ),
    },
    {
        accessorKey: 'employees',
        header: 'Employees',
        cell: ({ row }) => (
            <ListViewDialog
                title="Employees List"
                type="employee"
                data={row.original.emp_type_list || []}
                fetchData={async () => {
                    const res = await getMappedEventDetails(row.original.coeE_Id);
                    return (res.data.edit_emp_type_list as any[]) || [];
                }}
                trigger={
                    <Button variant='ghost' size='icon' className='h-8 w-8 text-orange-600'>
                        <Briefcase className='h-4 w-4' />
                    </Button>
                }
            />
        ),
    },
    {
        accessorKey: 'others',
        header: 'Others',
        cell: ({ row }) => (
            <ListViewDialog
                title="Others List"
                type="other"
                data={row.original.others_list || []}
                fetchData={async () => {
                    const res = await getMappedEventDetails(row.original.coeE_Id);
                    return (res.data.edit_oth_mobilenos_list as any[]) || [];
                }}
                trigger={
                    <Button variant='ghost' size='icon' className='h-8 w-8 text-red-600'>
                        <Users className='h-4 w-4' />
                    </Button>
                }
            />
        ),
    },
    {
        accessorKey: 'alumni',
        header: 'Alumni',
        cell: ({ row }) => (
            <ListViewDialog
                title="Alumni List"
                type="alumni"
                data={row.original.alumni_list || []}
                fetchData={async () => {
                    const res = await getMappedEventDetails(row.original.coeE_Id);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return (res.data.alumniClslist as any[]) || [];
                }}
                trigger={
                    <Button variant='ghost' size='icon' className='h-8 w-8 text-blue-600'>
                        <GraduationCap className='h-4 w-4' />
                    </Button>
                }
            />
        ),
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: MappedEventCoe }) {
    const { openEditForm, openToggleForm, openDeleteForm, openDetailsView } = useFormContext<MappedEventCoe>();

    const handleEdit = useCallback(
        (data: MappedEventCoe) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: MappedEventCoe) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    const handleDelete = useCallback(
        (data: MappedEventCoe) => {
            openDeleteForm(data);
        },
        [openDeleteForm]
    );
    const handleView = useCallback(() => openDetailsView(rowData), [openDetailsView, rowData]);
    return (
        <div className='flex justify-center gap-2'>
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Mapped Event Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: true, delete: false }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='coeE_ActiveFlag'
            />
        </div>

    );


}


