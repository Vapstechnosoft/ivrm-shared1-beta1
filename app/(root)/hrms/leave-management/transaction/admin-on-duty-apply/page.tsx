'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import {
    useAdminOnDutyApplyList,
    useDeleteLeaveById,
    useToggleOnDutyStatus
} from '@/hooks/hrms/leave-management/useAdminOnDutyApply';
import { tableSearchVariables } from '@/lib/data-table.config';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';
import ApplyLeaveForm from './_components/apply-leave-form';
import { getAdminOnDutyApplyColumns } from './_components/columns';
import { ViewLeaveDetailsDialog } from './_components/view-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ClipboardList, PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function AdminOnDutyApplyPage() {
    const [page] = useQueryState(tableSearchVariables.page, parseAsInteger.withDefault(1));
    const [pageSize] = useQueryState(tableSearchVariables.page_size, parseAsInteger.withDefault(10));
    const [searchQuery] = useQueryState(tableSearchVariables.search, parseAsString.withDefault(''));
    const [sortColumn] = useQueryState(tableSearchVariables.sort_column, parseAsString.withDefault(''));
    const [sortDirection] = useQueryState(tableSearchVariables.sort_direction, parseAsString.withDefault(''));

    const {
        data: adminOnDutyList,
        isLoading,
        error,
        refetchAll
    } = useAdminOnDutyApplyList({
        page,
        pageSize,
        searchQuery,
        sortColumn,
        sortDirection
    });


    const [viewLeaveId, setViewLeaveId] = useState<number | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const { mutate: deleteLeave } = useDeleteLeaveById();
    const { mutate: toggleStatus } = useToggleOnDutyStatus();

    const tableProps = useDataTableProps(adminOnDutyList);

    const columns = getAdminOnDutyApplyColumns({
        onView: (id) => {
            setViewLeaveId(id);
            setIsViewOpen(true);
        },
        onDelete: (id) => {
            if (confirm('Are you sure you want to delete this leave request?')) {
                deleteLeave(id);
            }
        },
        onToggle: (id) => {
            toggleStatus(id);
        }
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className='min-h-screen'>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className='container space-y-4 p-1'
            >
                <div className='flex flex-col gap-8'>
                    {/* List Section */}
                    <motion.div variants={itemVariants} className='w-full'>
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center justify-between px-1'>
                                <div className='flex items-center gap-2'>
                                </div>
                                <div className='flex items-center gap-4'>
                                    {adminOnDutyList?.total !== undefined && (
                                        <span className='text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full uppercase'>
                                            {adminOnDutyList.total} RECORDS
                                        </span>
                                    )}
                                    <Button
                                        variant={showForm ? 'outline' : 'default'}
                                        size='sm'
                                        onClick={() => setShowForm(!showForm)}
                                        className='flex items-center gap-2 shadow-md hover:shadow-lg transition-all'
                                    >
                                        <PlusCircle className={`h-4 w-4 transition-transform ${showForm ? 'rotate-45' : ''}`} />
                                        {showForm ? 'Close Form' : 'Add New Application'}
                                    </Button>
                                </div>
                            </div>

                            <div className='rounded-xl border border-muted-foreground/10 bg-background shadow-sm overflow-hidden'>
                                <GenericDataTable
                                    columns={columns}
                                    isLoading={isLoading}
                                    data={adminOnDutyList?.data || []}
                                    totalItems={adminOnDutyList?.total || 0}
                                    success={adminOnDutyList?.success}
                                    errorMessage={adminOnDutyList?.message}
                                    loadingMessage='Loading leave applications...'
                                    noDataTitle='No leave applications found'
                                    noDataDescription='New applications will appear here once submitted.'
                                    error={error}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Section */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className='w-full'
                            >
                                <div className='flex flex-col gap-4 border-t pt-8'>
                                    <ApplyLeaveForm
                                        onSuccess={() => {
                                            refetchAll();
                                            setShowForm(false);
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <ViewLeaveDetailsDialog
                    leaveId={viewLeaveId}
                    open={isViewOpen}
                    onOpenChange={setIsViewOpen}
                />
            </motion.div>
        </div>
    );
}
