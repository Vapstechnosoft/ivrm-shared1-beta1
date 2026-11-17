'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { createLocalCrud } from '@/lib/localdb';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { type LeaveYear, getLeaveYearColumns } from './_components/columns';
import { LeaveYearForm } from './_components/leave-year-form';
const leaveYearDB = createLocalCrud<LeaveYear>('leaveYear');
export default function MasterLeaveYearPage() {
    const [data, setData] = useState<LeaveYear[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLeaveYear, setEditingLeaveYear] = useState<LeaveYear | null>(null);
    const loadData = () => {
        try {
            const result = leaveYearDB.list();
            setData(result);
        } catch (_error) {
            toast.error('Failed to load leave years');
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    const handleAddClick = () => {
        setIsFormOpen(true);
        setEditingLeaveYear(null);
        // Scroll to form
        setTimeout(() => {
            const formElement = document.getElementById('leave-year-form');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingLeaveYear(null);
    };
    const handleFormSubmit = (formData: LeaveYear) => {
        try {
            if (editingLeaveYear) {
                leaveYearDB.update(editingLeaveYear.id, formData);
                toast.success('Leave year updated successfully');
            } else {
                leaveYearDB.create(formData);
                toast.success('Leave year created successfully');
            }
            loadData();
            handleFormClose();
        } catch (_error) {
            toast.error('Failed to save leave year');
        }
    };
    const handleEdit = (leaveYear: LeaveYear) => {
        setEditingLeaveYear(leaveYear);
        setIsFormOpen(true);
        // Scroll to form
        setTimeout(() => {
            const formElement = document.getElementById('leave-year-form');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };
    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this leave year?')) {
            try {
                leaveYearDB.remove(id);
                toast.success('Leave year deleted successfully');
                loadData();
            } catch (_error) {
                toast.error('Failed to delete leave year');
            }
        }
    };
    const columns = useMemo(() => getLeaveYearColumns({ onEdit: handleEdit, onDelete: handleDelete }), [handleEdit, handleDelete]);
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex justify-end'>
                    <Button onClick={handleAddClick} variant='default' className='w-fit'>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Leave Year
                    </Button>
                </div>
                {/* Table Section */}
                <CollapsibleSection
                    title='Master Leave Year Details'
                    description=''
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable data={data} columns={columns} totalItems={data.length} isLoading={false} />
                </CollapsibleSection>
                {/* Form Section */}
                {isFormOpen && (
                    <div id='leave-year-form'>
                        <CollapsibleSection
                            title={editingLeaveYear ? 'Edit Leave Year' : 'Add Leave Year'}
                            description=''
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <LeaveYearForm editingLeaveYear={editingLeaveYear} onSubmit={handleFormSubmit} onCancel={handleFormClose} />
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </div>
    );
}
