'use client';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { createLocalCrud } from '@/lib/localdb';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { type CompOffApproval, getCompOffApprovalColumns } from './_components/columns';
const compOffDB = createLocalCrud<CompOffApproval>('compOffApproval');
export default function CompOffApprovalPage() {
    const [data, setData] = useState<CompOffApproval[]>([]);
    const loadData = () => {
        setData(compOffDB.list());
    };
    useEffect(() => {
        loadData();
    }, []);
    const handleApprove = (row: CompOffApproval) => {
        compOffDB.update(row.id, { hrStatus: 'Approved' });
        toast.success('Approved');
        loadData();
    };
    const handleReject = (row: CompOffApproval) => {
        compOffDB.update(row.id, { hrStatus: 'Rejected' });
        toast.success('Rejected');
        loadData();
    };
    const columns = useMemo(
        () => getCompOffApprovalColumns({ onApprove: handleApprove, onReject: handleReject }),
        [handleApprove, handleReject]
    );
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Comp Off Approval'
                    description=''
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    {data.length === 0 ? (
                        <div className='py-10 text-center text-muted-foreground text-sm'>No Approvals Pending</div>
                    ) : (
                        <GenericDataTable data={data} columns={columns} totalItems={data.length} isLoading={false} />
                    )}
                </CollapsibleSection>
            </div>
        </div>
    );
}
