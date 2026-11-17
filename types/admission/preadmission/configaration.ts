export interface IMasterAcademicYearMasterList {
    asmaY_Id: number;
    mI_Id: number;
    asmaY_Year: string;
    asmaY_From_Date: string;
    asmaY_To_Date: string;
    asmaY_PreAdm_F_Date: string;
    asmaY_PreAdm_T_Date: string;
    asmaY_Order: number;
    asmaY_ActiveFlag: number;
    asmaY_Cut_Of_Date: string;
    asmaY_Pre_ActiveFlag: number;
    is_Active: boolean;
    asmaY_ReggularFlg: boolean;
    asmaY_NewFlg: boolean;
    asmaY_NewAdmissionFlg: boolean;
    asmaY_CreatedBy: number;
    asmaY_UpdatedBy: number;
    asmaY_ReferenceDate: string;
    asmaY_ArrearFeeDate: string;
    asmaY_AdvanceFeeDate: string;
    asmaY_TransportEDate: string;
    asmaY_TransportSDate: string;
    asmaY_AcademicYearCode: string;
    asmaY_RegularFeeFDate: string;
    asmaY_RegularFeeTDate: string;
    createdDate: string;
    updatedDate: string;
}
export interface IMasterSetOrderList {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order: number;
}
export interface IMasterTransactionNumberingList {
    imN_Id: number;
    mI_Id: number;
    imN_AutoManualFlag: string;
    imN_DuplicatesFlag: null;
    imN_StartingNo: string;
    imN_WidthNumeric: string;
    imN_ZeroPrefixFlag: string;
    imN_PrefixAcadYearCode: boolean;
    imN_PrefixParticular: null;
    imN_SuffixAcadYearCode: boolean;
    imN_SuffixParticular: string;
    imN_RestartNumFlag: string;
    imN_Flag: string;
    imN_PrefixFinYearCode: null;
    imN_PrefixCalYearCode: null;
    imN_SuffixFinYearCode: null;
    imN_SuffixCalYearCode: null;
    createdDate: string;
    updatedDate: string;
}
