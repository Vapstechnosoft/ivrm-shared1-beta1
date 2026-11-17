import type { ColumnDef } from '@tanstack/react-table';

export const attendanceSummaryColumns: ColumnDef<any>[] = [
    {
        accessorKey: 'RowNo',
        header: 'Sl. No.',
        cell: (info) => info.getValue()
    },
    {
        accessorKey: 'ASMCL_ClassName',
        header: 'Class'
    },
    {
        accessorKey: 'ASMC_SectionName',
        header: 'Section'
    },
    {
        accessorKey: 'PRESENT',
        header: 'Present'
    },
    {
        accessorKey: 'ABSENT',
        header: 'Absent'
    },
    {
        accessorKey: 'HALFDAY',
        header: 'Half Day'
    },
    {
        accessorKey: 'TOTAL',
        header: 'Total'
    }
];

export const absentStudentColumns: ColumnDef<any>[] = [
    {
        accessorKey: 'RowNo',
        header: 'Sl. No.',
        cell: (info) => info.getValue()
    },
    {
        accessorKey: 'studentname',
        header: 'Student Name'
    },
    {
        accessorKey: 'classsection',
        header: 'Class-Section'
    },
    {
        accessorKey: 'FirstHalf',
        header: 'First Half'
    },
    {
        accessorKey: 'SecondHalf',
        header: 'Second Half'
    },
    {
        accessorKey: 'ASA_Class_Attended',
        header: 'ASA Class Attended'
    }
];
