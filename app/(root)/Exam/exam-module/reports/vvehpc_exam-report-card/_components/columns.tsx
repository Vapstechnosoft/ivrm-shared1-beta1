'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IExamReportCard, ISubject } from '@/types/exam/exam-module/report';
import type { ColumnDef } from '@tanstack/react-table';

export const getExamReportCardColumns = (subjects: ISubject[]): ColumnDef<IExamReportCard>[] => {
    const cols: ColumnDef<IExamReportCard>[] = [];

    cols.push({
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl No' />,
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination;
            return <div className='text-center'>{pageIndex * pageSize + row.index + 1}</div>;
        }
    });

    cols.push({
        accessorKey: 'amsT_FirstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div className='text-center font-medium'>{row.getValue('amsT_FirstName')}</div>
    });

    cols.push({
        accessorKey: 'amaY_RollNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Roll No' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('amaY_RollNo') ?? '-'}</div>
    });

    cols.push({
        accessorKey: 'amsT_AdmNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Adm No' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('amsT_AdmNo') ?? '-'}</div>
    });

    cols.push({
        accessorKey: 'amsT_RegistrationNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reg No' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('amsT_RegistrationNo') ?? '-'}</div>
    });

    subjects
        .filter((s) => s.eyceS_AplResultFlg)
        .forEach((subj) => {
            cols.push({
                id: `subject_${subj.ismS_Id}`,
                header: () => <div className='break-words text-center font-bold text-xs uppercase'>{subj.ismS_SubjectName}</div>,
                cell: ({ row }) => renderStackedCell(row.original, subj)
            });
        });

    const resultSubjects = subjects.filter((s) => s.eyceS_AplResultFlg);
    if (resultSubjects.length > 0) {
        cols.push(
            {
                accessorKey: 'estmP_TotalMaxMarks',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Total' />,
                cell: ({ row }) => (
                    <div className='text-center'>
                        {row.original.estmP_Result === 'AB' ? '' : (row.getValue('estmP_TotalMaxMarks') ?? '-')}
                    </div>
                )
            },
            {
                accessorKey: 'estmP_TotalObtMarks',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Obtained' />,
                cell: ({ row }) => (
                    <div className='text-center'>
                        {row.original.estmP_Result === 'AB' ? '' : (row.getValue('estmP_TotalObtMarks') ?? '-')}
                    </div>
                )
            },
            {
                accessorKey: 'estmP_Percentage',
                header: ({ column }) => <DataTableColumnHeader column={column} title='%' />,
                cell: ({ row }) => (
                    <div className='text-center'>
                        {row.original.estmP_Result === 'AB' ? '' : `${row.getValue('estmP_Percentage') ?? '-'}%`}
                    </div>
                )
            },
            {
                accessorKey: 'estmP_TotalGrade',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Grade' />,
                cell: ({ row }) => (
                    <div className='text-center'>{row.original.estmP_Result === 'AB' ? '' : (row.getValue('estmP_TotalGrade') ?? '-')}</div>
                )
            }
        );
    }

    return cols;
};

function renderStackedCell(row: IExamReportCard, subj: ISubject) {
    const mark = row.sub_list?.find((m) => m.ismS_Id === subj.ismS_Id);
    if (!mark) return <div className='text-center text-gray-400'>-</div>;

    if (mark.estmpS_PassFailFlg === 'AB') {
        return <div className='text-center font-bold text-red-600'>AB</div>;
    }

    const showMarks = subj.eyceS_MarksDisplayFlg && subj.type === 'Marks';
    const showGrade = subj.eyceS_GradeDisplayFlg && subj.type === 'Grade';

    return (
        <div className='space-y-0 text-center leading-tight'>
            <div className='font-medium'>{showMarks ? (mark.estmpS_ObtainedMarks ?? '-') : '-'}</div>
            {showGrade && <div className='text-blue-700 text-xs'>{mark.estmpS_ObtainedGrade ?? '-'}</div>}
        </div>
    );
}
