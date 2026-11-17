export interface IFeeAcademicYearDropdownList {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

export interface IFeeGroupDropdownList {
    fmG_Id: number;
    fmG_GroupName: string;
}

export interface IFeeTermDropdownList {
    fmT_Id: number;
    fmT_Name: string;
}

export interface IFeeBusRouteDropdownList {
    trmR_Id: number;
    trmR_RouteName: string;
}

export interface IFeeCustomGroupDropdownList {
    fmgG_Id: number;
    fmgG_GroupName: string;
}

export interface IFeeClassDropdownList {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface IFeeSectionDropdownList {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface IFeeAuditReport {
    feeGroup: string;
    totalDue: number;
}

export interface IFeeDefaulterReportRow {
    feeGroup: string;
    totalDue: number;
    fsS_CurrentYrCharges: number;
    fsS_TotalToBePaid: number;
    fsS_ToBePaid: number;
    fsS_PaidAmount: number;
    fsS_ConcessionAmount: number;
    fsS_AdjustedAmount: number;
    fsS_WaivedAmount: number;
    fsS_RefundAmount: number;
    fsS_RunningExcessAmount: number;
    fsS_FineAmount: number;
}

export interface IDailyFeeCollectionResponse {
    success: boolean;
    message: string;
    data: IDailyFeeCollectionData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

export interface IDailyFeeCollectionRequest {
    AsmayId: number;
    FromDate: string;
    ToDate: string;
    Headwise?: boolean;
    Paymentwise?: boolean;
    regornamedetails?: string;
    allorstdorothersflag?: string;
    ClassFlag?: string;
    allorindivflag?: string;
    allorcorchoronlineflag?: string;
    Cheque?: string;
    TempararyArrayListstring?: string;
    GroupFlag?: string;
    All_List?: { columnID: string }[];
}

export interface IDailyFeeCollectionData {
    listCode: string;
    listName: string;
    list: any[]; // dynamic per report type
}

export interface IFeeInstallmentDropdownList {
    // fmI_Id: number;
    // fmI_Name: string;
    //  fmI_Id: number;
    // fmI_Name: string;

    fmI_Id: number;
    mI_Id: number;
    fmI_Name: string;
    fmI_No_Of_Installments: number;
    fmI_Installment_Type: string;
    fmI_ActiceFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface FeeHeadAmounts {
    [feeHeadName: string]: number;
}

export interface HeadwiseListItem {
    date: string; // ISO string: "2025-01-02T00:00:00"
    totalPaidAmount: number;
    feeHeadAmounts: FeeHeadAmounts;
}

export interface FeeDailyCollectionHeadwiseResponse {
    listCode: string;
    listName: string;
    list: HeadwiseListItem[];
}

export interface IFeeYearlyCollectionReportRow {
    slNo: number;
    studentName: string;
    classSection: string;
    admissionNo: string;
    installmentName: string;
    totalPayable: number;
    paidAmount: number;
    balance: number;
    concession: number;
    arrear: number;
    excess: number;
    charge: number;
    adjustment: number;
}

export interface HeadwiseClassCategoryDropDown {
    fmcC_Id: number;
    fhwR_ClassCategoryName: string;
}

export interface HeadwiseReportData {
    fmG_GroupName: string;
    fmH_FeeName: string;
    fmcC_ClassCategoryName: string;
    ftI_Name: string;
    amount: number;
    fmG_ActiceFlag: boolean;
    fyghM_FineApplicableFlag: string;
}

export interface IFeeTrasactionInstallmentDropdownList {
    ftI_Id: number;
    ftI_InstallmentName: string;
}

export interface IduedateReportData {
    FTI_Id: number;
    FMG_GroupName: string;
    FMH_FeeName: string;
    FMI_Name: string;
    FTI_Name: string;
    FMCC_Id: number;
    FTDD_Month: number;
    FTDD_Day: number;
    FMFS_Id: number;
    FMFS_FineType: string;
    FTFS_Id: number;
    FTFS_FineType: string;
    FTFS_Amount: number;
    FTIDD_DueDate: string;
}

export interface FeeClassCategoryReportList {
    fmG_Id: number;
    fmG_GroupName: string;
    fmH_RefundFlag: boolean;
    fmH_PDAFlag: boolean;
    fmH_SpecialFeeFlag: boolean;
    fmH_Order: number;
    fmH_FeeName: string;
    fmH_Flag: string;
    fmH_Id: number;
    asmaY_Id: number;
    fmI_Name: string;
    fyghM_FineApplicableFlag: string;
    fyghM_Common_AmountFlag: string;
    ftI_Id: number;
    ftI_Name: string;
    fmI_Id: number;
    ftidD_ApplicableDate: string;
    ftidD_DueDate: string;
    ftidD_FromDate: string;
    ftidD_ToDate: string;
    fmfS_Id: number;
    fmfS_FineType: string;
    fmfS_FromDay: number;
    fmfS_ToDay: number;
    fmfS_ECSFlag: string;
    fmfS_ActiveFlag: boolean;
    mI_Id: number;
    fmcC_ClassCategoryName: string;
    asmC_SectionName: string;
    asmcL_Id: number;
    asmS_Id: number;
    asmcL_ClassName: string;
    fmcC_Id: number;
    normalizedUserName: string;
    ivrmrT_Role: string;
    user_Id: number;
    fmT_Id: number;
    fmT_Name: string;
    fmA_Amount: number;
    fmA_Id: number;
    ftfS_Amount: number;
    ftddE_Month: string;
    fmgG_GroupName: string;
    fmgG_Id: number;
}

export interface IFeeMonthsListDropdown {
    ivrM_Month_Id: number;
    ivrM_Month_Name: string;
}

export interface FeeMonthEndData {
    cashCount: number;
    bankCount: number;
    onlineCount: number;
    rtgs: number;
    cardCount: number;
    ecs: number;
    defaulters: number;
    refund: number;
    refundBank: number;
    smsCount: number;
    emailCount: number;
}

export interface IFeeMonthsListDropdown {
    ivrM_Month_Id: number;
    ivrM_Month_Name: string;
}

export interface ConsolidatedReportInstallemntDropdownList {
    ftI_Id: number;
    ftI_Name: string;
}

export interface IFeeReceiptReportHeadDropdownList {
    fmH_Id: number;

    fmH_FeeName: string;
}

export interface IInstallmentReportFeeTermDropdownList {
    fmT_Id: number;
    mI_Id: number;
    fmT_Name: string;
    fmT_ActiveFlag: boolean;
    fromMonth?: number | null;
    toMonth?: number | null;
    fmT_Order?: number | null;
    fmT_Year?: number | null;
    transport_FromMonth?: number | null;
    transport_ToMonth?: number | null;
    fmT_IncludeArrearFeeFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IInstallmentReportFeeCategoryDropdownList {
    fmcC_Id: number;
    mI_Id: number;
    fmcC_ClassCategoryName: string;
    fmcC_ClassCategoryCode: string;
    fmcC_ActiveFlag: boolean;
    fmcC_CreatedBy: number;
    fmcC_UpdatedBy: number;
    createdDate: string;
    updatedDate: string;
}

export interface InstallmentReportInstallemntDropdownList {
    ftI_Id: number;
    ftI_Name: string;
}

export interface InstallmentReportGroupDropdownList {
    fmG_Id: number;
    fmg_groupname: string;
}

export interface IInstallmentReportFeeBusRoutrDropdownList {
    trmR_Id: number;
    mI_Id?: number;
    trmA_Id?: number;
    trmR_RouteName: string;
    trmR_RouteNo?: string;
    trmR_RouteDesc?: string;
    trmR_ActiveFlg: boolean;
    trmR_order?: number;
    createdDate?: string;
    updatedDate?: string;
}

export interface InstallmentReportHeadDropdownList {
    fmH_Id: number;
    fmH_FeeName: string;
}

export interface ReceiptReportStudentDropdownList {
    amst_Id: number;
    studentName: string;
}

export interface ReceiptReportReceiptDropdownList {
    fyp_id: number;
    fyp_receipt_no: string;
}

export interface FeeReceiptRecord {
    fyP_Id: number;
    amsT_Id: number;
    asmaY_Id: number;
    studentName: string;
    amsT_FatherName: string;
    amsT_RegistrationNo: string;
    amsT_AdmNo: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    fyP_Receipt_No: string;
    fyP_DOE: string;
    fmH_FeeName: string;
    fyP_TransactionTypeFlag: string;
    amount: number;
    asmcL_Id: number;
    asmS_Id: number;
}

export interface InstallmentReportData {
    amsT_AdmNo: string;
    amsT_Id: number;
    amsT_FirstName: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmS_Id: number;
    asmC_SectionName: string;
    ftI_Id: number;
    ftI_Name: string;
    balance: number;
    paid: number;
    concession: number;
    waivedoff: number;
    fine: number;
    netamount: number;
    amaY_RollNo: number;
}

export interface FeeStudenttermWisePaidReport {
    studentName: string;
    className: string;
    sectionName: string;
    admNo: string;
    termAmounts: FeeStudenttermWisePaidReportTermAmounts;
    total: number;
}

export interface FeeStudenttermWisePaidReportTermAmounts {
    [key: string]: number;
}

export interface ExcelNotImportedStudentDetailsReport {
    academicyear: string;
    admissionNo: string;
    paiddate: string;
    amount: number;
    remarks: string;
    paymentmode: string;
    id: number;
    feipsT_Id: number;
    mI_Id: number;
    asmaY_Id: number;
    amsT_Id: number;
    feipsT_Date: string;
    feipsT_ActiveFlg: boolean;
    asmaY_Year: string;
    feipsT_Remarks: string;
    feipsT_PayementMode: string;
    feipsT_Amount: number;
    amsT_AdmNo: string;
}

export interface IFeeYearlyCollectionReport {
    id: number;
    fmg_groupname: string;
    fmh_feename: string;
    fss_paidamount: number;
    balance: number;
    concession: number;
    waived: number;
    rebate: number;
    fine: number;
    totalpayable: number;
    adjusted: number;
    excess: number;
    runningexcess: number;
    studentname: string;
    asmcl_classname: string;
    amst_admno: string;
    openingbalance: number;
    mobileNo: number;
    asmcl_id: number;
    asms_id: number;
    fmh_id: number;
    fmt_id: number;
    fmt_name: string;
    arrear: number;
    paid: number;
    payable: number;
    charges: number;
    amsT_Id: number;
    ftI_Id: number;
    ftI_Name: string;
    charge: number;
    studentName: string;
    asmcL_ClassName: string;
    amsT_AdmNo: string;
    amst_Id: number;
    fmt_Id: number;
    fmt_Name: string;
    asmcl_ClassName: string;
    amst_AdmNo: string;
    fma_Id: number;
    amst_FatherName: string;
    amst_FatherMobileNo: string;
    cdNetAmount: number;
    cdPaidAmount: number;
    cdBalanceAmount: number;
    refund: number;
    fmcc_classcategoryname: string;
    bybank: number;
    bycash: number;
    byonline: number;
    bycard: number;
    byecs: number;
    byrtgs: number;
    asmc_sectionname: string;
    totalcharges: number;
    totalbalance: number;
    totalpaid: number;
    totalconcession: number;
    totalwaivedoff: number;
    totalrefund: number;
    adjustment: number;
    amst_mobileno: string;
}

export interface IFeeYearlyStudentTermWiseReport {
    id: number;
    amst_Id: number;
    fmt_Id: number;
    fmt_Name: string;
    arrear: number;
    excess: number;
    balance: number;
    paid: number;
    payable: number;
    concession: number;
    charges: number;
    studentName: string;
    asmcl_ClassName: string;
    fma_Id: number;
    amst_FatherName: string;
    amst_FatherMobileNo: string;
    waived: number;
    adjusted: number;
    refund: number;
    cdNetAmount: number;
    cdPaidAmount: number;
    cdBalanceAmount: number;
}

export interface IFeeConcessionCustomGroupDropdownList {
    fmgG_Id: number;
    fmg_groupname: string;
}

export interface IFeeConcessionReport {
    id: number;
    studentname: string;
    reportname: number;
    fss_paidamount: string;
    balance: number;
    concession: number;
    waived: number;
    rebate: number;
    fine: number;
    classname: string;
    sectionname: string;
}
