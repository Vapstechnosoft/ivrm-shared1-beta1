'use server';

import { api } from '@/lib/apiService';
import {
    ISportsYearEndReportClassData,
    ISportsYearEndReportLoadData,
    ISportsYearEndReportSectionData
} from '@/app/(root)/Sports/Reports/SportsYearEndReport/types';

export async function getYearEndReportLoadData(): Promise<ISportsYearEndReportLoadData> {
    try {
        console.info("🟡 [SERVER ACTION] getYearEndReportLoadData: Initiating 'StudentAgeCalcReport/Getdetails'");
        const response = await api.post<ISportsYearEndReportLoadData>('sports', 'StudentAgeCalcReport/Getdetails', {});
        console.info("🟢 [SERVER ACTION] getYearEndReportLoadData: Response success =", response?.success);
        return response?.data || { yearlist: [], houseList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getYearEndReportLoadData:", error);
        return { yearlist: [], houseList: [] };
    }
}

export async function getClasses(asmaY_Id: number): Promise<ISportsYearEndReportClassData> {
    try {
        console.info(`🟡 [SERVER ACTION] getClasses: Fetching for Year ID ${asmaY_Id}`);
        const response = await api.post<ISportsYearEndReportClassData>('sports', 'StudentAgeCalcReport/get_class', { asmaY_Id });
        console.info("🟢 [SERVER ACTION] getClasses: Response success =", response?.success);
        return response?.data || { classList: [], houseList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getClasses:", error);
        return { classList: [], houseList: [] };
    }
}

export async function getSections(asmaY_Id: number, asmcL_Id: number): Promise<ISportsYearEndReportSectionData> {
    try {
        console.info(`🟡 [SERVER ACTION] getSections: Fetching for Year ID ${asmaY_Id}, Class ID ${asmcL_Id}`);
        const response = await api.post<ISportsYearEndReportSectionData>('sports', 'StudentAgeCalcReport/get_section', { asmaY_Id, asmcL_Id });
        console.info("🟢 [SERVER ACTION] getSections: Response success =", response?.success);
        return response?.data || { sectionList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getSections:", error);
        return { sectionList: [] };
    }
}
