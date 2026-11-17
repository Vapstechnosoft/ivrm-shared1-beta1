
export interface IMasterArea {
    trmA_Id: number;
    trmA_AreaName: string;
    trmA_AliasName: string;
    trmA_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterDriver {
    trmD_Id: number;
    trmD_DriverName: string;
    trmD_DriverCode: string;
    trmD_DLNo: string;
    trmD_RTOName?: string;
    trmD_DLExpiryDate: string;
    trmD_MTExpiryDate?: string;
    trmD_SDExpiryDate?: string;
    trmD_DriverBadgeNo: string;
    trmD_LicenseType: string;
    trmD_SpareDriverFlg: boolean;
    trmD_MobileNo: string;
    trmD_EmailId?: string;
    trmD_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterFuelType {
    trmfT_Id: number;
    trmfT_FuelType: string;
    trmfT_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterLocation {
    trmL_Id: number;
    trmL_LocationName: string;
    trmL_Latitude: string;
    trmL_Longitude: string;
    trmL_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterRoute {
    trmR_Id: number;
    trmR_RouteName: string;
    trmR_RouteNo: string;
    trmR_RouteDesc: string;
    trmR_order: number;
    trmR_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IRouteAreaMapping {
    traR_Id: number;
    trmR_Id: number;
    trmR_RouteName?: string;
    trmA_Id: number;
    trmA_AreaName?: string;
    traR_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterServiceStation {
    trmssT_Id: number;
    trmssT_ServiceStationName: string;
    trmssT_ContactNo: string;
    trmssT_EmailId: string;
    trmssT_Address: string;
    trmssT_ActiveFlag: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterSession {
    trmS_Id: number;
    trmS_SessionName: string;
    trmS_SessionDesc: string;
    trmS_Flag: string;
    trmS_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterVehicleType {
    trmvT_Id: number;
    trmvT_VehicleType: string;
    trmvT_VehicleDesc: string;
    trmvT_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterRouteSchedule {
    trrsC_Id: number;
    trrsC_ScheduleName: string;
    trrsC_ActiveFlag: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterVehicleDocument {
    cfileid?: number;
    trmvT_Id?: number; // Linked Vehicle Id
    cfilename: string;
    cfiledesc: string;
    cfilepath: string;
    filetype?: string;
}

export interface IMasterVehicle {
    trmV_Id: number;
    trmvT_Id: number; // Vehicle Type
    trmfT_Id: number; // Fuel Type
    trmV_VehicleName: string;
    trmV_VehicleNo: string;
    trmV_PurchaseDate: string;
    trmV_ChassisNo: string;
    trmV_EngineNo: string;
    trmV_PurchasedFrom: string;
    trmV_Cost: number;
    trmV_Capacity: number; // Seating
    trmV_Desc: string;
    trmV_VehicleImage: string;
    trmV_CompanyName: string;
    trmV_RegistrationDate: string;
    trmV_ManufacturedDate: string;
    trmV_RegFCUpToDate: string;
    trmV_SWDOff: string;
    trmV_Address: string;
    trmV_Model: string;
    trmV_Fuel: string; // Additional Fuel Field
    trmV_Manufacturer: string;
    trmV_Class: string;
    trmV_Color: string;
    trmV_Body: string;
    trmV_NoOfCylinder: number;
    trmV_WheelBase: string;
    trmV_UnladenWeight: number;
    trmV_CC: string;
    trmV_TaxUpTo: string;
    trmV_OwnersName: string;
    trmV_ActiveFlag: boolean;

    // For Documents
    vehicleDocuments?: IMasterVehicleDocument[];

    createdDate?: string;
    updatedDate?: string;
}

export interface IExpirySettings {
    trC_Id: number;
    trC_TaxExpDays: number;
    trC_FitnessExpDays: number;
    trC_PermitDays: number;
    trC_InsuranceDays: number;
    trC_EmmisionExpDays: number;
    trC_SpeedControlDays: number;
    trC_CeaseFireDays: number;
    trC_GreenTaxDays: number;
    trC_DLExpReminderDays: number;
    createdDate?: string;
    updatedDate?: string;
}
