export interface IFeeAmountEntryList {
    fmA_Id: number;
    fmG_GroupName: string;
    asmaY_Year: string;
    fmcC_ClassCategoryName: string;
    fmH_FeeName: string;
    ftI_Name: string;
    fmA_Amount: number;
    fmA_CreatedDate: string;
    asmaY_Id: number;
}

export interface IFeeGroupDropDownList {
    fmG_Id: number;
    fmG_GroupName: string;
}

export interface IFeeClassCategoryDropDownList {
    fmcC_Id: number;
    fmcC_ClassCategoryName: string;
}

export interface IFeeAcademicyearDropDownList {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order: number;
}
export interface IFeeOpeningAcademicyearDropDownList {
    miid: number;
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order: number;
}
export interface IFeeOpeningClassDropdownList {
    mI_Id: number;
    asmcL_Id: number;
    asmcL_ClassName: string;
    // asmcL_MinAgeYear: number;
    // asmcL_MinAgeMonth: number;
    // asmcL_MinAgeDays: number;
    // asmcL_MaxAgeYear: number;
    // asmcL_MaxAgeMonth: number;
    // asmcL_MaxAgeDays: number;
    // asmcL_Order: number;
    // asmcL_ClassCode: string;
    // asmcL_ActiveFlag: boolean;
    // asmcL_MaxCapacity: number;
    // asmcL_PreadmFlag: number;
}

export interface IFeeOpeningSectionDropdownList {
    asmS_Id: number;
    asmC_SectionName: string;
}
export interface IFeeOpeningHeadDropDownList {
    fmH_Id: number;
    fmH_FeeName: string;
}
export interface IFeeOpeningCategoryDropDownList {
    fmcC_Id: number;
    fmcC_ClassCategoryName: string;
}
export interface IFeeOpeningGroupDropdownList {
    fmG_Id: number;
    fmG_GroupName: string;
}
export interface IFeeOpeningInstallmentDropdownList {
    ftI_Id: number;
    ftI_Name: string;
}

export interface IMasterAmountEntryDetails {
    fmA_Id: number;
    fmH_Id: number;
    ftI_Id: number;
    fmG_GroupName: string;
    fmH_FeeName: string;
    fmI_Name: string;
    fmA_Amount: number;
    ftddE_Day: string;
    ftddE_Month: string;
    ftdD_Day: string;
    ftdD_Month: string;
    fmA_DueDate: string;
    ftddE_DueDate: string;
    viewFine: boolean;
    addFine: boolean;
    fmA_PartialRebateApplicableDate: string;
    fyghM_FineApplicableFlag?: string;
}

export interface TAmountEntryStThomasInstallment {
    ftI_Id: number;
    fmH_Id: number;
    ftI_Name: string;
}

export interface IFeeTransactionWaivedOffList {
    mi_id: number;
    academicYear: string;
    class?: string | null;
    section?: string | null;
    student?: string | null;
    date?: string;
    refundableType: 'Refundable' | 'NonRefundable';
    activeType: 'FineWaiveOff' | 'CompleteFineWaiveOff';
    remarks: string;
    nameFormat: 'NameReg.No' | 'Reg.NoName';
    groupList: string[];
}

// export interface IFeeOpeningBalanceList {
//     mi_id: number;
//     selectionType: 'T' | 'G' | 'C';
//     academicYear: string;
//     category?: string | null;
//     class?: string | null;
//     section?: string | null;
//     student?: string | null;
//     feeHead?: string | null;
//     feeGroup?: string | null;
//     feeInstallments?: string[];
//     date?: string;
//     refundableType: 'Refundable' | 'NonRefundable';
//     activeType: 'Active' | 'Left';
//     pdaorfeeType: 'Fees';
//     nameFormat: 'NameReg.No' | 'Reg.NoName';
// }

export interface IFeeThirdPartyTransaction {
    fyptP_Id: number;
    fyptP_Name: string;
    fmH_FeeName: string;
    fmH_Id: number;
    fyP_Receipt_No: string;
    fyP_Bank_Name: string;
    fyP_Bank_Or_Cash: string;
    fyP_Tot_Amount: number;
    fyP_DD_Cheque_No: string;
    fyP_Id: number;
    fyP_Date: string;
    asmaY_Year: string;
    fyptP_Towards: string;
    mI_Id: number;
    asmaY_Id: number;
}

export interface IFeeThirdPartyTransactionGroupDropDown {
    fmG_Id: number;
    fmG_GroupName: string;
}

export interface IFeeThirdPartyTransactionHeadDropDown {
    fmH_Id: number;
    fmH_FeeName: string;
}

export interface IFeeBankDetails {
    fmbanK_Id: number;
    mI_Id: number;
    fmbanK_BankName: string;
    fmbanK_BankDescription: string;
    fmbanK_ActiveFlg: boolean;
    fmbanK_CreatedDate: string;
    fmbanK_UpdatedDate: string;
    fmbanK_CreatedBy: number;
    fmbanK_UpdatedBy: number;
}

export interface IFeePreAdmissionTransactionDetails {
    pasR_Id: number;
    slno: number;
    fyP_Id: number;
    studentName: string;
    studentRegNo: string;
    studentMobile: number;
    paidAmount: number;
    studentEmail: string;
    receiptNo: string;
    paidDate: string;
    modeOfPayment: string;
}

export interface IFeePreAdmissionStudentsDropDownList {
    amsT_Id: number;
    studentName: string;
    prospectusNo: string;
}

export interface IFeePreAdmissionStudentInformation {
    studentId: number;
    studentName: string;
    regNo: string;
    className: string;
    mobileNo: string;
    emailId: string;
    fatherName: string;
    academicYear: string;
    filterType: string;
}

export interface IFeePreAdmissionStudentTermsDetails {
    fmT_Id: number;
    fmT_Name: string;
}

export interface IFeePreAdmissionTransactionDetails {
    mI_Id: number;
    asmaY_Id: number;
    amsT_Id: number;
    pasR_Id: number;
    fmG_Id: number;
    fmH_Id: number;
    ftI_Id: number;
    fmA_Id: number;
    fyP_Id: number;
    termId: number;

    // New field names from backend
    fmG_GroupName: string;
    fmH_FeeName: string;
    ftI_Name: string;

    currentYrCharges: number;
    totalCharges: number;
    concessionAmount: number;
    fineAmount: number;
    toBePaid: number;
    netAmount: number;

    fmH_Order?: number;

    // Optional for UI
    className?: string;
    academicYear?: string;
    bankName?: string;
    chequeNo?: string;
}

export interface IFeeTransactionApiResponse {
    success: boolean;
    message: string;
    total: number;
    data: {
        feeTransactions: IFeePreAdmissionTransactionDetails[];
    };
}

// export interface Ifeetransaction {
//     amsT_FirstName: string;
//     amsT_MiddleName: string | null;
//     amsT_LastName: string | null;

//     classname: string;
//     sectionname: string;
//     amsT_AdmNo: string;

//     fyP_Receipt_No: string;
//     fyP_Date: string; // or Date
//     fyP_Tot_Amount: number;
//     fyP_Bank_Or_Cash: string; // example: 'C', 'O'
//     fyP_Chq_Bounce: string | null; // 'CL', 'CB', null

//     fyP_Id: number;
//     amst_Id: number;
// }

export interface Ifeetransaction {
    amsT_FirstName: string;
    amsT_MiddleName: string | null;
    amsT_LastName: string | null;

    classname: string;
    sectionname: string;
    amsT_AdmNo: string;

    fyP_Receipt_No: string;
    fyP_Date: string; // or Date
    fyP_Tot_Amount: number;
    fyP_Bank_Or_Cash: string; // example: 'C', 'O'
    fyP_Chq_Bounce: string | null; // 'CL', 'CB', null

    fyP_Id: number;
    amst_Id: number;
    asmaY_ID: number;
    asmaY_Year: string;
}

export interface IStudentDropdown {
    amst_Id: number;
    studentName: string;
    amsT_FirstName: string;
}

export interface IStudentInfo {
    studentName: string;
    admNo: string;
    className: string;
    section: string;
    mobile: string;
    photo?: string;
}

export interface IStudentTerm {
    fmT_Id: number;
    fmT_Name: string;
    fmG_GroupName: string;
}

export interface ITransactionRow {
    fmA_Id: number;
    fmH_Id: number;
    fmH_FeeName: string;
    ftI_Id: number;
    ftI_Name: string;
    fmG_Id: number;
    totalamount: number;
    fsS_TotalToBePaid: number;
    fsS_ConcessionAmount: number;
    fsS_FineAmount: number;
    fsS_OBArrearAmount: number;
    fsS_ToBePaid: number;
    fsS_TotalToBePaidaddfine: number;
    fsS_RebateAmount: number;
}

export interface IPaymentMode {
    ivrmmoD_Id: number;
    ivrmmoD_ModeOfPayment: string;
    ivrmmoD_Flag: 'B' | 'C';
    Bank_Date?: string;
    Bank_No?: string;
    Bank_Name?: string;
    Bank_Amount?: number;
}

export interface INarration {
    fmnaR_Id: number;
    fmnaR_Narration: string;
}

export interface IFeeThirdPartyTransactionStudentDetails {
    mI_Id: number;
    amsT_Id?: number;
    asmaY_Id: number;
    amsT_FirstName?: string;
    amsT_MiddleName?: string;
    amsT_LastName?: string;
    returnval: boolean;
    fmH_Id: number;
    fyptP_Towards: string;
    fmH_FeeName: string | null;
    fmG_Id: number;
    fmG_GroupName: string | null;
    fmH_Order: number;
    studntlist: any | null;
    fyP_Id: number;
    fyP_Receipt_No: string | null;
    fyptP_Id: number;
    fyP_Bank_Name: string | null;
    fyP_DD_Cheque_No: string | null;
    user_id: number;
    fyP_Bank_Or_Cash: string;
    fyP_DD_Cheque_Date: string; // API returns "0001-01-01T00:00:00"
    fyP_Date: string;
    fyP_Tot_Amount: number;
    fyP_Remarks: string;
    fyptP_Name: string | null;
    stdetails: any | null;
    alldata: any | null;
    ftP_TotalPaidAmount: number;
    dulicate: boolean;
    ftI_Id: number;
    ftI_Name: string | null;
    fmA_Id: number;
    fsS_ToBePaid: number;
}

export interface INumberGeneration {
    imN_Id: number;
    mI_Id: number;
    imN_AutoManualFlag: string;
    imN_DuplicatesFlag: string;
    imN_StartingNo: string;
    imN_WidthNumeric: string;
    imN_ZeroPrefixFlag: string;
    imN_PrefixAcadYearCode: boolean;
    imN_PrefixParticular: string;
    imN_SuffixAcadYearCode: boolean;
    imN_SuffixParticular: string;
    imN_RestartNumFlag: string;
    imN_Flag: string;
    imN_PrefixFinYearCode: boolean;
    imN_PrefixCalYearCode: boolean;
    imN_SuffixFinYearCode: boolean;
    imN_SuffixCalYearCode: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IThirdPartyTransactionEditdata {
    mI_Id: number;
    amsT_Id: number;
    asmaY_Id: number;
    amsT_FirstName: string | null;
    amsT_MiddleName: string | null;
    amsT_LastName: string | null;
    returnval: boolean;
    fmH_Id: number;
    fyptP_Towards: string;
    fmH_FeeName: string | null;
    fmG_Id: number;
    fmG_GroupName: string | null;
    fmH_Order: number;
    studntlist: any | null; // you can type it properly if you know the structure
    fyP_Id: number;
    fyP_Receipt_No: string;
    fyptP_Id: number;
    fyP_Bank_Name: string;
    fyP_DD_Cheque_No: string;
    user_id: number;
    fyP_Bank_Or_Cash: string;
    fyP_DD_Cheque_Date: string; // or Date
    fyP_Date: string; // or Date
    fyP_Tot_Amount: number;
    fyP_Remarks: string;
    fyptP_Name: string;
    stdetails: any | null;
    alldata: any | null;
    ftP_TotalPaidAmount: number;
    dulicate: boolean;
    ftI_Id: number;
    ftI_Name: string | null;
    fmA_Id: number;
    fsS_ToBePaid: number;
}

export interface IFeeSectionList {
    asmS_Id: number;
    mI_Id: number;
    asmC_SectionName: string;
    asmC_SectionCode: string;
    asmC_Order: number;
    asmC_ActiveFlag: number;
    asmC_MaxCapacity: number;
    createdDate: string;
    updatedDate: string;
}

export interface IFeeClassList {
    asmcL_Id: number;
    mI_Id: number;
    asmcL_ClassName: string;
    asmcL_MinAgeYear: number;
    asmcL_MinAgeMonth: number;
    asmcL_MinAgeDays: number;
    asmcL_MaxAgeYear: number;
    asmcL_MaxAgeMonth: number;
    asmcL_MaxAgeDays: number;
    asmcL_Order: number;
    asmcL_ClassCode: string;
    asmcL_ActiveFlag: boolean;
    asmcL_MaxCapacity: number;
    asmcL_PreadmFlag: number;
    asmcL_StreamFlg: string | null;
    asmcL_CreatedBy: string | null;
    asmcL_UpdatedBy: string | null;
    createdDate: string;
    updatedDate: string;
}

export interface feeTransactionWaivedOffGrid {
    fswO_Id: number;
    amsT_FirstName: string;
    amsT_MiddleName: string;
    amsT_LastName: string;
    fmH_FeeName: string;
    ftI_Name: string;
    fswO_WaivedOffAmount: number;
    fswO_Date: string;
    mI_Id: number;
    asmaY_Id: number;
    amsT_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    fswO_WaivedOffRemarks: string;
    fmG_Id: number;
    fmH_Id: number;
    fswO_FineFlg: number;
    fswO_FullFineWaiveOffFlg: number;
    ftI_Id: number;
    fmA_Id: number;
}
export interface feeTransactionWaivedOffStudentDetails {
    amsT_RegistrationNo: number;
    studentName: string;
    amsT_Id: number;
}

export interface feeTransactionWaivedOffGroup {
    fmG_Id: number;
    fmG_GroupName: string;
}

export interface feeTransactionWaivedOffHead {
    fmH_Id: number;
    fmH_FeeName: string;
    ftI_Id: number;
    ftI_Name: string;
    fmG_Id: number;
    fmA_Id: number;
    totalTobepaid: number;
    tobepaid: number;
    fsS_PaidAmount: number;
    waivedOff: number;
}

export interface IFeeOpeningBalance {
    amst_Id: number;
    amsT_FirstName: string;
    amsT_MiddleName?: string;
    amsT_LastName?: string;
    fmoB_Id: number;
    asmay_id: number;
    fmoB_EntryDate: string;
    fmoB_Student_Due: number;
    fmoB_Institution_Due: number;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    asmaY_Year?: string;
}

export interface IFeeOpeningPDA {
    tempararyArrayListnew: string;
    tempararyArrayhEADListnew: string;
    savetmpdata: string;
    mI_ID: 0;
    admsudentslist: string;
    acayear: string;
    busroutelist: string;
    classlist: string;
    sectionlist: string;
    grouplist: string;
    headlist: string;
    filterrefund: string;
    amst_Id: number;
    amsT_FirstName: string;
    amsT_MiddleName: string;
    amsT_LastName: string;
    asmay_id: number;
    asmcL_Id: number;
    asmS_Id: number;
    filterinitialdata: string;
    reportdatelist: string;
    fmG_Id: number;
    fmH_Id: number;
    ftI_Id: number;
    fmH_FeeName: string;
    checkedgrplst: false;
    checkedheadlst: false;
    fsscount: number;
    savegrplst: string;
    saveheadlst: string;
    asmayidpss: number;
    typeofrpt: string;
    datepass: string;
    fillbusroutestudents: string;
    fillclasflg: number;
    fillseccls: number;
    studenttype: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    fmoB_Id: number;
    fmoB_EntryDate: string;
    fmoB_Student_Due: number;
    fmoB_Institution_Due: number;
    checkedvalue: boolean;
    returnval: boolean;
    returntxt: string;
    class_Category_List: string;
    fmcC_Id: number;
    searchType: string;
    searchtext: string;
    searchnumber: number;
    userid: number;
    fillmastergroup: string;
    fillmasterhead: string;
    fillinstallment: string;
    studentName: string;
}
export interface IFeeOpeningRefundable {
    fmH_Id: number;
    fmH_FeeName: string;
}

export interface IFeeOpeningBalanceList {
    amst_Id: number;
    amsT_FirstName: string;
    amsT_MiddleName?: string;
    amsT_LastName?: string;
    fmoB_Id: number;
    asmay_id: number;
    fmoB_EntryDate: string;
    fmoB_Student_Due: number;
    fmoB_Institution_Due: number;
    asmcL_ClassName: string;
    asmC_SectionName: string;

    fmC_Id?: number;
    studentName: string;
}

export type OpeningBalanceRow = {
    amsT_FirstName?: string;
    amsT_MiddleName?: string;
    amsT_LastName?: string;
    asmcL_ClassName?: string;
    asmC_SectionName?: string;
    fmoB_Student_Due?: number;
    fmoB_Institution_Due?: number;
    fmoB_EntryDate?: string;
    asmay_id?: number;
    fmC_Id?: number;
    amst_Id?: number;
    fmoB_Id?: number;
    [key: string]: any;
};

export interface IfeeConcession {
    fmcC_Id: number;
    fmcC_ClassCategoryName: string;
    fmH_Id: number;
}

// export interface FeeConcessionTermDropdown {
//     fmT_Id: number;
//     fmT_Name: string;
//     fmT_Order: number;
//     isChecked: boolean;
//     asmaY_Id: number;
// }

export interface FeeConcessionTermDropdown {
    fmG_Id: number;
    fmG_GroupName: string;
}

export interface IFeeConcessionAcademicyearDropDownList {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order: number;
    is_Active: boolean;
}
export interface IStudentSearchList {
    amst_Id: number;
    amsT_StudentName: string;
}

export interface IStudentTermList {
    checked: boolean;
    fmG_Id: number;
    fmG_GroupName: string;
    fmT_Id: number;
    disablepaisterms: boolean;
}

export interface IStudentTDetails {
    amst_Id: number;
    amsT_FirstName: string;
    amsT_MiddleName: string;
    amsT_LastName: string;
    amsT_RegistrationNo: string;
    amsT_AdmNo: string;
    amaY_RollNo: number;
    classname: string;
    sectionname: string;
    fathername: string;
    studentdob: string;
    amst_mobile: number;
    amsT_Photoname: string;
    username: string;
}

export interface IFeeTDetails {
    fsS_CurrentYrCharges: number;
    fmG_GroupName: string;
    fsS_TotalToBePaid: number;
    fsS_ToBePaid: number;
    fsS_PaidAmount: number;
    fsS_ConcessionAmount: number;
    fsS_AdjustedAmount: number;
    fsS_WaivedAmount: number;
    fsS_RefundAmount: number;
    fmG_Id: number;
    fsS_RunningExcessAmount: number;
    fsS_FineAmount: number;
    portalusername: string;
    ftP_Paid_Amt: number;
    ftP_Concession_Amt: number;
}

export interface IFeeRefundableList {
    amst_Id: number;
    studentName: string;
    admisionNo: string;
    voucherNo: string;
    refundedAmount: number;
    modeOfPayment: string;
    fr_Date: string;
    fR_ID: number;
    asmay_id: number;
}

export interface IFeeConcessionClassDropDownList {
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmcL_Order: number;
}
export interface IFeeConcessionCategoryDropDownList {
    fmcC_Id: number;
    fmcC_ConcessionName: string;
}

// export interface IFeeConcessionHeadList {
//     slno: number;
//     fmH_Id: number;
//     fmH_FeeName: string;
//     fmI_Id: number;
//     fmI_Name: string;
//     fmA_Amount: number;
//     isSelected: boolean;
// }

export interface IFeeConcessionHeadList {
    fmH_FeeName: string;
    ftI_Name: string;
    ftI_Id: number;
    fmH_Id: number;
    fmA_Amount: number;
    fmA_Id: number;
    fmG_Id: number;
    amsT_Id: number;
    fmT_Id: number;
}

export interface IFeeConcessionStudentList {
    slno: number;
    amsT_Id: number;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amsT_FirstName: string;
    amsT_MiddleName: string;
    amsT_LastName: string;
    amaY_RollNo: number;
    asmcL_ClassName?: string;
    isSelected: boolean;
}

export interface IFeeConcessionStudentConcessionGrid {
    slno: number;
    fmI_Id: number;
    amsT_Id: number;
    studentName: string;
    amsT_AdmNo: number;
    asmcL_ClassName: string;
    asmaY_Year: string;
    fmG_GroupName: string;
    fmH_FeeName: string;
    ftI_Name: string;
    fmcC_ConcessionName: string;
    fsC_ConcessionAmount: number;
    fsC_Id: number;
    asmaY_Id: number;
    fscI_ID: number;
    fsC_ConcessionType: string;
    fsC_ConcessionReason: string;
    fmT_Name: string;
    fmT_Id: number;
}

export interface IFeeRefundableStudentDropDownList {
    amsT_Id: number;
    studentName: string;
    amsT_AdmNo: string;
    // amsT_RegistrationNo: string;

    // amsT_MobileNo: string;
    // amsT_emailId: string;
}

export interface IFeeRefundableGroupDropDownList {
    fmG_Id: number;
    fmG_GroupName: string;
}

export interface IFeeRefundableHeadList {
    fsS_Id: number;
    fmH_ID: number;
    fmH_FeeName: string;
    ftI_Id: number;
    ftI_Name: string;
    fsS_RunningExcessAmount: number;
    fsS_RefundableAmount: number;
    fsS_RefundAmount: number;
    fmG_Id: number;
}

export interface IFeeCommonSettingConfigSet {
    fmC_GroupOrTermFlg: string;
    fmC_EableStaffTrans: number;
    fmC_EableOtherStudentTrans: number;
}

export interface IFeeConcessionStaffList {
    hrmE_EmployeeFirstName: string;
    hrmdeS_DesignationName: string;
    hrmD_DepartmentName: string;
    fmG_GroupName: string;
    fmH_FeeName: string;
    ftI_Name: string;
    fscI_ConcessionAmount: number;
    feC_Id: number;
    ftI_Id: number;
    fecI_Id: number;
}

export interface IFeeConcessionOthersList {
    fmosT_StudentName: string;
    fmosT_StudentMobileNo: number;
    fmosT_StudentEmailId: string;
    fmG_GroupName: string;
    fmH_FeeName: string;
    ftI_Name: string;
    fscI_ConcessionAmount: number;
    foC_Id: number;
    ftI_Id: number;
    focI_Id: number;
}

export interface IFeeCategoryConcessionDropDownList {
    fmcC_Id: number;
    mI_Id: number;
    fmcC_ConcessionName: string;
    fmcC_ConcessionFlag: number;
    fmcC_ConcessionApplLimit: number;
    fmcC_ActiveFlag: boolean;
    fmcC_CreatedBy: null;
    fmcC_UpdatedBy: null;
    createdDate: number;
    updatedDate: number;
}

export interface IFeeAdjustmentGridList {
    fsA_Id: number;
    fsA_Date: string;
    fsA_AdjustedAmount: number;
    studentName: string;
    fromHead: string;
    toHead: string;
    fromInstallment: string;
    toInstallment: string;
}

export interface IFeeRefundedDetails {
    amsT_ID: number;
    fmH_FeeName: string;
    fmA_Amount: number;
    fR_Date: string; // ISO string
    fR_RefundNo: string;
    fR_RefundAmount: number;
}

export interface IStudentDetails {
    amsT_FirstName: string;
    amsT_MiddleName: string;
    amsT_LastName: string;
    amsT_FatherName: string;
    amsT_MotherName: string;
    asmaY_Year: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    amsT_AdmNo: string;
    fR_RefundNo: string;
}

export interface IRefundReceiptResponse {
    feerefunded_details: IFeeRefundedDetails[];
    student_details: IStudentDetails[];
}

export interface IFeeConcessionEdit {
    asmaY_Id: number;
    asmcL_ID: number;
    classname: string;
    termname: string;
    fmT_Id: number;
    amsT_RegistrationNo: string;
    amsT_AdmNo: string;
    amsT_FirstName: string;
    fmH_Id: number;
    fmG_Id: number;
    ftI_Id: number;
    fmA_Id: number;
    fscI_ID: number;
    fsC_Id: number;
    fmH_FeeName: string;
    ftI_Name: string;
    fmA_Amount: number;
    fscI_ConcessionAmount: number;
    fsC_ConcessionType: string;
    fsC_ConcessionReason: string;
    amst_Id: number;
}

export interface IFeeConcessionAdmissionNo {
    amst_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
}

export interface IFeeConcessionStudentData {
    amsT_Id: number;
    amsT_MiddleName: string;
    amsT_LastName: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;
    asmcL_ClassName: string;
}

export interface IFeeAdjustmentGroupDropDown {
    fmG_Id: number;
    fsA_From_FMG_Id: number;
    fmG_GroupNameF: string;
}

export interface IFeeAdjustmentHeadDropDown {
    fsA_From_FMH_Id: number;
    fmH_FeeNameF: string;
    fsA_From_FTI_Id: number;
    ftI_NameF: string;
    fsA_From_FMG_Id: number;
    fsA_From_FMA_Id: number;
    fsS_RunningExcessAmount: number;
}

export interface IFeeAdjustmentGroupToDropDown {
    fsA_To_FMG_Id: number;
    fmG_GroupNameT: string;
}

export interface IFeeAdjustmentToHead {
    fsA_To_FMH_Id: number;
    fmH_FeeNameT: string;
    fsA_TO_FTI_Id: number;
    ftI_NameT: string;
    fsA_To_FMG_Id: number;
    fsA_To_FMA_Id: number;
    tobepaid: number;
}

export interface IFeeTermDetails {
    fmA_Id: number;
    fmH_FeeName: string;
    fmH_Flag: string;
    ftI_Name: string;
    fmH_Id: number;
    ftI_Id: number;
    totalamount: number;
    fsS_ToBePaid: number;
    fsS_ConcessionAmount: number;
    fsS_FineAmount: number;
    fsS_CurrentYrCharges: number;
    fsS_TotalToBePaid: number;
    fmG_Id: number;
    fmG_GroupName: string;
    fsS_OBArrearAmount: number;
    fmT_Id: number;
    fsS_RebateAmount: number;
    fsS_WaivedAmount: number;
    fsS_OBAsPerFY: number;
    fsS_AdjustedAmount: number;
}
export interface MasterNarration {
    fmnaR_Id: number;
    fmnaR_Narration: string;
}
export interface MasterModeofPayment {
    ivrmmoD_Id: number;
    ivrmmoD_ModeOfPayment: string;
    ivrmmoD_Flag: string;
    ivrmmoD_ModeOfPayment_Code: string;
    bank_Date: string;
    bank_No: string;
    bank_Amount: string;
    bank_Name: string;
    fyppM_Id: number;
}

export interface StudentPrintDetails {
    amst_id: number;
    fyp_id: number;
    student_name: string;
    fmh_id: number;
    fmh_feename: string;
    fti_id: number;
    fti_name: string;
    paid_amount: number;
    concession_amount: number;
    fine_amount: number;
    to_be_paid: number;
    fyp_date: string;
    feeAmount: number;
    asmay_Year: string;
    fmt_name: string;
}

export interface CurrentPaymentDetails {
    ftP_Paid_Amt: number;
    ftP_Concession_Amt: number;
    fyP_Date: string;
    fyP_Bank_Or_Cash: string;
    fyP_DD_Cheque_No: string;
    fyP_DD_Cheque_Date: string;
    fyP_Bank_Name: string;
    fyP_Remarks: string;
    fyppM_TotalPaidAmount: number;
    fyP_TransactionTypeFlag: string;
    fyppM_BankName: string;
    fyppM_DDChequeNo: string;
    fyppM_DDChequeDate: string;
    fyppM_TransactionId: string;
    fyppM_PaymentReferenceId: string;
    ivrmmoD_ModeOfPayment: string;
    ivrmmoD_Flag: string;
}

export interface masterBankList {
    fmbanK_Id: number;
    fmbanK_BankName: string;
}

export interface IFeeReceiptImportDelate {
    studentname: string;
    admissionnumber: string;
    date: string;
    receiptno: string;
    amount: number;
    fyP_Id: number;
}

export interface IStudentDisableList {
    paid: number;
    netAmount: number;
    balance: number;
    fmtId: number;
    fmtOrder: number;
}

// types/fees/transactions/transactions.ts
export interface IAmountEntryFineSlabDetails {
    success: boolean;
    message: string;
    data: {
        fillslab: FineSlabItem[];
        fillslabecs: FineSlabItem[];
    };
    total: number | null;
    page: number | null;
    page_size: number | null;
}

export interface FineSlabItem {
    fmfS_Id: number;
    mI_Id: number;
    fmfS_FineType: string;
    fmfS_FromDay: number;
    fmfS_ToDay: number;
    fmfS_ECSFlag: string;
    fmfS_ActiveFlag: boolean;
    fmfS_CreatedBy: number | null;
    fmfS_UpdatedBy: number;
    createdDate: string;
    updatedDate: string;
}

export interface IThirdPartyReceiptFlag {
    imN_Id: number;
    mI_Id: number;
    imN_AutoManualFlag: string;
    imN_DuplicatesFlag: string;
    imN_StartingNo: string;
    imN_WidthNumeric: string;
    imN_ZeroPrefixFlag: 'Y' | 'N';
    imN_PrefixAcadYearCode: boolean;
    imN_PrefixParticular: string;
    imN_SuffixAcadYearCode: boolean;
    imN_SuffixParticular: string;
    imN_RestartNumFlag: 'Y' | 'N';
    imN_Flag: string;
    imN_PrefixFinYearCode: boolean;
    imN_PrefixCalYearCode: boolean;
    imN_SuffixFinYearCode: boolean;
    imN_SuffixCalYearCode: boolean;
    createdDate: string; // ISO Date string
    updatedDate: string; // ISO Date string
}
