// _components/cumulative-report-printable.tsx
import type { ICumulativeReport, Institution, IMasterInstitution, IReportHeader, ISubject } from '@/types/exam/exam-module/report';

interface CumulativeReportPrintViewProps {
    reportData: ICumulativeReport[];
    institution: Institution | IMasterInstitution,
    subjects: ISubject[];
    headerInfo: Partial<IReportHeader>;
    fontSize: 'small' | 'medium' | 'large';
    columnFlags: {
        admno: boolean;
        regno: boolean;
        rollno: boolean;
        classrank: boolean;
        sectionrank: boolean;
        attendancedispaly: boolean;
    };
}

const fontSizeMap = {
    small: '10px',
    medium: '11px',
    large: '12px'
};

export default function CumulativeReportPrintView({
    reportData,
    institution,
    subjects,
    headerInfo,
    fontSize,
    columnFlags
}: CumulativeReportPrintViewProps) {
    const fontSizeValue = fontSizeMap[fontSize];

    // Separate applicable and non-applicable subjects
    const applicableSubjects = subjects.filter((s) => s.eyceS_AplResultFlg);
    const nonApplicableSubjects = subjects.filter((s) => !s.eyceS_AplResultFlg);

    return (
        <>
            {/* PRINT STYLES - NO BOLD ANYWHERE */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 1cm;
                    }

                    body * {
                        visibility: hidden !important;
                    }
                    #printable-report, #printable-report * {
                        visibility: visible !important;
                    }
                    #printable-report {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }

                    .screen-only, .no-print {
                        display: none !important;
                    }

                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        font-size: ${fontSizeValue} !important;
                    }

                    .table-bordered {
                        border: 0.5px solid #000 !important;
                    }

                    .table-bordered > thead > tr > th,
                    .table-bordered > tbody > tr > td {
                        border: 0.5px solid #000 !important;
                        padding: 4px !important;
                        text-align: center !important;
                        vertical-align: middle !important;
                        font-weight: normal !important; /* ← No bold */
                    }

                    .table-bordered > thead > tr > th {
                        background: #fff !important;
                        color: #000 !important;
                        font-size: 12px !important;
                        font-weight: normal !important;
                    }

                    .text-center { text-align: center !important; }
                    .text-left { text-align: left !important; }
                    .text-uppercase { text-transform: uppercase !important; }

                    h3, h5 {
                        margin: 2px 0 !important;
                    }

                    .student-name {
                        text-align: left !important;
                        padding-left: 8px !important;
                    }

                    .evs-cell {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        padding: 2px 4px;
                    }

                    b, strong { 
                        font-weight: normal !important; 
                    }

                    a { color: #000 !important; text-decoration: none !important; }
                }

                @media screen {
                    #printable-report {
                        display: none !important;
                    }
                }
            `}</style>

            {/* PRINTABLE CONTENT */}
            <div id='printable-report' className='col-sm-12'>
                <div id='Baldwin' className='CumulativeReport'>
                    {/* HEADER */}
                    <table style={{ width: '100%', marginBottom: '10px' }}>
                        <tbody>
                            <tr>
                                <td colSpan={applicableSubjects.length * 2 + 10} className='text-center'>
                                    <h3 style={{ margin: '2px 0', fontSize: '18px' }}>
                                        {institution.mI_Name || 'Vidya Vikasa Vidya Samsthe (R)'}
                                    </h3>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={applicableSubjects.length * 2 + 10} className='text-center'>
                                    <h5 style={{ margin: '2px 0', fontSize: '15px' }}>CLASS WISE CUMULATIVE REPORT</h5>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    colSpan={applicableSubjects.length * 2 + 10}
                                    className='text-center text-uppercase'
                                    style={{ fontSize: fontSizeValue }}>
                                    <span>
                                        <strong className='font-bold'>ACADEMIC YEAR :</strong> {headerInfo.yr}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    colSpan={applicableSubjects.length * 2 + 10}
                                    className='text-center text-uppercase'
                                    style={{ fontSize: fontSizeValue }}>
                                    <span>
                                        <strong className='font-bold'>CLASS & SEC :</strong> {headerInfo.cla} - {headerInfo.sec}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    colSpan={applicableSubjects.length * 2 + 10}
                                    className='text-center text-uppercase'
                                    style={{ fontSize: fontSizeValue }}>
                                    <span>
                                        <strong className='font-bold'>Exam :</strong> {headerInfo.exmmid}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* MAIN TABLE */}
                    <table className='table-bordered table-condensed table' style={{ fontSize: fontSizeValue }} border={1}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                {columnFlags.admno && <th>Adm No</th>}
                                {columnFlags.regno && <th>Reg No</th>}
                                {columnFlags.rollno && <th>Roll No</th>}

                                {applicableSubjects.map((subj) => (
                                    <th key={subj.ismS_Id} colSpan={2}>
                                        {subj.ismS_SubjectName}
                                    </th>
                                ))}

                                {applicableSubjects.length > 0 && (
                                    <>
                                        <th>Total</th>
                                        <th>Obtained</th>
                                        <th style={{ width: '5%' }}>%</th>
                                        <th>Grade</th>
                                    </>
                                )}

                                {nonApplicableSubjects.map((subj) => (
                                    <th key={subj.ismS_Id} colSpan={2}>
                                        {subj.ismS_SubjectName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((student, index) => {
                                const isAbsent = student.estmP_Result === 'AB';

                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='student-name text-left'>{student.amsT_FirstName}</td>

                                        {columnFlags.admno && <td>{student.amsT_AdmNo ?? '-'}</td>}
                                        {columnFlags.regno && <td>{student.amsT_RegistrationNo ?? '-'}</td>}
                                        {columnFlags.rollno && <td>{student.amaY_RollNo ?? '-'}</td>}

                                        {/* Applicable Subjects (EVS = Marks + Grade side by side) */}
                                        {applicableSubjects.map((subj) => {
                                            const mark = student.sub_list?.find((m) => m.ismS_Id === subj.ismS_Id);
                                            const isAB = mark?.estmpS_PassFailFlg === 'AB';
                                            const showBoth = mark?.estmpS_ObtainedMarks != null && mark?.estmpS_ObtainedGrade;

                                            return (
                                                <td key={subj.ismS_Id} colSpan={2} style={{ padding: '2px' }}>
                                                    {isAB ? (
                                                        'AB'
                                                    ) : showBoth ? (
                                                        <div className='evs-cell'>
                                                            <span>{mark.estmpS_ObtainedMarks}</span>
                                                            <span>{mark.estmpS_ObtainedGrade}</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {mark?.estmpS_ObtainedMarks ?? '-'}
                                                            {mark?.estmpS_ObtainedGrade &&
                                                                !mark?.estmpS_ObtainedMarks &&
                                                                ` ${mark.estmpS_ObtainedGrade}`}
                                                        </>
                                                    )}
                                                </td>
                                            );
                                        })}

                                        {/* Total Columns - NO BOLD */}
                                        {applicableSubjects.length > 0 && (
                                            <>
                                                <td>{isAbsent ? '' : (student.estmP_TotalMaxMarks ?? '-')}</td>
                                                <td>{isAbsent ? '' : (student.estmP_TotalObtMarks ?? '-')}</td>
                                                <td>{isAbsent ? '' : `${Number(student.estmP_Percentage ?? 0).toFixed(1)}%`}</td>
                                                <td>{isAbsent ? '' : (student.estmP_TotalGrade ?? '-')}</td>
                                            </>
                                        )}

                                        {/* Non-applicable subjects */}
                                        {nonApplicableSubjects.map((subj) => {
                                            const mark = student.sub_list?.find((m) => m.ismS_Id === subj.ismS_Id);
                                            const isAB = mark?.estmpS_PassFailFlg === 'AB';

                                            return (
                                                <td key={subj.ismS_Id} colSpan={2}>
                                                    {isAB ? (
                                                        'AB'
                                                    ) : (
                                                        <>
                                                            {mark?.estmpS_ObtainedMarks ?? ''}
                                                            {mark?.estmpS_ObtainedGrade ?? ''}
                                                        </>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
