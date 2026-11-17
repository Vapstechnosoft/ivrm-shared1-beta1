'use client';

import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import {
    useFeeClassListDefaulterreport,
    useFeeInstallmentreportBusRouteDropdown,
    useFeeInstallmentreportCategoryDropdown,
    useFeeInstallmentreportGroupDropdown,
    useFeeInstallmentreporttermDropdown,
    useFeeSectionListDefaulterreport,
    useFeeTransInstallmentYearlyfeecollectionreport
} from '@/hooks/fees/useReports';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { FormError } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { feesInstallmentReportSchema } from '@/schemas/fees/reports';
import { getFeesSectionListByClassId } from '@/server/fees/reports/fee_DefaulterReport';
import {
    getFeeInstallmentReportHeadDropdown,
    getInstallemntReportInstallmentDropdownData,
    getInstallmentReportDetails
} from '@/server/fees/reports/fee_installment_report';
import type {
    ConsolidatedReportInstallemntDropdownList,
    IFeeClassDropdownList,
    IFeeSectionDropdownList,
    IInstallmentReportFeeTermDropdownList,
    InstallmentReportGroupDropdownList,
    InstallmentReportHeadDropdownList,
    InstallmentReportInstallemntDropdownList
} from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { exportToExcelInstallmentReport, printTableInstallmentReport } from './print_excel';
type FormFields = z.infer<typeof feesInstallmentReportSchema>;

// Checkbox with full indeterminate support
const Checkbox = ({ checked, indeterminate, onCheckedChange, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);

    return <BaseCheckbox ref={ref} checked={checked} onCheckedChange={onCheckedChange} {...props} />;
};

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

export default function FeeInstallemntReport() {
    type catg = 'Category' | 'Class' | 'transport' | 'Consolidate' | 'GroupWise';
    const userTypeOptions: { label: string; value: catg }[] = [
        { label: 'Category Wise', value: 'Category' },
        { label: 'Class Wise', value: 'Class' },
        { label: 'Transport', value: 'transport' },
        { label: 'Consolidate', value: 'Consolidate' },
        { label: 'Group Wise', value: 'GroupWise' }
    ];

    type con = 'Datewise' | 'Classwise';
    const conOptions: { label: string; value: con }[] = [
        { label: 'Date Wise', value: 'Datewise' },
        { label: 'Class Wise', value: 'Classwise' }
    ];

    const {
        handleSubmit,
        setValue,
        control,
        watch,
        register,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feesInstallmentReportSchema),
        defaultValues: {
            catg: 'Category',
            academicYearId: undefined,
            classId: 0,
            sectionId: 0,
            con: 'Datewise',
            installmentIds: [],
            termIds: [],
            groupIds: [],
            headIds: [],
            busrouteid: 0,
            groupIdsNew: []
        }
    });

    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        catg: 'Category' as catg,
        con: 'Datewise' as con,
        fromDate: new Date(),
        toDate: new Date(),

        academicYearId: '',
        classId: 0,
        sectionId: 0
        //installmentIds: [] as number[],
        //termIds: [] as number[],
        // groupIds: [] as number[],
        //headIds: [] as number[]
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
    const [classes, setClasses] = useState<IFeeClassDropdownList[]>([]);
    const [sections, setSections] = useState<IFeeSectionDropdownList[]>([]);

    const [reportData, setReportData] = useState<any[]>([]);
    const [reportLoading, setReportLoading] = useState(false); // ← ADD THIS LINE
    const [showReport, setShowReport] = useState(false);

    const [installments, setInstallments] = useState<ConsolidatedReportInstallemntDropdownList[]>([]);

    const [heads, setHeads] = useState<InstallmentReportHeadDropdownList[]>([]);

    const [feeInstallments, setfeeInstallments] = useState<InstallmentReportInstallemntDropdownList[]>([]);

    const [feeTerms, setfeeTerms] = useState<IInstallmentReportFeeTermDropdownList[]>([]);

    const [feeGroups, setfeeGroups] = useState<InstallmentReportGroupDropdownList[]>([]);

    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<'feeGroup' | 'totalDue' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [sectionLoading, setSectionLoading] = useState(false);

    const [installemnetsloding, setinstallemnetsloding] = useState(false);
    const [headsloading, setheadsloading] = useState(false);

    const [installmentSearch, setInstallmentSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Add this computed value
    const totalPages = Math.ceil(reportData.length / rowsPerPage);

    // Hooks
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();
    const { data: classListResponse, isLoading: loadingClasses, error: classListError } = useFeeClassListDefaulterreport();

    const {
        data: feeInstallmentData,
        isLoading: feeInstallmentLoading,
        error: feeInstallmentError
    } = useFeeTransInstallmentYearlyfeecollectionreport();

    const { data: termsdropdowndata, isLoading: termsloading, error: termserror } = useFeeInstallmentreporttermDropdown();
    //useFeeInstallmentreportGroupDropdown

    const { data: groupsdata, isLoading: groupsloading, error: groupserror } = useFeeInstallmentreportGroupDropdown();

    const {
        data: categorydropdowndata,
        isLoading: categoryloading,
        error: categoryerror,
        refetchAll: refetchCategory
    } = useFeeInstallmentreportCategoryDropdown();

    //heads

    // const { data: headsdata, isLoading: headsloading, error: headserror, refetchAll:  refetchHeads } = useFeeInstallmentreportCategoryDropdown();

    //useFeeInstallmentreportBusRouteDropdown

    const {
        data: busroutedata,
        isLoading: busrouteLoading,
        error: busrouteError,
        refetchAll: refetchBusRoute
    } = useFeeInstallmentreportBusRouteDropdown();

    // useEffect(() => {
    //     if (feeInstallmentError) toast.error(feeInstallmentError?.message || 'Failed to load fee installments');
    //     else if (feeInstallmentData?.data) setfeeInstallments(feeInstallmentData.data);
    // }, [feeInstallmentData, feeInstallmentError]);

    useEffect(() => {
        if (termserror) toast.error(termserror?.message || 'Failed to load fee terms');
        else if (termsdropdowndata?.data) setfeeTerms(termsdropdowndata.data);
    }, [termsdropdowndata, termserror]);

    useEffect(() => {
        if (groupserror) toast.error(groupserror?.message || 'Failed to load fee groups');
        else if (groupsdata?.data) setfeeGroups(groupsdata.data);
    }, [groupsdata, groupserror]);

    const {
        data: sectionListResponse,
        isLoading: loadingSections,
        error: sectionListError,
        refetch: refetchSections
    } = useFeeSectionListDefaulterreport();

    // Load data effects (unchanged)
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
            //  formatted.sort((a, b) => (b.asmaY_Order || 0) - (a.asmaY_Order || 0));
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

    const classId = watch('classId') ?? 0;
    const academicYearId = watch('academicYearId');
    //const includeClassSection = watch('includeClassSection');

    //getInstallmentDropdownData

    useEffect(() => {
        const fetchInstallments = async () => {
            console.log('academic year chnaged', academicYearId);
            if (!academicYearId) {
                //setInstallments([]);

                setfeeInstallments([]);

                return;
            }

            setinstallemnetsloding(true);

            try {
                const result = await getInstallemntReportInstallmentDropdownData(Number(academicYearId));

                console.log('installments', JSON.stringify(result));
                const data = Array.isArray(result?.data) ? result.data : [];

                //setInstallments(data);
                setfeeInstallments(data);
                if (data.length === 0) {
                    //  toast.info('No sections found for this class');
                }
            } catch (error: any) {
                // toast.error(error.message);
                setfeeInstallments([]);
            }
        };

        fetchInstallments();
    }, [academicYearId, setValue]);

    useEffect(() => {
        const fetchSections = async () => {
            if (!academicYearId || classId <= 0) {
                setSections([]);
                setValue('sectionId', 0);
                return;
            }

            setSectionLoading(true);

            try {
                const result = await getFeesSectionListByClassId(Number(academicYearId), classId);

                console.log('sectionsdata', result);

                const data = Array.isArray(result?.data) ? result.data : [];
                setSections(data);

                if (data.length === 0) {
                    toast.info('No sections found for this class');
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to load sections');
                setSections([]);
            } finally {
                setSectionLoading(false);
            }
        };

        fetchSections();
    }, [academicYearId, classId, setValue]);

    //heads

    const groupidnew = watch('fmg_id');

    console.log('groupidnew', groupidnew);

    useEffect(() => {
        const fetchHeads = async () => {
            if (!academicYearId && !groupidnew) {
                setHeads([]);

                return;
            }

            setheadsloading(true);

            try {
                const result = await getFeeInstallmentReportHeadDropdown(Number(academicYearId), Number(groupidnew));

                console.log('heads', JSON.stringify(result));
                const data = Array.isArray(result?.data) ? result.data : [];

                setHeads(data);
                if (data.length === 0) {
                    setheadsloading(false);
                    // toast.info('No Heads found ');
                }
            } catch (error: any) {
                // toast.error(error.message);
                setHeads([]);
            } finally {
                setheadsloading(false);
            }
        };

        fetchHeads();
    }, [academicYearId, groupidnew, setValue]);

    const toggleRow = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const toggleAll = () => {
        if (selectedIds.length === reportData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(reportData.map((r) => r.id));
        }
    };

    const selectedRows = reportData.filter((r) => selectedIds.includes(r.id));

    function transformReportData(apiData: any[]) {
        const studentMap = new Map<string, any>();

        apiData.forEach((item) => {
            const key = `${item.amaY_RollNo}-${item.studentName}`;

            if (!studentMap.has(key)) {
                studentMap.set(key, {
                    rollNo: item.amaY_RollNo,
                    studentName: item.studentName?.trim(),
                    className: item.className,
                    sectionName: item.sectionName,
                    installments: {}
                });
            }

            studentMap.get(key).installments[String(item.ftI_Id)] = {
                receiptNo: item.receiptNo,
                date: item.date,
                chequeNo: item.chequeNo,
                amount: item.paid
            };
        });

        return Array.from(studentMap.values());
    }

    // const handleExportAlltype = () => {
    //     if (!reportData.length) {
    //         toast.error('No data to export');
    //         return;
    //     }

    //     const groupedRows = transformReportData(reportData);

    //     exportToExcelAll(groupedRows, installments, 'Fee Consolidated Report');
    // };

    const getColumns = () => {
        // CONSOLIDATE
        if (selectedCatg === 'Consolidate') {
            return [
                'Sl No',
                'Terms Name',
                'Today Paid Count',
                'Today Collection',
                'Still Now Paid Count',
                'Still Now Collection',
                'Total Strength',
                'Defaulters'
            ];
        }

        // DETAILED
        const cols = [
            'Sl No',
            'Student Name',
            'Admission No',
            'Class',
            'Section',
            'Term',
            'Payable Amount',
            'Paid Amount',
            'Balance',
            'Concession'
        ];

        selectedInstallmentData.forEach((inst: any) => {
            const name = inst.ftI_InstallmentName;
            cols.push(
                `${name} Net`,
                `${name} Paid`,
                `${name} Balance`,
                `${name} Concession`,
                `${name} Fine`,
                `${name} Waiver`,
                `${name} Opening`,
                `${name} Net 2`,
                `${name} Paid 2`,
                `${name} Balance 2`
            );
        });

        return cols;
    };

    const getRows = () => {
        // CONSOLIDATE
        if (selectedCatg === 'Consolidate') {
            return reportData.map((row: any) => ({
                'Sl No': row.slNo,
                'Terms Name': row.termsName,
                'Today Paid Count': row.todayPaidCount,
                'Today Collection': row.todayCollection,
                'Still Now Paid Count': row.stillNowPaidCount,
                'Still Now Collection': row.stillNowCollection,
                'Total Strength': row.totalStrength,
                Defaulters: row.defaulters
            }));
        }

        // DETAILED
        return reportData.map((row: any, index: number) => {
            const data: any = {
                'Sl No': index + 1,
                'Student Name': row.studentName,
                'Admission No': row.admissionNo,
                Class: row.className,
                Section: row.section,
                Term: row.term,
                'Payable Amount': row.payableAmount,
                'Paid Amount': row.paidAmount,
                Balance: row.balanceAmount,
                Concession: row.concessionAmount
            };

            selectedInstallmentData.forEach((inst: any) => {
                const instData = row.installments?.[inst.ftI_Id] || {};
                const name = inst.ftI_InstallmentName;

                data[`${name} Net`] = instData.net || 0;
                data[`${name} Paid`] = instData.paid || 0;
                data[`${name} Balance`] = instData.balance || 0;
                data[`${name} Concession`] = instData.concession || 0;
                data[`${name} Fine`] = instData.fine || 0;
                data[`${name} Waiver`] = instData.waiver || 0;
                data[`${name} Opening`] = instData.opening || 0;
                data[`${name} Net 2`] = instData.net2 || 0;
                data[`${name} Paid 2`] = instData.paid2 || 0;
                data[`${name} Balance 2`] = instData.balance2 || 0;
            });

            return data;
        });
    };

    const handleExportAlltype = () => {
        const rows = getRows();
        exportToExcelInstallmentReport(rows, `${selectedCatg}_Fee_Report`);
    };
    const handlePrintAlltype = () => {
        const columns = getColumns();
        const rows = getRows();

        printTableInstallmentReport(columns, rows);
    };

    const selectedCatg = watch('catg');

    const selectedCon = watch('con');

    const termwise = watch('termswise');

    // const toggleInstallment = (id: number) =>
    //     setFilters((prev) => ({
    //         ...prev,
    //         installmentIds: prev.installmentIds.includes(id) ? prev.installmentIds.filter((x) => x !== id) : [...prev.installmentIds, id]
    //     }));

    const installmentIds = watch('installmentIds');

    const toggleInstallment = (id: number) => {
        const current = installmentIds ?? [];

        const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];

        setValue('installmentIds', updated, {
            shouldDirty: true,
            shouldValidate: true
        });
    };

    const selectedInstallmentData = useMemo(
        () => feeInstallments.filter((inst) => installmentIds?.includes(inst.ftI_Id)),
        [installmentIds, feeInstallments]
    );

    const selectedInstallmentDataall = useMemo(
        () => feeInstallments.filter(() => feeInstallments.map((t) => t.ftI_Id)),
        [installmentIds, feeInstallments]
    );

    //    const toggleHeads = (id: number) =>
    //         setFilters((prev) => ({
    //             ...prev,
    //             headIds: prev.headIds.includes(id) ? prev.headIds.filter((x) => x !== id) : [...prev.headIds, id]
    //         }));

    const headIds = watch('headIds') ?? [];

    const toggleHeads = (id: number) => {
        const updated = headIds.includes(id) ? headIds.filter((x: number) => x !== id) : [...headIds, id];

        setValue('headIds', updated, { shouldValidate: true });
    };

    // const toggleterms = (id: number) =>
    //     setFilters((prev) => ({
    //         ...prev,
    //         termIds: prev.termIds.includes(id) ? prev.termIds.filter((x) => x !== id) : [...prev.termIds, id]
    //     }));

    const termIds = watch('termIds') ?? [];

    const toggleterms = (id: number) => {
        const updated = termIds.includes(id) ? termIds.filter((x) => x !== id) : [...termIds, id];

        setValue('termIds', updated, {
            shouldDirty: true,
            shouldValidate: true
        });
    };

    const allTermIds = feeTerms.map((t) => t.fmT_Id);

    //const isAllTermsSelected = feeTerms.length > 0 && filters.termIds.length === feeTerms.length;

    const isAllTermsSelected = feeTerms.length > 0 && termIds.length === feeTerms.length;

    // const toggleAllTerms = () => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         termIds: isAllTermsSelected ? [] : allTermIds
    //     }));
    // };

    const toggleAllTerms = () => {
        setValue('termIds', isAllTermsSelected ? [] : feeTerms.map((t) => t.fmT_Id), { shouldDirty: true, shouldValidate: true });
    };
    /////====

    // const togglegroups = (id: number) =>
    //     setFilters((prev) => ({
    //         ...prev,
    //         groupIds: prev.groupIds.includes(id) ? prev.groupIds.filter((x) => x !== id) : [...prev.groupIds, id]
    //     }));

    const groupIds = watch('groupIds') ?? [];

    const togglegroups = (id: number) => {
        const updated = groupIds.includes(id) ? groupIds.filter((x) => x !== id) : [...groupIds, id];

        setValue('groupIds', updated, {
            shouldDirty: true,
            shouldValidate: true
        });
    };

    const groupIdsnew = watch('groupIdsNew') ?? [];

    const togglegroupsnew = (id: number) => {
        const updated = groupIdsnew.includes(id) ? groupIdsnew.filter((x) => x !== id) : [...groupIdsnew, id];

        setValue('groupIdsNew', updated, {
            shouldDirty: true,
            shouldValidate: true
        });
    };

    const allGroupIds = feeGroups.map((t) => t.fmG_Id);

    //const isAllGroupsSelected = feeGroups.length > 0 && filters.groupIds.length === feeGroups.length;

    const isAllGroupsSelected = feeGroups.length > 0 && groupIds.length === feeGroups.length;
    // const toggleAllGroups = () => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         groupIds: isAllGroupsSelected ? [] : allGroupIds
    //     }));
    // };

    const toggleAllGroups = () => {
        setValue('groupIds', isAllGroupsSelected ? [] : feeGroups.map((g) => g.fmG_Id), { shouldDirty: true, shouldValidate: true });
    };
    const isAllGroupsSelectedNew = feeGroups.length > 0 && groupIdsnew.length === feeGroups.length;

    const toggleAllGroupsnew = () => {
        setValue('groupIdsNew', isAllGroupsSelectedNew ? [] : feeGroups.map((g) => g.fmG_Id), { shouldDirty: true, shouldValidate: true });
    };

    const selectedInstallmentDataNew = useMemo(
        () => feeInstallments.filter((inst) => installmentIds?.includes(inst.ftI_Id)),
        [installmentIds, feeInstallments]
    );

    const filteredInstallments = useMemo(() => {
        if (!installmentSearch.trim()) {
            return feeInstallments;
        }

        const searchTerm = installmentSearch.toLowerCase();
        return feeInstallments.filter((installment) => installment.ftI_Name?.toLowerCase().includes(searchTerm));
    }, [feeInstallments, installmentSearch]);

    // const handleSubmit = async () => {
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setReportLoading(true);
        setShowReport(false);

        // await new Promise((resolve) => setTimeout(resolve, 1200));

        // const response = await getFeeConsolidatedReportData(Number(data.academicYearId), data.classId ? data.classId : 0, data.sectionId ? data.sectionId : 0, filters.catg);

        // console.log('responsedata', JSON.stringify(response));

        // const mapIndiResponseToTable = (data: any[]) => {
        //     return data.map((item, index) => ({
        //         id: index + 1,
        //         studentName: item.studentName?.trim(),
        //         admNo: item.amaY_RollNo,
        //         classSection: `${item.className} ${item.sectionName}`,
        //         paidAmount: item.paid,
        //         receiptNo: item.receiptNo,
        //         bankName: item.fyP_Bank_Name || '',
        //         date: item.date,
        //         chequeNo: item.chequeNo || '',
        //         chequeDate: item.fyP_DD_Cheque_Date || ''
        //     }));
        // };

        // if (filters.userType === 'indi') {
        //     const mappedData = mapIndiResponseToTable(response?.data || []);
        //     setReportData(mappedData);
        // } else {
        //     const pivoted = pivotReportData(response?.data || []);
        //     setReportData(pivoted);
        // }

        try {
            let payload: any = {};
            console.log('selectedCatg', payload);
            const albumNameArraygroupids: any[] = [];
            const header_list: any[] = [];
            const fillgrouparrayname: any[] = [];
            let FMH_Ids: number[] = [];
            let routename = '';

            // Get user ID from context or default to 1
            const userid = 30239; // Get from your auth context

            // Handle different category types based on AngularJS logic
            switch (selectedCatg) {
                case 'Category': {
                    // Set header_list from selected installments
                    if (termwise !== 1) {
                        feeInstallments.forEach((inst) => {
                            if (installmentIds?.includes(inst.ftI_Id)) {
                                header_list.push(inst);
                                albumNameArraygroupids.push({
                                    columnID: String(inst.ftI_Id),
                                    columnName: inst.ftI_Name
                                });
                            }
                        });
                    }

                    // Get category name
                    const category = categorydropdowndata?.data?.find((cat) => cat.fmcC_Id === data.fmcc_id);
                    routename = category?.fmcC_ClassCategoryName || '';

                    payload = {
                        ASMAY_Id: Number(data.academicYearId),
                        FTI_Id: 0, // Not clear from AngularJS, defaulting to 0
                        ASMCL_Id: 0, // For category, class is 0
                        ASMS_Id: 0, // For category, section is 0
                        FMCC_Id: data.fmcc_id || 0,
                        reporttype: selectedCatg,
                        FMG_Id: 0,
                        TRMR_Id: 0,
                        temparrayinst1: albumNameArraygroupids,
                        FMGG_Ids: FMH_Ids,
                        termslistarray: termwise === 1 ? (data.termIds || []).map((termId) => ({ FMT_Id: termId })) : undefined,
                        fillgrouparray:
                            termwise === 1 ? (data.groupIds || []).map((groupId) => ({ FMG_Id: groupId, FMG_GroupName: '' })) : undefined,
                        active: data.Active || 0,
                        deactive: data.Deactive || 0,
                        left: data.left || 0,
                        termswise: termwise || 0,
                        userid: userid
                    };

                    console.log('Categorypayload', JSON.stringify(payload));
                    break;
                }

                case 'Class': {
                    // Set header_list from all installments (arrlstinst1 in AngularJS)
                    if (termwise !== 1) {
                        // feeInstallments.forEach((inst) => {
                        //     header_list.push(inst);
                        // });
                        feeInstallments.forEach((inst) => {
                            if (installmentIds?.includes(inst.ftI_Id)) {
                                header_list.push(inst);
                                albumNameArraygroupids.push({
                                    ftI_Id: String(inst.ftI_Id),
                                    ftI_Name: inst.ftI_Name
                                });
                            }
                        });
                    }

                    // Get class name
                    const className = classes.find((cls) => cls.asmcL_Id === data.classId)?.asmcL_ClassName || '';
                    routename = className;

                    payload = {
                        ASMAY_Id: Number(data.academicYearId),
                        FTI_Id: 0,
                        ASMCL_Id: data.classId || 0,
                        ASMS_Id: data.sectionId || 0,
                        FMCC_Id: 0,
                        AMSC_Id: data.sectionId || 0,
                        reporttype: selectedCatg,
                        FMG_Id: 0,
                        TRMR_Id: 0,
                        temparrayinst1: albumNameArraygroupids,
                        FMGG_Ids: FMH_Ids,
                        termslistarray: termwise === 1 ? (data.termIds || []).map((termId) => ({ FMT_Id: termId })) : undefined,
                        fillgrouparray:
                            termwise === 1 ? (data.groupIds || []).map((groupId) => ({ FMG_Id: groupId, FMG_GroupName: '' })) : undefined,
                        active: data.Active || 0,
                        deactive: data.Deactive || 0,
                        left: data.left || 0,
                        termswise: termwise || 0,
                        userid: userid
                    };
                    break;
                }

                case 'transport': {
                    // Set header_list from all installments
                    feeInstallments.forEach((inst) => {
                        header_list.push(inst);
                    });

                    // Get selected heads (FMH_Ids)
                    FMH_Ids = data.headIds || [];

                    // Get route name
                    const route = busroutedata?.data?.find((r) => r.trmR_Id === data.busrouteid);
                    routename = route ? `${route.trmR_RouteNo} : ${route.trmR_RouteName}` : '';

                    payload = {
                        ASMAY_Id: Number(data.academicYearId),
                        FTI_Id: 0,
                        ASMCL_Id: 0,
                        ASMS_Id: 0,
                        FMCC_Id: 0,
                        reporttype: selectedCatg,
                        FMG_Id: data.fmg_id || 0,
                        // TRMR_Id: data.busrouteid || 0,
                        TRMR_Id: 1,
                        temparrayinst1: albumNameArraygroupids,
                        FMGG_Ids: FMH_Ids,
                        termslistarray: undefined,
                        fillgrouparray: undefined,
                        active: 0,
                        deactive: 0,
                        left: 0,
                        termswise: 0,
                        userid: 30457
                    };
                    break;
                }

                case 'GroupWise': {
                    // Set fillgrouparrayname from selected groups
                    feeGroups.forEach((group) => {
                        if (data.groupIdsNew?.includes(group.fmG_Id)) {
                            fillgrouparrayname.push({
                                FMG_Id: group.fmG_Id,
                                FMG_GroupName: group.fmg_groupname
                            });
                        }
                    });

                    payload = {
                        ASMAY_Id: Number(data.academicYearId),
                        FTI_Id: 0,
                        ASMCL_Id: data.classId || 0,
                        ASMS_Id: data.sectionId || 0,
                        FMCC_Id: 0,
                        reporttype: selectedCatg,
                        FMG_Id: 0,
                        TRMR_Id: 0,
                        temparrayinst1: albumNameArraygroupids,
                        FMGG_Ids: FMH_Ids,
                        termslistarray: undefined,
                        fillgrouparray: fillgrouparrayname,
                        active: data.Active || 0,
                        deactive: data.Deactive || 0,
                        left: data.left || 0,
                        termswise: 0,
                        userid: userid
                    };
                    break;
                }

                case 'Consolidate': {
                    // Handle classarray and sectionarray
                    const classarray: { ASMCL_Id: number }[] = [];
                    const sectionarray: { ASMS_Id: number }[] = [];

                    if (!data.classId || data.classId === 0) {
                        // Include all classes
                        classes.forEach((cls) => {
                            classarray.push({ ASMCL_Id: cls.asmcL_Id });
                        });
                    } else {
                        classarray.push({ ASMCL_Id: data.classId });
                    }

                    if (!data.sectionId || data.sectionId === 0) {
                        // Include all sections
                        sections.forEach((sec) => {
                            sectionarray.push({ ASMS_Id: sec.asmS_Id });
                        });
                    } else {
                        sectionarray.push({ ASMS_Id: data.sectionId });
                    }

                    // Format dates
                    const todate1 = filters.toDate.toISOString().split('T')[0];
                    const fromdate1 = filters.fromDate.toISOString().split('T')[0];
                    // const fromdate1= "2024-11-01";
                    // const todate1 ="2024-12-30"

                    payload = {
                        ASMAY_Id: Number(data.academicYearId),
                        classarray: data.con === 'Datewise' ? [] : classarray,
                        sectionarray: data.con === 'Datewise' ? [] : sectionarray,
                        reporttype: selectedCatg,
                        todate: todate1,
                        fromdate: fromdate1,
                        con: data.con,
                        userid: userid
                    };
                    break;
                }
            }

            console.log('Generated payload for', selectedCatg, ':', JSON.stringify(payload, null, 2));
            console.log('Route name:', routename);

            const apiData = await getInstallmentReportDetails(payload);

            console.log('API response:', apiData);

            // This should be selectedInstallmentData (not selectedInstallmentDataNew)
            // And useMemo should be outside the async function

            // Define the transform function
            // const transformReportData = (apiData: any, selectedInstallmentData: any[]) => {
            //     if (!apiData || !apiData.data || !apiData.data.list) return [];

            //     // Group students by ID first
            //     const studentsMap: { [key: number]: any } = {};

            //     apiData.data.list.forEach((record: any) => {
            //         const studentId = record.amsT_Id;

            //         if (!studentsMap[studentId]) {
            //             studentsMap[studentId] = {
            //                 ...record,
            //                 installments: {} as { [key: number]: any }
            //             };
            //         }

            //         // Store this installment data
            //         studentsMap[studentId].installments[record.ftI_Id] = {
            //             net: record.netamount || 0,
            //             paid: record.paid || 0,
            //             balance: record.balance || 0,
            //             concession: record.concession || 0,
            //             fine: record.fine || 0,
            //             waiver: record.waivedoff || 0,
            //             opening: 0,
            //             net2: record.netamount || 0,
            //             paid2: record.paid || 0,
            //             balance2: record.balance || 0
            //         };
            //     });

            //     // Convert to array and calculate totals from selected installments only
            //     const result = Object.values(studentsMap).map((student: any, index: number) => {
            //         let totalBalance = 0;
            //         let totalAmount = 0;

            //         const studentRow = {
            //             id: student.amsT_Id || index + 1,
            //             rollNo: student.amaY_RollNo || index + 1,
            //             studentName: (student.amsT_FirstName || '').trim(),
            //             admNo: student.amsT_AdmNo || '',
            //             className: student.asmcL_ClassName || '',
            //             sectionName: student.asmC_SectionName || '',
            //             balance: 0,
            //             total: 0,
            //             installments: {} as { [key: number]: any }
            //         };

            //         // Only add data for selected installments
            //         selectedInstallmentData.forEach((inst: any) => {
            //             const instData = student.installments[inst.ftI_Id];

            //             if (instData) {
            //                 // Student has data for this selected installment
            //                 studentRow.installments[inst.ftI_Id] = instData;
            //                 totalBalance += instData.balance || 0;
            //                 totalAmount += instData.net || 0;
            //             } else {
            //                 // Student doesn't have data - show zeros
            //                 studentRow.installments[inst.ftI_Id] = {
            //                     net: 0,
            //                     paid: 0,
            //                     balance: 0,
            //                     concession: 0,
            //                     fine: 0,
            //                     waiver: 0,
            //                     opening: 0,
            //                     net2: 0,
            //                     paid2: 0,
            //                     balance2: 0
            //                 };
            //             }
            //         });

            //         studentRow.balance = totalBalance;
            //         studentRow.total = totalAmount;

            //         return studentRow;
            //     });

            //     return result;
            // };

            // // Transform the API data - use apiData, not response
            // const transformedData = transformReportData(apiData, selectedInstallmentData);
            // setReportData(transformedData);

            const transformReportData = (apiData: any, selectedInstallmentData: any[]) => {
                if (!apiData || !apiData.data || !apiData.data.list) return [];

                // Group students by ID first
                const studentsMap: { [key: number]: any } = {};

                apiData.data.list.forEach((record: any) => {
                    const studentId = record.amsT_Id;

                    if (!studentsMap[studentId]) {
                        studentsMap[studentId] = {
                            ...record,
                            installments: {} as { [key: number]: any }
                        };
                    }

                    // Store this installment data
                    studentsMap[studentId].installments[record.ftI_Id] = {
                        net: record.netamount || 0,
                        paid: record.paid || 0,
                        balance: record.balance || 0,
                        concession: record.concession || 0,
                        fine: record.fine || 0,
                        waiver: record.waivedoff || 0,
                        opening: 0,
                        net2: record.netamount || 0,
                        paid2: record.paid || 0,
                        balance2: record.balance || 0
                    };
                });

                // Get selected installment IDs
                const selectedInstallmentIds = selectedInstallmentData.map((inst) => inst.ftI_Id);

                // Convert to array, calculate totals, and filter students
                const allStudents = Object.values(studentsMap).map((student: any, index: number) => {
                    let totalBalance = 0;
                    let totalAmount = 0;
                    let hasSelectedInstallmentData = false; // Track if student has data for selected installments

                    const studentRow = {
                        id: student.amsT_Id || index + 1,
                        rollNo: student.amaY_RollNo || index + 1,
                        studentName: (student.amsT_FirstName || '').trim(),
                        admNo: student.amsT_AdmNo || '',
                        className: student.asmcL_ClassName || '',
                        sectionName: student.asmC_SectionName || '',
                        balance: 0,
                        total: 0,
                        installments: {} as { [key: number]: any }
                    };

                    // Only add data for selected installments
                    selectedInstallmentData.forEach((inst: any) => {
                        const instData = student.installments[inst.ftI_Id];

                        if (instData) {
                            // Student has data for this selected installment
                            studentRow.installments[inst.ftI_Id] = instData;
                            totalBalance += instData.balance || 0;
                            totalAmount += instData.net || 0;
                            hasSelectedInstallmentData = true; // Mark that student has data
                        } else {
                            // Student doesn't have data - show zeros
                            studentRow.installments[inst.ftI_Id] = {
                                net: 0,
                                paid: 0,
                                balance: 0,
                                concession: 0,
                                fine: 0,
                                waiver: 0,
                                opening: 0,
                                net2: 0,
                                paid2: 0,
                                balance2: 0
                            };
                        }
                    });

                    studentRow.balance = totalBalance;
                    studentRow.total = totalAmount;

                    // Add a flag to track if this student should be included
                    return {
                        ...studentRow,
                        _hasSelectedInstallmentData: hasSelectedInstallmentData
                    };
                });

                // Filter out students who don't have any data for selected installments
                const filteredStudents = allStudents.filter((student) => student._hasSelectedInstallmentData);

                // Remove the temporary flag
                const finalResult = filteredStudents.map(({ _hasSelectedInstallmentData, ...student }) => student);

                return finalResult;
            };

            // Transform the API data
            let transformedData: any;
            //const transformedData = transformReportData(apiData, selectedInstallmentData);

            if (selectedCatg === 'transport') {
                if (selectedInstallmentData.length === 0) {
                    transformedData = transformReportData(apiData, selectedInstallmentDataall);
                }
            } else {
                transformedData = transformReportData(apiData, selectedInstallmentData);
            }

            const responseJson = typeof apiData === 'string' ? JSON.parse(apiData) : apiData;

            if (selectedCatg === 'Consolidate') {
                if (responseJson?.data?.list && Array.isArray(responseJson.data.list)) {
                    toast.success('Report generated successfully');
                    // Create a map to group and sum data by fmT_Id
                    const consolidatedMap = new Map();

                    responseJson.data.list.forEach((item: any) => {
                        const termId = item.fmT_Id;

                        if (!consolidatedMap.has(termId)) {
                            // First entry for this term
                            consolidatedMap.set(termId, {
                                id: termId,
                                slNo: consolidatedMap.size + 1,
                                termsName: item.fmT_Name,
                                todayPaidCount: item.todayPaidCount || 0,
                                todayCollection: item.todayCollection || 0,
                                stillNowPaidCount: item.tillNowPaidCount || 0,
                                stillNowCollection: item.tillNowTotalCollection || 0,
                                totalStrength: item.totalStrength || 0,
                                defaulters: item.defaulters || 0
                            });
                        } else {
                            // Sum up the existing data
                            const existing = consolidatedMap.get(termId);
                            existing.todayPaidCount += item.todayPaidCount || 0;
                            existing.todayCollection += item.todayCollection || 0;
                            existing.stillNowPaidCount += item.tillNowPaidCount || 0;
                            existing.stillNowCollection += item.tillNowTotalCollection || 0;
                            existing.totalStrength += item.totalStrength || 0;
                            existing.defaulters += item.defaulters || 0;
                        }
                    });

                    // Convert map to array
                    const consolidatedData = Array.from(consolidatedMap.values());
                    setReportData(consolidatedData);
                    setShowReport(true);
                } else {
                    // Fallback to static data
                    setReportData([]);
                    toast.error('No data found');
                }
            } else if ((selectedCatg === 'Category' || selectedCatg === 'Class') && !termwise) {
                if (transformedData != null && transformedData.length > 0) {
                    toast.success('Report generated successfully');
                    setReportData(transformedData);
                    setShowReport(true);
                } else {
                    // Fallback to static data
                    setReportData([]);
                    toast.error('No data found');
                }
            } else if (selectedCatg === 'Category' && termwise) {
                const transformReportDatanew = (apiData: any[]) => {
                    return apiData.map((item, index) => ({
                        id: index, // Use unique ID
                        slNo: index + 1,
                        studentName: item.studentName || '',
                        admissionNo: item.admno || '',
                        className: item.asmcL_ClassName || '',
                        section: item.asmC_SectionName || '',
                        term: item.fmT_Name || '',
                        payableAmount: item.payableAmount || 0,
                        paidAmount: item.paidAmount || 0,
                        balanceAmount: item.balance || 0,
                        adjustedAmount: item.adjustedAmount || 0,
                        concessionAmount: item.concessionAmount || 0,
                        waivedAmount: item.waivedAmount || 0,
                        refundAmount: item.refundAmount || 0
                    }));
                };
                let dataToTransform: any[] = [];

                if (apiData && (apiData as any).data?.list && Array.isArray((apiData as any).data.list)) {
                    dataToTransform = (apiData as any).data.list;
                }
                const transformedDatanew = transformReportDatanew(dataToTransform);
                setReportData(transformedDatanew);
                setShowReport(true);

                if (transformedDatanew != null && transformedDatanew.length > 0) {
                    toast.success('Report generated successfully');
                    setReportData(transformedDatanew);
                    setShowReport(true);
                } else {
                    // Fallback to static data
                    setReportData([]);
                    toast.error('No data found');
                }
            } else if (selectedCatg === 'transport') {
                if (transformedData != null && transformedData.length > 0) {
                    toast.success('Report generated successfully');
                    setReportData(transformedData);
                    setShowReport(true);
                } else {
                    // Fallback to static data
                    setReportData([]);
                    toast.error('No data found');
                }
            }
            // For demo, use static data
            // if (selectedCatg === 'Consolidate') {
            //     setReportData(staticConsolidateData);
            // } else {
            //     setReportData(staticReportData);
            // }
        } catch (error: any) {
            console.error('Error generating report:', error);
            toast.error(error.message || 'Failed to generate report');
            setShowReport(false);
        }

        // finally {
        //     setShowReport(false);
        //     // setReportLoading(false);

        //     // toast.success('Report generated successfully');

        //     setTimeout(() => {
        //         window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        //     }, 100);
        // }

        // In onSubmit, set data based on catg:
        // if (selectedCatg === 'Consolidate') {
        //     setReportData(staticConsolidateData);
        // } else {
        //     const payload = {
        //         userid: 1, // Assuming user ID is 1, you might want to get this from context/auth
        //         active: data.Active, // Assuming termswise checkbox indicates active
        //         deactive: data.Deactive, // Adjust based on your logic
        //         left: data.left,
        //         termswise: watch('termswise') || 0,
        //         ASMAY_Id: Number(data.academicYearId),
        //         ASMCL_Id: data.classId || 0,
        //         ASMS_Id: data.sectionId || 0,
        //         termslistarray: (data.termIds || []).map((termId) => ({ fmT_Id: termId })),
        //         fillgrouparray: (data.groupIds || []).map((groupId) => ({ fmG_Id: groupId })),
        //         classarray: data.classId ? [{ asmcL_Id: data.classId }] : [{ asmcL_Id: 0 }]
        //     };

        //     console.log('payloaddatanotconsolidated', JSON.stringify(payload));

        //     setReportData(staticReportData); // Detailed
        // }

        // setReportData(staticReportData);
        //setShowReport(true);
        // setReportLoading(false);
        //setLoading(false);

        //toast.success('Report generated successfully');

        // Auto scroll to report
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    // const isAcademicYearSelected = !!filters.academicYearId;
    const isAcademicYearSelected = watch('academicYearId');

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            <div className='space-y-8'>
                                {/* User Type Card */}
                                <Card className='border bg-gray-50 p-5 shadow-sm'>
                                    <div className='flex flex-wrap items-center justify-center gap-10'>
                                        <Controller
                                            name='catg'
                                            control={control}
                                            render={({ field }) => (
                                                <div className='flex flex-wrap items-center justify-center gap-10'>
                                                    {userTypeOptions.map(({ label, value }) => (
                                                        <label key={value} className='flex cursor-pointer items-center gap-3'>
                                                            <input
                                                                type='radio'
                                                                name={field.name} // IMPORTANT
                                                                value={value}
                                                                checked={field.value === value}
                                                                onChange={() => field.onChange(value)}
                                                                className='h-5 w-5 accent-primary'
                                                            />
                                                            <span className='font-medium text-base'>{label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        />
                                    </div>
                                </Card>
                                {selectedCatg === 'Consolidate' && (
                                    <Card className='border bg-gray-50 p-5 shadow-sm'>
                                        <div className='flex flex-wrap items-center justify-center gap-10'>
                                            <Controller
                                                name='con'
                                                control={control}
                                                render={({ field }) => (
                                                    <div className='flex flex-wrap items-center justify-center gap-10'>
                                                        {conOptions.map(({ label, value }) => (
                                                            <label key={value} className='flex cursor-pointer items-center gap-3'>
                                                                <input
                                                                    type='radio'
                                                                    name={field.name} // IMPORTANT
                                                                    value={value}
                                                                    checked={field.value === value}
                                                                    onChange={() => field.onChange(value)}
                                                                    className='h-5 w-5 accent-primary'
                                                                />
                                                                <span className='font-medium text-base'>{label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </Card>
                                )}

                                <div className='flex items-center gap-12'>
                                    {/* Academic Year */}
                                    <div className='flex w-[420px] items-center gap-4'>
                                        <Label className='w-36 text-right'>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>

                                        <div className='flex-1'>
                                            <Controller
                                                name='academicYearId'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value?.toString()}
                                                        onValueChange={(v) => field.onChange(Number(v))}>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder='--Select Academic Year--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {academicYears.map((item) => (
                                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                    {item.asmaY_Year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.academicYearId && <FormError>{errors.academicYearId.message}</FormError>}
                                        </div>
                                    </div>

                                    {(selectedCatg === 'Class' || selectedCatg === 'Category') && (
                                        <div className='flex items-center gap-3'>
                                            <Controller
                                                name='termswise'
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type='checkbox'
                                                        checked={field.value === 1}
                                                        onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                                                        className='h-4 w-4'
                                                    />
                                                )}
                                            />
                                            <Label className='font-medium'>Terms Wise</Label>
                                        </div>
                                    )}

                                    {selectedCatg === 'GroupWise' && (
                                        <>
                                            <div className='flex items-center gap-3'>
                                                <Controller
                                                    name='Active'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input
                                                            type='checkbox'
                                                            checked={field.value === 1}
                                                            onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                                                            className='h-4 w-4'
                                                        />
                                                    )}
                                                />
                                                <Label className='font-medium'>Active</Label>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <input type='hidden' {...register('headIds')} />
                                                <Controller
                                                    name='Deactive'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input
                                                            type='checkbox'
                                                            checked={field.value === 1}
                                                            onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                                                            className='h-4 w-4'
                                                        />
                                                    )}
                                                />
                                                <Label className='font-medium'>De-Active</Label>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <Controller
                                                    name='left'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input
                                                            type='checkbox'
                                                            checked={field.value === 1}
                                                            onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                                                            className='h-4 w-4'
                                                        />
                                                    )}
                                                />
                                                <Label className='font-medium'>Left</Label>
                                            </div>
                                        </>
                                    )}

                                    {selectedCatg === 'transport' && (
                                        <div className='flex items-center gap-12'>
                                            <>
                                                <Label className='w-36 text-right'>
                                                    Fee Head <span className='text-red-500'>*</span>
                                                </Label>
                                                <input type='hidden' {...register('headIds')} />
                                                <Card className={cn('w-[420px] border bg-gray-50 p-4', errors.headIds)}>
                                                    <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                        {/* <Label
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
                                                </Label> */}

                                                        {headsloading ? (
                                                            <div className='py-6 text-center text-gray-500'>Loading...</div>
                                                        ) : heads.length > 0 ? (
                                                            heads.map((hd) => (
                                                                <Label
                                                                    key={hd.fmH_Id}
                                                                    htmlFor={`hd-${hd.fmH_Id}`}
                                                                    className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                    <Checkbox
                                                                        id={`hd-${hd.fmH_Id}`}
                                                                        // checked={filters.headIds.includes(hd.fmH_Id)}
                                                                        checked={headIds.includes(hd.fmH_Id)}
                                                                        onCheckedChange={() => toggleHeads(hd.fmH_Id)}
                                                                    />
                                                                    <span className='text-sm'>{hd.fmH_FeeName}</span>
                                                                </Label>
                                                            ))
                                                        ) : (
                                                            <div className='py-4 text-center text-gray-500'>No fee heads found</div>
                                                        )}
                                                    </div>
                                                </Card>
                                                {errors.headIds && <FormError className='mt-1'>{errors.headIds.message}</FormError>}
                                            </>
                                        </div>
                                    )}

                                    {selectedCatg === 'Consolidate' && selectedCon === 'Datewise' && (
                                        <>
                                            <div className='flex w-[420px] items-center gap-4'>
                                                <Label htmlFor='fromDate'>
                                                    From Date: <span className='text-red-500'>*</span>
                                                </Label>
                                                <Input
                                                    id='fromDate'
                                                    type='date'
                                                    value={filters.fromDate.toISOString().split('T')[0]}
                                                    onChange={(e) =>
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            fromDate: new Date(e.target.value)
                                                        }))
                                                    }
                                                    className='rounded border px-3 py-1'
                                                />
                                            </div>
                                            <div className='flex w-[420px] items-center gap-4'>
                                                <Label htmlFor='fromDate'>
                                                    To Date: <span className='text-red-500'>*</span>
                                                </Label>
                                                <Input
                                                    id='toDate'
                                                    type='date'
                                                    value={filters.toDate.toISOString().split('T')[0]}
                                                    onChange={(e) =>
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            toDate: new Date(e.target.value)
                                                        }))
                                                    }
                                                    className='rounded border px-3 py-1'
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {(selectedCatg === 'Class' || selectedCatg === 'GroupWise' || selectedCon === 'Classwise') && (
                                    <div className='mt-4 flex items-center gap-12'>
                                        {/* Class */}
                                        <div className='flex w-[420px] items-center gap-4'>
                                            <Label className='w-36 text-right'>
                                                Class <span className='text-red-500'>*</span>
                                            </Label>

                                            <div className='flex-1'>
                                                <Controller
                                                    name='classId'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value ? field.value.toString() : ''}
                                                            onValueChange={(v) => {
                                                                field.onChange(Number(v));
                                                                setValue('sectionId', 0);
                                                            }}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='--Select Class--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {classes.map((cls) => (
                                                                    <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                                        {cls.asmcL_ClassName}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.classId && <FormError>{errors.classId.message}</FormError>}
                                            </div>
                                        </div>

                                        {/* Section */}
                                        <div className='flex w-[420px] items-center gap-4'>
                                            <Label className='w-36 text-right'>
                                                Section <span className='text-red-500'>*</span>
                                            </Label>

                                            <div className='flex-1'>
                                                <Controller
                                                    name='sectionId'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value ? field.value.toString() : ''}
                                                            onValueChange={(v) => field.onChange(Number(v))}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='--All--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {sections.map((sec) => (
                                                                    <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>
                                                                        {sec.asmC_SectionName}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.sectionId && <FormError>{errors.sectionId.message}</FormError>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedCatg === 'GroupWise' && (
                                    <div className='flex items-center gap-12'>
                                        <>
                                            {/* <Label className='w-36 text-right'>
                                                Group <span className='text-red-500'>*</span>
                                            </Label>
                                            <input type="hidden" {...register('groupIds')} />
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

                                                    {groupsloading ? (
                                                        <div className='py-6 text-center text-gray-500'>Loading...</div>
                                                    ) : feeGroups.length > 0 ? (
                                                        feeGroups.map((grp) => (
                                                            <Label
                                                                key={grp.fmG_Id}
                                                                htmlFor={`installment-${grp.fmG_Id}`}
                                                                className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                <Checkbox
                                                                    id={`groups-${grp.fmG_Id}`}
                                                                    // checked={filters.groupIds.includes(grp.fmG_Id)}

                                                                    checked={groupIds.includes(grp.fmG_Id)}
                                                                    onCheckedChange={() => toggleInstallment(grp.fmG_Id)}
                                                                />
                                                                <span className='text-sm'>{grp.fmg_groupname}</span>
                                                            </Label>
                                                        ))
                                                    ) : (
                                                        <div className='py-4 text-center text-gray-500'>No Groups</div>
                                                    )}
                                                </div>
                                            </Card> */}

                                            <Label className='w-24 pt-2 text-right'>
                                                Group <span className='text-red-500'>*</span>
                                            </Label>
                                            <input type='hidden' {...register('groupIdsNew')} />
                                            <Card className={cn('w-[360px] border bg-gray-50 p-4', errors.groupIdsNew)}>
                                                <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                    {feeGroups.length > 0 && (
                                                        <Label className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-100'>
                                                            <Checkbox
                                                                checked={isAllGroupsSelectedNew}
                                                                onCheckedChange={toggleAllGroupsnew}
                                                            />
                                                            <span>Select All</span>
                                                        </Label>
                                                    )}
                                                    {groupsloading ? (
                                                        <div className='py-6 text-center text-gray-500'>Loading...</div>
                                                    ) : feeGroups.length > 0 ? (
                                                        feeGroups.map((grp) => (
                                                            <Label
                                                                key={grp.fmG_Id}
                                                                htmlFor={`group-${grp.fmG_Id}`}
                                                                className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                <Checkbox
                                                                    id={`group-${grp.fmG_Id}`}
                                                                    //checked={filters.groupIds.includes(grp.fmG_Id)}

                                                                    checked={groupIdsnew.includes(grp.fmG_Id)}
                                                                    onCheckedChange={() => togglegroupsnew(grp.fmG_Id)}
                                                                />
                                                                <span className='text-sm'>{grp.fmg_groupname}</span>
                                                            </Label>
                                                        ))
                                                    ) : (
                                                        <div className='py-4 text-center text-gray-500'>No Groups</div>
                                                    )}
                                                </div>
                                            </Card>
                                            {errors.groupIdsNew && <FormError className='mt-1'>{errors.groupIdsNew.message}</FormError>}
                                        </>
                                    </div>
                                )}

                                {selectedCatg === 'Category' && (
                                    <div className='flex items-center gap-12'>
                                        <div className='flex w-[420px] items-center gap-4'>
                                            <Label className='w-36 text-right'>
                                                Category <span className='text-red-500'>*</span>
                                            </Label>

                                            <div className='flex-1'>
                                                <Controller
                                                    name='fmcc_id'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => {
                                                                field.onChange(Number(value) || '');
                                                            }}
                                                            value={field.value?.toString() || undefined}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='--Select Category--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {categoryloading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading Category...
                                                                    </SelectItem>
                                                                ) : categoryerror ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading Category
                                                                    </SelectItem>
                                                                ) : (
                                                                    categorydropdowndata?.data?.map((item) => (
                                                                        <SelectItem key={item.fmcC_Id} value={item.fmcC_Id.toString()}>
                                                                            {item.fmcC_ClassCategoryName}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.fmcc_id && <FormError>{errors.fmcc_id.message}</FormError>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedCatg === 'transport' && (
                                    <div className='flex items-center gap-12'>
                                        <div className='flex w-[420px] items-center gap-4'>
                                            <Label className='w-36 text-right'>
                                                Group <span className='text-red-500'>*</span>
                                            </Label>

                                            <div className='flex-1'>
                                                <Controller
                                                    name='fmg_id'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            // onValueChange={(value) => {
                                                            //     field.onChange(Number(value) || '');
                                                            // }}
                                                            // value={field.value?.toString() || undefined}
                                                            value={field.value ? String(field.value) : undefined}
                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                field.onChange(Number.isNaN(num) ? undefined : num);
                                                            }}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='--Select Group--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {groupsloading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading Groups...
                                                                    </SelectItem>
                                                                ) : categoryerror ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading Groups
                                                                    </SelectItem>
                                                                ) : (
                                                                    groupsdata?.data?.map((item) => (
                                                                        <SelectItem key={item.fmG_Id} value={item.fmG_Id.toString()}>
                                                                            {item.fmg_groupname}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.fmg_id && <FormError>{errors.fmg_id.message}</FormError>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedCatg === 'transport' && (
                                    <div className='flex items-center gap-12'>
                                        <div className='flex w-[420px] items-center gap-4'>
                                            <Label className='w-36 text-right'>
                                                Bus Route <span className='text-red-500'>*</span>
                                            </Label>

                                            <div className='flex-1'>
                                                <Controller
                                                    name='busrouteid'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => {
                                                                field.onChange(Number(value) || '');
                                                            }}
                                                            value={field.value?.toString() || undefined}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='--Select Bus Route--' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {busrouteLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading Bus Routes...
                                                                    </SelectItem>
                                                                ) : busrouteError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading Bus Routes
                                                                    </SelectItem>
                                                                ) : (
                                                                    busroutedata?.data?.map((item) => (
                                                                        <SelectItem key={item.trmR_Id} value={item.trmR_Id.toString()}>
                                                                            {item.trmR_RouteNo}:{item.trmR_RouteName}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.busrouteid && <FormError>{errors.busrouteid.message}</FormError>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {(selectedCatg === 'Class' || selectedCatg === 'Category') && termwise !== 1 && (
                                    <div className='mt-4 flex items-start gap-6'>
                                        {/* Label */}
                                        <Label className='w-40 text-right'>
                                            Installment Name <span className='text-red-500'>*</span>
                                        </Label>

                                        {/* Card + Error (COLUMN) */}
                                        <div className='flex flex-col'>
                                            {/* Hidden register */}
                                            <input type='hidden' {...register('installmentIds')} />

                                            {/* Card */}
                                            <Card className={cn('w-[420px] border bg-gray-50 p-4', errors.installmentIds)}>
                                                <div className='mb-3'>
                                                    <Input
                                                        type='text'
                                                        placeholder='Search installments...'
                                                        value={installmentSearch}
                                                        onChange={(e) => setInstallmentSearch(e.target.value)}
                                                        className='w-full'
                                                    />
                                                </div>

                                                {/* Select All Option */}
                                                {filteredInstallments.length > 0 && (
                                                    <div className='mb-3 border-b pb-2'>
                                                        <Label className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                            <Checkbox
                                                                checked={
                                                                    filteredInstallments.length > 0 &&
                                                                    filteredInstallments.every((installment) =>
                                                                        watch('installmentIds')?.includes(installment.ftI_Id)
                                                                    )
                                                                }
                                                                onCheckedChange={(checked: any) => {
                                                                    if (checked) {
                                                                        // Select all filtered installments
                                                                        const currentIds = watch('installmentIds') || [];
                                                                        const filteredIds = filteredInstallments.map((i) => i.ftI_Id);
                                                                        const newIds = [...new Set([...currentIds, ...filteredIds])];
                                                                        setValue('installmentIds', newIds);
                                                                    } else {
                                                                        // Deselect all filtered installments
                                                                        const currentIds = watch('installmentIds') || [];
                                                                        const filteredIds = filteredInstallments.map((i) => i.ftI_Id);
                                                                        const newIds = currentIds.filter((id) => !filteredIds.includes(id));
                                                                        setValue('installmentIds', newIds);
                                                                    }
                                                                }}
                                                            />
                                                            <span className='font-mediu text-sm'>
                                                                <strong>Select All</strong>
                                                            </span>
                                                            <span className='text-gray-500 text-xs'>
                                                                ({filteredInstallments.length} installments)
                                                            </span>
                                                        </Label>
                                                    </div>
                                                )}

                                                <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                    {feeInstallmentLoading ? (
                                                        <div className='py-6 text-center text-gray-500'>Loading...</div>
                                                    ) : filteredInstallments.length > 0 ? (
                                                        filteredInstallments.map((installment) => (
                                                            <Label
                                                                key={installment.ftI_Id}
                                                                htmlFor={`installment-${installment.ftI_Id}`}
                                                                className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                <Checkbox
                                                                    id={`installment-${installment.ftI_Id}`}
                                                                    checked={watch('installmentIds')?.includes(installment.ftI_Id)}
                                                                    onCheckedChange={() => toggleInstallment(installment.ftI_Id)}
                                                                />
                                                                <span className='text-sm'>{installment.ftI_Name}</span>
                                                            </Label>
                                                        ))
                                                    ) : (
                                                        <div className='py-4 text-center text-gray-500'>
                                                            {installmentSearch ? 'No installments found' : 'No installments'}
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>

                                            {/* Error BELOW */}
                                            {errors.installmentIds && (
                                                <FormError className='mt-1'>{errors.installmentIds.message}</FormError>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {termwise === 1 && (
                                    <div className='mt-4 flex items-start gap-12'>
                                        {/* TERMS */}
                                        <div className='flex items-start gap-4'>
                                            <Label className='w-24 pt-2 text-right'>
                                                Terms <span className='text-red-500'>*</span>
                                            </Label>
                                            <input type='hidden' {...register('termIds')} />

                                            <Card className={cn('w-[360px] border bg-gray-50 p-4', errors.termIds)}>
                                                <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                    {feeTerms.length > 0 && (
                                                        <Label className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-100'>
                                                            <Checkbox checked={isAllTermsSelected} onCheckedChange={toggleAllTerms} />
                                                            <span>Select All</span>
                                                        </Label>
                                                    )}
                                                    {termsloading ? (
                                                        <div className='py-6 text-center text-gray-500'>Loading...</div>
                                                    ) : feeTerms?.length > 0 ? (
                                                        feeTerms.map((terms) => (
                                                            <Label
                                                                key={terms.fmT_Id}
                                                                htmlFor={`term-${terms.fmT_Id}`}
                                                                className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                <Checkbox
                                                                    id={`term-${terms.fmT_Id}`}
                                                                    //checked={filters.termIds.includes(terms.fmT_Id)}
                                                                    checked={termIds.includes(terms.fmT_Id)}
                                                                    onCheckedChange={() => toggleterms(terms.fmT_Id)}
                                                                />
                                                                <span className='text-sm'>{terms.fmT_Name}</span>
                                                            </Label>
                                                        ))
                                                    ) : (
                                                        <div className='py-4 text-center text-gray-500'>No Terms</div>
                                                    )}
                                                </div>
                                            </Card>
                                            {errors.termIds && <FormError className='mt-1'>{errors.termIds.message}</FormError>}
                                        </div>

                                        {/* GROUP */}
                                        <div className='flex items-start gap-4'>
                                            <Label className='w-24 pt-2 text-right'>
                                                Group <span className='text-red-500'>*</span>
                                            </Label>
                                            <input type='hidden' {...register('groupIds')} />
                                            <Card className={cn('w-[360px] border bg-gray-50 p-4', errors.groupIds)}>
                                                <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                    {feeGroups.length > 0 && (
                                                        <Label className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-100'>
                                                            <Checkbox checked={isAllGroupsSelected} onCheckedChange={toggleAllGroups} />
                                                            <span>Select All</span>
                                                        </Label>
                                                    )}
                                                    {groupsloading ? (
                                                        <div className='py-6 text-center text-gray-500'>Loading...</div>
                                                    ) : feeGroups.length > 0 ? (
                                                        feeGroups.map((grp) => (
                                                            <Label
                                                                key={grp.fmG_Id}
                                                                htmlFor={`group-${grp.fmG_Id}`}
                                                                className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                <Checkbox
                                                                    id={`group-${grp.fmG_Id}`}
                                                                    //checked={filters.groupIds.includes(grp.fmG_Id)}

                                                                    checked={groupIds.includes(grp.fmG_Id)}
                                                                    onCheckedChange={() => togglegroups(grp.fmG_Id)}
                                                                />
                                                                <span className='text-sm'>{grp.fmg_groupname}</span>
                                                            </Label>
                                                        ))
                                                    ) : (
                                                        <div className='py-4 text-center text-gray-500'>No Groups</div>
                                                    )}
                                                </div>
                                            </Card>
                                            {errors.groupIds && <FormError className='mt-1'>{errors.groupIds.message}</FormError>}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className='flex justify-end gap-4 border-t pt-8'>
                                        <Button size='lg' variant='outline' className='px-8' onClick={() => window.location.reload()}>
                                            Cancel
                                        </Button>
                                        <Button type='submit' disabled={isSubmitting} className='px-12'>
                                            {isSubmitting ? 'Generating...' : 'Report'}
                                        </Button>
                                    </div>
                                    {showReport && (
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-10 rounded-lg border bg-white shadow-xl'>
                                                {/* Dynamic Sub-Header Based on Selection */}
                                                <div className='flex items-center justify-between border-b bg-gray-50 px-8 py-4'>
                                                    <h2 className='whitespace-nowrap font-bold text-2xl text-primary'>
                                                        {/* {selectedCatg === 'Consolidate'
                                                            ? 'CONSOLIDATE REPORT'
                                                            : `REPORT FOR ${selectedCatg === 'Category'
                                                                ? categorydropdowndata?.data?.find(
                                                                    (cat) => cat.fmcC_Id === watch('fmcc_id')
                                                                )?.fmcC_ClassCategoryName || ''
                                                                : classes.find((cls) => cls.asmcL_Id === watch('classId'))
                                                                    ?.asmcL_ClassName || ''
                                                            }${watch('sectionId')
                                                                ? ` ${sections.find((sec) => sec.asmS_Id === watch('sectionId'))
                                                                    ?.asmC_SectionName || ''
                                                                }`
                                                                : ''
                                                                
                                                            }`} */}

                                                        {['Consolidate', 'Category', 'transport', 'otherCategory'].includes(selectedCatg) &&
                                                            (selectedCatg === 'Consolidate'
                                                                ? 'CONSOLIDATE REPORT'
                                                                : selectedCatg === 'Category'
                                                                  ? `REPORT FOR ${
                                                                        categorydropdowndata?.data?.find(
                                                                            (cat) => cat.fmcC_Id === watch('fmcc_id')
                                                                        )?.fmcC_ClassCategoryName || ''
                                                                    }${
                                                                        watch('sectionId')
                                                                            ? ` ${
                                                                                  sections.find((sec) => sec.asmS_Id === watch('sectionId'))
                                                                                      ?.asmC_SectionName || ''
                                                                              }`
                                                                            : ''
                                                                    }`
                                                                  : // Add other header formats for other categories here
                                                                    `REPORT FOR ${selectedCatg.toUpperCase()}`)}
                                                    </h2>

                                                    <div className='flex gap-2'>
                                                        <Button size='sm' onClick={handleExportAlltype} className='h-8 px-3 text-xs'>
                                                            Export Excel
                                                        </Button>

                                                        <Button
                                                            size='sm'
                                                            variant='outline'
                                                            onClick={handlePrintAlltype}
                                                            className='h-8 px-3 text-xs'>
                                                            Export PDF
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Detailed Student Table for Category/Class Wise (Non-Terms Wise) */}
                                                {showReport &&
                                                    (selectedCatg === 'Category' || selectedCatg === 'Class') &&
                                                    termwise !== 1 &&
                                                    selectedInstallmentData.length > 0 && (
                                                        <div className='overflow-x-auto px-8 pb-8'>
                                                            <table className='w-full border-collapse border border-gray-300 text-sm'>
                                                                <thead className='bg-primary text-white'>
                                                                    <tr>
                                                                        <th
                                                                            rowSpan={2}
                                                                            className='border px-2 py-2 text-center font-semibold'>
                                                                            SLNO
                                                                        </th>
                                                                        <th
                                                                            rowSpan={2}
                                                                            className='border px-2 py-2 text-center font-semibold'>
                                                                            Roll No
                                                                        </th>
                                                                        <th
                                                                            rowSpan={2}
                                                                            className='border px-2 py-2 text-left font-semibold'>
                                                                            Student Name
                                                                        </th>
                                                                        <th
                                                                            rowSpan={2}
                                                                            className='border px-2 py-2 text-center font-semibold'>
                                                                            Admission no
                                                                        </th>
                                                                        <th
                                                                            rowSpan={2}
                                                                            className='border px-2 py-2 text-center font-semibold'>
                                                                            Class
                                                                        </th>
                                                                        <th
                                                                            rowSpan={2}
                                                                            className='border px-2 py-2 text-center font-semibold'>
                                                                            Section
                                                                        </th>
                                                                        <th
                                                                            rowSpan={2}
                                                                            className='border px-2 py-2 text-center font-semibold'>
                                                                            Balance
                                                                        </th>
                                                                        <th
                                                                            rowSpan={2}
                                                                            className='border px-2 py-2 text-center font-semibold'>
                                                                            total
                                                                        </th>
                                                                        {selectedInstallmentData.map((inst) => (
                                                                            <th
                                                                                key={inst.ftI_Id}
                                                                                colSpan={7}
                                                                                className='border px-2 py-2 text-center font-semibold'>
                                                                                {inst.ftI_Name}
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        {selectedInstallmentData.map((inst) => (
                                                                            <React.Fragment key={`${inst.ftI_Id}-sub`}>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    NetAmount
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Paid
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Balance
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Concession
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Fine
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Waivedoff
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    OpeningBalance
                                                                                </th>
                                                                                {/* <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Net
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Paid
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Balance
                                                                                </th> */}
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {reportData.map((row, index) => (
                                                                        <tr
                                                                            key={row.id}
                                                                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                            <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                                            <td className='border px-2 py-2 text-center'>{row.rollNo}</td>
                                                                            <td className='border px-2 py-2 text-left'>
                                                                                {row.studentName}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>{row.admNo}</td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.className}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.sectionName}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-right'>
                                                                                {row.balance?.toLocaleString() || '-'}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-right'>
                                                                                {row.total?.toLocaleString() || '-'}
                                                                            </td>
                                                                            {selectedInstallmentData.map((inst) => {
                                                                                const instData = row.installments?.[inst.ftI_Id];
                                                                                return (
                                                                                    <React.Fragment key={`${row.id}-${inst.ftI_Id}`}>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.net?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.paid?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.balance?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.concession?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.fine?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.waiver?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.opening?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        {/* <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.net2?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.paid2?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.balance2?.toLocaleString() || '-'}
                                                                                        </td> */}
                                                                                    </React.Fragment>
                                                                                );
                                                                            })}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                {showReport && selectedCatg === 'transport' && selectedInstallmentDataall.length > 0 && (
                                                    <div className='overflow-x-auto px-8 pb-8'>
                                                        <table className='w-full border-collapse border border-gray-300 text-sm'>
                                                            <thead className='bg-primary text-white'>
                                                                <tr>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center font-semibold'>
                                                                        SLNO
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center font-semibold'>
                                                                        Roll No
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-left font-semibold'>
                                                                        Student Name
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center font-semibold'>
                                                                        Admission no
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center font-semibold'>
                                                                        Class
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center font-semibold'>
                                                                        Section
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center font-semibold'>
                                                                        Balance
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center font-semibold'>
                                                                        total
                                                                    </th>
                                                                    {selectedInstallmentDataall.map((inst) => (
                                                                        <th
                                                                            key={inst.ftI_Id}
                                                                            colSpan={7}
                                                                            className='border px-2 py-2 text-center font-semibold'>
                                                                            {inst.ftI_Name}
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                                <tr>
                                                                    {selectedInstallmentDataall.map((inst) => (
                                                                        <React.Fragment key={`${inst.ftI_Id}-sub`}>
                                                                            <th className='border px-2 py-2 text-center font-semibold'>
                                                                                NetAmount
                                                                            </th>
                                                                            <th className='border px-2 py-2 text-center font-semibold'>
                                                                                Paid
                                                                            </th>
                                                                            <th className='border px-2 py-2 text-center font-semibold'>
                                                                                Balance
                                                                            </th>
                                                                            <th className='border px-2 py-2 text-center font-semibold'>
                                                                                Concession
                                                                            </th>
                                                                            <th className='border px-2 py-2 text-center font-semibold'>
                                                                                Fine
                                                                            </th>
                                                                            <th className='border px-2 py-2 text-center font-semibold'>
                                                                                Waivedoff
                                                                            </th>
                                                                            <th className='border px-2 py-2 text-center font-semibold'>
                                                                                OpeningBalance
                                                                            </th>
                                                                            {/* <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Net
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Paid
                                                                                </th>
                                                                                <th className='border px-2 py-2 text-center font-semibold'>
                                                                                    Balance
                                                                                </th> */}
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {reportData.map((row, index) => (
                                                                    <tr
                                                                        key={row.id}
                                                                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                        <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                                        <td className='border px-2 py-2 text-center'>{row.rollNo}</td>
                                                                        <td className='border px-2 py-2 text-left'>{row.studentName}</td>
                                                                        <td className='border px-2 py-2 text-center'>{row.admNo}</td>
                                                                        <td className='border px-2 py-2 text-center'>{row.className}</td>
                                                                        <td className='border px-2 py-2 text-center'>{row.sectionName}</td>
                                                                        <td className='border px-2 py-2 text-right'>
                                                                            {row.balance?.toLocaleString() || '-'}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-right'>
                                                                            {row.total?.toLocaleString() || '-'}
                                                                        </td>
                                                                        {selectedInstallmentDataall.map((inst) => {
                                                                            const instData = row.installments?.[inst.ftI_Id];
                                                                            return (
                                                                                <React.Fragment key={`${row.id}-${inst.ftI_Id}`}>
                                                                                    <td className='border px-2 py-2 text-right'>
                                                                                        {instData?.net?.toLocaleString() || '-'}
                                                                                    </td>
                                                                                    <td className='border px-2 py-2 text-right'>
                                                                                        {instData?.paid?.toLocaleString() || '-'}
                                                                                    </td>
                                                                                    <td className='border px-2 py-2 text-right'>
                                                                                        {instData?.balance?.toLocaleString() || '-'}
                                                                                    </td>
                                                                                    <td className='border px-2 py-2 text-right'>
                                                                                        {instData?.concession?.toLocaleString() || '-'}
                                                                                    </td>
                                                                                    <td className='border px-2 py-2 text-right'>
                                                                                        {instData?.fine?.toLocaleString() || '-'}
                                                                                    </td>
                                                                                    <td className='border px-2 py-2 text-right'>
                                                                                        {instData?.waiver?.toLocaleString() || '-'}
                                                                                    </td>
                                                                                    <td className='border px-2 py-2 text-right'>
                                                                                        {instData?.opening?.toLocaleString() || '-'}
                                                                                    </td>
                                                                                    {/* <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.net2?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.paid2?.toLocaleString() || '-'}
                                                                                        </td>
                                                                                        <td className='border px-2 py-2 text-right'>
                                                                                            {instData?.balance2?.toLocaleString() || '-'}
                                                                                        </td> */}
                                                                                </React.Fragment>
                                                                            );
                                                                        })}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {/* Consolidate Summary Table */}
                                                {showReport && selectedCatg === 'Consolidate' && (
                                                    <div className='overflow-x-auto px-8 pb-8'>
                                                        <table className='w-full border-collapse border border-gray-300 text-sm'>
                                                            <thead className='bg-primary text-white'>
                                                                <tr>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>Sl No</th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>
                                                                        Terms Name
                                                                    </th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>
                                                                        Today Paid Count
                                                                    </th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>
                                                                        Today Collection
                                                                    </th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>
                                                                        Still Now Paid Count
                                                                    </th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>
                                                                        Still Now Collection
                                                                    </th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>
                                                                        Total Strength
                                                                    </th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>
                                                                        Defaulters
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {reportData.map((row, index) => (
                                                                    <tr
                                                                        key={row.id}
                                                                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                        <td className='border px-2 py-2 text-center'>{row.slNo}</td>
                                                                        <td className='border px-2 py-2 text-left'>{row.termsName}</td>
                                                                        <td className='border px-2 py-2 text-right'>
                                                                            {row.todayPaidCount?.toLocaleString() || '-'}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-right'>
                                                                            {row.todayCollection?.toLocaleString() || '-'}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-right'>
                                                                            {row.stillNowPaidCount?.toLocaleString() || '-'}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-right'>
                                                                            {row.stillNowCollection?.toLocaleString() || '-'}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-right'>
                                                                            {row.totalStrength?.toLocaleString() || '-'}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-right'>
                                                                            {row.defaulters?.toLocaleString() || '-'}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {showReport && selectedCatg === 'Category' && termwise && (
                                                    <div className='mt-8 overflow-hidden rounded-lg border bg-white shadow-lg'>
                                                        <div className='overflow-x-auto pb-8'>
                                                            <table
                                                                className='w-full min-w-max border-collapse border border-gray-300 text-sm'
                                                                style={{ tableLayout: 'auto' }}>
                                                                <thead className='bg-primary text-white'>
                                                                    <tr className='border-b'>
                                                                        <th className='min-w-[50px] whitespace-nowrap border px-4 py-3 text-left font-semibold'>
                                                                            Sl No
                                                                        </th>
                                                                        <th className='min-w-[180px] max-w-[250px] border px-4 py-3 text-left font-semibold'>
                                                                            Student Name
                                                                        </th>
                                                                        <th className='min-w-[120px] border px-4 py-3 text-left font-semibold'>
                                                                            Admission No
                                                                        </th>
                                                                        <th className='min-w-[100px] border px-4 py-3 text-left font-semibold'>
                                                                            Class
                                                                        </th>
                                                                        <th className='min-w-[80px] border px-4 py-3 text-left font-semibold'>
                                                                            Section
                                                                        </th>
                                                                        <th className='min-w-[120px] max-w-[200px] border px-4 py-3 text-left font-semibold'>
                                                                            Term
                                                                        </th>
                                                                        <th className='min-w-[120px] whitespace-nowrap border px-4 py-3 text-left font-semibold'>
                                                                            Payable Amount
                                                                        </th>
                                                                        <th className='min-w-[120px] whitespace-nowrap border px-4 py-3 text-left font-semibold'>
                                                                            Paid Amount
                                                                        </th>
                                                                        <th className='min-w-[120px] whitespace-nowrap border px-4 py-3 text-left font-semibold'>
                                                                            Balance
                                                                        </th>
                                                                        <th className='min-w-[100px] whitespace-nowrap border px-4 py-3 text-left font-semibold'>
                                                                            Concession
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {reportData
                                                                        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                                                                        .map((item, index) => (
                                                                            <tr key={item.id} className='border-b hover:bg-gray-50'>
                                                                                <td className='border-r px-4 py-3 text-center text-sm'>
                                                                                    {(currentPage - 1) * rowsPerPage + index + 1}
                                                                                </td>
                                                                                <td
                                                                                    className='truncate border-r px-4 py-3 font-medium text-sm'
                                                                                    title={item.studentName}>
                                                                                    {item.studentName}
                                                                                </td>
                                                                                <td className='border-r px-4 py-3 text-sm'>
                                                                                    {item.admissionNo}
                                                                                </td>
                                                                                <td className='border-r px-4 py-3 text-center text-sm'>
                                                                                    {item.className}
                                                                                </td>
                                                                                <td className='border-r px-4 py-3 text-center text-sm'>
                                                                                    {item.section}
                                                                                </td>
                                                                                <td className='border-r px-4 py-3 text-sm'>
                                                                                    <div className='truncate' title={item.term}>
                                                                                        {item.term}
                                                                                    </div>
                                                                                </td>
                                                                                <td className='whitespace-nowrap border-r px-4 py-3 text-right text-sm'>
                                                                                    ₹{item.payableAmount.toLocaleString('en-IN')}
                                                                                </td>
                                                                                <td className='whitespace-nowrap border-r px-4 py-3 text-right text-sm'>
                                                                                    ₹{item.paidAmount.toLocaleString('en-IN')}
                                                                                </td>
                                                                                <td className='whitespace-nowrap border-r px-4 py-3 text-right text-sm'>
                                                                                    ₹{item.balanceAmount.toLocaleString('en-IN')}
                                                                                </td>
                                                                                <td className='whitespace-nowrap px-4 py-3 text-right text-sm'>
                                                                                    ₹{item.concessionAmount.toLocaleString('en-IN')}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                </tbody>
                                                                {/* Totals Row */}
                                                                <tfoot className='bg-gray-100 font-bold'>
                                                                    <tr>
                                                                        <td colSpan={6} className='border-r px-4 py-3 text-right'>
                                                                            Total:
                                                                        </td>
                                                                        <td className='whitespace-nowrap border-r px-4 py-3 text-right'>
                                                                            ₹
                                                                            {reportData
                                                                                .reduce((sum, item) => sum + item.payableAmount, 0)
                                                                                .toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='whitespace-nowrap border-r px-4 py-3 text-right'>
                                                                            ₹
                                                                            {reportData
                                                                                .reduce((sum, item) => sum + item.paidAmount, 0)
                                                                                .toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='whitespace-nowrap border-r px-4 py-3 text-right'>
                                                                            ₹
                                                                            {reportData
                                                                                .reduce((sum, item) => sum + item.balanceAmount, 0)
                                                                                .toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='whitespace-nowrap px-4 py-3 text-center'>
                                                                            <span className='rounded-full bg-yellow-100 px-2 py-1 font-medium text-xs text-yellow-800'>
                                                                                Pending:{' '}
                                                                                {reportData.filter((item) => item.balanceAmount > 0).length}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>

                                                            {/* Pagination Controls */}
                                                            <div className='mt-4 flex items-center justify-between px-8 text-muted-foreground text-sm'>
                                                                {/* LEFT TEXT */}
                                                                <div>
                                                                    Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
                                                                    {Math.min(currentPage * rowsPerPage, reportData.length)} of{' '}
                                                                    {reportData.length} entries
                                                                </div>

                                                                {/* RIGHT CONTROLS */}
                                                                <div className='flex items-center gap-3'>
                                                                    {/* Rows per page */}
                                                                    <div className='flex items-center gap-2'>
                                                                        <span>Rows per page</span>
                                                                        <select
                                                                            value={rowsPerPage}
                                                                            onChange={(e) => {
                                                                                setRowsPerPage(Number(e.target.value));
                                                                                setCurrentPage(1);
                                                                            }}
                                                                            className='h-8 rounded border px-2'>
                                                                            {[10, 20, 50].map((size) => (
                                                                                <option key={size} value={size}>
                                                                                    {size}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>

                                                                    {/* Pagination buttons */}
                                                                    <div className='flex items-center gap-1'>
                                                                        <button
                                                                            type='button'
                                                                            className='flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100 disabled:opacity-50'
                                                                            disabled={currentPage === 1}
                                                                            onClick={() => setCurrentPage(1)}>
                                                                            ⏮
                                                                        </button>

                                                                        <button
                                                                            type='button'
                                                                            className='flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100 disabled:opacity-50'
                                                                            disabled={currentPage === 1}
                                                                            onClick={() => setCurrentPage((p) => p - 1)}>
                                                                            ◀
                                                                        </button>

                                                                        <button
                                                                            type='button'
                                                                            className='flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100 disabled:opacity-50'
                                                                            disabled={currentPage === totalPages || totalPages === 0}
                                                                            onClick={() => setCurrentPage((p) => p + 1)}>
                                                                            ▶
                                                                        </button>

                                                                        <button
                                                                            type='button'
                                                                            className='flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100 disabled:opacity-50'
                                                                            disabled={currentPage === totalPages || totalPages === 0}
                                                                            onClick={() => setCurrentPage(totalPages)}>
                                                                            ⏭
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Summary Cards */}
                                                        {/* <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
                                                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                                                <h4 className='font-medium text-gray-500 text-sm'>Total Students</h4>
                                                                <p className='mt-2 font-bold text-2xl'>{reportData.length}</p>
                                                            </div>
                                                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                                                <h4 className='font-medium text-gray-500 text-sm'>Total Payable</h4>
                                                                <p className='mt-2 font-bold text-2xl text-blue-600'>
                                                                    ₹{reportData.reduce((sum, item) => sum + item.payableAmount, 0).toLocaleString('en-IN')}
                                                                </p>
                                                            </div>
                                                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                                                <h4 className='font-medium text-gray-500 text-sm'>Total Paid</h4>
                                                                <p className='mt-2 font-bold text-2xl text-green-600'>
                                                                    ₹{reportData.reduce((sum, item) => sum + item.paidAmount, 0).toLocaleString('en-IN')}
                                                                </p>
                                                            </div>
                                                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                                                <h4 className='font-medium text-gray-500 text-sm'>Total Balance</h4>
                                                                <p className='mt-2 font-bold text-2xl text-red-600'>
                                                                    ₹{reportData.reduce((sum, item) => sum + item.balanceAmount, 0).toLocaleString('en-IN')}
                                                                </p>
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                )}
                                            </div>
                                        </CollapsibleSection>
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
