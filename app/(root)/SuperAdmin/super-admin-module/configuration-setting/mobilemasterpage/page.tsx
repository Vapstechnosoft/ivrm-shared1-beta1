'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
    deleteMobileMasterPage,
    getMobileMasterPageById,
    getMobileMasterPages
} from '@/server/super-admin/configuration-setting/mobilemasterpage';
import type { IMobileMasterPage } from '@/types/super-admin/configuration-setting/mobilemasterpage';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MobileMasterPageForm } from './_components/mobile-master-page-form';
import { MobileMasterPageGrid } from './_components/mobile-master-page-grid';

export default function MobileMasterPage() {
    const [data, setData] = useState<IMobileMasterPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState<IMobileMasterPage | null>(null);
    const [rowToDelete, setRowToDelete] = useState<IMobileMasterPage | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(
        async (page = 1, search = '') => {
            setLoading(true);
            try {
                const result = await getMobileMasterPages({
                    page: page,
                    page_size: pageSize,
                    search_query: search
                });
                if (result.success) {
                    setData(result.data);
                    setTotal(result.total ?? 0);
                    setCurrentPage(result.page ?? 1);
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        },
        [pageSize]
    );

    useEffect(() => {
        fetchData(currentPage, searchTerm);
    }, [fetchData, currentPage, searchTerm]);

    const handleEdit = async (row: IMobileMasterPage) => {
        try {
            const result = await getMobileMasterPageById(row.ivrmmaP_Id);
            if (result.success && result.data) {
                setSelectedRow(result.data);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to fetch record details for editing');
        }
    };

    const handleDeleteClick = (row: IMobileMasterPage) => {
        setRowToDelete(row);
    };

    const confirmDelete = async () => {
        if (!rowToDelete) return;

        setIsDeleting(true);
        try {
            const result = await deleteMobileMasterPage(rowToDelete.ivrmmaP_Id);
            if (result.success) {
                toast.success(result.message);
                fetchData(currentPage, searchTerm);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to delete record');
        } finally {
            setIsDeleting(false);
            setRowToDelete(null);
        }
    };

    const handleFormSuccess = () => {
        setSelectedRow(null);
        fetchData(currentPage, searchTerm);
    };

    const handleFormCancel = () => {
        setSelectedRow(null);
    };

    return (
        <div className='fade-in mx-auto flex max-w-7xl animate-in flex-col gap-8 p-6 duration-500'>
            {/* Form Section */}
            <section className='w-full'>
                <MobileMasterPageForm selectedRow={selectedRow} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
            </section>

            {/* Grid Section */}
            <section className='w-full'>
                {loading ? (
                    <div className='flex h-64 flex-col items-center justify-center rounded-xl border border-[#7C3AED]/10 bg-white/50 shadow-sm backdrop-blur-sm'>
                        <Loader2 className='mb-4 h-10 w-10 animate-spin text-[#7C3AED]' />
                        <p className='animate-pulse font-medium text-[#7C3AED]'>Loading amazing pages...</p>
                    </div>
                ) : (
                    <MobileMasterPageGrid
                        data={data}
                        total={total}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        searchTerm={searchTerm}
                        onSearchChange={(val: string) => {
                            setSearchTerm(val);
                            setCurrentPage(1);
                        }}
                        onPageChange={setCurrentPage}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                )}
            </section>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!rowToDelete} onOpenChange={(open) => !open && setRowToDelete(null)}>
                <AlertDialogContent className='border-[#7C3AED]/20 shadow-2xl'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='font-bold text-[#1E293B]'>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className='text-[#64748B]'>
                            This action cannot be undone. This will permanently delete the page{' '}
                            <span className='font-bold text-[#7C3AED]'>"{rowToDelete?.ivrmmaP_AppPageName}"</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='border-[#7C3AED] text-[#7C3AED] hover:bg-[#F3E8FF]'>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className='bg-red-500 text-white hover:bg-red-600'>
                            {isDeleting ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Deleting...
                                </>
                            ) : (
                                'Yes, Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
