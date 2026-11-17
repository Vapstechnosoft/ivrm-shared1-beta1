import type { IAlumniAcademicYear, IAlumniClass } from './alumni-search';

export interface ICountry {
    ivrmmC_Id: number;
    ivrmmC_CountryName: string;
    selected?: boolean;
}

export interface IState {
    ivrmmS_Id: number;
    ivrmmS_Name: string;
    selected?: boolean;
}

export interface IDistrict {
    ivrmmD_Id: number;
    ivrmmD_Name: string;
    selected?: boolean;
}

export interface ICity {
    id: number;
    city: string;
}

export interface IOccupation {
    id: number;
    designation: string;
}

export interface IAlumniReportInitialData {
    yearList: IAlumniAcademicYear[];
    classList: IAlumniClass[];
    countrylist: ICountry[];
    citylist: { almsT_ConCity: string }[];
    occupationlist: { designation: string }[];
}

export interface IAlumniReportSearchPayload {
    Occupation: string;
    city: string;
    statelistarray: { IVRMMS_Id: number }[];
    classlistnew: { ASMCL_Id: number }[];
    countrylistarray: { IVRMMC_Id: number }[];
    districtlistarray: { IVRMMD_Id: number }[];
    multipleBatchs: { ASMAY_Id: number }[];
}

export interface IAlumniReportResultItem {
    almst_Id: number;
    amsT_FirstName: string;
    amsT_DOB: string;
    ALMST_FatherName: string;
    amsT_MobileNo: string;
    amsT_emailId: string;
    ASMAY_Id_Join: string;
    ASMAY_Id_Left: string;
    JoinClass: string;
    LeftClass: string;
    ALMST_MembershipId: string;
    ALMMC_MembershipCategory: string;
    IVRMMD_Name: string;
    amsT_BloodGroup: string;
    ALSPR_Designation: string;
    city: string;
    ALMST_FullAddess: string;
    ALMST_ConPincode: string;
    ALMST_PerPincode: string;
    ASMAY_Id_NEW_Left?: string;
    selected?: boolean;
}

export interface IAlumniReportResponse {
    searchstudentDetails: IAlumniReportResultItem[];
}
