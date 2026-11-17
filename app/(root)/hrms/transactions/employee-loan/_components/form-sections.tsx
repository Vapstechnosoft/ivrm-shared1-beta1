'use client';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { EmployeeLoanMastersResponse } from '@/types/hrms/employee-loan';
import { X } from 'lucide-react';
import AddEmployeeLoanForm from './add-form';
import UpdateEmployeeLoanForm from './update-form';
interface FormSectionsProps {
    onloadData: EmployeeLoanMastersResponse | undefined;
    onSuccess: () => void;
}
export default function FormSections({ onloadData, onSuccess }: FormSectionsProps) {
    const { isAddFormOpen, closeAddForm, addFormRef, isEditFormOpen, closeEditForm, editFormRef, selectedRow } = useFormContext();
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Employee Loan'
                        description='Fill in the details below to add a new employee loan'
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
                            <AddEmployeeLoanForm
                                onloadData={onloadData}
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
                        title='Edit Employee Loan'
                        description='Update the details below to edit the employee loan'
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
                            <UpdateEmployeeLoanForm
                                selectedRow={selectedRow}
                                onloadData={onloadData}
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
