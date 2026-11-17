// _components/progress-card-printable.tsx

'use client';
import type { IExamReportCard, IMasterInstitution, Institution, ISubject } from '@/types/exam/exam-module/report';
import Image from 'next/image';

interface Props {
    reportData: IExamReportCard[];
    institution: Institution | IMasterInstitution | null | undefined;
    subjects: ISubject[];
    headerInfo: any;
    examName: string;
    examCode: string;
    year: string;
}

export default function ProgressCardPrintView({ reportData, institution, subjects, headerInfo, examName, examCode, year }: Props) {
    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-GB');
    };

    // Only subjects that should appear in the result
    const resultSubjects = subjects
        .filter((s) => s.eyceS_AplResultFlg !== false)
        .sort((a, b) => (a.eyceS_SubjectOrder ?? 999) - (b.eyceS_SubjectOrder ?? 999));

    return (
        <>
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 10mm 12mm !important;
                    }
                    body * { visibility: hidden; }
                    #print-area, #print-area * { visibility: visible; }
                    #print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .page-break { page-break-before: always; }
                    .page-break:first-child { page-break-before: avoid; }
                    .card { page-break-inside: avoid; }
                }
            `}</style>

            <div id='print-area' className='space-y-0'>
                {reportData.map((student, idx) => (
                    <div
                        key={student.amsT_Id}
                        className={`card mx-auto my-8 min-h-[297mm] border border-black bg-white p-10 ${idx > 0 ? 'page-break' : ''}`}
                        style={{ width: '210mm', boxSizing: 'border-box' }}>
                        {/* School Header */}
                        <div className='mb-4 text-center'>
                            <Image
                                src={institution?.mI_Logo || 'https://kusumadata.blob.core.windows.net/files/30/Vidya%20Vikas%20Marks.jpg'}
                                alt={institution?.mI_Name || 'School Logo'}
                                width={800}
                                height={180}
                                className='inline-block border border-black'
                                unoptimized
                            />
                        </div>

                        {/* Student Details */}
                        <div className='my-6 text-center'>
                            <div className='inline-block bg-[#c6dff7] px-16 py-2 font-bold text-xl'>STUDENT DETAILS</div>
                        </div>

                        <div className='border border-black p-4 text-sm'>
                            <table className='w-full'>
                                <tbody>
                                    <tr>
                                        <td className='w-1/4 font-bold'>Name of the Student</td>
                                        <td>
                                            : <strong>{student.amsT_FirstName}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold'>Father Name</td>
                                        <td>
                                            : <strong>{student.amsT_FatherName || 'N/A'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold'>Grade</td>
                                        <td>
                                            :{' '}
                                            <strong>
                                                {headerInfo.cla} {headerInfo.sec}
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold'>Roll No</td>
                                        <td>
                                            : <strong>{student.amaY_RollNo ?? 'N/A'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold'>Adm. No</td>
                                        <td>
                                            : <strong>{student.amsT_AdmNo ?? 'N/A'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold'>Date Of Birth</td>
                                        <td>
                                            : <strong>{formatDate(student.amsT_DOB)}</strong>
                                        </td>
                                    </tr>
                                    {student.classheld !== null && (
                                        <tr>
                                            <td className='font-bold'>Attendance</td>
                                            <td>
                                                :{' '}
                                                <strong>
                                                    {student.classatt} / {student.classheld}
                                                </strong>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Marks Table */}
                        <div className='my-6 text-center'>
                            <h3 className='font-bold text-xl'>
                                {examName} - {year}
                                <br />
                                STATEMENT OF MARKS & GRADE
                            </h3>
                        </div>

                        <table className='w-full border-collapse text-center text-sm'>
                            <thead>
                                <tr className='bg-[#c6dff7]'>
                                    <th rowSpan={2}>Sl</th>
                                    <th colSpan={2} rowSpan={2}>
                                        Subjects
                                    </th>
                                    <th colSpan={3}>{examCode}</th>
                                </tr>
                                <tr className='bg-[#c6dff7]'>
                                    <th>Max</th>
                                    <th>Obt.</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultSubjects.map((sub, i) => {
                                    const mark = student.sub_list.find((m) => m.ismS_Id === sub.ismS_Id);
                                    const absent = mark?.estmpS_PassFailFlg === 'AB';
                                    const showMarks = sub.eyceS_MarksDisplayFlg;
                                    const showGrade = sub.eyceS_GradeDisplayFlg;

                                    return (
                                        <tr key={sub.ismS_Id}>
                                            <td>{i + 1}</td>
                                            <td colSpan={2} className='pl-4 text-left'>
                                                {sub.ismS_SubjectName}
                                            </td>
                                            <td>{mark?.estmpS_MaxMarks ?? '-'}</td>
                                            <td>{absent ? 'AB' : showMarks ? (mark?.estmpS_ObtainedMarks ?? '-') : '-'}</td>
                                            <td>{absent ? 'AB' : showGrade ? (mark?.estmpS_ObtainedGrade ?? '-') : '-'}</td>
                                        </tr>
                                    );
                                })}

                                {/* Totals */}
                                <tr className='bg-[#c6dff7] font-bold'>
                                    <td colSpan={3} className='pr-4 text-right'>
                                        TOTAL
                                    </td>
                                    <td>{student.estmP_TotalMaxMarks ?? '-'}</td>
                                    <td colSpan={2}>{student.estmP_TotalObtMarks ?? '-'}</td>
                                </tr>
                                <tr className='bg-[#c6dff7] font-bold'>
                                    <td colSpan={3} className='pr-4 text-right'>
                                        PERCENTAGE
                                    </td>
                                    <td colSpan={3}>{student.estmP_Percentage != null ? `${student.estmP_Percentage}%` : '-'}</td>
                                </tr>
                                <tr className='bg-[#c6dff7] font-bold'>
                                    <td colSpan={3} className='pr-4 text-right'>
                                        OVERALL GRADE
                                    </td>
                                    <td colSpan={3}>{student.estmP_TotalGrade ?? '-'}</td>
                                </tr>
                                <tr className='bg-[#c6dff7] font-bold'>
                                    <td colSpan={3} className='pr-4 text-right'>
                                        RESULT
                                    </td>
                                    <td colSpan={3}>{student.estmP_Result ?? '-'}</td>
                                </tr>
                                {student.estmP_TotalGradeRemark && (
                                    <tr>
                                        <td colSpan={6} className='pt-4 text-left'>
                                            <strong>Remarks : </strong>
                                            {student.estmP_TotalGradeRemark}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className='my-6 text-center font-bold text-sm'>
                            Grading Scale: A+ = 90–100%, A = 80–89%, B+ = 70–79%, B = 60–69%, C = 40–59%, D = 0–39%
                        </div>

                        {/* Signatures */}
                        <div className='mt-12 grid grid-cols-3 text-center text-sm'>
                            <div>
                                <div className='mx-auto h-5 w-32 border-black border-t' />
                                <p>Class Teacher</p>
                            </div>
                            <div>
                                <Image
                                    src='https://dcampusstrg.blob.core.windows.net/files/17/NAACDocumentsUpload/5176b5e3-d100-4fb0-92fc-2fcc2b902ae2.jpg'
                                    alt='Principal'
                                    width={120}
                                    height={80}
                                    className='-mt-12 mx-auto'
                                    unoptimized
                                />
                                <p>Principal</p>
                            </div>
                            <div>
                                <div className='mx-auto h-5 w-32 border-black border-t' />
                                <p>Parent</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
