'use client';

import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import {
    useFeeBusRouteDefaulterreport,
    useFeeClassListDefaulterreport,
    useFeeCustomGroupDefaulterreport,
    useFeeGroupDefaulterreport,
    useFeeSectionListDefaulterreport,
    useFeeTermDropDownDataForReports,
    useFeeTransInstallmentYearlyfeecollectionreport
} from '@/hooks/fees/useReports';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeMasterConfiguration } from '@/hooks/fees/useTrasactions';
import { yearlyFeeCollectionSchema } from '@/schemas/fees/reports';
import { getFeeYearlyCollectionReport } from '@/server/fees/reports/fee_yearlyCollectionReport';
import type {
    IFeeBusRouteDropdownList,
    IFeeClassDropdownList,
    IFeeCustomGroupDropdownList,
    IFeeGroupDropdownList,
    IFeeSectionDropdownList,
    IFeeTermDropdownList,
    IFeeTrasactionInstallmentDropdownList,
    IFeeYearlyCollectionReport
} from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import {
    exportToExcelforCategoryWise,
    exportToExcelforClassInstallmentWiseConslidated,
    exportToExcelforClassSectionInstallmentWiseConslidated,
    exportToExcelforClassSectionWiseTotalPaidCount,
    exportToExcelforFeeClassWise,
    exportToExcelforFeeGroupWise,
    exportToExcelforFeeHeadWise,
    exportToExcelforInstallmentWise,
    exportToExcelforStudentWise,
    exportToExcelforStudentWiseTotalPaidCount,
    exportToExcelforTermWise,
    printTable,
    printTermWiseTable
} from './_components/columns';

const Checkbox = ({ checked, indeterminate, onCheckedChange, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);

    return <BaseCheckbox ref={ref} checked={checked} onCheckedChange={onCheckedChange} {...props} />;
};

type FormFields = z.infer<typeof yearlyFeeCollectionSchema>;

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

export default function FeeYearlyCollectionReport() {
    // ---------------------------- FORM ----------------------------
    const {
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(yearlyFeeCollectionSchema),
        mode: 'all'
        // defaultValues: {
        //     report: 'students',
        //     rpttyp: 'Individual',
        //     reportdate: 'transdate',
        //     asmaY_Id: 0,
        //     groupIds: [],
        //     chequeDate: false,
        //     acdmyr: false,
        //     headwise: false,
        //     paymentwise: false,
        //     fromDate: today,
        //     toDate: today,
        //     enableAllClasses: false,
        //     Fmc_allorsudentorother: 'All',
        //     Fmc_allorcorddorop: 'All'
        // }
    });

    const [filters, setFilters] = useState({
        userType: 'Students' as 'Students' | 'Staff' | 'Others',
        viewMode: 'year' as 'year' | 'date',

        //breakdown: 'Fee Group Wise',
        breakdown: 'FGW',
        academicYearId: '',
        classId: 0,
        sectionId: 0,
        includeClassSection: false,
        status: {
            active: true,
            deactive: false,
            left: false,
            balance: false
        },
        customGroupIds: [] as number[],
        feeGroupIds: [] as number[],
        termIds: [] as number[],
        installmentIds: [] as number[],
        busRouteIds: [] as number[],
        formatI: false,
        dueDate: new Date(),
        fromDate: new Date(),
        toDate: new Date(),
        dueDateType: 'Due Date' as 'Due Date' | 'Till Due Date',
        bulkDownload: false,
        dateFilter: '1' as '1' | '2' | '3' | '4'
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
    const [classes, setClasses] = useState<IFeeClassDropdownList[]>([]);
    const [sections, setSections] = useState<IFeeSectionDropdownList[]>([]);
    const [feeGroups, setFeeGroups] = useState<IFeeGroupDropdownList[]>([]);
    const [feeTerms, setFeeTerms] = useState<IFeeTermDropdownList[]>([]);
    const [feeBusRoutes, setFeeBusRoutes] = useState<IFeeBusRouteDropdownList[]>([]);
    const [customGroups, setCustomGroups] = useState<IFeeCustomGroupDropdownList[]>([]);

    // const [reportData, setReportData] = useState<IFeeYearlyCollectionReportRow[]>([]);
    const [reportData, setReportData] = useState<IFeeYearlyCollectionReport[]>([]);

    const [reportLoading, setReportLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    //const [feeInstallments, setfeeInstallments] = useState<IFeeInstallmentDropdownList[]>([]);
    const [feeInstallments, setfeeInstallments] = useState<IFeeTrasactionInstallmentDropdownList[]>([]);

    const [wiseType, setWiseType] = useState<'Yearly Wise' | 'Date Wise'>('Date Wise');

    // Hooks
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();
    const { data: classListResponse, isLoading: loadingClasses, error: classListError } = useFeeClassListDefaulterreport();
    const {
        data: sectionListResponse,
        isLoading: loadingSections,
        error: sectionListError,
        refetch: refetchSections
    } = useFeeSectionListDefaulterreport();
    const { data: feegroupData, isLoading: loadingfeegroup, error: feegroupError } = useFeeGroupDefaulterreport();
    //const { data: feetermData, isLoading: loadingfeeterm, error: feetermError } = useFeeTermDefaulterreport();

    const { data: feetermData, isLoading: loadingfeeterm, error: feetermError } = useFeeTermDropDownDataForReports();

    const { data: busRouteResponse, isLoading: loadingBusRoutes, error: busRouteError } = useFeeBusRouteDefaulterreport();
    const { data: customGroupResponse, isLoading: loadingCustomGroup, error: customGroupError } = useFeeCustomGroupDefaulterreport();

    // const {
    //     data: feeInstallmentData,
    //     isLoading: feeInstallmentLoading,
    //     error: feeInstallmentError
    // } = useFeeInstallmentYearlyfeecollectionreport();

    const {
        data: feeInstallmentData,
        isLoading: feeInstallmentLoading,
        error: feeInstallmentError
    } = useFeeTransInstallmentYearlyfeecollectionreport();

    const { data: masterConfiguration } = useFeeMasterConfiguration();

    const config = masterConfiguration?.data?.[0]?.fmC_GroupOrTermFlg ?? 'T';

    // Load data effects (unchanged)

    useEffect(() => {
        setReportData([]);
        setShowReport(false);
    }, [
        filters.breakdown,
        filters.classId,
        filters.sectionId,
        filters.academicYearId,
        filters.customGroupIds,
        filters.termIds,
        filters.installmentIds,
        filters.feeGroupIds
    ]);

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
            // formatted.sort((a, b) => (b.asmaY_Order || 0) - (a.asmaY_Order || 0));
            setAcademicYears(formatted);
        }
    }, [academicData, academicError]);

    useEffect(() => {
        if (classListError) {
            toast.error(classListError?.message || 'Failed to load classes');
            setClasses([]);
            return;
        }
        if (classListResponse?.data && Array.isArray(classListResponse.data)) {
            setClasses(classListResponse.data);
        }
    }, [classListResponse, classListError]);

    useEffect(() => {
        if (filters.classId > 0) refetchSections();
        else {
            setSections([]);
            setFilters((prev) => ({ ...prev, sectionId: 0 }));
        }
    }, [filters.classId, refetchSections]);

    useEffect(() => {
        if (sectionListError) {
            toast.error(sectionListError?.message || 'Failed to load sections');
            setSections([]);
            return;
        }
        if (sectionListResponse?.data && Array.isArray(sectionListResponse.data)) {
            setSections(sectionListResponse.data);
        }
    }, [sectionListResponse, sectionListError]);

    useEffect(() => {
        if (feegroupError) toast.error(feegroupError?.message || 'Failed to load fee groups');
        else if (feegroupData?.data) setFeeGroups(feegroupData.data);
    }, [feegroupData, feegroupError]);

    useEffect(() => {
        if (feetermError) toast.error(feetermError?.message || 'Failed to load terms');
        else if (feetermData?.data) setFeeTerms(feetermData.data);
    }, [feetermData, feetermError]);

    useEffect(() => {
        if (feeInstallmentError) toast.error(feeInstallmentError?.message || 'Failed to load fee installments');
        else if (feeInstallmentData?.data) setfeeInstallments(feeInstallmentData.data);
    }, [feeInstallmentData, feeInstallmentError]);

    useEffect(() => {
        if (busRouteError) toast.error(busRouteError?.message || 'Failed to load bus routes');
        else if (busRouteResponse?.data) setFeeBusRoutes(busRouteResponse.data as IFeeBusRouteDropdownList[]);
    }, [busRouteResponse, busRouteError]);

    useEffect(() => {
        if (customGroupError) toast.error(customGroupError?.message || 'Failed to load custom groups');
        else if (customGroupResponse?.data) setCustomGroups(customGroupResponse.data);
    }, [customGroupResponse, customGroupError]);

    useEffect(() => {
        if (customGroups.length > 0 && filters.customGroupIds.length === 0) {
            setFilters((prev) => ({
                ...prev,
                customGroupIds: customGroups.map((g) => g.fmgG_Id)
            }));
        }
    }, [customGroups]);

    // Toggle handlers
    const toggleCustomGroup = (id: number) =>
        setFilters((prev) => ({
            ...prev,
            customGroupIds: prev.customGroupIds.includes(id) ? prev.customGroupIds.filter((x) => x !== id) : [...prev.customGroupIds, id]
        }));

    const toggleFeeGroup = (id: number) =>
        setFilters((prev) => ({
            ...prev,
            feeGroupIds: prev.feeGroupIds.includes(id) ? prev.feeGroupIds.filter((x) => x !== id) : [...prev.feeGroupIds, id]
        }));

    const toggleTerm = (id: number) =>
        setFilters((prev) => ({
            ...prev,
            termIds: prev.termIds.includes(id) ? prev.termIds.filter((x) => x !== id) : [...prev.termIds, id]
        }));

    const toggleInstallment = (id: number) =>
        setFilters((prev) => ({
            ...prev,
            installmentIds: prev.installmentIds.includes(id) ? prev.installmentIds.filter((x) => x !== id) : [...prev.installmentIds, id]
        }));

    const toggleBusRoute = (id: number) =>
        setFilters((prev) => ({
            ...prev,
            busRouteIds: prev.busRouteIds.includes(id) ? prev.busRouteIds.filter((x) => x !== id) : [...prev.busRouteIds, id]
        }));

    // const selectAllCustomGroups = (checked: boolean) => {
    //     setFilters((prev) => ({ ...prev, customGroupIds: checked ? customGroups.map((g) => g.fmgG_Id) : [] }));

    // };

    const selectAllCustomGroups = (checked: boolean) => {
        setFilters((prev) => ({
            ...prev,
            customGroupIds: checked ? customGroups.map((g) => g.fmgG_Id) : []
        }));
    };

    const selectAllFeeGroups = (checked: boolean) => {
        setFilters((prev) => ({
            ...prev,
            feeGroupIds: checked ? feeGroups.map((g) => g.fmG_Id) : []
        }));
    };

    const selectAllTerms = (checked: boolean) => {
        setFilters((prev) => ({
            ...prev,
            termIds: checked ? feeTerms.map((t) => t.fmT_Id) : []
        }));
    };

    const selectAllInstallments = (checked: boolean) => {
        setFilters((prev) => ({
            ...prev,
            installmentIds: checked ? feeInstallments.map((t) => t.ftI_Id) : []
        }));
    };

    const selectAllBusRoutes = (checked: boolean) => {
        setFilters((prev) => ({
            ...prev,
            busRouteIds: checked ? feeBusRoutes.map((r) => r.trmR_Id) : []
        }));
    };

    const toggleStatus = (status: 'active' | 'deactive' | 'left' | 'balance') => {
        setFilters((prev) => ({
            ...prev,
            status: { ...prev.status, [status]: !prev.status[status] }
        }));
    };

    const selectedTerms = feeTerms.filter((term) => filters.termIds.includes(term.fmT_Id));

    const handleReset = () => {
        reset();
        window.location.reload();
    };

    //   const totalRow = createTotalRow(
    //     reportData.filter(
    //       (r): r is IFeeYearlyCollectionReportRow => !("__isTotal" in r),
    //     ),
    //   );

    //   const tableData: FeeYearlyTableRow[] = [
    //     ...reportData.filter((r) => !("__isTotal" in r)),
    //     totalRow,
    //   ];

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setReportData([]);
        setSelectedIds([]);
        if (!filters.academicYearId) return toast.error('Please select an Academic Year');
        if (filters.feeGroupIds.length === 0) return toast.error('Please select at least one Fee Group');
        if (filters.breakdown !== 'INMW') {
            if (filters.termIds.length === 0) return toast.error('Please select at least one Term');
        }
        if (filters.breakdown === 'INMW') {
            if (filters.installmentIds.length === 0) return toast.error('Please select at least one Installment');
        }

        if (
            filters.breakdown === 'FSW' ||
            filters.breakdown === 'SWTPC' ||
            filters.breakdown === 'STRMW' ||
            filters.breakdown === 'CWTPC'
        ) {
            if (filters.classId === 0) return toast.error('Please select Class');

            if (filters.sectionId === 0) return toast.error('Please select Section');
        }

        if (filters.viewMode === 'date') {
            if (data.fromDate === null || data.fromDate === '') {
                toast.error('Please Enter FromDate');
            } else if (data.toDate === null || data.toDate === '') {
                toast.error('Please Enter ToDate');
            }
        }

        setReportLoading(true);
        setShowReport(false);

        const today = new Date();

        try {
            const payload = {
                FMG_Ids: filters.feeGroupIds,
                FTI_ids: filters.breakdown === 'INMW' ? filters.installmentIds : filters.termIds,
                FMT_Ids:
                    filters.breakdown === 'FGW' ||
                    filters.breakdown === 'FHW' ||
                    filters.breakdown === 'FSW' ||
                    filters.breakdown === 'TRMW' ||
                    filters.breakdown === 'STRMW' ||
                    filters.breakdown === 'CW' ||
                    filters.breakdown === 'CTW' ||
                    filters.breakdown === 'CTC' ||
                    filters.breakdown === 'SWTPC' ||
                    filters.breakdown === 'CWTPC' ||
                    filters.breakdown === 'FPW'
                        ? filters.termIds
                        : [],
                // FMG_Ids: [385, 385, 377, 378],
                //FTI_ids: [83],

                // Academic Year
                ASMAY_Id: Number(filters.academicYearId),

                // Year / Date wise
                reporttype: filters.viewMode, // "year" | "date"

                // Breakdown radio value
                radioval: filters.breakdown, // e.g. "INMW"

                // Status flags (1 / 0)
                active: filters.status.active ? 1 : 0,
                deactive: filters.status.deactive ? 1 : 0,
                left: filters.status.left ? 1 : 0,
                //  From_Date: '2025-12-18',
                //  To_Date: '2025-12-18',

                // // Date filters
                // From_Date:
                //     filters.viewMode === 'date'
                //         ? format(fromDate ?? today, 'yyyy-MM-dd')
                //         : null,

                // To_Date:
                //     filters.viewMode === 'date'
                //         ? format(toDate ?? today, 'yyyy-MM-dd')
                //         : null,

                From_Date: filters.viewMode === 'date' ? format(filters.fromDate, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd'),

                To_Date: filters.viewMode === 'date' ? format(filters.toDate, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd'),

                // Term Group (Hardcoded / configurable)
                term_group: config.toString(),
                //filters.breakdown === 'INMW' ? 'I' : 'T',

                // Category / Class / Section
                FMCC_Id: 1, // static (change if required)
                ASMCL_Id: filters.classId ?? 0,
                AMSC_Id: filters.sectionId ?? 0
            };
            console.log('payload', payload);
            const response = await getFeeYearlyCollectionReport(payload);
            const apiList = response?.data ?? [];
            //   const tableData = mapYearlyCollectionReport(
            //     apiList,
            //     filters.breakdown as BreakdownType,
            //   );
            const mapApiToReportRows = (apiData: any[]): IFeeYearlyCollectionReport[] => {
                return apiData.map((item, index) => ({
                    id: index + 1,
                    fmg_groupname: item.fmg_groupname,
                    fmh_feename: item.fmh_feename,
                    adjusted: item.adjusted,
                    balance: item.balance,
                    concession: item.concession,
                    excess: item.excess,
                    fine: item.fine,
                    fss_paidamount: item.fss_paidamount,
                    rebate: item.rebate,
                    runningexcess: item.runningexcess,
                    totalpayable: item.totalpayable,
                    waived: item.waived,
                    amst_admno: item.amst_admno,
                    asmcl_classname: item.asmcl_classname,
                    openingbalance: item.openingbalance,
                    studentname: item.studentname,
                    mobileNo: item.mobileNo,
                    asmcl_id: item.asmcl_id,
                    asms_id: item.asms_id,
                    fmh_id: item.fmh_id,
                    fmt_id: item.fmt_id,
                    fmt_name: item.fmt_name,
                    arrear: item.arrear,
                    paid: item.paid,
                    payable: item.payable,
                    charges: item.charges,
                    amsT_AdmNo: item.amsT_AdmNo,
                    amsT_Id: item.amsT_Id,
                    asmcL_ClassName: item.asmcL_ClassName,
                    charge: item.charge,
                    ftI_Name: item.ftI_Name,
                    ftI_Id: item.ftI_Id,
                    studentName: item.studentName,
                    fmt_Id: item.fmt_Id,
                    fmt_Name: item.fmt_Name,
                    fma_Id: item.fma_Id,
                    amst_FatherName: item.amst_FatherName,
                    amst_FatherMobileNo: item.amst_FatherMobileNo,
                    cdNetAmount: item.cdNetAmount,
                    cdPaidAmount: item.cdPaidAmount,
                    cdBalanceAmount: item.cdBalanceAmount,
                    amst_AdmNo: item.amst_AdmNo,
                    amst_Id: item.amst_Id,
                    asmcl_ClassName: item.asmcl_ClassName,
                    refund: item.refund,
                    fmcc_classcategoryname: item.fmcc_classcategoryname,
                    bybank: item.bybank,
                    bycash: item.bycash,
                    byonline: item.byonline,
                    bycard: item.bycard,
                    byecs: item.byecs,
                    byrtgs: item.byrtgs,
                    asmc_sectionname: item.asmc_sectionname,
                    totalcharges: item.totalcharges,
                    totalbalance: item.totalbalance,
                    totalpaid: item.totalpaid,
                    totalconcession: item.totalconcession,
                    totalwaivedoff: item.totalwaivedoff,
                    totalrefund: item.totalrefund,
                    adjustment: item.adjustment,
                    amst_mobileno: item.amst_mobileno
                }));
            };
            const data = mapApiToReportRows(apiList);
            //   console.log("data", data);
            setReportData(data);

            if (apiList.length === 0) {
                setShowReport(false);
                toast.info('No records found for selected criteria');
                return;
            }
            setShowReport(true);

            //   toast.success(`Report generated (${tableData.length} records)`);

            toast.success('Report generated successfully');
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to generate report');
        } finally {
            setReportLoading(false);
        }
    };

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleAllstudents = () => {
        if (selectedIds.length === reportData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(reportData.map((r) => r.id));
        }
    };
    const toggleRow = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };
    //   const handlePrint = () => {
    //     const rows = reportData.filter(
    //       (r): r is IFeeYearlyCollectionReportRow => !("__isTotal" in r),
    //     );

    //     const totalRow = reportData.find(
    //       (r): r is IFeeYearlyCollectionReportRow => "__isTotal" in r,
    //     );

    //     printTableDynamic(filters.breakdown as BreakdownType, rows, totalRow);
    //   };

    //   const handleExportExcel = () => {
    //     exportToExcelDynamic(
    //       filters.breakdown as BreakdownType,
    //       reportData,
    //       "Yearly_Fee_Collection_Report",
    //     );
    //   };

    const handleExportExcelforFeeGroupWise = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforFeeGroupWise(rowsToExport, 'yearly_Fee_Collection_Report');
    };
    const handleExportExcelforFeeHeadWise = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforFeeHeadWise(rowsToExport, 'yearly_Fee_Collection_Report');
    };

    const handleExportExcelforFeeClassWise = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforFeeClassWise(rowsToExport, 'yearly_Fee_Collection_Report');
    };

    const handleExportExcelforStudentWise = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforStudentWise(rowsToExport, 'yearly_Fee_Collection_Report');
    };

    const handleExportExcelforTermWise = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforTermWise(rowsToExport, 'yearly_Fee_Collection_Report', selectedTerms);
    };

    const handleExportExcelforInstallmentWise = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforInstallmentWise(rowsToExport, 'yearly_Fee_Collection_Report');
    };

    const handleExportExcelforCategoryWise = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforCategoryWise(rowsToExport, 'yearly_Fee_Collection_Report');
    };

    const handleExportExcelforClassSectionInstallmentWiseConslidated = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforClassSectionInstallmentWiseConslidated(rowsToExport, 'yearly_Fee_Collection_Report');
    };
    const handleExportExcelforClassInstallmentWiseConslidated = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforClassInstallmentWiseConslidated(rowsToExport, 'yearly_Fee_Collection_Report');
    };
    const handleExportExcelforStudentWiseTotalPaidCount = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforStudentWiseTotalPaidCount(rowsToExport, 'yearly_Fee_Collection_Report');
    };

    const handleExportExcelforClassSectionWiseTotalPaidCount = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforClassSectionWiseTotalPaidCount(rowsToExport, 'yearly_Fee_Collection_Report');
    };

    const handlePrintforFeeGroupWise = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl.No',
            'Fee Group',
            'Paid Amount',
            'Balance',
            'Concession',
            'Waived',
            'Rebate',
            'Fine',
            'Total Payable',
            'Adjusted',
            'Excess',
            'Running Excess'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl.No': index + 1,
            'Fee Group': row.fmg_groupname,
            'Paid Amount': `₹${(row.fss_paidamount || 0).toLocaleString('en-IN')}`,
            Balance: `₹${(row.balance || 0).toLocaleString('en-IN')}`,
            Concession: `₹${(row.concession || 0).toLocaleString('en-IN')}`,
            Waived: `₹${(row.waived || 0).toLocaleString('en-IN')}`,
            Rebate: `₹${(row.rebate || 0).toLocaleString('en-IN')}`,
            Fine: `₹${(row.fine || 0).toLocaleString('en-IN')}`,
            'Total Payable': `₹${(row.totalpayable || 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${(row.adjusted || 0).toLocaleString('en-IN')}`,
            Excess: `₹${(row.excess || 0).toLocaleString('en-IN')}`,
            'Running Excess': `₹${(row.runningexcess || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl.No': '',
            'Fee Group': 'TOTAL',
            'Paid Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.fss_paidamount || 0), 0).toLocaleString('en-IN')}`,
            Balance: `₹${rowsToPrint.reduce((sum, r) => sum + (r.balance || 0), 0).toLocaleString('en-IN')}`,
            Concession: `₹${rowsToPrint.reduce((sum, r) => sum + (r.concession || 0), 0).toLocaleString('en-IN')}`,
            Waived: `₹${rowsToPrint.reduce((sum, r) => sum + (r.waived || 0), 0).toLocaleString('en-IN')}`,
            Rebate: `₹${rowsToPrint.reduce((sum, r) => sum + (r.rebate || 0), 0).toLocaleString('en-IN')}`,
            Fine: `₹${rowsToPrint.reduce((sum, r) => sum + (r.fine || 0), 0).toLocaleString('en-IN')}`,
            'Total Payable': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalpayable || 0), 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${rowsToPrint.reduce((sum, r) => sum + (r.adjusted || 0), 0).toLocaleString('en-IN')}`,
            Excess: `₹${rowsToPrint.reduce((sum, r) => sum + (r.excess || 0), 0).toLocaleString('en-IN')}`,
            'Running Excess': `₹${rowsToPrint.reduce((sum, r) => sum + (r.runningexcess || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforFeeHeadWise = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl.No',
            'Fee Head',
            'Paid Amount',
            'Balance',
            'Concession',
            'Waived',
            'Rebate',
            'Fine',
            'Total Payable',
            'Adjusted',
            'Excess',
            'Running Excess'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl.No': index + 1,
            'Fee Head': row.fmh_feename,
            'Paid Amount': `₹${(row.fss_paidamount || 0).toLocaleString('en-IN')}`,
            Balance: `₹${(row.balance || 0).toLocaleString('en-IN')}`,
            Concession: `₹${(row.concession || 0).toLocaleString('en-IN')}`,
            Waived: `₹${(row.waived || 0).toLocaleString('en-IN')}`,
            Rebate: `₹${(row.rebate || 0).toLocaleString('en-IN')}`,
            Fine: `₹${(row.fine || 0).toLocaleString('en-IN')}`,
            'Total Payable': `₹${(row.totalpayable || 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${(row.adjusted || 0).toLocaleString('en-IN')}`,
            Excess: `₹${(row.excess || 0).toLocaleString('en-IN')}`,
            'Running Excess': `₹${(row.runningexcess || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl.No': '',
            'Fee Head': 'TOTAL',
            'Paid Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.fss_paidamount || 0), 0).toLocaleString('en-IN')}`,
            Balance: `₹${rowsToPrint.reduce((sum, r) => sum + (r.balance || 0), 0).toLocaleString('en-IN')}`,
            Concession: `₹${rowsToPrint.reduce((sum, r) => sum + (r.concession || 0), 0).toLocaleString('en-IN')}`,
            Waived: `₹${rowsToPrint.reduce((sum, r) => sum + (r.waived || 0), 0).toLocaleString('en-IN')}`,
            Rebate: `₹${rowsToPrint.reduce((sum, r) => sum + (r.rebate || 0), 0).toLocaleString('en-IN')}`,
            Fine: `₹${rowsToPrint.reduce((sum, r) => sum + (r.fine || 0), 0).toLocaleString('en-IN')}`,
            'Total Payable': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalpayable || 0), 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${rowsToPrint.reduce((sum, r) => sum + (r.adjusted || 0), 0).toLocaleString('en-IN')}`,
            Excess: `₹${rowsToPrint.reduce((sum, r) => sum + (r.excess || 0), 0).toLocaleString('en-IN')}`,
            'Running Excess': `₹${rowsToPrint.reduce((sum, r) => sum + (r.runningexcess || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforFeeClassWise = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl No',
            'Class Name',
            'Total Charges',
            'Paid Amount',
            'Balance',
            'Concession',
            'Fine',
            'Rebate',
            'Waived',
            'Excess',
            'Opening Balance'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl No': index + 1,
            'Class Name': row.asmcl_classname || '',
            'Total Charges': `₹${(row.charges || 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${(row.fss_paidamount || 0).toLocaleString('en-IN')}`,
            Balance: `₹${(row.balance || 0).toLocaleString('en-IN')}`,
            Concession: `₹${(row.concession || 0).toLocaleString('en-IN')}`,
            Fine: `₹${(row.fine || 0).toLocaleString('en-IN')}`,
            Rebate: `₹${(row.rebate || 0).toLocaleString('en-IN')}`,
            Waived: `₹${(row.waived || 0).toLocaleString('en-IN')}`,
            Excess: `₹${(row.excess || 0).toLocaleString('en-IN')}`,
            'Opening Balance': `₹${(row.openingbalance || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl No': '',
            'Class Name': 'TOTAL',
            'Total Charges': '',
            'Paid Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.fss_paidamount || 0), 0).toLocaleString('en-IN')}`,
            Balance: `₹${rowsToPrint.reduce((sum, r) => sum + (r.balance || 0), 0).toLocaleString('en-IN')}`,
            Concession: `₹${rowsToPrint.reduce((sum, r) => sum + (r.concession || 0), 0).toLocaleString('en-IN')}`,
            Fine: `₹${rowsToPrint.reduce((sum, r) => sum + (r.fine || 0), 0).toLocaleString('en-IN')}`,
            Rebate: `₹${rowsToPrint.reduce((sum, r) => sum + (r.rebate || 0), 0).toLocaleString('en-IN')}`,
            Waived: `₹${rowsToPrint.reduce((sum, r) => sum + (r.waived || 0), 0).toLocaleString('en-IN')}`,
            Excess: `₹${rowsToPrint.reduce((sum, r) => sum + (r.excess || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforStudentWise = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl No',
            'Student Name',
            'Admission No',
            'Class Name',
            'Mobile No',
            'Total Payable',
            'Paid Amount',
            'Balance',
            'Concession',
            'Fine',
            'Rebate',
            'Waived',
            'Adjusted',
            'Opening Balance',
            'Excess'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl No': index + 1,
            'Student Name': row.studentname || '',
            'Admission No': row.amst_admno || '',
            'Class Name': row.asmcl_classname || '',
            'Mobile No': row.mobileNo || '',
            'Total Payable': `₹${(row.totalpayable || 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${(row.fss_paidamount || 0).toLocaleString('en-IN')}`,
            Balance: `₹${(row.balance || 0).toLocaleString('en-IN')}`,
            Concession: `₹${(row.concession || 0).toLocaleString('en-IN')}`,
            Fine: `₹${(row.fine || 0).toLocaleString('en-IN')}`,
            Rebate: `₹${(row.rebate || 0).toLocaleString('en-IN')}`,
            Waived: `₹${(row.waived || 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${(row.adjusted || 0).toLocaleString('en-IN')}`,
            'Opening Balance': `₹${(row.openingbalance || 0).toLocaleString('en-IN')}`,
            Excess: `₹${(row.excess || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl No': '',
            'Student Name': 'TOTAL',
            'Admission No': '',
            'Class Name': '',
            'Mobile No': '',
            'Total Payable': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalpayable || 0), 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.fss_paidamount || 0), 0).toLocaleString('en-IN')}`,
            Balance: `₹${rowsToPrint.reduce((sum, r) => sum + (r.balance || 0), 0).toLocaleString('en-IN')}`,
            Concession: `₹${rowsToPrint.reduce((sum, r) => sum + (r.concession || 0), 0).toLocaleString('en-IN')}`,
            Fine: `₹${rowsToPrint.reduce((sum, r) => sum + (r.fine || 0), 0).toLocaleString('en-IN')}`,
            Rebate: `₹${rowsToPrint.reduce((sum, r) => sum + (r.rebate || 0), 0).toLocaleString('en-IN')}`,
            Waived: `₹${rowsToPrint.reduce((sum, r) => sum + (r.waived || 0), 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${rowsToPrint.reduce((sum, r) => sum + (r.adjusted || 0), 0).toLocaleString('en-IN')}`,
            'Opening Balance': `₹${rowsToPrint.reduce((sum, r) => sum + (r.openingbalance || 0), 0).toLocaleString('en-IN')}`,
            Excess: `₹${rowsToPrint.reduce((sum, r) => sum + (r.excess || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforTermWise = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        // Debug: Log what we're sending to print
        // console.log('Rows to print:', rowsToPrint);
        // console.log('First row data:', rowsToPrint[0]);
        // console.log('Available properties in first row:', rowsToPrint[0] ? Object.keys(rowsToPrint[0]) : []);
        // console.log('Selected terms:', selectedTerms);
        console.log('rowsToPrint[0].fss_paidamount:', rowsToPrint[0].paid);

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data to print');
            return;
        }

        printTermWiseTable(rowsToPrint, selectedTerms);
    };

    const handlePrintforInstallmentWise = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl No',
            'Student Name',
            'Class/Section',
            'Admission No',
            'Installment name',
            'Total Payable',
            'Paid Amount',
            'Balance',
            'Concession',
            'Arrear',
            'Excess',
            'Charge',
            'Adjustment'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl No': index + 1,
            'Student Name': row.studentName || '',
            'Class/Section': row.asmcL_ClassName || '',
            'Admission No': row.amsT_AdmNo || '',
            'Installment name': row.ftI_Name || '',
            'Total Payable': `₹${(row.payable || 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${(row.fss_paidamount || 0).toLocaleString('en-IN')}`,
            Balance: `₹${(row.balance || 0).toLocaleString('en-IN')}`,
            Concession: `₹${(row.concession || 0).toLocaleString('en-IN')}`,
            Arrear: `₹${(row.arrear || 0).toLocaleString('en-IN')}`,
            Excess: `₹${(row.excess || 0).toLocaleString('en-IN')}`,
            Charge: `₹${(row.charge || 0).toLocaleString('en-IN')}`,
            Adjustment: `₹${(row.adjusted || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl No': '',
            'Student Name': 'TOTAL',
            'Class/Section': '',
            'Admission No': '',
            'Installment name': '',
            'Total Payable': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalpayable || 0), 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.fss_paidamount || 0), 0).toLocaleString('en-IN')}`,
            Balance: `₹${rowsToPrint.reduce((sum, r) => sum + (r.balance || 0), 0).toLocaleString('en-IN')}`,
            Concession: `₹${rowsToPrint.reduce((sum, r) => sum + (r.concession || 0), 0).toLocaleString('en-IN')}`,
            Arrear: `₹${rowsToPrint.reduce((sum, r) => sum + (r.arrear || 0), 0).toLocaleString('en-IN')}`,
            Excess: `₹${rowsToPrint.reduce((sum, r) => sum + (r.excess || 0), 0).toLocaleString('en-IN')}`,
            Charge: `₹${rowsToPrint.reduce((sum, r) => sum + (r.charge || 0), 0).toLocaleString('en-IN')}`,
            Adjustment: `₹${rowsToPrint.reduce((sum, r) => sum + (r.adjusted || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforCategoryWise = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl No',
            'Fee Class Category',
            'Fee Head',
            'By Bank',
            'By Cash',
            'By Online',
            'By Card',
            'By ECS',
            'By RTGS'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl No': index + 1,
            'Fee Class Category': row.studentName || '',
            'Fee Head': row.fmh_feename || '',
            'By Bank': `₹${(row.bybank || 0).toLocaleString('en-IN')}`,
            'By Cash': `₹${(row.bycash || 0).toLocaleString('en-IN')}`,
            'By Online': `₹${(row.byonline || 0).toLocaleString('en-IN')}`,
            'By Card': `₹${(row.bycard || 0).toLocaleString('en-IN')}`,
            'By ECS': `₹${(row.byecs || 0).toLocaleString('en-IN')}`,
            'By RTGS': `₹${(row.byrtgs || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl No': '',
            'Fee Class Category': 'TOTAL',
            'Fee Head': '',
            'By Bank': `₹${rowsToPrint.reduce((sum, r) => sum + (r.bybank || 0), 0).toLocaleString('en-IN')}`,
            'By Cash': `₹${rowsToPrint.reduce((sum, r) => sum + (r.bycash || 0), 0).toLocaleString('en-IN')}`,
            'By Online': `₹${rowsToPrint.reduce((sum, r) => sum + (r.byonline || 0), 0).toLocaleString('en-IN')}`,
            'By Card': `₹${rowsToPrint.reduce((sum, r) => sum + (r.bycard || 0), 0).toLocaleString('en-IN')}`,
            'By ECS': `₹${rowsToPrint.reduce((sum, r) => sum + (r.byecs || 0), 0).toLocaleString('en-IN')}`,
            'By RTGS': `₹${rowsToPrint.reduce((sum, r) => sum + (r.byrtgs || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforClassSectionInstallmentWiseConslidated = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl No',
            'Class Name',
            'Section',
            'Term',
            'Total Charges',
            'Balance Amount',
            'Paid Amount',
            'Concession',
            'Waived Off',
            'Adjusted',
            'Excess Paid',
            'Refund Amount',
            'Running Excess'
        ];

        // Map your data according to the new headers
        // You'll need to adjust the row properties to match your actual data structure
        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl No': index + 1,
            'Class Name': row.asmcl_classname || '',
            Section: row.asmc_sectionname || '',
            Term: row.fmt_name || '',
            'Total Charges': `₹${(row.totalcharges || 0).toLocaleString('en-IN')}`,
            'Balance Amount': `₹${(row.totalbalance || 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${(row.totalpaid || 0).toLocaleString('en-IN')}`,
            Concession: `₹${(row.totalconcession || 0).toLocaleString('en-IN')}`,
            'Waived Off': `₹${(row.totalwaivedoff || 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${(row.adjustment || 0).toLocaleString('en-IN')}`,
            'Excess Paid': `₹${(row.excess || 0).toLocaleString('en-IN')}`,
            'Refund Amount': `₹${(row.totalrefund || 0).toLocaleString('en-IN')}`,
            'Running Excess': `₹${(row.runningexcess || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl No': '',
            'Class Name': 'TOTAL',
            Section: '',
            Term: '',
            'Total Charges': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalcharges || 0), 0).toLocaleString('en-IN')}`,
            'Balance Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalbalance || 0), 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalpaid || 0), 0).toLocaleString('en-IN')}`,
            Concession: `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalconcession || 0), 0).toLocaleString('en-IN')}`,
            'Waived Off': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalwaivedoff || 0), 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${rowsToPrint.reduce((sum, r) => sum + (r.adjustment || 0), 0).toLocaleString('en-IN')}`,
            'Excess Paid': `₹${rowsToPrint.reduce((sum, r) => sum + (r.excess || 0), 0).toLocaleString('en-IN')}`,
            'Refund Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalrefund || 0), 0).toLocaleString('en-IN')}`,
            'Running Excess': `₹${rowsToPrint.reduce((sum, r) => sum + (r.runningexcess || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforClassInstallmentWiseConslidated = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl No',
            'Class Name',
            'Term',
            'Total Charges',
            'Balance Amount',
            'Paid Amount',
            'Concession',
            'Waived Off',
            'Adjusted',
            'Excess Paid',
            'Refund Amount',
            'Running Excess'
        ];

        // Map your data according to the new headers
        // You'll need to adjust the row properties to match your actual data structure
        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl No': index + 1,
            'Class Name': row.asmcl_classname || '',
            Term: row.fmt_name || '',
            'Total Charges': `₹${(row.totalcharges || 0).toLocaleString('en-IN')}`,
            'Balance Amount': `₹${(row.totalbalance || 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${(row.totalpaid || 0).toLocaleString('en-IN')}`,
            Concession: `₹${(row.totalconcession || 0).toLocaleString('en-IN')}`,
            'Waived Off': `₹${(row.totalwaivedoff || 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${(row.adjustment || 0).toLocaleString('en-IN')}`,
            'Excess Paid': `₹${(row.excess || 0).toLocaleString('en-IN')}`,
            'Refund Amount': `₹${(row.totalrefund || 0).toLocaleString('en-IN')}`,
            'Running Excess': `₹${(row.runningexcess || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl No': '',
            'Class Name': 'TOTAL',
            Term: '',
            'Total Charges': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalcharges || 0), 0).toLocaleString('en-IN')}`,
            'Balance Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalbalance || 0), 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalpaid || 0), 0).toLocaleString('en-IN')}`,
            Concession: `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalconcession || 0), 0).toLocaleString('en-IN')}`,
            'Waived Off': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalwaivedoff || 0), 0).toLocaleString('en-IN')}`,
            Adjusted: `₹${rowsToPrint.reduce((sum, r) => sum + (r.adjustment || 0), 0).toLocaleString('en-IN')}`,
            'Excess Paid': `₹${rowsToPrint.reduce((sum, r) => sum + (r.excess || 0), 0).toLocaleString('en-IN')}`,
            'Refund Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalrefund || 0), 0).toLocaleString('en-IN')}`,
            'Running Excess': `₹${rowsToPrint.reduce((sum, r) => sum + (r.runningexcess || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforStudentWiseTotalPaidCount = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl No',
            'Student Name',
            'Admission No',
            'Total Payable',
            'Paid Amount',
            'Balance',
            'Concession',
            'Fine',
            'Rebate',
            'WaivedOff',
            'Adjustment',
            'Opening Balance'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl No': index + 1,
            'Student Name': row.studentname || '',
            'Admission No': row.amst_admno || '',
            'Total Payable': `₹${(row.totalpayable || 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${(row.fss_paidamount || 0).toLocaleString('en-IN')}`,
            Balance: `₹${(row.balance || 0).toLocaleString('en-IN')}`,
            Concession: `₹${(row.concession || 0).toLocaleString('en-IN')}`,
            Fine: `₹${(row.fine || 0).toLocaleString('en-IN')}`,
            Rebate: `₹${(row.rebate || 0).toLocaleString('en-IN')}`,
            WaivedOff: `₹${(row.waived || 0).toLocaleString('en-IN')}`,
            Adjustment: `₹${(row.adjusted || 0).toLocaleString('en-IN')}`,
            'Opening Balance': `₹${(row.openingbalance || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl No': '',
            'Student Name': 'TOTAL',
            'Admission No': '',
            'Total Payable': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalpayable || 0), 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.fss_paidamount || 0), 0).toLocaleString('en-IN')}`,
            Balance: `₹${rowsToPrint.reduce((sum, r) => sum + (r.balance || 0), 0).toLocaleString('en-IN')}`,
            Concession: `₹${rowsToPrint.reduce((sum, r) => sum + (r.concession || 0), 0).toLocaleString('en-IN')}`,
            Fine: `₹${rowsToPrint.reduce((sum, r) => sum + (r.fine || 0), 0).toLocaleString('en-IN')}`,
            Rebate: `₹${rowsToPrint.reduce((sum, r) => sum + (r.rebate || 0), 0).toLocaleString('en-IN')}`,
            WaivedOff: `₹${rowsToPrint.reduce((sum, r) => sum + (r.waived || 0), 0).toLocaleString('en-IN')}`,
            Adjustment: `₹${rowsToPrint.reduce((sum, r) => sum + (r.adjusted || 0), 0).toLocaleString('en-IN')}`,
            'Opening Balance': `₹${rowsToPrint.reduce((sum, r) => sum + (r.openingbalance || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforClassSectionWiseTotalPaidCount = () => {
        const rowsToPrint = reportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl No',
            'Student Name',
            'Class/Section',
            'Admission No',
            'Total Payable',
            'Paid Amount',
            'Balance',
            'Concession',
            'Fine',
            'Rebate',
            'WaivedOff',
            'Adjustment',
            'Opening Balance'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl No': index + 1,
            'Student Name': row.studentname || '',
            'Class/Section': row.asmcl_classname || '',
            'Admission No': row.amst_admno || '',
            'Total Payable': `₹${(row.totalpayable || 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${(row.fss_paidamount || 0).toLocaleString('en-IN')}`,
            Balance: `₹${(row.balance || 0).toLocaleString('en-IN')}`,
            Concession: `₹${(row.concession || 0).toLocaleString('en-IN')}`,
            Fine: `₹${(row.fine || 0).toLocaleString('en-IN')}`,
            Rebate: `₹${(row.rebate || 0).toLocaleString('en-IN')}`,
            WaivedOff: `₹${(row.waived || 0).toLocaleString('en-IN')}`,
            Adjustment: `₹${(row.adjusted || 0).toLocaleString('en-IN')}`,
            'Opening Balance': `₹${(row.openingbalance || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            'Sl No': '',
            'Student Name': 'TOTAL',
            asmcl_classname: '',
            'Admission No': '',
            'Total Payable': `₹${rowsToPrint.reduce((sum, r) => sum + (r.totalpayable || 0), 0).toLocaleString('en-IN')}`,
            'Paid Amount': `₹${rowsToPrint.reduce((sum, r) => sum + (r.fss_paidamount || 0), 0).toLocaleString('en-IN')}`,
            Balance: `₹${rowsToPrint.reduce((sum, r) => sum + (r.balance || 0), 0).toLocaleString('en-IN')}`,
            Concession: `₹${rowsToPrint.reduce((sum, r) => sum + (r.concession || 0), 0).toLocaleString('en-IN')}`,
            Fine: `₹${rowsToPrint.reduce((sum, r) => sum + (r.fine || 0), 0).toLocaleString('en-IN')}`,
            Rebate: `₹${rowsToPrint.reduce((sum, r) => sum + (r.rebate || 0), 0).toLocaleString('en-IN')}`,
            WaivedOff: `₹${rowsToPrint.reduce((sum, r) => sum + (r.waived || 0), 0).toLocaleString('en-IN')}`,
            Adjustment: `₹${rowsToPrint.reduce((sum, r) => sum + (r.adjusted || 0), 0).toLocaleString('en-IN')}`,
            'Opening Balance': `₹${rowsToPrint.reduce((sum, r) => sum + (r.openingbalance || 0), 0).toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    //   const isAcademicYearSelected = !!filters.academicYearId;
    //   const isClassSectionEnabled = filters.includeClassSection;
    const showDateSection = filters.viewMode === 'date';
    const showBalancecheckbox = filters.userType === 'Students' && filters.breakdown === 'Student/Staff Wise';

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            <div className='space-y-8'>
                                <Card className='border bg-gray-50 p-5 shadow-sm'>
                                    <div className='flex flex-wrap items-center justify-center gap-10'>
                                        {(
                                            [
                                                { label: 'Yearly Wise', value: 'year' },
                                                { label: 'Date Wise', value: 'date' }
                                            ] as const
                                        ).map((mode) => (
                                            <label key={mode.value} className='flex cursor-pointer items-center gap-3'>
                                                <input
                                                    type='radio'
                                                    name='viewMode'
                                                    checked={filters.viewMode === mode.value}
                                                    onChange={() =>
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            viewMode: mode.value
                                                        }))
                                                    }
                                                    className='h-5 w-5 text-primary'
                                                />
                                                <span className='font-medium text-base'>{mode.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Card>

                                <div className='flex flex-wrap gap-8'>
                                    <Card className='min-w-[400px] flex-1 border bg-gray-50 p-5 shadow-sm'>
                                        <div className='flex flex-wrap gap-4'>
                                            {[
                                                { label: 'Fee Group Wise', value: 'FGW' },
                                                { label: 'Fee Head Wise', value: 'FHW' },
                                                { label: 'Class Wise', value: 'FCW' },
                                                { label: 'Student Wise', value: 'FSW' },
                                                { label: 'Term Wise', value: 'TRMW' },
                                                { label: 'Installment Wise', value: 'INMW' },
                                                { label: 'Student Term Wise', value: 'STRMW' },
                                                { label: 'Category Wise', value: 'CW' },
                                                {
                                                    label: 'Class-Section-Installmentwise Consolidated',
                                                    value: 'CTW'
                                                },
                                                {
                                                    label: 'Class-Installmentwise Consolidated',
                                                    value: 'CTC'
                                                },
                                                {
                                                    label: 'Student Wise Total Paid Count',
                                                    value: 'SWTPC'
                                                },
                                                {
                                                    label: 'Class-Section Wise Total Paid Count',
                                                    value: 'CWTPC'
                                                },
                                                { label: 'Parent Wise', value: 'FPW' }
                                            ].map((option) => (
                                                <label
                                                    key={option.value}
                                                    className='flex cursor-pointer items-center gap-3 whitespace-nowrap'>
                                                    <input
                                                        type='radio'
                                                        name='breakdown'
                                                        checked={filters.breakdown === option.value}
                                                        onChange={() =>
                                                            setFilters((prev) => ({
                                                                ...prev,
                                                                breakdown: option.value
                                                            }))
                                                        }
                                                        className='h-5 w-5 text-primary'
                                                    />
                                                    <span className='font-medium text-sm'>{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </Card>

                                    {/* Academic Year */}
                                    <div className='min-w-[300px] space-y-3'>
                                        <Label className='font-semibold text-lg'>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <Select
                                            value={filters.academicYearId}
                                            onValueChange={(val) => setFilters((prev) => ({ ...prev, academicYearId: val }))}
                                            disabled={loadingAcademic}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder={loadingAcademic ? 'Loading...' : 'Select Academic Year'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {academicYears.map((year) => (
                                                    <SelectItem key={year.asmaY_Id} value={String(year.asmaY_Id)}>
                                                        {year.asmaY_Year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                                    {/* Column 1: Custom Group */}
                                    <div className='space-y-3'>
                                        <Label className='font-semibold text-lg'>
                                            Custom Group <span className='text-red-500'>*</span>
                                        </Label>
                                        <Card className='border bg-gray-50 p-4'>
                                            <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                <Label
                                                    htmlFor='customGroupSelectAll'
                                                    className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-200'>
                                                    <Checkbox
                                                        id='customGroupSelectAll'
                                                        checked={
                                                            customGroups.length > 0 && filters.customGroupIds.length === customGroups.length
                                                        }
                                                        indeterminate={
                                                            filters.customGroupIds.length > 0 &&
                                                            filters.customGroupIds.length < customGroups.length
                                                        }
                                                        onCheckedChange={(checked: any) => selectAllCustomGroups(!!checked)}
                                                    />
                                                    <span>Select All</span>
                                                </Label>

                                                {loadingCustomGroup ? (
                                                    <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                ) : customGroups.length > 0 ? (
                                                    customGroups.map((group) => (
                                                        <Label
                                                            key={group.fmgG_Id}
                                                            htmlFor={`customGroup-${group.fmgG_Id}`}
                                                            className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                            <Checkbox
                                                                id={`customGroup-${group.fmgG_Id}`}
                                                                checked={filters.customGroupIds.includes(group.fmgG_Id)}
                                                                onCheckedChange={() => toggleCustomGroup(group.fmgG_Id)}
                                                            />
                                                            <span className='font-medium text-sm'>{group.fmgG_GroupName}</span>
                                                        </Label>
                                                    ))
                                                ) : (
                                                    <div className='py-4 text-center text-gray-500'>No custom groups</div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Column 2: Fee Group */}
                                    <div className='space-y-3'>
                                        <Label className='font-semibold text-lg'>
                                            Fee Group <span className='text-red-500'>*</span>
                                        </Label>
                                        <Card className='border bg-gray-50 p-4'>
                                            <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                <Label
                                                    htmlFor='feeGroupSelectAll'
                                                    className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-200'>
                                                    <Checkbox
                                                        id='feeGroupSelectAll'
                                                        checked={feeGroups.length > 0 && filters.feeGroupIds.length === feeGroups.length}
                                                        indeterminate={
                                                            filters.feeGroupIds.length > 0 && filters.feeGroupIds.length < feeGroups.length
                                                        }
                                                        onCheckedChange={(checked: any) => selectAllFeeGroups(!!checked)}
                                                    />
                                                    <span>Select All</span>
                                                </Label>

                                                {loadingfeegroup ? (
                                                    <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                ) : feeGroups.length > 0 ? (
                                                    feeGroups.map((group) => (
                                                        <Label
                                                            key={group.fmG_Id}
                                                            htmlFor={`feeGroup-${group.fmG_Id}`}
                                                            className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                            <Checkbox
                                                                id={`feeGroup-${group.fmG_Id}`}
                                                                checked={filters.feeGroupIds.includes(group.fmG_Id)}
                                                                onCheckedChange={() => toggleFeeGroup(group.fmG_Id)}
                                                            />
                                                            <span className='text-sm'>{group.fmG_GroupName}</span>
                                                        </Label>
                                                    ))
                                                ) : (
                                                    <div className='py-4 text-center text-gray-500'>No fee groups</div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Column 3: Term OR Installment */}
                                    <div className='space-y-3'>
                                        {filters.breakdown !== 'INMW' && (
                                            <>
                                                <Label className='font-semibold text-lg'>
                                                    Term Name <span className='text-red-500'>*</span>
                                                </Label>
                                                <Card className='border bg-gray-50 p-4'>
                                                    <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                        <Label
                                                            htmlFor='termSelectAll'
                                                            className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-200'>
                                                            <Checkbox
                                                                id='termSelectAll'
                                                                checked={feeTerms.length > 0 && filters.termIds.length === feeTerms.length}
                                                                indeterminate={
                                                                    filters.termIds.length > 0 && filters.termIds.length < feeTerms.length
                                                                }
                                                                onCheckedChange={(checked: any) => selectAllTerms(!!checked)}
                                                            />
                                                            <span>Select All</span>
                                                        </Label>

                                                        {loadingfeeterm ? (
                                                            <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                        ) : feeTerms.length > 0 ? (
                                                            feeTerms.map((term) => (
                                                                <Label
                                                                    key={term.fmT_Id}
                                                                    htmlFor={`term-${term.fmT_Id}`}
                                                                    className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                    <Checkbox
                                                                        id={`term-${term.fmT_Id}`}
                                                                        checked={filters.termIds.includes(term.fmT_Id)}
                                                                        onCheckedChange={() => toggleTerm(term.fmT_Id)}
                                                                    />
                                                                    <span className='text-sm'>{term.fmT_Name}</span>
                                                                </Label>
                                                            ))
                                                        ) : (
                                                            <div className='py-4 text-center text-gray-500'>No terms</div>
                                                        )}
                                                    </div>
                                                </Card>
                                            </>
                                        )}

                                        {filters.breakdown === 'INMW' && (
                                            <>
                                                <Label className='font-semibold text-lg'>
                                                    Installment Name <span className='text-red-500'>*</span>
                                                </Label>
                                                <Card className='border bg-gray-50 p-4'>
                                                    <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                        <Label
                                                            htmlFor='installmentSelectAll'
                                                            className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-200'>
                                                            <Checkbox
                                                                id='installmentSelectAll'
                                                                checked={
                                                                    feeInstallments.length > 0 &&
                                                                    filters.installmentIds.length === feeInstallments.length
                                                                }
                                                                indeterminate={
                                                                    filters.installmentIds.length > 0 &&
                                                                    filters.installmentIds.length < feeInstallments.length
                                                                }
                                                                onCheckedChange={(checked: any) => selectAllInstallments(!!checked)}
                                                            />
                                                            <span>Select All</span>
                                                        </Label>

                                                        {feeInstallmentLoading ? (
                                                            <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                        ) : feeInstallments.length > 0 ? (
                                                            feeInstallments.map((installment) => (
                                                                <Label
                                                                    key={installment.ftI_Id}
                                                                    htmlFor={`installment-${installment.ftI_Id}`}
                                                                    className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                    <Checkbox
                                                                        id={`installment-${installment.ftI_Id}`}
                                                                        checked={filters.installmentIds.includes(installment.ftI_Id)}
                                                                        onCheckedChange={() => toggleInstallment(installment.ftI_Id)}
                                                                    />
                                                                    <span className='text-sm'>{installment.ftI_InstallmentName}</span>
                                                                </Label>
                                                            ))
                                                        ) : (
                                                            <div className='py-4 text-center text-gray-500'>No installments</div>
                                                        )}
                                                    </div>
                                                </Card>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Class & Section + Status + Date (Date section is conditional) */}
                                <div className='space-y-6 border-t pt-8'>
                                    <div className='flex w-full flex-wrap justify-between gap-6'>
                                        {/* Status Checkboxes */}
                                        <div className='flex flex-grow flex-wrap items-center gap-4'>
                                            <div className='flex items-center gap-2'>
                                                <Checkbox checked={filters.status.active} onCheckedChange={() => toggleStatus('active')} />
                                                <Label className='cursor-pointer'>Active</Label>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Checkbox
                                                    checked={filters.status.deactive}
                                                    onCheckedChange={() => toggleStatus('deactive')}
                                                />
                                                <Label className='cursor-pointer'>Deactive</Label>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Checkbox checked={filters.status.left} onCheckedChange={() => toggleStatus('left')} />
                                                <Label className='cursor-pointer'>Left</Label>
                                            </div>
                                            {showBalancecheckbox && (
                                                <div className='flex items-center gap-2'>
                                                    <Checkbox
                                                        checked={filters.status.balance}
                                                        onCheckedChange={() => toggleStatus('balance')}
                                                    />
                                                    <Label className='cursor-pointer'>Balance</Label>
                                                </div>
                                            )}
                                        </div>
                                        {(filters.breakdown === 'FSW' ||
                                            filters.breakdown === 'STRMW' ||
                                            filters.breakdown === 'SWTPC' ||
                                            filters.breakdown === 'CWTPC') && (
                                            <>
                                                {/* Class */}
                                                <div className='flex min-w-[220px] flex-grow items-center gap-3'>
                                                    <Label htmlFor='includeClass' className='whitespace-nowrap font-medium'>
                                                        Class <span className='text-red-500'>*</span>:
                                                    </Label>
                                                    <Select
                                                        value={filters.classId === 0 ? '' : String(filters.classId)}
                                                        onValueChange={(val) => {
                                                            const id = Number(val);
                                                            setFilters((prev) => ({
                                                                ...prev,
                                                                classId: id
                                                                // sectionId: 0,
                                                            }));
                                                        }}>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder={loadingClasses ? 'Loading...' : 'Select Class'} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {classes.map((cls) => (
                                                                <SelectItem key={cls.asmcL_Id} value={String(cls.asmcL_Id)}>
                                                                    {cls.asmcL_ClassName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Section */}
                                                <div className='flex min-w-[220px] flex-grow items-center gap-3'>
                                                    <Label className='whitespace-nowrap font-medium'>
                                                        Section <span className='text-red-500'>*</span>:
                                                    </Label>
                                                    <Select
                                                        value={filters.sectionId === 0 ? '' : String(filters.sectionId)}
                                                        onValueChange={(val) =>
                                                            setFilters((prev) => ({
                                                                ...prev,
                                                                sectionId: Number(val)
                                                            }))
                                                        }>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue
                                                                placeholder={
                                                                    !filters.classId
                                                                        ? 'Select Class first'
                                                                        : loadingSections
                                                                          ? 'Loading...'
                                                                          : 'Select Section'
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {sections.map((sec) => (
                                                                <SelectItem key={sec.asmS_Id} value={String(sec.asmS_Id)}>
                                                                    {sec.asmC_SectionName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Date section - ONLY shown when Date Wise is selected */}
                                    {showDateSection && (
                                        <div className='fade-in flex animate-in flex-wrap items-center gap-6 duration-300'>
                                            <Label className='min-w-32 font-medium'>
                                                Date <span className='text-red-500'>*</span>
                                            </Label>

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant='outline' className='w-[240px] justify-start text-left font-normal'>
                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                        {format(filters.dueDate, 'dd-MM-yyyy')}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0' align='start'>
                                                    <Calendar
                                                        mode='single'
                                                        selected={filters.dueDate}
                                                        onSelect={(date) => date && setFilters((prev) => ({ ...prev, dueDate: date }))}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <Card className='border bg-gray-50 p-4 shadow-sm'>
                                                <div className='flex items-center gap-10'>
                                                    <Label className='flex cursor-pointer items-center gap-3'>
                                                        <input
                                                            type='radio'
                                                            name='dueDateType'
                                                            checked={filters.dueDateType === 'Due Date'}
                                                            onChange={() =>
                                                                setFilters((prev) => ({
                                                                    ...prev,
                                                                    dueDateType: 'Due Date'
                                                                }))
                                                            }
                                                            className='h-4 w-4 text-primary'
                                                        />
                                                        <span className='font-medium'>Due Date</span>
                                                    </Label>
                                                    <Label className='flex cursor-pointer items-center gap-3'>
                                                        <input
                                                            type='radio'
                                                            name='dueDateType'
                                                            checked={filters.dueDateType === 'Till Due Date'}
                                                            onChange={() =>
                                                                setFilters((prev) => ({
                                                                    ...prev,
                                                                    dueDateType: 'Till Due Date'
                                                                }))
                                                            }
                                                            className='h-4 w-4 text-primary'
                                                        />
                                                        <span className='font-medium'>Till Due Date</span>
                                                    </Label>
                                                </div>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                                {filters.viewMode === 'date' && (
                                    <div className='mt-4 flex items-center justify-between rounded border bg-gray-50 p-4 shadow-sm'>
                                        <div className='flex flex-wrap items-center gap-6'>
                                            <Label className='flex cursor-pointer items-center gap-3'>
                                                <input
                                                    type='radio'
                                                    name='dateFilter'
                                                    value='1'
                                                    checked={filters.dateFilter === '1'}
                                                    onChange={() => setFilters((prev) => ({ ...prev, dateFilter: '1' }))}
                                                    className='h-4 w-4'
                                                />
                                                Transaction Date
                                            </Label>

                                            <Label className='flex cursor-pointer items-center gap-3'>
                                                <input
                                                    type='radio'
                                                    name='dateFilter'
                                                    value='2'
                                                    checked={filters.dateFilter === '2'}
                                                    onChange={() => setFilters((prev) => ({ ...prev, dateFilter: '2' }))}
                                                    className='h-4 w-4'
                                                />
                                                Cheque Date
                                            </Label>

                                            <Label className='flex cursor-pointer items-center gap-3'>
                                                <input
                                                    type='radio'
                                                    name='dateFilter'
                                                    value='4'
                                                    checked={filters.dateFilter === '4'}
                                                    onChange={() => setFilters((prev) => ({ ...prev, dateFilter: '4' }))}
                                                    className='h-4 w-4'
                                                />
                                                Transaction & Cheque
                                            </Label>

                                            <Label className='flex cursor-pointer items-center gap-3'>
                                                <input
                                                    type='radio'
                                                    name='dateFilter'
                                                    value='3'
                                                    checked={filters.dateFilter === '3'}
                                                    onChange={() => setFilters((prev) => ({ ...prev, dateFilter: '3' }))}
                                                    className='h-4 w-4'
                                                />
                                                All
                                            </Label>
                                        </div>

                                        <div className='flex items-center gap-6'>
                                            <div className='flex flex-col'>
                                                <Label htmlFor='fromDate' className='font-medium'>
                                                    From Date:
                                                </Label>
                                                <input
                                                    id='fromDate'
                                                    type='date'
                                                    value={filters.fromDate ? format(filters.fromDate, 'yyyy-MM-dd') : ''}
                                                    onChange={(e) =>
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            fromDate: new Date(e.target.value)
                                                        }))
                                                    }
                                                    className='rounded border px-3 py-1'
                                                />
                                            </div>

                                            <div className='flex flex-col'>
                                                <Label htmlFor='toDate' className='font-medium'>
                                                    To Date:
                                                </Label>
                                                <input
                                                    id='toDate'
                                                    type='date'
                                                    value={filters.toDate ? format(filters.toDate, 'yyyy-MM-dd') : ''}
                                                    onChange={(e) =>
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            toDate: new Date(e.target.value)
                                                        }))
                                                    }
                                                    className='rounded border px-3 py-1'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className='flex justify-center gap-4 border-t pt-6'>
                                        <Button type='submit' disabled={isSubmitting} className='min-w-32'>
                                            {isSubmitting ? 'Generating...' : 'Report'}
                                        </Button>

                                        <Button type='button' variant='outline' onClick={handleReset}>
                                            Cancel
                                        </Button>
                                    </div>

                                    {showReport && (
                                        <div className='-mx-8 mt-12 overflow-hidden rounded-lg bg-white shadow-xl'>
                                            {/* Loading State */}
                                            {reportLoading ? (
                                                <div className='p-24 text-center'>
                                                    <div className='inline-block h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                                                    <p className='mt-6 text-lg text-muted-foreground'>Generating report, please wait...</p>
                                                </div>
                                            ) : (
                                                <CollapsibleSection
                                                    defaultOpen={true}
                                                    variant='default'
                                                    size='lg'
                                                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                                                    <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                                                        <h2 className='font-bold text-2xl text-primary'>Yearly Fee Collection Report</h2>
                                                        {filters.breakdown === 'FGW' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforFeeGroupWise}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforFeeGroupWise}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {filters.breakdown === 'FHW' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforFeeHeadWise}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforFeeHeadWise}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {filters.breakdown === 'CW' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforCategoryWise}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforCategoryWise}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {filters.breakdown === 'FCW' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforFeeClassWise}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforFeeClassWise}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {filters.breakdown === 'FSW' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforStudentWise}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforStudentWise}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {filters.breakdown === 'TRMW' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforTermWise}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforTermWise}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {filters.breakdown === 'INMW' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforInstallmentWise}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforInstallmentWise}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {filters.breakdown === 'CTW' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={
                                                                            handleExportExcelforClassSectionInstallmentWiseConslidated
                                                                        }>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforClassSectionInstallmentWiseConslidated}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {filters.breakdown === 'CTC' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforClassInstallmentWiseConslidated}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforClassInstallmentWiseConslidated}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {filters.breakdown === 'SWTPC' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforStudentWiseTotalPaidCount}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforStudentWiseTotalPaidCount}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {filters.breakdown === 'CWTPC' && (
                                                            <div className='flex gap-3'>
                                                                <div className='mb-4 flex justify-end gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handleExportExcelforClassSectionWiseTotalPaidCount}>
                                                                        Export Excel
                                                                    </Button>

                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        className='h-8 w-auto px-3 text-xs'
                                                                        onClick={handlePrintforClassSectionWiseTotalPaidCount}>
                                                                        Print
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* <GenericDataTable
                                                        data={tableData}
                                                        columns={getDynamicColumns(filters.breakdown as 'FGW' | 'INMW')}
                                                        isLoading={reportLoading}
                                                        isPaginationRequired={false}
                                                        isSearchRequired={false}
                                                    /> */}

                                                    {reportData.length > 0 && (
                                                        <>
                                                            {(filters.breakdown === 'FGW' || filters.breakdown === 'FHW') && (
                                                                <div className='overflow-x-auto border'>
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length === reportData.length &&
                                                                                                reportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length < reportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllstudents}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    {filters.breakdown === 'FGW' && (
                                                                                        <th className='p-2 text-center'>Fee Group</th>
                                                                                    )}
                                                                                    {filters.breakdown === 'FHW' && (
                                                                                        <th className='p-2 text-center'>Fee Head</th>
                                                                                    )}

                                                                                    <th className='p-2 text-center'>Paid Amount</th>
                                                                                    <th className='p-2 text-center'>Balance</th>
                                                                                    <th className='p-2 text-center'>Concession</th>
                                                                                    <th className='p-2 text-center'>Waived Off</th>
                                                                                    <th className='p-2 text-center'>Rebate</th>
                                                                                    <th className='p-2 text-center'>Fine</th>
                                                                                    <th className='p-2 text-center'>Total Payable</th>
                                                                                    <th className='p-2 text-center'>Adjusted</th>
                                                                                    <th className='p-2 text-center'>Excess Paid</th>
                                                                                    <th className='p-2 text-center'>Running Excess</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {reportData.map((row, index) => (
                                                                                    <tr key={row.id} className='border-b hover:bg-gray-50'>
                                                                                        <td className='p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        {filters.breakdown === 'FGW' && (
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.fmg_groupname}
                                                                                            </td>
                                                                                        )}
                                                                                        {filters.breakdown === 'FHW' && (
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.fmh_feename}
                                                                                            </td>
                                                                                        )}
                                                                                        {/* <td className="p-2 text-center">
                                              {row.fmg_groupname}
                                            </td> */}
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.fss_paidamount || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.balance || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.concession || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.waived || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.rebate || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.fine || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.totalpayable || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.adjusted || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.excess || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.runningexcess || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                {/* Totals Row */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td colSpan={3} className='p-2 text-right'>
                                                                                        Total:
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.fss_paidamount || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.balance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.concession || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.waived || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.rebate || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce((sum, row) => sum + (row.fine || 0), 0)
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalpayable || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.adjusted || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.excess || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.runningexcess || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div className='p-2 font-medium text-sm'>
                                                                            Total Records: {reportData.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {filters.breakdown === 'FCW' && (
                                                                <div className='overflow-x-auto border'>
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length === reportData.length &&
                                                                                                reportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length < reportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllstudents}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th className='p-2 text-center'>Class Name</th>
                                                                                    <th className='p-2 text-center'>Total Charges</th>
                                                                                    <th className='p-2 text-center'>Paid Amount</th>
                                                                                    <th className='p-2 text-center'>Balance</th>
                                                                                    <th className='p-2 text-center'>Concession</th>
                                                                                    <th className='p-2 text-center'>Fine</th>
                                                                                    <th className='p-2 text-center'>Rebate</th>
                                                                                    <th className='p-2 text-center'>Waived Off</th>
                                                                                    <th className='p-2 text-center'>Excess</th>
                                                                                    <th className='p-2 text-center'>Opening Balance</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {reportData.map((row, index) => (
                                                                                    <tr key={row.id} className='border-b hover:bg-gray-50'>
                                                                                        <td className='p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.asmcl_classname}
                                                                                        </td>

                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            {(row.fss_paidamount || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.fss_paidamount || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.balance || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.concession || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.fine || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.rebate || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.waived || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.excess || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.openingbalance || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                {/* Totals Row */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td colSpan={6} className='p-2 text-right'>
                                                                                        Total:
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalpayable || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.fss_paidamount || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.balance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.concession || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce((sum, row) => sum + (row.fine || 0), 0)
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.rebate || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.waived || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.adjusted || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.openingbalance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.excess || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div className='p-2 font-medium text-sm'>
                                                                            Total Records: {reportData.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {filters.breakdown === 'FSW' && (
                                                                <div className='overflow-x-auto border'>
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length === reportData.length &&
                                                                                                reportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length < reportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllstudents}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th className='p-2 text-center'>Student Name</th>
                                                                                    <th className='p-2 text-center'>Admission No</th>
                                                                                    <th className='p-2 text-center'>Class Name</th>
                                                                                    <th className='p-2 text-center'>Mobile No</th>
                                                                                    <th className='p-2 text-center'>Total Payable</th>
                                                                                    <th className='p-2 text-center'>Paid Amount</th>
                                                                                    <th className='p-2 text-center'>Balance</th>
                                                                                    <th className='p-2 text-center'>Concession</th>
                                                                                    <th className='p-2 text-center'>Fine</th>
                                                                                    <th className='p-2 text-center'>Rebate</th>
                                                                                    <th className='p-2 text-center'>Waived Off</th>

                                                                                    <th className='p-2 text-center'>Adjusted</th>
                                                                                    <th className='p-2 text-center'>Opening Balance</th>

                                                                                    <th className='p-2 text-center'>Excess Paid</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {reportData.map((row, index) => (
                                                                                    <tr key={row.id} className='border-b hover:bg-gray-50'>
                                                                                        <td className='p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.studentname}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.amst_admno}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.asmcl_classname}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>{row.mobileNo}</td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {(row.totalpayable || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.fss_paidamount || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.balance || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.concession || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.fine || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.rebate || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.waived || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.adjusted || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.openingbalance || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.excess || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                {/* Totals Row */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td colSpan={6} className='p-2 text-right'>
                                                                                        Total:
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalpayable || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.fss_paidamount || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.balance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.concession || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce((sum, row) => sum + (row.fine || 0), 0)
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.rebate || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.waived || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.adjusted || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.openingbalance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.excess || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div className='p-2 font-medium text-sm'>
                                                                            Total Records: {reportData.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {filters.breakdown === 'TRMW' && (
                                                                <div className='overflow-x-auto border'>
                                                                    <table className='w-full table-auto border-collapse'>
                                                                        <thead className='bg-primary text-white'>
                                                                            <tr>
                                                                                <th className='border p-2 text-center'>
                                                                                    <Checkbox
                                                                                        checked={
                                                                                            selectedIds.length === reportData.length &&
                                                                                            reportData.length > 0
                                                                                        }
                                                                                        indeterminate={
                                                                                            selectedIds.length > 0 &&
                                                                                            selectedIds.length < reportData.length
                                                                                        }
                                                                                        onCheckedChange={toggleAllstudents}
                                                                                    />
                                                                                </th>
                                                                                <th className='border p-2 text-center'>Sl No</th>
                                                                                <th className='border p-2 text-center'>Fee Head</th>

                                                                                {/* For EACH selected term, render 7 columns */}
                                                                                {selectedTerms.map((term) => (
                                                                                    <React.Fragment key={term.fmT_Id}>
                                                                                        <th
                                                                                            colSpan={7}
                                                                                            className='border-x border-y p-2 text-center'>
                                                                                            {term.fmT_Name}
                                                                                        </th>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </tr>

                                                                            {/* Sub-header row for term columns */}
                                                                            <tr className='bg-primary/90 text-white'>
                                                                                <th className='border p-2 text-center'>{''}</th>
                                                                                <th className='border p-2 text-center'> {''}</th>
                                                                                <th className='border p-2 text-center'>{''}</th>

                                                                                {selectedTerms.map((term) => (
                                                                                    <React.Fragment key={term.fmT_Id}>
                                                                                        <th className='border p-2 text-center'>Paid</th>
                                                                                        <th className='border p-2 text-center'>Balance</th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Concession
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>Arrear</th>
                                                                                        <th className='border p-2 text-center'>Excess</th>
                                                                                        <th className='border p-2 text-center'>Charges</th>
                                                                                        <th className='border border-r-2 p-2 text-center'>
                                                                                            Payable
                                                                                        </th>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {reportData
                                                                                .filter((row) => true)
                                                                                .map((row, index) => (
                                                                                    <tr key={row.id} className='border-b hover:bg-gray-50'>
                                                                                        <td className='border p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='border p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td className='border p-2 text-center'>
                                                                                            {row.fmh_feename}
                                                                                        </td>

                                                                                        {selectedTerms.map((term, termIndex) => {
                                                                                            const termData = reportData.find(
                                                                                                (item) =>
                                                                                                    item.fmh_id === row.fmh_id &&
                                                                                                    item.fmt_id === term.fmT_Id
                                                                                            );

                                                                                            const isLastColumnInTermGroup =
                                                                                                termIndex === selectedTerms.length - 1;

                                                                                            return (
                                                                                                <React.Fragment key={term.fmT_Id}>
                                                                                                    <td className='border p-2 text-center font-bold'>
                                                                                                        ₹
                                                                                                        {termData?.paid?.toLocaleString(
                                                                                                            'en-IN'
                                                                                                        ) || '0'}
                                                                                                    </td>
                                                                                                    <td className='border p-2 text-center font-bold'>
                                                                                                        ₹
                                                                                                        {termData?.balance?.toLocaleString(
                                                                                                            'en-IN'
                                                                                                        ) || '0'}
                                                                                                    </td>
                                                                                                    <td className='border p-2 text-center font-bold'>
                                                                                                        ₹
                                                                                                        {termData?.concession?.toLocaleString(
                                                                                                            'en-IN'
                                                                                                        ) || '0'}
                                                                                                    </td>
                                                                                                    <td className='border p-2 text-center font-bold'>
                                                                                                        ₹
                                                                                                        {termData?.arrear?.toLocaleString(
                                                                                                            'en-IN'
                                                                                                        ) || '0'}
                                                                                                    </td>
                                                                                                    <td className='border p-2 text-center font-bold'>
                                                                                                        ₹
                                                                                                        {termData?.excess?.toLocaleString(
                                                                                                            'en-IN'
                                                                                                        ) || '0'}
                                                                                                    </td>
                                                                                                    <td className='border p-2 text-center font-bold'>
                                                                                                        ₹
                                                                                                        {termData?.charges?.toLocaleString(
                                                                                                            'en-IN'
                                                                                                        ) || '0'}
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className={`border p-2 text-center font-bold ${isLastColumnInTermGroup ? 'border-r-2' : ''}`}>
                                                                                                        ₹
                                                                                                        {termData?.payable?.toLocaleString(
                                                                                                            'en-IN'
                                                                                                        ) || '0'}
                                                                                                    </td>
                                                                                                </React.Fragment>
                                                                                            );
                                                                                        })}
                                                                                    </tr>
                                                                                ))}

                                                                            {/* Totals Row */}
                                                                            <tr className='bg-gray-100 font-bold'>
                                                                                <td colSpan={3} className='border p-2 text-right'>
                                                                                    Total:
                                                                                </td>

                                                                                {/* Term-wise totals */}
                                                                                {selectedTerms.map((term, termIndex) => {
                                                                                    const isLastColumnInTermGroup =
                                                                                        termIndex === selectedTerms.length - 1;

                                                                                    // Filter data for this specific term
                                                                                    const termDataForTotal = reportData.filter(
                                                                                        (item) => item.fmt_id === term.fmT_Id
                                                                                    );

                                                                                    return (
                                                                                        <React.Fragment key={term.fmT_Id}>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) => sum + (row.paid || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.balance || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.concession || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.arrear || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.excess || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.charges || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td
                                                                                                className={`border p-2 text-center font-bold text-blue-700 ${isLastColumnInTermGroup ? 'border-r-2' : ''}`}>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.payable || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                        </React.Fragment>
                                                                                    );
                                                                                })}
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <div className='p-2 font-medium text-sm'>
                                                                        Total Records:{' '}
                                                                        {
                                                                            reportData.filter((row) =>
                                                                                selectedTerms.some((term) => term.fmT_Id === row.fmt_id)
                                                                            ).length
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {filters.breakdown === 'INMW' && (
                                                                <div className='overflow-x-auto border'>
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length === reportData.length &&
                                                                                                reportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length < reportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllstudents}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th className='p-2 text-center'>Student Name</th>

                                                                                    <th className='p-2 text-center'>Class/Section</th>
                                                                                    <th className='p-2 text-center'>Admission No</th>
                                                                                    <th className='p-2 text-center'>Installment name</th>
                                                                                    <th className='p-2 text-center'>Total Payable</th>
                                                                                    <th className='p-2 text-center'>Paid Amount</th>
                                                                                    <th className='p-2 text-center'>Balance</th>
                                                                                    <th className='p-2 text-center'>Concession</th>
                                                                                    <th className='p-2 text-center'>Arrear</th>
                                                                                    <th className='p-2 text-center'>Excess</th>
                                                                                    <th className='p-2 text-center'>Charge</th>

                                                                                    <th className='p-2 text-center'>Adjustment</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {reportData.map((row, index) => (
                                                                                    <tr key={row.id} className='border-b hover:bg-gray-50'>
                                                                                        <td className='p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.studentName}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.asmcL_ClassName}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.amsT_AdmNo}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>{row.ftI_Name}</td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            {(row.payable || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.fss_paidamount || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.balance || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.concession || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.arrear || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.excess || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.charge || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.adjusted || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                {/* Totals Row */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td colSpan={6} className='p-2 text-right'>
                                                                                        Total:
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalpayable || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.fss_paidamount || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.balance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.concession || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.arrear || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.excess || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.charge || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.adjusted || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div className='p-2 font-medium text-sm'>
                                                                            Total Records: {reportData.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {filters.breakdown === 'STRMW' && (
                                                                <div className='overflow-x-auto border'>
                                                                    <table className='w-full table-auto border-collapse'>
                                                                        <thead className='bg-primary text-white'>
                                                                            <tr>
                                                                                <th className='border p-2 text-center' rowSpan={2}>
                                                                                    <Checkbox
                                                                                        checked={
                                                                                            selectedIds.length === reportData.length &&
                                                                                            reportData.length > 0
                                                                                        }
                                                                                        indeterminate={
                                                                                            selectedIds.length > 0 &&
                                                                                            selectedIds.length < reportData.length
                                                                                        }
                                                                                        onCheckedChange={toggleAllstudents}
                                                                                    />
                                                                                </th>
                                                                                <th className='border p-2 text-center' rowSpan={2}>
                                                                                    Sl No
                                                                                </th>
                                                                                <th className='border p-2 text-center' rowSpan={2}>
                                                                                    Student Name
                                                                                </th>
                                                                                <th className='border p-2 text-center' rowSpan={2}>
                                                                                    Class:Section
                                                                                </th>
                                                                                <th className='border p-2 text-center' rowSpan={2}>
                                                                                    CD Net Amount
                                                                                </th>
                                                                                <th className='border p-2 text-center' rowSpan={2}>
                                                                                    CD Paid Amount
                                                                                </th>
                                                                                <th className='border p-2 text-center' rowSpan={2}>
                                                                                    CD Balance Amount
                                                                                </th>
                                                                                {selectedTerms.map((term) => (
                                                                                    <React.Fragment key={term.fmT_Id}>
                                                                                        <th
                                                                                            colSpan={11}
                                                                                            className='border-x border-y p-2 text-center'>
                                                                                            {term.fmT_Name}
                                                                                        </th>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </tr>
                                                                            <tr className='bg-primary/90 text-white'>
                                                                                {selectedTerms.map((term) => (
                                                                                    <React.Fragment key={term.fmT_Id}>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total Charges
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total Arrear
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total Concession
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total WaivedOff
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total AdjustedAmount
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total Payable
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total Paid
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total Balance
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total Excess
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total Refund
                                                                                        </th>
                                                                                        <th className='border p-2 text-center'>
                                                                                            Total Adjusted
                                                                                        </th>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {reportData.map((row, index) => (
                                                                                <tr key={row.id} className='border-b hover:bg-gray-50'>
                                                                                    <td className='border p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={selectedIds.includes(row.id)}
                                                                                            onCheckedChange={() => toggleRow(row.id)}
                                                                                        />
                                                                                    </td>
                                                                                    <td className='border p-2 text-center font-medium'>
                                                                                        {index + 1}
                                                                                    </td>
                                                                                    <td className='border p-2 text-center'>
                                                                                        {row.studentName}
                                                                                    </td>
                                                                                    <td className='border p-2 text-center'>
                                                                                        {row.asmcl_ClassName}
                                                                                    </td>
                                                                                    <td className='border p-2 text-center'>
                                                                                        {row.cdNetAmount?.toLocaleString('en-IN') || '0'}
                                                                                    </td>
                                                                                    <td className='border p-2 text-center'>
                                                                                        {row.cdPaidAmount?.toLocaleString('en-IN') || '0'}
                                                                                    </td>
                                                                                    <td className='border p-2 text-center'>
                                                                                        {row.cdBalanceAmount?.toLocaleString('en-IN') ||
                                                                                            '0'}
                                                                                    </td>
                                                                                    {selectedTerms.map((term, termIndex) => {
                                                                                        const termData = reportData.find(
                                                                                            (item) => item.fmt_Id === term.fmT_Id
                                                                                        );
                                                                                        const isLastColumnInTermGroup =
                                                                                            termIndex === selectedTerms.length - 1;

                                                                                        return (
                                                                                            <React.Fragment key={term.fmT_Id}>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.charges?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.arrear?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.concession?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.waived?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.adjusted?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.payable?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.paid?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.balance?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.excess?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td className='border p-2 text-center font-bold'>
                                                                                                    {termData?.refund?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                                <td
                                                                                                    className={`border p-2 text-center font-bold ${isLastColumnInTermGroup ? 'border-r-2' : ''}`}>
                                                                                                    {termData?.adjusted?.toLocaleString(
                                                                                                        'en-IN'
                                                                                                    ) || '0'}
                                                                                                </td>
                                                                                            </React.Fragment>
                                                                                        );
                                                                                    })}
                                                                                </tr>
                                                                            ))}
                                                                            <tr className='bg-gray-100 font-bold'>
                                                                                <td colSpan={7} className='border p-2 text-right'>
                                                                                    Total:
                                                                                </td>

                                                                                {/* Term-wise totals */}
                                                                                {selectedTerms.map((term, termIndex) => {
                                                                                    const isLastColumnInTermGroup =
                                                                                        termIndex === selectedTerms.length - 1;
                                                                                    const termDataForTotal = reportData.filter(
                                                                                        (item) => item.fmt_Id === term.fmT_Id
                                                                                    );

                                                                                    return (
                                                                                        <React.Fragment key={term.fmT_Id}>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.charges || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.arrear || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.concession || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.waived || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.adjusted || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.payable || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) => sum + (row.paid || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.balance || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.excess || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='border p-2 text-center font-bold text-blue-700'>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.refund || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td
                                                                                                className={`border p-2 text-center font-bold text-blue-700 ${isLastColumnInTermGroup ? 'border-r-2' : ''}`}>
                                                                                                ₹
                                                                                                {termDataForTotal
                                                                                                    .reduce(
                                                                                                        (sum, row) =>
                                                                                                            sum + (row.adjusted || 0),
                                                                                                        0
                                                                                                    )
                                                                                                    .toLocaleString('en-IN')}
                                                                                            </td>
                                                                                        </React.Fragment>
                                                                                    );
                                                                                })}
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <div className='p-2 font-medium text-sm'>
                                                                        Total Records: {reportData.length}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {filters.breakdown === 'CW' && (
                                                                <div className='overflow-x-auto border'>
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length === reportData.length &&
                                                                                                reportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length < reportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllstudents}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th className='p-2 text-center'>Fee Class Category</th>
                                                                                    <th className='p-2 text-center'>Fee Head</th>
                                                                                    <th className='p-2 text-center'>By Bank</th>
                                                                                    <th className='p-2 text-center'>By Cash</th>
                                                                                    <th className='p-2 text-center'>By Online</th>
                                                                                    <th className='p-2 text-center'>By Card</th>
                                                                                    <th className='p-2 text-center'>By ECS</th>
                                                                                    <th className='p-2 text-center'>By RTGS</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {reportData.map((row, index) => (
                                                                                    <tr key={row.id} className='border-b hover:bg-gray-50'>
                                                                                        <td className='p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>

                                                                                        <td className='p-2 text-center'>
                                                                                            {row.fmcc_classcategoryname}
                                                                                        </td>

                                                                                        <td className='p-2 text-center'>
                                                                                            {row.fmh_feename}
                                                                                        </td>

                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.bybank || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.bycash || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.byonline || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.bycard || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.byecs || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.byrtgs || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                {/* Totals Row */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td colSpan={3} className='p-2 text-right'>
                                                                                        Total:
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.bybank || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.bycash || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.byonline || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.bycard || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce((sum, row) => sum + (row.byecs || 0), 0)
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.byrtgs || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div className='p-2 font-medium text-sm'>
                                                                            Total Records: {reportData.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {(filters.breakdown === 'CTW' || filters.breakdown === 'CTC') && (
                                                                <div className='overflow-x-auto border'>
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length === reportData.length &&
                                                                                                reportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length < reportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllstudents}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th className='p-2 text-center'>Class Name</th>
                                                                                    {filters.breakdown === 'CTW' && (
                                                                                        <th className='p-2 text-center'>Section</th>
                                                                                    )}

                                                                                    <th className='p-2 text-center'>Term</th>
                                                                                    <th className='p-2 text-center'>Total Charges</th>
                                                                                    <th className='p-2 text-center'>Balance Amount</th>
                                                                                    <th className='p-2 text-center'>Paid Amount</th>
                                                                                    <th className='p-2 text-center'>Concession</th>
                                                                                    <th className='p-2 text-center'>Waived Off</th>
                                                                                    <th className='p-2 text-center'>Adjusted</th>
                                                                                    <th className='p-2 text-center'>Excess Paid</th>
                                                                                    <th className='p-2 text-center'>Refund Amount</th>

                                                                                    <th className='p-2 text-center'>Running Excess</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {reportData.map((row, index) => (
                                                                                    <tr key={row.id} className='border-b hover:bg-gray-50'>
                                                                                        <td className='p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.asmcl_classname}
                                                                                        </td>
                                                                                        {filters.breakdown === 'CTW' && (
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.asmc_sectionname}
                                                                                            </td>
                                                                                        )}

                                                                                        <td className='p-2 text-center'>{row.fmt_name}</td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            {(row.totalcharges || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            {(row.totalbalance || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            {(row.totalpaid || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.totalconcession || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.totalwaivedoff || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.adjustment || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.excess || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.totalrefund || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.runningexcess || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                {/* Totals Row */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td
                                                                                        colSpan={filters.breakdown === 'CTW' ? 5 : 4}
                                                                                        className='p-2 text-right'>
                                                                                        Total:
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalcharges || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalbalance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalpaid || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.totalconcession || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.totalwaivedoff || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.adjustment || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.excess || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalrefund || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.runningexcess || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div className='p-2 font-medium text-sm'>
                                                                            Total Records: {reportData.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {(filters.breakdown === 'SWTPC' || filters.breakdown === 'CWTPC') && (
                                                                <div className='overflow-x-auto border'>
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length === reportData.length &&
                                                                                                reportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length < reportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllstudents}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th className='p-2 text-center'>Student Name</th>
                                                                                    {filters.breakdown === 'CWTPC' && (
                                                                                        <th className='p-2 text-center'>Class/Section</th>
                                                                                    )}
                                                                                    <th className='p-2 text-center'>Admission No</th>
                                                                                    <th className='p-2 text-center'>Total Payable</th>
                                                                                    <th className='p-2 text-center'>Paid Amount</th>
                                                                                    <th className='p-2 text-center'>Balance</th>
                                                                                    <th className='p-2 text-center'>Concession</th>
                                                                                    <th className='p-2 text-center'>Fine</th>
                                                                                    <th className='p-2 text-center'>Rebate</th>
                                                                                    <th className='p-2 text-center'>Waived Off</th>

                                                                                    <th className='p-2 text-center'>Adjusted</th>
                                                                                    <th className='p-2 text-center'>Opening Balance</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {reportData.map((row, index) => (
                                                                                    <tr key={row.id} className='border-b hover:bg-gray-50'>
                                                                                        <td className='p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.studentname}
                                                                                        </td>
                                                                                        {filters.breakdown === 'CWTPC' && (
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.asmcl_classname}
                                                                                            </td>
                                                                                        )}
                                                                                        <td className='p-2 text-center'>
                                                                                            {row.amst_admno}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            {(row.totalpayable || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.fss_paidamount || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.balance || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.concession || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.fine || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.rebate || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.waived || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{(row.adjusted || 0).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹
                                                                                            {(row.openingbalance || 0).toLocaleString(
                                                                                                'en-IN'
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                {/* Totals Row */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td
                                                                                        colSpan={filters.breakdown === 'CWTPC' ? 5 : 4}
                                                                                        className='p-2 text-right'>
                                                                                        Total:
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalpayable || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.fss_paidamount || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.balance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.concession || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce((sum, row) => sum + (row.fine || 0), 0)
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.rebate || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.waived || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.adjusted || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {reportData
                                                                                            .reduce(
                                                                                                (sum, row) =>
                                                                                                    sum + (row.openingbalance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div className='p-2 font-medium text-sm'>
                                                                            Total Records: {reportData.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </CollapsibleSection>
                                            )}
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
