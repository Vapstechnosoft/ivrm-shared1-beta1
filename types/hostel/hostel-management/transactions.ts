export interface HostelList {
    hlmH_Id: number;
    hlmH_Name: string;
    // Add other properties if needed based on API response
}

export interface RoomCategoryList {
    hlmrcA_Id: number;
    hlmrcA_RoomCategory: string;
    // Add other properties if needed
}

export interface StudentProfileData {
    AMST_Id: number;
    studentName: string;
    ASMCL_ClassName: string;
    AMST_AdmNo: string;
    AMST_RegistrationNo: string;
    // Add other properties if needed
}

export interface StudentRequestLoadData {
    hostel_list: HostelList[];
    room_list: RoomCategoryList[];
    student_wisedata: StudentProfileData[];
}

export interface StudentConfirmLoadData {
    student_RequestList: any[];
    student_RequestApp: any[];
    room_list: any[];
}
