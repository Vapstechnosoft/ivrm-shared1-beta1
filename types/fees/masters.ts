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

export interface IMasterClassYearlyCategoryList {
    asmcC_Id: number;
    asmaY_Year: string;
    amC_Name: string;
    asmcL_ClassName: string;
    is_Active: boolean;
}
export interface IMasterClassList {
    asmcL_Id: number;
    asmcL_ClassCategoryCode: string;
    asmcL_ClassCategoryName: string;
    asmcL_ActiveFlag: boolean;
    asmcL_ClassName: string;
}

export interface IMasterClassYearlyList {
    asmcL_Id: number;
    asmcL_AcademicYear: string;
    asmcL_ClassCategory: string;
    asmcL_Classes: string;
    asmcL_ActiveFlag: boolean;
    asmcL_ClassName: string;
}

export interface IMasterFeesInstallmentDueDateList {
    ftidD_Id: number;
    mI_Id: number;
    ftI_Id: number;
    asmaY_Id: number;
    ftidD_FromDate: string;
    ftidD_ToDate: string;
    ftidD_ApplicableDate: string;
    ftidD_DueDate: string;
    returnval: boolean;
    fdate1: string;
    tdate1: string;
    aplc1: string;
    ddate1: string;
    fname: string;
    fmiid: number;
    fromdate2: string;
    todate2: string;
    apldate2: string;
    ddudate2: string;
    yrid: number;
    fmI_Name: string;
    fmI_Id: number;
    ftI_Name: string;
    fdate: string;
    tdate: string;
    aplc: string;
    ddate: string;
}

export interface IMasterConcessionList {
    fmcC_Id: number;
    fmcC_ConcessionName: string;
    fmcC_ConcessionFlag: string;
    fmcC_ConcessionApplLimit: string;
    fmcC_ActiveFlag: boolean;
}

export interface IMasterTermsList {
    fmT_Id: number;
    fmT_Name: string;
    fmT_IncludeArrearFeeFlg: boolean;
    fmT_ActiveFlag: boolean;
}

// export interface IMasterTermFeeHeadList {
//     fmT_Id: number;
//     fmT_Name: string;
//     fmT_IncludeArrearFeeFlg: boolean;
//     fmT_ActiveFlag: boolean;
//     termname: string;
//     headname: string;
//     installmentname: string;
//     idforedt: number;
// }

export interface IMasterTermDropdownList {
    fmT_Id: number;
    fmT_Name: string;
}

export interface IMasterHeadDropdownList {
    fmH_Id: number;
    fmH_Flag: string;
    fmH_FeeName: string;
}

export interface IMasterInstallmentsDropdownList {
    ftI_ID: number;
    ftI_NAME: string;
}

// Installment list (used by fees installment pages)
export interface IMasterFeesInstallmentList {
    fmI_Id: number;
    mI_Id: number;
    fmI_Name: string;
    fmI_No_Of_Installments: number;
    fmI_Installment_Type: string;
    ftI_Name?: string;
    fmI_ActiceFlag?: boolean | number;
    fmI_ActiveFlag?: boolean | number;
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
export interface IMasterConcessionDetailsList {
    fmccD_Id: number;
    fmcC_Id: number;
    fmcC_ConcessionName: string;
    fmccD_FromNoSibblings: number;
    fmccD_ToNoSibblings: number;
    fmccD_PerOrAmt: number;
    fmccD_PerOrAmtFlag: string; // "Amount" or "Percentage"
    fmccD_ActiveFlg: boolean;
    fmccD_CreatedBy: number;
    fmccD_UpdatedBy: number;
    fmcC_ConcessionFlag: string;
}

export interface IMasterConcessionDetailsList {
    fmccD_Id: number;
    fmcC_Id: number;
    fmcC_ConcessionName: string;
    fmccD_FromNoSibblings: number;
    fmccD_ToNoSibblings: number;
    fmccD_PerOrAmt: number;
    fmccD_PerOrAmtFlag: string; // "Amount" or "Percentage"
    fmccD_ActiveFlg: boolean;
    fmccD_CreatedBy: number;
    fmccD_UpdatedBy: number;
    fmcC_ConcessionFlag: string;
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

export interface IspecialFeeHeadList {
    fmsfH_Id: number;
    fmsfhfH_Id: number;
    fmsfH_Name: string;
    fmH_Name: string;
    fmsfhfH_ActiceFlag: boolean;
    fmH_Id: number;
}

// export interface IspecialFeeHeadDropdownList {
//     fmH_Id: number;

//     fmH_FeeName: string;
// }

export interface IspecialFeeHeadDropdownList {
    fmH_Id: number;
    amount: number;
    fmH_FeeName: string;
}

export interface IfeeCompanyGroupMappingList {
    ftmcoM_CompanyName: string;
    fmG_GroupName: string;
    ftmcoM_CompanyCode: string;
    ffgcmA_Id: number;
    fmgG_Id: number;
    ftmcoM_Id: number;
    ffgcmA_ActiveId: boolean;
}

export interface ICompanyGroupMappingGroupDropdownList {
    fmgG_Id: number;
    fmgG_GroupName: string;
}

export interface ICompanyGroupMappingCompanyDropdownList {
    mI_Id: number;
    ftmcoM_Id: number;
    ftmcoM_CompanyName: string;
    ftmcoM_CompanyCode: string;
    ftmcoM_CreatedDate: string;
    ftmcoM_UpdatedDate: string;
}

export interface ICompanyGroupMappingGroupDropdownList {
    fmG_Id: number;
    mI_Id?: number;
    fmG_GroupName?: string;
    fmG_Remarks?: string;
    fmG_CompulsoryFlag?: string;
    fmG_ActiceFlag?: boolean;
    user_id?: number;
    fmG_Order?: number;
    fmG_PRE_FLAG?: string;
    fmG_CreatedBy?: number;
    fmG_UpdatedBy?: number;
    fmG_TransportFlg?: boolean;
    fmG_HostelFlg?: boolean;
    fmG_BatchwiseFeeApplFlg?: boolean;
    fmG_RegNewFlg?: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface IAcademicYearDataDetails {
    asmaY_Id: number;
    asmaY_Year: string;
    mI_Id: number;
    asmaY_From_Date: string;
    asmaY_To_Date: string;
    asmaY_Order: number;
    is_Active: boolean;
}
