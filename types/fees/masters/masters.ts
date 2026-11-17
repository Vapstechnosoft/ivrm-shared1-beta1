export interface IMasterPaymentGatewayList {
    fpgD_Id: number;
    fpgD_AuthorisationKey: string;
    fpgD_Image: string;
    fpgD_MerchantId: string;
    fpgD_MobileActiveFlag: boolean;
    fpgD_PGName: string;
    fpgD_SaltKey: string;
    fpgD_SubMerchantId: string;
    fpgD_URL: string;
    gatewayName: string;
    fpgD_AccNo: string;
    fpgD_PGActiveFlag: string;
    fpgD_MerchantKey: string;
    submerchantIds: string;
    impG_Id: number;
}

export interface IMasterFeeYearlyRebateSettingFacade {
    fyrebseT_RebateTypeFlg: string;
    fyrebseT_RebateDate: string;
    fyrebseT_RebateAmtOrPercentValue: number;
    asmaY_Year: string;
    fyrebseT_Id: number;
    fyrebseT_ActiveId: boolean;
    asmaY_Id: number;
}

export interface IFineSlabList {
    fmfS_Id: number;
    fmfS_ToDay: number;
    fmfS_FromDay: number;
    fmfS_FineType: string;
    fmfS_ECSFlag: string;
    fmfS_ActiveFlag: boolean;
}

export interface IMasterConcession {
    fmfS_Id: number;
    fmfS_ToDay: number;
    fmfS_FromDay: number;
    fmfS_FineType: string;
    fmfS_ECSFlag: string;
    fmfS_ActiveFlag: boolean;
}

//fees masters
export interface IMasterClassList {
    asmcL_Id: number;
    asmcL_ClassCategoryCode: string;
    asmcL_ClassCategoryName: string;
    asmcL_ActiveFlag: boolean;
    asmcL_ClassName: string;
}

export interface IMasterClassYearlyCategoryList {
    asmcC_Id: number;
    asmaY_Year: string;
    amC_Name: string;
    asmcL_ClassName: string;
    is_Active: boolean;
    mi_id: number;
}

//installment fees

// export interface IMasterFeesInstallmentList {
//     fmI_Id: number;
//     mI_Id: number;
//     fmI_Name: string;
//     fmI_No_Of_Installments: number;
//     fmI_Installment_Type: string;
//     ftI_Name?: string;
//     fmI_ActiceFlag?: boolean | number;
//     installments?: Array<{
//         sno?: number;
//         ftI_Id?: number;
//         ftI_Name?: string;
//         fdate?: string;
//         tdate?: string;
//         aplc?: string;
//         ddate?: string;
//     }>;
// }
//groups
export interface IMasterGroupList {
    fmG_Id: number;
    mI_Id: number;
    fmG_GroupName: string;
    fmG_Remarks: string;
    fmG_CompulsoryFlag: string;
    fmG_ActiceFlag: boolean;
    user_id: number;
    fmG_PRE_FLAG: string;
    fmG_TransportFlg: boolean;
    fmG_HostelFlg: boolean;
    fmG_BatchwiseFeeApplFlg: boolean;
    fmG_RegNewFlg: string;
    createdDate: string;
    updatedDate: string;
}

export interface IFeeHeadsList {
    fmH_Id: number;
    mI_Id: number;
    fmH_FeeName: string;
    fmH_Flag: string;
    fmH_ActiveFlag: boolean;
    fmH_Order: number;
    fmH_SpecialFeeFlag: boolean;
    fmH_PDAFlag: boolean;
    fmH_RefundFlag: boolean;
}

export interface IModeOfPaymentList {
    ivrmmoD_Id: number;
    mI_Id: number;
    ivrmmoD_ModeOfPayment: string;
    ivrmmoD_ModeOfPayment_Code: string;
    ivrmmoD_ActiveFlag: boolean;
}

//used category
export interface IMasterClassYearlyList {
    mI_Name: string;
    fmG_GroupName: string;
    fmG_Id: any;
    asmcl_ActiveFlag: boolean;
    asmcL_Id: number;
    asmaY_Id: number;
    asmaY_Year: string;
    fmcC_Id: string;
    fmcC_ClassCategoryName: string;
    fycC_ActiveFlag: boolean;
    asmcL_ClassName: string;
    fyccC_Id: number;
    fycC_Id: number;
}

export interface IMasterCasteCategoryList {
    fmcC_Id: number;
    mI_Id: number;
    fyccC_Id: number;
    fmcC_ClassCategoryName: string;
    imcC_CategoryDesc: string;
    fmcC_ClassCategoryCode: string;
    fmcC_ActiveFlag: boolean;
}

export interface IMaasterFeesYearlyGrouping {
    grouplist: never[];

    fyG_Id: number;
    fmG_GroupName: string;
    fyG_ActiveFlag?: boolean;
    fyG_PartialRebateAmtOrPercentageValue?: number | string;
    fyG_RebateApplicableFlg?: boolean;
    fyG_RebateTypeFlg?: string | boolean;
    asmaY_Year?: string;
    asmaY_Id?: number;
    mI_Id?: number;
    fmG_Id?: number;
    createdDate?: string;
}

export interface IMasterConcessionDetails {
    fmfS_Id: number;
    fmfS_ToDay: number;
    fmfS_FromDay: number;
    fmfS_FineType: string;
    fmfS_ECSFlag: string;
    fmfS_ActiveFlag: boolean;
}

export interface IMasterInstallmentsDropdownList {
    ftI_ID: number;
    ftI_NAME: string;
}

export interface IMasterTermDropdownList {
    fmT_Id: number;
    fmT_Name: string;
}

export interface IMasterHeadDropdownList {
    fmH_Id: number;
    fmH_Flag: string;
    fmH_FeeName: string;
}
export interface IMasterTermFeeHeadList {
    fmT_Id: number;
    fmT_Name: string;
    fmT_IncludeArrearFeeFlg: boolean;
    fmT_ActiveFlag: boolean;
    termname: string;
    headname: string;
    installmentname: string;
    idforedt: number;
    fmH_Id: number;
    ftI_Id: number;
    heads?: { fmH_Id: number }[];
    installments?: { ftI_ID: number }[];
}

export interface IMasterTermsList {
    fmT_Id: number;
    fmT_Name: string;
    fmT_IncludeArrearFeeFlg: boolean;
    fmT_ActiveFlag: boolean;
}

export interface IMasterTermsDropDownList {
    fmT_Id: number;
    mI_Id: number;
    fmT_Name: string;
    fmT_ActiveFlag: boolean;
    fromMonth: string | null;
    toMonth: string | null;
    fmT_Order: number | null;
    fmT_Year: number | null;
    transport_FromMonth: string | null;
    transport_ToMonth: string | null;
    fmT_IncludeArrearFeeFlg: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterpaymentGatewayDropdownList {
    impG_Id: number;
    impG_PGName: string;
}

// export interface IMasterGroupWiseAutoReciptList {
//     feeGroupslist: any;
//     asmaY_Id: any;
//     asmcL_Id: number;
//     fmcC_Id: any;
//     fyccC_Id: number;
//     asmaY_Year: string;
//     fmcC_ClassCategoryName: string;
//     asmcL_ClassName: string;
//     prefix: string;
//     suffix: string;
//     startingNumber: string;
//     groups: string;
//     autoGroupName: string;
//     address: string;
//     receiptTemplateFormat: string;
//     fycC_ActiveFlag: boolean;
// }

//used rebate settings
export interface IMasterYearlyRebateSettingsList {
    asmcl_ActiveFlag: boolean;
    asmaY_Id: number;
    asmaY_Year: string;
    fyG_PartialRebate: string;
    fyG_PartialRebateAmtOrPercentageValue?: number | string;
    fyg_date: string;
    fyrebseT_Id: number;
}

export interface IMasterGroupsGrouping {
    selectedFeeGroups: any;
    fmgG_Id: number;
    fmgG_GroupName: string;
    fmgG_GroupCode: string;
    feeGroupName: string;
    selectedFeeGroupIds: number[];
}
//used for fee previlege
export interface IMasterFeePrevilegeList {
    asmcl_ActiveFlag: boolean;
    asmaY_Id: number;
    asmaY_Year: string;
    ifp_Id: number;
    ifp_FeePrevilegeName: string;
    ifp_Description: string;
    ifp_ActiveFlag: boolean;
    ivrmR_Id: number;
    fmG_Id: number;
    fmH_Id: number;
}

export interface IAcademicYearDropDown {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order: number;
}

// Group dropdown
export interface IMasterGroupDropdown {
    groupId: number;
    groupName: string;
}

export interface IMasterRoleDropdown {
    ivrmrT_Id: number;
    ivrmrT_Role: string;
}

export interface IMasterGetUserNameDropdown {
    userId: number;
    normalizedUserName: string;
    ivrtmt_Id: number;
}

export interface IMasterGetHeadDropdown {
    fmH_Id: number;
    fmH_FeeName: string;
}

export interface IMasterOnlinePaymentHeadgroupList {
    fopM_Id: number;
    fmcC_Id: number;
    mI_Id: number;
    institutionName: string;
    classCategory: string;
    subMerchantId: string;
    groupName: string;
    headSearchTerm: string;
    installmentName: string;
    terms: string;
    academicYear: string;
    className: string;
}

export interface IMasterFeeHeadDropdownList {
    mI_Id: number;
    fmH_Id: number;
    fmH_FeeName: string;
}

export interface IMasterFeeInstallmentDropdownList {
    fmI_Id: number;
    fmI_Name: string;
}
export interface IMasterFeeYearlyHeadGroupMapping {
    mi_Id: number;
    asmaY_Id: number;
    fmcC_Id: number;
    asmcL_Id: number;
    fyccC_Id: number;
    fmH_Id: number;
    fmI_Id: number;
}

export interface IMasterYearlyRebateList {
    asmaY_Id: number;
    fyG_PartialRebateAmtOrPercentageValue?: number | string;
    fyG_PartialRebateTypeFlg?: string;
    fyG_PartialRebateApplicableFlg?: boolean;
}

export interface InstallmentResponse {
    success: boolean;
    message: string;
    data: {
        feemasterinstalment: FeeMasterInstallment[];
        feeinstalmentlist: FeeInstallmentList[];
    };
}

export interface FeeMasterInstallment {
    fmI_Id: number;
    mI_Id: number;
    fmI_Name: string;
    fmI_No_Of_Installments: number;
    fmI_Installment_Type: string;
    fmI_ActiceFlag: boolean;
}

export interface FeeInstallmentList {
    ftI_Id: number;
    fmI_Id: number;
    ftI_Name: string;
}

export interface IMasterFeesInstallmentList {
    fmI_Id: number;
    mI_Id: number;
    fmI_Name: string;
    fmI_No_Of_Installments: number;
    fmI_Installment_Type: string;
    ftI_Name?: string;
    fmI_ActiceFlag?: boolean | number;
    installments?: Array<{
        sno?: number;
        ftI_Id?: number;
        ftI_Name?: string;
        fdate?: string;
        tdate?: string;
        aplc?: string;
        ddate?: string;
    }>;
}

export interface IMasterFeesInstallmentDuedateList {
    ftidD_Id: number;
    ftI_Name: string;
    ftidD_FromDate: string;
    ftidD_ToDate: string;
    ftidD_ApplicableDate: string;
    ftidD_DueDate: string;
    ftI_Id: number;
    asmaY_Id: number;
    fmI_Id: number;
}

export interface IMasterClassYearlyList {
    fmG_GroupName: string;
    fmG_Id: any;
    asmcl_ActiveFlag: boolean;
    asmcL_Id: number;
    asmaY_ID: number;
    asmaY_Year: string;
    fmcC_Id: string;
    fmcC_ClassCategoryName: string;
    fycC_ActiveFlag: boolean;
    asmcL_ClassName: string;
    fyccC_Id: number;
    fycC_Id: number;
}

export interface IMasterFeeHeadDropdownList {
    mI_Id: number;
    fmH_Id: number;
    fmH_FeeName: string;
}

// export interface IMasterFeeInstallmentDropdownList {
//     fmI_Id: number;
//     fmI_Name: string;
// }

export interface IMasterFeeInstallmentDropDown {
    fmI_Id: number;
    fmI_Name: string;
}

export interface IMasterAllFeeHeadList {
    fyghM_Id: number;
    mI_Id: number;
    asmaY_Id: number;
    fmG_Id: number;
    fmH_Id: number;
    fmI_Id: number;
    fyghM_FineApplicableFlag: boolean | null;
    fyghM_Common_AmountFlag: boolean | null;
    fyghM_ActiveFlag: boolean | null;
    fillmastergroup: any;
    fillcompany: any;
    fillmasterhead: any;
    fillinstallment: any;
    returnval: boolean;
    savetmpdata: any;
    savetmpdatains: any;
    savetmpflag: any;
    alldata: any;
    fmG_GroupName: string;
    fmH_FeeName: string;
    fmI_Name: string;
    displaymessage: any;
    academicdrp: any;
    userid: number;
    deleteId: number;
}

export interface IMasterTermFeeHeadDueDateList {
    fmtfhdD_Id: number;
    termname: string;
    headnamed: string;
    yearname: string;
    fdate1: string;
    tdate1: string;
    aplc1: string;
    ddate1: string;
    asmay_Id: number;
    fmT_Id: number;
    fmH_Id: number;
}

export interface IFeeTermFeeHeadDueDateGridList {
    fmtfH_Id: number;
    fmT_Id: number;
    fmH_Id: number;
    ftI_Id: number;
    mI_Id: number;
    fmtP_Id: number;
    fmT_Year: string | null;
    feeHeadList: any[] | null;
    feeTermList: any[] | null;
    returnval: boolean;
    returnduplicatestatus: string | null;
    insname: string;
    fmtfhdD_FromDate: string; // e.g., "2025-11-08T10:21:29.8886442Z"
    fmtfhdD_ToDate: string;
    fmtfhdD_ApplicableDate: string;
    fmtfhdD_DueDate: string;
    feetfhddd: any | null;
    temyrid: number;
    returnvalue: boolean;
    mainid: number;
    status: string | null;
    asmaY_Id: number;
    useR_ID: number;
    fmtP_Year: string;
    fmtP_FROM_MONTH: string;
    fmtP_TO_MONTH: string;
    feeFlag: string;
    fmtP_CreatedDate: string;
    fmtP_UpdatedDate: string;
    fmtP_CreatedBy: number;
    fmtP_UpdatedBy: number;
    createdDate: string | null;
    updatedDate: string | null;
}

export interface IMasterGroupWiseAutoReciptList {
    fgaR_PrefixFlag: string;
    fgaR_SuffixFlag: string;
    fgaR_Name: string;
    fgaR_Address: string;
    fgaR_Template_Name: string;
    asmaY_Id: any;
    asmcL_Id: number;
    fmcC_Id: any;
    fyccC_Id: number;
    asmaY_Year: string;
    fmcC_ClassCategoryName: string;
    asmcL_ClassName: string;
    prefix: string;
    suffix: string;
    startingNumber: string;
    groups: string;
    autoGroupName: string;
    address: string;
    receiptTemplateFormat: string;
    fycC_ActiveFlag: boolean;
    fgaR_PrefixName: string;
    fgaR_SuffixName: string;
    academicyear: string;
    fgaR_Id: number;
    fgaR_Starting_No: number;
    feeGroupslist: IGroupOption[];
}

export interface IConcessionCategoryDropdownList {
    fmcC_Id: number;
    fmcC_ConcessionName: string;
}

export interface IFeeGroupMapping {
    fyghM_Id: number;
    mI_Id: number;
    asmaY_Id: number;
    fmG_Id: number;
    fmH_Id: number;
    fmI_Id: number;
    fyghM_FineApplicableFlag: boolean | null;
    fyghM_Common_AmountFlag: boolean | null;
    fyghM_ActiveFlag: boolean | null;
    fmG_GroupName: string;
    fmH_FeeName: string;
    fmI_Name: string;
    returnval: boolean;
    userid: number;
    deleteId: number;
}
export interface IConcessionCategoryGroupHeadMappingList {
    fmcC_Id: number;
    fmG_Id: number;
    fmH_Id: number;
    fmaccG_Id: number;
    fmcC_ConcessionName: string;
    fmG_GroupName: string;
    fmH_FeeName: string;
    fmaccG_ActiveFlg: boolean;
}

export interface IConcessionCategoryGroupDropdownList {
    fmG_Id: number;
    fmG_GroupName: string;
}

export interface IConcessionCategoryHeadsDropdownList {
    fmH_Id: number;
    fmH_FeeName: string;
}

export interface IConcessionCategoryDropdownList {
    fmcC_Id: number;
    fmcC_ConcessionName: string;
}

export interface IFeePrivilegeList {
    fgL_Id: number;
    user_Id: number;
    normalizedUserName: string;
    fmG_GroupName: string;
    fmH_FeeName: string;
    ivrmrT_Role: string;
}

export interface IFeeOnlinehaedgroupMappingList {
    length: number;
    success: boolean;
    message: string;
    data: Array<{
        fopM_Id: number;
        mI_Id: number;
        fmH_Id: number;
        createdDate: string;
        updatedDate: string;
        fpgd_id: number;
        fmg_id: number;
        fti_id: number;
        fmt_id: number;
        asmcL_Id: number;
        preAdmFlag: boolean;
    }>;
}

export interface IMasterTermsPeriodList {
    yearname: string;
    termname: string;
    fromMonth: string;
    fmtToMonth: string;
    fmtP_Year: string;
    feeFlag: string;
    fmtP_Id: number;
    user_Id: number;
    asmaY_Id: number;
    fmT_Id: number;
}

export interface IMasterStudentFeeGroupMappingList {
    fmgM_Id: number;
    amsT_Id: number;
    amsT_RegistrationNo: string;
    amsT_AdmNo: string;
    amsT_FirstName: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    amaY_RollNo: string;
    amsT_Mobile: number;
    fmG_GroupName: string;
    fmG_Id: number;
    fmsG_Id: number;
    asmaY_Id: number;
    mI_Id: number;
    amsT_MiddleName: string;
    amsT_LastName: string;
}
export interface IMasterFeeClassDropDownList {
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
    asmcL_ActiveFlag: true;
    asmcL_MaxCapacity: number;
    asmcL_PreadmFlag: number;
}

export interface IMasterFeeSectionDropDownList {
    asmS_Id: number;
    mI_Id: number;
    asmC_SectionName: string;
    asmC_SectionCode: string;
    asmC_Order: number;
    asmC_ActiveFlag: number;
    asmC_MaxCapacity: number;
}

export interface IMasterFeeGroupHeadMappinList {
    fmG_Id: number;
    fmG_GroupName: string;
}
export interface IMasterAdmClassCategoryMappingList {
    amC_Id: number;
    categoryName: string;
}

export interface IMasterFeeBusRoutingMappingList {
    trmR_Id: number;
    trmR_RouteName: string;
}

export interface IMasterFeeCasteCategoryMappingList {
    imC_Id: number;
    imC_CasteName: string;
}

export interface IMasterStudentClassMappingList {
    studentId: number;
    registrationNo: string;
    admissionNo: string;
    firstName: string;
    middleName: string;
    lastName: string;
    mobileNo: number;
    activeFlag: number;
    academicYearId: number;
    classId: number;
    className: string;
    sectionId: number;
    sectionName: string;
    rollNo: number;
}
export interface FeeStudentSummaryId {
    feeGroups: StudentFeeGroupSummaryById[];
}

export interface StudentFeeGroupSummaryById {
    fmG_Id: number;
    groupName: string;
    checked: boolean;
    disabled: boolean;
    heads: IMasterFeeSummaryHeadList[];
}

export interface IMasterFeeSummaryHeadList {
    fmH_Id: number;
    headName: string;
    checked: boolean;
    disabled: boolean;
    installments: IMasterFeeSummaryInstallmentlist[];
}

export interface IMasterFeeSummaryInstallmentlist {
    ftI_Id: number;
    installmentName: string;
    checked: boolean;
    disabled: boolean;
}

export interface IMasterFeeGroupList {
    fmG_Id: number;
    fmG_GroupName: string;
}
export interface IMasterFeeHeadList {
    fmG_Id: number;
    fmH_Id: number;
    fmH_FeeName: string;
}

export interface IMasterFeeInstallmentList {
    fmG_Id: number;
    fmH_Id: number;
    ftI_Id: number;
    ftI_Name: string;
}

export interface studentFeeGroupInstallment {
    ftI_Name: string;
    fmG_Id: number;
    fmH_Id: number;
    checked?: boolean;
}

export interface studentFeeGroupHead {
    fmH_FeeName: string;
    fmH_Id: number;
    fmG_Id: number;
    checked?: boolean;
    installments?: studentFeeGroupInstallment[];
}

export interface studentFeeGroup {
    fmG_GroupName: string;
    fmG_Id: number;
    checked?: boolean;
    heads?: studentFeeGroupHead[];
}
export interface GroupStudentClassMapping {
    groups: studentFeeGroup[];
}

export interface IFeeSplitYearList {
    fmtP_Year: string;
}

export interface MasterFeeOtherStudentType {
    fmosT_Id: number;
    mI_Id: number;
    fmosT_StudentName: string;
    fmosT_StudentMobileNo: number;
    fmosT_StudentEmailId: string;
    fmosT_ActiveFlag: boolean;
}

export interface IFeeHeadsListSetOrder {
    fmH_Id: number;
    mI_Id: number;
    fmH_FeeName: string;
    fmH_Flag: string;
    fmH_ActiveFlag: boolean;
    fmH_Order: number;
    fmH_SpecialFeeFlag: boolean;
    fmH_PDAFlag: boolean;
    fmH_RefundFlag: boolean;
}

export interface IMasterFeeClassCategoryList {
    fmcC_Id: number;
    fmcC_ClassCategoryName: string;
}

export interface IMasterFeeBusAreaList {
    trmA_Id: number;
    trmA_AreaName: string;
}

export interface IGroupOption {
    fmG_Id: number;
    fmG_GroupName: string;
}

export interface IinstitutionDetails {
    mI_Id: number;
    mI_Logo: string;
    mI_Name: string;
}

export interface IMasterGroupsOnYear {
    fmG_Id: number;
    fyG_Id: string;
    fmG_GroupName: string;
}

export interface FeeInstallmentNameList {
    ftI_Id: number;
    ftI_Name: string;
}
