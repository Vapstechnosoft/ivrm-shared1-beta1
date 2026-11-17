// Type definitions for School Staff Period Transaction module

export interface ISchoolStaffPeriodTransactionGridItem {
    // From the API response (getalldates)
    alldates: string; // The scheduled date
    topicname: string;
    lpmT_Id: number; // Topic ID
    lplP_Id: number; // Lesson Plan Period ID

    // User input fields
    Selected?: boolean; // Whether this row is selected for saving
    lpcswA_TakenDate?: string; // Completed Date (user input)
    estmanssH_AnswerSheet?: string; // Uploaded file name
    estmanssH_FileLocation?: string; // Uploaded file path

    // Used for date restriction
    minDatedof?: string;
}

export interface ISchoolStaffPeriodTransactionSearchResponse {
    getalldates: ISchoolStaffPeriodTransactionGridItem[];
    gettopicdetails?: any[];
}
