import { createRoot } from 'react-dom/client';
import { LetterRenderer } from './letter-templates';

export const printEmployeeLetter = (details: any, formData: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContainer = document.createElement('div');
    const root = createRoot(printContainer);

    root.render(
        <LetterRenderer details={details} formData={formData} />
    );

    setTimeout(() => {
        printWindow.document.write('<html><head><title>Employee Letter</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('<style>@media print { body { -webkit-print-color-adjust: exact; } .no-print { display: none; } }</style>');
        printWindow.document.write('</head><body className="bg-white">');
        printWindow.document.write(printContainer.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 500);
    }, 300);
};
