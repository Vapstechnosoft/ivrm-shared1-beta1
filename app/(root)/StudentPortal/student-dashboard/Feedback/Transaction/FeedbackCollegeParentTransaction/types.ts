
export interface FeedbackType {
    fmtY_Id: number;
    fmtY_FeedbackTypeName: string;
    fmtY_QuestionwiseOptionFlg?: boolean;
    Selected?: boolean;
}

export interface FeedbackQuestion {
    fmqE_Id: number;
    fmqE_FeedbackQuestions: string;
    fmqE_ManualEntryFlg: boolean;
    fmtY_Id: number;
}

export interface FeedbackOption {
    fmoP_Id: number;
    fmoP_FeedbackOptions: string;
    fmoP_OptionsValue: number;
    fmoP_FeedbackORemarks: string;
    fmoP_ActiveFlag: boolean;
    fmtY_Id: number;
    fmqE_Id?: number; // Sometimes mapped to specific question
}

export interface FeedbackTransactionLoadData {
    typelistload: FeedbackType[];
    count: number;
    returnval: boolean;
    message?: string;
}

export interface FeedbackDetailsRequest {
    FMTY_Id: number;
}

export interface FeedbackDetailsResponse {
    typelist: FeedbackType[];
    mappedquestiondeetails: FeedbackQuestion[];
    mappedoptiondeetails: FeedbackOption[];
    count: number; // If count > 0, feedback already given
}

// Client Side mapped structures
export interface FeedbackQuestionClient {
    FMQE_Id: number;
    FMQE_FeedbackQuestions: string;
    manualflg: boolean;
    opt?: {
        FMOP_Id: number;
        FMOP_FeedbackOptions: string;
    }[];
    answerValue?: string; // Captures radio selection (FMOP_Id) or text input
}

export interface FeedbackTypeClient {
    FMTY_Id: number;
    FMTY_FeedbackTypeName: string;
    ques: FeedbackQuestionClient[];
}

export interface FeedbackTransactionSaveRequest {
    temp: FeedbackTypeClient[];
    Flag: string;
}
