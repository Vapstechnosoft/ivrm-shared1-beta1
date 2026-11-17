export interface IMasterTimeSlab {
    lfsE_Id: number;
    mI_Id: number;
    lfsE_UserType: string;
    lfsE_SlabTypeFlg: string;
    lfsE_PerDayFlg: number;
    lfsE_FromDay: number;
    lfsE_ToDay: number | null;
    lfsE_Amount: number;
    lfsE_ActiveFlg: boolean;
    lfsE_CreatedBy?: number;
    lfsE_UpdatedBy?: number;
    createdDate?: string;
    updatedDate?: string;
}
