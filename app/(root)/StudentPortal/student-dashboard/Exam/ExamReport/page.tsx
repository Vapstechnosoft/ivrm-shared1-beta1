import { getExamReportLoadData } from './actions';
import ExamReportClient from './_components/exam-report-client';

export default async function ExamReportPage() {
    const initialData = await getExamReportLoadData();

    if (!initialData) {
        return <div>Error loading data</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <ExamReportClient
                initialYears={initialData.studetiallist || []}
                rcode={initialData.rcode}
            />
        </div>
    );
}
