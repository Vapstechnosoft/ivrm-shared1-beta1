
export interface IYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IHouse {
    spccmH_Id: number;
    spccmH_HouseName: string;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface ISportsYearEndReportLoadData {
    yearlist: IYear[];
    houseList: IHouse[];
}

export interface ISportsYearEndReportClassData {
    classList: IClass[];
    houseList: IHouse[];
}

export interface ISportsYearEndReportSectionData {
    sectionList: ISection[];
}

// Placeholder for Report Data since not provided in prompt
export interface ISportsYearEndReportData {
    [key: string]: any;
}
