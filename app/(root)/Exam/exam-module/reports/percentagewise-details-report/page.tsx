'use client';

import { useState } from 'react';
import { ReportForm } from './_components/report-form';
import { ReportList } from './_components/report-list';

import * as XLSX from 'xlsx';

export default function PercentagewiseDetailsReportPage() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [institutionDetails, setInstitutionDetails] = useState<any[]>([]);
    const [reportCriteria, setReportCriteria] = useState<string>('');

    const handleReportGenerated = (response: any, payload: any) => {
        if (response?.data) {
            // The API returns data directly in response.data array, not in response.data.datareport
            setReportData(Array.isArray(response.data) ? response.data : []);
            
            setInstitutionDetails(response.data.institution || []);

            // Construct criteria string (simplified for now, ideally derived from payload names)
            // Since we only have IDs in payload, we rely on the component usage or just display basic info
            // In a real scenario, we would map IDs back to names or pass names from the form.
            setReportCriteria(`Report for Year ID: ${payload.asmaY_Id}, Exam ID: ${payload.emE_Id}`);
        } else {
            setReportData([]);
            setInstitutionDetails([]);
            setReportCriteria('');
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById('report-print-section');
        if (printContent) {
            const content = printContent.innerHTML;
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Print Report</title>');
                // Add Tailwind or basic styles for print
                printWindow.document.write(`
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                        th { background-color: #f2f2f2; }
                        .text-left { text-align: left; }
                        .text-center { text-align: center; }
                        .mb-4 { margin-bottom: 1rem; }
                        .font-bold { font-weight: bold; }
                        .text-xl { font-size: 1.25rem; }
                    </style>
                `);
                printWindow.document.write('</head><body>');
                printWindow.document.write(content);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            }
        }
    };

    const handleExcel = () => {
        if (reportData.length === 0) return;

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Prepare data for Excel
        const exportData = reportData.map((item, index) => ({
            'Sl No.': index + 1,
            Class: item.asmcL_ClassName,
            Section: item.asmC_SectionName,
            Student: item.studentname,
            'Obtained Marks': item.estmP_TotalObtMarks,
            'Max Marks': item.estmP_TotalMaxMarks,
            Percentage: item.estmP_Percentage
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, 'PercentageWiseReport.xlsx');
    };

    return (
        <div className='container mx-auto p-4'>
            <ReportForm onReportGenerated={handleReportGenerated} onPrint={handlePrint} onExcel={handleExcel} />
            {reportData.length > 0 && <ReportList data={reportData} institution={institutionDetails} criteria={reportCriteria} />}
        </div>
    );
}
