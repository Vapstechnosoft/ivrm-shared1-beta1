import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Textarea } from '@/components/ui/textarea';
import type { IExamWiseStudentRemarksStudent } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

export const ExamWiseStudentRemarksColumns = (
    updateStudent: (id: number, remarks: string) => void,
    validationErrors?: Record<number, string> // Add validation errors parameter
): ColumnDef<IExamWiseStudentRemarksStudent>[] => [
    // SELECT
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
        enableSorting: false,
        size: 24
    },

    // SL.NO
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const page = table.getState().pagination.pageIndex;
            const size = table.getState().pagination.pageSize;
            return <span>{page * size + row.index + 1}</span>;
        },
        enableSorting: false
    },

    // STUDENT INFO
    {
        accessorKey: 'amsT_FirstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => {
            const d = row.original;
            return (
                <div className='flex flex-col text-sm leading-6'>
                    <div>
                        <b>Name :</b> {d.amsT_FirstName}
                    </div>
                    <div>
                        <b>Adm.No. :</b> {d.amsT_AdmNo}
                    </div>
                    <div>
                        <b>Reg.No. :</b> {d.amsT_RegistrationNo}
                    </div>
                    <div>
                        <b>Roll.No. :</b> {d.amaY_RollNo}
                    </div>
                </div>
            );
        }
    },

    // MARKS
    {
        accessorKey: 'estmP_TotalObtMarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks' />,
        cell: ({ row }) => {
            const d = row.original;
            return (
                <div className='flex flex-col text-sm leading-6'>
                    <div>
                        <b>Obtained Marks :</b> {d.estmP_TotalObtMarks ?? '-'}
                    </div>
                    <div>
                        <b>Max Marks :</b> {d.estmP_TotalMaxMarks ?? '-'}
                    </div>
                    <div>
                        <b>Percentage :</b> {d.estmP_Percentage ?? '-'}
                    </div>
                </div>
            );
        }
    },

    // REMARKS with error message
    {
        accessorKey: 'emeR_Remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => {
            const { amsT_Id, emeR_Remarks } = row.original;

            // Local field value → avoids re-renders
            const [localValue, setLocalValue] = useState(emeR_Remarks ?? '');

            // Check if this row has a validation error
            const errorMessage = validationErrors?.[amsT_Id];

            // Update local when row data changes (pagination / reload)
            useEffect(() => {
                setLocalValue(emeR_Remarks ?? '');
            }, [emeR_Remarks]);

            const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const newValue = e.target.value;
                setLocalValue(newValue);

                // If there was an error and user starts typing, clear it immediately
                if (errorMessage && newValue.trim()) {
                    // We'll let the parent component handle clearing the error
                }
            };

            const handleBlur = () => {
                // Only update parent on blur
                updateStudent(amsT_Id, localValue);

                // Clear validation error if text is now filled
                if (errorMessage && localValue.trim()) {
                    // Error will be cleared by parent component
                }
            };

            return (
                <div className='space-y-1'>
                    <Textarea
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`h-20 resize-none ${errorMessage ? 'border-red-500 focus-visible:ring-red-400' : 'border-blue-300 focus-visible:ring-blue-400'}`}
                        placeholder='Enter remarks'
                    />
                    {errorMessage && <div className='text-red-600 text-xs'>{errorMessage}</div>}
                </div>
            );
        },
        enableSorting: false
    }
];
