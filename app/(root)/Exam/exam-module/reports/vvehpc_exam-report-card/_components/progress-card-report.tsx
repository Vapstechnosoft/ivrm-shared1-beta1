'use client';

import { Button } from '@/components/ui/button';
import type { IExamReportCard, IMasterInstitution, Institution, ISubject } from '@/types/exam/exam-module/report';
import { Printer } from 'lucide-react';
import Image from 'next/image';

interface Props {
    reportData: IExamReportCard[];
    subjects: ISubject[];
    headerInfo: {
        mI_name?: string;
        yr?: string;
        cla?: string;
        sec?: string;
        exmmid?: string;
    };
    examName: string;
    examCode: string;
    year: string;
    institution: Institution | IMasterInstitution | null | undefined;
    onPrint?: () => void;
}

export default function ProgressCardReport({ reportData, institution, subjects, headerInfo, examName, examCode, year, onPrint }: Props) {
    // Filter only subjects that appear in results
    const resultSubjects = subjects
        .filter((s) => s.eyceS_AplResultFlg !== false)
        .sort((a, b) => (a.eyceS_SubjectOrder ?? 999) - (b.eyceS_SubjectOrder ?? 999));

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-GB'); // dd-MM-yyyy
        } catch {
            return 'N/A';
        }
    };

    return (
        <>
            {/* Print-only CSS */}
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #progress-card-print-area,
          #progress-card-print-area * {
            visibility: visible !important;
          }
          #progress-card-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .page-break-before {
            page-break-before: always !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 12px !important;
          }
          th,
          td {
            border: 1px solid black !important;
            padding: 6px 4px !important;
            text-align: center !important;
          }
          th {
            background-color: #c6dff7 !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>

            {/* Screen: Show Print Button */}
            <div className='no-print my-6 flex justify-end'>
                <Button onClick={onPrint} className='flex items-center gap-2'>
                    <Printer className='h-4 w-4' />
                    Print All Progress Cards
                </Button>
            </div>

            {/* Printable Area */}
            <div id='progress-card-print-area' className='space-y-0'>
                {reportData.map((report, index) => (
                    <div
                        key={report.amsT_FirstName + index}
                        className={`bg-white ${index > 0 ? 'page-break-before' : ''}`}
                        style={{ border: '0.1px solid black', margin: '15mm', padding: '10mm' }}>
                        {/* School Header Image */}
                        <div className='mb-4 text-center'>
                            <Image
                                src={institution?.mI_Logo || 'https://kusumadata.blob.core.windows.net/files/30/Vidya%20Vikas%20Marks.jpg'}
                                alt={institution?.mI_Name || 'School Header'}
                                width={800}
                                height={200}
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
                                        <td className='w-1/4 py-1 font-bold'>Name of the Student</td>
                                        <td className='py-1'>
                                            : <strong>{report.amsT_FirstName}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 font-bold'>Father Name</td>
                                        <td className='py-1'>
                                            : <strong>{report.amsT_FatherName || 'N/A'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 font-bold'>Grade</td>
                                        <td className='py-1'>
                                            :{' '}
                                            <strong>
                                                {headerInfo.cla} {headerInfo.sec}
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 font-bold'>Roll No</td>
                                        <td className='py-1'>
                                            : <strong>{report.amaY_RollNo ?? 'N/A'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 font-bold'>Date Of Birth</td>
                                        <td className='py-1'>
                                            : <strong>{formatDate(report.amsT_DOB)}</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Exam Title */}
                        <div className='my-6 text-center'>
                            <h3 className='font-bold text-xl leading-6'>
                                {examName} - {year} <br />
                                <br />
                                STATEMENT OF MARKS & GRADE
                            </h3>
                        </div>

                        {/* Marks Table */}
                        <table className='table-bordered w-full text-center text-sm'>
                            <thead>
                                <tr>
                                    <th colSpan={6} className='bg-[#c6dff7] text-left'>
                                        PART -1 : Academic Performance : Scholastic Areas
                                    </th>
                                </tr>
                                <tr>
                                    <th rowSpan={2}>SL No</th>
                                    <th colSpan={2} rowSpan={2}>
                                        Subjects
                                    </th>
                                    <th colSpan={3}>{examCode}</th>
                                </tr>
                                <tr>
                                    <th>Max Marks</th>
                                    <th>Obtained Marks</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultSubjects.map((subj, i) => {
                                    const mark = report.sub_list.find((m) => m.ismS_Id === subj.ismS_Id);
                                    const isAbsent = mark?.estmpS_PassFailFlg === 'AB';
                                    const showMarks = subj.eyceS_MarksDisplayFlg;
                                    const showGrade = subj.eyceS_GradeDisplayFlg;

                                    return (
                                        <tr key={subj.ismS_Id}>
                                            <td>{i + 1}</td>
                                            <td colSpan={2} className='pl-4 text-left'>
                                                {subj.ismS_SubjectName}
                                            </td>
                                            <td className='bg-[#c6dff7]'>{mark?.estmpS_MaxMarks ?? '-'}</td>
                                            <td className='bg-[#c6dff7]'>
                                                {isAbsent ? 'AB' : showMarks ? (mark?.estmpS_ObtainedMarks ?? '-') : '-'}
                                            </td>
                                            <td className='bg-[#c6dff7]'>
                                                {isAbsent ? 'AB' : showGrade ? (mark?.estmpS_ObtainedGrade ?? '-') : '-'}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {/* Total Rows */}
                                <tr>
                                    <th colSpan={4} className='bg-[#c6dff7] text-right'>
                                        TOTAL
                                    </th>
                                    <th colSpan={2} className='bg-[#c6dff7]'>
                                        {report.estmP_TotalMaxMarks ?? '-'}
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan={4} className='bg-[#c6dff7] text-right'>
                                        OBTAINED
                                    </th>
                                    <th colSpan={2} className='bg-[#c6dff7]'>
                                        {report.estmP_TotalObtMarks ?? '-'}
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan={4} className='bg-[#c6dff7] text-right'>
                                        PERCENTAGE
                                    </th>
                                    <th colSpan={2} className='bg-[#c6dff7]'>
                                        {report.estmP_Percentage != null ? `${report.estmP_Percentage} %` : '-'}
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan={4} className='bg-[#c6dff7] text-right'>
                                        OVERALL GRADE
                                    </th>
                                    <th colSpan={2} className='bg-[#c6dff7]'>
                                        {report.estmP_TotalGrade ?? '-'}
                                    </th>
                                </tr>
                                <tr>
                                    <td colSpan={6} className='h-20 pl-4 text-left align-top'>
                                        <strong>Remarks :</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Grading Scale */}
                        <div className='my-6 text-center font-bold text-sm'>
                            Grading: A+={' > '}=90% to 100%, A={' > '}=80% to 89%, B+={' > '}=70% to 79%, B={' > '}=60% to 69%, C={' > '}
                            =40% to 59%, D={' > '}=0% to 39%
                        </div>

                        {/* Signatures */}
                        <div className='mt-12 grid grid-cols-3 text-center text-sm'>
                            <div>
                                <div className='mx-auto h-16 w-32 border-black border-t' />
                                <p>Class Teacher Signature</p>
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
                                <p>Principal Signature</p>
                            </div>
                            <div>
                                <div className='mx-auto h-16 w-32 border-black border-t' />
                                <p>Parent Signature</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
