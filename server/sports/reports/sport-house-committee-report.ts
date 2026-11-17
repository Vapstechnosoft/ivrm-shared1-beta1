'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import {
    IHouseCommitteeReportLoadData,
    IHouseCommitteeReportHouses,
    ISportHouseCommitteeReport,
    IHouseCommitteeReportRequest
} from '@/types/sports/reports/sport-house-committee-report';

/**
 * Fetches initial data (Academic Years) for the Sport House Committee Report.
 */
export async function getSportHouseCommitteeReportLoadData(): Promise<IHouseCommitteeReportLoadData> {
    try {
        console.info("🟡 [SERVER ACTION] getSportHouseCommitteeReportLoadData: Initiating 'SportHouseCommitteeReport/Getdetails'");
        const response = await api.post<IHouseCommitteeReportLoadData>('sports', 'SportHouseCommitteeReport/Getdetails', {});
        console.info("🟢 [SERVER ACTION] getSportHouseCommitteeReportLoadData: Response success =", response?.success);
        return response?.data || { asmay_list: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getSportHouseCommitteeReportLoadData:", error);
        return { asmay_list: [] };
    }
}

/**
 * Fetches House list based on selected Academic Year.
 */
export async function getHousesByYear(asmaY_Id: number): Promise<IHouseCommitteeReportHouses> {
    try {
        console.info(`🟡 [SERVER ACTION] getHousesByYear: Fetching for Year ID ${asmaY_Id}`);
        const response = await api.post<IHouseCommitteeReportHouses>('sports', 'SportHouseCommitteeReport/get_House', { asmaY_Id });
        console.info("🟢 [SERVER ACTION] getHousesByYear: Response success =", response?.success);
        return response?.data || { houseList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getHousesByYear:", error);
        return { houseList: [] };
    }
}

/**
 * Generates the Sport House Committee Report based on Year and selected Houses.
 */
export async function getSportHouseCommitteeReport(data: IHouseCommitteeReportRequest): Promise<ISportHouseCommitteeReport[]> {
    try {
        console.info("🟡 [SERVER ACTION] getSportHouseCommitteeReport: Generating report", JSON.stringify(data));
        const response = await api.post<any>('sports', 'SportHouseCommitteeReport/showdetails', data);
        console.info("🟢 [SERVER ACTION] getSportHouseCommitteeReport: Response success =", response?.success);
        return response?.data || [];
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getSportHouseCommitteeReport:", error);
        return [];
    }
}
