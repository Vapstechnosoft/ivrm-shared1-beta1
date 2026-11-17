
'use server';

import { api } from '@/lib/apiService';
import { IInvRItemConsumptionPayload, IInvRItemConsumptionReportData } from '@/types/inventory/reports/inv-r-item-consumption';

// MOCK DATA

const MOCK_ITEMS = [
    { invmI_Id: 101, invmI_ItemName: 'A4 Paper', invmI_ItemCode: 'PAP001' },
    { invmI_Id: 102, invmI_ItemName: 'Marker Pen', invmI_ItemCode: 'MAR002' },
];

const MOCK_STAFF = [
    { hrmE_Id: 201, employeename: 'Alice Teacher', hrmE_EmployeeCode: 'TC001' },
    { hrmE_Id: 202, employeename: 'Bob Admin', hrmE_EmployeeCode: 'AD002' },
];

const MOCK_DEPARTMENTS = [
    { hrmD_Id: 301, hrmD_DepartmentName: 'Science Dept' },
    { hrmD_Id: 302, hrmD_DepartmentName: 'Admin Dept' },
];

const MOCK_STUDENTS = [
    { amsT_Id: 401, studentname: 'Charlie Student', amsT_AdmNo: 'ST001' },
    { amsT_Id: 402, studentname: 'David Student', amsT_AdmNo: 'ST002' },
];

const MOCK_REPORT_DATA_ALL: IInvRItemConsumptionReportData[] = [
    { invmI_ItemName: 'A4 Paper', invmUOM_UOMName: 'Ream', invmiC_ICDate: '2023-11-01', invtiC_ICQty: 5, invtiC_Naration: 'Exam Printing' },
    { invmI_ItemName: 'Marker Pen', invmUOM_UOMName: 'Box', invmiC_ICDate: '2023-11-05', invtiC_ICQty: 2, invtiC_Naration: 'Classroom Use' },
];

const MOCK_REPORT_DATA_OVERALL_ITEM: IInvRItemConsumptionReportData[] = [
    { invmI_ItemName: 'A4 Paper', invmI_ItemCode: 'PAP001', icQty: 50 },
    { invmI_ItemName: 'Marker Pen', invmI_ItemCode: 'MAR002', icQty: 20 },
];


export async function getInvRItemConsumptionLoadData(optionflag: string) {
    try {
        let data: any[] = [];



        if (optionflag === 'Item') {
            const response = await api.get<any>('inventory', `/INV_ItemConsumptionReportFacade/getloaddata?optionflag=${optionflag}`);
            let rawData = response.data;
            if (rawData && rawData.$values) rawData = rawData.$values;
            if (!Array.isArray(rawData)) rawData = [];

            data = rawData.map((item: any) => ({
                invmI_Id: item.id,
                invmI_ItemName: item.name,
                invmI_ItemCode: item.code,
                ...item
            }));
        }
        else if (optionflag === 'Staff') {
            const response = await api.get<any>('inventory', `/INV_ItemConsumptionReportFacade/getloaddata?optionflag=${optionflag}`);
            let rawData = response.data;
            if (rawData && rawData.$values) rawData = rawData.$values;
            if (!Array.isArray(rawData)) rawData = [];

            data = rawData.map((item: any) => ({
                hrmE_Id: item.id,
                employeename: item.name,
                hrmE_EmployeeCode: item.code,
                ...item
            }));
        }
        else if (optionflag === 'Department') {
            const response = await api.get<any>('inventory', `/INV_ItemConsumptionReportFacade/getloaddata?optionflag=${optionflag}`);
            let rawData = response.data;
            if (rawData && rawData.$values) rawData = rawData.$values;
            if (!Array.isArray(rawData)) rawData = [];

            data = rawData.map((item: any) => ({
                hrmD_Id: item.id,
                hrmD_DepartmentName: item.name,
                ...item
            }));
        }
        else if (optionflag === 'Student') {
            const response = await api.get<any>('inventory', `/INV_ItemConsumptionReportFacade/getloaddata?optionflag=${optionflag}`);
            let rawData = response.data;
            if (rawData && rawData.$values) rawData = rawData.$values;
            if (!Array.isArray(rawData)) rawData = [];

            data = rawData.map((item: any) => ({
                amsT_Id: item.id,
                studentname: item.name,
                amsT_AdmNo: item.code, // Assuming code maps to Admission No for student if present
                ...item
            }));
        }
        else {
            data = [];
        }

        return {
            success: true,
            data: {
                get_ICreportdetails: data
            }
        };
    } catch (error) {
        console.error("Error fetching load data:", error);
        return {
            success: false,
            data: {
                get_ICreportdetails: []
            }
        };
    }
}

import { getSearchParamsUrl } from '@/lib/apiService';

export async function getInvRItemConsumptionReport(payload: IInvRItemConsumptionPayload, searchParams?: any) {
    try {
        const { invmI_Id, ...restPayload } = payload;
        const formattedPayload = {
            ...restPayload,
            startdate: payload.bw_dates && payload.startdate ? new Date(payload.startdate).toISOString() : null,
            enddate: payload.bw_dates && payload.enddate ? new Date(payload.enddate).toISOString() : null,
            hrmD_Id: payload.hrmD_Id,
            staffarray: payload.staffarray || (payload as any).staffArray || [],
            INVMI_Id: payload.optionflag === 'Item' && invmI_Id ? String(invmI_Id) : "",
        };

        const params: any = {
            ...searchParams
        };

        const urlParams = getSearchParamsUrl(params);
        // Append query params to URL 
        const url = `/INV_ItemConsumptionReportFacade/onreport?${urlParams}`;

        const response = await api.post<any>('inventory', url, formattedPayload);

        // Based on user provided response: { data: [...], total: 58, ... }
        // api.post might return the body directly.
        let reportData = response.data;
        if (reportData && reportData.$values) reportData = reportData.$values;
        if (!Array.isArray(reportData)) reportData = [];

        return {
            success: true,
            data: {
                get_ICReport: reportData
            },
            total: response.total || reportData.length,
            message: 'Report generated successfully'
        };
    } catch (error: any) {
        console.error("Error generating report:", error);
        return {
            success: false,
            data: {
                get_ICReport: []
            },
            total: 0,
            message: error.message || 'Failed to generate report'
        };
    }
}
