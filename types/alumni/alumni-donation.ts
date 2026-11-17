export interface IAlumniDonationDetails {
    almsT_FirstName: string;
    almsT_LastName: string | null;
    almsT_RegistrationNo: string;
    almsT_AdmNo: string;
    almsT_MobileNo: string | number;
    almsT_emailId: string;
    almsT_StudentPhoto: string | null;
    almsT_Id: number;
    alsreG_Id: number;
    leftyear: string | null;
    classleft: string | null;
    almsT_ConStreet: string | null;
    almsT_ConArea: string | null;
    almsT_ConCity: string | null;
    almsT_District: string | null;
    ivrmmS_Name: string | null;
    ivrmmC_CountryName: string | null;
    almsT_ConPincode: string | number | null;
    almsT_StudentPANCard: string | null;
    almsT_FatherName: string | null;
}

export interface IDonationCategory {
    almdoN_Id: number;
    almdoN_DonationName: string;
    almdoN_Amount: number;
    almdoN_RegistrationFeeFlag: boolean;
}

export interface IPaymentGateway {
    fpgD_Id: number;
    fpgD_PGName: string;
    fpgD_Image: string;
}

export interface IAlumniDonationLoadResponse {
    almdetails: IAlumniDonationDetails[];
    fillalumnidonationdetails: IDonationCategory[];
    fillpaymentgateway: IPaymentGateway[];
    imagenew: string;
    mI_Id: number;
    asmaY_Id: number;
}

export interface IPaymentGatewayDetails {
    paymentgateway: {
        fpgD_SaltKey: string;
        fpgD_AuthorisationKey: string;
    }[];
    orderId: string;
    institution: {
        mI_Name: string;
        mI_PAN: string;
        mI_Logo: string;
    }[];
    mI_PAN?: string; // Sometimes directly on the object
    mI_Name?: string;
    mI_Logo?: string;
}
