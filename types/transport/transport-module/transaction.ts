export interface IRouteLocationMapping {
    trmrL_Id: number;
    trmR_Id: number;
    routename?: string;
    locationname?: string;
    trmR_RouteName?: string;
    trmL_LocationName?: string;
    trmL_Id: number;
    trmrL_Order: number;
    trmrL_ActiveFlag: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IVehicleDriverMapping {
    trvD_Id: number;
    trmV_Id: number;
    trmD_Id: number;
    trmS_Id: number;
    trvD_Date: string;
    trmS_Flag: string;
    trvD_ActiveFlg: boolean;
    trmV_VehicleName?: string;
    trmV_VehicleNo?: string;
    trmD_DriverName?: string;
    trmS_SessionName?: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface IVehicleRouteMapping {
    trvR_Id: number;
    trmV_Id: number;
    trmR_Id: number;
    trmS_Id: number;
    trvR_Date: string;
    trmS_Flag: string;
    trvR_ActiveFlg: boolean;
    trmV_VehicleName?: string;
    trmV_VehicleNo?: string;
    trmR_RouteName?: string;
    trmS_SessionName?: string;
    createdDate?: string;
    updatedDate?: string;
}
