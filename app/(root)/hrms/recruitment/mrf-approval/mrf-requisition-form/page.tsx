// Refactored by automation script on 2025-10-28T15:40:35.912Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/mrfrequisition-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { type BaseEntity, createLocalCrud } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
interface MRF extends BaseEntity {
    requestedBy?: string;
    requestedDate?: string;
    department: string;
    position: string;
    priority: string;
    positionType: string;
    noOfPosition: number;
    locationType: 'HO' | 'Client' | 'Location';
    status: 'Pending' | 'Approved' | 'Rejected';
    qualification: string;
    age: string;
    gender: string;
    expFrom: number;
    expTo: number;
    skill: string;
    jobDescription: string;
    country: string;
    state: string;
    reason: string;
}
export default function MRFApprovalPage() {
    const [data, setData] = useState<MRF[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<MRF | null>(null);
    const [filters, setFilters] = useState({ department: '', position: '', priority: '', count: '', location: '' });
    const mrfDB = createLocalCrud<MRF>('recruitment:mrf');
    useEffect(() => {
        try {
            setData(mrfDB.list());
        } finally {
            setIsLoading(false);
        }
    }, []);
    const filtered = useMemo(() => {
        return data.filter(
            (m) =>
                (filters.department ? m.department.toLowerCase().includes(filters.department.toLowerCase()) : true) &&
                (filters.position ? m.position.toLowerCase().includes(filters.position.toLowerCase()) : true) &&
                (filters.priority ? m.priority.toLowerCase().includes(filters.priority.toLowerCase()) : true) &&
                (filters.count ? String(m.noOfPosition).includes(filters.count) : true) &&
                (filters.location ? m.locationType.toLowerCase().includes(filters.location.toLowerCase()) : true)
        );
    }, [data, filters]);
    const columns: ColumnDef<MRF>[] = [
        {
            id: 'sl',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO.' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        { accessorKey: 'requestedBy', header: ({ column }) => <DataTableColumnHeader column={column} title='Requested By' /> },
        { accessorKey: 'requestedDate', header: ({ column }) => <DataTableColumnHeader column={column} title='Requested Date' /> },
        { accessorKey: 'department', header: ({ column }) => <DataTableColumnHeader column={column} title='Department' /> },
        { accessorKey: 'position', header: ({ column }) => <DataTableColumnHeader column={column} title='Position' /> },
        { accessorKey: 'priority', header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' /> },
        { accessorKey: 'noOfPosition', header: ({ column }) => <DataTableColumnHeader column={column} title='No of Postion' /> },
        { accessorKey: 'locationType', header: ({ column }) => <DataTableColumnHeader column={column} title='Location' /> },
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
            header: 'Action',
            cell: ({ row }) => {
                const m = row.original as MRF;
                return (
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='sm' onClick={() => setSelected(m)}>
                            View
                        </Button>
                        {m.status === 'Pending' && (
                            <>
                                <Button variant='outline' size='sm' onClick={() => handleApprove(m)} className='text-green-700'>
                                    <Check className='h-4 w-4' />
                                </Button>
                                <Button variant='outline' size='sm' onClick={() => handleReject(m)} className='text-red-700'>
                                    <X className='h-4 w-4' />
                                </Button>
                            </>
                        )}
                    </div>
                );
            }
        }
    ];
    const handleApprove = (m: MRF) => {
        mrfDB.update(m.id, { ...m, status: 'Approved' });
        toast.success('MRF approved');
        setData(mrfDB.list());
    };
    const handleReject = (m: MRF) => {
        mrfDB.update(m.id, { ...m, status: 'Rejected' });
        toast.success('MRF rejected');
        setData(mrfDB.list());
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading title='MRF Approval - Manpower Requisition Form' description='Approve or reject manpower requisitions' />
                    </div>
                </div>
                <CollapsibleSection
                    title='MRF Requisition List'
                    description='Filter and review requisitions'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <div className='mb-3 grid grid-cols-1 gap-3 md:grid-cols-5'>
                        <InputText
                            placeholder='Search Department Name'
                            value={filters.department}
                            onChange={(e) => setFilters((s) => ({ ...s, department: e.target.value }))}
                        />
                        <InputText
                            placeholder='Search Position'
                            value={filters.position}
                            onChange={(e) => setFilters((s) => ({ ...s, position: e.target.value }))}
                        />
                        <InputText
                            placeholder='Search Priority'
                            value={filters.priority}
                            onChange={(e) => setFilters((s) => ({ ...s, priority: e.target.value }))}
                        />
                        <InputText
                            placeholder='Search No of position'
                            value={filters.count}
                            onChange={(e) => setFilters((s) => ({ ...s, count: e.target.value }))}
                        />
                        <InputText
                            placeholder='Search Location'
                            value={filters.location}
                            onChange={(e) => setFilters((s) => ({ ...s, location: e.target.value }))}
                        />
                    </div>
                    <GenericDataTable
                        isLoading={isLoading}
                        columns={columns}
                        data={filtered}
                        totalItems={filtered.length}
                        showViewOptions
                    />
                </CollapsibleSection>
                <CollapsibleSection
                    title='MRF Requisition Detail'
                    description={selected ? selected.position : 'Select a record to view details'}
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    {selected ? (
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Job Required</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            <strong>Position:</strong> {selected.position}
                                        </div>
                                        <div>
                                            <strong>Department:</strong> {selected.department}
                                        </div>
                                        <div>
                                            <strong>Location:</strong> {selected.locationType}
                                        </div>
                                        <div>
                                            <strong>Priority:</strong> {selected.priority}
                                        </div>
                                        <div>
                                            <strong>No. of Position:</strong> {selected.noOfPosition}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Job Requirement</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            <strong>Skills:</strong> {selected.skill}
                                        </div>
                                        <div>
                                            <strong>Qualification:</strong> {selected.qualification}
                                        </div>
                                        <div>
                                            <strong>Gender:</strong> {selected.gender}
                                        </div>
                                        <div>
                                            <strong>Experience:</strong> {selected.expFrom} - {selected.expTo} years
                                        </div>
                                        <div>
                                            <strong>Age:</strong> {selected.age}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className='md:col-span-2'>
                                <CardHeader>
                                    <CardTitle>Additional Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            <strong>Country/State:</strong> {selected.country} / {selected.state}
                                        </div>
                                        <div>
                                            <strong>Reason:</strong> {selected.reason}
                                        </div>
                                        <div>
                                            <strong>Job Description:</strong> {selected.jobDescription}
                                        </div>
                                        <div>
                                            <strong>Status:</strong> {selected.status}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className='text-muted-foreground text-sm'>No record selected.</div>
                    )}
                </CollapsibleSection>
            </div>
        </div>
    );
}
