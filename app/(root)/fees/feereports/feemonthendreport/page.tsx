// app/(root)/fees/feereports/feedefaulterreport/page.tsx
'use client';

import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { useFeeCustomGroupDefaulterreport, useMonthsDropdown } from '@/hooks/fees/useReports';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormError } from '@/components/ui/extension/field';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { feeMonthEndReportsSchema } from '@/schemas/fees/reports';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { useEffect, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { get_split_year } from '@/server/fees/masters/fee_terms_period';
import { getFeeMonthEndReportData } from '@/server/fees/reports/fee_monthendReport';
import type { FeeMonthEndData } from '@/types/fees/reports/reports';
import { Input } from 'react-aria-components';
import { ExportToExcelData, ExporttoPrint, FeeMonthEndChart } from './chart';

type FormFields = z.infer<typeof feeMonthEndReportsSchema>;

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

export default function FeeMonthEndReport() {
    const [loading, setLoading] = useState(false);

    const {
        control,
        setValue,
        handleSubmit,
        watch,
        register,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeMonthEndReportsSchema),
        defaultValues: {
            //fmtP_Year: '',

            userentry: 0,
            settlement: 0
        }
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);

    const [reportLoading, setReportLoading] = useState(false); // ← ADD THIS LINE
    const [showReport, setShowReport] = useState(false);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);

    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    const [splitAcademicYear, setSplitAcademicYear] = useState<any>(null); // store API result

    const [isSplitLoading, setIsSplitLoading] = useState(false);
    const [selectedSplitYear, setSelectedSplitYear] = useState<string | null>(null);

    const [reportData, setReportData] = useState<FeeMonthEndData | null>(null);

    //const [reportData, setReportData] = useState<any>(null);
    const [instituteLogo, setInstituteLogo] = useState<string>('');

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useacademicyerdropdowndatafee();

    //const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const { data: months, isLoading: monthsloading, error: monthserror } = useMonthsDropdown();

    // Hooks
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();

    const { data: customGroupResponse, isLoading: loadingCustomGroup, error: customGroupError } = useFeeCustomGroupDefaulterreport();

    useEffect(() => {
        if (academicError) {
            toast.error(academicError?.message || 'Failed to load academic years');
            setAcademicYears([]);
            return;
        }
        if (academicData?.data && Array.isArray(academicData.data)) {
            const formatted: IAcademicYear[] = academicData.data.map((item: any) => ({
                asmaY_Id: item.asmaY_Id ?? '',
                asmaY_Year: item.asmaY_Year ?? 'Unknown Year',
                asmaY_Order: item.asmaY_Order ?? 0
            }));
            formatted.sort((a, b) => (b.asmaY_Order || 0) - (a.asmaY_Order || 0));
            setAcademicYears(formatted);
        }
    }, [academicData, academicError]);

    const toggleRow = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const schoolName = process.env.NEXT_PUBLIC_SCHOOL_NAME || 'My School';
    const schoolAddress = process.env.NEXT_PUBLIC_SCHOOL_ADDRESS || 'My Address';
    const month = watch('from_Month') || '';

    const designation = 'Implementation Engineer';
    const iename = watch('iename') || '';

    const academicYearId = watch('asmay_Id');

    const monthid = watch('from_Month');

    const formattedDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    const monthlabel = months?.data?.find((item: any) => Number(item.ivrM_Month_Id) === Number(monthid))?.ivrM_Month_Name || '';

    const academicYearLabel = academicYear?.data?.find((item: any) => Number(item.asmaY_Id) === Number(academicYearId))?.asmaY_Year || '';

    useEffect(() => {
        if (selectedAcademicYear !== null) {
            const fetchSplitAcademicYear = async () => {
                setIsSplitLoading(true); // 🔥 Disable immediately
                setSplitAcademicYear(null); // 🔥 Clear old data
                setSelectedSplitYear(null); // 🔥 Reset selected option
                try {
                    const response = await get_split_year(Number(selectedAcademicYear));
                    console.log('Split Academic Year:', response);
                    setSplitAcademicYear(response.data); // store result if needed
                } catch (err) {
                    console.error('Failed to fetch split academic year', err);
                } finally {
                    setIsSplitLoading(false); // 🔥 Re-enable dropdown
                }
            };

            fetchSplitAcademicYear();
        }
    }, [selectedAcademicYear]);

    const handleExport = () => {
        ExportToExcelData(reportData, formattedDate, instituteLogo || undefined, monthlabel);
    };

    const printRef = useRef<HTMLDivElement>(null);

    // const handlePrint = () => {
    //     if (!printRef.current) return;
    //     ExporttoPrint(printRef.current.innerHTML);
    // };

    const handlePrint = async () => {
        if (!printRef.current) return;

        let html = printRef.current.innerHTML;

        if (instituteLogo) {
            const base64Logo = await imageToBase64(instituteLogo);
            html = html.replace(instituteLogo, base64Logo);
        }

        ExporttoPrint(html);
    };

    async function imageToBase64(url: string): Promise<string> {
        const res = await fetch(url);
        const blob = await res.blob();

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    }

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        const response = await getFeeMonthEndReportData(
            Number(data.asmay_Id), // Academic Year
            Number(data.fmtP_Year),
            Number(data.from_Month),
            Number(data.userentry ?? 0),
            Number(data.settlement ?? 0)
        );

        console.log('Fee Month End Report Data:', JSON.stringify(response));

        if (!response || !response.success || !response.data || !Array.isArray(response.data.list) || response.data.list.length === 0) {
            toast.error('No data found for the selected criteria');
            return;
        }

        const report = response.data.list[0]; // ✅ This gets the first item
        const instituteLogo = response.data.institute_logo;

        // ✅ Set state - This sets the ENTIRE response.data, not just the first item
        // setReportData(report); // This would be wrong - it would only set the first list item
        setReportData(report); // ✅ This is correct - sets the entire data object
        setInstituteLogo(instituteLogo);
        setShowReport(true);
        // const report = response.data.list[0];

        // const instituteLogo = response.data.institute_logo;

        // // ✅ Set state
        // //  setReportData(report);
        // setReportData({
        //     ...response.data, // contains institute_logo, etc.
        //     list: response.data.list
        // });
        // setInstituteLogo(instituteLogo);
        // setShowReport(true);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            <div className='space-y-8'>
                                <div className='grid grid-cols-2 gap-x-16 gap-y-8'>
                                    <div className='flex items-center gap-6'>
                                        <Label className='w-[150px] text-right'>
                                            Academic Year:<span className='ml-1 text-red-500'>*</span>
                                        </Label>
                                        <div className='w-[400px]'>
                                            <Controller
                                                name='asmay_Id'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        onValueChange={(val) => {
                                                            const id = Number(val);
                                                            field.onChange(id);
                                                            setSelectedAcademicYear(id);
                                                        }}
                                                        value={field.value ? String(field.value) : ''}>
                                                        <SelectTrigger className='w-full text-center'>
                                                            <SelectValue placeholder='--Select Academic Year--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {academicYear?.data?.map((item: any) => (
                                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                    {item.asmaY_Year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.asmay_Id && <FormError className='mt-1'>{errors.asmay_Id.message}</FormError>}
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-6'>
                                        <Label className='w-[150px] text-right'>
                                            Month:<span className='ml-1 text-red-500'>*</span>
                                        </Label>
                                        <div className='w-[400px]'>
                                            <Controller
                                                name='from_Month'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        onValueChange={(val) => {
                                                            const id = Number(val);
                                                            field.onChange(id);
                                                            setSelectedMonth(id);
                                                        }}
                                                        value={field.value ? String(field.value) : ''}>
                                                        <SelectTrigger className='w-full text-center'>
                                                            <SelectValue placeholder='--Select Month--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {months?.data?.map((item: any) => (
                                                                <SelectItem key={item.ivrM_Month_Id} value={item.ivrM_Month_Id.toString()}>
                                                                    {item.ivrM_Month_Name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.from_Month && <FormError className='mt-1'>{errors.from_Month.message}</FormError>}
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-6'>
                                        <Label className='w-[150px] text-right'>
                                            Year:<span className='ml-1 text-red-500'>*</span>
                                        </Label>
                                        <div className='w-[400px]'>
                                            <Controller
                                                name='fmtP_Year'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value || ''}
                                                        onValueChange={(val) => {
                                                            field.onChange(val);
                                                            setSelectedSplitYear(val);
                                                        }}
                                                        // disabled={!selectedAcademicYear}
                                                    >
                                                        <SelectTrigger className='w-full text-center'>
                                                            <SelectValue placeholder='--Select Year--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {splitAcademicYear?.map((item: any) => (
                                                                <SelectItem key={item.fmtP_Year} value={item.fmtP_Year}>
                                                                    {item.fmtP_Year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.fmtP_Year && <FormError className='mt-1'>{errors.fmtP_Year.message}</FormError>}
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-6'>
                                        <Label className='w-[150px] text-right'>IE Name:</Label>
                                        <div className='w-[400px]'>
                                            <InputText id='iename' {...register('iename')} error={errors.iename?.message} />
                                        </div>
                                    </div>

                                    {/* Checkboxes (Full Width Row) */}
                                    <div className='col-span-2 mt-4 flex justify-center gap-20'>
                                        <Label className='flex items-center gap-2'>
                                            <Input type='checkbox' onChange={(e) => setValue('userentry', e.target.checked ? 1 : 0)} />
                                            User Entry
                                        </Label>

                                        <Label className='flex items-center gap-2'>
                                            <Input type='checkbox' onChange={(e) => setValue('settlement', e.target.checked ? 1 : 0)} />
                                            Settlement Report
                                        </Label>
                                    </div>
                                </div>

                                <div>
                                    {/* ==================== ACTION BUTTONS ==================== */}
                                    <div className='flex justify-end gap-4 border-t pt-8'>
                                        <Button size='lg' variant='outline' className='px-12' onClick={() => window.location.reload()}>
                                            Cancel
                                        </Button>
                                        <Button type='submit' disabled={isSubmitting} className='px-12'>
                                            {isSubmitting ? 'Generating...' : 'Report'}
                                        </Button>

                                        {/* <Button
                                            size='lg'
                                            className='px-12'
                                            type='submit'
                                        onClick={handleSubmit}
                                        disabled={
                                            reportLoading ||
                                            !filters.academicYearId ||
                                            filters.feeGroupIds.length === 0 ||
                                            filters.termIds.length === 0
                                        }
                                        >
                                            Generate Report
                                        </Button> */}
                                    </div>

                                    {/* ==================== REPORT SECTION ==================== */}

                                    {showReport && (
                                        <div ref={printRef} className='mt-8'>
                                            <CollapsibleSection defaultOpen={true}>
                                                <div className='mt-10 rounded-lg border bg-white shadow-xl'>
                                                    <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                                                        <h2 className='font-bold text-2xl text-primary'>Fee Month End Report</h2>

                                                        <div className='flex gap-3'>
                                                            <div className='mb-4 flex justify-end gap-2'>
                                                                <Button
                                                                    size='sm'
                                                                    className='h-8 w-auto px-3 text-xs'
                                                                    onClick={handleExport}>
                                                                    Export Excel
                                                                </Button>

                                                                <Button
                                                                    size='sm'
                                                                    variant='outline'
                                                                    className='h-8 w-auto px-3 text-xs'
                                                                    onClick={handlePrint}>
                                                                    Print
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='border bg-white p-6 text-sm'>
                                                        {/* ================= HEADER ================= */}
                                                        <div className='text-center'>
                                                            {instituteLogo && (
                                                                <img src={instituteLogo} alt='Institute Logo' className='mx-auto' />
                                                            )}
                                                        </div>
                                                        <div className='text-center'>
                                                            SCHOOL FEES {monthlabel.toUpperCase()} MONTH REPORT
                                                        </div>

                                                        {/* ================= INFO TABLE ================= */}
                                                        <table className='mt-6 w-full border'>
                                                            <tbody>
                                                                <tr>
                                                                    <td className='border p-2'>Name :</td>
                                                                    <td className='border p-2'>{iename}</td>
                                                                    <td className='border p-2'>Date :</td>
                                                                    <td className='border p-2'>{formattedDate}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>Designation :</td>
                                                                    <td className='border p-2'>{designation}</td>
                                                                    <td className='border p-2'>Academic Year :</td>
                                                                    <td className='border p-2'>{academicYearLabel}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>Total SMS :</td>
                                                                    <td className='border p-2'>{reportData?.smsCount}</td>
                                                                    <td className='border p-2'>Total Email :</td>
                                                                    <td className='border p-2'>{reportData?.emailCount}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                        {/* ================= SUMMARY TABLE ================= */}
                                                        <table className='mt-6 w-full border text-center'>
                                                            <thead className='bg-primary text-white'>
                                                                <tr>
                                                                    <th className='border p-2'>SL.NO</th>
                                                                    <th className='border p-2 text-left'>Name</th>
                                                                    <th className='border p-2'>Count</th>
                                                                    <th className='border p-2'>Kiosk</th>
                                                                    <th className='border p-2'>Portal and Dashboard</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className='border p-2'>1</td>
                                                                    <td className='border p-2 text-left'>Fee Collection By Cash</td>
                                                                    <td className='border p-2'>{reportData?.cashCount || 0}</td>
                                                                    <td className='border p-2'>0</td>
                                                                    <td className='border p-2'>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>2</td>
                                                                    <td className='border p-2 text-left'>Fee Collection By Bank</td>
                                                                    <td className='border p-2'>{reportData?.bankCount || 0}</td>
                                                                    <td className='border p-2'>0</td>
                                                                    <td className='border p-2'>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>3</td>
                                                                    <td className='border p-2 text-left'>Fee Collection By Online</td>
                                                                    <td className='border p-2'>{reportData?.onlineCount || 0}</td>
                                                                    <td className='border p-2'>0</td>
                                                                    <td className='border p-2'>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>4</td>
                                                                    <td className='border p-2 text-left'>Fee Collection By RTGS</td>
                                                                    <td className='border p-2'>{reportData?.rtgs || 0}</td>
                                                                    <td className='border p-2'>0</td>
                                                                    <td className='border p-2'>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>5</td>
                                                                    <td className='border p-2 text-left'>Fee Collection By Card</td>
                                                                    <td className='border p-2'>{reportData?.cardCount || 0}</td>
                                                                    <td className='border p-2'>0</td>
                                                                    <td className='border p-2'>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>6</td>
                                                                    <td className='border p-2 text-left'>Fee Collection By ECS</td>
                                                                    <td className='border p-2'>{reportData?.ecs || 0}</td>
                                                                    <td className='border p-2'>0</td>
                                                                    <td className='border p-2'>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>7</td>
                                                                    <td className='border p-2 text-left'>Fee Refund By Cash</td>
                                                                    <td className='border p-2'>{reportData?.refund || 0}</td>
                                                                    <td className='border p-2'>0</td>
                                                                    <td className='border p-2'>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>8</td>
                                                                    <td className='border p-2 text-left'>Fee Refund By Bank</td>
                                                                    <td className='border p-2'>{reportData?.refundBank || 0}</td>
                                                                    <td className='border p-2'>0</td>
                                                                    <td className='border p-2'>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='border p-2'>9</td>
                                                                    <td className='border p-2 text-left'>Fee Defaulters</td>
                                                                    <td className='border p-2'>{reportData?.defaulters || 0}</td>
                                                                    <td className='border p-2'>0</td>
                                                                    <td className='border p-2'>0</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                        {/* ================= FOOTER ================= */}
                                                        <div className='mt-16 grid grid-cols-2 gap-10'>
                                                            <div>Implementation Engineer: _______________</div>
                                                            <div>Nodal Officer: _______________</div>
                                                            <div>End User: _______________</div>
                                                            <div>Seal</div>
                                                        </div>
                                                        <FeeMonthEndChart
                                                            cash={reportData?.cashCount || 0}
                                                            bank={reportData?.bankCount || 0}
                                                            online={reportData?.onlineCount || 0}
                                                            rtgs={reportData?.rtgs || 0}
                                                            card={reportData?.cardCount || 0}
                                                            ecs={reportData?.ecs || 0}
                                                            cashRefund={reportData?.refund || 0}
                                                            bankRefund={reportData?.refundBank || 0}
                                                            defaulters={reportData?.defaulters || 0}
                                                        />
                                                    </div>
                                                </div>
                                            </CollapsibleSection>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}
