'use server';

import { api } from '@/lib/apiService';
import type { FeeDetailsLoadData, FeeDetailsRequest, FeeDetailsResponse } from './types';

// Mock data fallbacks
const mockLoadData: FeeDetailsLoadData = {
    yearclsList: [
        { ASMAY_Id: 2024, ASMAY_Year: '2024-2025', ASMCL_ClassName: 'X', ASMC_SectionName: 'A' },
        { ASMAY_Id: 2023, ASMAY_Year: '2023-2024', ASMCL_ClassName: 'IX', ASMC_SectionName: 'A' }
    ],
    feecurrentyear: [{ ASMAY_Id: 2024, ASMAY_Year: '2024-2025', ASMCL_ClassName: 'X', ASMC_SectionName: 'A' }]
};

// const mockOverallData: any[] = [
//     {
//         Receivable: 50000,
//         Concession: 2000,
//         Collectionamount: 35000,
//         Adjusted: 0,
//         Balance: 13000
//     }
// ];

// const mockDetailedData: any[] = [
//     { FEE_HEAD: 'Tuition Fee', RECEIVABLE: 30000, CONCESSION: 1000, COLLECTION: 20000, ADJUSTMENT: 0, BALANCE: 9000 },
//     { FEE_HEAD: 'Transport Fee', RECEIVABLE: 10000, CONCESSION: 500, COLLECTION: 8000, ADJUSTMENT: 0, BALANCE: 1500 },
//     { FEE_HEAD: 'Library Fee', RECEIVABLE: 5000, CONCESSION: 0, COLLECTION: 5000, ADJUSTMENT: 0, BALANCE: 0 },
//     { FEE_HEAD: 'Sports Fee', RECEIVABLE: 5000, CONCESSION: 500, COLLECTION: 2000, ADJUSTMENT: 0, BALANCE: 2500 },
// ];

export async function getFeeDetailsLoadData() {
    // const url = `/CumulativeFeeAnalysis/studentfeedetails?ASMAY_Id=${asmaY_Id}&AMST_Id=${asmcL_Id}`
    // return await api.get<any[]>('portal', url);

    const url = 'api/CumulativeFeeAnalysis/studentfeedetails?ASMAY_Id=176&AMST_Id=17108';
    try {
        const response = await api.get<FeeDetailsLoadData>('portal', url, {});
        if (response.data) return response.data;
        return response as unknown as FeeDetailsLoadData;
    } catch (e) {
        console.warn('API Failed 1', e);
        return mockLoadData;
    }
}

export async function getFeeDetails(data: FeeDetailsRequest) {
    const url = `/FeeDetails/Getdetails`;
    try {
        const response = await api.get<FeeDetailsResponse>('portal', url, {});

        console.log('bbbbbbbbb', response);
        if (response.data) return response.data;
        return response as unknown as FeeDetailsResponse;
    } catch (e) {
        console.warn('API Failed 2', e);
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // return {
        //     getfeedetails: data.type === 'overall' ? mockOverallData : mockDetailedData
        // } as unknown as FeeDetailsResponse;
    }
}
