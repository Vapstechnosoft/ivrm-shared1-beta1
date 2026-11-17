'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { createUsername, getInitialData } from '@/server/alumni/user-password-creation';
import type { IClass, ISection, IStudent, IYear } from '@/types/alumni/user-password-creation';
import { KeyRound, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { userPasswordCreationColumns } from './_components/columns';
import FilterForm from './_components/filter-form';

export default function UserPasswordCreationPage() {
    const [years, setYears] = useState<IYear[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<IStudent[]>([]);
    const [filterData, setFilterData] = useState<string>('');

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getInitialData();
            if (res.success && res.data) {
                setYears(res.data.yearList || []);
                setClasses(res.data.classlist || []);
                setSections(res.data.sectionlist || []);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to load initial data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleFilterSuccess = (studentList: IStudent[], filterdata: string) => {
        setStudents(studentList);
        setFilterData(filterdata);
    };

    const handleReset = () => {
        setStudents([]);
        setSelectedStudents([]);
        setFilterData('');
    };

    const handleCreateUsername = async () => {
        if (selectedStudents.length === 0) {
            toast.error('Please select at least one student');
            return;
        }

        setIsCreating(true);
        try {
            const payload = {
                filterdata: filterData,
                data_array: selectedStudents.map((student) => ({
                    AMST_Id: student.amst_id
                }))
            };
            const res = await createUsername(payload);
            if (res.success || res.message === 'Success') {
                toast.success('Usernames created successfully');
                handleReset();
            } else {
                toast.error(res.message || 'Failed to create usernames');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error occurred during creation');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className='container space-y-6 p-4'>
            <CollapsibleSection title='UserName Password Generation' defaultOpen={true}>
                {isLoading ? (
                    <div className='flex h-32 items-center justify-center'>
                        <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                ) : (
                    <FilterForm
                        years={years}
                        classes={classes}
                        sections={sections}
                        onSuccess={handleFilterSuccess}
                        onReset={handleReset}
                        onLoading={setIsTableLoading}
                    />
                )}
            </CollapsibleSection>

            {students.length > 0 && (
                <CollapsibleSection title='Student List' defaultOpen={true}>
                    <div className='space-y-4'>
                        <GenericDataTable<IStudent>
                            data={students}
                            columns={userPasswordCreationColumns}
                            isLoading={isTableLoading}
                            showExportOptions={true}
                            onRowSelectionChange={setSelectedStudents}
                            totalItems={students.length}
                            //manualPagination={false}
                        />

                        {selectedStudents.length > 0 && (
                            <div className='flex justify-center'>
                                <Button
                                    onClick={handleCreateUsername}
                                    disabled={isCreating}
                                    className='w-48 shadow-lg transition-all hover:scale-105'>
                                    {isCreating ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Creating...
                                        </>
                                    ) : (
                                        <>
                                            <KeyRound className='mr-2 h-4 w-4' /> Create Usernames
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}
