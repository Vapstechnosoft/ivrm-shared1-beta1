import { getConsecutiveConstraintsDetails } from '@/server/timetable/constraints/consecutive';
import ConsecutiveConstraints from './_components/consecutive-constraints';

export default async function ConsecutiveConstraintsPage() {
    let initialData = null;
    try {
        initialData = await getConsecutiveConstraintsDetails();
    } catch (error: any) {
        console.error('Failed to load consecutive constraints:', error);
        initialData = {
            success: false,
            message: error?.message || 'Failed to load consecutive constraints',
            consecutivelst: []
        };
    }

    return <ConsecutiveConstraints initialData={initialData} />;
}
