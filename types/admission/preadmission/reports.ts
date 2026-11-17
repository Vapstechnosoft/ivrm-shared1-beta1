export interface IMasterStudentCountReportList {
    type: number;
    asmay_id: string;
    from_date: string;
    to_date: string;
    report_type: number;
    asmcl_id: number;
}
export interface IParentsDashboardStudentResponse {
    pasr_id: number;
    registration_number: string;
    student_name: string;
    date_of_birth: string;
    mobile_no: number;
    email_id: string;
    applied_class_name: string;
    is_fee_applicable: number;
    payment_status: number;
    application_status: string;
    admission_status: string;
    student_photo: string;
}

export interface IClassTeacherReportList {
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    IVRMSTAUL_UserName: string;
    PAMS_SubjectName: string;
}

export interface IStudentYearlyAttendenceReportList {
    RowNo: number;
    AMST_Id: number;
    name: string;
    AMST_AdmNo: string;
    AMST_RegistrationNo: string;
    AMAY_RollNo: number;
    monthlyAttendance: {
        [key: string]: number;
    };
    totalPresent: number;
    percentage: string;
}
export interface IRigistrationReportList {
    rowNumber: number;
    user_Name: string;
    email_Id: string;
    mob_No: string;
    name: string;
    created_Date: string;
}

export interface IStudentAttendanceReportList {
    AMST_Id: number;
    name: string;
    AMST_AdmNo: string;
    AMAY_RollNo: number;
    ASA_ClassHeld: number;
    ASA_Class_Attended: number;
    Percentage: number;
    RowNo: number;
}
export type Student = {
    studentnam: string;
    AMST_Id: number;
    admno: string;
    fathername: string;
    class: string;
    acadamicyear: string;
    dob: string;
    caste_name: string;
    addressd1: string;
    city: string;
};

export type StudyCertificateResponse = {
    studentList: Student[];
};
