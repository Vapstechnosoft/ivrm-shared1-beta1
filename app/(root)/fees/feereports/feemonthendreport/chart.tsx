'use client';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

type Props = {
    cash: number;
    bank: number;
    online: number;
    rtgs: number;
    card: number;
    ecs: number;
    cashRefund: number;
    bankRefund: number;
    defaulters: number;
};

export function FeeMonthEndChart({ cash, bank, online, rtgs, card, ecs, cashRefund, bankRefund, defaulters }: Props) {
    const data = [
        { name: 'Cash', Count: cash },
        { name: 'Bank', Count: bank },
        { name: 'Online', Count: online },
        { name: 'RTGS', Count: rtgs },
        { name: 'Card', Count: card },
        { name: 'ECS', Count: ecs },
        { name: 'CashRefund', Count: cashRefund },
        { name: 'BankRefund', Count: bankRefund },
        { name: 'Defaulters', Count: defaulters }
    ];

    return (
        <div className='mt-6 border p-4'>
            <ResponsiveContainer width='100%' height={300}>
                <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis interval={1} />
                    <Legend />
                    <Bar dataKey='Count' fill='#FFD700' /> {/* gold */}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function ExportToExcelData(reportData: any, formattedDate: string, schoolLogoUrl?: string, monthlabel?: string) {
    if (!reportData) {
        toast.error('No data to export');
        return;
    }

    // Header
    const header = [
        [`SCHOOL FEES ${monthlabel} MONTH REPORT`],
        [],
        ['Name :', reportData.iename || '', 'Date :', formattedDate],
        ['Designation :', 'Implementation Engineer', 'Academic Year :', reportData.academicYear || ''],
        ['Total SMS :', reportData.smsCount || 0, 'Total Email :', reportData.emailCount || 0],
        []
    ];

    // Table
    const table = [
        ['SL.NO', 'Name', 'Count', 'Kiosk', 'Portal and Dashboard'],
        [1, 'Fee Collection By Cash', reportData.cashCount || 0, 0, 0],
        [2, 'Fee Collection By Bank', reportData.bankCount || 0, 0, 0],
        [3, 'Fee Collection By Online', reportData.onlineCount || 0, 0, 0],
        [4, 'Fee Collection By RTGS', reportData.rtgs || 0, 0, 0],
        [5, 'Fee Collection By Card', reportData.cardCount || 0, 0, 0],
        [6, 'Fee Collection By ECS', reportData.ecs || 0, 0, 0],
        [7, 'Fee Refund By Cash', reportData.refund || 0, 0, 0],
        [8, 'Fee Refund By Bank', reportData.refundBank || 0, 0, 0],
        [9, 'Fee Defaulters', reportData.defaulters || 0, 0, 0],
        []
    ];

    // Footer
    const footer = [
        ['Implementation Engineer: _______________', 'Nodal Officer: _______________'],
        ['End User: _______________', 'Seal']
    ];

    const ws = XLSX.utils.aoa_to_sheet([...header, ...table, ...footer]);

    // Optional: Insert image (requires extra library like xlsx-populate or exceljs)
    // XLSX alone cannot embed images

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fee Month End Report');

    XLSX.writeFile(wb, `Fee_Month_End_Report_${formattedDate.replace(/ /g, '_')}.xlsx`);
}

export function ExporttoPrint(htmlContent: string) {
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
        <html>
            <head>
                <title>Fee Month End Report</title>

                <style>
                   @page {
    size: A4 landscape;
    margin: 12mm;
}

html, body {
    margin: 0;
    padding: 0;
    background: white;
    font-family: Arial, sans-serif;
}

/* REMOVE flex from body */
body {
    width: 100%;
}

/* Center the printable content */
.print-container {
    width: 100%;
    max-width: 297mm;
    margin: 0 auto;     /* ✅ THIS centers horizontally */
    box-sizing: border-box;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}

th, td {
    border: 1px solid #000;
    padding: 6px;
}

/* Logo */
img {
    display: block;
    margin: 0 auto;
    max-height: 100px;
}

/* Page break helper */
.page-break {
    page-break-before: always;
}

/* Hide buttons */
button {
    display: none !important;
}

                </style>
            </head>

            <body>
                <div class="print-container">
                    ${htmlContent}
                </div>
            </body>
        </html>
    `);

    printWindow.document.close();

    // ✅ Wait for images to load
    const waitForImages = () => {
        const images = printWindow.document.images;
        let loaded = 0;

        if (images.length === 0) {
            triggerPrint();
            return;
        }

        for (const img of images) {
            img.onload = img.onerror = () => {
                loaded++;
                if (loaded === images.length) {
                    triggerPrint();
                }
            };
        }
    };

    const triggerPrint = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    waitForImages();
}
