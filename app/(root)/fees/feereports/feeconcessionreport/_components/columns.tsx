'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IFeeConcessionReport } from '@/types/fees/reports/reports';
import type { ColumnDef } from '@tanstack/react-table';
import * as XLSX from 'xlsx';

export interface IFeeAuditReport {
    feeGroup: string;
    totalDue: number;
}

export const FeeConcessionReportColumns: ColumnDef<IFeeAuditReport>[] = [
    // 1. Select All / Individual Checkbox
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all rows'
                className='translate-y-[2px]'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40
    },

    // 2. Serial Number (Safe: uses only table state)
    {
        id: 'serial',
        header: () => <div className='text-center'>Sl.No.</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const index = pageIndex * pageSize + row.index + 1;
            return <div className='text-center font-medium'>{index}</div>;
        },
        enableSorting: false,
        enableHiding: false,
        size: 80
    },

    // 3. Fee Group Name
    {
        accessorKey: 'feeGroup',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Group Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('feeGroup')}</div>,
        enableSorting: true
    },

    // 4. Balance Amount - HYDRATION-SAFE VERSION
    // 4. Balance Amount - HYDRATION-SAFE + SAME ALIGNMENT AS FEE GROUP
    {
        accessorKey: 'totalDue',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Balance Amount (₹)' />,
        cell: ({ row }) => {
            const amount = Number(row.getValue('totalDue'));
            // Safe Indian comma formatting (no hydration error)
            const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            return <div className='font-bold text-red-600'>₹{formatted}</div>;
        },
        enableSorting: true,
        sortingFn: 'basic',
        // Optional: if you want header text also left-aligned like Fee Group
        meta: {
            className: 'text-left'
        }
    }
];

export function printTable(columns: string[], rows: any[], sumRow?: any) {
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) return;

    const tableHead = columns.map((col) => `<th>${col}</th>`).join('');

    const tableRows = rows.map((row) => `<tr>${columns.map((col) => `<td>${row[col] ?? ''}</td>`).join('')}</tr>`).join('');

    const totalRow = sumRow
        ? `<tr style="font-weight:bold;background:#f3f3f3">
            ${columns.map((col) => `<td>${sumRow[col] ?? ''}</td>`).join('')}
           </tr>`
        : '';

    printWindow.document.write(`
        <html>
        <head>
            <title>Fee Concession Report</title>
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
            <h2>Fee Concession Report</h2>
            <table>
                <thead>
                    <tr>${tableHead}</tr>
                </thead>
                <tbody>
                    ${tableRows}
                    ${totalRow}
                </tbody>
            </table>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

export function exportToExcelforFGW(rows: IFeeConcessionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        groupName: row.reportname,
        concessionAmount: row.concession
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        groupName: '',
        concessionAmount: rows.reduce((sum, row) => sum + (row.concession || 0), 0)
    };

    // Combine data and totals
    const allData = [...dataForExcel, totalsRow];

    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();

    // Auto-size columns
    const maxWidth = Object.keys(dataForExcel[0] || {}).reduce((acc, key) => {
        const maxLength = Math.max(key.length, ...allData.map((row: any) => String(row[key] || '').length));
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return { ...acc, [key]: { wch: Math.min(maxLength + 2, 50) } };
    }, {});

    worksheet['!cols'] = Object.values(maxWidth);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Group Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforFHW(rows: IFeeConcessionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        HeadName: row.reportname,
        concessionAmount: row.concession
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        HeadName: '',
        concessionAmount: rows.reduce((sum, row) => sum + (row.concession || 0), 0)
    };

    // Combine data and totals
    const allData = [...dataForExcel, totalsRow];

    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();

    // Auto-size columns
    const maxWidth = Object.keys(dataForExcel[0] || {}).reduce((acc, key) => {
        const maxLength = Math.max(key.length, ...allData.map((row: any) => String(row[key] || '').length));
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return { ...acc, [key]: { wch: Math.min(maxLength + 2, 50) } };
    }, {});

    worksheet['!cols'] = Object.values(maxWidth);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Group Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforFCW(rows: IFeeConcessionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        ClassName: row.reportname,
        concessionAmount: row.concession
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        ClassName: '',
        concessionAmount: rows.reduce((sum, row) => sum + (row.concession || 0), 0)
    };

    // Combine data and totals
    const allData = [...dataForExcel, totalsRow];

    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();

    // Auto-size columns
    const maxWidth = Object.keys(dataForExcel[0] || {}).reduce((acc, key) => {
        const maxLength = Math.max(key.length, ...allData.map((row: any) => String(row[key] || '').length));
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return { ...acc, [key]: { wch: Math.min(maxLength + 2, 50) } };
    }, {});

    worksheet['!cols'] = Object.values(maxWidth);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Group Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforFSW(rows: IFeeConcessionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Student Name': row.reportname,
        'Class:Section': row.classname,
        concessionAmount: row.concession
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Student Name': '',
        'Class:Section': '',
        concessionAmount: rows.reduce((sum, row) => sum + (row.concession || 0), 0)
    };

    // Combine data and totals
    const allData = [...dataForExcel, totalsRow];

    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();

    // Auto-size columns
    const maxWidth = Object.keys(dataForExcel[0] || {}).reduce((acc, key) => {
        const maxLength = Math.max(key.length, ...allData.map((row: any) => String(row[key] || '').length));
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return { ...acc, [key]: { wch: Math.min(maxLength + 2, 50) } };
    }, {});

    worksheet['!cols'] = Object.values(maxWidth);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Group Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
