'use client';

import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { getTBSReportSchool } from '@/server/exam/exam-module/reports/tbs-report-school';
import { Printer } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import TBSReportSchoolForm from './_components/add-form';
import TBSReportSchoolExcel from './_components/tbs-report-school-excel';
import TBSReportSchoolPrintable from './_components/tbs-report-school-printable';

export default function TBSReportSchoolPage() {
    const [reportData, setReportData] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFormSuccess = async (payload: Record<string, any>) => {
        setIsGenerating(true);
        try {
            const res = await getTBSReportSchool(payload);
            if (res.success) {
                setReportData(res.data);
                toast.success('Report generated successfully');
            } else {
                toast.error(res.message || 'Failed to generate report');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById('TBSReportSchool');
        if (!printContent) return;

        const popupWin = window.open('', '_blank', 'width=900,height=600');
        if (!popupWin) return;

        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                    <title>Print Report Card</title>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Poppins', sans-serif; margin: 0; padding: 20px; }
                        @media print {
                            .page-break { page-break-after: always; }
                            thead { display: table-header-group; }
                        }
                        .report-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .report-table th, .report-table td { border: 1px solid black; padding: 4px; text-align: center; font-size: 11px; }
                        .report-table th { background: #f0f0f0; }
                        .text-left { text-align: left; }
                        .text-center { text-align: center; }
                        .w-full { width: 100%; }
                        .border { border: 1px solid black; }
                        .border-2 { border: 2px solid black; }
                        .p-4 { padding: 1rem; }
                        .mb-4 { margin-bottom: 1rem; }
                        .flex { display: flex; }
                        .gap-4 { gap: 1rem; }
                        .w-3\\/4 { width: 75%; }
                        .w-1\\/4 { width: 25%; }
                        .font-bold { font-weight: bold; }
                        .h-20 { height: 5rem; }
                        .h-32 { height: 8rem; }
                        .align-top { vertical-align: top; }
                        .pb-1 { padding-bottom: 0.25rem; }
                        .mb-1 { margin-bottom: 0.25rem; }
                        .border-b { border-bottom: 1px solid black; }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    ${printContent.innerHTML}
                </body>
            </html>
        `);
        popupWin.document.close();
    };

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <CollapsibleSection title='1 to 8 Report Card' defaultOpen>
                <TBSReportSchoolForm onSuccess={handleFormSuccess} onCancel={() => setReportData(null)} />
            </CollapsibleSection>

            {reportData && (
                <CollapsibleSection title='Report View' defaultOpen>
                    <div className='mb-4 flex justify-end gap-2 print:hidden'>
                        <Button onClick={handlePrint} variant='outline' size='sm' className='gap-2'>
                            <Printer className='h-4 w-4' />
                            Print
                        </Button>
                        <TBSReportSchoolExcel reportData={reportData} />
                    </div>

                    <div className='overflow-x-auto rounded-lg border bg-muted/5 p-6'>
                        <TBSReportSchoolPrintable reportData={reportData} />
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}
