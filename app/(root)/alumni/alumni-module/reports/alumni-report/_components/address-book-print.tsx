'use client';

import type { IAlumniReportResultItem } from '@/types/alumni/alumni-report';
import React from 'react';

interface AddressBookPrintProps {
    data: IAlumniReportResultItem[];
    showEmail?: boolean;
    showPhone?: boolean;
}

export const AddressBookPrint = React.forwardRef<HTMLDivElement, AddressBookPrintProps>(
    ({ data, showEmail = true, showPhone = true }, ref) => {
        if (!data || data.length === 0) {
            return (
                <div ref={ref} style={{ padding: '20px', background: 'white', color: 'black', textAlign: 'center' }}>
                    No data selected for printing.
                </div>
            );
        }

        return (
            <div ref={ref} style={{ padding: '10mm', background: 'white', color: 'black', width: '100%' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {data.map((item, index) => (
                            <div
                                key={item.almst_Id || index}
                                style={{
                                    border: '1px solid black',
                                    padding: '12px',
                                    height: '160px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    breakInside: 'avoid',
                                    fontSize: '10px',
                                    lineHeight: '1.4',
                                    backgroundColor: '#fff'
                                }}>
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '5px',
                                            fontSize: '9px',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid #eee',
                                            paddingBottom: '2px'
                                        }}>
                                        <span>{item.ALMST_MembershipId || '-'}</span>
                                        <span>{item.ALMMC_MembershipCategory || 'Standard'}</span>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            color: '#000',
                                            marginBottom: '3px'
                                        }}>
                                        {item.amsT_FirstName}
                                    </div>
                                    <div style={{ color: '#444', fontWeight: '500', marginBottom: '5px' }}>
                                        Class {item.LeftClass || '-'} • {item.ASMAY_Id_NEW_Left || item.ASMAY_Id_Left || '-'}
                                    </div>
                                    <div
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: '3',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            color: '#666',
                                            fontSize: '9px'
                                        }}>
                                        {item.ALMST_FullAddess || 'Address Not Available'}
                                        {item.IVRMMD_Name && `, ${item.IVRMMD_Name}`}
                                        {item.ALMST_PerPincode && ` - ${item.ALMST_PerPincode}`}
                                    </div>
                                </div>
                                <div style={{ borderTop: '0.5px solid #000', paddingTop: '5px', marginTop: '5px' }}>
                                    {showPhone && item.amsT_MobileNo && (
                                        <div style={{ fontWeight: '600' }}>
                                            M: <span style={{ fontWeight: 'normal' }}>{item.amsT_MobileNo}</span>
                                        </div>
                                    )}
                                    {showEmail && item.amsT_emailId && (
                                        <div
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontWeight: '600'
                                            }}>
                                            E: <span style={{ fontWeight: 'normal' }}>{item.amsT_emailId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
);

AddressBookPrint.displayName = 'AddressBookPrint';
