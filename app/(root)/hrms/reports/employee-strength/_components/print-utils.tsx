import { createRoot } from 'react-dom/client';
import { EmployeeStrengthReportTemplate } from './report-template';

export const printEmployeeStrengthReport = (data: any, departmentwise: boolean, leftEmployee: boolean) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContainer = document.createElement('div');
    const root = createRoot(printContainer);

    root.render(
        <EmployeeStrengthReportTemplate 
            data={ data } 
            departmentwise = { departmentwise } 
            leftEmployee = { leftEmployee }
        />
    );

    // Wait for render to complete (React 18 root.render is async in a sense, but simple components usually render immediately)
    // Using a small timeout to ensure styles and content are ready
    setTimeout(() => {
        printWindow.document.write('<html><head><title>Employee Strength Report</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContainer.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Give tailwind a moment to process if needed, then print
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 500);
    }, 300);
};
