'use client';

import * as XLSX from 'xlsx';
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
            <title>Fee Consolidated Report</title>
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
            <h2>Fee Consolidated Report</h2>
            <table>
                <thead>
                    <tr>${tableHead}</tr>
                </thead>
                <tbody>
                    ${tableRows}
                   
                </tbody>
            </table>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

export function exportToExcel(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function printTableAll(rows: any[], installments: any[]) {
    const win = window.open('', '', 'width=1400,height=900');
    if (!win) return;

    // HEADER ROW 1
    const headerRow1 = `
    <tr>
      <th rowspan="2">Sl No</th>
      <th rowspan="2">Roll No</th>
      <th rowspan="2">Student Name</th>
      <th rowspan="2">Class</th>
      <th rowspan="2">Section</th>
      ${installments.map((i) => `<th colspan="4" style="text-align:center">${i.instName}</th>`).join('')}
    </tr>
  `;

    // HEADER ROW 2
    const headerRow2 = `<tr>${installments
        .map(() => '<th>Receipt No</th>' + '<th>Date</th>' + '<th>Cheque No</th>' + '<th>Amount</th>')
        .join('')}</tr>`;

    // BODY
    const bodyRows = rows
        .map((row, index) => {
            const instCells = installments
                .map((inst) => {
                    const d = row.installments?.[inst.ftI_Id] || {};
                    return `
            <td>${d.receiptNo || '-'}</td>
            <td>${d.date || '-'}</td>
            <td>${d.chequeNo || '-'}</td>
            <td style="text-align:right">${d.amount ?? '-'}</td>
          `;
                })
                .join('');

            return `
        <tr>
          <td>${index + 1}</td>
          <td>${row.rollNo}</td>
          <td>${row.studentName}</td>
          <td>${row.className}</td>
          <td>${row.sectionName}</td>
          ${instCells}
        </tr>
      `;
        })
        .join('');

    win.document.write(`
    <html>
      <head>
        <title>Fee Consolidated Report</title>
        <style>
          body { font-family: Arial; padding: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 5px; font-size: 11px; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2 style="text-align:center">Fee Consolidated Report</h2>
        <table>
          <thead>
            ${headerRow1}
            ${headerRow2}
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
        </table>
      </body>
    </html>
  `);

    win.document.close();
    win.focus();
    win.print();
}

export function exportToExcelAll(rows: any[], installments: any[], fileName: string) {
    const workbook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]); // Start with empty array-of-arrays

    // Define the base columns (non-installment)
    const baseCols = 5; // Sl No, Roll No, Student Name, Class, Section
    const colsPerInstallment = 4; // Receipt No, Date, Cheque No, Amount

    // Total columns
    const totalCols = baseCols + installments.length * colsPerInstallment;

    // Header Row 1: Main headers with merges for installments
    const headerRow1: (string | number)[] = new Array(totalCols).fill('');
    headerRow1[0] = 'Sl No';
    headerRow1[1] = 'Roll No';
    headerRow1[2] = 'Student Name';
    headerRow1[3] = 'Class';
    headerRow1[4] = 'Section';

    let colIndex = baseCols;
    const merges: XLSX.Range[] = []; // For merged cells

    installments.forEach((inst, instIndex) => {
        // Merge 4 columns for installment name
        const startCol = colIndex;
        const endCol = colIndex + colsPerInstallment - 1;
        merges.push({ s: { r: 0, c: startCol }, e: { r: 0, c: endCol } });
        headerRow1[startCol] = inst.ftI_Name; // Place name in first cell of merge

        colIndex += colsPerInstallment;
    });

    // Header Row 2: Sub-headers
    const headerRow2: (string | number)[] = new Array(totalCols).fill('');
    // Base sub-headers (empty for base cols, as they span rows implicitly)
    // For installments:
    colIndex = baseCols;
    installments.forEach(() => {
        headerRow2[colIndex] = 'Receipt No';
        headerRow2[colIndex + 1] = 'Date';
        headerRow2[colIndex + 2] = 'Cheque No';
        headerRow2[colIndex + 3] = 'Amount';
        colIndex += colsPerInstallment;
    });

    // Add headers to sheet
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow1, headerRow2], { origin: 'A1' });

    // Data rows
    rows.forEach((row, index) => {
        const dataRow: (string | number)[] = new Array(totalCols).fill('');
        dataRow[0] = index + 1; // Sl No
        dataRow[1] = row.rollNo || ''; // Roll No
        dataRow[2] = row.studentName || ''; // Student Name
        dataRow[3] = row.className || ''; // Class
        dataRow[4] = row.sectionName || ''; // Section

        colIndex = baseCols;
        installments.forEach((inst) => {
            const instData = row.installments?.[String(inst.ftI_Id)] || {};
            dataRow[colIndex] = instData.receiptNo ?? '';
            dataRow[colIndex + 1] = instData.date ?? '';
            dataRow[colIndex + 2] = instData.chequeNo ?? '';
            dataRow[colIndex + 3] = instData.amount ?? '';
            colIndex += colsPerInstallment;
        });

        XLSX.utils.sheet_add_aoa(worksheet, [dataRow], { origin: -1 }); // Append to end
    });

    // Apply merges
    if (merges.length > 0) {
        worksheet['!merges'] = merges;
    }

    // Set column widths
    const colWidths = [
        { wch: 6 }, // Sl No
        { wch: 10 }, // Roll No
        { wch: 30 }, // Student Name
        { wch: 12 }, // Class
        { wch: 8 } // Section
    ];

    // Add widths for installments
    installments.forEach(() => {
        colWidths.push(
            { wch: 15 }, // Receipt No
            { wch: 12 }, // Date
            { wch: 15 }, // Cheque No
            { wch: 12 } // Amount
        );
    });

    worksheet['!cols'] = colWidths;

    // Optional: Style headers (bold, background)
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z2');
    for (let R = headerRange.s.r; R <= headerRange.e.r; ++R) {
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!worksheet[cellAddress]) continue;
            worksheet[cellAddress].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: 'FF6B8E8E' } }, // Light purple like web
                alignment: { horizontal: 'center', vertical: 'center' }
            };
        }
    }

    // For data rows, optional right-align amounts
    const dataRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z100');
    for (let R = 2; R <= dataRange.e.r; ++R) {
        // Skip headers
        // Find amount columns (last in each installment group)
        let amountCol = baseCols + 3;
        installments.forEach(() => {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: amountCol });
            if (worksheet[cellAddress] && worksheet[cellAddress].v !== '') {
                worksheet[cellAddress].t = 'n'; // Ensure number type
                worksheet[cellAddress].s = { alignment: { horizontal: 'right' } };
            }
            amountCol += colsPerInstallment;
        });
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Consolidated Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
