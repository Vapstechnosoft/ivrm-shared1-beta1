'use client';

import { IPointsRecordReportData, PointsRecordReportFormSchema } from '@/types/sports/reports/points-record-report';
import { usePointsRecordReport } from '@/hooks/sports/usePointsRecordReport';

interface ReportGridProps {
    data: IPointsRecordReportData[];
    formData: PointsRecordReportFormSchema | null;
}

export default function ReportGrid({ data, formData }: ReportGridProps) {
    const { loadData } = usePointsRecordReport();

    const getYearName = (yearId: number) => {
        return loadData.data?.academicYear.find(y => y.asmaY_Id === yearId)?.asmaY_Year || '';
    };

    const getCategoryName = (catId: number) => {
        return loadData.data?.categoryList.find(c => c.spccmcC_Id === catId)?.spccmcC_CompitionCategory || '';
    };

    // Grouping logic for CC view
    const groupedData = data.reduce((acc: any, item) => {
        const eventName = item.SPCCME_EventName;
        if (!acc[eventName]) acc[eventName] = [];
        acc[eventName].push(item);
        return acc;
    }, {});

    const eventNames = Object.keys(groupedData);

    if (formData?.Type === 'CC') {
        return (
            <div className="rounded-md border bg-white p-6 shadow-sm" id="printCCwise">
                <div className="mb-6 text-center">
                    <h3 className="text-xl font-bold uppercase">POINTS RECORD REPORT</h3>
                    <div className="mt-2 text-sm font-medium">
                        <p>Academic Year: {formData.ASMAY_Id ? getYearName(formData.ASMAY_Id) : ''}</p>
                        <p>Competition Category: {formData.SPCCMCC_Id ? getCategoryName(formData.SPCCMCC_Id) : ''}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-center text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 p-2">SL. NO</th>
                                <th className="border border-gray-300 p-2">Place</th>
                                <th className="border border-gray-300 p-2">Student Name</th>
                                <th className="border border-gray-300 p-2">Adm. No.</th>
                                <th className="border border-gray-300 p-2">Class</th>
                                <th className="border border-gray-300 p-2">Section</th>
                                <th className="border border-gray-300 p-2">House Name</th>
                                <th className="border border-gray-300 p-2">Points</th>
                                <th className="border border-gray-300 p-2">Remarks</th>
                            </tr>
                        </thead>
                        {eventNames.map((eventName, eIdx) => (
                            <tbody key={eIdx}>
                                <tr>
                                    <td colSpan={9} className="bg-slate-50 border border-gray-300 p-2 font-bold text-left px-4">
                                        EVENT : {eventName}
                                    </td>
                                </tr>
                                {groupedData[eventName].map((item: any, sIdx: number) => (
                                    <tr key={`${eIdx}-${sIdx}`} className="hover:bg-gray-50">
                                        {sIdx === 0 && (
                                            <td rowSpan={groupedData[eventName].length} className="border border-gray-300 p-2">
                                                {eIdx + 1}
                                            </td>
                                        )}
                                        <td className="border border-gray-300 p-2">{item.SPCCESTR_Rank}</td>
                                        <td className="border border-gray-300 p-2">{item.AMST_Name}</td>
                                        <td className="border border-gray-300 p-2">{item.AMST_AdmNo}</td>
                                        <td className="border border-gray-300 p-2">{item.ASMCL_ClassName}</td>
                                        <td className="border border-gray-300 p-2">{item.ASMC_SectionName}</td>
                                        <td className="border border-gray-300 p-2">{item.SPCCMH_HouseName}</td>
                                        <td className="border border-gray-300 p-2">{item.SPCCESTR_Points}</td>
                                        <td className="border border-gray-300 p-2">{item.SPCCESTR_Remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-white p-6 shadow-sm" id="printSectionId">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-bold uppercase">POINTS RECORD REPORT {formData?.ASMAY_Id ? getYearName(formData.ASMAY_Id) : ''}</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-center text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 p-2">SL.NO</th>
                            <th className="border border-gray-300 p-2">Student Name</th>
                            <th className="border border-gray-300 p-2">Adm. No.</th>
                            <th className="border border-gray-300 p-2">Class</th>
                            <th className="border border-gray-300 p-2">Section</th>
                            <th className="border border-gray-300 p-2">House Name</th>
                            <th className="border border-gray-300 p-2">Event</th>
                            <th className="border border-gray-300 p-2">Venue</th>
                            <th className="border border-gray-300 p-2">Sports</th>
                            <th className="border border-gray-300 p-2">Points</th>
                            <th className="border border-gray-300 p-2">Place</th>
                            <th className="border border-gray-300 p-2">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 p-2">{index + 1}</td>
                                <td className="border border-gray-300 p-2">{item.AMST_Name}</td>
                                <td className="border border-gray-300 p-2">{item.AMST_AdmNo}</td>
                                <td className="border border-gray-300 p-2">{item.ASMCL_ClassName}</td>
                                <td className="border border-gray-300 p-2">{item.ASMC_SectionName}</td>
                                <td className="border border-gray-300 p-2">{item.SPCCMH_HouseName}</td>
                                <td className="border border-gray-300 p-2">{item.SPCCME_EventName}</td>
                                <td className="border border-gray-300 p-2">{item.SPCCMEV_EventVenue}</td>
                                <td className="border border-gray-300 p-2">{item.SPCCMSCC_SportsCCName}</td>
                                <td className="border border-gray-300 p-2">{item.SPCCESTR_Points}</td>
                                <td className="border border-gray-300 p-2">{item.SPCCESTR_Rank}</td>
                                <td className="border border-gray-300 p-2">{item.SPCCESTR_Remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-right">
                Total Records: {data.length}
            </div>
        </div>
    );
}
