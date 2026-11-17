import { getFeeOnlinePaymentLoadData } from './actions';
import FeeOnlinePaymentClient from './_components/fee-online-payment-client';

export default async function FeeOnlinePaymentPage() {
    const response = await getFeeOnlinePaymentLoadData({});
    // In real app, might need to pass params or fetch session data here

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <FeeOnlinePaymentClient initialData={response.data} />
        </div>
    );
}
