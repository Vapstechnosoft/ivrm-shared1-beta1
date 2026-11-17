'use server';

import { api } from '@/lib/apiService';
import { IInvRMonthEndReportPayload, IInvRMonthEndReportData } from '@/types/inventory/reports/inv-r-month-end-report';

export async function getInvRMonthEndReportLoadData() {
    try {
        const pageid = 2; // From angular code "var pageid = 2;"

        // Fetch months from new API
        const loadMonthPromise = api.get<any>('inventory', `/INV_MonthEndReportFacade/loadmonth`);
        // Fetch academic years from new API
        const academicYearPromise = api.get<any>('inventory', `/INV_MonthEndReportFacade/loadacademicyear`);

        const results = await Promise.allSettled([loadMonthPromise, academicYearPromise]);

        const loadMonthResult = results[0];
        const academicYearResult = results[1];

        // Process Month Data
        let month_array: any[] = [];
        if (loadMonthResult.status === 'fulfilled') {
            const res = loadMonthResult.value;
            console.log("Month Raw Res:", JSON.stringify(res, null, 2));

            let body = res?.data || res;

            // Check for various structures for month array
            if (body && Array.isArray(body.data)) {
                month_array = body.data;
            } else if (Array.isArray(body)) {
                month_array = body;
            } else if (body && Array.isArray(body.month_array)) {
                month_array = body.month_array;
            } else {
                console.warn("Could not find month array in response");
            }
        } else {
            console.error("Month API failed:", loadMonthResult.reason);
        }

        // Process Academic Year Data
        let acayear: any[] = [];
        if (academicYearResult.status === 'fulfilled') {
            const res = academicYearResult.value;
            console.log("Academic Year Raw Res:", JSON.stringify(res, null, 2));

            // Logic to extract array from various possible wrapper levels:
            // 1. res.data.data (Axios wrapper -> Body -> Data Array)
            // 2. res.data (Axios wrapper -> Body (if array) OR Body -> Data Array (if body has data property))
            // 3. res (Body direct) -> Data Array (if body has data property)
            // 4. res (Body direct - Array)

            let body = res?.data || res; // Unwrap Axios if present

            // Check if body is the { success: true, data: [...] } structure
            if (body && Array.isArray(body.data)) {
                acayear = body.data;
            } else if (Array.isArray(body)) {
                acayear = body;
            } else if (body && Array.isArray(body.get_academicyear)) {
                // Fallback for some common patterns
                acayear = body.get_academicyear;
            } else {
                console.warn("Could not find academic year array in response");
            }
        } else {
            console.error("Academic Year API failed:", academicYearResult.reason);
        }

        return {
            success: true,
            acayear: acayear,
            month_array: month_array
        };
    } catch (error) {
        console.error("Error fetching load data:", error);
        return {
            success: false,
            acayear: [],
            month_array: []
        };
    }
}

export async function getInvRMonthEndReport(payload: IInvRMonthEndReportPayload) {
    try {
        const response = await api.post<any>('inventory', '/INV_MonthEndReportFacade/getmonthreport', payload);

        let reportData = response.data || response;
        if (reportData.get_monthendreport) {
            reportData = reportData.get_monthendreport;
        }

        if (Array.isArray(reportData) && reportData.length > 0) {
            return {
                success: true,
                data: reportData[0] // It seems to return an array with one object containing counts
            };
        } else {
            return {
                success: false,
                message: "No records found"
            };
        }

    } catch (error: any) {
        console.error("Error generating report:", error);
        return {
            success: false,
            message: error.message || 'Failed to generate report'
        };
    }
}
