'use client';

import React, { useState } from 'react';
import { useClassWork } from '@/hooks/staff-portal/useClasswork';
import ClassWorkForm from './_components/classwork-form';
import ClassWorkGrid from './_components/classwork-grid';
import { IClassWork } from '@/types/staff-portal/classwork.d';

export default function ClassWorkUploadPage() {
    const {
        initialData,
        isLoadingInitial,
        getClasses,
        getSections,
        getSubjects,
        saveClassWork,
        editClassWork,
        deactivateClassWork,
        viewClassWork
    } = useClassWork();

    const [editingItem, setEditingItem] = useState<apiResponse | null>(null);

    if (isLoadingInitial) return <div className="p-8 text-center">Loading...</div>;

    const handleSave = async (data: any) => {
        await saveClassWork.mutateAsync(data);
        setEditingItem(null);
    };

    const handleEdit = async (item: IClassWork) => {
        try {
            // Fetch edit data details
            const res = await editClassWork.mutateAsync({ ICW_Id: item.icW_Id, ASMAY_Id: item.asmaY_Id });
            // If needed, transform res to form-compatible struct or pass directly
            // For simplicity, we might just pass `item` and let form fetch details or populate basic fields.
            // But usually we need the fetched edit details like attachments.
            // Let's assume we pass the item to trigger "Edit Mode" and maybe fetch inside form or use the response here.

            // To properly populate the form's Cascaded Selects, we might need to set them.
            // The Form component handles its own state, so passing `editData` prop which it consumes `useEffect` can work.
            if (res.data?.editlist && res.data.editlist.length > 0) {
                setEditingItem(res.data.editlist[0]);
                // Note: Ideally we pass the whole response to handle attachments etc.
                // For now, let's just use the item from grid and minimal edit fetch data or refetch in form.
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <ClassWorkForm
                initialData={initialData || undefined}
                onSave={handleSave}
                onCancel={() => setEditingItem(null)}
                getClasses={async (d) => (await getClasses.mutateAsync(d)).data || { classlist: [], class_gridlist: [] }}
                getSections={async (d) => (await getSections.mutateAsync(d)).data || { sectionlist: [] }}
                getSubjects={async (d) => (await getSubjects.mutateAsync(d)).data || { subjectlist: [] }}
                editData={editingItem}
                hrmE_Id={initialData?.hrmE_Id}
            />

            <ClassWorkGrid
                data={initialData?.classwork || []}
                onEdit={handleEdit}
                onDeactivate={(id, active) => deactivateClassWork.mutate({ ICW_Id: id, icW_ActiveFlag: active })}
                onView={async (id, year) => (await viewClassWork.mutateAsync({ ICW_Id: id, ASMAY_Id: year })).data || { attachementlist: [] }}
            />
        </div>
    );
}

// Helper types if needed (or meaningful any)
type apiResponse = any;
