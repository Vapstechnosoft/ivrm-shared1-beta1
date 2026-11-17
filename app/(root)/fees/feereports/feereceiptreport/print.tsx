// Define types for receipt data
interface FeeRow {
    slNo: number;
    particulars: string;
    installment?: string;
    totalCharges?: number;
    concession?: number;
    paidAmount?: number;
    balance?: number;
}

interface PaymentRow {
    slNo: number;
    amount: number;
    bank?: string;
    ddNo?: string;
    date?: string;
}

interface ReceiptData {
    receiptNo: string;
    admissionNo: string;
    studentName: string;
    fatherName: string;
    academicYear: string;
    className: string;
    feeRows: FeeRow[];
    paymentRows: PaymentRow[];
    amountInWords: string;
    paymentMode: string;
    date: string;
}

// Single receipt includes logo
interface SingleReceiptData extends ReceiptData {
    logodata: string;
}

// Multiple receipts - logo at parent level
interface MultipleReceiptsData {
    logodata: string;
    receipts: ReceiptData[];
}

// Overload type for both single and multiple receipts
type PrintReceiptData = SingleReceiptData | MultipleReceiptsData;

// Helper function to check if data contains multiple receipts
function isMultipleReceipts(data: PrintReceiptData): data is MultipleReceiptsData {
    return 'receipts' in data && Array.isArray(data.receipts);
}
// Overload type for both single and multiple receipts

// Helper function to check if data contains multiple receipts

export function ExporttoPrint(data: PrintReceiptData) {
    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) return;

    printWindow.document.open();

    if (isMultipleReceipts(data)) {
        // Multiple receipts
        printWindow.document.write(generateMultipleReceiptsHTML(data));
    } else {
        // Single receipt
        printWindow.document.write(generateSingleReceiptHTML(data));
    }

    printWindow.document.close();

    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 800);
    };
}

// Function to generate HTML for single receipt
// Function to generate HTML for single receipt
// Function to generate HTML for single receipt
function generateSingleReceiptHTML(data: SingleReceiptData): string {
    const {
        logodata,
        receiptNo,
        admissionNo,
        studentName,
        fatherName,
        academicYear,
        className,
        feeRows,
        paymentRows,
        amountInWords,
        paymentMode,
        date
    } = data;

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Receipt - ${receiptNo}</title>

<style>
* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  margin: 0;
  padding: 0;
}

@page {
  size: A4 landscape;
  margin: 10mm;
}

body {
  margin: 0;
  background: white;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
}

.print-root {
  width: 100%;
  padding: 15px 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

th, td {
  border: 1px solid #000;
  padding: 8px;
  font-size: 12px;
}

th {
  background: #f3f3f3;
  font-weight: bold;
}

h1 { 
  font-size: 24px; 
  margin: 10px 0;
}
h2 { 
  font-size: 20px; 
  margin: 15px 0;
  text-align: center;
}
h3 { 
  font-size: 16px; 
  margin: 10px 0;
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ccc;
}

.logo-img {
  max-height: 120px; /* Increased from 100px */
  max-width: 400px;  /* Increased from 300px */
  width: auto;
  height: auto;
  object-fit: contain;
}

/* Force larger logo size for print */
@media print {
  .logo-img {
    max-height: 180px !important;
    max-width: 600px !important;
    height: 150px !important;
  }
}

.receipt-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 20px 0;
  font-size: 14px;
}

.receipt-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

/* Page break for multiple receipts */
.receipt-container {
  page-break-after: always;
}
.receipt-container:last-child {
  page-break-after: avoid;
}

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }
.bold { font-weight: bold; }

/* Print specific optimizations */
@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
 .logo-img {
  max-height: 150px;
  max-width: 500px;
  width: auto;
  height: auto;
  object-fit: contain;
}
  
  th {
    background: #f3f3f3 !important;
  }
}
</style>
</head>

<body>
<div class="print-root receipt-container">

  <!-- HEADER WITH LOGO - BIGGER SIZE -->
  <div class="logo-container">
    ${logodata ? `<img src="${logodata}" alt="Institute Logo" class="logo-img" style="max-height: 120px; max-width: 400px;" />` : ''}
  </div>

  <!-- RECEIPT META INFO -->
  <div class="receipt-meta">
    <div>
      <p><span class="bold">Receipt No:</span> ${receiptNo}</p>
      <p><span class="bold">Admission No:</span> ${admissionNo}</p>
      <p><span class="bold">Student Name:</span> ${studentName}</p>
      <p><span class="bold">Father's Name:</span> ${fatherName}</p>
    </div>
    <div class="text-right">
      <p><span class="bold">Date:</span> ${date}</p>
      <p><span class="bold">Academic Year:</span> ${academicYear}</p>
      <p><span class="bold">Class/Section:</span> ${className}</p>
    </div>
  </div>

  <h2>FEE RECEIPT</h2>

  <!-- FEE DETAILS TABLE -->
  <table>
    <thead>
      <tr>
        <th>SL.NO</th>
        <th>PARTICULARS</th>
        <th>INSTALLMENT</th>
        <th>TOTAL CHARGES</th>
        <th>CONCESSION</th>
        <th>PAID AMOUNT</th>
        <th>BALANCE</th>
      </tr>
    </thead>
    <tbody>
      ${feeRows
          .map(
              (r, i) => `
        <tr>
          <td class="text-center">${i + 1}</td>
          <td class="text-left">${r.particulars}</td>
          <td class="text-center">${r.installment ?? '-'}</td>
          <td class="text-right">${r.totalCharges?.toFixed(2) ?? '0.00'}</td>
          <td class="text-right">${r.concession?.toFixed(2) ?? '0.00'}</td>
          <td class="text-right">${r.paidAmount?.toFixed(2) ?? '0.00'}</td>
          <td class="text-right">${r.balance?.toFixed(2) ?? '0.00'}</td>
        </tr>
      `
          )
          .join('')}
    </tbody>
  </table>

  <!-- PAYMENT DETAILS -->
  <h3>CURRENT PAYMENT DETAIL</h3>

  <table>
    <thead>
      <tr>
        <th>SL.NO</th>
        <th>AMOUNT</th>
        <th>BANK</th>
        <th>DD.NO</th>
        <th>DATE</th>
      </tr>
    </thead>
    <tbody>
      ${paymentRows
          .map(
              (p, i) => `
        <tr>
          <td class="text-center">${i + 1}</td>
          <td class="text-right">${p.amount?.toFixed(2) ?? '0.00'}</td>
          <td class="text-center">${p.bank ?? '-'}</td>
          <td class="text-center">${p.ddNo ?? '-'}</td>
          <td class="text-center">${p.date ?? new Date().toLocaleDateString()}</td>
        </tr>
      `
          )
          .join('')}
    </tbody>
  </table>

  <!-- FOOTER -->
  <div class="receipt-footer">
    <div>
      <p><span class="bold">Amount Received:</span> ${amountInWords}</p>
      <p><span class="bold">Payment Mode:</span> ${paymentMode}</p>
    </div>
    <div class="text-right">
      <div style="border-top: 1px solid #000; padding-top: 10px; display: inline-block;">
        <p class="bold">AUTHORIZED SIGNATORY</p>
      </div>
    </div>
  </div>

</div>
</body>
</html>
`;
}

// Function to generate HTML for multiple receipts
function generateMultipleReceiptsHTML(data: MultipleReceiptsData): string {
    const { logodata, receipts } = data;

    const receiptsHTML = receipts
        .map(
            (receipt, index) => `
        <div class="print-root receipt-container" style="${index > 0 ? 'page-break-before: always;' : ''}">
        
          <!-- HEADER WITH LOGO - BIGGER SIZE -->
          <div class="logo-container">
            ${logodata ? `<img src="${logodata}" alt="Institute Logo" class="logo-img" style="max-height: 120px; max-width: 400px;" />` : ''}
          </div>

          <!-- RECEIPT META INFO -->
          <div class="receipt-meta">
            <div>
              <p><span class="bold">Receipt No:</span> ${receipt.receiptNo}</p>
              <p><span class="bold">Admission No:</span> ${receipt.admissionNo}</p>
              <p><span class="bold">Student Name:</span> ${receipt.studentName}</p>
              <p><span class="bold">Father's Name:</span> ${receipt.fatherName}</p>
            </div>
            <div class="text-right">
              <p><span class="bold">Date:</span> ${receipt.date}</p>
              <p><span class="bold">Academic Year:</span> ${receipt.academicYear}</p>
              <p><span class="bold">Class/Section:</span> ${receipt.className}</p>
            </div>
          </div>

          <h2>FEE RECEIPT</h2>

          <!-- FEE DETAILS TABLE -->
          <table>
            <thead>
              <tr>
                <th>SL.NO</th>
                <th>PARTICULARS</th>
                <th>INSTALLMENT</th>
                <th>TOTAL CHARGES</th>
                <th>CONCESSION</th>
                <th>PAID AMOUNT</th>
                <th>BALANCE</th>
              </tr>
            </thead>
            <tbody>
              ${receipt.feeRows
                  .map(
                      (r, i) => `
                <tr>
                  <td class="text-center">${i + 1}</td>
                  <td class="text-left">${r.particulars}</td>
                  <td class="text-center">${r.installment ?? '-'}</td>
                  <td class="text-right">${r.totalCharges?.toFixed(2) ?? '0.00'}</td>
                  <td class="text-right">${r.concession?.toFixed(2) ?? '0.00'}</td>
                  <td class="text-right">${r.paidAmount?.toFixed(2) ?? '0.00'}</td>
                  <td class="text-right">${r.balance?.toFixed(2) ?? '0.00'}</td>
                </tr>
              `
                  )
                  .join('')}
            </tbody>
          </table>

          <!-- PAYMENT DETAILS -->
          <h3>CURRENT PAYMENT DETAIL</h3>

          <table>
            <thead>
              <tr>
                <th>SL.NO</th>
                <th>AMOUNT</th>
                <th>BANK</th>
                <th>DD.NO</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              ${receipt.paymentRows
                  .map(
                      (p, i) => `
                <tr>
                  <td class="text-center">${i + 1}</td>
                  <td class="text-right">${p.amount?.toFixed(2) ?? '0.00'}</td>
                  <td class="text-center">${p.bank ?? '-'}</td>
                  <td class="text-center">${p.ddNo ?? '-'}</td>
                  <td class="text-center">${p.date ?? new Date().toLocaleDateString()}</td>
                </tr>
              `
                  )
                  .join('')}
            </tbody>
          </table>

          <!-- FOOTER -->
          <div class="receipt-footer">
            <div>
              <p><span class="bold">Amount Received:</span> ${receipt.amountInWords}</p>
              <p><span class="bold">Payment Mode:</span> ${receipt.paymentMode}</p>
            </div>
            <div class="text-right">
              <div style="border-top: 1px solid #000; padding-top: 10px; display: inline-block;">
                <p class="bold">AUTHORIZED SIGNATORY</p>
              </div>
            </div>
          </div>
          
          <!-- Receipt counter (only for multiple receipts) -->
          ${
              receipts.length > 1
                  ? `
          <div class="text-center" style="margin-top: 30px; font-size: 12px; color: #666;">
            Receipt ${index + 1} of ${receipts.length}
          </div>
          `
                  : ''
          }
          
        </div>
    `
        )
        .join('');

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Multiple Receipts - ${receipts.length} Receipt(s)</title>

<style>
* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  margin: 0;
  padding: 0;
}

@page {
  size: A4 landscape;
  margin: 10mm;
}

body {
  margin: 0;
  background: white;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
}

.print-root {
  width: 100%;
  padding: 15px 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

th, td {
  border: 1px solid #000;
  padding: 8px;
  font-size: 12px;
}

th {
  background: #f3f3f3;
  font-weight: bold;
}

h1 { 
  font-size: 24px; 
  margin: 10px 0;
}
h2 { 
  font-size: 20px; 
  margin: 15px 0;
  text-align: center;
}
h3 { 
  font-size: 16px; 
  margin: 10px 0;
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ccc;
}

.logo-img {
  max-height: 120px;
  max-width: 400px;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* Force larger logo size for print */
@media print {
  .logo-img {
    max-height: 150px !important;
    max-width: 500px !important;
    height: 120px !important;
    width: auto !important;
  }
}

.receipt-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 20px 0;
  font-size: 14px;
}

.receipt-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

/* Page break for multiple receipts */
.receipt-container {
  page-break-after: always;
}
.receipt-container:last-child {
  page-break-after: avoid;
}

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }
.bold { font-weight: bold; }

/* Print specific optimizations */
@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .logo-img {
  max-height: 150px;
  max-width: 500px;
  width: auto;
  height: auto;
  object-fit: contain;
}
  
  th {
    background: #f3f3f3 !important;
  }
}
</style>
</head>

<body>
  ${receiptsHTML}
</body>
</html>
`;
}
