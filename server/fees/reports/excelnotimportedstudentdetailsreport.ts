'use server';
import { api } from '@/lib/apiService';

export async function getexcelnotimportedstudentdetailsreport(asmay_Id: number, fromdate: string, todate: string) {
    const url = `/FeesCommon/Fee_Excel_ImportsReport/${asmay_Id}/${fromdate}/${todate}`;
    return await api.get<any[]>('fees', url);
}

export async function deletexcelnotimportedstudentdetailsreport(feipsT_Id: number) {
    const url = `/FeesCommon/Fee_Excel_ImportsReportDelete/${feipsT_Id}`;
    return await api.delete<any[]>('fees', url);
}
