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
import { feesGroupwiseStudentReportSchema } from '@/schemas/fees/reports';
import { getFeesSectionListByClassId } from '@/server/fees/reports/fee_DefaulterReport';
import type {
    IFeeClassDropdownList,
    IFeeSectionDropdownList,
    IInstallmentReportFeeTermDropdownList,
    InstallmentReportGroupDropdownList
} from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import type { z } from 'zod';
import { printTable } from './excelandprint';

type FormFields = z.infer<typeof feesGroupwiseStudentReportSchema>;

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

// Static student data for Termwise report
const staticStudents = [
    {
        id: 1,
        admNo: 'ADM-2024-1A-001',
        name: 'SANKALAN CHOWDHURY',
        class: '1',
        section: 'A',
        feeData: {
            tuition: [2525, 2525, 1894, 1894, 1894, 1894, 1894, 1894, 1894, 5882],
            development: [200, 200, 200, 200, 200, 200, 200, 200, 200, 600],
            maintenance: [200, 200, 200, 200, 200, 200, 200, 200, 200, 600],
            games: [50, 50, 50, 50, 50, 50, 50, 50, 50, 150],
            session: [700, 700, 700, 700, 700, 700, 700, 700, 700, 2100],
            library: [50, 50, 50, 50, 50, 50, 50, 50, 50, 150],
            computer: [125, 125, 125, 125, 125, 125, 125, 125, 125, 375],
            fine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            paidDates: [
                '22/04/2025',
                '15/05/2025',
                '14/06/2025',
                '07/07/2025',
                '02/08/2025',
                '01/09/2025',
                '08/10/2025',
                '06/11/2025',
                '03/12/2025',
                '05/01/2026'
            ]
        }
    },
    {
        id: 2,
        admNo: 'ADM-2024-1A-002',
        name: 'ARJUN SHARMA',
        class: '1',
        section: 'A',
        feeData: {
            tuition: [2500, 2500, 1900, 1900, 1900, 1900, 1900, 1900, 1900, 5700],
            development: [200, 200, 200, 200, 200, 200, 200, 200, 200, 600],
            maintenance: [200, 200, 200, 200, 200, 200, 200, 200, 200, 600],
            games: [50, 50, 50, 50, 50, 50, 50, 50, 50, 150],
            session: [700, 700, 700, 700, 700, 700, 700, 700, 700, 2100],
            library: [50, 50, 50, 50, 50, 50, 50, 50, 50, 150],
            computer: [125, 125, 125, 125, 125, 125, 125, 125, 125, 375],
            fine: [50, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            paidDates: [
                '20/04/2025',
                '14/05/2025',
                '15/06/2025',
                '05/07/2025',
                '01/08/2025',
                '02/09/2025',
                '07/10/2025',
                '05/11/2025',
                '02/12/2025',
                '04/01/2026'
            ]
        }
    },
    {
        id: 3,
        admNo: 'ADM-2024-1A-003',
        name: 'PRIYA PATEL',
        class: '1',
        section: 'B',
        feeData: {
            tuition: [2600, 2600, 1950, 1950, 1950, 1950, 1950, 1950, 1950, 5850],
            development: [200, 200, 200, 200, 200, 200, 200, 200, 200, 600],
            maintenance: [200, 200, 200, 200, 200, 200, 200, 200, 200, 600],
            games: [50, 50, 50, 50, 50, 50, 50, 50, 50, 150],
            session: [700, 700, 700, 700, 700, 700, 700, 700, 700, 2100],
            library: [50, 50, 50, 50, 50, 50, 50, 50, 50, 150],
            computer: [125, 125, 125, 125, 125, 125, 125, 125, 125, 375],
            fine: [0, 25, 0, 0, 0, 0, 0, 0, 0, 0],
            paidDates: [
                '25/04/2025',
                '18/05/2025',
                '16/06/2025',
                '08/07/2025',
                '03/08/2025',
                '03/09/2025',
                '09/10/2025',
                '07/11/2025',
                '04/12/2025',
                '06/01/2026'
            ]
        }
    },
    {
        id: 4,
        admNo: 'ADM-2024-2B-001',
        name: 'RAHUL VERMA',
        class: '2',
        section: 'B',
        feeData: {
            tuition: [2800, 2800, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 6300],
            development: [250, 250, 250, 250, 250, 250, 250, 250, 250, 750],
            maintenance: [250, 250, 250, 250, 250, 250, 250, 250, 250, 750],
            games: [75, 75, 75, 75, 75, 75, 75, 75, 75, 225],
            session: [800, 800, 800, 800, 800, 800, 800, 800, 800, 2400],
            library: [75, 75, 75, 75, 75, 75, 75, 75, 75, 225],
            computer: [150, 150, 150, 150, 150, 150, 150, 150, 150, 450],
            fine: [0, 0, 50, 0, 0, 0, 0, 0, 0, 0],
            paidDates: [
                '21/04/2025',
                '16/05/2025',
                '17/06/2025',
                '09/07/2025',
                '04/08/2025',
                '04/09/2025',
                '10/10/2025',
                '08/11/2025',
                '05/12/2025',
                '07/01/2026'
            ]
        }
    },
    {
        id: 5,
        admNo: 'ADM-2024-3C-001',
        name: 'ANANYA SINGH',
        class: '3',
        section: 'C',
        feeData: {
            tuition: [3000, 3000, 2250, 2250, 2250, 2250, 2250, 2250, 2250, 6750],
            development: [300, 300, 300, 300, 300, 300, 300, 300, 300, 900],
            maintenance: [300, 300, 300, 300, 300, 300, 300, 300, 300, 900],
            games: [100, 100, 100, 100, 100, 100, 100, 100, 100, 300],
            session: [900, 900, 900, 900, 900, 900, 900, 900, 900, 2700],
            library: [100, 100, 100, 100, 100, 100, 100, 100, 100, 300],
            computer: [200, 200, 200, 200, 200, 200, 200, 200, 200, 600],
            fine: [100, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            paidDates: [
                '23/04/2025',
                '17/05/2025',
                '18/06/2025',
                '10/07/2025',
                '05/08/2025',
                '05/09/2025',
                '11/10/2025',
                '09/11/2025',
                '06/12/2025',
                '08/01/2026'
            ]
        }
    }
];

// Static fee report data
const staticFeeReportData = [
    {
        id: 1,
        slNo: 1,
        termsName: 'Term 1',
        todayPaidCount: 45,
        todayCollection: 125000,
        stillNowPaidCount: 320,
        stillNowCollection: 850000,
        totalStrength: 450,
        defaulters: 130
    },
    {
        id: 2,
        slNo: 2,
        termsName: 'Term 2',
        todayPaidCount: 38,
        todayCollection: 98000,
        stillNowPaidCount: 280,
        stillNowCollection: 720000,
        totalStrength: 450,
        defaulters: 170
    },
    {
        id: 3,
        slNo: 3,
        termsName: 'Term 3',
        todayPaidCount: 52,
        todayCollection: 145000,
        stillNowPaidCount: 350,
        stillNowCollection: 920000,
        totalStrength: 450,
        defaulters: 100
    }
];

export default function FeeGroupwiseStudentReport() {
    type catg = 'all' | 'individual' | 'student_wise' | 'admCat' | 'unmapped' | 'Termwise';
    const userTypeOptions: { label: string; value: catg }[] = [
        { label: 'All', value: 'all' },
        { label: 'Individual', value: 'individual' },
        { label: 'Student Wise', value: 'student_wise' },
        { label: 'Admission Category', value: 'admCat' },
        { label: 'Unmapped', value: 'unmapped' },
        { label: 'Termwise Paid Details', value: 'Termwise' }
    ];

    type stud_sel = 'S' | 'L' | 'D' | 'N';
    const stud_selTypeOptions: { label: string; value: stud_sel }[] = [
        { label: 'Studying', value: 'S' },
        { label: 'TC Students', value: 'L' },
        { label: 'Deactivated', value: 'D' },
        { label: 'New Admission', value: 'N' }
    ];

    const {
        handleSubmit,
        setValue,
        control,
        watch,
        register,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feesGroupwiseStudentReportSchema),
        defaultValues: {
            radio_val: 'all',
            stud_sel: 'S',
            academicYearId: undefined,
            classId: 0,
            sectionId: 0,
            groupIds: [],
            groupIdsNew: [],
            group_wise: true
        }
    });

    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<any[]>([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [searchAdmNo, setSearchAdmNo] = useState('');

    const [filters, setFilters] = useState({
        catg: 'Category' as catg,
        fromDate: new Date(),
        toDate: new Date(),
        academicYearId: '',
        classId: 0,
        sectionId: 0
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
    const [classes, setClasses] = useState<IFeeClassDropdownList[]>([]);
    const [sections, setSections] = useState<IFeeSectionDropdownList[]>([]);
    const [feeTerms, setfeeTerms] = useState<IInstallmentReportFeeTermDropdownList[]>([]);
    const [feeGroups, setfeeGroups] = useState<InstallmentReportGroupDropdownList[]>([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<'feeGroup' | 'totalDue' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [sectionLoading, setSectionLoading] = useState(false);

    // Hooks
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();
    const { data: classListResponse, isLoading: loadingClasses, error: classListError } = useFeeClassListDefaulterreport();
    const {
        data: feeInstallmentData,
        isLoading: feeInstallmentLoading,
        error: feeInstallmentError
    } = useFeeTransInstallmentYearlyfeecollectionreport();
    const { data: termsdropdowndata, isLoading: termsloading, error: termserror } = useFeeInstallmentreporttermDropdown();
    const { data: groupsdata, isLoading: groupsloading, error: groupserror } = useFeeInstallmentreportGroupDropdown();
    const {
        data: categorydropdowndata,
        isLoading: categoryloading,
        error: categoryerror,
        refetchAll: refetchCategory
    } = useFeeInstallmentreportCategoryDropdown();
    const {
        data: busroutedata,
        isLoading: busrouteLoading,
        error: busrouteError,
        refetchAll: refetchBusRoute
    } = useFeeInstallmentreportBusRouteDropdown();
    const {
        data: sectionListResponse,
        isLoading: loadingSections,
        error: sectionListError,
        refetch: refetchSections
    } = useFeeSectionListDefaulterreport();

    // Filtered students based on search
    const filteredStudents = staticStudents.filter(
        (student) =>
            student.admNo.toLowerCase().includes(searchAdmNo.toLowerCase()) ||
            student.name.toLowerCase().includes(searchAdmNo.toLowerCase())
    );

    // Calculate totals for a student
    const calculateTotals = (feeData: any) => {
        const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan-Mar'];
        const totals = {
            tuition: 0,
            development: 0,
            maintenance: 0,
            games: 0,
            session: 0,
            library: 0,
            computer: 0,
            fine: 0,
            monthlyTotals: Array(10).fill(0)
        };

        // Calculate category totals
        totals.tuition = feeData.tuition.reduce((a: number, b: number) => a + b, 0);
        totals.development = feeData.development.reduce((a: number, b: number) => a + b, 0);
        totals.maintenance = feeData.maintenance.reduce((a: number, b: number) => a + b, 0);
        totals.games = feeData.games.reduce((a: number, b: number) => a + b, 0);
        totals.session = feeData.session.reduce((a: number, b: number) => a + b, 0);
        totals.library = feeData.library.reduce((a: number, b: number) => a + b, 0);
        totals.computer = feeData.computer.reduce((a: number, b: number) => a + b, 0);
        totals.fine = feeData.fine.reduce((a: number, b: number) => a + b, 0);

        // Calculate monthly totals
        for (let i = 0; i < 10; i++) {
            totals.monthlyTotals[i] =
                feeData.tuition[i] +
                feeData.development[i] +
                feeData.maintenance[i] +
                feeData.games[i] +
                feeData.session[i] +
                feeData.library[i] +
                feeData.computer[i] +
                feeData.fine[i];
        }

        return totals;
    };

    useEffect(() => {
        if (termserror) toast.error(termserror?.message || 'Failed to load fee terms');
        else if (termsdropdowndata?.data) setfeeTerms(termsdropdowndata.data);
    }, [termsdropdowndata, termserror]);

    useEffect(() => {
        if (groupserror) toast.error(groupserror?.message || 'Failed to load fee groups');
        else if (groupsdata?.data) setfeeGroups(groupsdata.data);
    }, [groupsdata, groupserror]);

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

    const classId = watch('classId') ?? 0;
    const academicYearId = watch('academicYearId');

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

    const selectedCatg = watch('radio_val');

    useEffect(() => {
        if (selectedCatg === 'all' || selectedCatg === 'individual' || selectedCatg === 'student_wise' || selectedCatg === 'admCat') {
            setValue('group_wise', true, { shouldDirty: true, shouldValidate: true });
        } else {
            setValue('group_wise', false, { shouldDirty: true, shouldValidate: true });
        }
    }, [selectedCatg, setValue]);

    useEffect(() => {
        if (selectedCatg === 'student_wise' || selectedCatg === 'admCat') {
            setValue('amntchecked', true, { shouldDirty: true, shouldValidate: true });
        } else {
            setValue('amntchecked', false, { shouldDirty: true, shouldValidate: true });
        }
    }, [selectedCatg, setValue]);

    const groupIds = watch('groupIds') ?? [];
    const groupIdsnew = watch('groupIdsNew') ?? [];
    const isAllGroupsSelected = feeGroups.length > 0 && groupIds.length === feeGroups.length;
    const isAllGroupsSelectedNew = feeGroups.length > 0 && groupIdsnew.length === feeGroups.length;

    const toggleAllGroups = () => {
        setValue('groupIds', isAllGroupsSelected ? [] : feeGroups.map((g) => g.fmG_Id), { shouldDirty: true, shouldValidate: true });
    };

    const toggleAllGroupsnew = () => {
        setValue('groupIdsNew', isAllGroupsSelectedNew ? [] : feeGroups.map((g) => g.fmG_Id), { shouldDirty: true, shouldValidate: true });
    };

    const togglegroups = (id: number) => {
        const updated = groupIds.includes(id) ? groupIds.filter((x) => x !== id) : [...groupIds, id];
        setValue('groupIds', updated, { shouldDirty: true, shouldValidate: true });
    };

    const togglegroupsnew = (id: number) => {
        const updated = groupIdsnew.includes(id) ? groupIdsnew.filter((x) => x !== id) : [...groupIdsnew, id];
        setValue('groupIdsNew', updated, { shouldDirty: true, shouldValidate: true });
    };

    const handleExport = () => {
        // if (!selectedRows.length) {
        //     toast.error('Please select at least one record');
        //     return;
        // }
        //exportToExcel(selectedRows, 'Audit-Report');
    };

    const handlePrint = () => {
        if (!selectedStudent) {
            toast.error('Please select a student first');
            return;
        }

        const columns = [
            'SL No',
            'Head Name',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
            'January to March',
            'Opening Balance',
            'New Admission Fees',
            'Controlling Fees',
            'Outstanding Fee 2024-23',
            'Active CISCE Fee'
        ];

        const feeRows = [
            {
                id: 1,
                name: 'Tuition Fees',
                data: selectedStudent.feeData.tuition
            },
            {
                id: 2,
                name: 'Development Fees',
                data: selectedStudent.feeData.development
            },
            {
                id: 3,
                name: 'Maintenance Fees',
                data: selectedStudent.feeData.maintenance
            },
            {
                id: 4,
                name: 'Games & Co Curricular',
                data: selectedStudent.feeData.games
            },
            {
                id: 5,
                name: 'Session Fees / Diary! Smart card / Magazine / Digital Campus / Science Park',
                data: selectedStudent.feeData.session
            },
            {
                id: 6,
                name: 'Library/Hand Work Fees',
                data: selectedStudent.feeData.library
            },
            {
                id: 7,
                name: 'Computer Fees',
                data: selectedStudent.feeData.computer
            },
            {
                id: 8,
                name: 'Fine',
                data: selectedStudent.feeData.fine
            }
        ];

        // Create rows for printing
        const rowsToPrint = feeRows.map((item) => {
            const row: any = {
                'SL No': item.id,
                'Head Name': item.name
            };

            // Add monthly amounts
            item.data.forEach((amount: number, index: number) => {
                const monthName = [
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                    'January to March'
                ][index];
                row[monthName] = amount.toLocaleString();
            });

            // Add empty columns for additional fields
            row['Opening Balance'] = '';
            row['New Admission Fees'] = '';
            row['Controlling Fees'] = '';
            row['Outstanding Fee 2024-23'] = '';
            row['Active CISCE Fee'] = '';

            return row;
        });

        // Add SUM row
        const totals = calculateTotals(selectedStudent.feeData);
        const sumRow: any = {
            'SL No': '',
            'Head Name': 'SUM'
        };

        totals.monthlyTotals.forEach((total: number, index: number) => {
            const monthName = [
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
                'January to March'
            ][index];
            sumRow[monthName] = total.toLocaleString();
        });

        sumRow['Opening Balance'] = '';
        sumRow['New Admission Fees'] = '';
        sumRow['Controlling Fees'] = '';
        sumRow['Outstanding Fee 2024-23'] = '';
        sumRow['Active CISCE Fee'] = '';

        rowsToPrint.push(sumRow);

        // Add Paid Date row
        const paidDateRow: any = {
            'SL No': '',
            'Head Name': 'Paid Date'
        };

        selectedStudent.feeData.paidDates.forEach((date: string, index: number) => {
            const monthName = [
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
                'January to March'
            ][index];
            paidDateRow[monthName] = date;
        });

        paidDateRow['Opening Balance'] = '';
        paidDateRow['New Admission Fees'] = '';
        paidDateRow['Controlling Fees'] = '';
        paidDateRow['Outstanding Fee 2024-23'] = '';
        paidDateRow['Active CISCE Fee'] = '';

        rowsToPrint.push(paidDateRow);

        // Create print title with student details
        const printTitle = `FEE TERMWISE REPORT - ${selectedStudent.name} (Admission No: ${selectedStudent.admNo}) - Class ${selectedStudent.class} Section ${selectedStudent.section}`;

        // Call the printTable function with student details
        printTable(columns, rowsToPrint, printTitle);
    };

    // Add these functions to your component
    const handleExportExcel = () => {
        if (!selectedStudent) {
            toast.error('Please select a student first');
            return;
        }

        const feeRows = [
            {
                id: 1,
                name: 'Tuition Fees',
                data: selectedStudent.feeData.tuition
            },
            {
                id: 2,
                name: 'Development Fees',
                data: selectedStudent.feeData.development
            },
            {
                id: 3,
                name: 'Maintenance Fees',
                data: selectedStudent.feeData.maintenance
            },
            {
                id: 4,
                name: 'Games & Co Curricular',
                data: selectedStudent.feeData.games
            },
            {
                id: 5,
                name: 'Session Fees / Diary! Smart card / Magazine / Digital Campus / Science Park',
                data: selectedStudent.feeData.session
            },
            {
                id: 6,
                name: 'Library/Hand Work Fees',
                data: selectedStudent.feeData.library
            },
            {
                id: 7,
                name: 'Computer Fees',
                data: selectedStudent.feeData.computer
            },
            {
                id: 8,
                name: 'Fine',
                data: selectedStudent.feeData.fine
            }
        ];

        const totals = calculateTotals(selectedStudent.feeData);
        const monthNames = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January to March'];

        // Create data for Excel
        const excelData = [];

        // Header row 1: Student Information
        excelData.push(['FEE TERMWISE REPORT']);
        excelData.push([]);
        excelData.push(['Student Name:', selectedStudent.name]);
        excelData.push(['Admission No:', selectedStudent.admNo]);
        excelData.push(['Class:', selectedStudent.class, 'Section:', selectedStudent.section]);
        excelData.push([]);

        // Header row 2: Table headers
        const headers = [
            'SL No',
            'Head Name',
            ...monthNames,
            'Opening Balance',
            'New Admission Fees',
            'Controlling Fees',
            'Outstanding Fee 2024-23',
            'Active CISCE Fee'
        ];
        excelData.push(headers);

        // Add fee rows
        feeRows.forEach((item) => {
            const row = [
                item.id,
                item.name,
                ...item.data.map((amount: number) => amount),
                '',
                '',
                '',
                '',
                '' // Empty values for additional columns
            ];
            excelData.push(row);
        });

        // Add SUM row
        const sumRow = ['', 'SUM', ...totals.monthlyTotals, '', '', '', '', ''];
        excelData.push(sumRow);

        // Add Paid Date row
        const paidDateRow = ['', 'Paid Date', ...selectedStudent.feeData.paidDates, '', '', '', '', ''];
        excelData.push(paidDateRow);

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(excelData);

        // Apply styling and formatting
        const wscols = [
            { wch: 8 }, // SL No
            { wch: 60 }, // Head Name
            { wch: 10 }, // April
            { wch: 10 }, // May
            { wch: 10 }, // June
            { wch: 10 }, // July
            { wch: 10 }, // August
            { wch: 10 }, // September
            { wch: 10 }, // October
            { wch: 10 }, // November
            { wch: 10 }, // December
            { wch: 15 }, // January to March
            { wch: 15 }, // Opening Balance
            { wch: 15 }, // New Admission Fees
            { wch: 15 }, // Controlling Fees
            { wch: 20 }, // Outstanding Fee 2024-23
            { wch: 15 } // Active CISCE Fee
        ];
        ws['!cols'] = wscols;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Fee Report');

        // Generate file name
        const fileName = `Fee_Termwise_Report_${selectedStudent.admNo}_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Save the file
        XLSX.writeFile(wb, fileName);
        // toast.success('Excel file downloaded successfully');
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setReportLoading(true);
        setShowReport(false);
        setSelectedStudent(null);

        try {
            const radioSelected = data.radio_val;

            if (radioSelected === 'Termwise') {
                if (data.admno === '' || data.admno === null || data.admno === undefined) {
                    toast.error('Admission Number is required');
                    return;
                }
                // For Termwise report, find the selected student
                const selectedAdmNo = data.admno;
                const student = staticStudents.find((s) => s.admNo === selectedAdmNo);

                if (student) {
                    setSelectedStudent(student);
                    setReportData([student]); // Set report data with student
                    setShowReport(true);
                } else {
                    toast.error('Student not found');
                }
            } else {
                // For other report types, use static data
                setReportData(staticFeeReportData);
                setShowReport(true);
            }
        } catch (error: any) {
            console.error('Error generating report:', error);
            toast.error(error.message || 'Failed to generate report');
            setShowReport(false);
        } finally {
            setReportLoading(false);
        }

        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

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
                                            name='radio_val'
                                            control={control}
                                            render={({ field }) => (
                                                <div className='flex flex-wrap items-center justify-center gap-10'>
                                                    {userTypeOptions.map(({ label, value }) => (
                                                        <label key={value} className='flex cursor-pointer items-center gap-3'>
                                                            <input
                                                                type='radio'
                                                                name={field.name}
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

                                    <div className='mt-6 pt-6'>
                                        <div className='flex flex-wrap items-center justify-center gap-8'>
                                            {selectedCatg !== 'unmapped' && selectedCatg !== 'Termwise' && (
                                                <Label className='flex cursor-pointer items-center gap-3'>
                                                    <Controller
                                                        name='group_wise'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                disabled={selectedCatg === 'student_wise' || selectedCatg === 'admCat'}
                                                                checked={field.value || false}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        )}
                                                    />
                                                    <span className='font-medium text-base'>Group Wise</span>
                                                </Label>
                                            )}

                                            {selectedCatg !== 'unmapped' && selectedCatg !== 'Termwise' && (
                                                <Label className='flex cursor-pointer items-center gap-3'>
                                                    <Controller
                                                        name='amntchecked'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                disabled={selectedCatg === 'student_wise' || selectedCatg === 'admCat'}
                                                                checked={field.value || false}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        )}
                                                    />
                                                    <span className='font-medium text-base'>Amount</span>
                                                </Label>
                                            )}

                                            <Label className='flex cursor-pointer items-center gap-3'>
                                                <Controller
                                                    name='bulkdownload'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                                                    )}
                                                />
                                                <span className='font-medium text-base'>Bulk Download</span>
                                            </Label>
                                        </div>
                                    </div>
                                </Card>

                                <div className='flex items-center gap-12'>
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

                                    {(selectedCatg === 'all' || selectedCatg === 'individual' || selectedCatg === 'unmapped') && (
                                        <div className='flex items-center gap-12'>
                                            <>
                                                <Label className='w-24 pt-2 text-right'>
                                                    Fee Group <span className='text-red-500'>*</span>
                                                </Label>
                                                <input type='hidden' {...register('groupIdsNew')} />
                                                <Card className={cn('w-[360px] border bg-gray-50 p-4', errors.groupIdsNew)}>
                                                    <div className='mb-3'>
                                                        <Input
                                                            type='text'
                                                            placeholder='Search groups...'
                                                            value={search}
                                                            onChange={(e) => setSearch(e.target.value)}
                                                            className='w-full'
                                                        />
                                                    </div>
                                                    <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                        {feeGroups.length > 0 && (
                                                            <>
                                                                <Label className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-100'>
                                                                    <Checkbox
                                                                        checked={isAllGroupsSelectedNew}
                                                                        onCheckedChange={toggleAllGroupsnew}
                                                                    />
                                                                    <span>Select All</span>
                                                                </Label>
                                                                {groupsloading ? (
                                                                    <div className='py-6 text-center text-gray-500'>Loading...</div>
                                                                ) : feeGroups.length > 0 ? (
                                                                    feeGroups
                                                                        .filter(
                                                                            (grp) =>
                                                                                search === '' ||
                                                                                grp.fmg_groupname
                                                                                    .toLowerCase()
                                                                                    .includes(search.toLowerCase())
                                                                        )
                                                                        .map((grp) => (
                                                                            <Label
                                                                                key={grp.fmG_Id}
                                                                                htmlFor={`group-${grp.fmG_Id}`}
                                                                                className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                                <Checkbox
                                                                                    id={`group-${grp.fmG_Id}`}
                                                                                    checked={groupIdsnew.includes(grp.fmG_Id)}
                                                                                    onCheckedChange={() => togglegroupsnew(grp.fmG_Id)}
                                                                                />
                                                                                <span className='text-sm'>{grp.fmg_groupname}</span>
                                                                            </Label>
                                                                        ))
                                                                ) : (
                                                                    <div className='py-4 text-center text-gray-500'>No Groups</div>
                                                                )}
                                                                {search &&
                                                                    feeGroups.filter((g) =>
                                                                        g.fmg_groupname.toLowerCase().includes(search.toLowerCase())
                                                                    ).length === 0 && (
                                                                        <div className='py-4 text-center text-gray-500'>
                                                                            No groups found matching "{search}"
                                                                        </div>
                                                                    )}
                                                            </>
                                                        )}
                                                    </div>
                                                </Card>
                                                {errors.groupIdsNew && <FormError className='mt-1'>{errors.groupIdsNew.message}</FormError>}
                                            </>
                                        </div>
                                    )}

                                    {selectedCatg === 'Termwise' && (
                                        <div className='flex w-[420px] items-center gap-4'>
                                            <Label className='w-36 text-right'>
                                                Admission No <span className='text-red-500'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <Controller
                                                    name='admno'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value?.toString()}
                                                            onValueChange={(v) => {
                                                                field.onChange(v);
                                                                const student = staticStudents.find((s) => s.admNo === v);
                                                                // You can handle selected student logic here if needed
                                                            }}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='--Select Admission No--' />
                                                            </SelectTrigger>
                                                            <SelectContent className='max-h-64'>
                                                                {staticStudents
                                                                    .filter(
                                                                        (student) =>
                                                                            student.admNo
                                                                                .toLowerCase()
                                                                                .includes(searchAdmNo.toLowerCase()) ||
                                                                            student.name.toLowerCase().includes(searchAdmNo.toLowerCase())
                                                                    )
                                                                    .map((student) => (
                                                                        <SelectItem key={student.id} value={student.admNo}>
                                                                            {student.admNo}
                                                                        </SelectItem>
                                                                    ))}
                                                                {staticStudents.filter(
                                                                    (student) =>
                                                                        student.admNo.toLowerCase().includes(searchAdmNo.toLowerCase()) ||
                                                                        student.name.toLowerCase().includes(searchAdmNo.toLowerCase())
                                                                ).length === 0 && (
                                                                    <div className='p-3 text-center text-gray-500 text-sm'>
                                                                        No admission numbers found
                                                                    </div>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.admno && <FormError>{errors.admno.message}</FormError>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {(selectedCatg === 'individual' || selectedCatg === 'student_wise' || selectedCatg === 'admCat') && (
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

                                        {selectedCatg === 'admCat' && (
                                            <div className='flex w-[420px] items-center gap-4'>
                                                <Label className='w-36 text-right'>
                                                    Category <span className='text-red-500'>*</span>
                                                </Label>
                                                <div className='flex-1'>
                                                    <Controller
                                                        name='fmcC_Id'
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
                                                    {errors.fmcC_Id && <FormError>{errors.fmcC_Id.message}</FormError>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedCatg === 'individual' && (
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-4'>
                                            <Label className='font-semibold text-gray-700 text-lg'>Student Selection Options</Label>
                                        </div>
                                        <Card className='border bg-gray-50 p-5 shadow-sm'>
                                            <Controller
                                                name='stud_sel'
                                                control={control}
                                                render={({ field }) => (
                                                    <div className='flex flex-wrap items-center justify-center gap-8'>
                                                        {stud_selTypeOptions.map(({ label, value }) => (
                                                            <label key={value} className='flex cursor-pointer items-center gap-3'>
                                                                <input
                                                                    type='radio'
                                                                    name={field.name}
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
                                        </Card>
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
                                                <div className='flex items-center justify-between border-b bg-gray-50 px-8 py-4'>
                                                    <h2 className='whitespace-nowrap font-bold text-2xl text-primary'>
                                                        {selectedCatg === 'all'
                                                            ? 'CONSOLIDATE REPORT'
                                                            : selectedCatg === 'Termwise'
                                                              ? 'TERMWISE FEE REPORT'
                                                              : `REPORT FOR ${
                                                                    selectedCatg === 'student_wise'
                                                                        ? categorydropdowndata?.data?.find(
                                                                              (cat) => cat.fmcC_Id === watch('fmcC_Id')
                                                                          )?.fmcC_ClassCategoryName || ''
                                                                        : classes.find((cls) => cls.asmcL_Id === watch('classId'))
                                                                              ?.asmcL_ClassName || ''
                                                                }${
                                                                    watch('sectionId')
                                                                        ? ` ${
                                                                              sections.find((sec) => sec.asmS_Id === watch('sectionId'))
                                                                                  ?.asmC_SectionName || ''
                                                                          }`
                                                                        : ''
                                                                }`}
                                                    </h2>

                                                    <div className='flex gap-2'>
                                                        <Button
                                                            size='sm'
                                                            className='h-8 px-3 text-xs'
                                                            onClick={handleExportExcel}
                                                            disabled={!selectedStudent}>
                                                            Export Excel
                                                        </Button>
                                                        <Button
                                                            size='sm'
                                                            variant='outline'
                                                            className='h-8 px-3 text-xs'
                                                            onClick={handlePrint}
                                                            disabled={!selectedStudent}>
                                                            Export PDF
                                                        </Button>
                                                    </div>
                                                </div>

                                                {showReport && selectedCatg === 'Termwise' && selectedStudent && (
                                                    <div className='overflow-x-auto px-8 pb-8'>
                                                        <div className='mb-6'>
                                                            <div className='mb-4 text-center'>
                                                                <h3 className='font-bold text-xl'>FEE TERMWISE REPORT</h3>
                                                                <p className='mt-2 text-lg'>
                                                                    Student Name: {selectedStudent.name} | Class {selectedStudent.class}{' '}
                                                                    Section {selectedStudent.section} | Admission No:{' '}
                                                                    {selectedStudent.admNo}
                                                                </p>
                                                            </div>

                                                            <table className='w-full border-collapse border border-gray-300 text-sm'>
                                                                <thead className='bg-primary text-white'>
                                                                    <tr>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            SL No
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            Head Name
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            April
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>May</th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>June</th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>July</th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            August
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            September
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            October
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            November
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            December
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            January to March
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            Opening Balance
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            New Admission Fees
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            Controlling Fees
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            Outstanding Fee 2024-23
                                                                        </th>
                                                                        <th className='border px-2 py-2 text-center font-semibold'>
                                                                            Active CISCE Fee
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {[
                                                                        {
                                                                            id: 1,
                                                                            name: 'Tuition Fees',
                                                                            data: selectedStudent.feeData.tuition
                                                                        },
                                                                        {
                                                                            id: 2,
                                                                            name: 'Development Fees',
                                                                            data: selectedStudent.feeData.development
                                                                        },
                                                                        {
                                                                            id: 3,
                                                                            name: 'Maintenance Fees',
                                                                            data: selectedStudent.feeData.maintenance
                                                                        },
                                                                        {
                                                                            id: 4,
                                                                            name: 'Games & Co Curricular',
                                                                            data: selectedStudent.feeData.games
                                                                        },
                                                                        {
                                                                            id: 5,
                                                                            name: 'Session Fees / Diary! Smart card / Magazine / Digital Campus / Science Park',
                                                                            data: selectedStudent.feeData.session
                                                                        },
                                                                        {
                                                                            id: 6,
                                                                            name: 'Library/Hand Work Fees',
                                                                            data: selectedStudent.feeData.library
                                                                        },
                                                                        {
                                                                            id: 7,
                                                                            name: 'Computer Fees',
                                                                            data: selectedStudent.feeData.computer
                                                                        },
                                                                        { id: 8, name: 'Fine', data: selectedStudent.feeData.fine }
                                                                    ].map((item, index) => (
                                                                        <tr
                                                                            key={item.id}
                                                                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                            <td className='border px-2 py-2 text-center'>{item.id}</td>
                                                                            <td className='border px-2 py-2 text-left'>{item.name}</td>
                                                                            {item.data.map((amount: number, i: number) => (
                                                                                <td key={i} className='border px-2 py-2 text-right'>
                                                                                    {amount.toLocaleString()}
                                                                                </td>
                                                                            ))}
                                                                            {/* These empty cells should be self-closing */}
                                                                            <td className='border px-2 py-2 text-right' />
                                                                            <td className='border px-2 py-2 text-right' />
                                                                            <td className='border px-2 py-2 text-right' />
                                                                            <td className='border px-2 py-2 text-right' />
                                                                            <td className='border px-2 py-2 text-right' />
                                                                        </tr>
                                                                    ))}

                                                                    {/* SUM Row */}
                                                                    <tr className='bg-primary/10 font-bold'>
                                                                        <td className='border px-2 py-2 text-center' colSpan={2}>
                                                                            SUM
                                                                        </td>
                                                                        {calculateTotals(selectedStudent.feeData).monthlyTotals.map(
                                                                            (total, i) => (
                                                                                <td key={i} className='border px-2 py-2 text-right'>
                                                                                    {total.toLocaleString()}
                                                                                </td>
                                                                            )
                                                                        )}
                                                                        {/* These empty cells should be self-closing */}
                                                                        <td className='border px-2 py-2 text-right' colSpan={5} />
                                                                    </tr>

                                                                    {/* Paid Date Row */}
                                                                    <tr className='bg-primary/5'>
                                                                        <td className='border px-2 py-2 text-center' colSpan={2}>
                                                                            Paid Date
                                                                        </td>
                                                                        {selectedStudent.feeData.paidDates.map(
                                                                            (date: string, i: number) => (
                                                                                <td key={i} className='border px-2 py-2 text-center'>
                                                                                    {date}
                                                                                </td>
                                                                            )
                                                                        )}
                                                                        <td className='border px-2 py-2 text-center' colSpan={5} />
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* {showReport && selectedCatg === 'all' && (
                                                    <div className='overflow-x-auto px-8 pb-8'>
                                                        <table className='w-full border-collapse border border-gray-300 text-sm'>
                                                            <thead className='bg-primary text-white'>
                                                                <tr>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>Sl No</th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>Terms Name</th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>Today Paid Count</th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>Today Collection</th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>Still Now Paid Count</th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>Still Now Collection</th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>Total Strength</th>
                                                                    <th className='border px-2 py-2 text-center font-semibold'>Defaulters</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {staticFeeReportData.map((row, index) => (
                                                                    <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                        <td className='border px-2 py-2 text-center'>{row.slNo}</td>
                                                                        <td className='border px-2 py-2 text-left'>{row.termsName}</td>
                                                                        <td className='border px-2 py-2 text-right'>{row.todayPaidCount?.toLocaleString() || '-'}</td>
                                                                        <td className='border px-2 py-2 text-right'>₹{row.todayCollection?.toLocaleString() || '-'}</td>
                                                                        <td className='border px-2 py-2 text-right'>{row.stillNowPaidCount?.toLocaleString() || '-'}</td>
                                                                        <td className='border px-2 py-2 text-right'>₹{row.stillNowCollection?.toLocaleString() || '-'}</td>
                                                                        <td className='border px-2 py-2 text-right'>{row.totalStrength?.toLocaleString() || '-'}</td>
                                                                        <td className='border px-2 py-2 text-right'>{row.defaulters?.toLocaleString() || '-'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )} */}
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
