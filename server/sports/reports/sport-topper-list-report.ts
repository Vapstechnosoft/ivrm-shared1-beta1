'use server';

import { api } from '@/lib/apiService';
import {
    ITopperListClassData,
    ITopperListLoadData,
    ITopperListReportData,
    ITopperListRequest,
    ITopperListSectionData
} from '@/app/(root)/Sports/Reports/SportTopperListReport/types';

export async function getTopperListLoadData(): Promise<ITopperListLoadData> {
    try {
        console.info("🟡 [SERVER ACTION] getTopperListLoadData: Initiating 'SportTopperListReport/Getdetails'");
        const response = await api.post<ITopperListLoadData>('sports', 'SportTopperListReport/Getdetails', {});
        console.info("🟢 [SERVER ACTION] getTopperListLoadData: Response success =", response?.success);
        return response?.data || { yearlist: [], sportslist: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getTopperListLoadData:", error);
        return { yearlist: [], sportslist: [] };
    }
}

export async function getClassesHousesEvents(asmaY_Id: number): Promise<ITopperListClassData> {
    try {
        console.info(`🟡 [SERVER ACTION] getClassesHousesEvents: Fetching for Year ID ${asmaY_Id}`);
        const response = await api.post<ITopperListClassData>('sports', 'SportTopperListReport/get_class', { asmaY_Id });
        console.info("🟢 [SERVER ACTION] getClassesHousesEvents: Response success =", response?.success);
        return response?.data || { classList: [], houseList: [], eventList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getClassesHousesEvents:", error);
        return { classList: [], houseList: [], eventList: [] };
    }
}

export async function getSections(asmaY_Id: number, asmcL_Id: number): Promise<ITopperListSectionData> {
    try {
        console.info(`🟡 [SERVER ACTION] getSections: Fetching for Year ID ${asmaY_Id}, Class ID ${asmcL_Id}`);
        const response = await api.post<ITopperListSectionData>('sports', 'SportTopperListReport/get_section', { asmaY_Id, asmcL_Id });
        console.info("🟢 [SERVER ACTION] getSections: Response success =", response?.success);
        return response?.data || { sectionList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getSections:", error);
        return { sectionList: [] };
    }
}

export async function getTopperListReport(data: ITopperListRequest): Promise<ITopperListReportData[]> {
    try {
        console.info("🟡 [SERVER ACTION] getTopperListReport: Generating report", JSON.stringify(data));
        const response = await api.post<any>('sports', 'SportTopperListReport/showdetails', data);
        console.info("🟢 [SERVER ACTION] getTopperListReport: Response success =", response?.success);

        if (response?.data?.viewlist) {
            return response.data.viewlist;
        } else if (Array.isArray(response?.data)) {
            return response.data;
        }

        return [];
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getTopperListReport:", error);
        return [];
    }
}
