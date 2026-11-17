'use server';

import { api } from '@/lib/apiService';
import {
    IHouseInchargeReportData,
    IHouseInchargeReportHouses,
    IHouseInchargeReportLoadData,
    IHouseInchargeReportRequest
} from '@/app/(root)/Sports/Reports/HouseInchargeReport/types';

export async function getHouseInchargeReportLoadData(): Promise<IHouseInchargeReportLoadData> {
    try {
        console.info("🟡 [SERVER ACTION] getHouseInchargeReportLoadData: Initiating 'HouseInchargeReport/get_details'");
        const response = await api.post<IHouseInchargeReportLoadData>('sports', 'HouseInchargeReport/get_details', {});
        console.info("🟢 [SERVER ACTION] getHouseInchargeReportLoadData: Response success =", response?.success);
        return response?.data || { asmay_list: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getHouseInchargeReportLoadData:", error);
        return { asmay_list: [] };
    }
}

export async function getHousesByYear(asmaY_Id: number): Promise<IHouseInchargeReportHouses> {
    try {
        console.info(`🟡 [SERVER ACTION] getHousesByYear: Fetching for Year ID ${asmaY_Id}`);
        const response = await api.post<IHouseInchargeReportHouses>('sports', 'HouseInchargeReport/get_house', { asmaY_Id });
        console.info("🟢 [SERVER ACTION] getHousesByYear: Response success =", response?.success);
        return response?.data || { houseList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getHousesByYear:", error);
        return { houseList: [] };
    }
}

export async function getHouseInchargeReport(data: IHouseInchargeReportRequest): Promise<IHouseInchargeReportData[]> {
    try {
        console.info("🟡 [SERVER ACTION] getHouseInchargeReport: Generating report", JSON.stringify(data));
        const response = await api.post<any>('sports', 'HouseInchargeReport/get_reports', data);
        console.info("🟢 [SERVER ACTION] getHouseInchargeReport: Response success =", response?.success);

        // Handle potential different response structures (list directly or inside report_list)
        if (Array.isArray(response?.data)) {
            return response.data;
        } else if (response?.data?.report_list) {
            return response.data.report_list;
        }

        return [];
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getHouseInchargeReport:", error);
        return [];
    }
}
