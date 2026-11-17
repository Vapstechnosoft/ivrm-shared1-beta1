'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { IEligibilityCertificateReportDetail } from '@/types/sports/reports/eligibility-certificate-report';

export const columns: ColumnDef<IEligibilityCertificateReportDetail>[] = [
    {
        accessorKey: 'adm_no',
        header: 'Adm. No.',
    },
    {
        accessorKey: 'studentname',
        header: 'Student Name',
    },
    {
        accessorKey: 'classname',
        header: 'Class',
    },
    {
        accessorKey: 'sectionname',
        header: 'Section',
    },
    {
        accessorKey: 'fatherName',
        header: 'Father Name',
    },
    {
        accessorKey: 'motherName',
        header: 'Mother Name',
    },
];
