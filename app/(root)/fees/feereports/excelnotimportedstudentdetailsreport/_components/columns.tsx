'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ExcelNotImportedStudentDetailsReport } from '@/types/fees/reports/reports';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const excelnotimportedstudentColumns: ColumnDef<ExcelNotImportedStudentDetailsReport>[] = [
    {
        accessorKey: 'feipsT_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'amsT_AdmNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Admission No' />,
        cell: ({ row }) => <div>{row.getValue('amsT_AdmNo')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'feipsT_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Paid Date' />,
        //cell: ({ row }) => <div>{row.getValue('feipsT_Date')}</div>,
        cell: ({ row }) => (
            <div>
                {new Date(row.getValue('feipsT_Date')).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </div>
        ),
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'feipsT_Amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
        cell: ({ row }) => <div>₹{Number(row.getValue('feipsT_Amount')).toLocaleString('en-IN')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'feipsT_Remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => <div>{row.getValue('feipsT_Remarks')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'feipsT_PayementMode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Payment Mode' />,
        cell: ({ row }) => <div>{row.getValue('feipsT_PayementMode')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false,
        enableHiding: false
    }
];

function ActionButtonsCell({
    rowData
}: {
    rowData: ExcelNotImportedStudentDetailsReport;
}) {
    const { openDeleteForm } = useFormContext<ExcelNotImportedStudentDetailsReport>();

    const handleDelete = useCallback((data: ExcelNotImportedStudentDetailsReport) => openDeleteForm(data), [openDeleteForm]);

    return (
        <div className='justify-left flex gap-2'>
            <ActionButtons rowData={rowData} buttons={{ delete: true }} onDelete={handleDelete} />
        </div>
    );
}

export function printTable(columns: string[] | any[], rows: any[], totalRow?: any) {
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) return;

    // Handle different column formats
    let columnLabels: string[];
    let columnKeys: string[];

    if (Array.isArray(columns) && columns.length > 0 && typeof columns[0] === 'object') {
        // If columns is array of objects {key: string, label: string}
        columnLabels = columns.map((col) => col.label || col.key);
        columnKeys = columns.map((col) => col.key);
    } else {
        // If columns is array of strings
        columnLabels = columns as string[];
        columnKeys = columns as string[];
    }

    const tableHead = columnLabels.map((label) => `<th>${label}</th>`).join('');

    const tableRows = rows
        .map(
            (row) =>
                `<tr>
            ${columnKeys.map((key) => `<td>${row[key] ?? ''}</td>`).join('')}
        </tr>`
        )
        .join('');

    // Only add total row if provided
    const totalRowHtml = totalRow
        ? `<tr style="font-weight:bold;background:#f3f3f3">
            ${columnKeys.map((key) => `<td>${totalRow[key] ?? ''}</td>`).join('')}
           </tr>`
        : '';

    printWindow.document.write(`
        <html>
        <head>
            <title>Excel Not Imported Student Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { text-align: center; margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 6px; font-size: 12px; }
                th { background: #eaeaea; }
                tr:nth-child(even) td { background: #fafafa; }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <h2>Excel Not Imported Student Report</h2>
            <table>
                <thead>
                    <tr>${tableHead}</tr>
                </thead>
                <tbody>
                    ${tableRows}
                    ${totalRowHtml}
                </tbody>
            </table>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}
