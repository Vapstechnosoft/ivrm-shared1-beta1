import { getCumulativeSubjectLoadData } from './actions';
import CumulativeSubjectClient from './_components/cumulative-subject-client';

export default async function CumulativeSubjectPage() {
    const initialData = await getCumulativeSubjectLoadData();

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <CumulativeSubjectClient initialData={initialData} />
        </div>
    );
}
