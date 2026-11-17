/* CATEGORY */
export interface ITransactionCategory {
    ttmC_Id: number;
    ttmC_CategoryName: string;
}

/* CLASS */
export interface ITransactionClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

/* REPORT FILTER PAYLOAD */
export interface IUniformDistributionFilter {
    asmay_id: number;
    ttmC_Id: number;
    calssids: string[];
}
