'use client';

import React, { useState } from 'react';
import { useClassWorkMarks } from '@/hooks/staff-portal/useClassworkMarks';
import ClassWorkMarksFilter from './_components/classwork-marks-filter';
import ClassWorkMarksGrid from './_components/classwork-marks-grid';
import type { ITopic, IStudentMarks, IClassWorkMarksInitialData } from '@/types/staff-portal/classwork-marks';

export default function ClassWorkMarksPage() {
    const {
        initialData,
        isLoadingInitial,
        getClasses,
        getSections,
        getSubjects,
        getTopicList,
        getStudentList,
        saveMarks,
        viewStudentUpload
    } = useClassWorkMarks();

    const [topicList, setTopicList] = useState<ITopic[]>([]);
    const [studentList, setStudentList] = useState<IStudentMarks[]>([]);
    const [filterData, setFilterData] = useState<any>(null); // Store filter for subsequent topic list fetch

    if (isLoadingInitial) return <div className="p-8 text-center">Loading...</div>;

    const handleGetTopics = async (data: any) => {
        setFilterData(data);
        try {
            const res = await getTopicList.mutateAsync(data);
            setTopicList(res.data?.topicList || []);
            setStudentList([]); // Clear previous students

            // If API returns a list and "All" (0) is default, we might not fetch students yet 
            // OR if the legacy auto-fetches for "All" topics, we handle that.
            // Legacy: If topics found, it populates drop down. 
            // It has logic: `if ($scope.TopicList != null ...)` it calls `getclasswork_Topiclist`.
            // But initially it calls `getclasswork_list` which returns topics AND maybe students if data sent differently.
            // Let's assume we wait for Topic selection.
        } catch (e) { console.error(e); }
    };

    const handleTopicSelect = async (topicId: number) => {
        if (!filterData) return;
        try {
            const payload = { ...filterData, ICW_Id: topicId };
            const res = await getStudentList.mutateAsync(payload);
            setStudentList(res.data?.getclasswork_list || []);
        } catch (e) { console.error(e); }
    };

    const handleSave = async (data: any) => {
        await saveMarks.mutateAsync(data);
        // Maybe refresh list
        if (filterData && topicList.length > 0) {
            handleTopicSelect(filterData.ICW_Id || 0); // Refresh current view
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <ClassWorkMarksFilter
            initialData={initialData ?? undefined}
            getClasses={async (d) => (await getClasses.mutateAsync(d)).data || { classlist: [] }}
            getSections={async (d) => (await getSections.mutateAsync(d)).data || { sectionlist: [] }}
            getSubjects={async (d) => (await getSubjects.mutateAsync(d)).data || { subjectlist: [] }}
            onGetTopics={handleGetTopics}
            onReset={() => { setTopicList([]); setStudentList([]); }}
            hrmE_Id={initialData?.hrmE_Id}
        />

            {(topicList.length > 0) && (
                <ClassWorkMarksGrid
                    topicList={topicList}
                    onTopicSelect={handleTopicSelect}
                    studentList={studentList}
                    onSave={handleSave}
                    onViewStudentUpload={async (d) => (await viewStudentUpload.mutateAsync(d)).data || { viewstudentupload: [] }}
                />
            )}
        </div>
    );
}
