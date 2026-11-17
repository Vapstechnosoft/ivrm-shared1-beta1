export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IHouse {
    spccmH_Id: number;
    spccmH_HouseName: string;
}

export interface ISportHouseCommitteeReport {
    spccmH_HouseName: string;
    asmaY_Year: string;
    amsT_AdmNo: string;
    studentname: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    spccmhD_DesignationName: string;
    spccmhC_ContactNo: string;
    spccmhC_EmailId: string;
}

export interface IHouseCommitteeReportRequest {
    asmaY_Id: number;
    selectedhouselist: { spccmH_Id: number }[];
}

export interface IHouseCommitteeReportLoadData {
    asmay_list: IAcademicYear[];
}

export interface IHouseCommitteeReportHouses {
    houseList: IHouse[];
}
