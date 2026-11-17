'use client';

import { IMonthEndReportData, MonthEndReportFormSchema } from '@/types/sports/reports/month-end-report';
import { useMonthEndReport } from '@/hooks/sports/useMonthEndReport';

interface ReportGridProps {
    data: IMonthEndReportData;
    formData: MonthEndReportFormSchema | null;
}

export default function ReportGrid({ data, formData }: ReportGridProps) {
    const { loadData } = useMonthEndReport();

    const getMonthName = (monthId: number) => {
        return loadData.data?.monthList.find(m => m.month === monthId)?.monthname || '';
    };

    const getYearName = (yearId: number) => {
        return loadData.data?.academicYear.find(y => y.asmaY_Id === yearId)?.asmaY_Year || '';
    };

    const today = new Date().toLocaleDateString();

    return (
        <div className="rounded-md border bg-white p-6 shadow-sm">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-bold uppercase">
                    Sports {formData?.month ? getMonthName(formData.month) : ''} Month Report
                </h3>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded bg-slate-50">
                <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Name:</span>
                    <span>{formData?.iename || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Date:</span>
                    <span>{today}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Designation:</span>
                    <span>Implementation Engineer</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Academic Year:</span>
                    <span>{formData?.ASMAY_Id ? getYearName(formData.ASMAY_Id) : ''}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Module:</span>
                    <span>Sports</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 p-2">SL.NO</th>
                            <th className="border border-gray-300 p-2">Strength</th>
                            <th className="border border-gray-300 p-2">Total</th>
                            <th className="border border-gray-300 p-2">Non Position Holders</th>
                            <th className="border border-gray-300 p-2">Position Holders</th>
                            <th className="border border-gray-300 p-2">Winners</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-2">1</td>
                            <td className="border border-gray-300 p-2">Student Strength</td>
                            <td className="border border-gray-300 p-2">{data.total_count_student}</td>
                            <td className="border border-gray-300 p-2">{data.not_patr_std}</td>
                            <td className="border border-gray-300 p-2">{data.total_partic_student}</td>
                            <td className="border border-gray-300 p-2">{data.total_winner_student}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8 text-sm pt-8">
                <div>Implementation Engineer: _____________________</div>
                <div>End User Signature: _______________________</div>
                <div className="mt-4">Nodal Officer: ______________________</div>
                <div className="mt-4">With Seal: ______________________</div>
            </div>
        </div>
    );
}
