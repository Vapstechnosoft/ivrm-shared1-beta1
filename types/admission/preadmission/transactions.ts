export interface IReligionDropdown {
    ivrmmR_Id: number;
    ivrmmR_Name: string;
}
export interface ICasteDropdown {
    imC_Id: number;
    imC_CasteName: string;
}
export interface ICountryDropdown {
    ivrmmC_Id: number;
    ivrmmC_CountryName: string;
    ivrmmC_CountryPhCode: string;
    ivrmmC_ZipNoLength: number;
}
export interface IStateDropdown {
    ivrmmS_Id: number;
    ivrmmS_Name: string;
}
export interface IDistrictDropdown {
    ivrmmD_Id: number;
    ivrmmD_Name: string;
}
export interface IMasterCategoryDropDown {
    amC_Id: number; // NOTE: Backend returns 'amC_Id' but frontend often expects 'imC_Id'. Keeping consistent with API response.
    amC_Name: string;
}
export interface IGenderDropdown {
    ivrmmG_Id: number;
    ivrmmG_GenderName: string;
}
export interface ISourceDropdown {
    pamS_Id: number;
    pamS_SourceName: string;
}
export interface IReferenceDropdown {
    pamR_Id: number;
    pamR_ReferenceName: string;
}
export interface IPreadmissionDocumentDropdown {
    amsmD_Id: number;
    amsmD_DocumentName: string;
    amsmD_FLAG: boolean;
}
export interface IPreadmissionClassDropdown {
    asmcL_Id: number;
    asmcL_ClassCode: string;
    asmcL_ClassName: string;
    asmcL_Order: number;
    asmcL_MinAgeYear: number;
    asmcL_MinAgeMonth: number;
    asmcL_MinAgeDays: number;
    asmcL_MaxAgeYear: number;
    asmcL_MaxAgeMonth: number;
    asmcL_MaxAgeDays: number;
    asmcL_MaxCapacity: number;
}
export interface IActivePreadmissionDetails {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_AcademicYearCode: string;
    asmaY_PreAdm_F_Date: string;
    asmaY_PreAdm_T_Date: string;
}
export interface IPreadmissionApplicationList {
    pasr_id: number;
    pasR_RegistrationNo: string;
    student_name: string;
    pasR_Sex: string;
    applied_class_name: string;
    current_status: string;

    document_download: string;

    applied_by: string;
}

export interface IPreadmissionAdmissionStatusDropdown {
    pamsT_Id: number;
    pamsT_Status: string;
    pamsT_StatusFlag: string;
}
export interface IPreadmissionStudentApplicationList {
    pasr_id: number;
    asmay_id: number;
    pasR_RegistrationNo: string;
    student_name: string;
    pasR_Sex: string;
    applied_class_name: string;
    is_fee_applicable: number;
    payment_status: number;
    application_status: string;
    admission_status: string;
    applied_by: string;
    pasR_ActiveFlag: number;
}
export interface IInitiatePaymentResponse {
    payment_url: string;
    transaction_id: string;
    amount: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    form_data: PaymentFormData;
    html_form: string;
}
export interface PaymentFormData {
    split_payments: string;
    sub_merchant_id: string;
    udf7: string;
    udf10: string;
    txnid: string;
    firstname: string;
    hash: string;
    udf5: string;
    udf2: string;
    udf8: string;
    udf1: string;
    udf6: string;
    productinfo: string;
    udf4: string;
    show_payment_mode: string;
    furl: string;
    key: string;
    surl: string;
    email: string;
    phone: string;
    amount: string;
    udf9: string;
    udf3: string;
}
export interface IPreadmissionStatusCountReport {
    registered_applications: number;
    application_not_filled: number;
    application_filled: number;
    application_fee_applicable: boolean;
    payment_pending: number;
    payment_completed: number;
    admission_transferred: number;
}

export interface IPreadmissionDocumentView {
    document_download: any;
    student_photo: any;
    asmaY_Id: number;
    asmcl_id: number;
    academic_year: string;
    class_name: string;
    pasr_id: number;
}
