import PortalFeeReceiptClient from './_components/portal-fee-receipt-client';
import { getPortalFeeReceiptLoadData } from './actions';

export default async function PortalFeeReceiptPage() {
    const loadData = await getPortalFeeReceiptLoadData();

    return (
        <div className='w-full'>
            <h1 className='mb-4 font-bold text-2xl'>Portal Fee Receipt</h1>
            <PortalFeeReceiptClient initialYears={loadData.yearlist} />
        </div>
    );
}
