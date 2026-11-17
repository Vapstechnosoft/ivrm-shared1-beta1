// Response for Academic Year Dropdown
export interface IAttendanceYear {
    amsT_Id: number;
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order: number;
}

// Response for Attendance List
export interface IAttendanceData {
    month_name: string;
    total_present: number;
    class_held: number;
    score: number;
    absent_count: number;
    absent_dates: string;
}

export interface IAttendanceGraphData {
    label: string;
    y: number;
}

// Generic API Response Wrapper (matching the user's sample)
export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    total: number | null;
    page: number | null;
    page_size: number | null;
}

export interface IStudentFeedbackList {
    asgfE_Id: number;
    mI_Id: string;
    amsT_Id: number;
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    asgfE_FeedBack: string;
    asgfE_FeedbackDate: string;
    asgfE_ActiveFlag: boolean;
    asgfE_CreatedBy: number;
    asgfE_UpdatedBy: number;
    createdDate: string;
    updatedDate: string;
}
export interface ICOEData {
    coemE_Id?: number;
    coemE_EventName: string;
    coemE_EventDesc: string;
    coeE_Id?: number;
    coeE_EStartDate: string;
    coeE_EEndDate: string;
    coeE_EStartTime: string;
    coeE_EEndTime: string;
    mI_Id: number;
    asmaY_Id: number;
    amscL_Id: number;
    amsT_Id: number;
}

export interface IAcademicYear {
    id: number;
    name: string;
    order?: number;
}
