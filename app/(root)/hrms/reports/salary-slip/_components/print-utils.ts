export const printSalarySlips = (slips: any[], institution: any, month: string, year: string) => {
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) {
        alert('Please allow popups to print the report');
        return;
    }

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return '0.00';
        return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const slipHtml = slips.map((slip, index) => {
        const earningsRows = (slip.earnings || []).map((e: any) => `
            <tr>
                <td style="text-align: left; border: none; padding: 4px 0;">${e.name}:</td>
                <td style="text-align: right; border: none; padding: 4px 0; font-weight: bold;">${formatCurrency(e.amount)}</td>
            </tr>
        `).join('');

        const deductionsRows = (slip.deductions || []).map((d: any) => `
            <tr>
                <td style="text-align: left; border: none; padding: 4px 0;">${d.name}:</td>
                <td style="text-align: right; border: none; padding: 4px 0; font-weight: bold;">${formatCurrency(d.amount)}</td>
            </tr>
        `).join('');

        const leaveRows = (slip.leaveDetails || []).map((l: any) => `
            <tr>
                <td style="text-align: center;">${l.serialNo}</td>
                <td style="text-align: left;">${l.leaveName || '-'}</td>
                <td style="text-align: center;">${l.totalLeaves || 0}</td>
                <td style="text-align: center;">${l.availedLeaves || 0}</td>
                <td style="text-align: center;">${l.balanceLeaves || 0}</td>
            </tr>
        `).join('');

        return `
            <div class="slip-container" style="${index > 0 ? 'page-break-before: always; margin-top: 40px;' : ''}">
                <div class="header" style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 25px;">
                    ${institution.logo ? `<img src="${institution.logo}" style="width: 100%; height: auto; max-height: 120px; object-fit: cover; margin-bottom: 15px; border-radius: 4px;" />` : ''}
                    <div style="margin-top: 10px;">
                        <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">SALARY SLIP</h2>
                        <p style="margin: 5px 0; font-size: 14px; font-weight: 600;">FOR THE MONTH OF ${month.toUpperCase()} ${year}</p>
                    </div>
                    <p style="margin: 10px auto 0; font-size: 11px; color: #666; max-width: 600px; line-height: 1.4;">${institution.address}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
                    <tr>
                        <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                            <div style="margin-bottom: 8px;"><strong>Name:</strong> ${slip.employeeName}</div>
                            <div style="margin-bottom: 8px;"><strong>Employee Code:</strong> ${slip.employeeCode || '-'}</div>
                            <div style="margin-bottom: 8px;"><strong>Designation:</strong> ${slip.designation}</div>
                            <div style="margin-bottom: 8px;"><strong>Pay Level:</strong> ${slip.payLevel || '-'}</div>
                            <div style="margin-bottom: 8px;"><strong>Bank Name:</strong> ${slip.bankName || '-'}</div>
                            <div style="margin-bottom: 8px;"><strong>Bank Acc No:</strong> ${slip.bankAccountNo || '-'}</div>
                        </td>
                        <td style="width: 50%; vertical-align: top;">
                            <div style="margin-bottom: 8px;"><strong>PF No:</strong> ${slip.pfNo || '-'}</div>
                            <div style="margin-bottom: 8px;"><strong>PAN No:</strong> ${slip.panNo || '-'}</div>
                            <div style="margin-bottom: 8px;"><strong>ESI No:</strong> ${slip.esiNo || '-'}</div>
                            <div style="margin-bottom: 8px;"><strong>LOP Days:</strong> ${slip.lopDays || 0}</div>
                        </td>
                    </tr>
                </table>

                <div style="display: flex; gap: 40px; margin-bottom: 30px;">
                    <div style="flex: 1;">
                        <h3 style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-top: 0;">Pay and Allowance</h3>
                        <table style="width: 100%; border: none;">
                            ${earningsRows}
                            <tr><td colspan="2" style="border-top: 1px solid #ccc; padding: 5px 0;"></td></tr>
                            <tr>
                                <td style="text-align: left; font-weight: bold;">Gross Pay:</td>
                                <td style="text-align: right; font-weight: bold;">${formatCurrency(slip.grossPay)}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="flex: 1;">
                        <h3 style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-top: 0;">Deductions</h3>
                        <table style="width: 100%; border: none;">
                            ${deductionsRows}
                            <tr><td colspan="2" style="border-top: 1px solid #ccc; padding: 5px 0;"></td></tr>
                            <tr>
                                <td style="text-align: left; font-weight: bold;">Total Deduction:</td>
                                <td style="text-align: right; font-weight: bold;">${formatCurrency(slip.totalDeduction)}</td>
                            </tr>
                            <tr>
                                <td style="text-align: left; font-weight: bold; color: #166534; font-size: 16px;">Net Payable:</td>
                                <td style="text-align: right; font-weight: bold; color: #166534; font-size: 16px;">${formatCurrency(slip.netPayable)}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                ${slip.amountInWords ? `<div style="text-align: center; margin-bottom: 20px; font-style: italic; font-size: 13px;">(${slip.amountInWords})</div>` : ''}

                <div style="text-align: center; color: #666; font-size: 11px; margin-bottom: 30px;">
                    *This is a Computer generated payslip, does not require any signature.
                </div>

                ${slip.leaveDetails && slip.leaveDetails.length > 0 ? `
                <div style="margin-top: 20px;">
                    <h3 style="border-bottom: 1px solid #333; padding-bottom: 5px;">Leave Details</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="background-color: #f3f4f6;">
                                <th style="border: 1px solid #ccc; padding: 8px;">Serial No.</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Leave Name</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Total Leaves</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Availed Leaves</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Balance Leaves</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${leaveRows}
                        </tbody>
                    </table>
                </div>
                ` : ''}
            </div>
        `;
    }).join('');

    printWindow.document.write(`
        <html>
        <head>
            <title>Salary Slips - ${month} ${year}</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    padding: 40px; 
                    color: #333;
                }
                @media print {
                    body { padding: 20px; }
                    .slip-container { page-break-after: always; }
                }
                table { border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                #no-border-table td { border: none !important; }
            </style>
        </head>
        <body>
            ${slipHtml}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        // Option to close window after print
        // printWindow.close();
    }, 500);
};
