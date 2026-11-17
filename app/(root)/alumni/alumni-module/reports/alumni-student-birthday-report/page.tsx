'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { getBirthdayReportDetails } from '@/server/alumni/alumni-student-birthday-report';
import { FileSpreadsheet, Printer } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import ReportFilterForm from './_components/report-filter-form';
import type { IBirthdayReportFormValues } from './_components/schema';

export default function AlumniStudentBirthdayReportPage() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [staffBirthday, setStaffBirthday] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const handleGenerateReport = async (values: IBirthdayReportFormValues) => {
        setLoading(true);
        setReportData([]);
        setSelectedRows([]);
        try {
            const payload = {
                months: values.all1 === '0' ? values.month : '',
                flag: values.flag,
                all1: values.all1,
                Fromdate: values.all1 === '1' ? values.fromdate?.toDateString() : new Date().toDateString(),
                Todate: values.all1 === '1' ? values.todate?.toDateString() : new Date().toDateString()
            };

            const res = await getBirthdayReportDetails(payload);
            if (res && (res as any).count > 0) {
                setReportData((res as any).studentDetails || []);
                // Check if report is for staff based on ID existence in first record
                setStaffBirthday((res as any).studentDetails[0]?.HRME_Id > 0);
            } else {
                toast.info('No Records Found');
            }
        } catch (error) {
            console.error('Failed to generate report:', error);
            toast.error('An error occurred while generating report');
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select records to be exported');
            return;
        }

        const dataToExport = selectedRows.map((row, index) => ({
            'SL.No': index + 1,
            'Student Name': row.studentname,
            'Adm.No.': row.admno,
            Class: row.classname,
            Section: row.sectionname,
            'Date of Birth': new Date(row.amst_dob).toLocaleDateString('en-GB'),
            Address: row.stdaddress
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Birthday Report');
        XLSX.writeFile(workbook, 'Student_Birthday_Report.xlsx');
    };

    const handlePrint = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select records to be printed');
            return;
        }
        window.print();
    };

    const columns = [
        {
            id: 'select',
            header: ({ table }: any) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            ),
            cell: ({ row }: any) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
            )
        },
        { header: 'SL.No', cell: ({ row }: any) => row.index + 1 },
        { header: staffBirthday ? 'Employee Name' : 'Student Name', accessorKey: 'studentname' },
        { header: 'Adm.No.', accessorKey: 'admno', className: staffBirthday ? 'hidden' : '' },
        { header: 'Class', accessorKey: 'classname' },
        { header: 'Section', accessorKey: 'sectionname' },
        {
            header: 'Date of Birth',
            accessorKey: 'amst_dob',
            cell: ({ row }: any) => new Date(row.original.amst_dob).toLocaleDateString('en-GB')
        },
        {
            header: 'Photo',
            accessorKey: 'amst_photo',
            cell: ({ row }: any) => (
                <div className='relative h-12 w-12 rounded border'>
                    <Image src={row.original.amst_photo} alt='Photo' fill className='object-cover' />
                </div>
            )
        },
        { header: 'Address', accessorKey: 'stdaddress' }
    ];

    return (
        <div className='container space-y-8 p-6'>
            <div className='border-b pb-4'>
                <h1 className='font-bold text-3xl tracking-tight'>Student Birthday Report</h1>
                <p className='text-muted-foreground'>Analyze and export birthday data for students and staff.</p>
            </div>

            <ReportFilterForm onSubmit={handleGenerateReport} isLoading={loading} />

            {reportData.length > 0 && (
                <CollapsibleSection title='Report Results' defaultOpen={true}>
                    <div className='mb-4 flex justify-end gap-4 print:hidden'>
                        <Button
                            onClick={exportToExcel}
                            variant='outline'
                            className='border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'>
                            <FileSpreadsheet className='mr-2 h-4 w-4' /> Export Excel
                        </Button>
                        <Button
                            onClick={handlePrint}
                            variant='outline'
                            className='border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'>
                            <Printer className='mr-2 h-4 w-4' /> Print Report
                        </Button>
                    </div>

                    <GenericDataTable
                        columns={columns}
                        data={reportData}
                        isLoading={loading}
                        onRowSelectionChange={setSelectedRows}
                        maxSelectableRows={0}
                    />
                </CollapsibleSection>
            )}

            {/* Printable Area - Hidden in UI, visible in Print */}
            <div id='print-area' className='hidden p-8 print:block'>
                <div className='mb-8 space-y-4 text-center'>
                    <h2 className='border-b pb-2 font-bold text-2xl uppercase tracking-wide'>Student Birthday Report</h2>
                    <div className='text-muted-foreground text-sm'>Generated on {new Date().toLocaleDateString('en-GB')}</div>
                </div>
                <table className='w-full border-collapse border text-sm'>
                    <thead>
                        <tr className='bg-muted/50'>
                            <th className='border p-2'>SL.No</th>
                            <th className='border p-2'>Name</th>
                            <th className='border p-2'>Class/Sec</th>
                            <th className='border p-2'>Date of Birth</th>
                            <th className='border p-2'>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedRows.map((row, idx) => (
                            <tr key={idx} className='border'>
                                <td className='border p-2 text-center'>{idx + 1}</td>
                                <td className='border p-2'>{row.studentname}</td>
                                <td className='border p-2 text-center'>
                                    {row.classname} - {row.sectionname}
                                </td>
                                <td className='border p-2 text-center'>{new Date(row.amst_dob).toLocaleDateString('en-GB')}</td>
                                <td className='border p-2'>{row.stdaddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='mt-8 border-t pt-4 text-center text-muted-foreground text-xs'>End of Report</div>
            </div>
        </div>
    );
}
