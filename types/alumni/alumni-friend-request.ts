export interface IAlumniFriendRequest {
    // Frontend uses PascalCase
    ALMST_Id: number;
    studentname: string;
    ASMAY_Year: string;
    ALSFRND_RequestDate: string | null;
    ALSFRND_AcceptedDate: string | null;
    ALSFRND_AcceptFlag: 'ACCEPT' | 'REJECT' | null;
    checktru?: boolean;
    selected?: boolean;
    // Backend returns lowercase (optional for mapping)
    student_id?: number;
    asmaY_Year?: string;
    alsfrnD_RequestDate?: string | null;
    alsfrnD_AcceptedDate?: string | null;
    alsfrnD_AcceptFlag?: 'ACCEPT' | 'REJECT' | null;
}

export interface IAlumniProfile {
    ALMST_Id: number;
    alumniname: string;
    ASMAY_Year: string;
    ALMST_MobileNo: string;
    ALMST_emailId: string;
    ALMST_StudentPhoto: string;
}

export interface IAlumniFriendRequestLoadResponse {
    searchResult: IAlumniFriendRequest[];
    friendrequest: any[]; // List of existing requests for search page
    friendrequestlist?: IAlumniFriendRequest[]; // List for the Accept page
    mI_Id: number;
    user_id: number;
    almsT_Id: number;
}

export interface IAlumniProfileResponse {
    almst_profile: IAlumniProfile[];
    data?: any[]; // For robustness with different API response formats
}
