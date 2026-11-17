'use client';

import type { IMasterDivision } from '@/types/sports/masters/division';
import AddMasterDivisionForm from './add-form';

export default function UpdateMasterDivisionForm({
    selectedRow,
    onSuccess
}: {
    selectedRow: IMasterDivision;
    onSuccess: () => void;
}) {
    return <AddMasterDivisionForm selectedRow={selectedRow} onSuccess={onSuccess} />;
}
