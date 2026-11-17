'use client';
import * as XLSX from 'xlsx';

type FeeDefaulterRow = {
    id: number;
    studentName: string;
    regNo: string;
    class: string;
    section: string;
    feeTerm: string;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    dueDate: string;
    status: string;
};

export function printTabl(columns: string[], rows: any[], sumRow?: any) {
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
            <title>Print Report</title>
            <style>
                body { font-family: Arial; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 6px; font-size: 12px; }
                th { background: #eaeaea; }
            </style>
        </head>
        <body>
            <h3>Fee Defaulter Report</h3>
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

export function exportToExcel(rows: any[], selectedTerms: any[], fileName: string) {
    if (!rows || rows.length === 0) return;

    // Extract term names from the selected terms
    const selectedTermNames = selectedTerms.map((term) => term.fmH_FeeName);

    const dataForExcel = rows.map((row, index) => {
        const termData: Record<string, number | string> = {};

        selectedTermNames.forEach((termName) => {
            termData[termName] = termName.amount || 0;
        });

        return {
            'Sl No': index + 1,
            'Adm No': row.regNo || row.admNo, // Use regNo from your row data
            'Student Name': row.studentName?.trim(),
            Class: row.class,
            Section: row.section,
            ...termData,
            Total: row.totalAmount || 0
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
