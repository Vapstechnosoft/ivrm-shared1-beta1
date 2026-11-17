'use client';

import React, { useState } from 'react';
import { useExamwiseStudentRemarks } from '@/hooks/staff-portal/useExamwiseStudentRemarks';
import ExamwiseRemarksFilter from './_components/examwise-student-remarks-filter';
import ExamwiseRemarksGrid from './_components/examwise-student-remarks-grid';
import SavedRemarksList from './_components/saved-remarks-list';
import type { IStudentExamRemarks, IExamConfig } from '@/types/staff-portal/examwise-student-remarks';

export default function ExamwiseRemarksPage() {
    const {
        initialData,
        isLoadingInitial,
        getClasses,
        getSections,
        getExams,
        searchData,
        saveMapping,
        viewSubjectWiseRemarks,
        editMappingDetails
    } = useExamwiseStudentRemarks();

    const [students, setStudents] = useState<IStudentExamRemarks[]>([]);
    const [config, setConfig] = useState<IExamConfig[]>([]);
    const [filterData, setFilterData] = useState<{ ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number; EME_Id: number } | null>(null);
    const [savedList, setSavedList] = useState<any[]>([]); // To store loaded saved data for grid
    const [editModeData, setEditModeData] = useState<any>(null); // For edit functionality

    // Load initial saved list from initialData if available (or use a separate effect if strictly needed)
    React.useEffect(() => {
        if (initialData?.loaddata) {
            setSavedList(initialData.loaddata);
        }
    }, [initialData]);

    if (isLoadingInitial) return <div className="p-8 text-center">Loading...</div>;

    const handleSearch = async (data: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number; EME_Id: number }) => {
        setFilterData(data);
        setEditModeData(null); // Clear edit mode if manual search
        try {
            const res = await searchData.mutateAsync(data);
            const { studentList, configuration, savedata, getstudentmarks, get_subjectwiseremarks } = res.data || {};

            setConfig(configuration || []);

            const processedStudents = (studentList || []).map(s => {
                const saved = savedata?.find(sd => sd.amsT_Id === s.amsT_Id);
                const marks = getstudentmarks?.find(m => m.amsT_Id === s.amsT_Id);
                const hasSubjectRemarks = get_subjectwiseremarks?.some(sr => sr.amsT_Id === s.amsT_Id);

                return {
                    ...s,
                    checked: !!saved,
                    remarks: saved?.emeR_Remarks || '',
                    ESPCR_Id: saved?.espcR_Id,
                    obtainedmarks: marks?.estmP_TotalObtMarks,
                    totalmaxmarks: marks?.estmP_TotalMaxMarks,
                    percentage: marks?.estmP_Percentage,
                    flag: hasSubjectRemarks ? 1 : 0
                };
            });

            setStudents(processedStudents);
        } catch (e) {
            console.error(e);
            setStudents([]);
        }
    };

    const handleSave = async (data: any) => {
        await saveMapping.mutateAsync(data);
        if (filterData) {
            handleSearch(filterData);
        }
    };

    const handleEdit = async (item: any) => {
        try {
            // Call edit API to get specific details for this record combo
            const res = await editMappingDetails.mutateAsync(item);

            // This API returns similar structure to searchData but filtered for that record
            // We set filter data so search is "active"
            const data = res.data;
            if (!data) return;

            // We need to set the Filter component values
            // The item has IDs: asmaY_Id, asmcL_Id, asmS_Id, emE_Id
            // The response has list data to repopulate dropdowns in filter if we were strictly following it,
            // but our Filter component fetches on ID set.

            // Use editModeData to tell filter to set these values
            const ids = {
                ASMAY_Id: item.asmaY_Id,
                ASMCL_Id: item.asmcL_Id,
                ASMS_Id: item.asmS_Id,
                EME_Id: item.emE_Id
            };
            setFilterData(ids); // Set as current filter
            setEditModeData(ids); // Trigger useEffect in Filter

            // Also populate students grid directly from response if available, similar to search
            // The Edit API response structure in legacy is: studentList, savedata, etc.
            const { studentList, configuration, savedata, getstudentmarks, get_subjectwiseremarks } = data;
            setConfig(configuration || []);
            const processedStudents = (studentList || []).map((s: any) => {
                const saved = savedata?.find((sd: any) => sd.amsT_Id === s.amsT_Id);
                const marks = getstudentmarks?.find((m: any) => m.amsT_Id === s.amsT_Id);
                const hasSubjectRemarks = get_subjectwiseremarks?.some((sr: any) => sr.amsT_Id === s.amsT_Id);

                return {
                    ...s,
                    checked: !!saved,
                    remarks: saved?.emeR_Remarks || '',
                    ESPCR_Id: saved?.espcR_Id,
                    obtainedmarks: marks?.estmP_TotalObtMarks,
                    totalmaxmarks: marks?.estmP_TotalMaxMarks,
                    percentage: marks?.estmP_Percentage,
                    flag: hasSubjectRemarks ? 1 : 0
                };
            });
            setStudents(processedStudents);

        } catch (e) { console.error(e); }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <ExamwiseRemarksFilter
                initialData={initialData}
                getClasses={async (d) => (await getClasses.mutateAsync(d)).data || { classlist: [] }}
                getSections={async (d) => (await getSections.mutateAsync(d)).data || { sectionlist: [] }}
                getExams={async (d) => (await getExams.mutateAsync(d)).data || { examlist: [] }}
                onSearch={handleSearch}
                onReset={() => { setStudents([]); setFilterData(null); setEditModeData(null); }}
                isLoading={searchData.isPending}
                editData={editModeData}
                disabled={!!editModeData}
            />

            {(students.length > 0) && (
                <ExamwiseRemarksGrid
                    studentList={students}
                    config={config}
                    onSave={handleSave}
                    filterData={filterData!}
                    onViewSubjectRemarks={async (id) => (await viewSubjectWiseRemarks.mutateAsync({
                        AMST_Id: id,
                        ...filterData!
                    })).data || { get_viewsubjectwiseremarks: [] }}
                />
            )}

            <SavedRemarksList
                savedList={savedList}
                onEdit={handleEdit}
            />
        </div>
    );
}
