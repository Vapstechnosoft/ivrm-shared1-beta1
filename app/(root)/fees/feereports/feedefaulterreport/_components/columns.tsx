'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

export interface IFeeDefaluterReport {
    feeGroup: string;
    totalDue: number;
    id: number;
}

interface Props {
    data: IFeeDefaluterReport[];
    isLoading?: boolean;
}

export default function FeeDefaulterCustomTable({ data, isLoading }: Props) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<'feeGroup' | 'totalDue' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // const [openSort, setOpenSort] = useState<null | 'feeGroup' | 'totalDue'>(null);

    // 🔍 SEARCH + SORT
    const filteredData = useMemo(() => {
        let rows = [...data];

        // SEARCH
        if (search) {
            rows = rows.filter((r) => r.feeGroup.toLowerCase().includes(search.toLowerCase()) || r.totalDue.toString().includes(search));
        }

        // SORT
        if (sortKey) {
            rows.sort((a, b) => {
                const valA = a[sortKey];
                const valB = b[sortKey];

                if (typeof valA === 'string') {
                    return sortOrder === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
                }

                return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
            });
        }

        return rows;
    }, [data, search, sortKey, sortOrder]);

    // 🔃 SORT HANDLER
    const handleSort = (key: 'feeGroup' | 'totalDue') => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    // ✅ SELECTION
    const toggleRow = (index: number) => {
        setSelectedRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const toggleAll = () => {
        if (selectedRows.length === filteredData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredData.map((_, i) => i));
        }
    };

    // 💰 TOTALS
    const totalBalance = filteredData.reduce((sum, r) => sum + r.totalDue, 0);

    const selectedBalance = selectedRows.reduce((sum, i) => sum + filteredData[i].totalDue, 0);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className='space-y-3'>
            {/* 🔍 SEARCH */}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search group or amount...'
                className='w-72 rounded border px-3 py-2'
            />

            {/* TABLE */}
            <div className='overflow-x-auto border'>
                <table className='w-full table-auto border-collapse'>
                    <thead className='bg-primary text-white'>
                        <tr>
                            <th className='p-2 text-center'>
                                <Checkbox
                                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                                    onCheckedChange={toggleAll}
                                />
                            </th>

                            <th className='p-2 text-center'>Sl No</th>

                            <th className='cursor-pointer p-2 text-center' onClick={() => handleSort('feeGroup')}>
                                Group Name {sortKey === 'feeGroup' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>

                            <th className='cursor-pointer p-2 text-center' onClick={() => handleSort('totalDue')}>
                                Balance Amount {sortKey === 'totalDue' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index} className='border-b'>
                                <td className='p-2 text-center'>
                                    <Checkbox checked={selectedRows.includes(index)} onCheckedChange={() => toggleRow(index)} />
                                </td>

                                <td className='p-2 text-center font-medium'>{index + 1}</td>

                                <td className='p-2 text-center font-medium'>{row.feeGroup}</td>

                                <td className='p-2 text-center font-bold'>₹{row.totalDue.toLocaleString('en-IN')}</td>
                            </tr>
                        ))}

                        {/* TOTAL */}
                        <tr className='bg-gray-100 font-bold'>
                            <td />
                            <td />
                            <td className='p-2 text-center'>Total</td>
                            <td className='p-2 text-center'>₹{totalBalance.toLocaleString('en-IN')}</td>
                        </tr>

                        {/* SELECTED TOTAL */}
                        <tr className='bg-gray-200 font-bold'>
                            <td />
                            <td />
                            <td className='p-2 text-center'>Selected Balance</td>
                            <td className='p-2 text-center'>₹{selectedBalance.toLocaleString('en-IN')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function printTable(columns: string[], rows: any[], sumRow?: any) {
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) return;

    const tableHead = columns.map((col) => `<th>${col}</th>`).join('');

    const tableRows = rows.map((row) => `<tr>${columns.map((col) => `<td>${row[col] ?? ''}</td>`).join('')}</tr>`).join('');

    const totalRow = sumRow
        ? `<tr style="font-weight:bold;background:#f3f3f3">
            ${columns.map((col) => `<td>${sumRow[col] ?? ''}</td>`).join('')}
           </tr>`
        : '';

    printWindow.document.write(`
        <html>
        <head>
            <title>Print Report</title>
            <style>
                body { font-family: Arial; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 6px; font-size: 12px; }
                th { background: #eaeaea; }
            </style>
        </head>
        <body>
            <h3>Fee Defaulter Report</h3>
            <table> 
                <thead><tr>${tableHead}</tr></thead>
                <tbody>
                    ${tableRows}
                    ${totalRow}
                </tbody>
            </table>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
}

export function exportToExcel(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforFeeGroupWise(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Group Name': row.fmG_GroupName,
        'Balance Amount': `${row.totalBalance?.toLocaleString('en-IN') || '0'}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforFeeHeadWise(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Head Name': row.fmH_FeeName,
        'Balance Amount': `${row.totalBalance?.toLocaleString('en-IN') || '0'}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforFeeClassWise(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        'Class Name': row.asmcL_ClassName,
        'Balance Amount': `${row.totalBalance?.toLocaleString('en-IN') || '0'}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforFeeInstallmentWise(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        Name: row.fmG_GroupName,
        'Admission No': row.amsT_AdmNo,
        'Class & Section': row.classSection,
        'Father Name': row.amsT_FatherName,
        'Mobile Number': row.amsT_MobileNo,
        'Email ID': row.amsT_emailId,
        Term: row.fmT_Name,
        'Balance Amount': row.totalBalance
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforFeeStudentorStaffWise(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;
    const dataForExcel = rows.map((row, index) => ({
        'Sl No': index + 1,
        Name: row.fmG_GroupName,
        'Admission No': row.amsT_AdmNo,
        'Class & Section': row.classSection,
        'Father Name': row.amsT_FatherName,
        'Mobile Number': row.amsT_MobileNo,
        'Email ID': row.amsT_emailId,
        Route: row.amsT_Route,
        'Balance Amount': row.totalBalance
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToExcelforFeeStudentorStaffWiseofBalance(rows: any[], fileName: string, dynamicFeeNames: string[]) {
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((row, index) => {
        const baseData: Record<string, any> = {
            'Sl No': index + 1,
            Name: row.studentName,
            'Admission No': row.admno,
            Class: row.className,
            Section: row.sectionName,
            'Father Name': row.fatherName,
            'Mobile Number': row.mobileNo,
            'Email ID': row.email
        };
        dynamicFeeNames.forEach((feeName) => {
            const feeKey = feeName.toLowerCase().replace(/\s+/g, '_');
            const feeAmount = row[feeKey] || row.feeCategories?.[feeName] || 0;
            baseData[feeName] = feeAmount;
        });
        baseData['Total Balance'] = row.tobepaid || 0;
        return baseData;
    });

    // Add total row
    const totalRow: Record<string, any> = {
        'Sl No': 'Total',
        Name: '',
        'Admission No': '',
        Class: '',
        Section: '',
        'Father Name': '',
        'Mobile Number': '',
        'Email ID': ''
    };
    dynamicFeeNames.forEach((feeName) => {
        const feeKey = feeName.toLowerCase().replace(/\s+/g, '_');
        const totalFee = rows.reduce((sum, row) => {
            const feeAmount = row[feeKey] || row.feeCategories?.[feeName] || 0;
            return sum + feeAmount;
        }, 0);
        totalRow[feeName] = totalFee;
    });

    totalRow['Total Balance'] = rows.reduce((sum, row) => sum + (row.tobepaid || 0), 0);
    dataForExcel.push(totalRow);
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const totalRowIndex = rows.length + 1;
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
        if (!worksheet[cellAddress]) continue;

        if (!worksheet[cellAddress].s) {
            worksheet[cellAddress].s = {};
        }
        worksheet[cellAddress].s = {
            ...worksheet[cellAddress].s,
            font: { bold: true },
            fill: { fgColor: { rgb: 'FFCCCCCC' } }
        };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Report');
    const wscols = [
        { wch: 8 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 30 },
        ...dynamicFeeNames.map(() => ({ wch: 15 })),
        { wch: 15 }
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
