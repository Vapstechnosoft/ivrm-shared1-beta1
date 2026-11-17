import { getStudentComplaintsLoadData } from './actions';
import StudentComplaintsViewClient from './_components/student-complaints-view';

export default async function StudentComplaintsPage() {
    const loadData = await getStudentComplaintsLoadData();

    return (
        <div className='w-full p-4'>
            <StudentComplaintsViewClient
                initialYears={loadData.yearlist}
                initialData={loadData.studentdivlist}
                initialYearId={loadData.asmaY_Id}
            />
        </div>
    );
}
