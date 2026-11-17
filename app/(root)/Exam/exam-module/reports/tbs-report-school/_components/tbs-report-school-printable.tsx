'use client';

import React from 'react';

export default function TBSReportSchoolPrintable({ reportData }: { reportData: any }) {
    if (!reportData || !reportData.getstudentdetails) return null;

    const {
        getstudentdetails,
        getstudentmarksdetails,
        getstudentwisesubjectlist,
        getgroupexamdetails,
        examwiseremarks,
        getstudentwisetermwisedetails,
        getstudentwiseattendancedetails,
        getpromotionremarksdetails
    } = reportData;

    // Helper to get marks/grade for a specific student, subject, and exam group
    const getStudentMark = (amstId: number, ismsId: number, emeId: number, displayName: string) => {
        return getstudentmarksdetails.find(
            (m: any) => m.AMST_Id === amstId && m.ISMS_Id === ismsId && m.EME_Id === emeId && m.EMPSG_DisplayName === displayName
        );
    };

    return (
        <div id='TBSReportSchool' className="space-y-8 bg-white p-4 font-['Poppins',_sans-serif] text-black">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for injecting print styles */}
            <style
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    .page-break { page-break-after: always; }
                    thead { display: table-header-group; color: black !important; background: white !important; }
                    .table-bordered th, .table-bordered td { border: 1px solid black !important; }
                    * { -webkit-print-color-adjust: exact !important; }
                }
                .report-table th, .report-table td { border: 1px solid black; padding: 4px; text-align: center; }
                .report-table th { background: #f0f0f0; }
                .text-left { text-align: left; }
                .text-center { text-align: center; }
            `
                }}
            />

            {getstudentdetails.map((report: any, index: number) => {
                const termDetails = getstudentwisetermwisedetails.find((p: any) => p.AMST_Id === report.AMST_Id);
                const attendance = getstudentwiseattendancedetails.find((a: any) => a.AMST_Id === report.AMST_Id);
                const promotion = getpromotionremarksdetails?.find((d: any) => d.amsT_Id === report.AMST_Id);

                return (
                    <div key={report.AMST_Id} className={`${index > 0 ? 'page-break mt-10' : ''} border-2 border-black p-4`}>
                        {/* Header Box */}
                        <div className='mb-4 border border-black'>
                            <table className='w-full font-bold text-sm'>
                                <tbody>
                                    <tr>
                                        <td className='border border-black bg-transparent p-2'>TUNBRIDGE HIGH SCHOOL Report Card</td>
                                        <td className='border border-black p-2'>{report.studentname}</td>
                                        <td className='border border-black p-2'>
                                            {report.classname} &nbsp; {report.sectionname}
                                        </td>
                                        <td className='border border-black p-2'>Adm &nbsp; {report.admno}</td>
                                        <td className='border border-black p-2'>AY &nbsp; {report.asmaY_Year}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className='flex gap-4'>
                            {/* main table section */}
                            <div className='w-3/4'>
                                <table className='report-table w-full border-collapse text-xs'>
                                    <thead>
                                        <tr>
                                            <th rowSpan={2} style={{ width: '30px' }}>
                                                No
                                            </th>
                                            <th colSpan={4} rowSpan={2}>
                                                Subject Name
                                            </th>
                                            {getgroupexamdetails.map((grpexam: any) => (
                                                <th key={grpexam.emE_Id} colSpan={3} className='break-words' style={{ width: '120px' }}>
                                                    <b>{grpexam.emE_ExamName}</b>
                                                </th>
                                            ))}
                                            <th rowSpan={2} className='break-words' style={{ width: '100px' }}>
                                                Yearly Aggregate
                                            </th>
                                        </tr>
                                        <tr>
                                            {getgroupexamdetails.map((grpexam: any) => (
                                                <React.Fragment key={`${grpexam.emE_Id}-sub`}>
                                                    <th colSpan={1}>{grpexam.empsgE_ForMaxMarkrs}</th>
                                                    <th colSpan={1}>Grade</th>
                                                    <th colSpan={1}>Result</th>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getstudentwisesubjectlist
                                            .filter((s: any) => s.AMST_Id === report.AMST_Id)
                                            .map((subj: any, sIndex: number) => (
                                                <tr key={subj.ISMS_Id}>
                                                    <td>{sIndex + 1}</td>
                                                    <td colSpan={subj.rowspan || 4} className='text-left font-medium'>
                                                        {subj.ISMS_SubjectName}
                                                    </td>

                                                    {getgroupexamdetails.map((grpexam: any) => {
                                                        const mark = getstudentmarksdetails.find(
                                                            (m: any) =>
                                                                m.AMST_Id === report.AMST_Id &&
                                                                m.ISMS_Id === subj.ISMS_Id &&
                                                                m.EME_Id === grpexam.emE_Id
                                                        );
                                                        return (
                                                            <React.Fragment key={`${subj.ISMS_Id}-${grpexam.emE_Id}`}>
                                                                <td>{mark?.EYCES_MarksDisplayFlg ? mark.ObtainedMarks : '-'}</td>
                                                                <td>{mark?.grade || '-'}</td>
                                                                <td>{mark?.PassFailFlag || '-'}</td>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                    <td>
                                                        {subj.EYCES_GradeDisplayFlg
                                                            ? subj.ESTMPP_ObtGrade
                                                            : subj.subject_wise_total_per
                                                              ? `${subj.subject_wise_total_per}%`
                                                              : '-'}
                                                    </td>
                                                </tr>
                                            ))}

                                        {/* Totals Row */}
                                        <tr className='bg-muted/10 font-bold'>
                                            <td colSpan={5}>TOTAL MARKS</td>
                                            {getgroupexamdetails.map((grpexam: any) => {
                                                const totalMark = reportData.getstudent_examwisemarks?.find(
                                                    (m: any) => m.AMST_Id === report.AMST_Id && m.EME_Id === grpexam.emE_Id
                                                );
                                                return (
                                                    <td key={`total-${grpexam.emE_Id}`} colSpan={3}>
                                                        {totalMark ? `${totalMark.ObtainedMarks} / ${totalMark.TotalMarks}` : '-'}
                                                    </td>
                                                );
                                            })}
                                            <td>
                                                {' '}
                                                {termDetails
                                                    ? `${termDetails.ESTMPP_TotalObtMarks} / ${termDetails.ESTMPP_TotalMaxMarks}`
                                                    : '-'}{' '}
                                            </td>
                                        </tr>

                                        {/* Percentage Row */}
                                        <tr className='font-bold'>
                                            <td colSpan={5}>Percentage</td>
                                            {getgroupexamdetails.map((grpexam: any) => {
                                                const totalMark = reportData.getstudent_examwisemarks?.find(
                                                    (m: any) => m.AMST_Id === report.AMST_Id && m.EME_Id === grpexam.emE_Id
                                                );
                                                return (
                                                    <td key={`perc-${grpexam.emE_Id}`} colSpan={3}>
                                                        {totalMark ? `${totalMark.TotalPercentage}%` : '-'}
                                                    </td>
                                                );
                                            })}
                                            <td> {termDetails?.ESTMPP_Percentage || '-'}% </td>
                                        </tr>

                                        {/* Attendance Row */}
                                        <tr className='font-bold'>
                                            <td colSpan={5}>Attendance %</td>
                                            {getgroupexamdetails.map((grpexam: any) => {
                                                const att = getstudentwiseattendancedetails.find(
                                                    (a: any) => a.AMST_Id === report.AMST_Id && a.EME_Id === grpexam.emE_Id
                                                );
                                                return (
                                                    <td key={`att-${grpexam.emE_Id}`} colSpan={3}>
                                                        {att?.TOTALAttendancePercentage || '-'}%
                                                    </td>
                                                );
                                            })}
                                            <td rowSpan={2}>{report.TOTALAttendancePercentage || '-'}%</td>
                                        </tr>
                                        <tr className='font-bold'>
                                            <td colSpan={5}>Cumulative Attendance/Days</td>
                                            {getgroupexamdetails.map((grpexam: any) => {
                                                const att = getstudentwiseattendancedetails.find(
                                                    (a: any) => a.AMST_Id === report.AMST_Id && a.EME_Id === grpexam.emE_Id
                                                );
                                                return (
                                                    <td key={`attdays-${grpexam.emE_Id}`} colSpan={3}>
                                                        {att ? `${att.TOTALPRESENTDAYS} / ${att.TOTALWORKINGDAYS}` : '-'}
                                                    </td>
                                                );
                                            })}
                                        </tr>

                                        {/* Siganture Rows */}
                                        {['Teacher', 'Principal', 'Parent'].map((role) => (
                                            <tr key={role} className='h-10'>
                                                <td colSpan={5} className='text-left font-bold'>
                                                    {role}'s Signature & Date
                                                </td>
                                                {getgroupexamdetails.map((grpexam: any) => (
                                                    <td key={`${role}-${grpexam.emE_Id}`} colSpan={3} />
                                                ))}
                                                <td />
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Sidebar section */}
                            <div className='w-1/4'>
                                <table className='report-table w-full border-collapse text-xs'>
                                    <thead>
                                        <tr>
                                            <th className='h-20'>Teacher's Comments/Rank</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {examwiseremarks
                                            .filter((r: any) => r.AMST_Id === report.AMST_Id)
                                            .map((rem: any) => (
                                                <tr key={rem.EME_Id}>
                                                    <td className='h-32 p-2 text-left align-top'>
                                                        <div className='mb-1 border-b pb-1 font-bold'>
                                                            {rem.EME_ExamName} &emsp; RANK: {rem.ESTMP_ClassRank}
                                                        </div>
                                                        <div>{rem.EMER_Remarks}</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        {promotion && (
                                            <>
                                                <tr>
                                                    <td className='p-2 text-left'>
                                                        <div className='font-bold'>FINAL REMARKS & RESULT</div>
                                                        <div className='mt-1'>{promotion.eprD_ClassPromoted}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='p-2 text-left font-bold'>OVERALL RANK: {promotion.eprD_Remarks}</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
