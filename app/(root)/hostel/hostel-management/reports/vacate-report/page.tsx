'use client';

import { useEffect, useState } from 'react';
import VacateReportForm from './_components/report-form';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';
import { getVacateReport, getVacateReportLoadData } from '@/server/hostel/hostel-management/reports/vacate-report';

export default function VacateReportPage() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [reportType, setReportType] = useState<any>('student');
    const [loadData, setLoadData] = useState<any>(null);
    const [currentDate] = useState(new Date());

    useEffect(() => {
        (async () => {
            try {
                const res = await getVacateReportLoadData('student');
                if (res) setLoadData(res);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const handleReportGenerated = (data: any[], type: string) => {
        setReportData(data);
        setReportType(type);
    };

    const handlePrint = () => {
        if (!reportData || reportData.length === 0) return;

        const tableContent = document.getElementById('reportTable');

        if (tableContent) {
            const popupWindow = window.open('', '_blank', 'width=1000,height=1000');
            if (popupWindow) {
                popupWindow.document.open();
                popupWindow.document.write(`
                    <html>
                        <head>
                            <title>Hostel Vacate Report</title>
                            <style>
                                body { font-family: 'Times New Roman', serif; padding: 20px; }
                                .header { text-align: center; margin-bottom: 20px; }
                                .school-name { font-size: 24px; font-weight: bold; color: #2e57a0; margin: 0; }
                                .report-title { font-size: 18px; font-weight: bold; margin-top: 10px; }
                                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                                th { background-color: #f2f2f2; font-weight: bold; }
                                .text-center { text-align: center; }
                            </style>
                        </head>
                        <body onload="window.print(); window.close();">
                            <div class="header">
                                <h1 class="school-name">Hostel Vacate Report</h1>
                                <div class="report-title">
                                    ${reportType === 'student' ? 'Student' : reportType === 'staff' ? 'Staff' : 'Guest'} Vacate Details
                                </div>
                            </div>
                            ${tableContent.outerHTML}
                            <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px;">
                                <div>Signature</div>
                                <div>Date: ${format(currentDate, 'dd/MM/yyyy')}</div>
                            </div>
                        </body>
                    </html>
                `);
                popupWindow.document.close();
            }
        }
    };

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {loadData ? (
                    <VacateReportForm
                        initialData={loadData}
                        onReportGenerated={handleReportGenerated}
                    />
                ) : (
                    <div className="flex items-center justify-center p-8">Loading form data...</div>
                )}

                {reportData.length > 0 && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Report Results</CardTitle>
                            <Button variant="outline" size="sm" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border mt-4">
                                <Table id="reportTable">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">SL.No.</TableHead>
                                            {reportType === 'student' && (
                                                <>
                                                    <TableHead>Student Name</TableHead>
                                                    <TableHead>Class</TableHead>
                                                    <TableHead>Hostel</TableHead>
                                                    <TableHead>Room</TableHead>
                                                    <TableHead>Vacate Date</TableHead>
                                                </>
                                            )}
                                            {reportType === 'staff' && (
                                                <>
                                                    <TableHead>Staff Name</TableHead>
                                                    <TableHead>Dept</TableHead>
                                                    <TableHead>Hostel</TableHead>
                                                    <TableHead>Room</TableHead>
                                                    <TableHead>Vacate Date</TableHead>
                                                </>
                                            )}
                                            {reportType === 'guest' && (
                                                <>
                                                    <TableHead>Guest Name</TableHead>
                                                    <TableHead>Hostel</TableHead>
                                                    <TableHead>Room</TableHead>
                                                    <TableHead>Vacate Date</TableHead>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                {reportType === 'student' && (
                                                    <>
                                                        <TableCell>{item.studentname}</TableCell>
                                                        <TableCell>{item.ASMCL_ClassName}</TableCell>
                                                        <TableCell>{item.HLMH_Name}</TableCell>
                                                        <TableCell>{item.HRMRM_RoomNo}</TableCell>
                                                        <TableCell>{format(new Date(item.HLHSV_VacateDate), 'dd/MM/yyyy')}</TableCell>
                                                    </>
                                                )}
                                                {reportType === 'staff' && (
                                                    <>
                                                        <TableCell>{item.empname}</TableCell>
                                                        <TableCell>{item.HRMD_DepartmentName}</TableCell>
                                                        <TableCell>{item.HLMH_Name}</TableCell>
                                                        <TableCell>{item.HRMRM_RoomNo}</TableCell>
                                                        <TableCell>{format(new Date(item.HLHSTV_VacateDate), 'dd/MM/yyyy')}</TableCell>
                                                    </>
                                                )}
                                                {reportType === 'guest' && (
                                                    <>
                                                        <TableCell>{item.hlhgstalT_GuestName}</TableCell>
                                                        <TableCell>{item.HLMH_Name}</TableCell>
                                                        <TableCell>{item.HRMRM_RoomNo}</TableCell>
                                                        <TableCell>{format(new Date(item.HLHGV_VacateDate), 'dd/MM/yyyy')}</TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
