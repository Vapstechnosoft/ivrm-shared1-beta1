'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { onChangeClass, onChangeSection, onChangeYear } from '@/server/lesson-planner/reports/school-staff-period-transaction-report';
import type {
    IClass,
    IEmployee,
    ISection,
    ITransactionReportPayload,
    IYear
} from '@/types/lesson-planner/reports/school-staff-period-transaction-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    ASMCL_Id: z.string().min(1, 'Class is required'),
    ASMS_Id: z.string().min(1, 'Section is required'),
    HRME_Id: z.string().min(1, 'Employee is required')
});

interface ReportFilterProps {
    masterYear: IYear[];
    onSubmit: (data: ITransactionReportPayload) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ReportFilter({ masterYear, onSubmit, onCancel, isLoading }: ReportFilterProps) {
    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState('');

    const findValue = (obj: any, keys: string[]) => {
        if (!obj) return null;
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
        }
        return null;
    };

    const extractArray = (res: any, fallbackKey: string): any[] => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (res.data && Array.isArray(res.data)) return res.data;
        if (res[fallbackKey] && Array.isArray(res[fallbackKey])) return res[fallbackKey];
        if (res.data && res.data[fallbackKey] && Array.isArray(res.data[fallbackKey])) return res.data[fallbackKey];

        // Nuclear fallback: find the first array property
        for (const key in res) {
            if (Array.isArray(res[key])) return res[key];
        }
        if (res.data && typeof res.data === 'object') {
            for (const key in res.data) {
                if (Array.isArray(res.data[key])) return res.data[key];
            }
        }
        return [];
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ASMAY_Id: '',
            ASMCL_Id: '',
            ASMS_Id: '',
            HRME_Id: ''
        }
    });

    useEffect(() => {
        console.log('State - Classes:', classes);
    }, [classes]);
    useEffect(() => {
        console.log('State - Sections:', sections);
    }, [sections]);
    useEffect(() => {
        console.log('State - Employees:', employees);
    }, [employees]);

    const handleYearChange = async (yearId: string) => {
        form.setValue('ASMAY_Id', yearId);
        form.setValue('ASMCL_Id', '');
        form.setValue('ASMS_Id', '');
        form.setValue('HRME_Id', '');
        setClasses([]);
        setSections([]);
        setEmployees([]);

        startTransition(async () => {
            try {
                console.log('Fetching classes for year:', yearId);
                const res: any = await onChangeYear(Number(yearId));
                console.log('onChangeYear Response:', res);
                const classes = extractArray(res, 'masterclass');
                console.log('Extracted classes:', classes);
                if (classes.length > 0) setClasses(classes);
            } catch (error) {
                console.error('Error in handleYearChange:', error);
            }
        });
    };

    const handleClassChange = async (classId: string) => {
        form.setValue('ASMCL_Id', classId);
        form.setValue('ASMS_Id', '');
        form.setValue('HRME_Id', '');
        setSections([]);
        setEmployees([]);

        const yearId = form.getValues('ASMAY_Id');
        if (!yearId) return;

        startTransition(async () => {
            try {
                console.log('Fetching sections for:', { yearId, classId });
                const res: any = await onChangeClass(Number(yearId), Number(classId));
                console.log('onChangeClass Response:', res);
                const sections = extractArray(res, 'mastersection');
                console.log('Extracted sections:', sections);
                if (sections.length > 0) setSections(sections);
            } catch (error) {
                console.error('Error in handleClassChange:', error);
            }
        });
    };

    const handleSectionChange = async (sectionId: string) => {
        form.setValue('ASMS_Id', sectionId);
        form.setValue('HRME_Id', '');
        setEmployees([]);

        const yearId = form.getValues('ASMAY_Id');
        const classId = form.getValues('ASMCL_Id');
        if (!yearId || !classId) return;

        startTransition(async () => {
            try {
                const params = { yearId: Number(yearId), classId: Number(classId), sectionId: Number(sectionId) };
                console.log('Main: Fetching employees with params:', params);
                const res: any = await onChangeSection(params.yearId, params.classId, params.sectionId);
                console.log('Main RAW Response Keys:', Object.keys(res || {}));

                let extracted: any[] = [];
                if (res && Array.isArray(res.data)) {
                    extracted = res.data;
                } else if (Array.isArray(res)) {
                    extracted = res;
                } else if (res && res.data && Array.isArray(res.data.data)) {
                    extracted = res.data.data;
                } else if (res && res.employeedetails && Array.isArray(res.employeedetails)) {
                    extracted = res.employeedetails;
                } else {
                    extracted = extractArray(res, 'employeedetails');
                }

                console.log('Main Final Extracted:', extracted);
                setEmployees(extracted);

                if (extracted.length === 0) {
                    toast.info('No employees found for this section');
                }
            } catch (error) {
                console.error('Main: Error in handleSectionChange:', error);
                toast.error('Failed to fetch employees');
            }
        });
    };

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        onSubmit({
            ASMAY_Id: Number(data.ASMAY_Id),
            ASMCL_Id: Number(data.ASMCL_Id),
            ASMS_Id: Number(data.ASMS_Id),
            HRME_Id: Number(data.HRME_Id)
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6 rounded-lg border bg-white p-4 shadow-sm'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='ASMAY_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Academic Year <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={handleYearChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Year' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {masterYear.map((item) => {
                                            const id = findValue(item, ['asmaY_Id', 'ASMAY_Id', 'yearId']);
                                            const name = findValue(item, ['asmaY_Year', 'ASMAY_Year', 'yearName']);
                                            return (
                                                <SelectItem key={id} value={id?.toString() || ''}>
                                                    {name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='ASMCL_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Class <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select
                                    onValueChange={handleClassChange}
                                    value={field.value?.toString() || ''}
                                    disabled={classes.length === 0}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Class' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {classes.map((item) => {
                                            const id = findValue(item, ['asmcL_Id', 'ASMCL_Id', 'classId']);
                                            const name = findValue(item, ['asmcL_ClassName', 'ASMCL_ClassName', 'className']);
                                            return (
                                                <SelectItem key={id} value={id?.toString() || ''}>
                                                    {name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='ASMS_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Section <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select
                                    onValueChange={handleSectionChange}
                                    value={field.value?.toString() || ''}
                                    disabled={sections.length === 0}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Section' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sections.map((item) => {
                                            const id = findValue(item, ['asmS_Id', 'ASMS_Id', 'sectionId']);
                                            const name = findValue(item, ['asmC_SectionName', 'ASMC_SectionName', 'sectionName']);
                                            return (
                                                <SelectItem key={id} value={id?.toString() || ''}>
                                                    {name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='HRME_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Employee <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    isPending
                                                        ? 'Loading...'
                                                        : employees.length > 0
                                                          ? `Select Employee (${employees.length} found)`
                                                          : 'Select Employee'
                                                }
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {employees.length > 0 ? (
                                            employees.map((item, index) => {
                                                const id = findValue(item, ['hrmE_Id', 'HRME_Id', 'hrme_id', 'employeeId', 'employee_id']);
                                                const name =
                                                    findValue(item, [
                                                        'employeename',
                                                        'hrmE_EmployeeName',
                                                        'employeeName',
                                                        'hrmE_Fullname',
                                                        'hrme_fullname',
                                                        'staffname'
                                                    ]) || `Employee ID: ${id}`;
                                                return (
                                                    <SelectItem key={`${id}-${index}`} value={id?.toString() || ''}>
                                                        {name}
                                                    </SelectItem>
                                                );
                                            })
                                        ) : (
                                            <div className='p-2 text-center text-gray-500 text-sm'>No employees found</div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex justify-center gap-4'>
                    <Button type='submit' disabled={isPending || isLoading}>
                        {isPending || isLoading ? 'Loading...' : 'Report'}
                    </Button>
                    <Button type='button' variant='destructive' onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
