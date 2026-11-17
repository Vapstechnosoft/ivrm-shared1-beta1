import { getFeedbackTransactionLoadData } from './actions';
import FeedbackCollegeParentTransactionClient from './_components/feedback-college-parent-transaction-client';

export default async function FeedbackCollegeParentTransactionPage() {
    const initialData = await getFeedbackTransactionLoadData();

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <FeedbackCollegeParentTransactionClient initialData={initialData} />
        </div>
    );
}
