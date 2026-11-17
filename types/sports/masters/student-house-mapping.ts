export interface StudentHouseMappingDTO {
    spccsH_Id?: number;
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    spccmH_Id: number;
    spccsH_Date: Date;
    spccsH_Remarks?: string;

    // For Grid Display objects (flattened)
    asmaY_Year?: string;
    spccmH_HouseName?: string;
    studentname?: string;
    amsT_AdmNo?: string;
    asmcL_ClassName?: string;
    asmC_SectionName?: string;
    spccmH_ActiveFlag?: boolean;

    // For saving
    studList1?: { amsT_Id: number, stud?: boolean }[];
}

export interface MasterDataDTO {
    yearlist: { asmaY_Id: number; asmaY_Year: string; Selected?: boolean }[];
    houseList: { spccmH_Id: number; spccmH_HouseName: string }[];
    classList: { asmcL_Id: number; asmcL_ClassName: string }[];
    sectionDropdown: { asmS_Id: number; asmC_SectionName: string }[];
    studentList: { amsT_Id: number; studentname: string; amsT_AdmNo: string; stud?: boolean; asmcL_Id?: number; asmS_Id?: number }[];
}
