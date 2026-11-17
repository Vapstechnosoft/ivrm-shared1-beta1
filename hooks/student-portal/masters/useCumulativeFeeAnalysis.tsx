import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
    type CumulativeFeeAnalysisSchema,
    cumulativeFeeAnalysisSchema
} from '@/schemas/student-portal/masters/cumulative-fee-analysis.schema';
import {
    getAcademicYears,
    getCumulativeFeeAnalysisReport,
    getStudentFeeDetailsReport
} from '@/server/student-portal/masters/cumulative-fee-analysis';
import type { IFeeAnalysisData, IFeeDetailsData } from '@/types/student-portal/masters/cumulative-fee-analysis';

export function useCumulativeFeeAnalysis() {
    const [feeAnalysisList, setFeeAnalysisList] = useState<IFeeAnalysisData[]>([]);
    const [studentFeeDetails, setStudentFeeDetails] = useState<IFeeDetailsData[]>([]);
    const [isReportLoading, setIsReportLoading] = useState(false);

    const form = useForm<CumulativeFeeAnalysisSchema>({
        resolver: zodResolver(cumulativeFeeAnalysisSchema),
        defaultValues: {
            asmaY_Id: ''
        }
    });

    const { data: academicYearsResponse, isLoading: isInitialLoading } = useQuery({
        queryKey: ['cumulativeFeeAnalysisYear'],
        queryFn: async () => {
            try {
                const response = await getAcademicYears();

                console.log('Academic Years Response:', response);
                if (response?.data && response.data.length > 0) {
                    if (!form.getValues('asmaY_Id')) {
                        const defaultYear = response.data[0];
                        form.setValue('asmaY_Id', defaultYear.asmaY_Id.toString());
                        handleReport({ asmaY_Id: defaultYear.asmaY_Id.toString() });
                    }
                }
                return response;
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch academic years');
                return { success: false, message: error.message, data: [], total: 0, page: 0, page_size: 0 };
            }
        }
    });

    const handleReport = async (data: CumulativeFeeAnalysisSchema) => {
        setIsReportLoading(true);
        setFeeAnalysisList([]);
        setStudentFeeDetails([]);

        try {
            const [analysisRes, detailsRes] = await Promise.all([
                getCumulativeFeeAnalysisReport({ ASMAY_Id: Number(data.asmaY_Id) }),
                getStudentFeeDetailsReport({ ASMAY_Id: Number(data.asmaY_Id) })
            ]);

            if (analysisRes?.data && analysisRes.data.length > 0) {
                setFeeAnalysisList(analysisRes.data);
            }

            if (detailsRes?.data && detailsRes.data.length > 0) {
                setStudentFeeDetails(detailsRes.data);
            }

            if ((!analysisRes?.data || analysisRes.data.length === 0) && (!detailsRes?.data || detailsRes.data.length === 0)) {
                toast.info('No Data Found!!!');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to fetch report data');
        } finally {
            setIsReportLoading(false);
        }
    };

    return {
        form,
        yearList: academicYearsResponse?.data || [],
        initialData: academicYearsResponse,
        isInitialLoading,
        feeAnalysisList,
        studentFeeDetails,
        handleReport,
        isReportLoading
    };
}
