'use client';

import type { IMasterSponsor } from '@/types/sports/masters/sponsors';
import AddMasterSponsorForm from './add-form';

export default function UpdateMasterSponsorForm({
    selectedRow,
    onSuccess
}: {
    selectedRow: IMasterSponsor;
    onSuccess: () => void;
}) {
    return <AddMasterSponsorForm selectedRow={selectedRow} onSuccess={onSuccess} />;
}
