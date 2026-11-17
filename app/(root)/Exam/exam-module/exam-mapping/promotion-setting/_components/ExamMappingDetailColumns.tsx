'use client'

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import type { ColumnDef } from '@tanstack/react-table'

export interface IExamMappedDetails {
    slNo: number
    examName: string
    examCode: string
    marks: number
    conversionReq: boolean
}

export const ExamMappingDetailColumns: ColumnDef<IExamMappedDetails>[] = [

    { accessorKey: 'slNo', header: ({ column }) => <DataTableColumnHeader title='SLNO' column={column} />, cell: ({ row }) => row.index + 1 },

    { accessorKey: 'examName', header: ({ column }) => <DataTableColumnHeader title='Exam Name' column={column} /> },

    { accessorKey: 'examCode', header: ({ column }) => <DataTableColumnHeader title='Exam Code' column={column} /> },

    { accessorKey: 'marks', header: ({ column }) => <DataTableColumnHeader title='Marks/Percentage' column={column} /> },

    {
        accessorKey: 'conversionReq',
        header: ({ column }) => <DataTableColumnHeader title='Conversion Req Or Not' column={column} />,
        cell: ({ row }) => row.original.conversionReq ? '✔' : '✖'
    }
]
