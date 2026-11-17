import FeeOnlinePaymentClient from './_components/fee-online-payment-client';
import { getFeeOnlinePaymentLoadData } from './actions';

export default async function FeeOnlinePaymentPage() {
    const response = await getFeeOnlinePaymentLoadData({
        configset: 'G'
    });

    return (
        <div className='container mx-auto space-y-6 p-6'>
            <FeeOnlinePaymentClient initialData={response} />
        </div>
    );
}
