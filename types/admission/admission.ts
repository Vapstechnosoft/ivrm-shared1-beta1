export interface IadmissionClassDropdown {
    asmcL_Id: number;
    asmcL_ClassCode: string;
    asmcL_ClassName: string;
    asmcL_Order: number;
    asmcL_MinAgeYear: number;
    asmcL_MinAgeMonth: number;
    asmcL_MinAgeDays: number;
    asmcL_MaxAgeYear: number;
    asmcL_MaxAgeMonth: number;
    asmcL_MaxAgeDays: number;
    asmcL_MaxCapacity: number;
}

export interface IadmissionStudentApplicationList {
    amsT_Id: number;
    studentName: string;
    className: string;
    admissionDate: string;
    gender: string;
    registrationNo: string;
    admissionNo: string;
    emailId: string;
    mobileNo: string;
    status: string | null;
    photoUrl: string;
    isActive: boolean;
}
