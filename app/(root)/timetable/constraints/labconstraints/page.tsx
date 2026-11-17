import { getLabConstraintsDetails } from '@/server/timetable/constraints/labconstraints';
import LabConstraints from './_components/lab-constraints';

export default async function LabConstraintsPage() {
    let initialData = null;
    try {
        initialData = await getLabConstraintsDetails();
    } catch (error: any) {
        initialData = {
            success: false,
            message: error?.message || 'Failed to load details',
            labconstraintslist: []
        };
    }

    return <LabConstraints initialData={initialData} />;
}
