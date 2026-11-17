// Refactored by automation script on 2025-10-28T15:40:35.957Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/job-post-list-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { type BaseEntity, createLocalCrud } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MRFPage from '../mrf/page';
interface MRF extends BaseEntity {
    department: string;
    position: string;
    priority: string;
    positionType: string;
    qualification: string;
    noOfPosition: number;
    age: string;
    gender: string;
    expFrom: number;
    expTo: number;
    payScaleFrom?: string;
    payScaleTo?: string;
    skill: string;
    jobDescription: string;
    locationType: 'HO' | 'Client' | 'Location';
    country: string;
    state: string;
    remark?: string;
    reason: string;
    tests: { written: boolean; online: boolean; technical: boolean };
    status: 'Pending' | 'Approved' | 'Rejected';
}
export default function JobPostListPage() {
    const [list, setList] = useState<MRF[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const mrfDB = createLocalCrud<MRF>('recruitment:mrf');
    useEffect(() => {
        setList(mrfDB.list());
        setIsLoading(false);
    }, []);
    const handleAdd = () => {
        setShowForm(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };
    const handleRefresh = () => setList(mrfDB.list());
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading title='HR Job Posting List' description='Browse, filter and manage published job posts' />
                    </div>
                    <Button
                        type='button'
                        onClick={handleAdd}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Job
                    </Button>
                </div>
                <CollapsibleSection
                    title='Job Posting List'
                    description='All job postings'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <JobPostTable
                        data={list}
                        isLoading={isLoading}
                        onEdit={() => setShowForm(true)}
                        onDelete={(m) => {
                            mrfDB.remove(m.id);
                            handleRefresh();
                        }}
                    />
                </CollapsibleSection>
                {showForm && (
                    <div ref={formRef}>
                        {/* Reuse the same MRF page (form + logic). Users can create or edit, stored in same local DB. */}
                        <MRFPage />
                    </div>
                )}
            </div>
        </div>
    );
}
interface TableProps {
    data: MRF[];
    isLoading: boolean;
    onEdit: (m: MRF) => void;
    onDelete: (m: MRF) => void;
}
function JobPostTable({ data, isLoading, onEdit, onDelete }: TableProps) {
    const columns: ColumnDef<MRF>[] = [
        {
            id: 'sl',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        { accessorKey: 'mrfNo', header: ({ column }) => <DataTableColumnHeader column={column} title='MRF No' /> },
        { accessorKey: 'position', header: ({ column }) => <DataTableColumnHeader column={column} title='Position' /> },
        { accessorKey: 'locationType', header: ({ column }) => <DataTableColumnHeader column={column} title='Location' /> },
        { accessorKey: 'priority', header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' /> },
        { accessorKey: 'noOfPosition', header: ({ column }) => <DataTableColumnHeader column={column} title='No.of Position' /> },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const map: Record<string, string> = {
                    Pending: 'bg-yellow-100 text-yellow-800',
                    Approved: 'bg-green-100 text-green-800',
                    Rejected: 'bg-red-100 text-red-800'
                };
                return <Badge className={map[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
            }
        },
        {
            id: 'action',
            header: 'Actions',
            cell: ({ row }) => {
                const m = row.original;
                return (
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='sm' onClick={() => onEdit(m)}>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button variant='outline' size='sm' className='text-red-600' onClick={() => onDelete(m)}>
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                );
            }
        }
    ];
    return <GenericDataTable isLoading={isLoading} columns={columns} data={data} totalItems={data.length} showViewOptions />;
}
