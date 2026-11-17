'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IFeeYearlyCollectionReport, IFeeYearlyCollectionReportRow } from '@/types/fees/reports/reports';
import type { ColumnDef, HeaderContext } from '@tanstack/react-table';

export type BreakdownType = keyof typeof REPORT_COLUMN_MAP;

export const REPORT_COLUMN_MAP = {
    FGW: [
        { key: 'fmg_groupname', label: 'Group Name' },

        { key: 'paidAmount', label: 'Paid Amount', align: 'right', sum: true },
        { key: 'balance', label: 'Balance', align: 'right', sum: true },
        { key: 'concession', label: 'Concession', align: 'right', sum: true },
        { key: 'fine', label: 'Fine', align: 'right', sum: true },
        { key: 'rebate', label: 'Rebate', align: 'right', sum: true },
        { key: 'waivedOff', label: 'Waived Off', align: 'right', sum: true },
        { key: 'adjusted', label: 'Adjusted', align: 'right', sum: true },
        { key: 'excessPaid', label: 'Excess Paid', align: 'right', sum: true },
        { key: 'runningExcess', label: 'Running Excess', align: 'right', sum: true }
    ],

    INMW: [
        { key: 'studentName', label: 'Student Name' },
        { key: 'classSection', label: 'Class/Section' },
        { key: 'admissionNo', label: 'Admission No' },
        { key: 'installmentName', label: 'Installment name' },

        { key: 'totalPayable', label: 'Total Payable', align: 'right', sum: true },
        { key: 'paidAmount', label: 'Paid Amount', align: 'right', sum: true },
        { key: 'balance', label: 'Balance', align: 'right', sum: true },
        { key: 'concession', label: 'Concession', align: 'right', sum: true },
        { key: 'arrear', label: 'Arrear', align: 'right', sum: true },
        { key: 'excess', label: 'Excess', align: 'right', sum: true },
        { key: 'charge', label: 'Charge', align: 'right', sum: true },
        { key: 'adjustment', label: 'Adjustment', align: 'right', sum: true }
    ]
} as const;

export const getDynamicColumns = (breakdown: BreakdownType): ColumnDef<FeeYearlyTableRow>[] => {
    const columnsConfig = REPORT_COLUMN_MAP[breakdown] ?? [];

    return [
        /* ================= SL NO ================= */
        {
            id: 'slno',
            header: () => <div className='text-center'>Sl No</div>,
            cell: ({ row, table }) => {
                if ('__isTotal' in row.original) {
                    return <div className='text-center font-bold'>—</div>;
                }

                const { pageIndex, pageSize } = table.getState().pagination;

                return <div className='text-center font-medium'>{pageIndex * pageSize + row.index + 1}</div>;
            },
            enableSorting: false,
            size: 60
        },

        /* ================= DATA COLUMNS ================= */
        ...columnsConfig.map(
            (col): ColumnDef<FeeYearlyTableRow> => ({
                accessorKey: col.key,
                enableSorting: false,
                header: ({ column }: HeaderContext<FeeYearlyTableRow, unknown>) => (
                    <DataTableColumnHeader column={column} title={col.label} />
                ),
                cell: ({ row }) => {
                    const value = row.getValue(col.key);
                    const isTotalRow = '__isTotal' in row.original;

                    if (value == null) return <span className='text-muted-foreground'>—</span>;

                    if (typeof value === 'number') {
                        return (
                            <div className={`text-right font-semibold ${isTotalRow ? 'text-primary' : ''}`}>{value.toLocaleString()}</div>
                        );
                    }

                    return <div className={`font-semibold ${isTotalRow ? 'text-primary' : ''}`}>{String(value)}</div>;
                }
            })
        )
    ];
};

const getExportConfig = (breakdown: BreakdownType) => {
    const cols = REPORT_COLUMN_MAP[breakdown];

    return {
        headers: cols.map((c) => c.label),
        keys: cols.map((c) => c.key)
    };
};

export function printTableDynamic(breakdown: BreakdownType, rows: any[], totalRow?: any) {
    const { headers, keys } = getExportConfig(breakdown);

    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) return;

    const thead = headers.map((h) => `<th>${h}</th>`).join('');

    const tbody = rows.map((row) => `<tr>${keys.map((k) => `<td>${row[k] ?? ''}</td>`).join('')}</tr>`).join('');

    const totalHtml = totalRow
        ? `<tr style="font-weight:bold;background:#f3f3f3">
        ${keys.map((k) => `<td>${totalRow[k] ?? ''}</td>`).join('')}
      </tr>`
        : '';

    printWindow.document.write(`
    <html>
      <head>
        <title>Yearly Fee Collection</title>
        <style>
          body { font-family: Arial; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 6px; font-size: 12px; }
          th { background: #eee; }
        </style>
      </head>
      <body>
        <h3>Yearly Fee Collection Report</h3>
        <table>
          <thead><tr>${thead}</tr></thead>
          <tbody>${tbody}${totalHtml}</tbody>
        </table>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.print();
}

import * as XLSX from 'xlsx';

export function exportToExcelDynamic(breakdown: BreakdownType, rows: any[], fileName: string) {
    const { headers, keys } = getExportConfig(breakdown);

    const excelData = rows.map((row) => {
        const obj: any = {};
        keys.forEach((k, i) => {
            obj[headers[i]] = row[k] ?? '';
        });
        return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export type FeeYearlyTableRow =
    | IFeeYearlyCollectionReportRow
    | (Partial<IFeeYearlyCollectionReportRow> & {
          __isTotal: true;
          studentName: 'TOTAL';
      });

type FieldMap = Record<string, (item: any) => any>;

export const REPORT_FIELD_MAP: Record<BreakdownType, FieldMap> = {
    FGW: {
        groupName: (i) => i.fmgG_GroupName ?? '',

        paidAmount: (i) => i.paid ?? 0,
        balance: (i) => i.balance ?? 0,
        concession: (i) => i.concession ?? 0,
        fine: (i) => i.fine ?? 0,
        rebate: (i) => i.rebate ?? 0,
        waivedOff: (i) => i.waived ?? 0,
        adjusted: (i) => i.adjusted ?? 0,
        excessPaid: (i) => i.excess ?? 0,
        runningExcess: (i) => i.runningExcess ?? 0
    },

    INMW: {
        studentName: (i) => i.studentName?.trim() ?? '',
        classSection: (i) => i.asmcL_ClassName ?? '',
        admissionNo: (i) => i.amsT_AdmNo ?? '',
        installmentName: (i) => i.ftI_Name ?? '',

        totalPayable: (i) => i.payable ?? 0,
        paidAmount: (i) => i.paid ?? 0,
        balance: (i) => i.balance ?? 0,
        concession: (i) => i.concession ?? 0,
        arrear: (i) => i.arrear ?? 0,
        excess: (i) => i.excess ?? 0,
        charge: (i) => i.charge ?? 0,
        adjustment: (i) => i.adjusted ?? 0
    }
};

export const mapYearlyCollectionReport = (list: any[], breakdown: BreakdownType): IFeeYearlyCollectionReportRow[] => {
    const fieldMap = REPORT_FIELD_MAP[breakdown];

    return list.map((item, index) => {
        const row: any = {
            slNo: index + 1
        };

        Object.keys(fieldMap).forEach((key) => {
            row[key] = fieldMap[key](item);
        });

        return row;
    });
};

const NUMERIC_COLUMNS = ['totalPayable', 'paidAmount', 'balance', 'concession', 'arrear', 'excess', 'charge', 'adjustment'];

// export function createTotalRow(rows: IFeeYearlyCollectionReportRow[]): FeeYearlyTableRow {
//     return {
//         __isTotal: true,
//         slNo: 0,
//         studentName: 'TOTAL',
//         classSection: '',
//         admissionNo: '',
//         installmentName: '',

//         totalPayable: rows.reduce((s, r) => s + r.totalPayable, 0),
//         paidAmount: rows.reduce((s, r) => s + r.paidAmount, 0),
//         balance: rows.reduce((s, r) => s + r.balance, 0),
//         concession: rows.reduce((s, r) => s + r.concession, 0),
//         arrear: rows.reduce((s, r) => s + r.arrear, 0),
//         excess: rows.reduce((s, r) => s + r.excess, 0),
//         charge: rows.reduce((s, r) => s + r.charge, 0),
//         adjustment: rows.reduce((s, r) => s + r.adjustment, 0)
//     };
// }

export function exportToExcelforFeeGroupWise(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Group': row.fmg_groupname,
        'Paid Amount': row.fss_paidamount || 0,
        Balance: row.balance || 0,
        Concession: row.concession || 0,
        Waived: row.waived || 0,
        Rebate: row.rebate || 0,
        Fine: row.fine || 0,
        'Total Payable': row.totalpayable || 0,
        Adjusted: row.adjusted || 0,
        Excess: row.excess || 0,
        'Running Excess': row.runningexcess || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Fee Group': '',
        'Paid Amount': rows.reduce((sum, row) => sum + (row.fss_paidamount || 0), 0),
        Balance: rows.reduce((sum, row) => sum + (row.balance || 0), 0),
        Concession: rows.reduce((sum, row) => sum + (row.concession || 0), 0),
        Waived: rows.reduce((sum, row) => sum + (row.waived || 0), 0),
        Rebate: rows.reduce((sum, row) => sum + (row.rebate || 0), 0),
        Fine: rows.reduce((sum, row) => sum + (row.fine || 0), 0),
        'Total Payable': rows.reduce((sum, row) => sum + (row.totalpayable || 0), 0),
        Adjusted: rows.reduce((sum, row) => sum + (row.adjusted || 0), 0),
        Excess: rows.reduce((sum, row) => sum + (row.excess || 0), 0),
        'Running Excess': rows.reduce((sum, row) => sum + (row.runningexcess || 0), 0)
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

export function exportToExcelforFeeHeadWise(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Head': row.fmh_feename,
        'Paid Amount': row.fss_paidamount || 0,
        Balance: row.balance || 0,
        Concession: row.concession || 0,
        Waived: row.waived || 0,
        Rebate: row.rebate || 0,
        Fine: row.fine || 0,
        'Total Payable': row.totalpayable || 0,
        Adjusted: row.adjusted || 0,
        Excess: row.excess || 0,
        'Running Excess': row.runningexcess || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Fee Head': '',
        'Paid Amount': rows.reduce((sum, row) => sum + (row.fss_paidamount || 0), 0),
        Balance: rows.reduce((sum, row) => sum + (row.balance || 0), 0),
        Concession: rows.reduce((sum, row) => sum + (row.concession || 0), 0),
        Waived: rows.reduce((sum, row) => sum + (row.waived || 0), 0),
        Rebate: rows.reduce((sum, row) => sum + (row.rebate || 0), 0),
        Fine: rows.reduce((sum, row) => sum + (row.fine || 0), 0),
        'Total Payable': rows.reduce((sum, row) => sum + (row.totalpayable || 0), 0),
        Adjusted: rows.reduce((sum, row) => sum + (row.adjusted || 0), 0),
        Excess: rows.reduce((sum, row) => sum + (row.excess || 0), 0),
        'Running Excess': rows.reduce((sum, row) => sum + (row.runningexcess || 0), 0)
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

export function exportToExcelforFeeClassWise(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Class Name': row.asmcl_classname,
        'Total Charges': row.charges,
        'Paid Amount': row.fss_paidamount || 0,
        Balance: row.balance || 0,
        Concession: row.concession || 0,
        Fine: row.fine || 0,
        Rebate: row.rebate || 0,
        Waived: row.waived || 0,
        Excess: row.excess || 0,
        'Opening Balance': row.openingbalance || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Class Name': '',
        'Total Charges': rows.reduce((sum, row) => sum + (row.charges || 0), 0),
        'Paid Amount': rows.reduce((sum, row) => sum + (row.fss_paidamount || 0), 0),
        Balance: rows.reduce((sum, row) => sum + (row.balance || 0), 0),
        Concession: rows.reduce((sum, row) => sum + (row.concession || 0), 0),
        Fine: rows.reduce((sum, row) => sum + (row.fine || 0), 0),
        Rebate: rows.reduce((sum, row) => sum + (row.rebate || 0), 0),
        Waived: rows.reduce((sum, row) => sum + (row.waived || 0), 0),
        Excess: rows.reduce((sum, row) => sum + (row.excess || 0), 0),
        'Opening Balance': rows.reduce((sum, row) => sum + (row.openingbalance || 0), 0)
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

export function exportToExcelforStudentWise(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Student Name': row.studentname,
        'Admission No': row.amst_admno,
        'Class Name': row.asmcl_classname,
        'Mobile No': row.mobileNo,
        'Total Payable': row.totalpayable,
        'Paid Amount': row.fss_paidamount || 0,
        Balance: row.balance || 0,
        Concession: row.concession || 0,
        Fine: row.fine || 0,
        Rebate: row.rebate || 0,
        Waived: row.waived || 0,
        Adjusted: row.adjusted || 0,
        'Opening Balance': row.openingbalance || 0,
        Excess: row.excess || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Student Name': '',
        'Admission No': '',
        'Class Name': '',
        'Mobile No': '',
        'Total Payable': rows.reduce((sum, row) => sum + (row.totalpayable || 0), 0),
        'Paid Amount': rows.reduce((sum, row) => sum + (row.fss_paidamount || 0), 0),
        Balance: rows.reduce((sum, row) => sum + (row.balance || 0), 0),
        Concession: rows.reduce((sum, row) => sum + (row.concession || 0), 0),
        Fine: rows.reduce((sum, row) => sum + (row.fine || 0), 0),
        Rebate: rows.reduce((sum, row) => sum + (row.rebate || 0), 0),
        Waived: rows.reduce((sum, row) => sum + (row.waived || 0), 0),
        Adjusted: rows.reduce((sum, row) => sum + (row.adjusted || 0), 0),
        'Opening Balance': rows.reduce((sum, row) => sum + (row.openingbalance || 0), 0),
        Excess: rows.reduce((sum, row) => sum + (row.excess || 0), 0)
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

export function exportToExcelforTermWise(rows: IFeeYearlyCollectionReport[], fileName: string, selectedTerms: any[]) {
    if (!rows || rows.length === 0) return;

    const feeHeads = Array.from(new Map(rows.map((r) => [r.fmh_id, r])).values());

    const wsData: any[][] = [];
    const headerRow1: any[] = ['Sl No', 'Fee Head'];
    selectedTerms.forEach((term) => {
        headerRow1.push(term.fmT_Name);
        for (let i = 0; i < 6; i++) headerRow1.push('');
    });
    wsData.push(headerRow1);
    const headerRow2: any[] = ['', ''];
    selectedTerms.forEach(() => {
        headerRow2.push('Paid', 'Balance', 'Concession', 'Arrear', 'Excess', 'Charges', 'Payable');
    });
    wsData.push(headerRow2);
    feeHeads.forEach((feeHead, index) => {
        const row: any[] = [index + 1, feeHead.fmh_feename];

        selectedTerms.forEach((term) => {
            const data = rows.find((r) => r.fmh_id === feeHead.fmh_id && r.fmt_id === term.fmT_Id);

            row.push(
                data?.paid || 0,
                data?.balance || 0,
                data?.concession || 0,
                data?.arrear || 0,
                data?.excess || 0,
                data?.charges || 0,
                data?.payable || 0
            );
        });

        wsData.push(row);
    });
    const totalRow: any[] = ['Total', ''];

    selectedTerms.forEach((term) => {
        const termRows = rows.filter((r) => r.fmt_id === term.fmT_Id);

        totalRow.push(
            termRows.reduce((s, r) => s + (r.paid || 0), 0),
            termRows.reduce((s, r) => s + (r.balance || 0), 0),
            termRows.reduce((s, r) => s + (r.concession || 0), 0),
            termRows.reduce((s, r) => s + (r.arrear || 0), 0),
            termRows.reduce((s, r) => s + (r.excess || 0), 0),
            termRows.reduce((s, r) => s + (r.charges || 0), 0),
            termRows.reduce((s, r) => s + (r.payable || 0), 0)
        );
    });

    wsData.push(totalRow);
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    worksheet['!merges'] = worksheet['!merges'] ?? [];

    selectedTerms.forEach((_, index) => {
        const startCol = 2 + index * 7;
        worksheet['!merges']!.push({
            s: { r: 0, c: startCol },
            e: { r: 0, c: startCol + 6 }
        });
    });
    worksheet['!cols'] = [{ wch: 8 }, { wch: 20 }, ...Array(selectedTerms.length * 7).fill({ wch: 14 })];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Term Wise Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforStudentTermWise(rows: IFeeYearlyCollectionReport[], fileName: string, selectedTerms: any[]) {
    if (!rows || rows.length === 0) return;

    const feeHeads = Array.from(new Map(rows.map((r) => [r.fmh_id, r])).values());

    const wsData: any[][] = [];
    const headerRow1: any[] = ['Sl No', 'Fee Head'];
    selectedTerms.forEach((term) => {
        headerRow1.push(term.fmT_Name);
        for (let i = 0; i < 6; i++) headerRow1.push('');
    });
    wsData.push(headerRow1);
    const headerRow2: any[] = ['', ''];
    selectedTerms.forEach(() => {
        headerRow2.push('Paid', 'Balance', 'Concession', 'Arrear', 'Excess', 'Charges', 'Payable');
    });
    wsData.push(headerRow2);
    feeHeads.forEach((feeHead, index) => {
        const row: any[] = [index + 1, feeHead.fmh_feename];

        selectedTerms.forEach((term) => {
            const data = rows.find((r) => r.fmh_id === feeHead.fmh_id && r.fmt_id === term.fmT_Id);

            row.push(
                data?.paid || 0,
                data?.balance || 0,
                data?.concession || 0,
                data?.arrear || 0,
                data?.excess || 0,
                data?.charges || 0,
                data?.payable || 0
            );
        });

        wsData.push(row);
    });
    const totalRow: any[] = ['Total', ''];

    selectedTerms.forEach((term) => {
        const termRows = rows.filter((r) => r.fmt_id === term.fmT_Id);

        totalRow.push(
            termRows.reduce((s, r) => s + (r.paid || 0), 0),
            termRows.reduce((s, r) => s + (r.balance || 0), 0),
            termRows.reduce((s, r) => s + (r.concession || 0), 0),
            termRows.reduce((s, r) => s + (r.arrear || 0), 0),
            termRows.reduce((s, r) => s + (r.excess || 0), 0),
            termRows.reduce((s, r) => s + (r.charges || 0), 0),
            termRows.reduce((s, r) => s + (r.payable || 0), 0)
        );
    });

    wsData.push(totalRow);
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    worksheet['!merges'] = worksheet['!merges'] ?? [];

    selectedTerms.forEach((_, index) => {
        const startCol = 2 + index * 7;
        worksheet['!merges']!.push({
            s: { r: 0, c: startCol },
            e: { r: 0, c: startCol + 6 }
        });
    });
    worksheet['!cols'] = [{ wch: 8 }, { wch: 20 }, ...Array(selectedTerms.length * 7).fill({ wch: 14 })];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Term Wise Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforInstallmentWise(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Student Name': row.studentName,
        'Class/Section': row.asmcL_ClassName,
        'Admission No': row.amsT_AdmNo,
        'Installment name': row.ftI_Name,
        'Total Payable': row.totalpayable,
        'Paid Amount': row.fss_paidamount || 0,
        Balance: row.balance || 0,
        Concession: row.concession || 0,
        Arrear: row.arrear || 0,
        Excess: row.excess || 0,
        Charge: row.charge || 0,
        Adjustment: row.adjusted || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Student Name': '',
        'Class/Section': '',
        'Admission No': '',
        'Installment name': '',
        'Total Payable': rows.reduce((sum, row) => sum + (row.totalpayable || 0), 0),
        'Paid Amount': rows.reduce((sum, row) => sum + (row.fss_paidamount || 0), 0),
        Balance: rows.reduce((sum, row) => sum + (row.balance || 0), 0),
        Concession: rows.reduce((sum, row) => sum + (row.concession || 0), 0),
        Arrear: rows.reduce((sum, row) => sum + (row.arrear || 0), 0),
        Excess: rows.reduce((sum, row) => sum + (row.excess || 0), 0),
        Charge: rows.reduce((sum, row) => sum + (row.charge || 0), 0),
        Adjustment: rows.reduce((sum, row) => sum + (row.adjusted || 0), 0)
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

export function exportToExcelforCategoryWise(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Class Category': row.fmcc_classcategoryname,
        'Fee Head': row.fmh_feename || 0,
        'By Bank': row.bybank || 0,
        'By Cash': row.bycash || 0,
        'By Online': row.byonline || 0,
        'By Card': row.bycard || 0,
        'By ECS	': row.byecs || 0,
        'By RTGS': row.byrtgs || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Fee Class Category': '',
        'Fee Head': '',
        'By Bank': rows.reduce((sum, row) => sum + (row.bybank || 0), 0),
        'By Cash': rows.reduce((sum, row) => sum + (row.bycash || 0), 0),
        'By Online': rows.reduce((sum, row) => sum + (row.byonline || 0), 0),
        'By Card': rows.reduce((sum, row) => sum + (row.bycard || 0), 0),
        'By ECS': rows.reduce((sum, row) => sum + (row.byecs || 0), 0),
        'By RTGS': rows.reduce((sum, row) => sum + (row.byrtgs || 0), 0)
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

export function exportToExcelforClassSectionInstallmentWiseConslidated(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Class Name': row.asmcl_classname,
        Section: row.asmc_sectionname,
        Term: row.fmt_name,
        'Total Charges': row.totalcharges || 0,
        'Balance Amount': row.totalbalance || 0,
        'Paid Amount': row.totalpaid || 0,
        Concession: row.totalconcession || 0,
        'Waived Off': row.totalwaivedoff || 0,
        Adjusted: row.adjustment || 0,
        'Excess Paid': row.excess || 0,
        'Refund Amount': row.totalrefund || 0,
        'Running Excess': row.runningexcess || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Class Name': '',
        Section: '',
        Term: '',
        'Total Charges': rows.reduce((sum, row) => sum + (row.totalcharges || 0), 0),
        'Balance Amount': rows.reduce((sum, row) => sum + (row.totalbalance || 0), 0),
        'Paid Amount': rows.reduce((sum, row) => sum + (row.totalpaid || 0), 0),
        Concession: rows.reduce((sum, row) => sum + (row.totalconcession || 0), 0),
        'Waived Off	': rows.reduce((sum, row) => sum + (row.totalwaivedoff || 0), 0),
        Adjusted: rows.reduce((sum, row) => sum + (row.adjustment || 0), 0),
        'Excess Paid': rows.reduce((sum, row) => sum + (row.excess || 0), 0),
        'Refund Amount': rows.reduce((sum, row) => sum + (row.totalrefund || 0), 0),
        'Running Excess': rows.reduce((sum, row) => sum + (row.runningexcess || 0), 0)
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

export function exportToExcelforClassInstallmentWiseConslidated(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Class Name': row.asmcl_classname,
        Term: row.fmt_name,
        'Total Charges': row.totalcharges || 0,
        'Balance Amount': row.totalbalance || 0,
        'Paid Amount': row.totalpaid || 0,
        Concession: row.totalconcession || 0,
        'Waived Off': row.totalwaivedoff || 0,
        Adjusted: row.adjustment || 0,
        'Excess Paid': row.excess || 0,
        'Refund Amount': row.totalrefund || 0,
        'Running Excess': row.runningexcess || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Class Name': '',
        Term: '',
        'Total Charges': rows.reduce((sum, row) => sum + (row.totalcharges || 0), 0),
        'Balance Amount': rows.reduce((sum, row) => sum + (row.totalbalance || 0), 0),
        'Paid Amount': rows.reduce((sum, row) => sum + (row.totalpaid || 0), 0),
        Concession: rows.reduce((sum, row) => sum + (row.totalconcession || 0), 0),
        'Waived Off	': rows.reduce((sum, row) => sum + (row.totalwaivedoff || 0), 0),
        Adjusted: rows.reduce((sum, row) => sum + (row.adjustment || 0), 0),
        'Excess Paid': rows.reduce((sum, row) => sum + (row.excess || 0), 0),
        'Refund Amount': rows.reduce((sum, row) => sum + (row.totalrefund || 0), 0),
        'Running Excess': rows.reduce((sum, row) => sum + (row.runningexcess || 0), 0)
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

export function exportToExcelforStudentWiseTotalPaidCount(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Student Name': row.studentname,
        'Admission No': row.amst_admno,
        'Total Payable': row.totalpayable,
        'Paid Amount': row.fss_paidamount || 0,
        Balance: row.balance || 0,
        Concession: row.concession || 0,
        Fine: row.fine || 0,
        Rebate: row.rebate || 0,
        WaivedOff: row.waived || 0,
        Adjustment: row.adjusted || 0,
        'Opening Balance': row.openingbalance || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Student Name': '',
        'Admission No': '',
        'Total Payable': rows.reduce((sum, row) => sum + (row.totalpayable || 0), 0),
        'Paid Amount': rows.reduce((sum, row) => sum + (row.fss_paidamount || 0), 0),
        Balance: rows.reduce((sum, row) => sum + (row.balance || 0), 0),
        Concession: rows.reduce((sum, row) => sum + (row.concession || 0), 0),
        Fine: rows.reduce((sum, row) => sum + (row.fine || 0), 0),
        Rebate: rows.reduce((sum, row) => sum + (row.rebate || 0), 0),
        WaivedOff: rows.reduce((sum, row) => sum + (row.waived || 0), 0),
        Adjustment: rows.reduce((sum, row) => sum + (row.adjusted || 0), 0),
        'Opening Balance': rows.reduce((sum, row) => sum + (row.openingbalance || 0), 0)
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

export function exportToExcelforClassSectionWiseTotalPaidCount(rows: IFeeYearlyCollectionReport[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Student Name': row.studentname,
        'Class/Section': row.asmcl_classname,
        'Admission No': row.amst_admno,
        'Total Payable': row.totalpayable,
        'Paid Amount': row.fss_paidamount || 0,
        Balance: row.balance || 0,
        Concession: row.concession || 0,
        Fine: row.fine || 0,
        Rebate: row.rebate || 0,
        WaivedOff: row.waived || 0,
        Adjustment: row.adjusted || 0,
        'Opening Balance': row.openingbalance || 0
    }));

    // Add totals row
    const totalsRow = {
        'Sl No': 'TOTAL',
        'Student Name': '',
        'Class/Section': '',
        'Admission No': '',
        'Total Payable': rows.reduce((sum, row) => sum + (row.totalpayable || 0), 0),
        'Paid Amount': rows.reduce((sum, row) => sum + (row.fss_paidamount || 0), 0),
        Balance: rows.reduce((sum, row) => sum + (row.balance || 0), 0),
        Concession: rows.reduce((sum, row) => sum + (row.concession || 0), 0),
        Fine: rows.reduce((sum, row) => sum + (row.fine || 0), 0),
        Rebate: rows.reduce((sum, row) => sum + (row.rebate || 0), 0),
        WaivedOff: rows.reduce((sum, row) => sum + (row.waived || 0), 0),
        Adjustment: rows.reduce((sum, row) => sum + (row.adjusted || 0), 0),
        'Opening Balance': rows.reduce((sum, row) => sum + (row.openingbalance || 0), 0)
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
            <title>Yearly Fee Collection</title>
            <style>
                body { font-family: Arial; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 6px; font-size: 12px; }
                th { background: #eaeaea; }
            </style>
        </head>
        <body>
            <h3>Yearly Fee Collection</h3>
            <table> 
                <thead><tr>${tableHead}</tr></thead>
                <tbody>
                    ${tableRows}
                    ${totalRow}
                </tbody>
            </table>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
}

export function printTermWiseTable(rows: IFeeYearlyCollectionReport[], selectedTerms: any[]) {
    const printWindow = window.open('', '', 'width=1400,height=800');
    if (!printWindow) return;

    // Get unique fee heads
    const feeHeads = Array.from(new Map(rows.map((r) => [r.fmh_id, r])).values());

    // Helper functions
    const formatCurrency = (value: number | undefined | null) => {
        const numValue = value || 0;
        return `₹${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getNumericValue = (value: any): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return Number.parseFloat(value) || 0;
        return 0;
    };

    // Build header rows
    let headerRow1 = `<tr>
      <th rowspan="2">Sl No</th>
      <th rowspan="2">Fee Head</th>`;

    selectedTerms.forEach((term) => {
        headerRow1 += `<th colspan="7">${term.fmT_Name || term.fmt_name}</th>`;
    });

    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    headerRow1 += `</tr>`;

    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    let headerRow2 = `<tr>`;
    selectedTerms.forEach(() => {
        headerRow2 += `
      <th>Paid</th>
      <th>Balance</th>
      <th>Concession</th>
      <th>Arrear</th>
      <th>Excess</th>
      <th>Charges</th>
      <th>Payable</th>
    `;
    });
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    headerRow2 += `</tr>`;

    // Build body rows
    let bodyRows = '';

    feeHeads.forEach((feeHead, index) => {
        bodyRows += `<tr>
      <td>${index + 1}</td>
      <td>${feeHead.fmh_feename || 'N/A'}</td>`;

        selectedTerms.forEach((term) => {
            // Find matching data for this fee head and term
            // Use both possible property names for term ID
            const data = rows.find((r) => r.fmh_id === feeHead.fmh_id && (r.fmt_id === term.fmT_Id || r.fmt_Id === term.fmT_Id));

            // Use the CORRECT property names from your data
            const paid = data ? getNumericValue(data.paid) : 0;
            const balance = data ? getNumericValue(data.balance) : 0;
            const concession = data ? getNumericValue(data.concession) : 0;
            const arrear = data ? getNumericValue(data.arrear) : 0;
            const excess = data ? getNumericValue(data.excess) : 0;
            const charges = data ? getNumericValue(data.charges) : 0;
            const payable = data ? getNumericValue(data.payable) : 0;

            bodyRows += `
        <td>${formatCurrency(paid)}</td>
        <td>${formatCurrency(balance)}</td>
        <td>${formatCurrency(concession)}</td>
        <td>${formatCurrency(arrear)}</td>
        <td>${formatCurrency(excess)}</td>
        <td>${formatCurrency(charges)}</td>
        <td>${formatCurrency(payable)}</td>
      `;
        });

        // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        bodyRows += `</tr>`;
    });

    // Build total row
    let totalRow = `<tr style="font-weight:bold;background:#f3f3f3">
      <td colspan="2">TOTAL</td>`;

    selectedTerms.forEach((term) => {
        // Filter rows for this term - check both possible property names
        const termRows = rows.filter((r) => r.fmt_id === term.fmT_Id || r.fmt_Id === term.fmT_Id);

        // Calculate totals for this term using CORRECT property names
        const sumPaid = termRows.reduce((sum, r) => sum + getNumericValue(r.fss_paidamount || r.paid || r.totalpaid || 0), 0);

        const sumBalance = termRows.reduce((sum, r) => sum + getNumericValue(r.totalbalance || r.balance || r.cdBalanceAmount || 0), 0);

        const sumConcession = termRows.reduce((sum, r) => sum + getNumericValue(r.totalconcession || r.concession || 0), 0);

        const sumArrear = termRows.reduce((sum, r) => sum + getNumericValue(r.arrear || 0), 0);

        const sumExcess = termRows.reduce((sum, r) => sum + getNumericValue(r.runningexcess || r.excess || 0), 0);

        const sumCharges = termRows.reduce((sum, r) => sum + getNumericValue(r.totalcharges || r.charges || r.charge || 0), 0);

        const sumPayable = termRows.reduce((sum, r) => sum + getNumericValue(r.totalpayable || r.payable || r.cdNetAmount || 0), 0);

        totalRow += `
      <td>${formatCurrency(sumPaid)}</td>
      <td>${formatCurrency(sumBalance)}</td>
      <td>${formatCurrency(sumConcession)}</td>
      <td>${formatCurrency(sumArrear)}</td>
      <td>${formatCurrency(sumExcess)}</td>
      <td>${formatCurrency(sumCharges)}</td>
      <td>${formatCurrency(sumPayable)}</td>
    `;
    });

    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    totalRow += `</tr>`;

    // Write to print window
    printWindow.document.write(`
    <html>
    <head>
      <title>Yearly Fee Collection (Term Wise)</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px;
          color: #333;
        }
        h3 { 
          text-align: center; 
          margin-bottom: 20px;
          color: #2c3e50;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 10px;
        }
        th, td { 
          border: 1px solid #333; 
          padding: 8px 10px; 
          font-size: 12px; 
          text-align: right;
        }
        th { 
          background: #eaeaea; 
          text-align: center; 
          font-weight: bold;
          color: #2c3e50;
        }
        td:nth-child(1), 
        td:nth-child(2) { 
          text-align: left; 
          font-weight: 500;
        }
        tr:hover {
          background-color: #f9f9f9;
        }
        .total-row {
          background-color: #e8f4f8 !important;
        }
      </style>
    </head>
    <body>
      <h3>Yearly Fee Collection – Term Wise</h3>
      <table>
        <thead>
          ${headerRow1}
          ${headerRow2}
        </thead>
        <tbody>
          ${bodyRows}
          ${totalRow}
        </tbody>
      </table>
      <script>
        // Auto print after load
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.close();
          }, 500);
        };
      </script>
    </body>
    </html>
  `);

    printWindow.document.close();
}
