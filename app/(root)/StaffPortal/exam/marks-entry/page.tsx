
'use client';

import React, { useState } from 'react';
import { useMarksEntry } from '@/hooks/staff-portal/useMarksEntry';
import MarksEntryFilter from './_components/marks-entry-filter';
import MarksEntryTable from './_components/marks-entry-table';
import { toast } from 'sonner';
import type {
    IMarksEntrySearchRequest,
    IMarksEntrySearchResponse,
    IStudentMark,
    IMarksEntrySaveRequest
} from '@/types/staff-portal/marks-entry';

export default function StaffMarksEntryPage() {
    const {
        initialData,
        isLoadingInitial,
        getClasses,
        getSections,
        getExams,
        getSubjects,
        search,
        save
    } = useMarksEntry();

    const [searchData, setSearchData] = useState<IMarksEntrySearchResponse | null>(null);
    const [lastSearchParams, setLastSearchParams] = useState<IMarksEntrySearchRequest | null>(null);
    const [markCalculation, setMarkCalculation] = useState<boolean>(true);

    const handleSearch = (params: IMarksEntrySearchRequest, calc: boolean) => {
        setMarkCalculation(calc);
        setLastSearchParams(params);
        search.mutate(params, {
            onSuccess: (res) => {
                if (res?.data?.studentList && res.data.studentList.length > 0) {
                    setSearchData(res.data);
                } else {
                    toast.error("No students found for the selected criteria");
                    setSearchData(null);
                }
            },
            onError: () => {
                toast.error("Failed to fetch marks configuration");
            }
        });
    };

    const handleSave = (students: IStudentMark[], status: 'S' | 'V') => {
        if (!lastSearchParams || !searchData) return;

        const main_save_list = students
            .filter(s => s.selected_s || s.selected_ssse || s.selected_ss || s.selected_se)
            .map(s => ({
                AMST_Id: s.amsT_Id,
                AMST_FirstName: s.amsT_FirstName,
                AMST_AdmNo: s.amsT_AdmNo,
                AMAY_RollNo: s.amaY_RollNo,
                ISMS_Id: s.ismS_Id || lastSearchParams.ISMS_Id,
                ESTM_Marks: s.ESTM_Marks,
                ESTM_Flg: s.ESTM_Flg,
                ESTM_Grade: s.ESTM_Grade,
                ESTMSS_Marks: s.ESTMSS_Marks,
                ESTMANSSH_AnswerSheet: s.estmanssH_AnswerSheet,
                ESTMANSSH_FileLocation: s.estmanssH_FileLocation,
                // Add other required mapping properties from details if needed
                EYCES_MaxMarks: searchData.subject_details[0]?.eyceS_MaxMarks,
                EYCES_MarksEntryMax: searchData.subject_details[0]?.eyceS_MarksEntryMax,
            }));

        if (main_save_list.length === 0) {
            toast.warning("Select at least one student to save marks");
            return;
        }

        const payload: IMarksEntrySaveRequest = {
            main_save_list,
            ASMS_Id: lastSearchParams.ASMS_Id,
            ASMCL_Id: lastSearchParams.ASMCL_Id,
            ASMAY_Id: lastSearchParams.ASMAY_Id,
            EME_Id: lastSearchParams.EME_Id,
            ISMS_Id: lastSearchParams.ISMS_Id,
            EYCES_MarksGradeEntryFlg: searchData.eyceS_MarksGradeEntryFlg,
            EYCES_SubSubjectFlg: searchData.eyceS_SubSubjectFlg,
            EYCES_SubExamFlg: searchData.eyceS_SubExamFlg,
            IVRMMAP_AddFlg: markCalculation,
            Pagename: "StaffPortal",
            orderflag: status
        };

        save.mutate(payload, {
            onSuccess: (res) => {
                if (res.data?.returnval) {
                    toast.success(status === 'V' ? "Marks Verified Successfully" : "Marks Saved Successfully");
                    // Refresh search data
                    handleSearch(lastSearchParams, markCalculation);
                } else {
                    toast.error("Failed to save marks");
                }
            },
            onError: () => {
                toast.error("An error occurred while saving marks");
            }
        });
    };

    const handleReset = () => {
        setSearchData(null);
        setLastSearchParams(null);
    };

    return (
        <div className="container mx-auto p-4 space-y-6 min-h-screen">
            <div className="flex items-center justify-between print:hidden">
                <h1 className="text-2xl font-bold tracking-tight text-primary">Marks Entry</h1>
            </div>

            <div className="print:hidden">
                <MarksEntryFilter
                    initialData={initialData}
                    isLoading={search.isPending}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    getClasses={async (id) => (await getClasses.mutateAsync(id)).data?.classlist ?? []}
                    getSections={async (y, c) => (await getSections.mutateAsync({ asmaY_Id: y, asmcL_Id: c })).data?.sectionlist ?? []}
                    getExams={async (y, c, s) => (await getExams.mutateAsync({ asmaY_Id: y, asmcL_Id: c, asmS_Id: s })).data?.examlist ?? []}
                    getSubjects={async (y, c, s, e) => (await getSubjects.mutateAsync({ asmaY_Id: y, asmcL_Id: c, asmS_Id: s, emE_Id: e })).data?.subjectlist ?? []}
                />
            </div>

            {searchData && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                            Student Marks Details
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {searchData.studentList.length} Students
                            </span>
                        </h2>
                    </div>
                    <MarksEntryTable
                        data={searchData}
                        onSave={handleSave}
                        onCancel={handleReset}
                    />
                </div>
            )}

            {!searchData && !search.isPending && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/5">
                    <p className="text-lg font-medium">Select selection criteria to manage marks</p>
                    <p className="text-sm">Academic Year, Class, Section, Exam and Subject are required.</p>
                </div>
            )}
        </div>
    );
}
