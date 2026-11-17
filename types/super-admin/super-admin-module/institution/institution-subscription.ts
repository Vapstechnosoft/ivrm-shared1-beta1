export interface IInstitutionSubscription {
    misV_Id: number;
    mI_Id: number;
    institutionName?: string;
    misV_SubscriptionType: string;
    misV_FromDate: string;
    misV_ToDate: string;
    misV_ActiveFlag: boolean;
    misV_ApprovalFlag?: string; // From snippet ( Renewal Request condition)
    misV_SubscriptionNo?: string;
    createdDate?: string;
    updatedDate?: string;
}
