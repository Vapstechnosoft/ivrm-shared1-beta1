'use client';

import { Button } from '@/components/ui/button';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IClassWork } from '@/schemas/upload/transactions/ivrm-classwork.schema';
import { createColumnHelper } from '@tanstack/react-table';
import { Database } from 'lucide-react'; // Added Database icon
import { useCallback } from 'react';

const columnHelper = createColumnHelper<IClassWork>();

// export const verifyClassWorkColumns = [
//     columnHelper.accessor((row, index) => index + 1, {
//         id: 'slNo',
//         header: ({ column }) => <ColumnHeader column={column} title='SL NO' />,
//         cell: (info) => <div className='text-center'>{info.getValue()}</div>,
//         enableSorting: false
//     }),

//     columnHelper.accessor('ismS_SubjectName', {
//         header: ({ column }) => <ColumnHeader column={column} title='Subject' />
//     }),

//     columnHelper.accessor('icW_Topic', {
//         header: ({ column }) => <ColumnHeader column={column} title='Topic' />
//     }),

//     columnHelper.accessor('icW_SubTopic', {
//         header: ({ column }) => <ColumnHeader column={column} title='Sub Topic' />
//     }),

//     columnHelper.accessor('icW_Content', {
//         header: ({ column }) => <ColumnHeader column={column} title='Content' />
//     }),

//     columnHelper.accessor('asmcL_ClassName', {
//         header: ({ column }) => <ColumnHeader column={column} title='Class' />,
//         cell: (info) => <div className='text-center'>{info.getValue()}</div>
//     }),

//     columnHelper.accessor('asmC_SectionName', {
//         header: ({ column }) => <ColumnHeader column={column} title='Section' />,
//         cell: (info) => <div className='text-center'>{info.getValue()}</div>
//     }),

//     // Mocking CreatedDate since it might not be in IClassWork strict type but is in data
//     columnHelper.accessor('createdDate', {
//         header: ({ column }) => <ColumnHeader column={column} title='Update Date / Time' />,
//         cell: (info) => {
//             const dateVal = info.getValue() as string;
//             if (!dateVal) return '';
//             const date = new Date(dateVal);
//             return (
//                 <div className='flex flex-col items-center'>
//                     <span>{date.toLocaleDateString()}</span>
//                     <span className='text-xs text-muted-foreground'>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                 </div>
//             );
//         }
//     }),

//     columnHelper.accessor('icW_FromDate', {
//         header: ({ column }) => <ColumnHeader column={column} title='Start Date' />,
//         cell: (info) => {
//             const date = info.getValue();
//             return date ? new Date(date).toLocaleDateString() : '';
//         }
//     }),

//     columnHelper.accessor('ICW_FilePath_Array', {
//         header: ({ column }) => <ColumnHeader column={column} title='Attachment' />,
//         cell: ({ row }) => {
//             const files = row.original.ICW_FilePath_Array || [];
//             const urls = row.original.ICW_Attachment_Array || [];

//             const allAttachments = [
//                 ...files.map(f => ({ ...f, type: 'File' })),
//                 ...urls.map(u => ({ ...u, type: 'URL', icW_FilePath: u.ICW_FilePath, FileName: 'External Link' }))
//             ].filter(x => x.icW_FilePath);

//             if (allAttachments.length === 0) {
//                 return <div className='text-center'>---</div>;
//             }

//             return (
//                 <div className='flex justify-center'>
//                     <Popover>
//                         <PopoverTrigger asChild>
//                             <Button variant='ghost' size='icon' className='text-primary hover:text-primary/80'>
//                                 <Eye className='h-4 w-4' />
//                             </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className='w-80'>
//                             <div className='grid gap-4'>
//                                 <div className='space-y-2'>
//                                     <h4 className='font-medium leading-none'>Attachments</h4>
//                                     <p className='text-sm text-muted-foreground'>
//                                         List of files and links associated.
//                                     </p>
//                                 </div>
//                                 <div className='grid gap-2'>
//                                     {allAttachments.map((item, index) => (
//                                         <div key={index} className='flex items-center justify-between border-b pb-2 last:border-0'>
//                                             <div className='flex flex-col'>
//                                                 <span className='text-sm font-medium'>{item.FileName || 'Attachment'}</span>
//                                                 <span className='text-xs text-muted-foreground'>{item.type}</span>
//                                             </div>
//                                             <Button size='sm' variant='outline' asChild>
//                                                 <Link href={item.icW_FilePath || '#'} target='_blank' prefetch={false}>
//                                                     View
//                                                 </Link>
//                                             </Button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </PopoverContent>
//                     </Popover>
//                 </div>
//             )
//         }
//     }),

//     columnHelper.display({
//         id: 'actions',
//         header: ({ column }) => <ColumnHeader column={column} title='Action' />,
//         cell: ({ row }) => {
//             return (
//                 <div className='flex items-center justify-center gap-2'>
//                     <ActionButtonsCell rowData={row.original} />
//                 </div>
//             );
//         }
//     })
// ];

function ActionButtonsCell({ rowData }: { rowData: IClassWork }) {
    const { openDetailsView } = useFormContext<IClassWork>();

    const handleMarksEntry = useCallback(
        (data: IClassWork) => {
            openDetailsView(data);
        },
        [openDetailsView]
    );

    return (
        <div className='flex items-center gap-2'>
            {/* Show only Enter Marks button for verification page */}
            <Button
                variant='ghost'
                size='icon'
                onClick={() => handleMarksEntry(rowData)}
                title='Enter Marks'
                className='hover:text-primary'>
                <Database className='h-4 w-4' />
            </Button>
        </div>
    );
}
