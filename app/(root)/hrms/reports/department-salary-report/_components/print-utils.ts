export const printDepartmentSalaryReport = (reportData: any, month: string, year: string, departmentNames: string = '') => {
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) {
        alert('Please allow popups to print the report');
        return;
    }

    const departmentDetails = reportData.departmentSalaryDetails || [];
    const currentDate = new Date();

    // We need to determine the dynamic headers from the first record (or union of all)
    // Assuming all records have consistent structure or the first one has the headers
    const firstRecord = departmentDetails[0] || {};
    const earnings = firstRecord.earningresult || [];
    const deductions = firstRecord.deductionresult || [];

    const earningHeaders = earnings.map((head: any) =>
        `<th class="text-right">${head.hrmeD_Name}</th>`
    ).join('');

    const deductionHeaders = deductions.map((head: any) =>
        `<th class="text-right">${head.hrmeD_Name}</th>`
    ).join('');

    // Calculate totals across all rows
    let grandTotalGross = 0;
    let grandTotalDed = 0;
    let grandTotalNet = 0;

    const tableRows = departmentDetails.map((record: any, index: number) => {
        // Per record calculations
        const recordEarnings = record.earningresult || [];
        const recordDeductions = record.deductionresult || [];

        const earningCells = recordEarnings.map((head: any) =>
            `<td class="text-right">${Number(head.hresD_Amount || 0).toFixed(2)}</td>`
        ).join('');

        const deductionCells = recordDeductions.map((head: any) =>
            `<td class="text-right">${Number(head.hresD_Amount || 0).toFixed(2)}</td>`
        ).join('');

        // Use pre-calculated totals from backend if available, or calc
        const gross = Number(record.grossEarning) || 0; // Or sum manually
        const totalDed = Number(record.grossDeduction) || 0;
        // Net salary might be missing in some payloads, calculate if 0
        const netPay = (Number(record.netSalary) || (gross - totalDed));

        grandTotalGross += gross;
        grandTotalDed += totalDed;
        grandTotalNet += netPay;
        console.log(record);
        return `
          <tr>
              <td class="text-center">${index + 1}</td>
              <td>${record.hrmD_DepartmentName || ''}</td>
              <td class="text-center">${record.lopDays || 0}</td>
              ${earningCells}
              <td class="text-right font-bold">${gross.toFixed(2)}</td>
              ${deductionCells}
              <td class="text-right font-bold">${totalDed.toFixed(2)}</td>
              <td class="text-right font-bold">${netPay.toFixed(2)}</td>
          </tr>
      `;
    }).join('');

    const footerRow = `
      <tr class="font-bold bg-gray-100">
          <td colspan="4" class="text-right">Total</td>
          ${earnings.map(() => '<td></td>').join('')}
          <td class="text-right">${grandTotalGross.toFixed(2)}</td>
          ${deductions.map(() => '<td></td>').join('')}
          <td class="text-right">${grandTotalDed.toFixed(2)}</td>
          <td class="text-right">${grandTotalNet.toFixed(2)}</td>
      </tr>
  `;

    // HTML Generation

    printWindow.document.write(`
      <html>
      <head>
          <title>Department Salary Report</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  padding: 20px; 
                  font-size: 10px;
              }
              .header-container {
                  text-align: center;
                  border-bottom: 2px solid #ccc;
                  padding-bottom: 10px;
                  margin-bottom: 20px;
                  position: relative;
              }
              .logo {
                  position: absolute;
                  left: 0;
                  top: 0;
                  height: 60px;
              }
              .institution-name {
                  font-size: 20px;
                  font-weight: bold;
                  color: #2e57a0;
                  text-transform: uppercase;
                  margin: 0;
              }
              .report-title {
                  text-align: center;
                  font-weight: bold;
                  text-transform: uppercase;
                  margin: 10px 0;
                  font-size: 14px;
              }
              .info-box {
                  width: 100%;
                  margin-bottom: 10px;
                  font-size: 12px;
                  text-align: center;
              }
              table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin-top: 10px;
                  font-size: 9px;
              }
              th, td { 
                  border: 1px solid #000; 
                  padding: 4px; 
              }
              th { 
                  background-color: #f0f0f0; 
                  font-weight: bold;
              }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-left { text-align: left; }
              .font-bold { font-weight: bold; }
              .bg-gray-100 { background-color: #f3f4f6; }
              
              @media print {
                  body { margin: 0; padding: 10px; }
                  .no-print { display: none; }
              }
          </style>
      </head>
      <body>
          <div class="header-container">
               <img src="/assets/tunbridge_logo.png" class="logo" alt="Logo" onerror="this.style.display='none'"/>
              <h1 class="institution-name">Tunbridge High School</h1>
              <p>86/2 Infantry Road, Bangalore</p>
          </div>

          <div class="report-title">
              Department Salary Report - ${month} ${year}
          </div>
          
          <div class="info-box">
             ${departmentNames ? `Departments: ${departmentNames}` : ''}
          </div>

          <table>
              <thead>
                  <tr>
                      <th class="text-center" style="width: 30px">Sl.No</th>
                      <th class="text-left">Department Name</th>
                      <th class="text-center">LOP</th>
                      ${earningHeaders}
                      <th class="text-right">Gross Pay</th>
                      ${deductionHeaders}
                      <th class="text-right">Total Ded</th>
                      <th class="text-right">Net Pay</th>
                  </tr>
              </thead>
              <tbody>
                  ${tableRows}
                  ${footerRow}
              </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: right; font-size: 11px;">
              Generated on: ${currentDate.toLocaleString()}
          </div>
      </body>
      </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}
