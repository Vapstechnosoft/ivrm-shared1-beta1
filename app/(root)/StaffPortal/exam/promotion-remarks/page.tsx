'use client';

import React, { useState } from 'react';
import { usePromotionRemarks } from '@/hooks/staff-portal/usePromotionRemarks';
import PromotionRemarksFilter from './_components/promotion-remarks-filter';
import PromotionRemarksGrid from './_components/promotion-remarks-grid';
import type { IStudentPromotion } from '@/types/staff-portal/promotion-remarks';

export default function PromotionRemarksPage() {
    const {
        initialData,
        isLoadingInitial,
        getClasses,
        getSections,
        searchStudent,
        saveDetails
    } = usePromotionRemarks();

    const [students, setStudents] = useState<IStudentPromotion[]>([]);
    const [filterData, setFilterData] = useState<{ ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number } | null>(null);

    if (isLoadingInitial) return <div className="p-8 text-center">Loading...</div>;

    const handleSearch = async (data: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number }) => {
        setFilterData(data);
        try {
            // Legacy Logic: examtype = 1, EME_Id = 0 for promotion exam
            const payload = { ...data, EME_Id: 0, examtype: 1 };
            const res = await searchStudent.mutateAsync(payload);

            const rawStudents = res.data?.getstudentdetails || [];
            const marks = res.data?.getstudentmarks || [];
            const saved = res.data?.getsavedetails || [];

            // Merge logic from legacy controller
            const merged = rawStudents.map(s => {
                const studentMarks = marks.find(m => m.amsT_Id === s.amsT_Id);
                const savedDetail = saved.find(sd => sd.amsT_Id === s.amsT_Id);

                return {
                    ...s,
                    checkedvalue: !!savedDetail,
                    obtainedmarks: studentMarks?.estmpP_TotalObtMarks,
                    totalmaxmarks: studentMarks?.estmpP_TotalMaxMarks,
                    percentage: studentMarks?.estmpP_Percentage,

                    eprD_PromotionName: savedDetail?.eprD_PromotionName || '',
                    eprD_Remarks: savedDetail?.eprD_Remarks || '',
                    eprD_ClassPromoted: savedDetail?.eprD_ClassPromoted || '',
                    eprD_Id: savedDetail?.eprD_Id || 0
                };
            });

            setStudents(merged);
        } catch (e) {
            console.error(e);
            setStudents([]);
        }
    };

    const handleSave = async (data: any) => {
        await saveDetails.mutateAsync(data);
        if (filterData) {
            handleSearch(filterData); // Reload data
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <PromotionRemarksFilter
                initialData={initialData}
                getClasses={async (d) => (await getClasses.mutateAsync(d)).data || { getclass: [] }}
                getSections={async (d) => (await getSections.mutateAsync(d)).data || { getsection: [] }}
                onSearch={handleSearch}
                onReset={() => { setStudents([]); setFilterData(null); }}
                isLoading={searchStudent.isPending}
            />

            {(students.length > 0) && (
                <PromotionRemarksGrid
                    studentList={students}
                    onSave={handleSave}
                    filterData={filterData!}
                />
            )}
        </div>
    );
}
