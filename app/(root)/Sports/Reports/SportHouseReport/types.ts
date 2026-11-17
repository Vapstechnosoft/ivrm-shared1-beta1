
export interface ISportHouseReportLoadData {
    yearlist: IYear[];
}

export interface IYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface ISportHouseReportClassData {
    classList: IClass[];
    houseList: IHouse[];
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface IHouse {
    spccmH_Id: number;
    spccmH_HouseName: string;
}

export interface ISportHouseReportSectionData {
    sectionList: ISection[];
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface ISportHouseReportRequest {
    type: 'House' | 'CS';
    asmaY_Id: number;
    asmcL_Id?: number;
    asmS_Id?: number;
    selectedhouselist?: { spccmH_Id: number }[];
    selectedSectionlist?: { asmS_Id: number }[];
}

export interface ISportHouseReportData {
    id: number;
    SPCCMH_HouseName: string;
    AMST_Name: string;
    AMST_AdmNo: string;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    AMST_MobileNo: string;
    AMST_emailId: string;
}
