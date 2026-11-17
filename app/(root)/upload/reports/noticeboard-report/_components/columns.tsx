// 'use client';

// import { Button } from '@/components/ui/button';
// import type { INoticeBoardReport } from '@/types/upload/reports/noticeboard-report';
// import type { ColumnDef } from '@tanstack/react-table';
// import { Eye } from 'lucide-react';
// import { format } from 'date-fns';
// import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

// interface GetColumnsProps {
//     onViewAttachment: (item: INoticeBoardReport) => void;
// }

// export const getColumns = ({ onViewAttachment }: GetColumnsProps): ColumnDef<INoticeBoardReport>[] => [
//     {
//         id: 'slno',
//         header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' />,
//         cell: ({ row }) => row.index + 1,
//     },
//     {
//         accessorKey: 'intB_Title',
//         header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
//         cell: ({ row }) => <div>{row.getValue('intB_Title')}</div>,
//     },
//     {
//         accessorKey: 'asmcL_ClassName',
//         header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
//         cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>,
//     },
//     {
//         accessorKey: 'asmC_SectionName',
//         header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
//         cell: ({ row }) => <div>{row.getValue('asmC_SectionName')}</div>,
//     },
//     {
//         accessorKey: 'intbupl_Date',
//         header: ({ column }) => <DataTableColumnHeader column={column} title='Upload Date' />,
//         cell: ({ row }) => {
//             const date = row.original.intbupl_Date;
//             return date ? format(new Date(date), 'dd-MM-yyyy') : '--';
//         },
//     },
//     {
//         accessorKey: 'employeename',
//         header: ({ column }) => <DataTableColumnHeader column={column} title='Uploaded By' />,
//         cell: ({ row }) => <div>{row.getValue('employeename')}</div>,
//     },
//     {
//         id: 'actions',
//         header: ({ column }) => <DataTableColumnHeader column={column} title='View Attachment' className='justify-center' />,
//         cell: ({ row }) => {
//             const item = row.original;
//             return item.filecount > 0 ? (
//                 <div className='flex justify-center'>
//                     <Button variant='ghost' size='sm' className='text-primary' onClick={() => onViewAttachment(item)}>
//                         <Eye className='h-4 w-4 mr-1' /> View
//                     </Button>
//                 </div>
//             ) : (
//                 <div className='flex justify-center'>--</div>
//             );
//         },
//     },
// ];

