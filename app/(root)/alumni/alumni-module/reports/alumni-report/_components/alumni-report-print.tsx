'use client';

import type { IAlumniReportResultItem } from '@/types/alumni/alumni-report';
import { format, isValid } from 'date-fns';
import React from 'react';

interface AlumniReportPrintProps {
    data: IAlumniReportResultItem[];
    institutionName?: string;
    showEmail?: boolean;
    showPhone?: boolean;
}

export const AlumniReportPrint = React.forwardRef<HTMLDivElement, AlumniReportPrintProps>(
    ({ data, institutionName, showEmail = true, showPhone = true }, ref) => {
        const currentDate = format(new Date(), 'dd/MM/yyyy');

        const formatDate = (dateStr: string | null | undefined) => {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return isValid(date) ? format(date, 'dd/MM/yyyy') : '-';
        };

        if (!data || data.length === 0) {
            return (
                <div ref={ref} style={{ padding: '20px', background: 'white', color: 'black', textAlign: 'center' }}>
                    No data selected for printing.
                </div>
            );
        }

        return (
            <div ref={ref} style={{ padding: '20mm', background: 'white', color: 'black', minHeight: '100%', width: '100%' }}>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    @media print {
                        .print-component-wrapper {
                            display: block !important;
                            position: static !important;
                            visibility: visible !important;
                        }
                    }
                `
                    }}
                />
                <div className='print-component-wrapper'>
                    <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid black', paddingBottom: '10px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>
                            {institutionName || 'VAPS TECHNOSOFT'}
                        </h1>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline', marginTop: '10px' }}>
                            ALUMNI REPORT
                        </h2>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '9px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f3f4f6' }}>
                                <th style={{ border: '1px solid black', padding: '5px', width: '30px', textAlign: 'center' }}>SL</th>
                                <th style={{ border: '1px solid black', padding: '5px', textAlign: 'left' }}>Alumnus Name</th>
                                <th style={{ border: '1px solid black', padding: '5px', textAlign: 'center', width: '70px' }}>DOB</th>
                                {showPhone && (
                                    <th style={{ border: '1px solid black', padding: '5px', textAlign: 'left', width: '100px' }}>
                                        Mobile No
                                    </th>
                                )}
                                {showEmail && (
                                    <th style={{ border: '1px solid black', padding: '5px', textAlign: 'left', width: '150px' }}>
                                        Email Id
                                    </th>
                                )}
                                <th style={{ border: '1px solid black', padding: '5px', textAlign: 'left', width: '100px' }}>
                                    Designation/City
                                </th>
                                <th style={{ border: '1px solid black', padding: '5px', textAlign: 'left', width: '180px' }}>
                                    Full Address
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={row.almst_Id || index}>
                                    <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center', verticalAlign: 'top' }}>
                                        {index + 1}
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '5px', verticalAlign: 'top', fontWeight: '500' }}>
                                        {row.amsT_FirstName}
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center', verticalAlign: 'top' }}>
                                        {formatDate(row.amsT_DOB)}
                                    </td>
                                    {showPhone && (
                                        <td style={{ border: '1px solid black', padding: '5px', verticalAlign: 'top' }}>
                                            {row.amsT_MobileNo || '-'}
                                        </td>
                                    )}
                                    {showEmail && (
                                        <td
                                            style={{
                                                border: '1px solid black',
                                                padding: '5px',
                                                verticalAlign: 'top',
                                                wordBreak: 'break-all'
                                            }}>
                                            {row.amsT_emailId || '-'}
                                        </td>
                                    )}
                                    <td style={{ border: '1px solid black', padding: '5px', verticalAlign: 'top' }}>
                                        <div style={{ fontStyle: 'italic' }}>{row.ALSPR_Designation || '-'}</div>
                                        <div style={{ fontWeight: '500' }}>{row.city || '-'}</div>
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '5px', verticalAlign: 'top' }}>
                                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4', margin: '0', fontSize: '8px' }}>
                                            {row.ALMST_FullAddess}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td
                                    colSpan={5 + (showEmail ? 1 : 0) + (showPhone ? 1 : 0)}
                                    style={{ paddingTop: '15px', textAlign: 'center', fontStyle: 'italic', fontSize: '8px', opacity: 0.7 }}>
                                    Date: {currentDate} | Generated by Vaps Technosoft Pvt. Ltd.
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
);

AlumniReportPrint.displayName = 'AlumniReportPrint';
