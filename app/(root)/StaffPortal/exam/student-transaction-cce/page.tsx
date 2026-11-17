
'use client';

import React, { useState } from 'react';
import { useStudentTransactionCCE } from '@/hooks/staff-portal/useStudentTransactionCCE';
import StudentTransactionFilter from './_components/student-transaction-filter';
import StudentTransactionList from './_components/student-transaction-list';
import { toast } from 'sonner';
import type {
    IStudentTransactionSearchRequest,
    IStudentTransactionSearchResponse,
    IStudentInfo,
    IStudentTransactionSaveRequest
} from '@/types/staff-portal/student-transaction-cce';
import { GraduationCap, List } from 'lucide-react';

export default function StudentTransactionCCEPage() {
    const {
        initialData,
        getClasses,
        getSections,
        getTermsOrExams,
        getSkillsOrActivities,
        getActivitiesAreas,
        getSkillsAreas,
        search,
        save
    } = useStudentTransactionCCE();

    const [searchData, setSearchData] = useState<IStudentTransactionSearchResponse | null>(null);
    const [lastParams, setLastParams] = useState<IStudentTransactionSearchRequest | null>(null);

    const handleSearch = (params: IStudentTransactionSearchRequest) => {
        setLastParams(params);
        search.mutate(params, {
            onSuccess: (res) => {
                if (res.data?.studentList && res.data.studentList.length > 0) {
                    setSearchData(res.data);
                } else {
                    toast.error("No student records found for the selected criteria");
                    setSearchData(null);
                }
            },
            onError: (err) => {
                toast.error("Error fetching student list: " + err);
            }
        });
    };

    const handleSave = async (students: IStudentInfo[], verifyFlag: 'S' | 'V') => {
        if (!lastParams) return;

        const SelectedStudentScore = students
            .filter(s => s.checked)
            .map(s => ({
                AMST_Id: s.amsT_Id,
                ECSACTT_Score: s.ECSACTT_Score || "",
                ECSA_Id: lastParams.Skills === 'Skills' ? (s.areaName || lastParams.ECSA_Id) : undefined,
                ECACTA_Id: lastParams.Skills === 'Activities' ? (s.areaName || lastParams.ECACTA_Id) : undefined,
                areaName: lastParams.Skills === 'Skills' ? (s.areaName || lastParams.ECSA_Id) : (s.areaName || lastParams.ECACTA_Id),
                EMGR_Id: s.emgR_Id,
                ECST_Id: s.ECST_Id,
                ECSACTT_Id: s.ECSACTT_Id
            }));

        if (SelectedStudentScore.length === 0) {
            toast.warning("Please select at least one student to save.");
            return;
        }

        const payload: IStudentTransactionSaveRequest = {
            ...lastParams,
            SelectedStudentScore,
            admno: verifyFlag
        };

        save.mutate(payload, {
            onSuccess: (res) => {
                if (res.data?.returnVal === 'saved') {
                    toast.success(verifyFlag === 'V' ? "Records Verified Successfully" : "Records Saved Successfully");
                    handleSearch(lastParams);
                } else {
                    toast.error(res.data?.returnVal || "Failed to save record");
                }
            },
            onError: (err) => {
                toast.error("An error occurred: " + err);
            }
        });
    };

    return (
        <div className="container mx-auto p-4 space-y-8 min-h-screen pb-12">
            <div className="flex items-center gap-3 border-b pb-4 border-primary/10">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Student Transaction CCE</h1>
                    <p className="text-sm text-muted-foreground">Manage student skills and activities assessments</p>
                </div>
            </div>

            <StudentTransactionFilter
                initialData={initialData}
                isLoading={search.isPending}
                onSearch={handleSearch}
                onReset={() => setSearchData(null)}
                getClasses={async (y, f) => {
                    const res = await getClasses.mutateAsync({ asmaY_Id: y, flag: f });
                    return res.data?.classList || [];
                }}
                getSections={async (y, c, f) => {
                    const res = await getSections.mutateAsync({ asmaY_Id: y, asmcL_Id: c, flag: f });
                    return res.data?.sectionList || [];
                }}
                getTermsOrExams={async (y, c, s, f) => {
                    const res = await getTermsOrExams.mutateAsync({ asmaY_Id: y, asmcL_Id: c, asmS_Id: s, flag: f });
                    return res.data || { examTerms: [], exammaster: [] };
                }}
                getSkillsOrActivities={async (sk, y, c, s, f) => {
                    const res = await getSkillsOrActivities.mutateAsync({ skills: sk, asmaY_Id: y, asmcL_Id: c, asmS_Id: s, flag: f });
                    return res.data || { skillsList: [], activitiesList: [] };
                }}
                getActivitiesAreas={async (d) => {
                    const res = await getActivitiesAreas.mutateAsync(d);
                    return res.data?.areasList || [];
                }}
                getSkillsAreas={async (d) => {
                    const res = await getSkillsAreas.mutateAsync(d);
                    return res.data?.areasList || [];
                }}
            />

            {searchData && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-semibold text-primary/80">Student List & Grades</h2>
                    </div>
                    <StudentTransactionList
                        data={searchData}
                        onSave={handleSave}
                        onCancel={() => setSearchData(null)}
                    />
                </div>
            )}

            {!searchData && !search.isPending && (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/5 border-primary/10 mx-auto max-w-2xl">
                    <div className="bg-muted/10 p-4 rounded-full mb-4">
                        <List className="h-10 w-10 opacity-20" />
                    </div>
                    <p className="text-xl font-medium text-foreground/70">No criteria selected</p>
                    <p className="text-sm">Please select a year, class, section, and assessment details to load the student list.</p>
                </div>
            )}
        </div>
    );
}
