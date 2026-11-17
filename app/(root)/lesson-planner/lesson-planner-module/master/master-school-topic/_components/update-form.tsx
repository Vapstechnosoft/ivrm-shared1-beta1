'use client';

import { editSchoolTopic } from '@/server/lesson-planner/master/school-topic';
import type { IMasterClass, IMasterSchoolTopic, IMasterSubject } from '@/types/lesson-planner/master/school-topic';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddMasterSchoolTopicForm from './add-form';

interface UpdateMasterSchoolTopicFormProps {
    selectedRow: IMasterSchoolTopic;
    onSuccess?: () => void;
    masterYear: any[];
    masterUnit: any[];
    masterClasses: any[];
    masterSubjects: any[];
    mI_Id: number;
    userId: number;
    className?: string;
}

export default function UpdateMasterSchoolTopicForm({
    selectedRow,
    onSuccess,
    masterYear,
    masterUnit,
    masterClasses,
    masterSubjects,
    mI_Id,
    userId,
    className = ''
}: UpdateMasterSchoolTopicFormProps) {
    const [editData, setEditData] = useState<IMasterSchoolTopic | null>(null);
    const [editClasses, setEditClasses] = useState<IMasterClass[]>([]);
    const [editSubjects, setEditSubjects] = useState<IMasterSubject[]>([]);
    const [editUnits, setEditUnits] = useState<any[]>([]);
    const [editYears, setEditYears] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('[UpdateMasterSchoolTopicForm] selectedRow:', selectedRow);
        console.log('[UpdateMasterSchoolTopicForm] Keys:', Object.keys(selectedRow));

        const fetchEditDetails = async () => {
            setIsLoading(true);
            try {
                // Handle different ID casings
                const id = selectedRow.lpmmT_Id || (selectedRow as any).LPMMT_Id;
                console.log('[UpdateMasterSchoolTopicForm] Fetching edit details for ID:', id);

                if (!id) {
                    console.error('[UpdateMasterSchoolTopicForm] No valid ID found for edit');
                    toast.error('Cannot fetch edit details: Missing record ID');
                    setEditData(selectedRow);
                    setIsLoading(false);
                    return;
                }

                const res: any = await editSchoolTopic(id);
                console.log('Edit API Response:', res);

                if (res.success && res.data) {
                    console.info('[UpdateMasterSchoolTopicForm] API Response Data:', res.data);

                    const editData = (res.data.editdetail?.[0] || res.data.editdetails?.[0] || selectedRow) as IMasterSchoolTopic;
                    console.info('[UpdateMasterSchoolTopicForm] Mapped editData:', editData);
                    setEditData(editData);

                    const getList = (key: string, alternatives: string[]) => {
                        if (Array.isArray(res.data[key])) return res.data[key];
                        for (const alt of alternatives) {
                            if (Array.isArray(res.data[alt])) return res.data[alt];
                        }
                        return [];
                    };

                    const yearArray = getList('getyear', ['getyearlist', 'getyearDetails', 'yearlist', 'getAcademicYear']);
                    const classArray = getList('getclass', ['getclasslist', 'classList', 'getMasterClass']);
                    const subjectArray = getList('getsubject', ['getsubjectlist', 'subjectlist', 'getSubjects', 'getMastersubject']);
                    const unitArray = getList('getunitlist', ['getunitlist', 'unitlist', 'getunitlisting']);

                    if (yearArray.length > 0) setEditYears(yearArray);
                    if (classArray.length > 0) setEditClasses(classArray);
                    if (subjectArray.length > 0) setEditSubjects(subjectArray);
                    if (unitArray.length > 0) setEditUnits(unitArray);
                } else {
                    console.error('Invalid API response structure or empty data:', res);
                    // Fallback to selectedRow if API doesn't return data
                    setEditData(selectedRow);
                }
            } catch (error) {
                console.error('Error fetching edit details:', error);
                toast.error(`Failed to fetch edit details: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setEditData(selectedRow);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEditDetails();
    }, [selectedRow]);

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <div className='text-muted-foreground'>Loading edit details...</div>
            </div>
        );
    }

    if (!editData) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <div className='text-destructive'>Failed to load edit data</div>
            </div>
        );
    }

    console.log('UpdateForm - Passing to AddForm:', {
        editData,
        masterYear,
        masterUnit,
        editClasses,
        editSubjects
    });

    return (
        <div className={className}>
            <AddMasterSchoolTopicForm
                masterYear={editYears.length > 0 ? editYears : masterYear}
                masterUnit={editUnits.length > 0 ? editUnits : masterUnit}
                initialData={editData}
                initialClasses={editClasses.length > 0 ? editClasses : masterClasses}
                initialSubjects={editSubjects.length > 0 ? editSubjects : masterSubjects}
                onSuccess={onSuccess}
                mI_Id={mI_Id}
                userId={userId}
            />
        </div>
    );
}
