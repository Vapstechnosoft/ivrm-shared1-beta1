export interface ILibLostBookReportRequest {
    MI_Id: number;
    p_booktype: string;
    p_bnbflg: string;
    p_fromdate: string;
    p_todate: string;
    p_lmal_id: number;
}

export interface ILibLostBookReportGridData {
    mI_Id: number;
    lmB_Id: number;
    lmbanO_AvialableStatus: string;
    lmB_BookTitle: string;
    lmbanO_Id: number;
    lmbanO_LostDamagedReason: string;
    lmbanO_AmountCollected: number;
    lmbanO_AccessionNo: string;
    lmbanO_ModeOfPayment: string;
    lmB_BookType: string;
    lmbanO_LostDamagedDate: string;
}

export type ILibLostBookReportInitialData = Array<{
    lmaL_Id: number;
    lmaL_LibraryName: string;
    lmaL_ActiveFlag: boolean;
}>;
