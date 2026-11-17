export function printTable(columns: string[] | any[], rows: any[], title?: string) {
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

    // Set the title for the print window
    const printTitle = title || 'Termwise Fee Report';

    printWindow.document.write(`
        <html>
        <head>
            <title>${printTitle}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { text-align: center; margin-bottom: 10px; }
                .student-info { 
                    text-align: center; 
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: #333;
                }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #333; padding: 6px; font-size: 12px; }
                th { background: #eaeaea; }
                tr:nth-child(even) td { background: #fafafa; }
                .sum-row { font-weight: bold; background: #f3f3f3 !important; }
                .date-row { background: #e8f4ff !important; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h2>FEE TERMWISE REPORT</h2>
            ${title ? `<div class="student-info">${title}</div>` : ''}
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
