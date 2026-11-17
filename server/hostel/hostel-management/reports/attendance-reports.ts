'use client';

import { api } from '@/lib/apiService';
import { format } from 'date-fns';

export async function getGatepassReportLoadData() {
    try {
        const res = await api.get('exam', '/Hostel_Student_Gatepass_Report/getloaddata');
        if (res.data) return res.data;
    } catch (error) {
        console.error('Error loading gatepass report data:', error);
    }
    return null;
}

export async function getGatepassReport(values: any) {
    try {
        const payload = {
            allflg: values.allFlg ? '1' : '0',
            AMST_Id: values.AMST_Id ? Number.parseInt(values.AMST_Id) : 0,
            frmdate: format(values.fromDate, 'yyyy-MM-dd'),
            todate: format(values.toDate, 'yyyy-MM-dd')
        };
        const res = await api.post('hostel', '/Hostel_Student_Gatepass_Report/getreport', payload);
        if (res.data) return res.data;
    } catch (error) {
        console.error('Error fetching gatepass report:', error);
    }
    return null;
}

export async function getInOutReportLoadData() {
    try {
        const res = await api.get('hostel', '/Hostel_Student_InOutReport/getalldetails');
        if (res.data) return res.data;
    } catch (error) {
        console.error('Error loading in/out report data:', error);
    }
    return null;
}

export async function getInOutReport(values: any) {
    try {
        const payload = {
            HLMH_Id: Number.parseInt(values.HLMH_Id),
            frmdate: format(values.fromDate, 'yyyy-MM-dd'),
            todate: format(values.toDate, 'yyyy-MM-dd')
        };
        const res = await api.post('hostel', '/Hostel_Student_InOutReport/get_report', payload);
        if (res.data) return res.data;
    } catch (error) {
        console.error('Error fetching in/out report:', error);
    }
    return null;
}
