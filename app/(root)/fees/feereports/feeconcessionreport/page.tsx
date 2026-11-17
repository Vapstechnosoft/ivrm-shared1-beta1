'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { useFeeClassListDefaulterreport, useFeeConCessionOnLoadreport, useFeeSectionListDefaulterreport } from '@/hooks/fees/useReports';
import { useFeeMasterConfiguration } from '@/hooks/fees/useTrasactions';
import { getFeesconcessionOnChangeofCustomGroup, saveFeesconcessionReport } from '@/server/fees/reports/fee_concession_report';
import type {
    IFeeClassDropdownList,
    IFeeConcessionCustomGroupDropdownList,
    IFeeConcessionReport,
    IFeeGroupDropdownList,
    IFeeSectionDropdownList,
    IFeeTermDropdownList
} from '@/types/fees/reports/reports';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { exportToExcelforFCW, exportToExcelforFGW, exportToExcelforFHW, exportToExcelforFSW, printTable } from './_components/columns';

const Checkbox = ({ checked, indeterminate, onCheckedChange, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);
    return <BaseCheckbox ref={ref} checked={checked} onCheckedChange={onCheckedChange} {...props} />;
};

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

export default function FeeConcessionReport() {
    const [filters, setFilters] = useState({
        userType: 'Students' as 'Students' | 'Staff' | 'Others',
        viewMode: 'year' as 'year' | 'date',
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
        dueDateType: 'Due Date' as 'Due Date' | 'Till Due Date',
        bulkDownload: false,
        dateFilter: '1' as '1' | '2' | '3' | '4',
        fromDate: null as Date | null,
        toDate: null as Date | null
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
    const [classes, setClasses] = useState<IFeeClassDropdownList[]>([]);
    const [sections, setSections] = useState<IFeeSectionDropdownList[]>([]);
    const [feeGroups, setFeeGroups] = useState<IFeeGroupDropdownList[]>([]);
    const [feeTerms, setFeeTerms] = useState<IFeeTermDropdownList[]>([]);
    const [customGroups, setCustomGroups] = useState<IFeeConcessionCustomGroupDropdownList[]>([]);
    const [reportData, setReportData] = useState<IFeeConcessionReport[]>([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isGroupLoading, setIsGroupLoading] = useState(false);

    // Hooks
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();
    const { data: classListResponse, error: classListError } = useFeeClassListDefaulterreport();
    const { data: sectionListResponse, error: sectionListError, refetch: refetchSections } = useFeeSectionListDefaulterreport();
    const { data: onOnloadResponse, isLoading: loadingonOnloadResponse, error: onOnloadResponseError } = useFeeConCessionOnLoadreport();
    const { data: masterConfiguration } = useFeeMasterConfiguration();

    const config = masterConfiguration?.data?.[0]?.fmC_GroupOrTermFlg ?? 'T';

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

    // useEffect(() => {
    //     if (feegroupError) toast.error(feegroupError?.message || 'Failed to load fee groups');
    //     else if (feegroupData?.data) setFeeGroups(feegroupData.data);
    // }, [feegroupData, feegroupError]);

    // useEffect(() => {
    //     if (feetermError) toast.error(feetermError?.message || 'Failed to load terms');
    //     else if (feetermData?.data) setFeeTerms(feetermData.data);
    // }, [feetermData, feetermError]);

    // useEffect(() => {
    //     if (customGroupError) toast.error(customGroupError?.message || 'Failed to load custom groups');
    //     else if (customGroupResponse?.data) setCustomGroups(customGroupResponse.data);
    // }, [customGroupResponse, customGroupError]);

    useEffect(() => {
        if (onOnloadResponseError) toast.error(onOnloadResponseError?.message || 'Failed to load Data');
        else if (
            (onOnloadResponse as any)?.data?.customlist ||
            (onOnloadResponse as any)?.data?.grouplist ||
            (onOnloadResponse as any)?.data?.terms
        ) {
            setCustomGroups((onOnloadResponse as any).data.customlist);
            setFeeGroups((onOnloadResponse as any).data.grouplist);
            setFeeTerms((onOnloadResponse as any).data.terms);
        }
    }, [onOnloadResponse, onOnloadResponseError]);

    useEffect(() => {
        if (filters.customGroupIds.length === 0) {
            return;
        }

        const fetchGroup = async () => {
            setIsGroupLoading(true);
            try {
                const payload = {
                    customGroups: filters.customGroupIds
                };
                const group = await getFeesconcessionOnChangeofCustomGroup(payload);
                setFeeGroups(group?.data || []);
            } catch (error) {
                console.error('Failed to fetch Records:', error);
                setFeeGroups([]);
            } finally {
                setIsGroupLoading(false);
            }
        };

        fetchGroup();
    }, [filters.customGroupIds]);

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

    const toggleStatus = (status: 'active' | 'deactive' | 'left' | 'balance') => {
        setFilters((prev) => ({
            ...prev,
            status: { ...prev.status, [status]: !prev.status[status] }
        }));
    };

    const toggleRow = (slNo: number) => {
        setSelectedIds((prev) => (prev.includes(slNo) ? prev.filter((x) => x !== slNo) : [...prev, slNo]));
    };

    const toggleAll = () => {
        if (selectedIds.length === reportData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(reportData.map((r) => r.id));
        }
    };
    const selectedRows = reportData.filter((r) => selectedIds.includes(r.id));
    const mockReportData = [
        { slNo: 1, groupName: 'HS BOOKS FEES', concessionAmount: 46875 },
        { slNo: 2, groupName: 'HS ILM & OTHER FEES', concessionAmount: 227600 },
        { slNo: 3, groupName: 'HS TUTION FEES', concessionAmount: 236000 },
        { slNo: 4, groupName: 'HS TRANSPORT FEES', concessionAmount: 152000 },
        { slNo: 5, groupName: 'HS LAB FEES', concessionAmount: 98500 },

        { slNo: 6, groupName: 'IC BOOKS FEES', concessionAmount: 135000 },
        { slNo: 7, groupName: 'IC ILM & OTHER FEES', concessionAmount: 98500 },
        { slNo: 8, groupName: 'IC TUTION FEES', concessionAmount: 194000 },
        { slNo: 9, groupName: 'IC TRANSPORT FEES', concessionAmount: 168000 },
        { slNo: 10, groupName: 'IC LAB FEES', concessionAmount: 72500 },

        { slNo: 11, groupName: 'PUC BOOKS FEES', concessionAmount: 112500 },
        { slNo: 12, groupName: 'PUC ILM & OTHER FEES', concessionAmount: 143000 },
        { slNo: 13, groupName: 'PUC TUTION FEES', concessionAmount: 265000 },
        { slNo: 14, groupName: 'PUC TRANSPORT FEES', concessionAmount: 98000 },
        { slNo: 15, groupName: 'PUC LAB FEES', concessionAmount: 86500 },

        { slNo: 16, groupName: 'CBSE BOOKS FEES', concessionAmount: 155000 },
        { slNo: 17, groupName: 'CBSE ILM & OTHER FEES', concessionAmount: 172000 },
        { slNo: 18, groupName: 'CBSE TUTION FEES', concessionAmount: 318000 },
        { slNo: 19, groupName: 'CBSE TRANSPORT FEES', concessionAmount: 142000 },
        { slNo: 20, groupName: 'CBSE LAB FEES', concessionAmount: 91000 }
    ];
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
    const handleSubmit = async () => {
        if (filters.status.active === false && filters.status.deactive === false && filters.status.left === false) {
            setShowReport(false);
            return toast.error('Please select at least one Status Active or Deactive or Left');
        }
        if (filters.viewMode === 'date') {
            if (!filters.fromDate || !filters.toDate) {
                setShowReport(false);
                return toast.error('Please select From Date and To Date');
            }
        }
        try {
            setReportLoading(true);
            let payload = {};

            if (filters.viewMode === 'year') {
                payload = {
                    fmG_Ids: filters.feeGroupIds,
                    fmT_Ids: filters.termIds,
                    asmaY_Id: filters.academicYearId,
                    reporttype: filters.viewMode,
                    radioval: filters.breakdown,
                    type: 'string',
                    from_Date: filters.fromDate ?? new Date(),
                    to_Date: filters.toDate ?? new Date(),
                    mI_ID: 0,
                    term_group: config.toString(),
                    active: filters.status.active === true ? 1 : 0,
                    deactive: filters.status.deactive === true ? 1 : 0,
                    left: filters.status.left === true ? 1 : 0
                };
            } else {
                payload = {
                    fmG_Ids: filters.feeGroupIds,
                    fmT_Ids: filters.termIds,
                    asmaY_Id: filters.academicYearId,
                    reporttype: filters.viewMode,
                    radioval: filters.breakdown,
                    type: 'string',
                    from_Date: filters.fromDate,
                    to_Date: filters.toDate,
                    mI_ID: 0,
                    term_group: config.toString(),
                    active: filters.status.active === true ? 1 : 0,
                    deactive: filters.status.deactive === true ? 1 : 0,
                    left: filters.status.left === true ? 1 : 0
                };
            }

            const response = await saveFeesconcessionReport(payload);
            const apiList = (response as any).data.list || [];
            const mapApiToReportRows = (apiData: any[]): IFeeConcessionReport[] => {
                return apiData.map((item, index) => ({
                    id: index + 1,
                    studentname: item.studentname,
                    reportname: item.reportname,
                    fss_paidamount: item.fss_paidamount,
                    balance: item.balance,
                    concession: item.concession,
                    waived: item.waived,
                    rebate: item.rebate,
                    fine: item.fine,
                    classname: item.classname,
                    sectionname: item.sectionname
                }));
            };
            const data = mapApiToReportRows(apiList);
            setReportData(data);
            setShowReport(true);
            setReportLoading(false);
            if (apiList.length > 0) {
                toast.success(response.message);
            } else {
                toast.info('No data found for selected criteria');
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Error deleting record');
        } finally {
            setReportLoading(false);
        }

        // setTimeout(() => {
        //   setReportData(mockReportData);
        //   setShowReport(true);
        //   setReportLoading(false);
        // }, 500);
    };

    const handleExportforFGW = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }
        exportToExcelforFGW(selectedRows, 'Fee Concession-Report');
    };

    const handleExportforFHW = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }
        exportToExcelforFHW(selectedRows, 'Fee Concession-Report');
    };

    const handleExportforFCW = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }
        exportToExcelforFCW(selectedRows, 'Fee Concession-Report');
    };

    const handleExportforFSW = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }
        exportToExcelforFSW(selectedRows, 'Fee Concession-Report');
    };

    const handlePrintforFGW = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }

        const columns = ['Sl No', 'groupName', 'concessionAmount'];

        const rowsToPrint = selectedRows.map((row, index) => ({
            'Sl No': index + 1,
            groupName: row.reportname,
            concessionAmount: `₹ ${row.concession.toLocaleString('en-IN')}`
        }));
        const totalAmount = selectedRows.reduce((sum, row) => sum + row.concession, 0);

        const totalRow = {
            'Sl No': '',
            groupName: 'TOTAL',
            concessionAmount: `₹ ${totalAmount.toLocaleString('en-IN')}`
        };

        printTable(columns, rowsToPrint, totalRow);
    };

    const handlePrintforFHW = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }

        const columns = ['Sl No', 'HeadName', 'concessionAmount'];

        const rowsToPrint = selectedRows.map((row, index) => ({
            'Sl No': index + 1,
            HeadName: row.reportname,
            concessionAmount: `₹ ${row.concession.toLocaleString('en-IN')}`
        }));
        const totalAmount = selectedRows.reduce((sum, row) => sum + row.concession, 0);

        const totalRow = {
            'Sl No': '',
            HeadName: 'TOTAL',
            concessionAmount: `₹ ${totalAmount.toLocaleString('en-IN')}`
        };

        printTable(columns, rowsToPrint, totalRow);
    };
    const handlePrintforFCW = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }

        const columns = ['Sl No', 'ClassName', 'concessionAmount'];

        const rowsToPrint = selectedRows.map((row, index) => ({
            'Sl No': index + 1,
            ClassName: row.reportname,
            concessionAmount: `₹ ${row.concession.toLocaleString('en-IN')}`
        }));
        const totalAmount = selectedRows.reduce((sum, row) => sum + row.concession, 0);

        const totalRow = {
            'Sl No': '',
            ClassName: 'TOTAL',
            concessionAmount: `₹ ${totalAmount.toLocaleString('en-IN')}`
        };

        printTable(columns, rowsToPrint, totalRow);
    };

    const handlePrintforFSW = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }

        const columns = ['Sl No', 'Student Name', 'ClassName', 'concessionAmount'];

        const rowsToPrint = selectedRows.map((row, index) => ({
            'Sl No': index + 1,
            'Student Name': row.reportname,
            ClassName: row.classname,
            concessionAmount: `₹ ${row.concession.toLocaleString('en-IN')}`
        }));
        const totalAmount = selectedRows.reduce((sum, row) => sum + row.concession, 0);

        const totalRow = {
            'Sl No': '',
            'Student Name': '',
            ClassName: 'TOTAL',
            concessionAmount: `₹ ${totalAmount.toLocaleString('en-IN')}`
        };

        printTable(columns, rowsToPrint, totalRow);
    };

    const showBalancecheckbox = filters.userType === 'Students' && filters.breakdown === 'Student/Staff Wise';

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <div className='mx-auto max-w-7xl'>
                <Card className='border-0 shadow-xl'>
                    <div className='p-8'>
                        {/* <h1 className='mb-8 font-bold text-3xl text-gray-900'>Yearly Fee Collection Report</h1> */}

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
                                    <div className='flex justify-center'>
                                        <div className='flex flex-wrap justify-center gap-6'>
                                            {[
                                                { label: 'Fee Group Wise', value: 'FGW' },
                                                { label: 'Fee Head Wise', value: 'FHW' },
                                                { label: 'Class Wise', value: 'FCW' },
                                                { label: 'Student Wise', value: 'FSW' }
                                            ].map((option) => (
                                                <label
                                                    key={option.value}
                                                    className='flex cursor-pointer items-center gap-2 whitespace-nowrap'>
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
                                        Custom Group<span className='text-red-500'>*</span>
                                    </Label>
                                    <Card className='border bg-gray-50 p-4'>
                                        <div className='max-h-64 space-y-3 overflow-y-auto'>
                                            <label
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
                                            </label>

                                            {loadingonOnloadResponse ? (
                                                <div className='py-4 text-center text-gray-500'>Loading...</div>
                                            ) : customGroups.length > 0 ? (
                                                customGroups.map((group) => (
                                                    <label
                                                        key={group.fmgG_Id}
                                                        htmlFor={`customGroup-${group.fmgG_Id}`}
                                                        className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                        <Checkbox
                                                            id={`customGroup-${group.fmgG_Id}`}
                                                            checked={filters.customGroupIds.includes(group.fmgG_Id)}
                                                            onCheckedChange={() => toggleCustomGroup(group.fmgG_Id)}
                                                        />
                                                        <span className='font-medium text-sm'>{group.fmg_groupname}</span>
                                                    </label>
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
                                            <label
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
                                            </label>

                                            {loadingonOnloadResponse || isGroupLoading ? (
                                                <div className='py-4 text-center text-gray-500'>Loading...</div>
                                            ) : feeGroups.length > 0 ? (
                                                feeGroups.map((group) => (
                                                    <label
                                                        key={group.fmG_Id}
                                                        htmlFor={`feeGroup-${group.fmG_Id}`}
                                                        className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                        <Checkbox
                                                            id={`feeGroup-${group.fmG_Id}`}
                                                            checked={filters.feeGroupIds.includes(group.fmG_Id)}
                                                            onCheckedChange={() => toggleFeeGroup(group.fmG_Id)}
                                                        />
                                                        <span className='text-sm'>{group.fmG_GroupName}</span>
                                                    </label>
                                                ))
                                            ) : (
                                                <div className='py-4 text-center text-gray-500'>No fee groups</div>
                                            )}
                                        </div>
                                    </Card>
                                </div>

                                {/* Column 3: Term OR Installment */}
                                <div className='space-y-3'>
                                    <>
                                        <Label className='font-semibold text-lg'>
                                            Term Name <span className='text-red-500'>*</span>
                                        </Label>
                                        <Card className='border bg-gray-50 p-4'>
                                            <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                <label
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
                                                </label>

                                                {loadingonOnloadResponse ? (
                                                    <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                ) : feeTerms.length > 0 ? (
                                                    feeTerms.map((term) => (
                                                        <label
                                                            key={term.fmT_Id}
                                                            htmlFor={`term-${term.fmT_Id}`}
                                                            className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                            <Checkbox
                                                                id={`term-${term.fmT_Id}`}
                                                                checked={filters.termIds.includes(term.fmT_Id)}
                                                                onCheckedChange={() => toggleTerm(term.fmT_Id)}
                                                            />
                                                            <span className='text-sm'>{term.fmT_Name}</span>
                                                        </label>
                                                    ))
                                                ) : (
                                                    <div className='py-4 text-center text-gray-500'>No terms</div>
                                                )}
                                            </div>
                                        </Card>
                                    </>
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
                                            <Checkbox checked={filters.status.deactive} onCheckedChange={() => toggleStatus('deactive')} />
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
                                </div>
                            </div>

                            {filters.viewMode === 'date' && (
                                <div className='mt-4 flex items-center justify-center rounded border bg-gray-50 p-4 shadow-sm'>
                                    <div className='flex items-center gap-6'>
                                        <div className='flex flex-col'>
                                            <Label htmlFor='fromDate' className='font-medium'>
                                                From Date:
                                            </Label>
                                            <input
                                                id='fromDate'
                                                type='date'
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        fromDate: e.target.value ? new Date(e.target.value) : null
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
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        toDate: e.target.value ? new Date(e.target.value) : null
                                                    }))
                                                }
                                                className='rounded border px-3 py-1'
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                {/* ==================== ACTION BUTTONS ==================== */}
                                <div className='flex justify-end gap-4 border-t pt-8'>
                                    <Button size='lg' variant='outline' className='px-8' onClick={() => window.location.reload()}>
                                        Cancel
                                    </Button>

                                    <Button
                                        size='lg'
                                        className='px-12'
                                        onClick={handleSubmit}
                                        disabled={
                                            reportLoading ||
                                            !filters.academicYearId ||
                                            filters.feeGroupIds.length === 0 ||
                                            filters.termIds.length === 0
                                        }>
                                        {reportLoading ? (
                                            <>
                                                <div className='mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
                                                Generating Report...
                                            </>
                                        ) : (
                                            'Generate Report'
                                        )}
                                    </Button>
                                </div>

                                {showReport && reportData.length > 0 && (
                                    <CollapsibleSection defaultOpen={true} className='mt-10'>
                                        <div className='mt-5 overflow-hidden rounded-lg border bg-white shadow-lg'>
                                            <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                                                <div className='mb-6 text-center'>
                                                    <h2 className='font-bold text-2xl text-primary'>Fee Concession Report</h2>
                                                </div>
                                                {filters.breakdown === 'FGW' && (
                                                    <div className='flex gap-3'>
                                                        <div className='mb-4 flex justify-end gap-2'>
                                                            <Button
                                                                size='sm'
                                                                className='h-8 w-auto px-3 text-xs'
                                                                onClick={handleExportforFGW}>
                                                                Export Excel
                                                            </Button>

                                                            <Button
                                                                size='sm'
                                                                variant='outline'
                                                                className='h-8 w-auto px-3 text-xs'
                                                                onClick={handlePrintforFGW}>
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
                                                                onClick={handleExportforFHW}>
                                                                Export Excel
                                                            </Button>

                                                            <Button
                                                                size='sm'
                                                                variant='outline'
                                                                className='h-8 w-auto px-3 text-xs'
                                                                onClick={handlePrintforFHW}>
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
                                                                onClick={handleExportforFCW}>
                                                                Export Excel
                                                            </Button>

                                                            <Button
                                                                size='sm'
                                                                variant='outline'
                                                                className='h-8 w-auto px-3 text-xs'
                                                                onClick={handlePrintforFCW}>
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
                                                                onClick={handleExportforFSW}>
                                                                Export Excel
                                                            </Button>

                                                            <Button
                                                                size='sm'
                                                                variant='outline'
                                                                className='h-8 w-auto px-3 text-xs'
                                                                onClick={handlePrintforFSW}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {(filters.breakdown === 'FGW' || filters.breakdown === 'FHW') && (
                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse text-sm'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='border px-2 py-2 text-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        checked={
                                                                            selectedIds.length === reportData.length &&
                                                                            reportData.length > 0
                                                                        }
                                                                        onChange={toggleAll}
                                                                    />
                                                                </th>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                {filters.breakdown === 'FGW' && (
                                                                    <th className='border px-4 py-2 text-left'>Group Name</th>
                                                                )}
                                                                {filters.breakdown === 'FHW' && (
                                                                    <th className='border px-4 py-2 text-left'>Head Name</th>
                                                                )}

                                                                <th className='w-56 border px-4 py-2 text-right'>Concession Amount</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {reportData.map((row, index) => (
                                                                <tr
                                                                    key={row.id}
                                                                    className={
                                                                        selectedIds.includes(row.id)
                                                                            ? 'bg-blue-100'
                                                                            : index % 2 === 0
                                                                              ? 'bg-white'
                                                                              : 'bg-gray-50'
                                                                    }>
                                                                    <td className='border px-2 py-2 text-center'>
                                                                        <input
                                                                            type='checkbox'
                                                                            checked={selectedIds.includes(row.id)}
                                                                            onChange={() => toggleRow(row.id)}
                                                                        />
                                                                    </td>
                                                                    <td className='border px-4 py-2 text-center'>{row.id}</td>
                                                                    <td className='border px-4 py-2 font-medium'>{row.reportname}</td>
                                                                    <td className='border px-4 py-2 text-right font-semibold'>
                                                                        ₹ {row.concession.toLocaleString('en-IN')}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                        {/* GRAND TOTAL */}
                                                        <tfoot className='bg-gray-100'>
                                                            <tr>
                                                                <td colSpan={3} className='border px-4 py-3 text-right font-bold'>
                                                                    Total
                                                                </td>
                                                                <td className='border px-4 py-3 text-right font-bold'>
                                                                    ₹{' '}
                                                                    {reportData
                                                                        .reduce((sum, row) => sum + row.concession, 0)
                                                                        .toLocaleString('en-IN')}
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            )}

                                            {filters.breakdown === 'FCW' && (
                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse text-sm'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='border px-2 py-2 text-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        checked={
                                                                            selectedIds.length === reportData.length &&
                                                                            reportData.length > 0
                                                                        }
                                                                        onChange={toggleAll}
                                                                    />
                                                                </th>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>

                                                                <th className='border px-4 py-2 text-left'> Class</th>
                                                                <th className='w-56 border px-4 py-2 text-right'> Amount</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {reportData.map((row, index) => (
                                                                <tr
                                                                    key={row.id}
                                                                    className={
                                                                        selectedIds.includes(row.id)
                                                                            ? 'bg-blue-100'
                                                                            : index % 2 === 0
                                                                              ? 'bg-white'
                                                                              : 'bg-gray-50'
                                                                    }>
                                                                    <td className='border px-2 py-2 text-center'>
                                                                        <input
                                                                            type='checkbox'
                                                                            checked={selectedIds.includes(row.id)}
                                                                            onChange={() => toggleRow(row.id)}
                                                                        />
                                                                    </td>
                                                                    <td className='border px-4 py-2 text-center'>{row.id}</td>
                                                                    <td className='border px-4 py-2 font-medium'>{row.reportname}</td>
                                                                    <td className='border px-4 py-2 text-right font-semibold'>
                                                                        ₹ {row.concession.toLocaleString('en-IN')}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                        {/* GRAND TOTAL */}
                                                        <tfoot className='bg-gray-100'>
                                                            <tr>
                                                                <td colSpan={3} className='border px-4 py-3 text-right font-bold'>
                                                                    Total
                                                                </td>
                                                                <td className='border px-4 py-3 text-right font-bold'>
                                                                    ₹{' '}
                                                                    {reportData
                                                                        .reduce((sum, row) => sum + row.concession, 0)
                                                                        .toLocaleString('en-IN')}
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            )}

                                            {filters.breakdown === 'FSW' && (
                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse text-sm'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='border px-2 py-2 text-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        checked={
                                                                            selectedIds.length === reportData.length &&
                                                                            reportData.length > 0
                                                                        }
                                                                        onChange={toggleAll}
                                                                    />
                                                                </th>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>

                                                                <th className='border px-4 py-2 text-left'> Student Name</th>
                                                                <th className='w-56 border px-4 py-2 text-right'> Class:Section</th>
                                                                <th className='w-56 border px-4 py-2 text-right'> Concession Amount</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {reportData.map((row, index) => (
                                                                <tr
                                                                    key={row.id}
                                                                    className={
                                                                        selectedIds.includes(row.id)
                                                                            ? 'bg-blue-100'
                                                                            : index % 2 === 0
                                                                              ? 'bg-white'
                                                                              : 'bg-gray-50'
                                                                    }>
                                                                    <td className='border px-2 py-2 text-center'>
                                                                        <input
                                                                            type='checkbox'
                                                                            checked={selectedIds.includes(row.id)}
                                                                            onChange={() => toggleRow(row.id)}
                                                                        />
                                                                    </td>
                                                                    <td className='border px-4 py-2 text-center'>{row.id}</td>
                                                                    <td className='border px-4 py-2 font-medium'>{row.reportname}</td>
                                                                    <td className='border px-4 py-2 font-medium'>{row.classname}</td>
                                                                    <td className='border px-4 py-2 text-right font-semibold'>
                                                                        ₹ {row.concession.toLocaleString('en-IN')}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                        {/* GRAND TOTAL */}
                                                        <tfoot className='bg-gray-100'>
                                                            <tr>
                                                                <td colSpan={4} className='border px-4 py-3 text-right font-bold'>
                                                                    Total
                                                                </td>
                                                                <td className='border px-4 py-3 text-right font-bold'>
                                                                    ₹{' '}
                                                                    {reportData
                                                                        .reduce((sum, row) => sum + row.concession, 0)
                                                                        .toLocaleString('en-IN')}
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
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
        </div>
    );
}
