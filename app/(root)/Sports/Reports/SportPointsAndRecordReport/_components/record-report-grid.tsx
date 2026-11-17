'use client';

import { IPointsRecordReportData } from '@/types/sports/reports/points-record-report';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Printer } from 'lucide-react';

interface ReportGridProps {
    data: IPointsRecordReportData[];
}

export const ReportGrid = ({ data }: ReportGridProps) => {
    if (!data || data.length === 0) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        console.log('Export to Excel');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-semibold">Sport Point And Record Report</h3>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
                        <Printer size={16} /> Print
                    </Button>
                    <Button variant="outline" onClick={handleExport} className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700">
                        <FileSpreadsheet size={16} /> Excel
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                    <thead className="bg-[#3a5dae] text-white">
                        <tr>
                            <th className="border p-2">SL. No.</th>
                            <th className="border p-2">Adm. No.</th>
                            <th className="border p-2">Student Name</th>
                            <th className="border p-2">Place</th>
                            <th className="border p-2">Points</th>
                            <th className="border p-2">Division Name</th>
                            <th className="border p-2">House Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.amst_Id} className="hover:bg-gray-50 text-center">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{item.adm_no}</td>
                                <td className="border p-2">{item.studentname}</td>
                                <td className="border p-2">{item.spccestR_Place}</td>
                                <td className="border p-2">{item.spccestR_Points}</td>
                                <td className="border p-2">{item.spccmD_DivisionName}</td>
                                <td className="border p-2">{item.spccmH_HouseName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-sm text-gray-500 pt-2">
                Total Records: {data.length}
            </div>
        </div>
    );
};
