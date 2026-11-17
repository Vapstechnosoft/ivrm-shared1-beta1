'use client';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { SalaryAdvanceEmployeeDropdownItem, SalaryAdvanceGridItem } from '@/types/hrms/salary-advance';
import { X } from 'lucide-react';
import AddSalaryAdvanceForm from './add-form';
import UpdateSalaryAdvanceForm from './update-form';

interface FormSectionsProps {
    employeeDropdown: SalaryAdvanceEmployeeDropdownItem[] | undefined;
    onSuccess: () => void;
}

export default function FormSections({ employeeDropdown, onSuccess }: FormSectionsProps) {
    const { isAddFormOpen, closeAddForm, addFormRef, isEditFormOpen, closeEditForm, editFormRef, selectedRow } = useFormContext<SalaryAdvanceGridItem>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Salary Advance'
                        description='Fill in the details below to add a new salary advance'
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
                            <AddSalaryAdvanceForm
                                employeeDropdown={employeeDropdown}
                                onSuccess={() => {
                                    closeAddForm();
                                    onSuccess();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Edit Form */}
            {isEditFormOpen && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Salary Advance'
                        description='Update the details below to edit the salary advance'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <UpdateSalaryAdvanceForm
                                selectedRow={selectedRow}
                                employeeDropdown={employeeDropdown}
                                onSuccess={() => {
                                    closeEditForm();
                                    onSuccess();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
