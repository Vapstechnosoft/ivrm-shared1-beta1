'use client';

import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { deleteLabConstraintsDetail, getLabConstraintsDetails } from '@/server/timetable/constraints/labconstraints';
import { Plus, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import LabConstraintsForm from './lab-constraints-form';
import LabConstraintsList from './lab-constraints-list';
import LabConstraintsToggleForm from './lab-constraints-toggle-form';

interface LabConstraintsProps {
    initialData: any;
}

export default function LabConstraints({ initialData }: LabConstraintsProps) {
    const [data, setData] = useState(initialData);

    const handleSuccess = useCallback(async () => {
        try {
            const newData = await getLabConstraintsDetails();
            setData(newData);
        } catch (error) {
            console.error('Failed to refresh data', error);
        }
    }, []);

    const handleToggle = async (formData: any) => {
        const res = await deleteLabConstraintsDetail(formData.ttlaB_Id);
        if (res.returnval === true) {
            handleSuccess();
            return { success: true };
        } else {
            return { success: false, message: 'Failed to toggle' };
        }
    };

    return (
        <FormProvider>
            <LabConstraintsContent initialData={data} onSuccess={handleSuccess} onToggle={handleToggle} />
        </FormProvider>
    );
}

function LabConstraintsContent({
    initialData,
    onSuccess,
    onToggle
}: {
    initialData: any;
    onSuccess: () => void;
    onToggle: (data: any) => Promise<any>;
}) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        isDeleteFormOpen,
        selectedRow,
        openAddForm,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        closeDeleteForm
    } = useFormContext();

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit bg-orange-500 shadow-md transition-all duration-200 hover:scale-105 hover:bg-orange-600 hover:shadow-lg'>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Lab Constraint
                    </Button>
                </div>

                <LabConstraintsList data={initialData?.labconstraintslist || []} />

                {/* Form Sections */}
                {isAddFormOpen && (
                    <CollapsibleSection
                        title='Add New Lab Constraint'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <LabConstraintsForm
                                initialData={initialData}
                                onSuccess={() => {
                                    onSuccess();
                                    closeAddForm();
                                }}
                                onCancel={closeAddForm}
                            />
                        </div>
                    </CollapsibleSection>
                )}

                {isEditFormOpen && selectedRow && (
                    <CollapsibleSection
                        title='Edit Lab Constraint'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in border-primary/20 shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <LabConstraintsForm
                                initialData={initialData}
                                editData={[selectedRow]}
                                onSuccess={() => {
                                    onSuccess();
                                    closeEditForm();
                                }}
                                onCancel={closeEditForm}
                            />
                        </div>
                    </CollapsibleSection>
                )}

                {(isToggleFormOpen || isDeleteFormOpen) && (
                    <LabConstraintsToggleForm
                        isOpen={isToggleFormOpen || isDeleteFormOpen}
                        onClose={() => {
                            closeToggleForm();
                            closeDeleteForm();
                        }}
                        onConfirm={async () => {
                            await onToggle(selectedRow);
                            closeToggleForm();
                            closeDeleteForm();
                        }}
                        data={selectedRow}
                        message={isToggleFormOpen ? (selectedRow?.ttlaB_ActiveFlag ? 'Deactivate' : 'Activate') : 'Delete'}
                    />
                )}
            </div>
        </div>
    );
}
