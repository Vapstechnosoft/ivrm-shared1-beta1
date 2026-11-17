import { getFeeDetailsLoadData } from './actions';
import FeeDetailsClient from './_components/fee-details-client';

export default async function FeeDetailsPage() {
    const initialData = await getFeeDetailsLoadData();

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <FeeDetailsClient initialData={initialData} />
        </div>
    );
}
