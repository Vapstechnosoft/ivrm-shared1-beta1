'use server';

import { api } from '@/lib/apiService';
import { format } from 'date-fns';

export async function getRequestReport(values: any) {
    try {
        const payload = {
            type: values.type,
            frmdate: format(new Date(values.fromDate), 'yyyy-MM-dd'),
            todate: format(new Date(values.toDate), 'yyyy-MM-dd')
        };
        const res = await api.post('default', 'Hostel_Request_Report/getreport', payload);
        if (res.data) return res.data;
        return { grid_list: [] };
    } catch (error) {
        console.error('Error fetching request report:', error);
        return { grid_list: [] };
    }
}
