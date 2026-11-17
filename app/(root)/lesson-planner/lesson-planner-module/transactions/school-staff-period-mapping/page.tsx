'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import {
    getInitialDetails,
    getStaffPeriodSearchDetails,
    saveStaffPeriodMapping
} from '@/server/lesson-planner/transactions/school-staff-period-mapping';
import type { IDateItem, IEmployee, IMasterYear, ITopic } from '@/types/lesson-planner/transactions/school-staff-period-mapping';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddForm from './_components/add-form';
import MappingTable from './_components/mapping-table';
import type { ISchoolStaffPeriodMappingFormValues } from './_components/schema';

export default function SchoolStaffPeriodMappingPage() {
    const [masterYear, setMasterYear] = useState<IMasterYear[]>([]);
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [dates, setDates] = useState<IDateItem[]>([]);
    const [topics, setTopics] = useState<ITopic[]>([]);

    const [searchValues, setSearchValues] = useState<ISchoolStaffPeriodMappingFormValues | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const findValue = (obj: any, keys: string[]) => {
        if (!obj) return null;
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
        }
        return null;
    };

    const getList = (res: any, key: string, alternatives: string[]) => {
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

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const res = await getInitialDetails();
                if (res.success) {
                    const yearList = getList(res, 'masteryear', ['getyear', 'getyearlist', 'yearlist', 'getAcademicYear', 'years']);
                    const employeeList = getList(res, 'employeedetails', [
                        'getemployee',
                        'getemployeelist',
                        'employeelist',
                        'employees',
                        'hrmE_EmployeeName'
                    ]);

                    setMasterYear(yearList);
                    setEmployees(employeeList);
                } else {
                    toast.error(res.message || 'Failed to fetch initial data');
                }
            } catch (error) {
                console.error('Error fetching initial mapping data:', error);
                toast.error('An error occurred while loading initial data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = async (values: ISchoolStaffPeriodMappingFormValues) => {
        setSearchValues(values);
        setIsSearching(true);
        try {
            const res = await getStaffPeriodSearchDetails(
                Number(values.ASMA_Id),
                Number(values.HRME_Id),
                Number(values.ASMCL_Id),
                Number(values.ASMS_Id),
                Number(values.ISMS_Id)
            );
            if (res.success) {
                const dateList = getList(res, 'getalldates', ['getdate', 'dateList', 'allDates', 'dates']);
                const topicList = getList(res, 'gettopicdetails', ['gettopic', 'topicList', 'allTopics', 'topics']);

                setDates(dateList);
                setTopics(topicList);

                if (dateList.length === 0) {
                    toast.info('No records found for the selected criteria');
                } else {
                    toast.success(`Found ${dateList.length} dates for mapping`);
                }
            } else {
                toast.error(res.message || 'Failed to fetch search details');
            }
        } catch (error) {
            console.error('Error searching mapping details:', error);
            toast.error('An error occurred during search');
        } finally {
            setIsSearching(false);
        }
    };

    const handleReset = () => {
        setDates([]);
        setTopics([]);
    };

    const handleSave = async (mappingData: any[]) => {
        if (!searchValues) {
            return;
        }
        setIsLoading(true);
        try {
            const payload = {
                asmaY_Id: Number(searchValues.ASMA_Id),
                asmcL_Id: Number(searchValues.ASMCL_Id),
                asmS_Id: Number(searchValues.ASMS_Id),
                hrmE_Id: Number(searchValues.HRME_Id),
                ismS_Id: Number(searchValues.ISMS_Id),
                schoolStaffPeriodMappingTempDTO: mappingData
            };
            const res = await saveStaffPeriodMapping(payload);
            if (res.success || res.returnval) {
                toast.success(res.message || 'Record Saved successfully');
                handleReset();
            } else {
                toast.error(res.message || 'Failed to save mapping');
            }
        } catch (error) {
            console.error('Error saving mapping:', error);
            toast.error('An error occurred while saving');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container mx-auto space-y-6 py-6'>
            <div className='flex flex-col gap-1'>
                <h1 className='font-bold text-2xl tracking-tight'>School Staff Period Mapping</h1>
                <p className='text-muted-foreground'>Map staff members to specific periods and dates for lesson planning.</p>
            </div>

            <CollapsibleSection title='Filter Criteria' defaultOpen={true}>
                <AddForm
                    masterYear={masterYear}
                    employees={employees}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    isLoading={isSearching || isLoading}
                />
            </CollapsibleSection>

            {dates.length > 0 && (
                <CollapsibleSection title='Date & Topic Mapping' defaultOpen={true}>
                    <MappingTable dates={dates} topics={topics} onSave={handleSave} isLoading={isLoading} />
                </CollapsibleSection>
            )}
        </div>
    );
}
