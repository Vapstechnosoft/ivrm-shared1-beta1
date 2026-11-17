'use client';

import type { IRigistrationReportList } from '@/types/admission/preadmission/reports';
import { format, isValid } from 'date-fns';
import React from 'react';

interface RegistrationReportPrintProps {
    data: IRigistrationReportList[];
    institutionName?: string;
}

export const RegistrationReportPrint = React.forwardRef<HTMLDivElement, RegistrationReportPrintProps>(
    ({ data, institutionName }, ref) => {
        const currentDate = format(new Date(), 'dd/MM/yyyy');

        const formatDate = (dateStr: string | null | undefined) => {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return isValid(date) ? format(date, 'dd/MM/yyyy') : '-';
        };

        return (
            <div
                ref={ref}
                className='print-preview-content'
                style={{
                    padding: '20px',
                    background: 'white',
                    color: 'black',
                    width: '100%',
                    fontFamily: 'Arial, sans-serif'
                }}>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    @media print {
                        @page {
                            size: A4 portrait !important;
                            margin: 10mm !important;
                        }
                        
                    /* This Targets the container that has the ref in page.tsx */
                    .registration-report-print-container {
                        position: static !important;
                        display: block !important;
                        visibility: visible !important;
                        width: 210mm !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                        opacity: 1 !important;
                        background: white !important;
                    }

                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    .print-preview-content {
                        display: block !important;
                        visibility: visible !important;
                        width: 100% !important;
                        min-height: 100mm !important;
                        padding: 10mm !important;
                    }

                        table {
                            width: 100% !important;
                            border-collapse: collapse !important;
                            border: 1px solid #000 !important;
                        }

                        th, td {
                            border: 1px solid #000 !important;
                            padding: 6px 8px !important;
                            font-size: 10pt !important;
                            color: #000 !important;
                        }

                        th {
                            background-color: #f2f2f2 !important;
                        }
                    }
                `
                    }}
                />

                {!data || data.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', border: '1px solid black' }}>
                        No records found for the selected criteria.
                    </div>
                ) : (
                    <div style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid black', paddingBottom: '10px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: 'black' }}>
                                {institutionName || 'VAPS TECHNOSOFT'}
                            </h1>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '5px', color: 'black', textDecoration: 'underline' }}>
                                REGISTRATION REPORT
                            </h2>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2' }}>
                                    <th style={{ width: '50px', textAlign: 'center', border: '1px solid black' }}>SL.No</th>
                                    <th style={{ textAlign: 'left', border: '1px solid black' }}>Name</th>
                                    <th style={{ textAlign: 'left', border: '1px solid black' }}>Email</th>
                                    <th style={{ textAlign: 'center', width: '140px', border: '1px solid black' }}>Mobile No</th>
                                    <th style={{ textAlign: 'center', width: '110px', border: '1px solid black' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index} style={{ pageBreakInside: 'avoid' }}>
                                        <td style={{ textAlign: 'center', border: '1px solid black' }}>{index + 1}</td>
                                        <td style={{ border: '1px solid black' }}>{row.name || '-'}</td>
                                        <td style={{ border: '1px solid black' }}>{row.email_Id || '-'}</td>
                                        <td style={{ textAlign: 'center', border: '1px solid black' }}>{row.mob_No || '-'}</td>
                                        <td style={{ textAlign: 'center', border: '1px solid black' }}>
                                            {formatDate(row.created_Date)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '11px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                            Printed on: {currentDate} | ERP Solution by VAPS Technosoft
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

RegistrationReportPrint.displayName = 'RegistrationReportPrint';
