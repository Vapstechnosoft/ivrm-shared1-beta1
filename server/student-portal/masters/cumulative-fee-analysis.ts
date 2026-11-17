'use server';
import { api } from '@/lib/apiService';
import type { IMasterClassYearlyList } from '@/types/fees/masters/masters';
import type { IAcademicYear, IFeeAnalysisData, IFeeDetailsData } from '@/types/student-portal/masters/cumulative-fee-analysis';
// Note: We use the inferred return type from apiService which includes ApiResponse wrapper.

export async function getAcademicYears() {
    const url = '/api/CumulativeFeeAnalysis/getacademicyear';
    return await api.get<IAcademicYear[]>('portal', url);
}

export async function getAcademicYearDropdown() {
    const url = '/fee_class_category/academicyearlist';

    console.info('getAcademicYearDropdown', url);
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getCumulativeFeeAnalysisReport(data: { ASMAY_Id: number }) {
    const url = `/CumulativeFeeAnalysis/cumulative-fee-analysis?ASMAY_Id=${data.ASMAY_Id}`;
    return await api.get<IFeeAnalysisData[]>('portal', url);
}

export async function getStudentFeeDetailsReport(data: { ASMAY_Id: number }) {
    const url = `/CumulativeFeeAnalysis/studentfeedetails?ASMAY_Id=${data.ASMAY_Id}`;
    return await api.get<IFeeDetailsData[]>('portal', url);
}

// export async function getstudentfeedetailsGrid() {

//   const asmaY_Id = 176;
//   const asmcL_Id = 17108;

//   const url = `/CumulativeFeeAnalysis/studentfeedetails?ASMAY_Id=${asmaY_Id}&AMST_Id=${asmcL_Id}`;

//   console.info('getstudentfeedetailsGrid', url);

//   try {
//     //const result = await api.get<IFeeDetailsData[]>('portal', url);
//     const result = await api.get<IApiResponse<IFeeDetailsData[]>>('portal', url);
//     console.info('API call successful:', result);
//     return result;
//   } catch (error) {
//         console.info('API call failed:');
//     console.error('Error 1:', error);
//     throw error;
//   }
// }

// export async function getstudentfeedetailsGrid(asmaY_Id:number, asmcL_Id:number) {
// //   const asmaY_Id = 176;
// //   const asmcL_Id = 17108;
//   // Add leading slash like the working example
//   const url = `/CumulativeFeeAnalysis/studentfeedetails?ASMAY_Id=${asmaY_Id}&AMST_Id=${asmcL_Id}`;
//   console.info('getstudentfeedetailsGrid with leading slash:', url);
// return await api.get<any[]>('portal', url);
// }

export async function getstudentfeedetailsGrid(asmaY_Id: number, asmcL_Id: number) {
    const url = `/CumulativeFeeAnalysis/studentfeedetails?ASMAY_Id=${asmaY_Id}&AMST_Id=${asmcL_Id}`;
    return await api.get<any[]>('portal', url);
}

export async function getCumulativeFeeAnalysisGrid(amst_Id: number, asmay_Id: number) {
    const url = `/CumulativeFeeAnalysis/cumulative-fee-analysis?AMST_Id=${amst_Id}&ASMAY_Id=${asmay_Id}`;
    return await api.get<any[]>('portal', url);
}
