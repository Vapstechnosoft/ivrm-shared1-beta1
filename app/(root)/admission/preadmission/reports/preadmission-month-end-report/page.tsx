'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import { usePreAdmissionMonthEndReport } from '@/hooks/admission/preadmission/useReports';
import { getExcelPreAdmissionMonthEndReport } from '@/server/admission/preadmission/reports/month_end_report';
import AdmissionMonthEndReport from './_components/columns';
export default function MonthendreportPage() {
    const [academicYearId, setAcademicYearId] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [ifName, setIfName] = useState('');
    const [showReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState<ReportItem[]>([]);
    const [formKey, setFormKey] = useState(0);

    const requestData = {
        ASMAY_Id: Number(academicYearId),
        month: selectedMonth,
        year: Number(selectedYear)
    };
    const excelrequestData = {
        amay: academicYearId,
        month: selectedMonth,
        year: selectedYear
    };
    const monthList = [
        { id: 1, name: 'January' },
        { id: 2, name: 'February' },
        { id: 3, name: 'March' },
        { id: 4, name: 'April' },
        { id: 5, name: 'May' },
        { id: 6, name: 'June' },
        { id: 7, name: 'July' },
        { id: 8, name: 'August' },
        { id: 9, name: 'September' },
        { id: 10, name: 'October' },
        { id: 11, name: 'November' },
        { id: 12, name: 'December' }
    ];
    const yearList = [2023, 2024, 2025, 2026, 2027];

    interface ReportItem {
        name: string;
        count?: number; // optional
        photo?: number;
        sms?: number;
        emailId?: number;
        phone?: number;
        online?: number;
        offline?: number;
        missingphoto?: number;
        missingemail?: number;
        missingphone?: number;
    }

    const { data: academicYearOptions, isLoading: academicYearLoading } = useAcademicYearDropdown();
    const { refetch } = usePreAdmissionMonthEndReport(requestData, {}, false);
    // Handle Reset
    const handleReset = () => {
        setAcademicYearId('');
        setSelectedMonth('');
        setSelectedYear('');
        setIfName('');
        setShowReport(false);
        setReportData([]);
        setFormKey((prev) => prev + 1);
        toast.success('Form reset successfully');
    };

    // Handle Report Generate

    const handleGenerateReport = async () => {
        if (!academicYearId || !selectedMonth || !selectedYear) {
            toast.error('Please fill all required fields!');
            return;
        }

        // Show loading toast and store ID
        const toastId = toast.loading('Loading report...');

        try {
            const res = await refetch();
            toast.dismiss(toastId);

            if (res?.data?.data?.reportdatelist?.length) {
                const r = res.data.data.reportdatelist[0];

                setReportData([
                    {
                        name: 'Total Registered',
                        count: r.total_Reg,
                        sms: r.sent_sms_count,
                        emailId: r.sent_email_count,
                        missingphoto: r.missing_photo,
                        missingemail: r.missing_email,
                        missingphone: r.missing_no
                    },
                    {
                        name: 'Total Filled',
                        count: r.total_filled,
                        sms: r.sent_sms_count,
                        emailId: r.sent_email_count
                    },
                    {
                        name: 'Reg. Not Filled',
                        count: r.total_notfilled
                    },
                    {
                        name: 'Reg Payment Done',
                        count: r.total_regpaid,
                        sms: r.sent_sms_count,
                        emailId: r.sent_email_count
                    },
                    {
                        name: 'Reg Payment Not Done',
                        count: r.total_notregpaid
                    },
                    {
                        name: 'Total Transferred',
                        count: r.total_transferd,
                        sms: r.sent_sms_count,
                        emailId: r.sent_email_count
                    },
                    {
                        name: 'Total Entries',
                        count: r.total_Reg + r.total_filled
                    }
                ]);

                setShowReport(true);
                toast.success('Report generated!');
            } else {
                toast.error('No report data found!');
            }
        } catch (_error) {
            toast.dismiss(toastId);
            toast.error('Something went wrong!');
        }
    };

    const downloadExcel = async () => {
        try {
            if (!academicYearId || !selectedMonth || !selectedYear) {
                toast.error('Please fill all required fields!');
                return;
            }

            const response = await getExcelPreAdmissionMonthEndReport(excelrequestData);

            // Ensure we have a Blob
            const blob =
                response instanceof Blob
                    ? response
                    : new Blob([new Uint8Array(response)], {
                          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `MonthEndReport_${selectedMonth}_${selectedYear}.xlsx`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 100);

            setShowReport(false);
            setReportData([]);

            toast.success('Excel downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download Excel');
        }
    };

    return (
        <div className='min-h-screen'>
            {/* FILTER CARD */}
            <div className='mb-3 space-y-6 rounded-xl border p-6 shadow-xl'>
                <div key={formKey} className='grid grid-cols-2 gap-6 sm:grid-cols-1 md:grid-cols-4'>
                    {/* Academic Year */}
                    <div className='flex w-full flex-col gap-2'>
                        <Label className='font-semibold'>
                            Academic Year <span className='text-red-500'>*</span>
                        </Label>

                        <Select
                            onValueChange={(value) => setAcademicYearId(value)}
                            value={academicYearId ? String(academicYearId) : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Academic Year' />
                            </SelectTrigger>

                            <SelectContent>
                                {academicYearLoading && (
                                    <SelectItem value='loading' disabled>
                                        Loading...
                                    </SelectItem>
                                )}

                                {academicYearOptions?.data?.map((item) => (
                                    <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                        {item.asmaY_Year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Month */}
                    <div className='flex w-full flex-col gap-2 '>
                        <Label className='font-semibold'>
                            Month <span className='text-red-500'>*</span>
                        </Label>

                        <Select
                            onValueChange={(value) => setSelectedMonth(value)}
                            value={selectedMonth ? String(selectedMonth) : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Month' />
                            </SelectTrigger>

                            <SelectContent>
                                {monthList.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Year */}
                    <div className='flex w-full flex-col gap-2 '>
                        <Label className='font-semibold'>
                            Year <span className='text-red-500'>*</span>
                        </Label>

                        <Select onValueChange={(value) => setSelectedYear(value)} value={selectedYear ? String(selectedYear) : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Year' />
                            </SelectTrigger>

                            <SelectContent>
                                {yearList.map((year) => (
                                    <SelectItem key={year} value={String(year)}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Implementation Engineer */}
                    <div className='flex w-full flex-col gap-2 '>
                        <InputText
                            label='IE Name'
                            id='implementation-name'
                            placeholder='Enter Name'
                            value={ifName}
                            onChange={(e) => setIfName(e.target.value)}
                        />
                    </div>
                </div>

                {/* BUTTON SECTION */}
                <div className='flex gap-4 pt-4'>
                    <Button onClick={handleReset} variant='outline' className='w-fit'>
                        Reset
                    </Button>
                    <Button onClick={handleGenerateReport} className='w-fit'>
                        Generate Report
                    </Button>
                    <Button onClick={downloadExcel} className='w-fit'>
                        Export to Excel
                    </Button>
                </div>
            </div>
            {showReport && (
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <AdmissionMonthEndReport
                        reportData={reportData}
                        month={selectedMonth}
                        year={Number(selectedYear)}
                        academicYear={Number(academicYearId)}
                        implementationName={ifName}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}
