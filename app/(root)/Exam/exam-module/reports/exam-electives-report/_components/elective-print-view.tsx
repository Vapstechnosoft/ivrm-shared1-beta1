// app/exam/electives-report/_components/elective-print-view.tsx
'use client';

import Image from 'next/image';
import type { ElectiveGroup, StudentRow } from '@/types/exam/exam-module/report';
import { getMasterInstitution } from '@/server/exam/exam-module/reports/vvehpc_exam-report-card';
import { useEffect, useState } from 'react';

interface ElectiveReportPrintViewProps {
    students: StudentRow[];
    groupList: ElectiveGroup[];
    showMobile?: boolean;
    showEmail?: boolean;
}

export default function ElectiveReportPrintView({
    students,
    groupList,
    showMobile = false,
    showEmail = false,
}: ElectiveReportPrintViewProps) {
    const [institute, setInstitute] = useState<{ name: string; logo: string }>({
        name: 'Vidya Vikasa Vidya Samsthe (R)',
        logo: '',
    });
    const [loading, setLoading] = useState(true);

    // Fetch institute details
    useEffect(() => {
        async function fetchInstitute() {
            try {
                const res = await getMasterInstitution();
                if (res?.success && res.data) {
                    setInstitute({
                        name: res.data.mI_Name || 'Institution',
                        logo: res.data.mI_Logo || '',
                    });
                    console.info('Institute details for print', res.data);
                    console.info('Institute logo for print', res.data.mI_Logo);
                    console.info('Institute name for print', res.data.mI_Name);
                    console.info(institute);
                }
            } catch (err) {
                console.error('Failed to load institute details for print', err);
            } finally {
                setLoading(false);
            }
        }
        fetchInstitute();
    }, []);

    // Show subjects properly — including dummy/empty ones
    const getSubjectsForGroup = (student: StudentRow, groupName: string): string => {
        const match = student.sub_list.find((s) => s.emG_GroupName === groupName);

        // If no subject selected → show dash (this allows "dummy" or empty elective)
        if (!match || !match.ismS_SubjectName || match.ismS_SubjectName === '@#$%^&' || match.ismS_SubjectName.trim() === '') {
            return '-';
        }

        return match.ismS_SubjectName;
    };

    if (loading) return null;

    return (
        <>
            <style jsx global>{`
                @media print {
                    @page { size: A4 portrait; margin: 1cm; }
                    body * { visibility: hidden; }
                    #elective-printable, #elective-printable * { visibility: visible; }
                    #elective-printable { position: absolute; left: 0; top: 0; width: 100%; }

                    table { width: 100% !important; border-collapse: collapse !important; font-size: 11px !important; }
                    th, td { border: 0.5px solid #333 !important; padding: 6px 4px !important; text-align: center !important; vertical-align: middle !important; }
                    th { background-color: #f0f0f0 !important; font-weight: bold !important; font-size: 11.5px !important; }
                    .text-left { text-align: left !important; }
                    .no-data { color: #999; font-style: italic; }
                }
                @media screen { #elective-printable { display: none !important; } }
            `}</style>

            <div id="elective-printable">
                <div className="p-6">
                    {/* WIDE LOGO + SCHOOL NAME */}
                    <div className="text-center mb-8 border-b-2 border-gray-400 pb-6">
                        {institute.logo ? (
                            <div className="flex justify-center mb-6">
                                <Image
                                    src={institute.logo}
                                    alt="Institution Logo"
                                    width={1000}
                                    height={250}
                                    className="object-contain max-w-full h-auto"
                                    unoptimized
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="h-32" />
                        )}

                        <h3 className="text-3xl font-bold leading-tight">
                            {institute.name}
                        </h3>
                        <h4 className="text-xl font-semibold mt-3">
                            ELECTIVE SUBJECTS REPORT
                        </h4>
                    </div>

                    {/* TABLE */}
                    <table className="table-bordered">
                        <thead>
                            <tr>
                                <th rowSpan={2}>Sl.No</th>
                                <th rowSpan={2} style={{ minWidth: '180px' }}>Student Name</th>
                                {showMobile && <th rowSpan={2}>Mobile No</th>}
                                {showEmail && <th rowSpan={2}>Email ID</th>}
                                <th rowSpan={2}>Class</th>
                                <th rowSpan={2}>Section</th>
                                {groupList.map((group) => (
                                    <th key={group.emG_Id} style={{ minWidth: '160px' }}>
                                        {group.emG_GroupName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6 + (showMobile ? 1 : 0) + (showEmail ? 1 : 0) + groupList.length}
                                        className="py-16 text-center text-gray-500 text-lg"
                                    >
                                        No students found
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, index) => (
                                    <tr key={student.amsT_Id}>
                                        <td>{index + 1}</td>
                                        <td className="text-left font-medium" style={{ paddingLeft: '10px' }}>
                                            {student.amsT_FirstName}
                                        </td>
                                        {showMobile && <td>{student.amsT_MobileNo || '-'}</td>}
                                        {showEmail && <td style={{ fontSize: '10px' }}>{student.amsT_emailId || '-'}</td>}
                                        <td>{student.asmcL_ClassName}</td>
                                        <td>{student.asmC_SectionName}</td>
                                        {groupList.map((group) => {
                                            const subjects = getSubjectsForGroup(student, group.emG_GroupName);
                                            return (
                                                <td key={group.emG_Id}>
                                                    {subjects}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}