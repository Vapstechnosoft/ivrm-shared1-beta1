
export interface IYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface ISports {
    spccmscC_Id: number;
    spccmscC_SportsCCName: string;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface IHouse {
    spccmH_Id: number;
    spccmH_HouseName: string;
}

export interface IEvent {
    spccmE_Id: number;
    spccmE_EventName: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface ITopperListLoadData {
    yearlist: IYear[];
    sportslist: ISports[];
}

export interface ITopperListClassData {
    classList: IClass[];
    houseList: IHouse[];
    eventList: IEvent[];
}

export interface ITopperListSectionData {
    sectionList: ISection[];
}

export interface ITopperListReportData {
    AMST_AdmNo: string;
    AMST_Name: string;
    SPCCMSCC_SportsCCName: string;
    SPCCMSCC_Id: number;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    SPCCESTR_Points: number;
    SPCCESTR_Rank: number;
    SPCCE_StartDate: string;
    SPCCMEV_EventVenue: string;
    SPCCME_EventName: string;
    SPCCMH_HouseName: string;
    ASMCL_Id: number;
    ASMS_Id: number;
    SPCCME_Id: number;
    SPCCE_Id: number;
    AMST_Id: number;
    ASMAY_Year: string;
}

export interface ITopperListRequest {
    type: 'House' | 'CS';
    asmaY_Id: number;
    asmcL_Id?: number;
    selectedhouselist?: { spccmH_Id: number }[];
    selectedSectionlist?: { asmS_Id: number }[];
    selectedeventlist?: { spccmE_Id: number }[];
    selectedsportslist?: { spccmscC_Id: number }[];
}
