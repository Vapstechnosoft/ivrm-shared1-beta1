export interface SportHouseCommitteeReportData {
    id: number;
    asmaY_Year: string;
    spccmhD_DesignationName: string;
    spccmH_HouseName: string;
    studentname: string;
    amsT_AdmNo: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    spccmhC_ContactNo: string;
    spccmhC_EmailId: string;
}

export interface SportHouseCommitteeReportProps {
    searchParams: { [key: string]: string | string[] | undefined };
}
