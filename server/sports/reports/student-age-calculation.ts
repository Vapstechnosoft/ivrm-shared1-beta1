'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import { IReportRequest, IStudentAgeCalculationDropdowns, IStudentAgeReport } from '@/types/sports/reports/student-age-calculation';

export async function getStudentAgeReportLoadData(): Promise<IStudentAgeCalculationDropdowns> {
    try {
        console.info("🟡 [SERVER ACTION] getStudentAgeReportLoadData: Initiating request to 'StudentAgeCalcReport/Getdetails'");
        const response = await api.post<IStudentAgeCalculationDropdowns>('sports', 'StudentAgeCalcReport/Getdetails', {});
        console.info("🟢 [SERVER ACTION] getStudentAgeReportLoadData: Response success =", response?.success);

        if (response?.data) {
            console.info("🟢 [SERVER ACTION] getStudentAgeReportLoadData: Data received, yearlist length =", response.data.yearlist?.length || 0);
        } else {
            console.warn("🟠 [SERVER ACTION] getStudentAgeReportLoadData: No data in response");
        }

        return response?.data || { yearlist: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getStudentAgeReportLoadData:", error);
        return { yearlist: [] };
    }
}

export async function getClassesForYear(asmaY_Id: number): Promise<Pick<IStudentAgeCalculationDropdowns, 'classList' | 'houseList'>> {
    try {
        console.info(`🟡 [SERVER ACTION] getClassesForYear: Fetching for Year ID ${asmaY_Id}`);
        const response = await api.post<Pick<IStudentAgeCalculationDropdowns, 'classList' | 'houseList'>>('sports', 'StudentAgeCalcReport/get_class', { asmaY_Id });
        console.info("🟢 [SERVER ACTION] getClassesForYear: Response success =", response?.success);
        return response?.data || { classList: [], houseList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getClassesForYear:", error);
        return { classList: [], houseList: [] };
    }
}

export async function getSectionsForClass(asmaY_Id: number, asmcL_Id: number): Promise<Pick<IStudentAgeCalculationDropdowns, 'sectionList'>> {
    try {
        console.info(`🟡 [SERVER ACTION] getSectionsForClass: Fetching for Year ${asmaY_Id}, Class ${asmcL_Id}`);
        const response = await api.post<Pick<IStudentAgeCalculationDropdowns, 'sectionList'>>('sports', 'StudentAgeCalcReport/get_section', { asmaY_Id, asmcL_Id });
        return response?.data || { sectionList: [] };
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getSectionsForClass:", error);
        return { sectionList: [] };
    }
}

export async function getStudentAgeReport(data: IReportRequest): Promise<IStudentAgeReport[]> {
    try {
        console.info("🟡 [SERVER ACTION] getStudentAgeReport: Generating report");
        const response = await api.post<any>('sports', 'StudentAgeCalcReport/showdetails', data);
        return response?.data?.viewlist || response?.data || [];
    } catch (error) {
        console.error("🔴 [SERVER ACTION] Error in getStudentAgeReport:", error);
        return [];
    }
}
