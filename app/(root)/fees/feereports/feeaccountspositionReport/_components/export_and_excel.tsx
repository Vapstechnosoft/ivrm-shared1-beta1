'use client';
import * as XLSX from 'xlsx';

export interface IFeeAccountsPositionReport {
    studentName: string;
    admNumber: number;
    feeHead: string;
    className: string;
    RouteName: string;
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
            <h3>Fee Accounts Position Report</h3>
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

export function exportToExcelforIndividual(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Student Name': row.studentName,
        'Adm.No': row.admNumber,
        'Charges as per Academic year': `${row.ChargesasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Concession as per Academic year': `${row.ConcessionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Rebate/Scholarship as per Academic year': `${row.RebateScholarshipasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        Fine: `${row.fine?.toLocaleString('en-IN') || '0'}`,
        'Waive Off as per Academic year': `${row.waivedOffasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Collection as per Academic year': `${row.collectionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        Balance: `${row.balance?.toLocaleString('en-IN') || '0'}`,
        'Last Year Due': `${row.lastyearDue?.toLocaleString('en-IN') || '0'}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforHeadWise(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Head': row.feeHead,
        'Charges as per Academic year': `${row.ChargesasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Concession as per Academic year': `${row.ConcessionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Rebate/Scholarship as per Academic year': `${row.RebateScholarshipasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        Fine: `${row.fine?.toLocaleString('en-IN') || '0'}`,
        'Waive Off as per Academic year': `${row.waivedOffasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Collection as per Academic year': `${row.collectionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        Balance: `${row.balance?.toLocaleString('en-IN') || '0'}`,
        'Last Year Due': `${row.lastyearDue?.toLocaleString('en-IN') || '0'}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforAll(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Class Name': row.className,
        'Charges as per Academic year': `${row.ChargesasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Concession as per Academic year': `${row.ConcessionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Rebate/Scholarship as per Academic year': `${row.RebateScholarshipasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        Fine: `${row.fine?.toLocaleString('en-IN') || '0'}`,
        'Waive Off as per Academic year': `${row.waivedOffasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Collection as per Academic year': `${row.collectionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        Balance: `${row.balance?.toLocaleString('en-IN') || '0'}`,
        'Last Year Due': `${row.lastyearDue?.toLocaleString('en-IN') || '0'}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforRoute(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Route Name': row.RouteName,
        'Charges as per Academic year': `${row.ChargesasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Concession as per Academic year': `${row.ConcessionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Rebate/Scholarship as per Academic year': `${row.RebateScholarshipasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        Fine: `${row.fine?.toLocaleString('en-IN') || '0'}`,
        'Waive Off as per Academic year': `${row.waivedOffasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        'Collection as per Academic year': `${row.collectionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
        Balance: `${row.balance?.toLocaleString('en-IN') || '0'}`,
        'Last Year Due': `${row.lastyearDue?.toLocaleString('en-IN') || '0'}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
