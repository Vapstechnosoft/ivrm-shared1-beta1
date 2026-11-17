export interface AcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface StudentComplaint {
    ASCOMP_Id: number;
    AMST_FirstName: string;
    AMST_AdmNo: string;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    ASCOMP_Subject: string;
    ASCOMP_Complaints: string;
    ASCOMP_Date: string;
    ASCOMP_FilePath?: string;
    ASCOMP_FileName?: string;
    filetype?: string;
    document_Pathnew?: string;
}


export interface ComplaintLoadData {
    yearlist: AcademicYear[];
    studentdivlist: StudentComplaint[];
    asmaY_Id: number;
}

