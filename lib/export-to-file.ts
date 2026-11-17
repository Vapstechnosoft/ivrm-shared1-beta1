import { formatDate } from 'date-fns';
import xlsx from 'json-as-xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (fileName: string, columns: any, content: any, date_required = true) => {
    const data = [
        {
            sheet: fileName,
            columns: JSON.parse(columns),
            content: JSON.parse(content)
        }
    ];

    const settings = {
        fileName: date_required ? `${fileName}_${formatDate(new Date(), 'yyyyMMdd')}` : fileName
    };
    xlsx(data, settings);
};

export const exportToPdf = (fileName: string, columns: any, content: any) => {
    const doc = new jsPDF({ orientation: 'l' });
    const title = fileName;
    const padding = 10;
    const titleWidth = doc.getTextWidth(title);
    const center = (doc.internal.pageSize.width - titleWidth) / 2;

    doc.setFontSize(20);
    doc.setFont('arial', 'bold');
    doc.text(title, center, padding);

    autoTable(doc, {
        head: [columns],
        body: content.map((item: any) => item),
        tableLineWidth: 0.5,
        tableLineColor: 'black',
        theme: 'grid',
        headStyles: { halign: 'center', fillColor: '#6f3feb', fontSize: 10 },
        styles: { halign: 'center', lineWidth: 0.2, lineColor: 'black' }
    });

    doc.save(`${title}.pdf`);
};
