export interface MasterDesignationResponse {
    success?: boolean;
    message?: string;
    data?: DesignationDetail[] | {
        designationlList: DesignationDetail[];
    };
    designationlList?: DesignationDetail[];
    retrunMsg?: string;
    roleId?: number;
    HRMDES_Id?: number;
    MI_Id?: number;
    HRMDES_DesignationName?: string | null;
    HRMDES_BasicAmount?: number;
    HRMDES_SanctionedSeats?: number | null;
    HRMDES_DisplaySanctionedSeatsFlag?: boolean | null;
    HRMDES_Order?: number | null;
    HRMDES_ActiveFlag?: boolean;
    DesignationDTO?: any;
    CreatedDate?: string | null;
    UpdatedDate?: string | null;
    total?: number;
    page?: number;
    page_size?: number;
}

export interface DesignationDetail {
    HRMDES_Id: number;
    MI_Id: number;
    HRMDES_DesignationName: string;
    HRMDES_BasicAmount: number;
    HRMDES_SanctionedSeats: number;
    HRMDES_DisplaySanctionedSeatsFlag: boolean;
    HRMDES_Order: number;
    HRMDES_ActiveFlag: boolean;
    HRMDC_ID: any;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterDesignationInput {
    HRMDES_Id?: number;
    MI_Id: number;
    HRMDES_DesignationName: string;
    HRMDES_BasicAmount: number;
    HRMDES_SanctionedSeats: number;
    HRMDES_DisplaySanctionedSeatsFlag: boolean;
    HRMDES_Order?: number;
    HRMDES_ActiveFlag: boolean;
}

export interface OnloadGetDesignationDetailsRequest {
    CreatedDate?: string;
    UpdatedDate?: string;
    HRMDES_Id: number;
    MI_Id: number;
    HRMDES_DesignationName: string;
    HRMDES_BasicAmount: number;
    HRMDES_SanctionedSeats: number;
    HRMDES_DisplaySanctionedSeatsFlag: boolean;
    HRMDES_Order: number;
    HRMDES_ActiveFlag: boolean;
    designationlList: Array<{
        HRMDES_Id: number;
        MI_Id: number;
        HRMDES_DesignationName: string;
        HRMDES_BasicAmount: number;
        HRMDES_SanctionedSeats: number;
        HRMDES_DisplaySanctionedSeatsFlag: boolean;
        HRMDES_Order: number;
        HRMDES_ActiveFlag: boolean;
        HRMDC_ID: any;
    }>;
    retrunMsg: string;
    roleId: number;
    DesignationDTO: Array<{
        HRMDES_Id: number;
        MI_Id: number;
        HRMDES_DesignationName: string;
        HRMDES_BasicAmount: number;
        HRMDES_SanctionedSeats: number;
        HRMDES_DisplaySanctionedSeatsFlag: boolean;
        HRMDES_Order: number;
        HRMDES_ActiveFlag: boolean;
        HRMDC_ID: any;
    }>;
}

export interface SaveDesignationRequest {
    CreatedDate: string;
    UpdatedDate: string;
    HRMDES_Id: number;
    MI_Id: number;
    HRMDES_DesignationName: string;
    HRMDES_BasicAmount: number;
    HRMDES_SanctionedSeats: number;
    HRMDES_DisplaySanctionedSeatsFlag: boolean;
    HRMDES_Order: number;
    HRMDES_ActiveFlag: boolean;
    designationlList: Array<{
        CreatedDate: string;
        UpdatedDate: string;
        HRMDES_Id: number;
        MI_Id: number;
        HRMDES_DesignationName: string;
        HRMDES_BasicAmount: number;
        HRMDES_SanctionedSeats: number;
        HRMDES_DisplaySanctionedSeatsFlag: boolean;
        HRMDES_Order: number;
        HRMDES_ActiveFlag: boolean;
    }>;
    retrunMsg: string;
    roleId: number;
    DesignationDTO: any[];
}

export interface DesignationSetOrderList {
    HRMDES_Id: number;
    HRMDES_DesignationName: string;
    HRMDES_Order: number;
}
