'use client';
import * as XLSX from 'xlsx';

export interface IFeeStudentTermWisePaidReport {
    studentName: string;
    admNumber: number;
    feeHead: string;
    className: string;
    RouteName: string;
    section: string;
    ChargesasperAcademicyear: number;
    ConcessionasperAcademicyear: number;
    RebateScholarshipasperAcademicyear: number;
    waivedOffasperAcademicyear: number;
    collectionasperAcademicyear: number;
    fine: number;
    balance: number;
    lastyearDue: number;
    id: number;
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
            <title>Print Report</title>
            <style>
                body { font-family: Arial; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 6px; font-size: 12px; }
                th { background: #eaeaea; }
            </style>
        </head>
        <body>
            <h3>Fee Student Term Wise Paid Report</h3>
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

export function exportToExcel(rows: any[], selectedTermNames: string[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => {
        const termData: Record<string, number | string> = {};

        selectedTermNames.forEach((termName) => {
            termData[termName] = row.termAmounts?.[termName] !== undefined ? row.termAmounts[termName] : '--';
        });

        return {
            'Sl No': index + 1,
            'Adm No': row.admNo,
            'Student Name': row.studentName?.trim(),
            Class: row.className,
            Section: row.sectionName,
            ...termData,
            Total: row.total || 0
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
