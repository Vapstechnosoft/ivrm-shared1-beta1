export interface ExamCalculationResponse {
    success?: boolean;
    notEnteredSubjects?: Array<{
        subjectName: string;
        studentCount: number;
    }>;
    requiresFeedback?: boolean;
    message?: string;
}
