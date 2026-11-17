'use client';

import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import {
    useFeeBusRouteDefaulterreport,
    useFeeClassListDefaulterreport,
    useFeeCustomGroupDefaulterreport,
    useFeeGroupDefaulterreport,
    useFeeSectionListDefaulterreport,
    useFeeTermDefaulterreport,
    usemastersettinglist
} from '@/hooks/fees/useReports';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormError } from '@/components/ui/extension/field';
import { feeDefaulterReportSchema } from '@/schemas/fees/reports';
import { getFeesSectionListByClassId, getfeedefaluerreport } from '@/server/fees/reports/fee_DefaulterReport';
import type {
    IFeeBusRouteDropdownList,
    IFeeClassDropdownList,
    IFeeCustomGroupDropdownList,
    IFeeGroupDropdownList,
    IFeeSectionDropdownList,
    IFeeTermDropdownList
} from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ArrowUpDown, CalendarIcon, Eye } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from 'react-aria-components';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import {
    exportToExcelforFeeClassWise,
    exportToExcelforFeeGroupWise,
    exportToExcelforFeeHeadWise,
    exportToExcelforFeeInstallmentWise,
    exportToExcelforFeeStudentorStaffWise,
    exportToExcelforFeeStudentorStaffWiseofBalance,
    printTable
} from './_components/columns';

type FormFields = z.infer<typeof feeDefaulterReportSchema>;

const Checkbox = ({ checked, indeterminate, onCheckedChange, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);

    return <BaseCheckbox ref={ref} checked={checked} onCheckedChange={onCheckedChange} {...props} />;
};

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

interface IStudentFeeDefaulterReport {
    id: number;
    amsT_Id: number;
    totalBalance: number;
    studentName: string;
    amsT_AdmNo: string;
    classSection: string;
    amsT_MobileNo: string;
    amsT_FatherName: string;
    amsT_emailId: string;
    fmT_Name: string;
    fmG_GroupName: string;
    fmH_FeeName: string;
    asmcL_ClassName: string;
    amsT_Route: string;
    fine_Amount: number;
    admno: string;
    feeName: string;
    className: string;
    sectionName: string;
    fatherName: string;
    mobileNo: string;
    email: string;
    tobepaid: number;
    [key: string]: any;
}

export default function FeeDefaulterReport() {
    const breakdownOptions = [
        { value: 'FGW', label: 'Fee Group Wise' },
        { value: 'FHW', label: 'Fee Head Wise' },
        { value: 'FCW', label: 'Class Wise' },
        { value: 'FIW', label: 'Installment Wise' },
        { value: 'FSW', label: 'Student/Staff Wise' },
        { value: 'FPW', label: 'Parent Wise' }
    ] as const;

    const {
        handleSubmit,
        setValue,
        control,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeDefaulterReportSchema),
        defaultValues: {
            userType: 'Students',
            viewMode: 'Yearly Wise',
            breakdown: 'FGW',
            academicYearId: undefined,
            includeClassSection: false,
            classId: 0,
            sectionId: 0,
            customGroupIds: [],
            feeGroupIds: [],
            termIds: [],
            busRouteIds: [],
            status: {
                active: true,
                deactive: false,
                left: false,
                balance: false
            },
            formatI: false,
            bulkDownload: false
        }
    });

    const [filters, setFilters] = useState({
        userType: 'Student' as 'Student' | 'Staff' | 'Others',
        viewMode: 'year' as 'year' | 'date',
        breakdown: 'Fee Group Wise',
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
        busRouteIds: [] as number[],
        formatI: false,
        dueDate: new Date(),
        dueDateType: 'duedate' as 'duedate' | 'tillduedate',
        bulkDownload: false
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
    const [classes, setClasses] = useState<IFeeClassDropdownList[]>([]);
    const [sections, setSections] = useState<IFeeSectionDropdownList[]>([]);
    const [feeGroups, setFeeGroups] = useState<IFeeGroupDropdownList[]>([]);
    const [feeTerms, setFeeTerms] = useState<IFeeTermDropdownList[]>([]);
    const [feeBusRoutes, setFeeBusRoutes] = useState<IFeeBusRouteDropdownList[]>([]);
    const [customGroups, setCustomGroups] = useState<IFeeCustomGroupDropdownList[]>([]);
    const [reportData, setReportData] = useState<IStudentFeeDefaulterReport[]>([]);
    const [studentreportData, setstudentReportData] = useState<IStudentFeeDefaulterReport[]>([]);
    const [studentGroupreportData, setstudentGroupReportData] = useState<IStudentFeeDefaulterReport[]>([]);
    const [studentHeadreportData, setstudentHeadReportData] = useState<IStudentFeeDefaulterReport[]>([]);
    const [studentClassreportData, setstudentClassReportData] = useState<IStudentFeeDefaulterReport[]>([]);
    const [balancereportData, setBalanceReportData] = useState<IStudentFeeDefaulterReport[]>([]);
    const [dynamicFeeNames, setDynamicFeeNames] = useState<string[]>([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<'feeGroup' | 'totalDue' | 'fmH_FeeName' | 'totalBalance' | 'asmcL_ClassName' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [sectionLoading, setSectionLoading] = useState(false);

    const { data: mastersettingList } = usemastersettinglist();
    const term_group = mastersettingList?.data?.[0]?.fmC_GroupOrTermFlg;

    // Hooks
    const { data: academicData, error: academicError } = useAcademicYearDropdown();
    const { data: classListResponse, isLoading: loadingClasses, error: classListError } = useFeeClassListDefaulterreport();
    const {
        // data: sectionListResponse,
        // isLoading: loadingSections,
        // error: sectionListError,
        refetch: refetchSections
    } = useFeeSectionListDefaulterreport();
    const { data: feegroupData, isLoading: loadingfeegroup, error: feegroupError } = useFeeGroupDefaulterreport();
    const { data: feetermData, isLoading: loadingfeeterm, error: feetermError } = useFeeTermDefaulterreport();
    const { data: busRouteResponse, isLoading: loadingBusRoutes, error: busRouteError } = useFeeBusRouteDefaulterreport();
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
    const includeClassSection = watch('includeClassSection');
    const sectionId = watch('sectionId') ?? 0;
    const feeGroupIds = watch('feeGroupIds') ?? [];
    const termIds = watch('termIds') ?? [];
    const routeIds = watch('busRouteIds') ?? [];
    const breakdown = watch('breakdown');
    const customGroupIds = watch('customGroupIds') ?? [];

    useEffect(() => {
        const fetchSections = async () => {
            if (!includeClassSection || !academicYearId || classId <= 0) {
                setSections([]);
                setValue('sectionId', 0);
                return;
            }

            setSectionLoading(true);

            try {
                const result = await getFeesSectionListByClassId(Number(academicYearId), classId);
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
    }, [academicYearId, classId, includeClassSection, setValue]);

    useEffect(() => {
        if (feegroupError) toast.error(feegroupError?.message || 'Failed to load fee groups');
        else if (feegroupData?.data) setFeeGroups(feegroupData.data);
    }, [feegroupData, feegroupError]);

    useEffect(() => {
        if (feetermError) toast.error(feetermError?.message || 'Failed to load terms');
        else if (feetermData?.data) setFeeTerms(feetermData.data);
    }, [feetermData, feetermError]);

    useEffect(() => {
        if (busRouteError) toast.error(busRouteError?.message || 'Failed to load bus routes');
        else if (busRouteResponse?.data) setFeeBusRoutes(busRouteResponse.data as IFeeBusRouteDropdownList[]);
    }, [busRouteResponse, busRouteError]);

    useEffect(() => {
        if (customGroupError) toast.error(customGroupError?.message || 'Failed to load custom groups');
        else if (customGroupResponse?.data) setCustomGroups(customGroupResponse.data);
    }, [customGroupResponse, customGroupError]);

    const toggleStatus = (status: 'active' | 'deactive' | 'left' | 'balance') => {
        setFilters((prev) => ({
            ...prev,
            status: { ...prev.status, [status]: !prev.status[status] }
        }));
    };

    const [communicationMethods, setCommunicationMethods] = useState({
        email: false,
        sms: false,
        notification: false,
        whatsapp: false
    });

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailTemplate, setEmailTemplate] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailContent, setEmailContent] = useState('');
    const [showemailContent, setshowEmailContent] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showSMSModal, setShowSMSModal] = useState(false);

    const [sortConfig, setSortConfig] = useState<{
        key: keyof (typeof studentreportData)[0];
        direction: 'asc' | 'desc';
    } | null>(null);

    const handleSortfull = (key: keyof (typeof studentreportData)[0]) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig) return studentreportData;

        return [...studentreportData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });
    }, [studentreportData, sortConfig]);

    const filteredStudentData = useMemo(() => {
        if (!search.trim()) return studentreportData;
        const searchTerm = search.toLowerCase().trim();
        return studentreportData.filter((student) => {
            return (
                student.studentName.toLowerCase().includes(searchTerm) ||
                student.amsT_AdmNo.toLowerCase().includes(searchTerm) ||
                student.classSection.toLowerCase().includes(searchTerm) ||
                student.amsT_FatherName.toLowerCase().includes(searchTerm) ||
                student.amsT_MobileNo.includes(searchTerm) ||
                student.amsT_emailId.toLowerCase().includes(searchTerm) ||
                student.amsT_Route.toLowerCase().includes(searchTerm) ||
                student.totalBalance.toString().includes(searchTerm)
            );
        });
    }, [studentreportData, search]);

    const toggleCommunicationMethod = (method: keyof typeof communicationMethods) => {
        setCommunicationMethods((prev) => ({
            ...prev,
            [method]: !prev[method]
        }));
    };

    const handleRequestCommunication = () => {
        if (communicationMethods.email) {
            setshowEmailContent(true);
        } else if (communicationMethods.notification) {
            setShowNotificationModal(true);
        } else if (communicationMethods.sms) {
            setShowSMSModal(true);
        }
    };

    const handleSendEmail = () => {
        const selectedStudents = studentreportData.filter((student) => selectedIds.includes(student.amsT_Id));

        if (selectedStudents.length === 0) {
            toast.error('Please select at least one student');
            return;
        }
        toast.success(`Email sent to ${selectedStudents.length} student(s)`);
        setShowEmailModal(false);
    };

    const calculateTotals = () => {
        const selectedStudents = studentreportData.filter((student) => selectedIds.includes(student.amsT_Id));

        return {
            count: selectedStudents.length,
            totalBalance: selectedStudents.reduce((sum, student) => sum + student.totalBalance, 0)
        };
    };

    const filteredData = useMemo(() => {
        let rows = [...reportData];

        if (search) {
            rows = rows.filter(
                (r) => r.fmG_GroupName.toLowerCase().includes(search.toLowerCase()) || r.totalBalance.toString().includes(search)
            );
        }

        if (sortKey) {
            rows.sort((a: any, b: any) => {
                const valA = a[sortKey];
                const valB = b[sortKey];

                if (typeof valA === 'string') {
                    return sortOrder === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
                }

                return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
            });
        }

        return rows;
    }, [reportData, search, sortKey, sortOrder]);

    const handleSort = (key: 'feeGroup' | 'totalDue' | 'fmH_FeeName' | 'totalBalance' | 'asmcL_ClassName') => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const toggleRow = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const toggleAll = () => {
        if (selectedIds.length === studentGroupreportData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(studentGroupreportData.map((row) => row.id));
        }
    };

    const toggleAllstudents = () => {
        if (selectedIds.length === studentreportData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(studentreportData.map((r) => r.id));
        }
    };

    const toggleAllBalance = () => {
        if (selectedIds.length === balancereportData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(balancereportData.map((r) => r.id));
        }
    };
    const totalBalance = filteredData.reduce((sum, r) => sum + r.totalBalance, 0);
    const selectedBalance = filteredData.filter((r) => selectedIds.includes(r.id)).reduce((sum, r) => sum + r.totalBalance, 0);

    const handleExportExcelforFeeGroupWise = () => {
        const rowsToExport = studentGroupreportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforFeeGroupWise(rowsToExport, 'Defaulter_Report');
    };
    const handleExportExcelforFeeHeadWise = () => {
        const rowsToExport = studentHeadreportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforFeeHeadWise(rowsToExport, 'Defaulter_Report');
    };

    const handleExportExcelforFeeClassWise = () => {
        const rowsToExport = studentClassreportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforFeeClassWise(rowsToExport, 'Defaulter_Report');
    };

    const handlePrintforFeeGroupWise = () => {
        const rowsToPrint = studentGroupreportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = ['Sl.No', 'Fee Group', 'Balance Amount'];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl.No': index + 1,
            'Fee Group': row.fmG_GroupName,
            'Balance Amount': `₹${row.totalBalance}`
        }));

        const total = rowsToPrint.reduce((sum, r) => sum + r.totalBalance, 0);
        const sumRow = {
            'Sl.No': '',
            'Fee Group': 'Total',
            'Balance Amount': `₹${total.toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforFeeHeadWise = () => {
        const rowsToPrint = studentHeadreportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = ['Sl.No', 'Fee Head', 'Balance Amount'];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl.No': index + 1,
            'Fee Head': row.fmH_FeeName,
            'Balance Amount': `₹${row.totalBalance}`
        }));

        const total = rowsToPrint.reduce((sum, r) => sum + r.totalBalance, 0);
        const sumRow = {
            'Sl.No': '',
            'Fee Head': 'Total',
            'Balance Amount': `₹${total.toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handlePrintforFeeClassWise = () => {
        const rowsToPrint = studentClassreportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = ['Sl.No', 'Class Name', 'Balance Amount'];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl.No': index + 1,
            'Class Name': row.asmcL_ClassName,
            'Balance Amount': `₹${row.totalBalance}`
        }));

        const total = rowsToPrint.reduce((sum, r) => sum + r.totalBalance, 0);
        const sumRow = {
            'Sl.No': '',
            'Class Name': 'Total',
            'Balance Amount': `₹${total.toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handleExportExcelforFeeInstallmentWise = () => {
        const rowsToExport = studentreportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforFeeInstallmentWise(rowsToExport, 'Defaulter_Report');
    };

    const handlePrintforFeeInstallmentWise = () => {
        const rowsToPrint = studentreportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl.No',
            'Name',
            'Admission No',
            'Class & Section',
            'Father Name',
            'Mobile Number',
            'Email ID',
            'Term',
            'Balance Amount'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl.No': index + 1,
            Name: row.studentName,
            'Admission No': row.amsT_AdmNo,
            'Class & Section': row.classSection,
            'Father Name': row.amsT_FatherName,
            'Mobile Number': row.amsT_MobileNo,
            'Email ID': row.amsT_emailId,
            Term: row.fmT_Name,
            'Balance Amount': row.totalBalance
        }));

        const total = rowsToPrint.reduce((sum, r) => sum + r.totalBalance, 0);
        const sumRow = {
            'Sl.No': '',
            Name: 'Total',
            'Admission No': '',
            'Class & Section': '',
            'Father Name': '',
            'Mobile Number': '',
            'Email ID': '',
            Term: '',
            'Balance Amount': `₹${total.toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };

    const handleExportExcelforFeeStudentorStaffWise = () => {
        const rowsToExport = studentreportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }

        exportToExcelforFeeStudentorStaffWise(rowsToExport, 'Defaulter_Report');
    };

    const handlePrintforFeeStudentorStaffWise = () => {
        const rowsToPrint = studentreportData.filter((row) => selectedIds.includes(row.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl.No',
            'Name',
            'Admission No',
            'Class & Section',
            'Father Name',
            'Mobile Number',
            'Email ID',
            'Route',
            'Balance Amount'
        ];

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl.No': index + 1,
            Name: row.studentName,
            'Admission No': row.amsT_AdmNo,
            'Class & Section': row.classSection,
            'Father Name': row.amsT_FatherName,
            'Mobile Number': row.amsT_MobileNo,
            'Email ID': row.amsT_emailId,
            Route: row.amsT_Route,
            'Balance Amount': row.totalBalance
        }));

        const total = rowsToPrint.reduce((sum, r) => sum + r.totalBalance, 0);
        const sumRow = {
            'Sl.No': '',
            Name: 'Total',
            'Admission No': '',
            'Class & Section': '',
            'Father Name': '',
            'Mobile Number': '',
            'Email ID': '',
            Route: '',
            'Balance Amount': `₹${total.toLocaleString('en-IN')}`
        };

        printTable(columnHeaders, printableRows, sumRow);
    };
    const HandleexportToExcelforFeeStudentorStaffWiseofBalance = () => {
        const rowsToPrint = balancereportData.filter((row) => selectedIds.includes(row.id));
        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }
        const fileName = `Fee_Defaulter_Report_${filters.userType}_${new Date().toISOString().split('T')[0]}`;
        exportToExcelforFeeStudentorStaffWiseofBalance(rowsToPrint, fileName, dynamicFeeNames);
    };

    const handlePrintforFeeStudentorStaffWiseofBalance = () => {
        const rowsToPrint = balancereportData.filter((row) => selectedIds.includes(row.id));
        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columnHeaders = [
            'Sl.No',
            'Name',
            'Admission No',
            'Class',
            'Section',
            'Father Name',
            'Mobile Number',
            'Email ID',
            ...dynamicFeeNames,
            'Total Balance'
        ];

        const tableRows = rowsToPrint.map((row, index) => {
            const rowData: Record<string, any> = {
                'Sl.No': index + 1,
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
                rowData[feeName] = feeAmount.toLocaleString('en-IN');
            });

            rowData['Total Balance'] = (row.tobepaid || 0).toLocaleString('en-IN');

            return rowData;
        });
        const sumRow: Record<string, any> = {
            'Sl.No': 'Total',
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
            const totalFee = rowsToPrint.reduce((sum, row) => {
                const feeAmount = row[feeKey] || row.feeCategories?.[feeName] || 0;
                return sum + feeAmount;
            }, 0);
            sumRow[feeName] = totalFee.toLocaleString('en-IN');
        });

        const totalBalance = rowsToPrint.reduce((sum, row) => sum + (row.tobepaid || 0), 0);
        sumRow['Total Balance'] = totalBalance.toLocaleString('en-IN');

        printTable(columnHeaders, tableRows, sumRow);
    };

    useEffect(() => {
        setReportData([]);
        setstudentGroupReportData([]);
        setstudentHeadReportData([]);
        setstudentClassReportData([]);
        setSelectedIds([]);
        setShowReport(false);
        if (filters.status.balance) {
            setFilters((prev) => ({
                ...prev,
                status: {
                    ...prev.status,
                    balance: false
                }
            }));
        }
    }, [
        filters.breakdown,
        filters.classId,
        filters.sectionId,
        filters.academicYearId,
        filters.customGroupIds,
        filters.termIds,
        filters.feeGroupIds,
        breakdown
    ]);

    const onSubmit: SubmitHandler<FormFields> = async () => {
        setReportLoading(true);
        setShowReport(false);
        setReportData([]);
        setstudentReportData([]);
        setstudentGroupReportData([]);
        setstudentHeadReportData([]);
        setstudentClassReportData([]);

        try {
            const blc_new = filters.status.balance === true ? 1 : 0;
            const active = filters.status.active === true ? 1 : 0;
            const deactive = filters.status.deactive === true ? 1 : 0;
            const left = filters.status.left === true ? 1 : 0;
            const asmcL_Id = includeClassSection === true ? classId : 0;
            const asmC_Id = includeClassSection === true ? sectionId : 0;

            let payload: any = {};
            if (filters.viewMode === 'year') {
                payload = {
                    ASMAY_Id: academicYearId,
                    radioval: breakdown,
                    reporttype: filters.viewMode,
                    active: active,
                    deactive: deactive,
                    left: left,
                    FMG_Ids: feeGroupIds || [],
                    FMT_Ids: termIds || [],
                    TRMR_Ids: routeIds || [],
                    term_group: term_group,
                    Balance_1: blc_new,
                    FMG_Id: feeGroupIds && feeGroupIds.length > 0 ? feeGroupIds[0] : 0,
                    FMGG_Id: customGroupIds && customGroupIds.length > 0 ? customGroupIds[0] : 0,
                    FMT_Id: termIds && termIds.length > 0 ? termIds[0] : 0,
                    customflag: customGroupIds.length > 0 ? 'true' : ' ',
                    groupflag: feeGroupIds.length > 0 ? 'true' : ' ',
                    ASMCL_Id: asmcL_Id,
                    AMSC_Id: asmC_Id,
                    yearid: 0,
                    Select_Button: filters.userType,
                    studenttype: 'active'
                };
            } else if (filters.viewMode === 'date') {
                payload = {
                    ASMAY_Id: academicYearId,
                    radioval: breakdown,
                    reporttype: filters.viewMode,
                    active: active,
                    deactive: deactive,
                    left: left,
                    FMG_Ids: feeGroupIds || [],
                    FMT_Ids: termIds || [],
                    TRMR_Ids: routeIds || [],
                    Balance_1: blc_new,
                    From_Date: filters.dueDate,
                    duedate: filters.dueDateType,
                    ASMCL_Id: asmcL_Id,
                    AMSC_Id: asmC_Id,
                    term_group: term_group,
                    Select_Button: filters.userType,
                    yearid: 0,
                    studenttype: 'active'
                };
            }

            console.log('Payload for Fee Defaulter Report:', JSON.stringify(payload));

            const reportArray = await getfeedefaluerreport(payload);
            const studentDataArray = (reportArray as any)?.data?.list?.studentalldata;
            const studentGroupDataArray = (reportArray as any)?.data?.list?.groupalldata;
            const BalanceGroupDataArray = (reportArray as any)?.data?.list;
            const studentHeadArray = (reportArray as any)?.data?.list?.headalldata;
            const studentClassArray = (reportArray as any)?.data?.list?.classalldata;

            let hasData = false;
            if (studentDataArray != null) {
                if (studentDataArray && Array.isArray(studentDataArray)) {
                    const studentData = JSON.parse(JSON.stringify(studentDataArray));
                    const mapApiToReportRows = (apiData: any[]): IStudentFeeDefaulterReport[] => {
                        return apiData.map((item, index) => ({
                            id: index + 1,
                            amsT_AdmNo: item.amsT_AdmNo,
                            amsT_emailId: item.amsT_emailId,
                            amsT_FatherName: item.amsT_FatherName,
                            amsT_Id: item.amsT_Id,
                            amsT_MobileNo: item.amsT_MobileNo,
                            amsT_Route: item.amsT_Route,
                            asmcL_ClassName: item.asmcL_ClassName,
                            classSection: item.classSection,
                            fmG_GroupName: item.fmG_GroupName,
                            fmH_FeeName: item.fmH_FeeName,
                            fmT_Name: item.fmT_Name,
                            studentName: item.studentName,
                            totalBalance: item.totalBalance,
                            fine_Amount: item.fine_Amount,
                            admno: item.admno,
                            feeName: item.feeName,
                            className: item.className,
                            sectionName: item.sectionName,
                            fatherName: item.fatherName,
                            mobileNo: item.mobileNo,
                            email: item.email,
                            tobepaid: item.tobepaid
                        }));
                    };
                    const data = mapApiToReportRows(studentData);
                    setstudentReportData(data);
                    toast.success(reportArray.message);
                    if (studentData.length > 0) {
                        hasData = true;
                    }
                } else {
                    toast.info('No student data found!');
                    setstudentReportData([]);
                }
            }
            if (studentGroupDataArray != null) {
                if (studentGroupDataArray && Array.isArray(studentGroupDataArray)) {
                    const studentGroupData = JSON.parse(JSON.stringify(studentGroupDataArray));
                    const mapApiToReportRows = (apiData: any[]): IStudentFeeDefaulterReport[] => {
                        return apiData.map((item, index) => ({
                            id: index + 1,
                            amsT_AdmNo: item.amsT_AdmNo,
                            amsT_emailId: item.amsT_emailId,
                            amsT_FatherName: item.amsT_FatherName,
                            amsT_Id: item.amsT_Id,
                            amsT_MobileNo: item.amsT_MobileNo,
                            amsT_Route: item.amsT_Route,
                            asmcL_ClassName: item.asmcL_ClassName,
                            classSection: item.classSection,
                            fmG_GroupName: item.fmG_GroupName,
                            fmH_FeeName: item.fmH_FeeName,
                            fmT_Name: item.fmT_Name,
                            studentName: item.studentName,
                            totalBalance: item.totalBalance,
                            fine_Amount: item.fine_Amount,
                            admno: item.admno,
                            feeName: item.feeName,
                            className: item.className,
                            sectionName: item.sectionName,
                            fatherName: item.fatherName,
                            mobileNo: item.mobileNo,
                            email: item.email,
                            tobepaid: item.tobepaid
                        }));
                    };
                    const data = mapApiToReportRows(studentGroupData);
                    setstudentGroupReportData(data);
                    toast.success(reportArray.message);
                    if (studentGroupData.length > 0) {
                        hasData = true;
                    }
                } else {
                    toast.info('No group data found!');
                    setstudentGroupReportData([]);
                }
            }
            if (studentHeadArray != null) {
                if (studentHeadArray && Array.isArray(studentHeadArray)) {
                    const studentHeadData = JSON.parse(JSON.stringify(studentHeadArray));
                    const mapApiToReportRows = (apiData: any[]): IStudentFeeDefaulterReport[] => {
                        return apiData.map((item, index) => ({
                            id: index + 1,
                            amsT_AdmNo: item.amsT_AdmNo,
                            amsT_emailId: item.amsT_emailId,
                            amsT_FatherName: item.amsT_FatherName,
                            amsT_Id: item.amsT_Id,
                            amsT_MobileNo: item.amsT_MobileNo,
                            amsT_Route: item.amsT_Route,
                            asmcL_ClassName: item.asmcL_ClassName,
                            classSection: item.classSection,
                            fmG_GroupName: item.fmG_GroupName,
                            fmH_FeeName: item.fmH_FeeName,
                            fmT_Name: item.fmT_Name,
                            studentName: item.studentName,
                            totalBalance: item.totalBalance,
                            fine_Amount: item.fine_Amount,
                            admno: item.admno,
                            feeName: item.feeName,
                            className: item.className,
                            sectionName: item.sectionName,
                            fatherName: item.fatherName,
                            mobileNo: item.mobileNo,
                            email: item.email,
                            tobepaid: item.tobepaid
                        }));
                    };
                    const data = mapApiToReportRows(studentHeadData);
                    setstudentHeadReportData(data);
                    toast.success(reportArray.message);
                    if (studentHeadData.length > 0) {
                        hasData = true;
                    }
                } else {
                    toast.info('No group data found!');
                    setstudentGroupReportData([]);
                }
            }

            if (studentClassArray != null) {
                if (studentClassArray && Array.isArray(studentClassArray)) {
                    const studentClassData = JSON.parse(JSON.stringify(studentClassArray));
                    const mapApiToReportRows = (apiData: any[]): IStudentFeeDefaulterReport[] => {
                        return apiData.map((item, index) => ({
                            id: index + 1,
                            amsT_AdmNo: item.amsT_AdmNo,
                            amsT_emailId: item.amsT_emailId,
                            amsT_FatherName: item.amsT_FatherName,
                            amsT_Id: item.amsT_Id,
                            amsT_MobileNo: item.amsT_MobileNo,
                            amsT_Route: item.amsT_Route,
                            asmcL_ClassName: item.asmcL_ClassName,
                            classSection: item.classSection,
                            fmG_GroupName: item.fmG_GroupName,
                            fmH_FeeName: item.fmH_FeeName,
                            fmT_Name: item.fmT_Name,
                            studentName: item.studentName,
                            totalBalance: item.totalBalance,
                            fine_Amount: item.fine_Amount,
                            admno: item.admno,
                            feeName: item.feeName,
                            className: item.className,
                            sectionName: item.sectionName,
                            fatherName: item.fatherName,
                            mobileNo: item.mobileNo,
                            email: item.email,
                            tobepaid: item.tobepaid
                        }));
                    };
                    const data = mapApiToReportRows(studentClassData);
                    setstudentClassReportData(data);
                    toast.success(reportArray.message);
                    if (studentClassData.length > 0) {
                        hasData = true;
                    }
                } else {
                    toast.info('No group data found!');
                    setstudentClassReportData([]);
                }
            }

            if (BalanceGroupDataArray != null && filters.status.balance === true) {
                if (BalanceGroupDataArray && Array.isArray(BalanceGroupDataArray)) {
                    const balanceData: any[] = JSON.parse(JSON.stringify(BalanceGroupDataArray));
                    // Group data by student and collect unique fee names
                    const studentMap = new Map<number, any>();
                    const allFeeNames = new Set<string>(); // To collect all unique fee names
                    balanceData.forEach((item: any) => {
                        const key = item.amsT_Id; // Unique student identifier
                        const feeName = item.feeName?.trim();
                        // Add fee name to set
                        allFeeNames.add(feeName);
                        if (!studentMap.has(key)) {
                            studentMap.set(key, {
                                id: key,
                                amsT_AdmNo: item.amsT_AdmNo,
                                amsT_emailId: item.amsT_emailId,
                                amsT_FatherName: item.amsT_FatherName,
                                amsT_Id: item.amsT_Id,
                                amsT_MobileNo: item.amsT_MobileNo,
                                amsT_Route: item.amsT_Route,
                                asmcL_ClassName: item.asmcL_ClassName,
                                classSection: item.classSection,
                                fmG_GroupName: item.fmG_GroupName,
                                fmT_Name: item.fmT_Name || '',
                                fmH_FeeName: item.fmH_FeeName || '',
                                feeName: item.feeName || '',
                                studentName: item.studentName,
                                totalBalance: 0,
                                fine_Amount: item.fine_Amount || 0,
                                admno: item.admno,
                                className: item.className,
                                sectionName: item.sectionName,
                                fatherName: item.fatherName,
                                mobileNo: item.mobileNo,
                                email: item.email,
                                tobepaid: 0,
                                feeCategories: {}
                            });
                        }
                        const student = studentMap.get(key);
                        // Add fees to appropriate category
                        if (!student.feeCategories[feeName]) {
                            student.feeCategories[feeName] = 0;
                        }
                        student.feeCategories[feeName] += Number(item.tobepaid) || 0;
                        // Update total balance - fix the reduce type issue
                        student.tobepaid = Object.values(student.feeCategories).reduce(
                            (sum: number, fee: unknown) => sum + (Number(fee) || 0),
                            0
                        );
                        student.totalBalance = student.tobepaid;
                    });

                    // Convert map to array and map to desired format
                    const groupedData = Array.from(studentMap.values());
                    const feeNamesArray = Array.from(allFeeNames); // Get array of all fee names

                    const mapApiToReportRows = (apiData: any[]): IStudentFeeDefaulterReport[] => {
                        return apiData.map((item, index) => {
                            // Create the base object matching the interface
                            const reportObj: IStudentFeeDefaulterReport = {
                                id: index + 1,
                                amsT_Id: item.amsT_Id,
                                totalBalance: item.totalBalance,
                                studentName: item.studentName,
                                amsT_AdmNo: item.amsT_AdmNo,
                                classSection: item.classSection,
                                amsT_MobileNo: item.amsT_MobileNo,
                                amsT_FatherName: item.amsT_FatherName,
                                amsT_emailId: item.amsT_emailId,
                                fmT_Name: item.fmT_Name || '',
                                fmG_GroupName: item.fmG_GroupName,
                                fmH_FeeName: item.fmH_FeeName || '',
                                asmcL_ClassName: item.asmcL_ClassName,
                                amsT_Route: item.amsT_Route,
                                fine_Amount: item.fine_Amount,
                                admno: item.admno,
                                feeName: item.feeName || '',
                                className: item.className,
                                sectionName: item.sectionName,
                                fatherName: item.fatherName,
                                mobileNo: item.mobileNo,
                                email: item.email,
                                tobepaid: item.tobepaid
                            };

                            // Add dynamic fee properties as additional properties (TypeScript will allow this with type assertion)
                            const dynamicFeeProps: Record<string, any> = {};
                            Object.entries(item.feeCategories || {}).forEach(([key, value]) => {
                                const propName = key.toLowerCase().replace(/\s+/g, '_');
                                dynamicFeeProps[propName] = value;
                            });
                            return {
                                ...reportObj,
                                ...dynamicFeeProps,
                                // Include feeCategories as an extra property if needed for rendering
                                feeCategories: item.feeCategories
                            } as IStudentFeeDefaulterReport & Record<string, any>;
                        });
                    };

                    const data = mapApiToReportRows(groupedData);
                    setBalanceReportData(data as IStudentFeeDefaulterReport[]);
                    // Also store the dynamic fee names for table header generation
                    setDynamicFeeNames(feeNamesArray);

                    toast.success(reportArray.message);
                    if (balanceData.length > 0) {
                        hasData = true;
                    }
                } else {
                    toast.info('No student data found!');
                    setBalanceReportData([]);
                    setDynamicFeeNames([]);
                }
            }

            if (hasData) {
                const combinedData = [
                    ...(studentDataArray || []),
                    ...(studentGroupDataArray || []),
                    ...(studentHeadArray || []),
                    ...(studentClassArray || [])
                ];
                setReportData(combinedData);
                setShowReport(true);
            } else {
                setReportData([]);
                setShowReport(false);
                toast.info('No data available for the report!');
            }
        } catch (error: any) {
            console.error('Error generating report:', error);
            toast.error(error.message || 'Failed to generate report');
            setShowReport(false);
        } finally {
            setReportLoading(false);
        }
    };

    const isAcademicYearSelected = watch('academicYearId');
    const isClassSectionEnabled = filters.includeClassSection;
    const showDateSection = filters.viewMode === 'date';
    const showBalancecheckbox = filters.userType === 'Student' && filters.breakdown === 'Student/Staff Wise';

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            <h1 className='mb-8 font-bold text-3xl text-gray-900'>Yearly Fee Defaulter Report</h1>

                            <div className='space-y-8'>
                                {/* User Type Card */}
                                <Card className='border bg-gray-50 p-5 shadow-sm'>
                                    <div className='flex flex-wrap items-center justify-center gap-10'>
                                        {(['Student', 'Staff', 'Others'] as const).map((type) => (
                                            <label key={type} className='flex cursor-pointer items-center gap-3'>
                                                <input
                                                    type='radio'
                                                    name='userType'
                                                    checked={filters.userType === type}
                                                    onChange={() => setFilters((prev) => ({ ...prev, userType: type }))}
                                                    className='h-5 w-5 text-primary'
                                                />
                                                <span className='font-medium text-base'>{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Card>

                                {/* View Mode + Academic Year */}
                                <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                                    <Card className='border bg-gray-50 p-5 shadow-sm'>
                                        <div className='flex items-center gap-10'>
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

                                    <div className='space-y-3'>
                                        <Label className='font-semibold text-lg'>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='academicYearId'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value?.toString()}
                                                    onValueChange={(v) => {
                                                        const num = Number(v);
                                                        field.onChange(num);
                                                    }}>
                                                    <SelectTrigger className='w-full text-center'>
                                                        <SelectValue placeholder='--Select Academic Year--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {academicYears?.map((item: any) => (
                                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                {item.asmaY_Year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.academicYearId && (
                                            <FormError className='mt-1'>{errors.academicYearId.message}</FormError>
                                        )}{' '}
                                    </div>
                                </div>

                                <Card className='border bg-gray-50 p-5 shadow-sm'>
                                    <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6'>
                                        <Controller
                                            name='breakdown'
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    {breakdownOptions.map((option) => (
                                                        <Label key={option.value} className='flex cursor-pointer items-center gap-3'>
                                                            <Input
                                                                type='radio'
                                                                name={field.name}
                                                                value={option.value}
                                                                checked={field.value === option.value}
                                                                onChange={() => {
                                                                    field.onChange(option.value);
                                                                }}
                                                                className='h-5 w-5 text-primary'
                                                            />
                                                            <span>{option.label}</span>
                                                        </Label>
                                                    ))}
                                                </>
                                            )}
                                        />
                                    </div>
                                </Card>

                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                                    <div className='space-y-3'>
                                        <Label className='font-semibold text-lg'>
                                            Custom Group<span className='text-red-500'>*</span>
                                        </Label>
                                        <Card className='border bg-gray-50 p-4'>
                                            <Controller
                                                name='customGroupIds'
                                                control={control}
                                                render={({ field }) => {
                                                    const selectedIds = field.value ?? [];
                                                    const allIds = customGroups.map((g) => g.fmgG_Id);

                                                    const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;

                                                    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allIds.length;

                                                    return (
                                                        <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                            {/* SELECT ALL */}
                                                            <Label className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-200'>
                                                                <Checkbox
                                                                    checked={isAllSelected}
                                                                    indeterminate={isIndeterminate}
                                                                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                        const value = checked === true ? allIds : [];

                                                                        field.onChange(value);
                                                                        setValue('customGroupIds', value, {
                                                                            shouldValidate: true,
                                                                            shouldDirty: true,
                                                                            shouldTouch: true
                                                                        });
                                                                    }}
                                                                />

                                                                <span>Select All</span>
                                                            </Label>

                                                            {/* LOADING */}
                                                            {loadingCustomGroup ? (
                                                                <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                            ) : customGroups.length > 0 ? (
                                                                customGroups.map((group) => {
                                                                    const checked = selectedIds.includes(group.fmgG_Id);

                                                                    return (
                                                                        <Label
                                                                            key={group.fmgG_Id}
                                                                            className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                            <Checkbox
                                                                                checked={checked}
                                                                                onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                                    const value =
                                                                                        checked === true
                                                                                            ? [...selectedIds, group.fmgG_Id]
                                                                                            : selectedIds.filter(
                                                                                                  (id) => id !== group.fmgG_Id
                                                                                              );

                                                                                    field.onChange(value);
                                                                                    setValue('customGroupIds', value, {
                                                                                        shouldValidate: true,
                                                                                        shouldDirty: true,
                                                                                        shouldTouch: true
                                                                                    });
                                                                                }}
                                                                            />

                                                                            <span className='font-medium text-sm'>
                                                                                {group.fmgG_GroupName}
                                                                            </span>
                                                                        </Label>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className='py-4 text-center text-gray-500'>No custom groups</div>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </Card>
                                        {errors.customGroupIds && <FormError>{errors.customGroupIds.message}</FormError>}
                                    </div>

                                    {/* Fee Group */}
                                    <div className='space-y-3'>
                                        <Label className='font-semibold text-lg'>
                                            Fee Group <span className='text-red-500'>*</span>
                                        </Label>
                                        <Card className='border bg-gray-50 p-4'>
                                            <Controller
                                                name='feeGroupIds'
                                                control={control}
                                                render={({ field }) => {
                                                    const selectedIds = field.value ?? [];
                                                    const allIds = feeGroups.map((g) => g.fmG_Id);

                                                    const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;

                                                    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allIds.length;

                                                    return (
                                                        <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                            {/* SELECT ALL */}
                                                            <Label className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-200'>
                                                                <Checkbox
                                                                    checked={isAllSelected}
                                                                    indeterminate={isIndeterminate}
                                                                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                        const value = checked === true ? allIds : [];

                                                                        field.onChange(value);
                                                                        setValue('feeGroupIds', value, {
                                                                            shouldValidate: true,
                                                                            shouldDirty: true,
                                                                            shouldTouch: true
                                                                        });
                                                                    }}
                                                                />
                                                                <span>Select All</span>
                                                            </Label>

                                                            {/* LOADING */}
                                                            {loadingfeegroup ? (
                                                                <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                            ) : feeGroups.length > 0 ? (
                                                                feeGroups.map((group) => {
                                                                    const checked = selectedIds.includes(group.fmG_Id);

                                                                    return (
                                                                        <Label
                                                                            key={group.fmG_Id}
                                                                            className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                            <Checkbox
                                                                                checked={checked}
                                                                                onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                                    const value =
                                                                                        checked === true
                                                                                            ? [...selectedIds, group.fmG_Id]
                                                                                            : selectedIds.filter(
                                                                                                  (id) => id !== group.fmG_Id
                                                                                              );

                                                                                    field.onChange(value);
                                                                                    setValue('feeGroupIds', value, {
                                                                                        shouldValidate: true,
                                                                                        shouldDirty: true,
                                                                                        shouldTouch: true
                                                                                    });
                                                                                }}
                                                                            />
                                                                            <span className='text-sm'>{group.fmG_GroupName}</span>
                                                                        </Label>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className='py-4 text-center text-gray-500'>No fee groups</div>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </Card>
                                        {errors.feeGroupIds && <FormError>{errors.feeGroupIds.message}</FormError>}
                                    </div>

                                    {/* Term */}
                                    <div className='space-y-3'>
                                        <Label className='font-semibold text-lg'>
                                            Term Name <span className='text-red-500'>*</span>
                                        </Label>
                                        <Card className='border bg-gray-50 p-4'>
                                            <Controller
                                                name='termIds'
                                                control={control}
                                                render={({ field }) => {
                                                    const selectedIds = field.value ?? [];
                                                    const allIds = feeTerms.map((t) => t.fmT_Id);

                                                    const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;

                                                    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allIds.length;

                                                    return (
                                                        <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                            {/* SELECT ALL */}
                                                            <Label className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-200'>
                                                                <Checkbox
                                                                    checked={isAllSelected}
                                                                    indeterminate={isIndeterminate}
                                                                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                        const value = checked === true ? allIds : [];

                                                                        field.onChange(value);
                                                                        setValue('termIds', value, {
                                                                            shouldValidate: true,
                                                                            shouldDirty: true,
                                                                            shouldTouch: true
                                                                        });
                                                                    }}
                                                                />
                                                                <span>Select All</span>
                                                            </Label>

                                                            {/* LOADING */}
                                                            {loadingfeeterm ? (
                                                                <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                            ) : feeTerms.length > 0 ? (
                                                                feeTerms.map((term) => {
                                                                    const checked = selectedIds.includes(term.fmT_Id);

                                                                    return (
                                                                        <Label
                                                                            key={term.fmT_Id}
                                                                            className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                            <Checkbox
                                                                                checked={checked}
                                                                                onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                                    const value =
                                                                                        checked === true
                                                                                            ? [...selectedIds, term.fmT_Id]
                                                                                            : selectedIds.filter(
                                                                                                  (id) => id !== term.fmT_Id
                                                                                              );

                                                                                    field.onChange(value);
                                                                                    setValue('termIds', value, {
                                                                                        shouldValidate: true,
                                                                                        shouldDirty: true,
                                                                                        shouldTouch: true
                                                                                    });
                                                                                }}
                                                                            />
                                                                            <span className='text-sm'>{term.fmT_Name}</span>
                                                                        </Label>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className='py-4 text-center text-gray-500'>No terms</div>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </Card>
                                        {errors.termIds && <FormError>{errors.termIds.message}</FormError>}
                                    </div>

                                    {/* Bus Route */}
                                    <div className='space-y-3'>
                                        <Label className='font-semibold text-lg'>
                                            Bus Route<span className='text-red-500'>*</span>
                                        </Label>
                                        <Card className='border bg-gray-50 p-4'>
                                            <Controller
                                                name='busRouteIds'
                                                control={control}
                                                render={({ field }) => {
                                                    const selectedIds = field.value ?? [];
                                                    const allIds = feeBusRoutes.map((r) => r.trmR_Id);

                                                    const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;

                                                    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allIds.length;

                                                    return (
                                                        <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                            {/* SELECT ALL */}
                                                            <Label className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-200'>
                                                                <Checkbox
                                                                    checked={isAllSelected}
                                                                    indeterminate={isIndeterminate}
                                                                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                        const value = checked === true ? allIds : [];

                                                                        field.onChange(value);
                                                                        setValue('busRouteIds', value, {
                                                                            shouldValidate: true,
                                                                            shouldDirty: true,
                                                                            shouldTouch: true
                                                                        });
                                                                    }}
                                                                />
                                                                <span>Select All</span>
                                                            </Label>

                                                            {/* LOADING */}
                                                            {loadingBusRoutes ? (
                                                                <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                            ) : feeBusRoutes.length > 0 ? (
                                                                feeBusRoutes.map((route) => {
                                                                    const checked = selectedIds.includes(route.trmR_Id);

                                                                    return (
                                                                        <Label
                                                                            key={route.trmR_Id}
                                                                            className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                            <Checkbox
                                                                                checked={checked}
                                                                                onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                                    const value =
                                                                                        checked === true
                                                                                            ? [...selectedIds, route.trmR_Id]
                                                                                            : selectedIds.filter(
                                                                                                  (id) => id !== route.trmR_Id
                                                                                              );

                                                                                    field.onChange(value);
                                                                                    setValue('busRouteIds', value, {
                                                                                        shouldValidate: true,
                                                                                        shouldDirty: true,
                                                                                        shouldTouch: true
                                                                                    });
                                                                                }}
                                                                            />
                                                                            <span className='text-sm'>{route.trmR_RouteName}</span>
                                                                        </Label>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className='py-4 text-center text-gray-500'>No bus routes</div>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </Card>
                                    </div>
                                </div>

                                {/* Class & Section + Status + Date (Date section is conditional) */}
                                <div className='space-y-6 border-t pt-8'>
                                    <div className='flex flex-wrap items-center gap-6'>
                                        <div className='flex items-center gap-3'>
                                            <Checkbox
                                                id='includeClass'
                                                checked={filters.includeClassSection}
                                                onCheckedChange={(checked: any) => {
                                                    const value = !!checked;

                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        includeClassSection: value,
                                                        classId: value ? prev.classId : 0,
                                                        sectionId: value ? prev.sectionId : 0
                                                    }));

                                                    // 🔑 THIS IS THE KEY
                                                    setValue('includeClassSection', value, {
                                                        shouldValidate: true
                                                    });

                                                    if (!value) {
                                                        setValue('classId', 0);
                                                        setValue('sectionId', 0);
                                                        setSections([]);
                                                    }
                                                }}
                                                disabled={!isAcademicYearSelected}
                                            />

                                            <Label htmlFor='includeClass' className='cursor-pointer font-medium'>
                                                Class
                                            </Label>
                                        </div>

                                        <div className='w-1/2'>
                                            <Controller
                                                name='classId'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value ? field.value.toString() : ''}
                                                        onValueChange={(v) => {
                                                            const num = Number(v);
                                                            field.onChange(num);

                                                            // 🔑 Trigger validation
                                                            setValue('classId', num, {
                                                                shouldValidate: true
                                                            });
                                                            setValue('sectionId', 0, {
                                                                shouldValidate: true
                                                            });
                                                        }}
                                                        disabled={!isClassSectionEnabled || loadingClasses}>
                                                        <SelectTrigger className='w-full text-center'>
                                                            <SelectValue placeholder='--Select Class--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {classes.map((cls) => (
                                                                <SelectItem key={cls.asmcL_Id} value={String(cls.asmcL_Id)}>
                                                                    {cls.asmcL_ClassName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />

                                            {errors.classId && <FormError className='mt-1'>{errors.classId.message}</FormError>}
                                        </div>

                                        {filters.includeClassSection && (
                                            <>
                                                <div className='flex items-center gap-2'>
                                                    <Label className='font-medium'>Section</Label>
                                                    <span className='text-red-500'>*</span>
                                                </div>

                                                <div className='min-w-[220px] flex-1'>
                                                    <Controller
                                                        name='sectionId'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select
                                                                value={field.value ? field.value.toString() : ''}
                                                                onValueChange={(v) => {
                                                                    const num = Number(v);
                                                                    field.onChange(num);
                                                                    setValue('sectionId', num, {
                                                                        shouldValidate: true
                                                                    });
                                                                }}
                                                                disabled={!isClassSectionEnabled || loadingClasses}>
                                                                <SelectTrigger className='w-full text-center'>
                                                                    <SelectValue placeholder='--Select Section--' />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {sections.map((sec) => (
                                                                        <SelectItem key={sec.asmS_Id} value={String(sec.asmS_Id)}>
                                                                            {sec.asmC_SectionName}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />

                                                    {errors.sectionId && <FormError className='mt-1'>{errors.sectionId.message}</FormError>}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className='flex flex-wrap items-center justify-between gap-6'>
                                        <div className='flex flex-wrap items-center gap-8'>
                                            <div className='flex items-center gap-3'>
                                                <Checkbox
                                                    checked={filters.formatI}
                                                    onCheckedChange={(c: any) => setFilters((prev) => ({ ...prev, formatI: !!c }))}
                                                />
                                                <Label className='cursor-pointer'>Format-I</Label>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <Checkbox checked={filters.status.active} onCheckedChange={() => toggleStatus('active')} />
                                                <Label className='cursor-pointer'>Active</Label>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <Checkbox
                                                    checked={filters.status.deactive}
                                                    onCheckedChange={() => toggleStatus('deactive')}
                                                />
                                                <Label className='cursor-pointer'>Deactive</Label>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <Checkbox checked={filters.status.left} onCheckedChange={() => toggleStatus('left')} />
                                                <Label className='cursor-pointer'>Left</Label>
                                            </div>

                                            {filters.userType === 'Student' && breakdown === 'FSW' && (
                                                <div className='flex items-center gap-3'>
                                                    <Checkbox
                                                        checked={filters.status.balance}
                                                        onCheckedChange={() => toggleStatus('balance')}
                                                    />
                                                    <Label className='cursor-pointer'>Balance</Label>
                                                </div>
                                            )}

                                            <div className='flex items-center gap-3'>
                                                <Checkbox
                                                    checked={filters.bulkDownload}
                                                    onCheckedChange={(c: any) =>
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            bulkDownload: !!c
                                                        }))
                                                    }
                                                />
                                                <Label className='cursor-pointer'>Bulk Download</Label>
                                            </div>
                                        </div>
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
                                                    <label className='flex cursor-pointer items-center gap-3'>
                                                        <input
                                                            type='radio'
                                                            name='dueDateType'
                                                            checked={filters.dueDateType === 'duedate'}
                                                            onChange={() =>
                                                                setFilters((prev) => ({
                                                                    ...prev,
                                                                    dueDateType: 'duedate'
                                                                }))
                                                            }
                                                            className='h-4 w-4 text-primary'
                                                        />
                                                        <span className='font-medium'>Due Date</span>
                                                    </label>
                                                    <label className='flex cursor-pointer items-center gap-3'>
                                                        <input
                                                            type='radio'
                                                            name='dueDateType'
                                                            checked={filters.dueDateType === 'tillduedate'}
                                                            onChange={() =>
                                                                setFilters((prev) => ({
                                                                    ...prev,
                                                                    dueDateType: 'tillduedate'
                                                                }))
                                                            }
                                                            className='h-4 w-4 text-primary'
                                                        />
                                                        <span className='font-medium'>Till Due Date</span>
                                                    </label>
                                                </div>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {/* ==================== ACTION BUTTONS ==================== */}
                                    <div className='flex justify-end gap-4 border-t pt-8'>
                                        <Button size='lg' variant='outline' className='px-8' onClick={() => window.location.reload()}>
                                            Cancel
                                        </Button>
                                        <Button type='submit' disabled={isSubmitting} className='min-w-32'>
                                            {isSubmitting ? 'Generating...' : 'Report'}
                                        </Button>
                                    </div>
                                    {showReport &&
                                        (studentreportData.length > 0 ||
                                            studentGroupreportData.length > 0 ||
                                            studentHeadreportData.length > 0 ||
                                            studentClassreportData.length > 0 ||
                                            balancereportData.length > 0) && (
                                            <div className='-mx-8 mt-12 overflow-hidden rounded-lg bg-white shadow-xl'>
                                                {/* Loading State */}
                                                {reportLoading ? (
                                                    <div className='p-24 text-center'>
                                                        <div className='inline-block h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                                                        <p className='mt-6 text-lg text-muted-foreground'>
                                                            Generating report, please wait...
                                                        </p>
                                                    </div>
                                                ) : (
                                                    /* Table Inside CollapsibleSection */
                                                    <CollapsibleSection
                                                        defaultOpen={true}
                                                        variant='default'
                                                        size='lg'
                                                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                                                        <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                                                            <div className='mb-6 text-center'>
                                                                <h2 className='font-bold text-2xl text-primary'>Fee Defaulter Report</h2>
                                                            </div>
                                                            {studentGroupreportData.length > 0 && (
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
                                                            {filters.userType === 'Student' &&
                                                                studentHeadreportData.length > 0 &&
                                                                breakdown === 'FHW' && (
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

                                                            {filters.userType === 'Student' &&
                                                                studentClassreportData.length > 0 &&
                                                                breakdown === 'FCW' && (
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
                                                            {filters.userType === 'Student' &&
                                                                studentreportData.length > 0 &&
                                                                breakdown === 'FSW' && (
                                                                    <div className='flex gap-3'>
                                                                        <div className='mb-4 flex justify-end gap-2'>
                                                                            <Button
                                                                                size='sm'
                                                                                className='h-8 w-auto px-3 text-xs'
                                                                                onClick={handleExportExcelforFeeStudentorStaffWise}>
                                                                                Export Excel
                                                                            </Button>

                                                                            <Button
                                                                                size='sm'
                                                                                variant='outline'
                                                                                className='h-8 w-auto px-3 text-xs'
                                                                                onClick={handlePrintforFeeStudentorStaffWise}>
                                                                                Print
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            {filters.userType === 'Student' &&
                                                                studentreportData.length > 0 &&
                                                                breakdown === 'FIW' && (
                                                                    <div className='flex gap-3'>
                                                                        <div className='mb-4 flex justify-end gap-2'>
                                                                            <Button
                                                                                size='sm'
                                                                                className='h-8 w-auto px-3 text-xs'
                                                                                onClick={handleExportExcelforFeeInstallmentWise}>
                                                                                Export Excel
                                                                            </Button>

                                                                            <Button
                                                                                size='sm'
                                                                                variant='outline'
                                                                                className='h-8 w-auto px-3 text-xs'
                                                                                onClick={handlePrintforFeeInstallmentWise}>
                                                                                Print
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {filters.userType === 'Student' &&
                                                                balancereportData.length > 0 &&
                                                                breakdown === 'FSW' &&
                                                                filters.status.balance === true && (
                                                                    <div className='flex gap-3'>
                                                                        <div className='mb-4 flex justify-end gap-2'>
                                                                            <Button
                                                                                size='sm'
                                                                                className='h-8 w-auto px-3 text-xs'
                                                                                onClick={
                                                                                    HandleexportToExcelforFeeStudentorStaffWiseofBalance
                                                                                }>
                                                                                Export Excel
                                                                            </Button>

                                                                            <Button
                                                                                size='sm'
                                                                                variant='outline'
                                                                                className='h-8 w-auto px-3 text-xs'
                                                                                onClick={handlePrintforFeeStudentorStaffWiseofBalance}>
                                                                                Print
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            {/* <div className="flex gap-3">
                              <div className="mb-4 flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  className="h-8 w-auto px-3 text-xs"
                                  onClick={handleExportExcelforFeeGroupWise}
                                >
                                  Export Excel
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-auto px-3 text-xs"
                                  onClick={handlePrintforFeeGroupWise}
                                >
                                  Print
                                </Button>
                              </div>
                            </div> */}
                                                            {selectedIds.length > 0 && (
                                                                <div className='mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm'>
                                                                    {/* Checkboxes Section */}
                                                                    <div className='mb-3'>
                                                                        <div className='flex items-center gap-2 font-medium text-gray-700 text-sm'>
                                                                            <span>Please Select Check Box For:</span>
                                                                            <div className='ml-2 flex items-center gap-4'>
                                                                                {['email', 'sms', 'notification', 'whatsapp'].map(
                                                                                    (method) => (
                                                                                        <div
                                                                                            key={method}
                                                                                            className='flex items-center gap-1.5'>
                                                                                            <Checkbox
                                                                                                id={`${method}-checkbox`}
                                                                                                checked={
                                                                                                    communicationMethods[
                                                                                                        method as keyof typeof communicationMethods
                                                                                                    ]
                                                                                                }
                                                                                                onCheckedChange={() =>
                                                                                                    toggleCommunicationMethod(
                                                                                                        method as keyof typeof communicationMethods
                                                                                                    )
                                                                                                }
                                                                                                className='h-4 w-4'
                                                                                            />
                                                                                            <Label
                                                                                                htmlFor={`${method}-checkbox`}
                                                                                                className='cursor-pointer text-sm uppercase'>
                                                                                                {method === 'whatsapp'
                                                                                                    ? 'WhatsApp'
                                                                                                    : method}
                                                                                            </Label>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Show REQUEST button only if exactly ONE communication method is selected */}
                                                                    {(communicationMethods.email ||
                                                                        communicationMethods.sms ||
                                                                        communicationMethods.notification) &&
                                                                        !(communicationMethods.email && communicationMethods.sms) &&
                                                                        !(
                                                                            communicationMethods.email && communicationMethods.notification
                                                                        ) &&
                                                                        !(
                                                                            communicationMethods.sms && communicationMethods.notification
                                                                        ) && (
                                                                            <div className='mt-3 flex justify-end'>
                                                                                <Button
                                                                                    size='sm'
                                                                                    className='h-8 px-6 text-xs'
                                                                                    onClick={handleRequestCommunication}
                                                                                    disabled={selectedIds.length === 0}>
                                                                                    REQUEST
                                                                                </Button>
                                                                            </div>
                                                                        )}

                                                                    {/* Show error if multiple methods are selected */}
                                                                    {(communicationMethods.email && communicationMethods.sms) ||
                                                                    (communicationMethods.email && communicationMethods.notification) ||
                                                                    (communicationMethods.sms && communicationMethods.notification) ? (
                                                                        <div className='mt-2 text-center text-red-500 text-sm'>
                                                                            Please select only one communication method
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            {/* Search */}
                                                            <input
                                                                value={search}
                                                                onChange={(e) => setSearch(e.target.value)}
                                                                placeholder='Search...'
                                                                className='w-72 rounded border px-3 py-2'
                                                            />

                                                            {/* Table */}
                                                            {studentGroupreportData.length > 0 && (
                                                                <div className='overflow-x-auto border'>
                                                                    <table className='w-full table-auto border-collapse'>
                                                                        <thead className='bg-primary text-white'>
                                                                            <tr>
                                                                                <th className='p-2 text-center'>
                                                                                    <Checkbox
                                                                                        checked={
                                                                                            selectedIds.length === filteredData.length &&
                                                                                            filteredData.length > 0
                                                                                        }
                                                                                        indeterminate={
                                                                                            selectedIds.length > 0 &&
                                                                                            selectedIds.length < filteredData.length
                                                                                        }
                                                                                        onCheckedChange={toggleAll}
                                                                                    />
                                                                                </th>
                                                                                <th className='p-2 text-center'>Sl No</th>
                                                                                <th
                                                                                    className='cursor-pointer p-2 text-center'
                                                                                    onClick={() => handleSort('feeGroup')}>
                                                                                    Group Name{' '}
                                                                                    {sortKey === 'feeGroup' &&
                                                                                        (sortOrder === 'asc' ? '↑' : '↓')}
                                                                                </th>
                                                                                <th
                                                                                    className='cursor-pointer p-2 text-center'
                                                                                    onClick={() => handleSort('totalDue')}>
                                                                                    Balance Amount{' '}
                                                                                    {sortKey === 'totalDue' &&
                                                                                        (sortOrder === 'asc' ? '↑' : '↓')}
                                                                                </th>
                                                                            </tr>
                                                                        </thead>

                                                                        <tbody>
                                                                            {studentGroupreportData.map((row, index) => (
                                                                                <tr key={row.id} className='border-b'>
                                                                                    <td className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={selectedIds.includes(row.id)}
                                                                                            onCheckedChange={() => toggleRow(row.id)}
                                                                                        />
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-medium'>
                                                                                        {index + 1}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-medium'>
                                                                                        {row.fmG_GroupName}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold'>
                                                                                        ₹{row.totalBalance.toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}

                                                                            {/* Total */}
                                                                            <tr className='bg-gray-100 font-bold'>
                                                                                <td />
                                                                                <td />
                                                                                <td className='p-2 text-center'>Total</td>
                                                                                <td className='p-2 text-center'>
                                                                                    ₹{totalBalance.toLocaleString('en-IN')}
                                                                                </td>
                                                                            </tr>

                                                                            {/* Selected Total */}
                                                                            <tr className='bg-gray-200 font-bold'>
                                                                                <td />
                                                                                <td />
                                                                                <td className='p-2 text-center'>Selected Balance</td>
                                                                                <td className='p-2 text-center'>
                                                                                    ₹{selectedBalance.toLocaleString('en-IN')}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                            {filters.userType === 'Student' &&
                                                                studentHeadreportData.length > 0 &&
                                                                breakdown === 'FHW' && (
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length ===
                                                                                                    filteredData.length &&
                                                                                                filteredData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length < filteredData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAll}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th
                                                                                        className='cursor-pointer p-2 text-center'
                                                                                        onClick={() => handleSort('fmH_FeeName')}>
                                                                                        Head Name{' '}
                                                                                        {sortKey === 'fmH_FeeName' &&
                                                                                            (sortOrder === 'asc' ? '↑' : '↓')}
                                                                                    </th>
                                                                                    <th
                                                                                        className='cursor-pointer p-2 text-center'
                                                                                        onClick={() => handleSort('totalBalance')}>
                                                                                        Balance Amount{' '}
                                                                                        {sortKey === 'totalBalance' &&
                                                                                            (sortOrder === 'asc' ? '↑' : '↓')}
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>

                                                                            <tbody>
                                                                                {studentHeadreportData.map((row, index) => (
                                                                                    <tr key={row.id} className='border-b'>
                                                                                        <td className='p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {row.fmH_FeeName}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{row.totalBalance.toLocaleString('en-IN')}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                {/* Total */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td />
                                                                                    <td />
                                                                                    <td className='p-2 text-center'>Total</td>
                                                                                    <td className='p-2 text-center'>
                                                                                        ₹{totalBalance.toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}

                                                            {filters.userType === 'Student' &&
                                                                studentClassreportData.length > 0 &&
                                                                breakdown === 'FCW' && (
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length ===
                                                                                                    filteredData.length &&
                                                                                                filteredData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length < filteredData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAll}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th
                                                                                        className='cursor-pointer p-2 text-center'
                                                                                        onClick={() => handleSort('fmH_FeeName')}>
                                                                                        Class Name{' '}
                                                                                        {sortKey === 'fmH_FeeName' &&
                                                                                            (sortOrder === 'asc' ? '↑' : '↓')}
                                                                                    </th>
                                                                                    <th
                                                                                        className='cursor-pointer p-2 text-center'
                                                                                        onClick={() => handleSort('totalBalance')}>
                                                                                        Balance Amount{' '}
                                                                                        {sortKey === 'totalBalance' &&
                                                                                            (sortOrder === 'asc' ? '↑' : '↓')}
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>

                                                                            <tbody>
                                                                                {studentClassreportData.map((row, index) => (
                                                                                    <tr key={row.id} className='border-b'>
                                                                                        <td className='p-2 text-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedIds.includes(row.id)}
                                                                                                onCheckedChange={() => toggleRow(row.id)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-medium'>
                                                                                            {row.asmcL_ClassName}
                                                                                        </td>
                                                                                        <td className='p-2 text-center font-bold'>
                                                                                            ₹{row.totalBalance.toLocaleString('en-IN')}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                {/* Total */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td />
                                                                                    <td />
                                                                                    <td className='p-2 text-center'>Total</td>
                                                                                    <td className='p-2 text-center'>
                                                                                        ₹{totalBalance.toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                            {filters.userType === 'Student' &&
                                                                studentreportData.length > 0 &&
                                                                breakdown === 'FSW' && (
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length ===
                                                                                                    studentreportData.length &&
                                                                                                studentreportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length <
                                                                                                    studentreportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllstudents}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('studentName')}
                                                                                        >
                                                                                            Name
                                                                                            {sortConfig?.key === 'studentName' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('amsT_AdmNo')}
                                                                                        >
                                                                                            Admission No
                                                                                            {sortConfig?.key === 'amsT_AdmNo' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('classSection')}
                                                                                        >
                                                                                            Class & Section
                                                                                            {sortConfig?.key === 'classSection' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() =>
                                                                                                handleSortfull('amsT_FatherName')
                                                                                            }
                                                                                        >
                                                                                            Father Name
                                                                                            {sortConfig?.key === 'amsT_FatherName' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('amsT_MobileNo')}
                                                                                        >
                                                                                            Mobile Number
                                                                                            {sortConfig?.key === 'amsT_MobileNo' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('amsT_emailId')}
                                                                                        >
                                                                                            Email ID
                                                                                            {sortConfig?.key === 'amsT_emailId' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('amsT_Route')}
                                                                                        >
                                                                                            Route
                                                                                            {sortConfig?.key === 'amsT_Route' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('totalBalance')}
                                                                                        >
                                                                                            Balance Amount
                                                                                            {sortConfig?.key === 'totalBalance' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('totalBalance')}
                                                                                        >
                                                                                            Fine Amount
                                                                                            {sortConfig?.key === 'totalBalance' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('totalBalance')}
                                                                                        >
                                                                                            Total Amount
                                                                                            {sortConfig?.key === 'totalBalance' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {filteredStudentData.length === 0 ? (
                                                                                    <tr>
                                                                                        <td
                                                                                            colSpan={11}
                                                                                            className='p-4 text-center text-gray-500'>
                                                                                            {search.trim()
                                                                                                ? `No students found for "${search}"`
                                                                                                : 'No student data available'}
                                                                                        </td>
                                                                                    </tr>
                                                                                ) : (
                                                                                    // Use sortedData for display (which sorts the filtered data)
                                                                                    sortedData.map((row, index) => (
                                                                                        <tr
                                                                                            key={row.id}
                                                                                            className='border-b hover:bg-gray-50'>
                                                                                            <td className='p-2 text-center'>
                                                                                                <Checkbox
                                                                                                    checked={selectedIds.includes(row.id)}
                                                                                                    onCheckedChange={() =>
                                                                                                        toggleRow(row.id)
                                                                                                    }
                                                                                                />
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-medium'>
                                                                                                {index + 1}
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-medium'>
                                                                                                {row.studentName}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.amsT_AdmNo}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.classSection}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.amsT_FatherName}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.amsT_MobileNo}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.amsT_emailId}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.amsT_Route}
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-bold'>
                                                                                                ₹{row.totalBalance.toLocaleString('en-IN')}
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-bold'>
                                                                                                ₹{row.fine_Amount ?? 0}
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-bold'>
                                                                                                ₹{row.totalBalance.toLocaleString('en-IN')}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                )}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td colSpan={9} className='p-2 text-right'>
                                                                                        Balance:
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {sortedData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalBalance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {sortedData.reduce(
                                                                                            (sum, row) => sum + (row.fine_Amount || 0),
                                                                                            0
                                                                                        )}
                                                                                    </td>
                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {sortedData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.totalBalance || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td colSpan={2}> </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div>Total Records : {studentreportData.length}</div>
                                                                    </div>
                                                                )}
                                                            {filters.userType === 'Student' &&
                                                                studentreportData.length > 0 &&
                                                                breakdown === 'FIW' && (
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length ===
                                                                                                    studentreportData.length &&
                                                                                                studentreportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length <
                                                                                                    studentreportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllstudents}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            onClick={() => handleSortfull('studentName')}>
                                                                                            Name
                                                                                            {sortConfig?.key === 'studentName' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('amsT_AdmNo')}
                                                                                        >
                                                                                            Admission No
                                                                                            {sortConfig?.key === 'amsT_AdmNo' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('classSection')}
                                                                                        >
                                                                                            Class & Section
                                                                                            {sortConfig?.key === 'classSection' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() =>
                                                                                                handleSortfull('amsT_FatherName')
                                                                                            }
                                                                                        >
                                                                                            Father Name
                                                                                            {sortConfig?.key === 'amsT_FatherName' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('amsT_MobileNo')}
                                                                                        >
                                                                                            Mobile Number
                                                                                            {sortConfig?.key === 'amsT_MobileNo' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('amsT_emailId')}
                                                                                        >
                                                                                            Email ID
                                                                                            {sortConfig?.key === 'amsT_emailId' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('fmT_Name')}
                                                                                        >
                                                                                            Term
                                                                                            {sortConfig?.key === 'fmT_Name' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            // className='flex items-center justify-center gap-1 hover:underline'
                                                                                            onClick={() => handleSortfull('totalBalance')}
                                                                                        >
                                                                                            Balance Amount
                                                                                            {sortConfig?.key === 'totalBalance' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {filteredStudentData.length === 0 ? (
                                                                                    <tr>
                                                                                        <td
                                                                                            colSpan={11}
                                                                                            className='p-4 text-center text-gray-500'>
                                                                                            {search.trim()
                                                                                                ? `No students found for "${search}"`
                                                                                                : 'No student data available'}
                                                                                        </td>
                                                                                    </tr>
                                                                                ) : (
                                                                                    // Use sortedData for display (which sorts the filtered data)
                                                                                    sortedData.map((row, index) => (
                                                                                        <tr
                                                                                            key={row.id}
                                                                                            className='border-b hover:bg-gray-50'>
                                                                                            <td className='p-2 text-center'>
                                                                                                <Checkbox
                                                                                                    checked={selectedIds.includes(row.id)}
                                                                                                    onCheckedChange={() =>
                                                                                                        toggleRow(row.id)
                                                                                                    }
                                                                                                />
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-medium'>
                                                                                                {index + 1}
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-medium'>
                                                                                                {row.studentName}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.amsT_AdmNo}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.classSection}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.amsT_FatherName}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.amsT_MobileNo}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.amsT_emailId}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.fmT_Name}
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-bold'>
                                                                                                ₹{row.totalBalance.toLocaleString('en-IN')}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                        <div>Total Records : {studentreportData.length}</div>
                                                                    </div>
                                                                )}
                                                            {filters.userType === 'Student' &&
                                                                balancereportData.length > 0 &&
                                                                breakdown === 'FSW' &&
                                                                filters.status.balance === true && (
                                                                    <div className='overflow-x-auto border'>
                                                                        <table className='w-full table-auto border-collapse'>
                                                                            <thead className='bg-primary text-white'>
                                                                                <tr>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                selectedIds.length ===
                                                                                                    balancereportData.length &&
                                                                                                balancereportData.length > 0
                                                                                            }
                                                                                            indeterminate={
                                                                                                selectedIds.length > 0 &&
                                                                                                selectedIds.length <
                                                                                                    balancereportData.length
                                                                                            }
                                                                                            onCheckedChange={toggleAllBalance}
                                                                                        />
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>Sl No</th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            onClick={() => handleSortfull('studentName')}>
                                                                                            Name
                                                                                            {sortConfig?.key === 'studentName' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button onClick={() => handleSortfull('admno')}>
                                                                                            Admission No
                                                                                            {sortConfig?.key === 'admno' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button onClick={() => handleSortfull('className')}>
                                                                                            Class
                                                                                            {sortConfig?.key === 'className' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            onClick={() => handleSortfull('sectionName')}>
                                                                                            Section
                                                                                            {sortConfig?.key === 'sectionName' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button
                                                                                            onClick={() => handleSortfull('fatherName')}>
                                                                                            Father Name
                                                                                            {sortConfig?.key === 'fatherName' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button onClick={() => handleSortfull('mobileNo')}>
                                                                                            Mobile Number
                                                                                            {sortConfig?.key === 'mobileNo' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    <th className='p-2 text-center'>
                                                                                        <Button onClick={() => handleSortfull('email')}>
                                                                                            Email ID
                                                                                            {sortConfig?.key === 'email' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                    {dynamicFeeNames.map((feeName) => (
                                                                                        <th key={feeName} className='p-2 text-center'>
                                                                                            <Button
                                                                                                onClick={() => handleSortfull('feeName')}>
                                                                                                {feeName}
                                                                                                {sortConfig?.key === 'feeName' && (
                                                                                                    <ArrowUpDown className='h-4 w-4' />
                                                                                                )}
                                                                                            </Button>
                                                                                        </th>
                                                                                    ))}

                                                                                    <th className='p-2 text-center'>
                                                                                        <Button onClick={() => handleSortfull('tobepaid')}>
                                                                                            Total Balance
                                                                                            {sortConfig?.key === 'tobepaid' && (
                                                                                                <ArrowUpDown className='h-4 w-4' />
                                                                                            )}
                                                                                        </Button>
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {balancereportData.length === 0 ? (
                                                                                    <tr>
                                                                                        <td
                                                                                            colSpan={11 + dynamicFeeNames.length}
                                                                                            className='p-4 text-center text-gray-500'>
                                                                                            {search.trim()
                                                                                                ? `No students found for "${search}"`
                                                                                                : 'No student data available'}
                                                                                        </td>
                                                                                    </tr>
                                                                                ) : (
                                                                                    balancereportData.map((row, index) => (
                                                                                        <tr
                                                                                            key={row.id}
                                                                                            className='border-b hover:bg-gray-50'>
                                                                                            <td className='p-2 text-center'>
                                                                                                <Checkbox
                                                                                                    checked={selectedIds.includes(row.id)}
                                                                                                    onCheckedChange={() =>
                                                                                                        toggleRow(row.id)
                                                                                                    }
                                                                                                />
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-medium'>
                                                                                                {index + 1}
                                                                                            </td>
                                                                                            <td className='p-2 text-center font-medium'>
                                                                                                {row.studentName}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>{row.admno}</td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.className}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.sectionName}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.fatherName}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>
                                                                                                {row.mobileNo}
                                                                                            </td>
                                                                                            <td className='p-2 text-center'>{row.email}</td>

                                                                                            {/* Dynamic fee cells */}
                                                                                            {dynamicFeeNames.map((feeName) => {
                                                                                                const feeKey = feeName
                                                                                                    .toLowerCase()
                                                                                                    .replace(/\s+/g, '_');
                                                                                                const feeAmount =
                                                                                                    row[feeKey] ||
                                                                                                    row.feeCategories?.[feeName] ||
                                                                                                    0;
                                                                                                return (
                                                                                                    <td
                                                                                                        key={feeName}
                                                                                                        className='p-2 text-center'>
                                                                                                        ₹{feeAmount.toLocaleString('en-IN')}
                                                                                                    </td>
                                                                                                );
                                                                                            })}

                                                                                            <td className='p-2 text-center font-bold'>
                                                                                                ₹{row.tobepaid.toLocaleString('en-IN')}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                )}

                                                                                {/* Footer row with totals */}
                                                                                <tr className='bg-gray-100 font-bold'>
                                                                                    <td colSpan={9} className='p-2 text-right'>
                                                                                        Balance:
                                                                                    </td>

                                                                                    {/* Dynamic fee totals */}
                                                                                    {dynamicFeeNames.map((feeName) => {
                                                                                        const feeKey = feeName
                                                                                            .toLowerCase()
                                                                                            .replace(/\s+/g, '_');
                                                                                        const totalFee = balancereportData.reduce(
                                                                                            (sum, row) => {
                                                                                                const feeAmount =
                                                                                                    row[feeKey] ||
                                                                                                    row.feeCategories?.[feeName] ||
                                                                                                    0;
                                                                                                return sum + feeAmount;
                                                                                            },
                                                                                            0
                                                                                        );
                                                                                        return (
                                                                                            <td
                                                                                                key={feeName}
                                                                                                className='p-2 text-center font-bold text-blue-700'>
                                                                                                ₹{totalFee.toLocaleString('en-IN')}
                                                                                            </td>
                                                                                        );
                                                                                    })}

                                                                                    <td className='p-2 text-center font-bold text-blue-700'>
                                                                                        ₹
                                                                                        {balancereportData
                                                                                            .reduce(
                                                                                                (sum, row) => sum + (row.tobepaid || 0),
                                                                                                0
                                                                                            )
                                                                                            .toLocaleString('en-IN')}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div>Total Records : {balancereportData.length}</div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </CollapsibleSection>
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Email Configuration Modal */}
                <Dialog open={showemailContent === true} onOpenChange={setshowEmailContent}>
                    <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto p-0'>
                        <DialogHeader className='items-center border-b p-6 text-center'>
                            <DialogTitle className='font-bold text-2xl'>SELECTED DEFAULTER LIST !!!</DialogTitle>
                            <p className='mt-1 font-medium text-sm'>NOTE : Email Will Trigger For The Same</p>
                        </DialogHeader>
                        <div className='overflow-hidden rounded-lg border'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b bg-gray-50'>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Sl No</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Name</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Admission No</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Class : Section</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Father Name</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Mobile Number</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Email-id</th>
                                        <th className='p-3 text-left font-semibold text-sm'>Balance Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentreportData
                                        .filter((student) => selectedIds.includes(student.amsT_Id))
                                        .map((student, index) => (
                                            <tr key={student.amsT_Id} className='border-b hover:bg-gray-50'>
                                                <td className='border-r p-3 text-sm'>{index + 1}</td>
                                                <td className='border-r p-3 text-sm'>{student.studentName}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_AdmNo}</td>
                                                <td className='border-r p-3 text-sm'>{student.classSection}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_FatherName}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_MobileNo}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_emailId}</td>
                                                <td className='p-3 font-semibold text-sm'>
                                                    ₹{student.totalBalance.toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='space-y-6 p-6'>
                            <div className='space-y-4'>
                                {/* Email Template Selection */}
                                <div className='flex items-center justify-center gap-3'>
                                    <Label className='whitespace-nowrap font-semibold'>Email Template:*</Label>
                                    <div className='max-w-md flex-1'>
                                        <Select value={emailTemplate} onValueChange={setEmailTemplate}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='-Select-' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='fee_reminder'>Fee Reminder Template</SelectItem>
                                                <SelectItem value='default_alert'>Default Alert Template</SelectItem>
                                                <SelectItem value='custom'>Custom Template</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Email Content Title */}
                                <div className='flex items-center justify-center gap-3'>
                                    <Label className='whitespace-nowrap font-semibold'>Email Content:</Label>
                                    <div className='max-w-md flex-1'>
                                        <div className='text-gray-600 text-sm'>Sub:</div>
                                        {/* You would add the email subject input/field here */}
                                        {/* Example: <Input placeholder="Enter email subject" /> */}
                                    </div>
                                </div>
                                {/* Template Preview */}
                                <div className='flex items-center gap-3'>
                                    <div className='flex-1'>
                                        <div className='rounded-lg border p-4'>
                                            <div className='mb-3 flex items-center gap-2'>
                                                <h3 className='font-medium text-lg'>Template Preview:</h3>
                                                <button
                                                    type='button'
                                                    className='ml-2 flex items-center gap-1 text-blue-600 hover:text-blue-800'>
                                                    <Eye className='h-4 w-4' />
                                                    <span>Preview</span>
                                                </button>
                                            </div>
                                            <div className='min-h-[100px] rounded border bg-gray-50 p-3'>
                                                <p className='text-gray-700'>Thank You</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className='flex justify-end gap-3 border-t pt-6'>
                                <Button variant='outline' onClick={() => setShowEmailModal(false)} className='border-gray-300'>
                                    Close
                                </Button>
                                <Button onClick={handleSendEmail} className='bg-gray-800 text-white hover:bg-gray-900'>
                                    Send Email
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                {/* Notification Configuration Modal */}
                <Dialog open={showNotificationModal === true} onOpenChange={setShowNotificationModal}>
                    <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto p-0'>
                        <DialogHeader className='items-center border-b p-6 text-center'>
                            <DialogTitle className='font-bold text-2xl'>SELECTED DEFAULTER LIST !!!</DialogTitle>
                            <p className='mt-1 font-medium text-sm'>NOTE : Notification Will Trigger For The Same</p>
                        </DialogHeader>
                        <div className='overflow-hidden rounded-lg border'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b bg-gray-50'>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Sl No</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Name</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Admission No</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Class : Section</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Father Name</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Mobile Number</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Email-id</th>
                                        <th className='p-3 text-left font-semibold text-sm'>Balance Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentreportData
                                        .filter((student) => selectedIds.includes(student.amsT_Id))
                                        .map((student, index) => (
                                            <tr key={student.amsT_Id} className='border-b hover:bg-gray-50'>
                                                <td className='border-r p-3 text-sm'>{index + 1}</td>
                                                <td className='border-r p-3 text-sm'>{student.studentName}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_AdmNo}</td>
                                                <td className='border-r p-3 text-sm'>{student.classSection}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_FatherName}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_MobileNo}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_emailId}</td>
                                                <td className='p-3 font-semibold text-sm'>
                                                    ₹{student.totalBalance.toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='space-y-6 p-6'>
                            <div className='space-y-4'>
                                {/* Email Template Selection */}
                                <div className='flex items-center justify-center gap-3'>
                                    <Label className='whitespace-nowrap font-semibold'>Template:*</Label>
                                    <div className='max-w-md flex-1'>
                                        <Select value={emailTemplate} onValueChange={setEmailTemplate}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='-Select-' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='fee_reminder'>Fee Reminder Template</SelectItem>
                                                <SelectItem value='default_alert'>Default Alert Template</SelectItem>
                                                <SelectItem value='custom'>Custom Template</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* <div className='flex items-center justify-center gap-3'>
                                    <Label className='whitespace-nowrap font-semibold'>Email Content:</Label>
                                    <div className='max-w-md flex-1'>
                                        <div className='text-gray-600 text-sm'>Sub:</div>
                                      
                                    </div>
                                </div>
                              
                                <div className='flex items-center gap-3'>
                                    <div className='flex-1'>
                                        <div className='rounded-lg border p-4'>
                                            <div className='mb-3 flex items-center gap-2'>
                                                <h3 className='font-medium text-lg'>Template Preview:</h3>
                                                <button
                                                    type="button"
                                                    className='ml-2 flex items-center gap-1 text-blue-600 hover:text-blue-800'
                                                >
                                                    <Eye className='h-4 w-4' />
                                                    <span>Preview</span>
                                                </button>
                                            </div>
                                            <div className='min-h-[100px] rounded border bg-gray-50 p-3'>
                                                <p className='text-gray-700'>Thank You</p>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            {/* Action Buttons */}
                            <div className='flex justify-end gap-3 border-t pt-6'>
                                <Button variant='outline' onClick={() => setShowEmailModal(false)} className='border-gray-300'>
                                    Close
                                </Button>
                                <Button onClick={handleSendEmail} className='bg-gray-800 text-white hover:bg-gray-900'>
                                    Send Notification
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* SMS Configuration Modal */}
                <Dialog open={showSMSModal === true} onOpenChange={setShowSMSModal}>
                    <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                        <DialogHeader className='items-center border-b p-6 text-center'>
                            <DialogTitle className='font-bold text-2xl'>SELECTED DEFAULTER LIST !!!</DialogTitle>
                            <p className='mt-1 font-medium text-sm'>NOTE : SMS Will Trigger For The Same</p>
                        </DialogHeader>
                        <div className='overflow-hidden rounded-lg border'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b bg-gray-50'>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Sl No</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Name</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Admission No</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Class : Section</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Father Name</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Mobile Number</th>
                                        <th className='border-r p-3 text-left font-semibold text-sm'>Email-id</th>
                                        <th className='p-3 text-left font-semibold text-sm'>Balance Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentreportData
                                        .filter((student) => selectedIds.includes(student.amsT_Id))
                                        .map((student, index) => (
                                            <tr key={student.amsT_Id} className='border-b hover:bg-gray-50'>
                                                <td className='border-r p-3 text-sm'>{index + 1}</td>
                                                <td className='border-r p-3 text-sm'>{student.studentName}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_AdmNo}</td>
                                                <td className='border-r p-3 text-sm'>{student.classSection}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_FatherName}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_MobileNo}</td>
                                                <td className='border-r p-3 text-sm'>{student.amsT_emailId}</td>
                                                <td className='p-3 font-semibold text-sm'>
                                                    ₹{student.totalBalance.toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='space-y-6 p-6'>
                            <div className='space-y-4'>
                                {/* Email Template Selection */}
                                <div className='flex items-center justify-center gap-3'>
                                    <Label className='whitespace-nowrap font-semibold'>Email Template:*</Label>
                                    <div className='max-w-md flex-1'>
                                        <Select value={emailTemplate} onValueChange={setEmailTemplate}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='-Select-' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='fee_reminder'>Fee Reminder Template</SelectItem>
                                                <SelectItem value='default_alert'>Default Alert Template</SelectItem>
                                                <SelectItem value='custom'>Custom Template</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Email Content Title */}
                                <div className='flex items-center justify-center gap-3'>
                                    <Label className='whitespace-nowrap font-semibold'>SMS Content:</Label>
                                    <div className='max-w-md flex-1'>
                                        <div className='text-gray-600 text-sm'>Sub:</div>
                                        {/* You would add the email subject input/field here */}
                                        {/* Example: <Input placeholder="Enter email subject" /> */}
                                    </div>
                                </div>
                                {/* Template Preview */}
                                {/* <div className='flex items-center gap-3'>
                                    <div className='flex-1'>
                                        <div className='rounded-lg border p-4'>
                                            <div className='mb-3 flex items-center gap-2'>
                                                <h3 className='font-medium text-lg'>Template Preview:</h3>
                                                <button
                                                    type="button"
                                                    className='ml-2 flex items-center gap-1 text-blue-600 hover:text-blue-800'
                                                >
                                                    <Eye className='h-4 w-4' />
                                                    <span>Preview</span>
                                                </button>
                                            </div>
                                            <div className='min-h-[100px] rounded border bg-gray-50 p-3'>
                                                <p className='text-gray-700'>Thank You</p>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            {/* Action Buttons */}
                            <div className='flex justify-end gap-3 border-t pt-6'>
                                <Button variant='outline' onClick={() => setShowEmailModal(false)} className='border-gray-300'>
                                    Close
                                </Button>
                                <Button onClick={handleSendEmail} className='bg-gray-800 text-white hover:bg-gray-900'>
                                    Send SMS
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </form>
        </div>
    );
}
