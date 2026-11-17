'use client';

import type { ICredentialStudent } from '@/types/alumni/student-password-creation';

interface StudentCredentialsReportProps {
    students: ICredentialStudent[];
}

export default function StudentCredentialsReport({ students }: StudentCredentialsReportProps) {
    if (students.length === 0) return null;

    return (
        <div className='print-only print-root p-4'>
            <div className='mb-4 text-center'>
                <h1 className='font-bold text-xl uppercase'>Student Credentials Report</h1>
                <p className='text-[10px] text-muted-foreground'>Generated on {new Date().toLocaleDateString()}</p>
            </div>

            <table className='w-full border-collapse border border-black text-[11px]'>
                <thead>
                    <tr className='bg-gray-100'>
                        <th className='w-[5%] border border-black p-1 text-center'>Sl. No</th>
                        <th className='w-[20%] border border-black p-1 text-left'>Student Name</th>
                        <th className='w-[12%] border border-black p-1 text-left'>Adm No</th>
                        <th className='w-[12%] border border-black p-1 text-left'>User Name</th>
                        <th className='w-[13%] border border-black p-1 text-left'>Password</th>
                        <th className='w-[13%] border border-black p-1 text-left'>Class</th>
                        <th className='w-[10%] border border-black p-1 text-left'>Section</th>
                        <th className='w-[15%] border border-black p-1 text-left'>Mobile</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, idx) => (
                        <tr key={idx}>
                            <td className='border border-black p-1 text-center'>{idx + 1}</td>
                            <td className='border border-black p-1'>{student.studentname}</td>
                            <td className='border border-black p-1'>{student.amsT_AdmNo}</td>
                            <td className='border border-black p-1'>{student.username}</td>
                            <td className='border border-black p-1'>{student.password}</td>
                            <td className='border border-black p-1'>{student.asmcL_ClassName}</td>
                            <td className='border border-black p-1'>{student.asmC_SectionName}</td>
                            <td className='border border-black p-1'>{student.amsT_MobileNo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='mt-4 flex justify-between text-[10px]'>
                <p>Total Records: {students.length}</p>
                <p>Authorized Signature</p>
            </div>

            <style jsx global>{`
                @media screen {
                    .print-only {
                        display: none !important;
                    }
                }
                @media print {
                    /* Hide all browser UI and other elements */
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        height: auto !important;
                        min-height: 0 !important;
                    }
                    
                    /* Hide everything by default using visibility to avoid layout shifting issues */
                    body * {
                        visibility: hidden;
                        height: 0;
                    }
                    
                    /* Show only the print root and its children */
                    .print-root, .print-root * {
                        visibility: visible !important;
                        height: auto;
                    }

                    /* Absolute overlay to bypass global layout */
                    div.print-root {
                        display: block !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 20px !important;
                        background: white !important;
                        z-index: 2147483647 !important;
                    }

                    /* Explicitly handle tables and their children */
                    div.print-root table {
                        display: table !important;
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }
                    div.print-root thead { display: table-header-group !important; }
                    div.print-root tbody { display: table-row-group !important; }
                    div.print-root tr { display: table-row !important; }
                    div.print-root td, div.print-root th { 
                        display: table-cell !important;
                        border: 1px solid black !important;
                    }

                    @page {
                        size: A4 portrait;
                        margin: 10mm;
                    }

                    /* Avoid page breaks */
                    table, tr, td {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                }
            `}</style>
        </div>
    );
}
