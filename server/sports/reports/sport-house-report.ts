'use server';

import { api } from '@/lib/apiService';
import {
    ISportHouseReportClassData,
    ISportHouseReportData,
    ISportHouseReportLoadData,
    ISportHouseReportRequest,
    ISportHouseReportSectionData
} from '@/app/(root)/Sports/Reports/SportHouseReport/types';

export async function getSportHouseReportLoadData(): Promise<ISportHouseReportLoadData> {
    try {
        console.info("🟡 [SERVER ACTION] getSportHouseReportLoadData: Initiating 'SportHouseReport/Getdetails'");
        const response = await api.post<ISportHouseReportLoadData>('sports', 'SportHouseReport/Getdetails', {});
        console.info("🟢 [SERVER ACTION] getSportHouseReportLoadData: Response success =", response?.success);
        return response?.data || { yearlist: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getSportHouseReportLoadData:", error);
        return { yearlist: [] };
    }
}

export async function getClassesAndHouses(asmaY_Id: number): Promise<ISportHouseReportClassData> {
    try {
        console.info(`🟡 [SERVER ACTION] getClassesAndHouses: Fetching for Year ID ${asmaY_Id}`);
        const response = await api.post<ISportHouseReportClassData>('sports', 'SportHouseReport/get_class', { asmaY_Id });
        console.info("🟢 [SERVER ACTION] getClassesAndHouses: Response success =", response?.success);
        return response?.data || { classList: [], houseList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getClassesAndHouses:", error);
        return { classList: [], houseList: [] };
    }
}

export async function getSections(asmaY_Id: number, asmcL_Id: number): Promise<ISportHouseReportSectionData> {
    try {
        console.info(`🟡 [SERVER ACTION] getSections: Fetching for Year ID ${asmaY_Id}, Class ID ${asmcL_Id}`);
        const response = await api.post<ISportHouseReportSectionData>('sports', 'SportHouseReport/get_section', { asmaY_Id, asmcL_Id });
        console.info("🟢 [SERVER ACTION] getSections: Response success =", response?.success);
        return response?.data || { sectionList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getSections:", error);
        return { sectionList: [] };
    }
}

export async function getSportHouseReport(data: ISportHouseReportRequest): Promise<ISportHouseReportData[]> {
    try {
        console.info("🟡 [SERVER ACTION] getSportHouseReport: Generating report", JSON.stringify(data));
        const response = await api.post<any>('sports', 'SportHouseReport/showdetails', data);
        console.info("🟢 [SERVER ACTION] getSportHouseReport: Response success =", response?.success);

        if (response?.data?.viewlist) {
            return response.data.viewlist;
        } else if (Array.isArray(response?.data)) {
            return response.data;
        }

        return [];
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getSportHouseReport:", error);
        return [];
    }
}
