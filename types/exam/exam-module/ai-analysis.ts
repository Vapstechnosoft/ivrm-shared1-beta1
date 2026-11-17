export interface StudentSubject {
    subject: string;
    score: number;
    maxScore: number;
    percentage: number;
}

export interface StudentPerformance {
    name: string;
    index: number;
    subjects: StudentSubject[];
    totalScore: number;
    averageScore: number;
    subjectCount: number;
}

export interface WeakPerformerAnalysis {
    name: string;
    averageScore: number;
    totalScore: number;
    analysis: string;
    recommendations: string;
}

export interface TopPerformerAnalysis {
    name: string;
    averageScore: number;
    totalScore: number;
    analysis: string;
    praise: string;
}

export interface ClassAnalysis {
    classOverview: string;
    weakPerformers: WeakPerformerAnalysis[];
    topPerformers: TopPerformerAnalysis[];
}

export interface StudentWeakestSubject {
    name: string;
    score: number;
    analysis: string;
}

export interface StudentSubjectImprovement {
    name: string;
    score: number;
    recommendation: string;
}

export interface StudentStrongSubject {
    name: string;
    score: number;
    praise: string;
}

export interface IndividualAnalysis {
    weakestSubject: StudentWeakestSubject;
    needsImprovement: StudentSubjectImprovement[];
    strongSubjects: StudentStrongSubject[];
    overallAssessment: string;
    improvementStrategy: string;
}
