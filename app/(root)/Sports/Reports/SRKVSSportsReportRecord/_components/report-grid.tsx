'use client';

import { ISRKVSReportData } from '@/types/sports/reports/srkvs-sports-report-record';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface ReportGridProps {
    data: ISRKVSReportData[];
    type: string;
}

export const ReportGrid = ({ data, type }: ReportGridProps) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (componentRef.current) {
            const printContent = componentRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to restore event listeners
        }
    };

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                <Button onClick={handlePrint} variant="outline">
                    <i className="fa fa-print mr-2"></i> Print
                </Button>
                <Button variant="outline">
                    <i className="fa fa-file-excel-o mr-2"></i> Excel
                </Button>
            </div>

            <div ref={componentRef} className="border p-4 bg-white rounded-md shadow-sm">
                <div className="text-center mb-4">
                    <h3 className="text-xl font-bold">Sports Report - {type}</h3>
                </div>

                {type === 'Record' && (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">Category</th>
                                <th className="border border-gray-300 p-2">Events</th>
                                <th className="border border-gray-300 p-2">Timings</th>
                                <th className="border border-gray-300 p-2">Year</th>
                                <th className="border border-gray-300 p-2">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((group, groupIdx) => (
                                <片 key={groupIdx}>
                                    <tr className="bg-gray-50">
                                        <th colSpan={5} className="border border-gray-300 p-2 text-left">
                                            {group.SPCCMCC_CompitionCategory}
                                        </th>
                                    </tr>
                                    {group.RecordDetails.map((record, recIdx) => (
                                        <tr key={recIdx}>
                                            <td className="border border-gray-300 p-2 text-center">{recIdx + 1}</td>
                                            <td className="border border-gray-300 p-2">{record.SPCCMSCCG_SportsCCGroupName}</td>
                                            <td className="border border-gray-300 p-2">
                                                {record.SPCCESTR_Value} {record.SPCCMUOM_UOMName}
                                            </td>
                                            <td className="border border-gray-300 p-2">{record.ASMAY_Year || '2023'}</td>
                                            <td className="border border-gray-300 p-2">{record.AMST_FirstName}</td>
                                        </tr>
                                    ))}
                                </片>
                            ))}
                        </tbody>
                    </table>
                )}

                {(type === 'Start' || type === 'Finish') && (
                    <div className="space-y-6">
                        {data.map((group, groupIdx) => (
                            <div key={groupIdx} className="border p-2 mb-4 page-break-inside-avoid">
                                <h4 className="font-bold text-center border-b pb-2 mb-2">
                                    {group.SPCCMCC_CompitionCategory} : {group.SPCCMSCCG_SportsCCGroupName}
                                </h4>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th rowSpan={2} className="border border-gray-300 p-2">Lane No</th>
                                            <th rowSpan={2} className="border border-gray-300 p-2">Roll/Name</th>
                                            <th colSpan={3} className="border border-gray-300 p-2">Attempts</th>
                                        </tr>
                                        <tr>
                                            <th className="border border-gray-300 p-2">I</th>
                                            <th className="border border-gray-300 p-2">II</th>
                                            <th className="border border-gray-300 p-2">III</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.RecordDetails.map((record, recIdx) => (
                                            <tr key={recIdx}>
                                                <td className="border border-gray-300 p-2 text-center">{recIdx + 1}</td>
                                                <td className="border border-gray-300 p-2">
                                                    {record.AMAY_RollNo} : {record.AMST_FirstName}
                                                </td>
                                                <td className="border border-gray-300 p-2">{record['I']}</td>
                                                <td className="border border-gray-300 p-2">{record['II']}</td>
                                                <td className="border border-gray-300 p-2">{record['III']}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {type === 'Finish' && (
                                    <div className="mt-4">
                                        <h5 className="font-bold">RESULTS:</h5>
                                        {group.RecordDetails.filter(r => r.SPCCESTR_Rank).map((r, i) => (
                                            <div key={i}>
                                                {r.SPCCESTR_Rank === '1' && <span>I PLACE: {r.AMST_FirstName}</span>}
                                                {r.SPCCESTR_Rank === '2' && <span>II PLACE: {r.AMST_FirstName}</span>}
                                                {r.SPCCESTR_Rank === '3' && <span>III PLACE: {r.AMST_FirstName}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {(type === 'Consolidated' || type === 'Indoor' || type === 'Outdoor' || type === 'Team' || type === 'Externals' || type === 'Selection') && (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">Place</th>
                                <th className="border border-gray-300 p-2">Adm No / Name</th>
                                <th className="border border-gray-300 p-2">Class / Sec</th>
                                {type === 'Consolidated' && <th className="border border-gray-300 p-2">Time/Distance</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((group, groupIdx) => (
                                <片 key={groupIdx}>
                                    <tr className="bg-gray-50">
                                        <th colSpan={type === 'Consolidated' ? 4 : 3} className="border border-gray-300 p-2 text-left">
                                            {group.SPCCMSCCG_SportsCCGroupName}
                                        </th>
                                    </tr>
                                    {group.RecordDetails.map((record, recIdx) => (
                                        <tr key={recIdx}>
                                            <td className="border border-gray-300 p-2 text-center">
                                                {type === 'Selection' ? recIdx + 1 : (record.SPCCESTR_Rank ? `${record.SPCCESTR_Rank}` : '')}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {record.AMST_AdmNo} : {record.AMST_FirstName}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {record.ASMCL_ClassName} {record.ASMC_SectionName}
                                            </td>
                                            {type === 'Consolidated' && (
                                                <td className="border border-gray-300 p-2">
                                                    {record.SPCCESTR_Value} {record.SPCCMUOM_UOMName}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </片>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    );
};
// Helper fragment replacement for map keys since React.Fragment is not imported
const 片 = ({ children }: { children: React.ReactNode }) => <>{children}</>;
