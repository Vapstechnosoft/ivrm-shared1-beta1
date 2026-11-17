// app/(root)/fees/feereports/feedefaulterreport/page.tsx
'use client';

import {
    useFeeClassListDefaulterreport,
    useFeeCustomGroupDefaulterreport,
    useFeeDefaulterReport,
    useFeeGroupDefaulterreport,
    useFeeSectionListDefaulterreport,
    useFeeTermDefaulterreport
} from '@/hooks/fees/useReports';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { FormError } from '@/components/ui/extension/field';
import { feeAccountsPositionReport } from '@/schemas/fees/reports';
import { getFeeAccountsPositionReport, onChangeofCustomFeeGroup } from '@/server/fees/reports/fee_accounts_position_report';
import type { IFeeCustomGroupDropdownList, IFeeGroupDropdownList, IFeeTermDropdownList } from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from 'react-aria-components';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import {
    type IFeeAccountsPositionReport,
    exportToExcelforAll,
    exportToExcelforHeadWise,
    exportToExcelforIndividual,
    exportToExcelforRoute,
    printTable
} from './_components/export_and_excel';

type FormFields = z.infer<typeof feeAccountsPositionReport>;

const Checkbox = ({ checked, indeterminate, onCheckedChange, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);
    return <BaseCheckbox ref={ref} checked={checked} onCheckedChange={onCheckedChange} {...props} />;
};

export default function FeeAccountsPositionReport() {
    const filterOptions = [
        { value: 'individual', label: 'Individual Class' },
        { value: 'headwise', label: 'Headwise' },
        { value: 'All', label: 'All Class' },
        { value: 'route', label: 'Route-Headwise' }
    ] as const;

    const {
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeAccountsPositionReport),
        defaultValues: {
            filter: 'individual',
            academicYearId: undefined,
            includeClassSection: false,
            classId: undefined,
            sectionId: undefined,
            customGroupIds: [],
            feeGroupIds: [],
            termIds: []
        }
    });

    const [filters, setFilters] = useState({
        userType: 'Students' as 'Students' | 'Staff' | 'Others',
        viewMode: 'Yearly Wise' as 'Yearly Wise' | 'Date Wise',
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
        dueDateType: 'Due Date' as 'Due Date' | 'Till Due Date',
        bulkDownload: false
    });

    const [financialYearWise, setFinancialYearWise] = useState(false);
    const [feeGroups, setFeeGroups] = useState<IFeeGroupDropdownList[]>([]);
    const [feeTerms, setFeeTerms] = useState<IFeeTermDropdownList[]>([]);
    const [customGroups, setCustomGroups] = useState<IFeeCustomGroupDropdownList[]>([]);
    const [reportData, setReportData] = useState<IFeeAccountsPositionReport[]>([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [filterType, setFilterType] = useState('individual');
    const [selectedclassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
    const [specialFlag, setSepecialFlag] = useState(false);
    const [leftFlag, setLeftFlag] = useState(false);
    const [customOnChangeFeeGroups, setCustomOnChangeFeeGroups] = useState<any[]>([]);
    const [loadingCustomOnChangeFeeGroups, setLoadingCustomOnChangeFeeGroups] = useState(false);
    const selectedFilterValue = filterOptions.find((opt) => opt.value === filterType)?.value || '';

    const watchCustomGroupIds = useWatch({
        control,
        name: 'customGroupIds'
    });

    useEffect(() => {
        const fetchFeeGroupsForCustomGroups = async (selectedIds: number[]) => {
            if (selectedIds.length === 0) {
                setCustomOnChangeFeeGroups([]);
                return;
            }
            try {
                setLoadingCustomOnChangeFeeGroups(true);
                const response = await onChangeofCustomFeeGroup(selectedIds.map((id) => id));
                // const response=await onChangeofCustomFeeGroup([1])
                setCustomOnChangeFeeGroups(response.data || []);
                if (response?.data?.length === 0) {
                    toast.info('No Fee Groups Found for the Selected Custom Groups!!');
                    return;
                }
            } catch (error) {
                console.error('Error fetching fee groups:', error);
                toast.error('Failed to fetch fee groups for selected custom groups');
                setCustomOnChangeFeeGroups([]);
            } finally {
                setLoadingCustomOnChangeFeeGroups(false);
            }
        };
        if (watchCustomGroupIds && watchCustomGroupIds.length > 0) {
            fetchFeeGroupsForCustomGroups(watchCustomGroupIds);
        } else {
            setCustomOnChangeFeeGroups([]);
        }
    }, [watchCustomGroupIds]);

    useEffect(() => {
        setReportData([]);
    }, [filterType, selectedclassId, selectedSectionId]);
    // Hooks
    const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();
    const { data: classListResponse, isLoading: loadingClasses } = useFeeClassListDefaulterreport();
    const { data: sectionListResponse, isLoading: loadingSections } = useFeeSectionListDefaulterreport();
    const { data: feegroupData, isLoading: loadingfeegroup, error: feegroupError } = useFeeGroupDefaulterreport();
    const { data: feetermData, isLoading: loadingfeeterm, error: feetermError } = useFeeTermDefaulterreport();

    const { data: customGroupResponse, isLoading: loadingCustomGroup, error: customGroupError } = useFeeCustomGroupDefaulterreport();

    useEffect(() => {
        if (feegroupError) toast.error(feegroupError?.message || 'Failed to load fee groups');
        else if (feegroupData?.data) setFeeGroups(feegroupData.data);
    }, [feegroupData, feegroupError]);

    useEffect(() => {
        if (feetermError) toast.error(feetermError?.message || 'Failed to load terms');
        else if (feetermData?.data) setFeeTerms(feetermData.data);
    }, [feetermData, feetermError]);

    useEffect(() => {
        if (customGroupError) toast.error(customGroupError?.message || 'Failed to load custom groups');
        else if (customGroupResponse?.data) setCustomGroups(customGroupResponse.data);
    }, [customGroupResponse, customGroupError]);

    const filteredData = useMemo(() => {
        const rows = [...reportData];
        return rows;
    }, [reportData]);

    const toggleRow = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const toggleAll = () => {
        if (selectedIds.length === filteredData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredData.map((r) => r.id));
        }
    };

    const totalBalance = filteredData.reduce((sum, r) => sum + r.balance, 0);
    const ChargesasperAcademicyear = filteredData.reduce((sum, r) => sum + (r.ChargesasperAcademicyear || 0), 0);
    const ConcessionasperAcademicyear = filteredData.reduce((sum, r) => sum + (r.ConcessionasperAcademicyear || 0), 0);
    const RebateScholarshipasperAcademicyear = filteredData.reduce((sum, r) => sum + (r.RebateScholarshipasperAcademicyear || 0), 0);
    const waivedOffasperAcademicyear = filteredData.reduce((sum, r) => sum + (r.waivedOffasperAcademicyear || 0), 0);
    const collectionasperAcademicyear = filteredData.reduce((sum, r) => sum + (r.collectionasperAcademicyear || 0), 0);
    const fine = filteredData.reduce((sum, r) => sum + (r.fine || 0), 0);
    const lastyearDue = filteredData.reduce((sum, r) => sum + (r.lastyearDue || 0), 0);

    const handleExportExcel = () => {
        const rowsToExport = reportData.filter((r) => selectedIds.includes(r.id));
        if (!rowsToExport || rowsToExport.length === 0) {
            toast.error('No data selected to export');
            return;
        }
        selectedFilterValue === 'individual'
            ? exportToExcelforIndividual(rowsToExport, 'AccountPosition_Report')
            : selectedFilterValue === 'headwise'
              ? exportToExcelforHeadWise(rowsToExport, 'AccountPosition_Report')
              : selectedFilterValue === 'All'
                ? exportToExcelforAll(rowsToExport, 'AccountPosition_Report')
                : exportToExcelforRoute(rowsToExport, 'AccountPosition_Report');
    };

    const handlePrint = () => {
        const rowsToPrint = reportData.filter((r) => selectedIds.includes(r.id));

        if (!rowsToPrint || rowsToPrint.length === 0) {
            toast.error('No data selected to print');
            return;
        }

        const columns = [
            'Sl No',
            `${
                selectedFilterValue === 'individual'
                    ? 'Student Name'
                    : selectedFilterValue === 'headwise'
                      ? 'Fee Head'
                      : selectedFilterValue === 'All'
                        ? 'Class Name'
                        : 'Route Name'
            }`,
            `${selectedFilterValue === 'individual' ? 'Adm.No' : ''}`,
            'Charges as per Academic year',
            'Concession as per Academic year',
            'Rebate/Scholarship as per Academic year',
            'Fine',
            'Waive Off as per Academic year',
            'Collection as per Academic year',
            'Balance',
            'Last Year Due'
        ].filter((col) => col !== '');

        const printableRows = rowsToPrint.map((row, index) => ({
            'Sl No': index + 1,
            'Student Name': selectedFilterValue === 'individual' ? `${row.studentName}` : '',
            'Fee Head': selectedFilterValue === 'headwise' ? `${row.feeHead}` : '',
            'Class Name': selectedFilterValue === 'All' ? `${row.className}` : '',
            'Route Name': selectedFilterValue === 'route' ? `${row.RouteName}` : '',
            'Adm.No': selectedFilterValue === 'individual' ? row.admNumber : '',
            'Charges as per Academic year': `${row.ChargesasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
            'Concession as per Academic year': `${row.ConcessionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
            'Rebate/Scholarship as per Academic year': `${row.RebateScholarshipasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
            Fine: `${row.fine?.toLocaleString('en-IN') || '0'}`,
            'Waive Off as per Academic year': `${row.waivedOffasperAcademicyear?.toLocaleString('en-IN') || '0'}`,

            'Collection as per Academic year': `${row.collectionasperAcademicyear?.toLocaleString('en-IN') || '0'}`,
            Balance: `${row.balance?.toLocaleString('en-IN') || '0'}`,
            'Last Year Due': `${row.lastyearDue?.toLocaleString('en-IN') || '0'}`
        }));

        const totalBalance = rowsToPrint.reduce((sum, r) => sum + (r.balance || 0), 0);
        const ChargesasperAcademicyear = rowsToPrint.reduce((sum, r) => sum + (r.ChargesasperAcademicyear || 0), 0);
        const ConcessionasperAcademicyear = rowsToPrint.reduce((sum, r) => sum + (r.ConcessionasperAcademicyear || 0), 0);
        const RebateScholarshipasperAcademicyear = rowsToPrint.reduce((sum, r) => sum + (r.RebateScholarshipasperAcademicyear || 0), 0);
        const waivedOffasperAcademicyear = rowsToPrint.reduce((sum, r) => sum + (r.waivedOffasperAcademicyear || 0), 0);
        const collectionasperAcademicyear = rowsToPrint.reduce((sum, r) => sum + (r.collectionasperAcademicyear || 0), 0);
        const fine = rowsToPrint.reduce((sum, r) => sum + (r.fine || 0), 0);
        const lastyearDue = rowsToPrint.reduce((sum, r) => sum + (r.lastyearDue || 0), 0);

        const sumRow = {
            'Sl No': 'Total',
            'Student Name': '',
            'Adm.No': '',
            'Charges as per Academic year': `₹${ChargesasperAcademicyear.toLocaleString('en-IN')}`,
            'Concession as per Academic year': `₹${ConcessionasperAcademicyear.toLocaleString('en-IN')}`,
            'Rebate/Scholarship as per Academic year': `₹${RebateScholarshipasperAcademicyear.toLocaleString('en-IN')}`,
            'Waive Off as per Academic year': `₹${waivedOffasperAcademicyear.toLocaleString('en-IN')}`,
            Fine: `₹${fine.toLocaleString('en-IN')}`,
            'Collection as per Academic year': `₹${collectionasperAcademicyear.toLocaleString('en-IN')}`,
            Balance: `₹${totalBalance.toLocaleString('en-IN')}`,
            'Last Year Due': `₹${lastyearDue.toLocaleString('en-IN')}`
        };

        printTable(columns, printableRows, sumRow);
    };

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const fetchReportData = async () => {
        setReportLoading(true);
        try {
            const reportArray = await getFeeAccountsPositionReport(127, 1);
            setReportData(reportArray.data || []);
        } catch (e) {
            console.error('Failed to load the Fee Accounts Position Report!!', e);
            setReportData([]);
        } finally {
            setReportLoading(false);
        }
    };

    const onSubmit: SubmitHandler<FormFields> = async () => {
        if (selectedFilterValue === 'individual') {
            if (selectedclassId === null) {
                toast.error('Please select a Class');
                return;
            }
            if (selectedSectionId === null) {
                toast.error('Please select a Section');
                return;
            }
        }
        setReportLoading(true);
        setShowReport(false);
        // await new Promise((resolve) => setTimeout(resolve, 1200));
        // const mockData: IFeeAccountsPositionReport[] = [
        //     {
        //         id: 10020,
        //         studentName: 'Rahul Sharma',
        //         admNumber: 2024001,
        //         feeHead: 'Tuition Fee',
        //         className: '10th Grade',
        //         RouteName: 'Route A - Downtown',
        //         ChargesasperAcademicyear: 50000,
        //         ConcessionasperAcademicyear: 5000,
        //         RebateScholarshipasperAcademicyear: 3000,
        //         waivedOffasperAcademicyear: 2000,
        //         collectionasperAcademicyear: 35000,
        //         fine: 500,
        //         balance: 12500,
        //         lastyearDue: 2500
        //     },
        //     {
        //         id: 10021,
        //         studentName: 'Priya Patel',
        //         admNumber: 2024002,
        //         feeHead: 'Transport + Tuition',
        //         className: '9th Grade',
        //         RouteName: 'Route B - Suburbs',
        //         ChargesasperAcademicyear: 75000,
        //         ConcessionasperAcademicyear: 8000,
        //         RebateScholarshipasperAcademicyear: 4000,
        //         waivedOffasperAcademicyear: 3000,
        //         collectionasperAcademicyear: 50000,
        //         fine: 1000,
        //         balance: 28500,
        //         lastyearDue: 0
        //     },
        //     {
        //         id: 10022,
        //         studentName: 'Amit Kumar',
        //         admNumber: 2024003,
        //         feeHead: 'Annual Charges',
        //         className: '11th Grade',
        //         RouteName: 'Route C - North Zone',
        //         ChargesasperAcademicyear: 20000,
        //         ConcessionasperAcademicyear: 2000,
        //         RebateScholarshipasperAcademicyear: 1000,
        //         waivedOffasperAcademicyear: 1000,
        //         collectionasperAcademicyear: 10000,
        //         fine: 200,
        //         balance: 8000,
        //         lastyearDue: 1500
        //     },
        //     {
        //         id: 10023,
        //         studentName: 'Sneha Reddy',
        //         admNumber: 2024004,
        //         feeHead: 'Tuition Fee',
        //         className: '12th Grade',
        //         RouteName: 'Route D - South Zone',
        //         ChargesasperAcademicyear: 60000,
        //         ConcessionasperAcademicyear: 6000,
        //         RebateScholarshipasperAcademicyear: 4000,
        //         waivedOffasperAcademicyear: 2000,
        //         collectionasperAcademicyear: 45000,
        //         fine: 0,
        //         balance: 15000,
        //         lastyearDue: 0
        //     },
        //     {
        //         id: 10024,
        //         studentName: 'Rohan Verma',
        //         admNumber: 2024005,
        //         feeHead: 'Lab + Tuition',
        //         className: '10th Grade',
        //         RouteName: 'Route A - Downtown',
        //         ChargesasperAcademicyear: 85000,
        //         ConcessionasperAcademicyear: 7000,
        //         RebateScholarshipasperAcademicyear: 5000,
        //         waivedOffasperAcademicyear: 4000,
        //         collectionasperAcademicyear: 65000,
        //         fine: 1500,
        //         balance: 42000,
        //         lastyearDue: 3000
        //     },
        //     {
        //         id: 100238638,
        //         studentName: 'Rahul Sharma',
        //         admNumber: 2024001,
        //         feeHead: 'Tuition Fee',
        //         className: '10th Grade',
        //         RouteName: 'Route A - Downtown',
        //         ChargesasperAcademicyear: 50000,
        //         ConcessionasperAcademicyear: 5000,
        //         RebateScholarshipasperAcademicyear: 3000,
        //         waivedOffasperAcademicyear: 2000,
        //         collectionasperAcademicyear: 35000,
        //         fine: 500,
        //         balance: 12500,
        //         lastyearDue: 2500
        //     },
        //     {
        //         id: 58676,
        //         studentName: 'Ananya Reddy',
        //         admNumber: 2024002,
        //         feeHead: 'Tuition Fee',
        //         className: '9th Grade',
        //         RouteName: 'Route B - North Zone',
        //         ChargesasperAcademicyear: 48000,
        //         ConcessionasperAcademicyear: 4000,
        //         RebateScholarshipasperAcademicyear: 2000,
        //         waivedOffasperAcademicyear: 1000,
        //         collectionasperAcademicyear: 36000,
        //         fine: 0,
        //         balance: 5000,
        //         lastyearDue: 0
        //     },
        //     {
        //         id: 1002687767672,
        //         studentName: 'Arjun Patel',
        //         admNumber: 2024003,
        //         feeHead: 'Transport Fee',
        //         className: '8th Grade',
        //         RouteName: 'Route C - East End',
        //         ChargesasperAcademicyear: 15000,
        //         ConcessionasperAcademicyear: 1000,
        //         RebateScholarshipasperAcademicyear: 0,
        //         waivedOffasperAcademicyear: 500,
        //         collectionasperAcademicyear: 12000,
        //         fine: 200,
        //         balance: 1300,
        //         lastyearDue: 500
        //     },
        //     {
        //         id: 7678676,
        //         studentName: 'Sneha Iyer',
        //         admNumber: 2024004,
        //         feeHead: 'Tuition Fee',
        //         className: '7th Grade',
        //         RouteName: 'Route A - Downtown',
        //         ChargesasperAcademicyear: 42000,
        //         ConcessionasperAcademicyear: 6000,
        //         RebateScholarshipasperAcademicyear: 3000,
        //         waivedOffasperAcademicyear: 0,
        //         collectionasperAcademicyear: 30000,
        //         fine: 0,
        //         balance: 3000,
        //         lastyearDue: 0
        //     },
        //     {
        //         id: 76787,
        //         studentName: 'Karthik N',
        //         admNumber: 2024005,
        //         feeHead: 'Tuition Fee',
        //         className: '6th Grade',
        //         RouteName: 'Route D - South City',
        //         ChargesasperAcademicyear: 38000,
        //         ConcessionasperAcademicyear: 2000,
        //         RebateScholarshipasperAcademicyear: 1000,
        //         waivedOffasperAcademicyear: 500,
        //         collectionasperAcademicyear: 33000,
        //         fine: 100,
        //         balance: 1400,
        //         lastyearDue: 0
        //     },
        //     {
        //         id: 676987689767,
        //         studentName: 'Priya Verma',
        //         admNumber: 2024006,
        //         feeHead: 'Hostel Fee',
        //         className: '11th Grade',
        //         RouteName: 'N/A',
        //         ChargesasperAcademicyear: 60000,
        //         ConcessionasperAcademicyear: 8000,
        //         RebateScholarshipasperAcademicyear: 5000,
        //         waivedOffasperAcademicyear: 2000,
        //         collectionasperAcademicyear: 42000,
        //         fine: 0,
        //         balance: 3000,
        //         lastyearDue: 1000
        //     },
        //     {
        //         id: 89688,
        //         studentName: 'Mohammed Faisal',
        //         admNumber: 2024007,
        //         feeHead: 'Transport Fee',
        //         className: '10th Grade',
        //         RouteName: 'Route E - West Park',
        //         ChargesasperAcademicyear: 18000,
        //         ConcessionasperAcademicyear: 0,
        //         RebateScholarshipasperAcademicyear: 0,
        //         waivedOffasperAcademicyear: 0,
        //         collectionasperAcademicyear: 15000,
        //         fine: 300,
        //         balance: 3000,
        //         lastyearDue: 0
        //     },
        //     {
        //         id: 10027,
        //         studentName: 'Pooja Kulkarni',
        //         admNumber: 2024008,
        //         feeHead: 'Tuition Fee',
        //         className: '12th Grade',
        //         RouteName: 'Route B - North Zone',
        //         ChargesasperAcademicyear: 55000,
        //         ConcessionasperAcademicyear: 5000,
        //         RebateScholarshipasperAcademicyear: 4000,
        //         waivedOffasperAcademicyear: 1000,
        //         collectionasperAcademicyear: 42000,
        //         fine: 0,
        //         balance: 3000,
        //         lastyearDue: 2000
        //     },
        //     {
        //         id: 10028,
        //         studentName: 'Rohit Singh',
        //         admNumber: 2024009,
        //         feeHead: 'Tuition Fee',
        //         className: '5th Grade',
        //         RouteName: 'Route C - East End',
        //         ChargesasperAcademicyear: 30000,
        //         ConcessionasperAcademicyear: 3000,
        //         RebateScholarshipasperAcademicyear: 1000,
        //         waivedOffasperAcademicyear: 0,
        //         collectionasperAcademicyear: 25000,
        //         fine: 100,
        //         balance: 900,
        //         lastyearDue: 0
        //     },
        //     {
        //         id: 10029,
        //         studentName: 'Neha Gupta',
        //         admNumber: 2024010,
        //         feeHead: 'Tuition Fee',
        //         className: '4th Grade',
        //         RouteName: 'Route D - South City',
        //         ChargesasperAcademicyear: 28000,
        //         ConcessionasperAcademicyear: 2000,
        //         RebateScholarshipasperAcademicyear: 500,
        //         waivedOffasperAcademicyear: 500,
        //         collectionasperAcademicyear: 24000,
        //         fine: 0,
        //         balance: 1000,
        //         lastyearDue: 0
        //     }
        // ];

        //setReportData([mockData]);
        // setShowReport(true);
        // setReportLoading(false);

        // toast.success('Report generated successfully!');
        setShowReport(false);
        toast.info('No Data Found');
    };

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            <h1 className='mb-8 font-bold text-3xl text-gray-900'>Fee Accounts Position Report</h1>

                            <div className='space-y-8'>
                                <Card className='border bg-gray-50 p-5 shadow-sm'>
                                    <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6'>
                                        <Controller
                                            name='filter'
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    {filterOptions.map((option) => (
                                                        <Label key={option.value} className='flex cursor-pointer items-center gap-3'>
                                                            <Input
                                                                type='radio'
                                                                name={field.name}
                                                                value={option.value}
                                                                checked={field.value === option.value}
                                                                onChange={() => {
                                                                    field.onChange(option.value);
                                                                    setFilterType(option.value);
                                                                }}
                                                                className='h-5 w-5 text-primary'
                                                            />
                                                            <span>{option.label}</span>
                                                        </Label>
                                                    ))}
                                                </>
                                            )}
                                        />
                                        <div className='flex items-center gap-2'>
                                            <input
                                                type='checkbox'
                                                id='financialyearopt'
                                                checked={financialYearWise}
                                                onChange={(e) => setFinancialYearWise(e.target.checked)}
                                                className='h-4 w-4 rounded border-gray-300 text-blue-600 text-primary focus:ring-blue-500'
                                            />
                                            <span>Financial Year Wise</span>
                                        </div>
                                    </div>
                                </Card>

                                <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
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
                                                        {loadingYears ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : (
                                                            academicYearData?.data?.map((item: any) => (
                                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                    {item.asmaY_Year}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.academicYearId && (
                                            <FormError className='mt-1'>{errors.academicYearId.message}</FormError>
                                        )}{' '}
                                    </div>

                                    {filterType === 'individual' && (
                                        <div className='space-y-3'>
                                            <Label htmlFor='asmcl_Id' className='font-semibold text-lg'>
                                                Class <span className='text-red-500'>*</span>
                                            </Label>
                                            <Controller
                                                name='asmcl_Id'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value?.toString()}
                                                        onValueChange={(val) => {
                                                            const id = Number(val);
                                                            field.onChange(id);
                                                            setSelectedClassId(id);
                                                        }}>
                                                        <SelectTrigger className='w-full text-center'>
                                                            <SelectValue placeholder='--Select Class--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {loadingClasses ? (
                                                                <SelectItem value='loading' disabled>
                                                                    Loading...
                                                                </SelectItem>
                                                            ) : (
                                                                classListResponse?.data?.map((item) => (
                                                                    <SelectItem key={item.asmcL_Id} value={String(item.asmcL_Id)}>
                                                                        {item.asmcL_ClassName}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {errors.asmcl_Id && (
                                        <div className='flex w-full items-center justify-between gap-4'>
                                            <Label />
                                            <FormError>{errors.asmcl_Id.message}</FormError>
                                        </div>
                                    )}

                                    {/* Section */}
                                    {filterType === 'individual' && (
                                        <div className='space-y-3'>
                                            <Label htmlFor='asms_Id' className='font-semibold text-lg'>
                                                Section <span className='text-red-500'>*</span>
                                            </Label>
                                            <Controller
                                                name='asms_Id'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value?.toString()}
                                                        onValueChange={(val) => {
                                                            const id = Number(val);
                                                            field.onChange(id);
                                                            setSelectedSectionId(id);
                                                        }}>
                                                        <SelectTrigger className='w-full text-center'>
                                                            <SelectValue placeholder='--Select Section--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {loadingSections ? (
                                                                <SelectItem value='loading' disabled>
                                                                    Loading...
                                                                </SelectItem>
                                                            ) : (
                                                                sectionListResponse?.data?.map((item) => (
                                                                    <SelectItem key={item.asmS_Id} value={String(item.asmS_Id)}>
                                                                        {item.asmC_SectionName}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {errors.asms_Id && (
                                        <div className='flex w-full items-center justify-between gap-4'>
                                            <Label />
                                            <FormError>{errors.asms_Id.message}</FormError>
                                        </div>
                                    )}
                                </div>

                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                                    {/* Custom Group */}
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
                                    {customOnChangeFeeGroups.length > 0 ? (
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
                                                        const allIds = customOnChangeFeeGroups.map((g) => g.fmG_Id);

                                                        const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;

                                                        const isIndeterminate =
                                                            selectedIds.length > 0 && selectedIds.length < allIds.length;

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
                                                                {loadingCustomOnChangeFeeGroups ? (
                                                                    <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                                ) : customOnChangeFeeGroups.length > 0 ? (
                                                                    customOnChangeFeeGroups.map((group) => {
                                                                        const checked = selectedIds.includes(group.fmG_Id);

                                                                        return (
                                                                            <Label
                                                                                key={group.fmG_Id}
                                                                                className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                                <Checkbox
                                                                                    checked={checked}
                                                                                    onCheckedChange={(
                                                                                        checked: boolean | 'indeterminate'
                                                                                    ) => {
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
                                    ) : (
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

                                                        const isIndeterminate =
                                                            selectedIds.length > 0 && selectedIds.length < allIds.length;

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
                                                                                    onCheckedChange={(
                                                                                        checked: boolean | 'indeterminate'
                                                                                    ) => {
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
                                    )}
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
                                </div>
                                <div className='space-y-6 border-t pt-8'>
                                    <div className='flex flex-wrap items-center justify-between gap-6'>
                                        <div className='flex flex-wrap items-center gap-8'>
                                            <div className='flex items-center gap-3'>
                                                <Checkbox
                                                    checked={specialFlag}
                                                    onCheckedChange={(v: boolean) => setSepecialFlag(v === true)}
                                                />
                                                <Label className='cursor-pointer'>Special Fees</Label>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <Checkbox checked={leftFlag} onCheckedChange={(v: boolean) => setLeftFlag(v === true)} />
                                                <Label className='cursor-pointer'>Left</Label>
                                            </div>
                                            {filterType === 'individual' && (
                                                <div className='flex items-center gap-4'>
                                                    <Label className='min-w-15 pl-10 font-medium'>
                                                        Date <span className='text-red-500'>*</span>
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant='outline'
                                                                className='w-[240px] justify-start text-left font-normal'>
                                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                                {format(filters.dueDate, 'dd-MM-yyyy')}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='w-auto p-0' align='start'>
                                                            <Calendar
                                                                mode='single'
                                                                selected={filters.dueDate}
                                                                onSelect={(date) =>
                                                                    date &&
                                                                    setFilters((prev) => ({
                                                                        ...prev,
                                                                        dueDate: date
                                                                    }))
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className='flex justify-end gap-4 border-t pt-8'>
                                        <Button size='lg' variant='outline' className='px-8' onClick={() => window.location.reload()}>
                                            Cancel
                                        </Button>
                                        <Button type='submit' disabled={isSubmitting} className='min-w-32'>
                                            {isSubmitting ? 'Generating...' : 'Report'}
                                        </Button>
                                    </div>
                                    {showReport && reportData.length > 0 && (
                                        <div className='-mx-8 mt-12 overflow-hidden rounded-lg bg-white shadow-xl'>
                                            {/* Loading State */}
                                            {reportLoading ? (
                                                <div className='p-24 text-center'>
                                                    <div className='inline-block h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                                                    <p className='mt-6 text-lg text-muted-foreground'>Generating report, please wait...</p>
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
                                                            <h2 className='font-bold text-2xl text-primary'>
                                                                Fee Accounts Position Report
                                                            </h2>
                                                        </div>
                                                        <div className='flex gap-3'>
                                                            <div className='mb-4 flex justify-end gap-2'>
                                                                <Button
                                                                    size='sm'
                                                                    className='h-8 w-auto px-3 text-xs'
                                                                    onClick={handleExportExcel}>
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
                                                    <div>
                                                        {/* Table */}
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
                                                                        <th className='border px-2 py-2'>Sl No</th>
                                                                        <th className='border px-2 py-2'>
                                                                            {selectedFilterValue === 'individual'
                                                                                ? 'Student Name'
                                                                                : selectedFilterValue === 'headwise'
                                                                                  ? 'Fee Head'
                                                                                  : selectedFilterValue === 'All'
                                                                                    ? 'Class Name'
                                                                                    : 'Route Name'}
                                                                        </th>
                                                                        {selectedFilterValue === 'individual' && (
                                                                            <th className='border px-2 py-2'>Adm.No</th>
                                                                        )}
                                                                        <th className='border px-2 py-2'>Charges as per Academic year</th>
                                                                        <th className='border px-2 py-2'>
                                                                            Concession as per Academic year
                                                                        </th>
                                                                        <th className='border px-2 py-2'>
                                                                            Rebate/Scholarship as per Academic year
                                                                        </th>
                                                                        <th className='border px-2 py-2'>Waive Off as per Academic year</th>
                                                                        <th className='border px-2 py-2'>Fine</th>
                                                                        <th className='border px-2 py-2'>
                                                                            Collection as per Academic year
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-right'>Balance</th>
                                                                        <th className='border px-2 py-2 text-right'>Last Year Due</th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {filteredData.map((row, index) => (
                                                                        <tr key={row.id} className='border-b'>
                                                                            <td className='p-2 text-center'>
                                                                                <Checkbox
                                                                                    checked={selectedIds.includes(row.id)}
                                                                                    onCheckedChange={() => toggleRow(row.id)}
                                                                                />
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                                            <td className='border px-2 py-2 font-semibold'>
                                                                                {selectedFilterValue === 'individual'
                                                                                    ? `${row.studentName}`
                                                                                    : selectedFilterValue === 'headwise'
                                                                                      ? `${row.feeHead}`
                                                                                      : selectedFilterValue === 'All'
                                                                                        ? `${row.className}`
                                                                                        : `${row.RouteName}`}
                                                                            </td>
                                                                            {selectedFilterValue === 'individual' && (
                                                                                <th className='p-2 text-center font-bold'>
                                                                                    {row.admNumber}
                                                                                </th>
                                                                            )}
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.ChargesasperAcademicyear}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.ConcessionasperAcademicyear}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.RebateScholarshipasperAcademicyear}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.waivedOffasperAcademicyear}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>{row.fine}</td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.collectionasperAcademicyear}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>{row.balance}</td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.lastyearDue}
                                                                            </td>
                                                                        </tr>
                                                                    ))}

                                                                    {/* Total */}
                                                                    <tr className='border-b'>
                                                                        <td className='border px-2 py-2 text-center'>Total</td>
                                                                        <td className='border px-2 py-2 text-center'> </td>
                                                                        <td className='border px-2 py-2 text-center'> </td>
                                                                        {selectedFilterValue === 'individual' && <td> </td>}
                                                                        <td className='border px-2 py-2 text-center'>
                                                                            ₹{ChargesasperAcademicyear.toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-center'>
                                                                            ₹{ConcessionasperAcademicyear.toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-center'>
                                                                            ₹{RebateScholarshipasperAcademicyear.toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-center'>
                                                                            ₹{waivedOffasperAcademicyear.toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-center'>
                                                                            ₹{fine.toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-center'>
                                                                            ₹{collectionasperAcademicyear.toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-center'>
                                                                            ₹{totalBalance.toLocaleString('en-IN')}
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-center'>
                                                                            ₹{lastyearDue.toLocaleString('en-IN')}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
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
            </form>
        </div>
    );
}
