import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return <Badge className='bg-yellow-500'>Pending</Badge>;
        case 'in-progress':
            return <Badge className='bg-blue-500'>In-Progress</Badge>;
        case 'approved':
            return <Badge className='bg-green-500'>Approved</Badge>;
        case 'rejected':
            return <Badge className='bg-red-500'>Rejected</Badge>;
        case 'cancelled':
            return <Badge className='bg-purple-500'>Cancelled</Badge>;
        case 'cancel_requested':
            return <Badge className='bg-orange-500'>Cancel Requested</Badge>;
        case 'requested':
            return <Badge className='bg-yellow-500'>Requested</Badge>;
        case 'active':
            return <Badge variant='success'>Active</Badge>;
        case 'inactive':
            return <Badge variant='destructive'>Inactive</Badge>;
        case 'yes':
            return <Badge variant='success'>Yes</Badge>;
        case 'no':
            return <Badge variant='destructive'>No</Badge>;
        default:
            return <Badge className='bg-gray-500'>{status}</Badge>;
    }
};
