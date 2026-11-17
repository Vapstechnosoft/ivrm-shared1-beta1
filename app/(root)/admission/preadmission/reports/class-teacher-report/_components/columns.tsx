'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IClassTeacherReportList } from '@/types/admission/preadmission/reports';
import type { ColumnDef } from '@tanstack/react-table';

const serialNumberColumn: ColumnDef<IClassTeacherReportList> = {
    accessorKey: 'RowNo',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
    cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const continuousIndex = pageIndex * pageSize + row.index + 1;
        return <div className='pl-6'>{continuousIndex}</div>;
    },
    enableSorting: true,
    enableHiding: false
};

const staffNameColumn: ColumnDef<IClassTeacherReportList> = {
    accessorKey: 'IVRMSTAUL_UserName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Staff Name' />,
    cell: ({ row }) => <div>{row.getValue('IVRMSTAUL_UserName') || 'N.A'}</div>
};

const classNameColumn: ColumnDef<IClassTeacherReportList> = {
    accessorKey: 'ASMCL_ClassName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
    cell: ({ row }) => <div>{row.getValue('ASMCL_ClassName') || 'N.A'}</div>
};

const sectionColumn: ColumnDef<IClassTeacherReportList> = {
    accessorKey: 'ASMC_SectionName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
    cell: ({ row }) => <div>{row.getValue('ASMC_SectionName') || 'N.A'}</div>
};

const subjectColumn: ColumnDef<IClassTeacherReportList> = {
    accessorKey: 'PAMS_SubjectName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Subject' />,
    cell: ({ row }) => <div>{row.getValue('PAMS_SubjectName') || 'N.A'}</div>
};

export const getClassTeacherReportColumns = (reportType: string): ColumnDef<IClassTeacherReportList>[] => {
    const baseColumns = [serialNumberColumn, staffNameColumn, classNameColumn, sectionColumn];

    switch (reportType) {
        case 'subject_teacher_attendance':
            return [...baseColumns, subjectColumn];

        case 'class_teacher_attendance':
        case 'class_teacher':
            return [...baseColumns];

        default:
            return [...baseColumns, subjectColumn];
    }
};
