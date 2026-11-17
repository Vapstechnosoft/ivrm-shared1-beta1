export interface IAlumniAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order?: number;
    is_Active?: boolean;
    asmaY_From_Date?: string;
    asmaY_To_Date?: string;
}

export interface IAlumniClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmcL_ClassCode?: string;
    asmcL_Order?: number;
    asmcL_ActiveFlag?: boolean;
    asmcL_MaxCapacity?: number;
    asmcL_PreadmFlag?: number;
}

export interface IAlumniSearchDetailsResponse {
    yearList: IAlumniAcademicYear[];
    classList: IAlumniClass[];
}

export interface IAlumniSearchResultItem {
    almst_id: number;
    amsT_FirstName: string;
    amsT_DOB: string;
    amsT_MobileNo: string;
    amsT_emailId: string;
    ASMAY_Id_Join: string;
    ASMAY_Id_Left: string;
    ALMST_MembershipId: string;
    ALMMC_MembershipCategory: string;
    IVRMMD_Name: string;
    amsT_BloodGroup: string;
    ALSPR_Designation: string;
    IVRMMS_Name: string;
    ALMST_ConCity: string;
    ALMST_FullAddess: string;
    ALMST_PerPincode: string;
    ASMAY_Id_NEW_Left?: string; // For Address Book view
    Leftclass?: string;
    ASMCL_Id_Join?: number;
    ALMST_District?: string;
    // Lowercase mappings from new API response
    studentname?: string;
    amst_admno?: string;
    amst_mobileno?: number | string;
    amst_emailid?: string;
    amst_dob?: string;
    asmcl_classname?: string;
    amst_bloodgroup?: string;
    student_id?: number;
    asmay_year?: string;
}

export interface IAlumniSearchResponse {
    searchResult: IAlumniSearchResultItem[];
    count: number;
}
