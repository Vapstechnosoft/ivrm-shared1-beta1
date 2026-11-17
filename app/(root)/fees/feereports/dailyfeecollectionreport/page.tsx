'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';

import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';

import { toast } from 'sonner';

import { FeesCustomMultiSelectBox } from '@/components/ui/feesmultiselect';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useClassDropdownDropdown } from '@/hooks/fees/useReports';
import { dailyFeeCollectionSchema } from '@/schemas/fees/reports';
import { getDailyFeeCollectionReport, getGroupsDropdown } from '@/server/fees/reports/daily_fee_collection_report';
import type { ApiSearchparams } from '@/types';
import type { IDailyFeeCollectionRequest } from '@/types/fees/reports/reports';
import { exportToExcel, printTable } from './_components/print-and-export-excel';

type FormFields = z.infer<typeof dailyFeeCollectionSchema>;

interface DailyFeeProps {
    onSuccess?: (payload: any, apiSearchParams?: ApiSearchparams) => void;
    apiSearchParams: ApiSearchparams;
}
const today = new Date().toISOString().split('T')[0];

export default function DailyFeeCollectionReportForm() {
    // ---------------------------- FORM ----------------------------
    const {
        control,
        handleSubmit,
        reset,
        register,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(dailyFeeCollectionSchema),
        mode: 'all',

        defaultValues: {
            report: 'students',
            rpttyp: 'Individual',
            reportdate: 'transdate',
            asmaY_Id: 0,
            groupIds: [],
            chequeDate: false,
            acdmyr: false,
            headwise: false,
            paymentwise: false,
            fromDate: today,
            toDate: today,
            enableAllClasses: false,
            Fmc_allorsudentorother: 'all',
            Fmc_allorcorddorop: 'All'
        }
    });

    const [submitClicked, setSubmitClicked] = useState(false);

    // ---------------------------- WATCH ----------------------------
    const report = useWatch({ control, name: 'report' });
    const rpttyp = useWatch({ control, name: 'rpttyp' });
    const reportdate = useWatch({ control, name: 'reportdate' });
    const chequeDate = useWatch({ control, name: 'chequeDate' });
    const acdmyr = useWatch({ control, name: 'acdmyr' });
    const headwise = useWatch({ control, name: 'headwise' });
    const paymentwise = useWatch({ control, name: 'paymentwise' });
    const enableAllClasses = useWatch({ control, name: 'enableAllClasses' });
    const Fmc_allorcorddorop = useWatch({ control, name: 'Fmc_allorcorddorop' });
    const selectedGroupIds = useWatch({ control, name: 'groupIds' }) || [];

    const [refreshAY, setRefreshAY] = useState(0);
    const [tableSumRow, setTableSumRow] = useState<any>(null);

    const [reporttype, setReportType] = useState('');

    const sumRow: any = {};

    const handleGroupChange = (values: string[]) => {
        const ids = values.map(Number);
        setValue('groupIds', ids, { shouldValidate: true });
    };
    // ---------------------------- DROPDOWNS ----------------------------
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [feeGroups, setFeeGroups] = useState<any[]>([]);
    const [groupManualLoading, setGroupManualLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);

    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);

    const {
        data: academicData,
        error: academicError,
        isLoading: loadingAcademic,
        refetch: refetchAcademicYears
    } = useAcademicYearDropdown();
    const { data: classData, error: classError } = useClassDropdownDropdown();

    // useEffect(() => {
    //     if (!loadingAcademic && academicData?.data?.length && selectedAsmayId === null) {
    //         setSelectedAsmayId(Number(academicData.data[0].asmaY_Id));
    //     }
    // }, [loadingAcademic, academicData, selectedAsmayId]);

    // useEffect(() => {
    //     if (academicError) toast.error('Failed to load academic years');
    //     if (academicData?.data) {
    //         setAcademicYears(
    //             academicData.data.map((i: any) => ({
    //                 asmaY_Id: i.asmaY_Id,
    //                 asmaY_Year: i.asmaY_Year
    //             }))
    //         );
    //     }
    // }, [academicData, academicError]);

    // useEffect(() => {
    //     if (academicError) toast.error('Failed to load academic years');
    //     if (academicData?.data) {
    //         const years = academicData.data.map((i: any) => ({
    //             asmaY_Id: i.asmaY_Id,
    //             asmaY_Year: i.asmaY_Year
    //         }));

    //         setAcademicYears(years);

    //         // ⭐ AUTO-SELECT FIRST YEAR
    //         if (years.length > 0) {
    //             const firstYearId = years[0].asmaY_Id;
    //             setValue('asmaY_Id', firstYearId, { shouldValidate: true });

    //             // ⭐ Trigger loading of groups immediately
    //             onYearChange(firstYearId);
    //         }
    //     }
    // }, [academicData, academicError]);

    useEffect(() => {
        if (academicError) toast.error('Failed to load academic years');

        if (!loadingAcademic && academicData?.data?.length && selectedAsmayId === null) {
            const years = academicData.data.map((i: any) => ({
                asmaY_Id: i.asmaY_Id,
                asmaY_Year: i.asmaY_Year
            }));

            setAcademicYears(years);

            const firstYearId = years[0].asmaY_Id;
            setValue('asmaY_Id', firstYearId, {
                shouldValidate: true,
                shouldDirty: false
            });

            if (years.length > 0) {
                const firstYearId = years[0].asmaY_Id;

                // ⭐ ALWAYS PICK FIRST YEAR
                setValue('asmaY_Id', firstYearId, { shouldValidate: true });

                // ⭐ ALWAYS reload groups for first year
                onYearChange(firstYearId);
            }
        }
    }, [academicData, academicError, refreshAY]);

    useEffect(() => {
        if (classError) toast.error('Failed to load Class dropdown');
        if (classData?.data) {
            setClasses(
                classData.data.map((i: any) => ({
                    asmcL_Id: i.asmcL_Id,
                    asmcL_ClassName: i.asmcL_ClassName
                }))
            );
        }
    }, [classData, classError]);

    // ---------------------------------------
    // LOAD GROUPS WHEN YEAR CHANGES
    // ---------------------------------------
    // const onYearChange = async (yearId: number) => {
    //     try {
    //         setGroupManualLoading(true);
    //         const res = await getGroupsDropdown(yearId);

    //         setFeeGroups(
    //             res?.data?.map((i: any) => ({
    //                 fmG_Id: i.fmG_Id,
    //                 fmG_GroupName: i.fmG_GroupName
    //             })) ?? []
    //         );

    //         setValue('groupIds', []);
    //     } catch {
    //         toast.error('Failed to load groups');
    //     } finally {
    //         setGroupManualLoading(false);
    //     }
    // };

    const onYearChange = async (yearId: number) => {
        try {
            setGroupManualLoading(true);
            const res = await getGroupsDropdown(yearId);

            const groups =
                res?.data?.map((i: any) => ({
                    fmG_Id: i.fmG_Id,
                    fmG_GroupName: i.fmG_GroupName
                })) ?? [];

            setFeeGroups(groups);

            // ⭐ AUTO-SELECT ALL GROUP IDs
            setValue(
                'groupIds',
                groups.map((g) => g.fmG_Id),
                { shouldValidate: true }
            );
        } catch {
            toast.error('Failed to load groups');
        } finally {
            setGroupManualLoading(false);
        }
    };

    // ===================================================
    // SHOW/HIDE LOGIC
    // ===================================================
    const showHeadPaymentBlock =
        (report === 'All' && rpttyp === 'All' && reportdate === 'transdate') ||
        (report === 'students' && rpttyp === 'All' && reportdate === 'transdate');

    const isClassRequired = rpttyp === 'Individual' && !enableAllClasses;

    // ===================================================
    // TABLE STATES + API LOGIC
    // ===================================================
    const [loading, setLoading] = useState(false);
    const [tableColumns, setTableColumns] = useState<string[]>([]);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [showTable, setShowTable] = useState(false);

    async function fetchDailyReport(params: any) {
        const query = new URLSearchParams(params).toString();
        const url = `/FeeDailycollection/daily-fee-collection-report?${query}`;

        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error('API failed');

        return res.json();
    }

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB');

    const flattenData = (data: any[]) => {
        return data.map((item) => ({
            Date: formatDate(item.date),
            ...item.feeHeadAmounts,
            TotalPaidAmount: item.totalPaidAmount
        }));
    };

    const handlePrint = () => {
        printTable(tableColumns, tableRows, tableSumRow);
    };

    const handleExportExcel = () => {
        exportToExcel(
            [...tableRows, tableSumRow], // include TOTAL row
            'Daily_Fee_Collection_Report'
        );
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setSubmitClicked(true);

        // if (!isClassRequired && (data.asmcL_Id === 0 || data.asmcL_Id === null || data.asmcL_Id === undefined)) {
        //     toast.error('Please select Class');
        //     return;
        // }
        if (rpttyp === 'Individual') {
            if (enableAllClasses === true) {
                toast.error('Please select Class');
                return;
            }
        }

        if (
            reportdate === 'transdate' &&
            rpttyp === 'All' &&
            (report === 'All' || report === 'students') &&
            !chequeDate &&
            !acdmyr &&
            !headwise &&
            !paymentwise
        ) {
            toast.error('Please select at least one checkbox Cheque Date/Add Year Wise Report/Headwise/Paymentwise');
            return;
        }

        // if (isClassRequired && !data.asmcL_Id) {
        //     toast.error('Please select Class');
        //     return;
        // }

        // -------------------------------
        // BASE PARAMS (ALWAYS SENT)
        // -------------------------------
        const params: IDailyFeeCollectionRequest = {
            AsmayId: data.asmaY_Id,
            FromDate: data.fromDate,
            ToDate: data.toDate,
            All_List: [{ columnID: '1' }]
        };

        // // ===================================================
        // // REPORT 4 → STUDENTS / ALL (NOT multiplepaymentmode)
        // // Trigger:
        // // Fmc_allorsudentorother = "stud" OR "All"
        // // AND Fmc_allorcorddorop != "multiplepaymentmode"
        // // ===================================================
        // if ((data.Fmc_allorsudentorother === 'stud' || data.Fmc_allorsudentorother === 'All') && data.Fmc_allorcorddorop !== 'All') {
        //     params.regornamedetails = data.Fmc_allorsudentorother.toLowerCase();
        //     params.allorstdorothersflag = 'all';
        //     params.allorindivflag = data.rpttyp === 'All' ? 'all' : 'individual';
        //     params.allorcorchoronlineflag = data.Fmc_allorcorddorop.toLowerCase();

        //     params.ClassFlag = data.enableAllClasses ? '0' : '1';
        //     params.GroupFlag = data.groupIds.length > 0 ? '1' : '0';
        //     params.Cheque = data.chequeDate ? '1' : '0';
        //     params.TempararyArrayListstring = 'all';

        //     console.log('REPORT 4 (STUDENTS/ALL) PARAMS', params);
        // }

        // // ===================================================
        // // REPORT 5 → STAFF / OTHERS
        // // Trigger: Fmc_allorsudentorother = "staff" | "other"
        // // ===================================================
        // if (data.Fmc_allorsudentorother === 'Trpt' || data.Fmc_allorsudentorother === 'other') {
        //     params.regornamedetails = data.Fmc_allorsudentorother;
        //     params.allorstdorothersflag = 'all';
        //     params.ClassFlag = data.enableAllClasses ? '0' : '1';

        //     console.log('REPORT 5 (STAFF / OTHERS) PARAMS', params);
        // }

        // console.log('FINAL PARAM SENT:', params);

        // ===================================================
        // API CALL
        // ===================================================

        if (data.Fmc_allorsudentorother === 'all') {
            data.Fmc_allorsudentorother = 'multiplepaymentmode';
        }
        try {
            setShowTable(false);
            setLoading(true);
            setTableRows([]);
            // const tempParams: IDailyFeeCollectionRequest = {
            //     AsmayId: 176,
            //     FromDate: '2025-01-01',
            //     ToDate: '2025-01-31',
            //     Headwise: true,
            //     Paymentwise: false
            // };

            //console.log('tempParams', tempParams);
            const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
            const { asmaY_Id, fromDate, toDate, Fmc_allorsudentorother, Fmc_allorcorddorop } = data;

            let payload = {};

            if (data.headwise === true && data.paymentwise === false) {
                payload = {
                    AsmayId: asmaY_Id,
                    FromDate: formatDate(fromDate),
                    ToDate: formatDate(toDate),
                    Headwise: true,
                    Paymentwise: false
                };
            } else if (data.headwise === false && data.paymentwise === true) {
                payload = {
                    AsmayId: asmaY_Id,
                    FromDate: formatDate(fromDate),
                    ToDate: formatDate(toDate),
                    Headwise: false,
                    Paymentwise: true
                };
            } else if (
                // ((data.Fmc_allorsudentorother === 'multiplepaymentmode' || data.Fmc_allorsudentorother === 'all') &&
                //     data.Fmc_allorcorddorop === 'All')
                data.Fmc_allorsudentorother === 'multiplepaymentmode' &&
                report === 'students'
            ) {
                const allList = selectedGroupIds.map((id) => ({
                    columnID: String(id)
                }));
                payload = {
                    AsmayId: asmaY_Id,
                    FromDate: formatDate(fromDate),
                    ToDate: formatDate(toDate),
                    regornamedetails: report,
                    allorstdorothersflag: Fmc_allorsudentorother,
                    All_List: allList
                };
            } else if (report === 'students' && data.Fmc_allorsudentorother !== 'multiplepaymentmode') {
                const allList = selectedGroupIds.map((id) => ({
                    columnID: String(id)
                }));
                payload = {
                    AsmayId: asmaY_Id,
                    FromDate: formatDate(fromDate),
                    ToDate: formatDate(toDate),
                    regornamedetails: report,
                    allorstdorothersflag: Fmc_allorsudentorother,
                    All_List: allList,
                    ClassFlag: data.enableAllClasses ? '0' : '1',
                    allorindivflag: data.rpttyp === 'All' ? 'all' : 'individual',
                    allorcorchoronlineflag: Fmc_allorcorddorop,
                    TempararyArrayListstring: 'all',
                    Cheque: data.chequeDate ? '1' : '0',
                    GroupFlag: selectedGroupIds.length > 0 ? '1' : '0'
                };
            } else if (report === 'All' && data.Fmc_allorsudentorother !== 'multiplepaymentmode') {
                const allList = selectedGroupIds.map((id) => ({
                    columnID: String(id)
                }));
                payload = {
                    AsmayId: asmaY_Id,
                    FromDate: formatDate(fromDate),
                    ToDate: formatDate(toDate),
                    regornamedetails: report,
                    allorstdorothersflag: Fmc_allorsudentorother,
                    All_List: allList,
                    ClassFlag: data.enableAllClasses ? '0' : '1',
                    allorindivflag: data.rpttyp === 'All' ? 'all' : 'individual',
                    allorcorchoronlineflag: Fmc_allorcorddorop,
                    TempararyArrayListstring: 'all',
                    Cheque: data.chequeDate ? '1' : '0',
                    GroupFlag: selectedGroupIds.length > 0 ? '1' : '0'
                };
            }

            console.log('payload', JSON.stringify(payload));
            const response = await getDailyFeeCollectionReport(payload);

            console.log('response', response);

            const rawData: any = response?.data;

            if (!Array.isArray(rawData?.list) || rawData.list.length === 0) {
                toast.error('No data found');
                setShowTable(false);
                setTableRows([]);
                return;
            }

            console.log('rawData', rawData);

            const currentReportType = rawData?.listName || '';
            setReportType(currentReportType);

            if (currentReportType === 'Headwise') {
                const list = Array.isArray(rawData?.list) ? rawData.list : [];

                toast.success('Report Data Fetched Successfully');

                console.log('list', list);

                // 🔹 Collect all fee heads
                const feeHeadSet = new Set<string>();

                list.forEach((item: any) => {
                    Object.keys(item.feeHeadAmounts || {}).forEach((head) => feeHeadSet.add(head));
                });

                const allFeeHeads = Array.from(feeHeadSet);
                const rows = list.map((item: any, index: number) => {
                    const row: any = {
                        SLNO: index + 1,
                        Date: new Date(item.date).toLocaleDateString('en-GB')
                    };

                    allFeeHeads.forEach((head) => {
                        row[head] = Number(item.feeHeadAmounts?.[head] ?? 0); // 🔥 force number
                    });

                    row.Total = Number(item.totalPaidAmount ?? 0); // 🔥 force number

                    return row;
                });

                const columns = ['SLNO', 'Date', ...allFeeHeads, 'Total'];

                setTableColumns(columns);
                setTableRows(rows);

                const sumRow: any = {
                    SLNO: '',
                    Date: 'Total'
                };

                // First columns
                sumRow.SLNO = '';
                sumRow.Date = 'Total';

                // Initialize sums
                columns.forEach((col) => {
                    if (col !== 'SLNO' && col !== 'Date') {
                        sumRow[col] = 0;
                    }
                });

                rows.forEach((row: any) => {
                    columns.forEach((col) => {
                        if (col !== 'SLNO' && col !== 'Date') {
                            sumRow[col] += Number(row[col]); // 🔥 GUARANTEED NUMBER
                        }
                    });
                });

                setTableSumRow(sumRow);
            } else if (currentReportType === 'Paymentwise') {
                const list = Array.isArray(rawData?.list) ? rawData.list : [];
                toast.success('Report Data Fetched Successfully');
                // 🔹 Collect payment modes
                const paymentModeSet = new Set<string>();
                list.forEach((item: any) => {
                    if (item.paymentMode) {
                        paymentModeSet.add(item.paymentMode);
                    }
                });

                const paymentModes = Array.from(paymentModeSet);
                // Example: ['Bank', 'Cash', 'RTGS/NEFT', 'Swipe/Card', 'UPI']

                // 🔹 Group by Date + HeadName
                const grouped: Record<string, any> = {};

                list.forEach((item: any) => {
                    const date = new Date(item.date).toLocaleDateString('en-GB');
                    const headName = item.headName;
                    const key = `${date}_${headName}`;

                    if (!grouped[key]) {
                        grouped[key] = {
                            Date: date,
                            HeadName: headName
                        };

                        // Initialize payment columns
                        paymentModes.forEach((mode) => {
                            grouped[key][mode] = 0;
                        });
                    }

                    const mode = item.paymentMode;
                    const amount = Number(item.amount ?? 0);

                    grouped[key][mode] += amount;
                });

                // 🔹 Convert to rows
                const rows = Object.values(grouped).map((row: any, index: number) => ({
                    SLNO: index + 1,
                    ...row
                }));

                const columns = ['SLNO', 'Date', 'HeadName', ...paymentModes];

                setTableColumns(columns);
                setTableRows(rows);

                // 🔹 Sum row
                const sumRow: any = {
                    SLNO: '',
                    Date: '',
                    HeadName: 'Total'
                };

                columns.forEach((col) => {
                    if (!['SLNO', 'Date', 'HeadName'].includes(col)) {
                        sumRow[col] = 0;
                    }
                });

                rows.forEach((row: any) => {
                    columns.forEach((col) => {
                        if (!['SLNO', 'Date', 'HeadName'].includes(col)) {
                            sumRow[col] += Number(row[col] || 0);
                        }
                    });
                });

                setTableSumRow(sumRow);
            } else if (currentReportType === 'Student') {
                const list = Array.isArray(rawData?.list) ? rawData.list : [];
                toast.success('Report Data Fetched Successfully');
                const rows = list.map((item: any, index: number) => ({
                    SLNO: index + 1,
                    StudentName: item.name ?? '',
                    AdmissionNo: item.amsT_AdmNo ?? '',
                    ClassName: item.asmcL_ClassName ?? '',
                    SectionName: item.asmC_SectionName ?? '',
                    MobileNo: item.mobileNo ?? '',
                    ReceiptNo: item.fyP_Receipt_No ?? '',
                    BankName: item.fyppM_BankName ?? '',
                    ChequeNo: item.fyP_DD_Cheque_No ?? '',
                    Date: item.date ?? '',

                    Bank: Number(item.bank ?? 0),
                    Cash: Number(item.cash ?? 0),
                    Online: Number(item.online ?? 0),
                    Card: Number(item.card ?? 0),
                    RTGS: Number(item.rtgs ?? 0),
                    ECS: Number(item.ecs ?? 0),
                    Total: Number(item.total ?? 0)
                }));

                const columns = [
                    'SLNO',
                    'StudentName',
                    'AdmissionNo',
                    'ClassName',
                    'SectionName',
                    'MobileNo',
                    'ReceiptNo',
                    'BankName',
                    'ChequeNo',
                    'Date',
                    'Bank',
                    'Cash',
                    'Online',
                    'Card',
                    'RTGS',
                    'ECS',
                    'Total'
                ];

                setTableColumns(columns);
                setTableRows(rows);

                // 🔹 SUM ROW
                const sumRow: any = {
                    SLNO: '',
                    StudentName: '',
                    AdmissionNo: '',
                    ClassName: '',
                    SectionName: '',
                    MobileNo: '',
                    ReceiptNo: '',
                    BankName: '',
                    ChequeNo: '',
                    Date: 'Total'
                };

                // Initialize numeric sums
                columns.forEach((col) => {
                    if (
                        ![
                            'SLNO',
                            'StudentName',
                            'AdmissionNo',
                            'ClassName',
                            'SectionName',
                            'MobileNo',
                            'ReceiptNo',
                            'BankName',
                            'ChequeNo',
                            'Date'
                        ].includes(col)
                    ) {
                        sumRow[col] = 0;
                    }
                });

                // Calculate totals
                rows.forEach((row: any) => {
                    columns.forEach((col) => {
                        if (typeof sumRow[col] === 'number') {
                            sumRow[col] += Number(row[col] || 0);
                        }
                    });
                });

                setTableSumRow(sumRow);
            }

            setShowTable(true);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch report');
            setTableColumns([]);
            setTableRows([]);
            setShowTable(true);
        } finally {
            setLoading(false);
        }
    };

    // ===================================================
    // CANCEL BUTTON
    // ===================================================
    const handleReset = () => {
        reset();
        setSubmitClicked(false);
        setTableColumns([]);
        setTableRows([]);
        setShowTable(false);
        refetchAcademicYears();
        setRefreshAY((n) => n + 1); // ⭐ force re-run useEffect
    };

    const asmcL_Id = useWatch({ control, name: 'asmcL_Id' });
    const fromDateValue = watch('fromDate');

    // ===================================================
    // MAIN UI
    // ===================================================
    return (
        <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                {/* -------------------- FORM CONTENT (NO CHANGES) -------------------- */}
                <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                    {/* ================= LEFT BLOCK ================= */}
                    <div className='space-y-6'>
                        {/* REPORT TYPE */}
                        <div className='space-y-3 rounded-lg border p-4'>
                            {/* <Label className='font-semibold'>Report For</Label> */}
                            <div className='flex flex-wrap gap-6'>
                                {['All', 'students', 'staff', 'others'].map((val) => (
                                    <label key={val} className='flex items-center gap-2'>
                                        <input type='radio' value={val} {...register('report')} />
                                        <span className='capitalize'>{val}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* CATEGORY */}
                        <div className='rounded-lg border p-4'>
                            {/* <Label className='mb-2 block font-semibold'>
                                Report Category <span className='text-red-500'>*</span>
                            </Label> */}
                            <div className='flex gap-6'>
                                <label className='flex items-center gap-2'>
                                    <input type='radio' value='All' {...register('rpttyp')} />
                                    <span>All</span>
                                </label>
                                <label className='flex items-center gap-2'>
                                    <input type='radio' value='Individual' {...register('rpttyp')} />
                                    <span>Individual</span>
                                </label>
                            </div>
                        </div>

                        {/* DATE TYPE */}
                        <div className='space-y-2 rounded-lg border p-4'>
                            {/* <Label className='font-semibold'>Date Basis</Label> */}
                            <label className='flex items-center gap-2'>
                                <input type='radio' value='transdate' {...register('reportdate')} />
                                <span>Transaction Date</span>
                            </label>
                            <label className='flex items-center gap-2'>
                                <input type='radio' value='settdate' {...register('reportdate')} />
                                <span>Overall Settled Details</span>
                            </label>
                            <label className='flex items-center gap-2'>
                                <input type='radio' value='SettledOnline' {...register('reportdate')} />
                                <span>Online Settled Details</span>
                            </label>
                        </div>

                        {/* ACADEMIC YEAR */}
                        {/* <Controller
                            name='asmaY_Id'
                            control={control}
                            render={({ field, fieldState }) => ( */}
                        <div className='flex items-center gap-4'>
                            <Label className='w-40 font-medium'>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value?.toString()}
                                        onValueChange={(v) => {
                                            const num = Number(v);
                                            field.onChange(num);
                                            onYearChange(num);
                                        }}

                                        // value={selectedAsmayId?.toString() || ''}
                                        // onValueChange={(v) => setSelectedAsmayId(v ? Number(v) : null)}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder={loadingAcademic ? 'Loading...' : 'Select Academic Year'} />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {/* <SelectItem value='all'>All</SelectItem> */}
                                            {loadingAcademic ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : academicError ? (
                                                <SelectItem value='error' disabled>
                                                    Failed to load years
                                                </SelectItem>
                                            ) : (
                                                academicYears.map((item) => (
                                                    <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                        {item.asmaY_Year}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        {/* )}
                        /> */}

                        <div className='flex items-start gap-4'>
                            {/* LABEL */}
                            <Label className='mt-[6px] whitespace-nowrap font-medium'>
                                Group <span className='text-red-500'>*</span>
                            </Label>

                            {/* MULTI SELECT */}
                            <div className='flex-1'>
                                <FeesCustomMultiSelectBox
                                    options={feeGroups.map((g) => ({
                                        label: g.fmG_GroupName,
                                        value: String(g.fmG_Id)
                                    }))}
                                    value={selectedGroupIds.map(String)}
                                    onChange={handleGroupChange}
                                    placeholder='Select Fee Groups'
                                    height='200px'
                                    isSearchRequired
                                    isLoading={groupManualLoading}
                                />

                                {errors.groupIds && <FormError>{errors.groupIds.message}</FormError>}
                            </div>
                        </div>

                        {/* SPECIAL CHECKBOXES */}
                        <div className='space-y-3 text-sm'>
                            <div className='flex items-center gap-2'>
                                <Checkbox id='acdmyr-1' checked={chequeDate} onCheckedChange={(v) => setValue('chequeDate', !!v)} />
                                <Label htmlFor='acdmyr-1'>Cheque Date</Label>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Checkbox id='acdmyr-2' checked={acdmyr} onCheckedChange={(v) => setValue('acdmyr', !!v)} />
                                <Label htmlFor='acdmyr-2'>Add Year Wise Report</Label>
                            </div>

                            {showHeadPaymentBlock && (
                                <>
                                    <Label htmlFor='headwise-checkbox' className='flex items-center gap-2'>
                                        <Checkbox
                                            id='headwise-checkbox'
                                            checked={headwise}
                                            onCheckedChange={(v) => setValue('headwise', !!v)}
                                        />
                                        <span>Head Wise Report</span>
                                    </Label>

                                    <Label htmlFor='paymentwise-checkbox' className='flex items-center gap-2'>
                                        <Checkbox
                                            id='paymentwise-checkbox'
                                            checked={paymentwise}
                                            onCheckedChange={(v) => setValue('paymentwise', !!v)}
                                        />
                                        <span>Payment Mode</span>
                                    </Label>
                                </>
                            )}

                            {/* ERROR MESSAGE */}
                            {/* {reportdate === 'transdate' &&
                                rpttyp === 'All' &&
                                (report === 'All' || report === 'students') &&
                                !chequeDate &&
                                !acdmyr &&
                                !headwise &&
                                !paymentwise && <div className='text-red-500 text-sm'>Please select at least one checkbox</div>} */}
                        </div>
                    </div>

                    {/* ================= RIGHT BLOCK ================= */}
                    <div className='space-y-6'>
                        {/* DETAILS FOR */}
                        {reportdate === 'transdate' && rpttyp === 'Individual' && (
                            <div className='space-y-2 rounded-lg border p-4'>
                                {/* <Label className='font-semibold'>Details For</Label> */}

                                <div className='flex flex-wrap gap-4 text-sm'>
                                    {['all', 'stud', 'preadm', 'other', 'Trpt', 'thirdparty', 'multiplepaymentmode'].map((val) => (
                                        <Label key={val} className='flex items-center gap-2'>
                                            <input type='radio' value={val} {...register('Fmc_allorsudentorother')} />
                                            <span>
                                                {val === 'all'
                                                    ? 'All'
                                                    : val === 'stud'
                                                      ? 'Student'
                                                      : val === 'preadm'
                                                        ? 'Preadmission'
                                                        : val === 'other'
                                                          ? 'Others'
                                                          : val === 'Trpt'
                                                            ? 'Transport'
                                                            : val === 'thirdparty'
                                                              ? 'Third Party'
                                                              : 'Multiple Payment'}
                                            </span>
                                        </Label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PAYMENT MODE */}
                        {reportdate === 'transdate' && rpttyp === 'Individual' && (
                            <div className='space-y-2 rounded-lg border p-4'>
                                {/* <Label className='font-semibold'>Payment Mode</Label> */}

                                <div className='grid grid-cols-3 gap-3 text-sm'>
                                    {['All', 'C', 'B', 'O', 'Ecs', 'S', 'R', 'BT', 'U'].map((val) => (
                                        <label key={val} className='flex items-center gap-2'>
                                            <input type='radio' value={val} {...register('Fmc_allorcorddorop')} />
                                            <span>
                                                {val === 'All'
                                                    ? 'All'
                                                    : val === 'C'
                                                      ? 'Cash'
                                                      : val === 'B'
                                                        ? 'Cheque/DD'
                                                        : val === 'O'
                                                          ? 'Online Paid'
                                                          : val === 'Ecs'
                                                            ? 'ECS'
                                                            : val === 'S'
                                                              ? 'Card'
                                                              : val === 'R'
                                                                ? 'RTGS'
                                                                : val === 'BT'
                                                                  ? 'Bank Transfer'
                                                                  : 'UPI'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* DATES & CLASS */}
                        <div className='space-y-5 rounded-lg border p-4'>
                            {/* <div className='flex items-center gap-4'>
                                <Label className='w-32'>
                                    From Date <span className='text-red-500'>*</span>
                                </Label>
                                <input type='date'
                                 className='flex-1 rounded-md border px-3 py-2' 
                                 {...register('fromDate')} />
                                {errors.fromDate && <FormError>{errors.fromDate.message}</FormError>}
                            </div>

                           
                            <div className='flex items-center gap-4'>
                                <Label className='w-32'>
                                    To Date <span className='text-red-500'>*</span>
                                </Label>
                                <input type='date' className='flex-1 rounded-md border px-3 py-2' {...register('toDate')} />
                                {errors.toDate && <FormError>{errors.toDate.message}</FormError>}
                            </div> */}

                            {/* FROM DATE */}
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center gap-4'>
                                    <Label className='w-32'>
                                        From Date <span className='text-red-500'>*</span>
                                    </Label>

                                    {/* <input
                                        type='date'
                                        className='flex-1 rounded-md border px-3 py-2'
                                        onKeyDown={(e) => e.preventDefault()} // 🔒 blocks typing
                                        {...register('fromDate')}
                                    /> */}

                                    <input
                                        type='date'
                                        className='flex-1 rounded-md border px-3 py-2'
                                        onKeyDown={(e) => e.preventDefault()} // 🔒 blocks typing
                                        {...register('fromDate', {
                                            required: 'From Date is required',
                                            onChange: (e) => {
                                                const newFromDate = e.target.value;
                                                const currentToDate = watch('toDate');

                                                // Clear toDate if it's before new fromDate
                                                if (currentToDate && newFromDate > currentToDate) {
                                                    setValue('toDate', '');
                                                }
                                            }
                                        })}
                                    />
                                </div>

                                {errors.fromDate && <FormError className='ml-32'>{errors.fromDate.message}</FormError>}
                            </div>

                            {/* TO DATE */}
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center gap-4'>
                                    <Label className='w-32'>
                                        To Date <span className='text-red-500'>*</span>
                                    </Label>
                                    {/* 
                                    <input
                                        type='date'
                                        className='flex-1 rounded-md border px-3 py-2'
                                        onKeyDown={(e) => e.preventDefault()} // 🔒 blocks typing
                                        {...register('toDate')}
                                    /> */}

                                    <input
                                        type='date'
                                        className='flex-1 rounded-md border px-3 py-2'
                                        onKeyDown={(e) => e.preventDefault()} // 🔒 blocks typing
                                        {...register('toDate', {
                                            required: 'To Date is required',
                                            validate: (value) => {
                                                if (!fromDateValue) return 'Please select From Date first';
                                                return true;
                                            }
                                        })}
                                        min={fromDateValue || ''} // 👈 THIS BLOCKS DATES BEFORE FROM DATE
                                        disabled={!fromDateValue} // 👈 OPTIONAL: Disable until fromDate is selected
                                    />
                                </div>

                                {errors.toDate && <FormError className='ml-32'>{errors.toDate.message}</FormError>}
                            </div>

                            {/* CLASS */}

                            {rpttyp === 'Individual' && (
                                <div className='flex items-center gap-4'>
                                    {/* Checkbox + Label */}
                                    <Label className='flex w-40 items-center gap-2'>
                                        <Checkbox
                                            checked={enableAllClasses}
                                            onCheckedChange={(checked) => {
                                                const v = !!checked;
                                                setValue('enableAllClasses', v);

                                                // clear value when disabled
                                                if (!v) {
                                                    setValue('asmcL_Id', undefined);
                                                }
                                            }}
                                        />
                                        <span>Class {!isClassRequired && <span className='text-red-500'>*</span>}</span>
                                    </Label>

                                    {/* Dropdown controlled by checkbox */}
                                    <div className='flex-1'>
                                        <Select
                                            disabled={!enableAllClasses} // <-- enable only when checkbox checked
                                            onValueChange={(v) => setValue('asmcL_Id', Number(v))}
                                            value={enableAllClasses ? asmcL_Id?.toString() : undefined}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select' />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {classes.map((c) => (
                                                    <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>
                                                        {c.asmcL_ClassName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===================== BUTTONS ===================== */}
                <div className='flex justify-center gap-4 border-t pt-6'>
                    <Button type='submit' disabled={isSubmitting} className='min-w-32'>
                        {isSubmitting ? 'Generating...' : 'Report'}
                    </Button>

                    <Button type='button' variant='outline' onClick={handleReset}>
                        Cancel
                    </Button>
                </div>
            </form>
            <div className='my-6 border-gray-300 border-t' />

            {!loading && tableRows.length > 0 && (
                <CollapsibleSection defaultOpen={true}>
                    <div className='mt-10'>
                        {/* 🔹 REPORT HEADER */}
                        <div className='mb-6 text-center'>
                            <h2 className='font-bold text-2xl text-primary'>Daily Fee Collection Report</h2>
                            {/* <div className="mt-1 text-sm text-gray-600">
                From {formatDate(fromDate)} To {formatDate(toDate)}
            </div> */}
                        </div>
                        <div className='my-6 border-gray-300 border-t' />

                        <div className='flex items-center justify-between border-b bg-muted/40 px-8 py-4'>
                            <div className='flex gap-3'>
                                <Button variant='outline' onClick={handlePrint}>
                                    🖨 Print
                                </Button>

                                <Button variant='outline' onClick={handleExportExcel}>
                                    📊 Export Excel
                                </Button>
                            </div>
                        </div>

                        {/* 🔹 TABLE */}
                        <div className='overflow-auto rounded-md border'>
                            <table className='w-full border-collapse text-sm'>
                                <thead className='bg-primary text-white'>
                                    <tr>
                                        {tableColumns.map((col) => (
                                            <th key={col} className='border px-3 py-2 text-left'>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {tableRows.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {tableColumns.map((col) => (
                                                <td key={col} className='border px-3 py-2 text-right'>
                                                    {row[col]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                    {/* 🔹 SUM ROW */}
                                    {tableSumRow && (
                                        <tr className='bg-gray-100 font-semibold'>
                                            {tableColumns.map((col) => (
                                                <td key={col} className='border px-3 py-2 text-right'>
                                                    {col === 'SLNO' ? '' : col === 'Date' ? 'Total' : `Sum: ${tableSumRow[col] ?? 0}`}
                                                </td>
                                            ))}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}
