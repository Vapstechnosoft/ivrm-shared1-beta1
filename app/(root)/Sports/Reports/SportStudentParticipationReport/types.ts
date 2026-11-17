export interface SportStudentParticipationReportData {
    id: number;
    AMST_AdmNo: string;
    AMST_Name: string;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    SPCCMH_HouseName: string;
    AMST_DOB: string;
    SPCCMCL_CompitionLevel: string;
    SPCCMSCC_SportsCCName: string;
    SPCCE_StartDate: string;
}

export interface SportStudentParticipationReportProps {
    searchParams: { [key: string]: string | string[] | undefined };
}
