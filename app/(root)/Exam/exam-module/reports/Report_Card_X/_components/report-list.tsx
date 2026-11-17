'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface ReportListProps {
    data: any;
    params: any;
}

export const ReportList = ({ data, params }: ReportListProps) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const {
        studentdetails = [],
        getgroupdetails = [],
        groupwiseexamlist = [],
        stud_present_attendence = [],
        getexamwisetotaldetails = [],
        getskill = [],
        getallgrade = [],
        getpromotionremarksdetails = [],
        masterinstitution,
        institution
    } = data;

    const brand = institution || masterinstitution;

    return (
        <div className="space-y-6 printable-content">
            <div className="flex justify-end no-print">
                <Button onClick={handlePrint} className="flex items-center gap-2 w-fit">
                    <Printer className="w-4 h-4" /> Print Report
                </Button>
            </div>

            <div ref={printRef} className="print-area">
                {studentdetails.map((report: any) => (
                    <div key={report.AMST_Id} className="bg-white p-6 mb-8 border rounded-lg shadow-sm print:shadow-none print:border-none print:m-0 print:p-0 page-break-after-always">

                        {/* Header */}
                        {params.printLogo && (
                            <div className="flex items-center justify-between mb-6 border-b pb-4">
                                {brand?.mI_Logo && (
                                    <img src={brand.mI_Logo} alt={brand.mI_Name} className="h-auto w-full" />
                                )}
                                {/* <div className="text-center flex-1 mx-4">
                                    <h2 className="text-xl font-bold">{brand?.mI_Name || 'INSTITUTION NAME'}</h2>
                                    <p className="text-sm text-gray-600">{brand?.mI_Address1 || 'Address Line 1'}</p>
                                    <div className="uppercase mt-2">
                                        <h3 className="text-lg font-bold">
                                            {params.exmname} REPORT CARD {params.ASMAY_Year}
                                        </h3>
                                    </div>
                                </div> */}
                            </div>
                        )}

                        {/* Student Info */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs mb-6 border p-3 rounded bg-gray-50 print:bg-transparent">
                            <div><span className="font-bold">NAME:</span> {report.studentname?.toUpperCase()}</div>
                            <div><span className="font-bold">CLASS & SECTION:</span> {params.ASMCL_Id_Name}-{params.ASMS_Id_Name} {params.brngroup}</div>
                            <div><span className="font-bold">STU. ID:</span> {report.admno}</div>
                            <div><span className="font-bold">ATTENDANCE:</span> {stud_present_attendence?.find((a: any) => a.AMST_Id === report.AMST_Id)?.ATTENDANCEPERCENTAGE || 0}%</div>
                        </div>

                        {/* Marks Table */}
                        <div className="overflow-x-auto print:overflow-visible">
                            <table className="w-full border-collapse border border-gray-400 text-[9pt]">
                                <thead>
                                    <tr className="bg-gray-100 print:bg-gray-100">
                                        <th rowSpan={2} className="border border-gray-400 p-2 text-left w-1/4">SUBJECTS</th>
                                        {getgroupdetails.map((grp: any, idx: number) => (
                                            <th key={idx} colSpan={grp.groupewiseexam?.length || 1} className="border border-gray-400 p-1 text-center font-bold">
                                                {grp.empG_DistplayName}
                                            </th>
                                        ))}
                                        {params.superAverage && (
                                            <th colSpan={2} className="border border-gray-400 p-1 text-center font-bold bg-gray-200">SUPER AVERAGE</th>
                                        )}
                                    </tr>
                                    <tr className="bg-gray-50 print:bg-gray-50">
                                        {groupwiseexamlist.map((ex: any, idx: number) => (
                                            <th key={idx} className="border border-gray-400 p-1 text-center text-[7pt] font-medium min-w-[50px]">
                                                {ex.examnamedisplay} <br /> ({ex.EMPSGE_ForMaxMarkrs})
                                            </th>
                                        ))}
                                        {params.superAverage && (
                                            <>
                                                <th className="border border-gray-400 p-1 text-center font-bold text-[8pt]">100</th>
                                                <th className="border border-gray-400 p-1 text-center font-bold text-[8pt]">AVG</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Academic Subjects */}
                                    {report.studentsubjects?.filter((s: any) => s.EMPS_AppToResultFlg).map((subj: any) => (
                                        <tr key={subj.ISMS_Id} className="hover:bg-gray-50">
                                            <td className="border border-gray-400 p-2 font-medium">{subj.ISMS_SubjectName}</td>
                                            {groupwiseexamlist.map((ex: any, idx: number) => {
                                                const mark = report.studentmarks?.find((m: any) => m.ISMS_Id === subj.ISMS_Id && m.EME_Id === ex.EME_Id);
                                                return (
                                                    <td key={idx} className="border border-gray-400 p-1 text-center">
                                                        {mark?.ObtainedMarks ?? '-'}
                                                    </td>
                                                );
                                            })}
                                            {params.superAverage && (
                                                <>
                                                    <td className="border border-gray-400 p-1 text-center">{subj.ESTMPPSG_GroupObtMarks}</td>
                                                    <td className="border border-gray-400 p-1 text-center font-bold">{subj.ESTMPPSG_GroupAVGMarks}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}

                                    {/* Totals Row */}
                                    <tr className="bg-gray-100 font-bold print:bg-gray-100">
                                        <td className="border border-gray-400 p-2">GRAND TOTAL</td>
                                        {groupwiseexamlist.map((ex: any, idx: number) => {
                                            const total = report.student_marks?.find((m: any) => m.EME_Id === ex.EME_Id);
                                            return (
                                                <td key={idx} className="border border-gray-400 p-1 text-center">
                                                    {total?.ObtainedMarks ?? '-'}
                                                </td>
                                            );
                                        })}
                                        {params.superAverage && (
                                            <>
                                                <td className="border border-gray-400 p-1 text-center bg-gray-100">{getexamwisetotaldetails?.find((t: any) => t.AMST_Id === report.AMST_Id)?.ESTMPPSG_GroupObtMarks}</td>
                                                <td className="border border-gray-400 p-1 text-center bg-gray-200">{getexamwisetotaldetails?.find((t: any) => t.AMST_Id === report.AMST_Id)?.ESTMPPSG_GroupAVGMarks || '-'}</td>
                                            </>
                                        )}
                                    </tr>

                                    {/* Percentage Row */}
                                    <tr className="font-bold">
                                        <td className="border border-gray-400 p-2">PERCENTAGE</td>
                                        {groupwiseexamlist.map((ex: any, idx: number) => {
                                            const tot = report.student_marks?.find((m: any) => m.EME_Id === ex.EME_Id);
                                            return (
                                                <td key={idx} className="border border-gray-400 p-1 text-center">
                                                    {tot?.TotalPercentage ? tot.TotalPercentage + '%' : '-'}
                                                </td>
                                            );
                                        })}
                                        {params.superAverage && (
                                            <>
                                                <td className="border border-gray-400 p-1 text-center">{getexamwisetotaldetails?.find((t: any) => t.AMST_Id === report.AMST_Id)?.TotalPercentage}%</td>
                                                <td className="border border-gray-400 p-1 text-center">{getexamwisetotaldetails?.find((t: any) => t.AMST_Id === report.AMST_Id)?.totaver || '-'}%</td>
                                            </>
                                        )}
                                    </tr>

                                    {/* Rank Row */}
                                    <tr className="font-bold">
                                        <td className="border border-gray-400 p-2">SECTION RANK</td>
                                        {groupwiseexamlist.map((ex: any, idx: number) => {
                                            const tot = report.student_marks?.find((m: any) => m.EME_Id === ex.EME_Id);
                                            return (
                                                <td key={idx} className="border border-gray-400 p-1 text-center">
                                                    {tot?.ESTMPP_SectionRank ?? '-'}
                                                </td>
                                            );
                                        })}
                                        {params.superAverage && (
                                            <td colSpan={2} className='border border-gray-400 bg-gray-50 p-1 text-center'>.</td>
                                        )}
                                    </tr>

                                    {/* Graded / Non-Result Subjects */}
                                    {report.studentsubjects?.filter((s: any) => !s.EMPS_AppToResultFlg).map((subj: any) => (
                                        <tr key={subj.ISMS_Id}>
                                            <td className="border border-gray-400 p-2 font-medium bg-blue-50/20">{subj.ISMS_SubjectName}</td>
                                            {groupwiseexamlist.map((ex: any, idx: number) => {
                                                const mark = report.studentmarks?.find((m: any) => m.ISMS_Id === subj.ISMS_Id && m.EME_Id === ex.EME_Id);
                                                return (
                                                    <td key={idx} className="border border-gray-400 p-1 text-center italic">
                                                        {mark?.ObtainedGrade || mark?.ObtainedMarks || '-'}
                                                    </td>
                                                );
                                            })}
                                            {params.superAverage && (
                                                <>
                                                    <td className="border border-gray-400 p-1 text-center italic">{subj.ESTMPPSG_GroupObtMarks || '-'}</td>
                                                    <td className="border border-gray-400 p-1 text-center font-bold italic">{subj.ESTMPPSG_GroupObtGrade || '-'}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Section: Skills & Remarks */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
                            {/* Skills Table */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase border-b border-gray-300 pb-1">GRADED SUBJECTS</h4>
                                <table className="w-full border-collapse border border-gray-400 text-[8pt]">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-400 p-1 text-left">SKILL / ACTIVITY</th>
                                            <th className="border border-gray-400 p-1 text-center w-1/4">GRADE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getskill?.map((skill: any) => (
                                            <tr key={skill.ECACT_Id}>
                                                <td className="border border-gray-400 p-1.5">{skill.ECACT_SkillName}</td>
                                                <td className="border border-gray-400 p-1.5 text-center font-bold">
                                                    {getallgrade?.find((g: any) => g.AMST_Id === report.AMST_Id && g.ECACT_Id === skill.ECACT_Id)?.EMGD_Name || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        {getskill.length === 0 && (
                                            <tr><td colSpan={2} className="border border-gray-400 p-2 text-center text-gray-400">Not recorded</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Remarks & Signatures */}
                            <div className="flex flex-col h-full space-y-6 justify-between">
                                <div className="border border-gray-400 p-3 h-32 rounded bg-gray-50 print:bg-transparent flex flex-col">
                                    <strong className="text-[9pt] border-b pb-1 mb-2">CLASS TEACHER'S REMARKS:</strong>
                                    <p className="text-sm font-medium italic text-gray-700">
                                        "{getpromotionremarksdetails?.find((p: any) => p.AMST_Id === report.AMST_Id)?.remarks || 'Keep up the good work and focus on areas for improvement.'}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-[7pt] text-gray-800 text-center font-bold uppercase mt-12 pb-2">
                                    <div className="border-t border-gray-800 pt-2 transition-all">Principal</div>
                                    <div className="border-t border-gray-800 pt-2 transition-all">Class Teacher</div>
                                    <div className="border-t border-gray-800 pt-2 transition-all">Parent / Guardian</div>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            <style jsx global>{`
            @media print {
              .no-print {
                display: none !important;
              }
              body {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .print-area {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .page-break-after-always {
                page-break-after: always !important;
              }
              .container {
                  max-width: none !important;
                  width: 100% !important;
              }
            }
          `}</style>
        </div>
    );
};
