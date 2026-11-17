'use server';
import { api } from '@/lib/apiService';

interface SearchParams {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number;
    radiotype: 'EXAM' | 'PROMOTION';
    FMT_Id?: number;
    TempGroupList?: number[];
    feeinstallmentcheckbox?: boolean;
}

export async function getStudentWisePublishMarksData(data: any) {
    const url = '/exam_calculation/student_list_for_marks_publish';
    return await api.post<any>('exam', url, data);
}

export async function StudentsMarksPublish(data: any) {
    const url = '/exam_calculation/students_marks_publish';
    return await api.post<any>('exam', url, data);
}

// export async function useCheckMarksCalculation = (params: {
//   ASMS_Id: number;
//   ASMCL_Id: number;
//   ASMAY_Id: number;
//   radiotype: 'EXAM' | 'PROMOTION';
// }) => {
//   return useQuery({
//     queryKey: ['check-marks-calculation', params],
//     queryFn: async () => {
//       const response = await api.post('exam','/api/exam/check-marks-calculation', params);
//       return response.data;
//     },
//     enabled: !!params.ASMS_Id && !!params.ASMCL_Id && !!params.ASMAY_Id,
//   });
// };
