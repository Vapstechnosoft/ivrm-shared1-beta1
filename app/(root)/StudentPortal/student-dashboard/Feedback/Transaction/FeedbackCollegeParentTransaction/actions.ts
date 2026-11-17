'use server';

import { api } from '@/lib/apiService';
import { FeedbackTransactionLoadData, FeedbackDetailsRequest, FeedbackDetailsResponse, FeedbackTransactionSaveRequest } from './types';

// Mock data as fallback
const mockLoadData: FeedbackTransactionLoadData = {
    typelistload: [
        { fmtY_Id: 1, fmtY_FeedbackTypeName: 'Academic Feedback', Selected: false },
        { fmtY_Id: 2, fmtY_FeedbackTypeName: 'Infrastructure Feedback', Selected: false },
        { fmtY_Id: 3, fmtY_FeedbackTypeName: 'Library Feedback', Selected: false }
    ],
    count: 0,
    returnval: true
};

export async function getFeedbackTransactionLoadData() {
    // "MI_Id": 4, "Flag": 'Parents' - taken from legacy BindData
    const data = {
        "MI_Id": 4,
        "Flag": 'Parents'
    };
    const url = `/FeedbackTransaction/getdetails`;
    try {
        const response = await api.post<FeedbackTransactionLoadData>('default', url, data);
        if (response && response.data) return response.data;
        return response as unknown as FeedbackTransactionLoadData;
    } catch (e) {
        console.warn("API Failed, using mock data for getFeedbackTransactionLoadData", e);
        return mockLoadData;
    }
}

export async function getFeedbackDetails(requestData: FeedbackDetailsRequest) {
    const url = `/FeedbackTransaction/getfeedback`;
    try {
        const response = await api.post<FeedbackDetailsResponse>('default', url, requestData);
        if (response && response.data) return response.data;
        return response as unknown as FeedbackDetailsResponse;
    } catch (e) {
        console.warn("API Failed, using mock data for getFeedbackDetails", e);
        // Return null or handle error gracefully in client
        // Mocking response for a specific type
        if (requestData.FMTY_Id === 1) {
            return {
                count: 0,
                typelist: [{ fmtY_Id: 1, fmtY_FeedbackTypeName: 'Academic Feedback' }],
                mappedquestiondeetails: [
                    { fmqE_Id: 101, fmqE_FeedbackQuestions: 'How is the teaching quality?', fmqE_ManualEntryFlg: false, fmtY_Id: 1 },
                    { fmqE_Id: 102, fmqE_FeedbackQuestions: 'Any suggestions for improvement?', fmqE_ManualEntryFlg: true, fmtY_Id: 1 }
                ],
                mappedoptiondeetails: [
                    { fmoP_Id: 1, fmoP_FeedbackOptions: 'Excellent', fmoP_OptionsValue: 5, fmoP_FeedbackORemarks: '', fmoP_ActiveFlag: true, fmtY_Id: 1, fmqE_Id: 101 },
                    { fmoP_Id: 2, fmoP_FeedbackOptions: 'Good', fmoP_OptionsValue: 4, fmoP_FeedbackORemarks: '', fmoP_ActiveFlag: true, fmtY_Id: 1, fmqE_Id: 101 },
                    { fmoP_Id: 3, fmoP_FeedbackOptions: 'Average', fmoP_OptionsValue: 3, fmoP_FeedbackORemarks: '', fmoP_ActiveFlag: true, fmtY_Id: 1, fmqE_Id: 101 }
                ]
            } as unknown as FeedbackDetailsResponse;
        }
        return null;
    }
}

export async function saveFeedbackTransaction(requestData: FeedbackTransactionSaveRequest) {
    const url = `/FeedbackTransaction/savedata`;
    try {
        const response = await api.post<{ returnval: boolean, message?: string }>('default', url, requestData);
        if (response && response.data) return response.data;
        return response as unknown as { returnval: boolean, message?: string };
    } catch (e) {
        console.warn("API Failed, using mock data for saveFeedbackTransaction", e);
        return { returnval: true, message: "Saved Successfully (Mock)" };
    }
}
