import * as XLSX from 'xlsx';

function formatDateToYMD(date: any) {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

export function exportToExcelforFeeGroup(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Group Name': row.fmG_GroupName || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
export function exportToExcelforfeeHead(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Head Name': row.fmH_FeeName,
        'Fee Refund Flag': row.fmH_RefundFlag,
        'Fee PDA Flag': row.fmH_PDAFlag,
        'Fee Special Flag': row.fmH_SpecialFeeFlag
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
export function exportToExcelforYearlyHead(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Group Name': row.fmG_GroupName,
        'Fee Head Name': row.fmH_FeeName,
        'Fee Installment Name': row.ftI_Name,
        'Fine Applicable': row.fyghM_FineApplicableFlag,
        'Common Amount': row.fyghM_Common_AmountFlag
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
export function exportToExcelforInstallment(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Installment Type': row.fmI_Name,
        'Fee Installment': row.ftI_Name,
        'From Date': formatDateToYMD(row.ftidD_FromDate),
        'To Date': formatDateToYMD(row.ftidD_ToDate),
        'Applicable Date': formatDateToYMD(row.ftidD_ApplicableDate),
        'Due Date': formatDateToYMD(row.ftidD_DueDate)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
export function exportToExcelforFineSlab(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fine Type': row.fmfS_FineType,
        'From Day': row.fmfS_FromDay,
        'To Day': row.fmfS_ToDay,
        'ECS Flag': row.fmfS_ECSFlag
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
export function exportToExcelforClassCategory(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Class Category': row.fmcC_ClassCategoryName,
        'Class Name': row.asmcL_ClassName,
        'Section Name': row.asmC_SectionName
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
export function exportToExcelforPrivileges(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'User Name-User Role': `${row.normalizedUserName}-${row.ivrmrT_Role}`,
        'Fee Group Name': row.fmG_GroupName,
        'Fee Head Name': row.fmH_FeeName
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
export function exportToExcelforTerms(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Term Name': row.fmT_Name,
        'Fee Head Name': row.fmH_FeeName,
        'Fee Installment Name': row.ftI_Name
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
export function exportToExcelforAmountEntry(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Group Name': row.fmG_GroupName,
        'Fee Category Name': row.fmcC_ClassCategoryName,
        'Fee Head': row.fmH_FeeName,
        'Installment Name': row.ftI_Name,
        Amount: row.fmA_Amount,
        'Due Month': row.ftddE_Month,
        Fine: ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
export function exportToExcelforCustomGroup(rows: any[], fileName: string) {
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Fee Head': row.fmG_GroupName,
        'Fee Group Name': row.fmgG_GroupName
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
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
            <title>Fee Class Category Report</title>
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
            <h2>Fee Class Category Report</h2>
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
