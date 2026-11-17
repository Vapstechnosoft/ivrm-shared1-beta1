'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    getEmployeeClasses,
    getEmployeeSections,
    getEmployeeSubjects
} from '@/server/lesson-planner/transactions/school-staff-period-mapping';
import type {
    IEmployee,
    IMasterClass,
    IMasterSubject,
    IMasterYear,
    ISection
} from '@/types/lesson-planner/transactions/school-staff-period-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type ISchoolStaffPeriodMappingFormValues, SchoolStaffPeriodMappingSchema } from './schema';

interface AddFormProps {
    masterYear: IMasterYear[];
    employees: IEmployee[];
    onSearch: (values: ISchoolStaffPeriodMappingFormValues) => void;
    onReset: () => void;
    isLoading?: boolean;
}

export default function AddForm({ masterYear, employees, onSearch, onReset, isLoading }: AddFormProps) {
    const [classes, setClasses] = useState<IMasterClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [subjects, setSubjects] = useState<IMasterSubject[]>([]);

    const form = useForm<ISchoolStaffPeriodMappingFormValues>({
        resolver: zodResolver(SchoolStaffPeriodMappingSchema),
        defaultValues: {
            ASMA_Id: 0,
            HRME_Id: 0,
            ASMCL_Id: 0,
            ASMS_Id: 0,
            ISMS_Id: 0
        }
    });

    const selectedYear = form.watch('ASMA_Id');
    const selectedEmployee = form.watch('HRME_Id');
    const selectedClass = form.watch('ASMCL_Id');
    const selectedSection = form.watch('ASMS_Id');

    const findValue = (obj: any, keys: string[]) => {
        if (!obj) return null;
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
        }
        return null;
    };

    const getArray = (res: any, key: string, alternatives: string[]) => {
        if (!res) return [];

        const extract = (obj: any): any[] | null => {
            if (Array.isArray(obj)) return obj;
            if (obj?.$values && Array.isArray(obj.$values)) return obj.$values;

            const val = findValue(obj, [key, ...alternatives]);
            if (Array.isArray(val)) return val;
            if (val?.$values && Array.isArray(val.$values)) return val.$values;

            return null;
        };

        const fromRoot = extract(res);
        if (fromRoot) return fromRoot;

        if (res.data) {
            const fromData = extract(res.data);
            if (fromData) return fromData;
        }

        return [];
    };

    // Cascading Dropdowns
    useEffect(() => {
        if (Number(selectedYear) > 0 && Number(selectedEmployee) > 0) {
            const fetchClasses = async () => {
                try {
                    const res = await getEmployeeClasses(Number(selectedEmployee), Number(selectedYear));
                    const classData = getArray(res, 'masterclass', [
                        'getclass',
                        'getclasslist',
                        'classList',
                        'getMasterClass',
                        'classes',
                        'classroom'
                    ]);
                    setClasses(classData);
                } catch (error) {
                    toast.error('Failed to fetch classes');
                }
            };
            fetchClasses();
        } else {
            setClasses([]);
            form.setValue('ASMCL_Id', 0);
        }
    }, [selectedYear, selectedEmployee, form]);

    useEffect(() => {
        if (Number(selectedYear) > 0 && Number(selectedEmployee) > 0 && Number(selectedClass) > 0) {
            const fetchSections = async () => {
                try {
                    const res = await getEmployeeSections(Number(selectedYear), Number(selectedEmployee), Number(selectedClass));
                    const sectionData = getArray(res, 'mastersection', [
                        'getsection',
                        'getsectionlist',
                        'sectionList',
                        'getMasterSection',
                        'sections',
                        'section'
                    ]);
                    setSections(sectionData);
                } catch (error) {
                    toast.error('Failed to fetch sections');
                }
            };
            fetchSections();
        } else {
            setSections([]);
            form.setValue('ASMS_Id', 0);
        }
    }, [selectedYear, selectedEmployee, selectedClass, form]);

    useEffect(() => {
        if (Number(selectedYear) > 0 && Number(selectedEmployee) > 0 && Number(selectedClass) > 0 && Number(selectedSection) > 0) {
            const fetchSubjects = async () => {
                try {
                    const res = await getEmployeeSubjects(
                        Number(selectedYear),
                        Number(selectedEmployee),
                        Number(selectedClass),
                        Number(selectedSection)
                    );
                    const subjectData = getArray(res, 'mastersubjects', [
                        'getsubject',
                        'getsubjectlist',
                        'subjectList',
                        'getMasterSubject',
                        'subjects',
                        'subject'
                    ]);
                    setSubjects(subjectData);
                } catch (error) {
                    toast.error('Failed to fetch subjects');
                }
            };
            fetchSubjects();
        } else {
            setSubjects([]);
            form.setValue('ISMS_Id', 0);
        }
    }, [selectedYear, selectedEmployee, selectedClass, selectedSection, form]);

    const handleReset = () => {
        form.reset();
        setClasses([]);
        setSections([]);
        setSubjects([]);
        onReset();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearch)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {/* Academic Year */}
                    <FormField
                        control={form.control}
                        name='ASMA_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Academic Year <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Year' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {masterYear.length > 0 ? (
                                            masterYear.map((item) => {
                                                const id = findValue(item, ['asmaY_Id', 'ASMAY_Id', 'asmaY_ID', 'yearId', 'asmaY_id']);
                                                const name = findValue(item, [
                                                    'asmaY_Year',
                                                    'ASMAY_Year',
                                                    'asmaY_year',
                                                    'yearName',
                                                    'year'
                                                ]);
                                                return (
                                                    <SelectItem key={id} value={id?.toString() || ''}>
                                                        {name}
                                                    </SelectItem>
                                                );
                                            })
                                        ) : (
                                            <SelectItem value='0' disabled>
                                                No years found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Employee */}
                    <FormField
                        control={form.control}
                        name='HRME_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Employee Name <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Employee' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {employees.length > 0 ? (
                                            employees.map((item) => {
                                                const id = findValue(item, ['hrmE_Id', 'HRME_Id', 'employeeId', 'hrmE_id']);
                                                const name = findValue(item, [
                                                    'employeename',
                                                    'hrmE_EmployeeName',
                                                    'employeeName',
                                                    'hrmE_Fullname'
                                                ]);
                                                return (
                                                    <SelectItem key={id} value={id?.toString() || ''}>
                                                        {name}
                                                    </SelectItem>
                                                );
                                            })
                                        ) : (
                                            <SelectItem value='0' disabled>
                                                No employees found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Class */}
                    <FormField
                        control={form.control}
                        name='ASMCL_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Class <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Class' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {classes.length > 0 ? (
                                            classes.map((item) => {
                                                const id = findValue(item, [
                                                    'asmcL_Id',
                                                    'ASMCL_Id',
                                                    'asmcL_ID',
                                                    'classId',
                                                    'asmcL_id',
                                                    'asmA_Id',
                                                    'ASMA_Id'
                                                ]);
                                                const name = findValue(item, [
                                                    'asmcL_ClassName',
                                                    'ASMCL_ClassName',
                                                    'asmcL_Classname',
                                                    'className',
                                                    'class'
                                                ]);
                                                return (
                                                    <SelectItem key={id} value={id?.toString() || ''}>
                                                        {name}
                                                    </SelectItem>
                                                );
                                            })
                                        ) : (
                                            <SelectItem value='0' disabled>
                                                No classes found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Section */}
                    <FormField
                        control={form.control}
                        name='ASMS_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Section <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Section' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sections.length > 0 ? (
                                            sections.map((item) => {
                                                const id = findValue(item, [
                                                    'asmS_Id',
                                                    'ASMS_Id',
                                                    'asmS_ID',
                                                    'sectionId',
                                                    'asmS_id',
                                                    'asmS_Id'
                                                ]);
                                                const name = findValue(item, [
                                                    'asmC_SectionName',
                                                    'ASMC_SectionName',
                                                    'asmC_Sectionname',
                                                    'sectionName',
                                                    'section'
                                                ]);
                                                return (
                                                    <SelectItem key={id} value={id?.toString() || ''}>
                                                        {name}
                                                    </SelectItem>
                                                );
                                            })
                                        ) : (
                                            <SelectItem value='0' disabled>
                                                No sections found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Subject */}
                    <FormField
                        control={form.control}
                        name='ISMS_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Subject <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Subject' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subjects.length > 0 ? (
                                            subjects.map((item) => {
                                                const id = findValue(item, [
                                                    'ismS_Id',
                                                    'ISMS_Id',
                                                    'ismS_ID',
                                                    'subjectId',
                                                    'ismS_id',
                                                    'isM_Id'
                                                ]);
                                                const name = findValue(item, [
                                                    'ismS_SubjectName',
                                                    'ISMS_SubjectName',
                                                    'ismS_subjectName',
                                                    'subjectName',
                                                    'subject'
                                                ]);
                                                return (
                                                    <SelectItem key={id} value={id?.toString() || ''}>
                                                        {name}
                                                    </SelectItem>
                                                );
                                            })
                                        ) : (
                                            <SelectItem value='0' disabled>
                                                No subjects found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex justify-center gap-4'>
                    <Button type='submit' disabled={isLoading} variant='default'>
                        <Search className='mr-2 h-4 w-4' /> Get Details
                    </Button>
                    <Button type='button' variant='outline' onClick={handleReset} disabled={isLoading}>
                        <X className='mr-2 h-4 w-4' /> Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
