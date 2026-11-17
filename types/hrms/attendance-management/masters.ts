/**
 * HRMS Attendance Management Masters Types
 * Following the new architecture pattern with lowercase field names
 */

// Shift Setting Master Types
export interface IMasterShiftSettingList {
    FOMST_Id: number;
    FOMS_Id: number;
    FOMS_ShiftName: string;
    FOMS_ActiveFlg: boolean;
    FOMST_FDWHrMin: string; // Total working hours per shift
    FOMST_HDWHrMin: string; // Half day working hours per shift
    FOMST_IHalfLoginTime: string; // Shift Start Time
    FOMST_IHalfLogoutTime: string; // Lunch start time
    FOMST_IIHalfLoginTime: string; // Lunch End time
    FOMST_IIHalfLogoutTime: string; // Shift End Time
    FOMST_DelayPerShiftHrMin: string; // Delay per shift
    FOMST_EarlyPerShiftHrMin: string; // Early per shift
    FOMST_LunchHoursDuration: string; // Lunch Hours
    FOMST_BlockAttendance: string;
    FOMST_FixTimings: string;
}

// Master Holiday Types
export interface IMasterHolidayList {
    FOHWDT_Id: number;
    FOMHWDD_Id: number;
    FOMHWDD_Name: string;
    FOMHWDD_FromDate: string;
    FOMHWDD_ToDate: string;
    FOMHWDD_ActiveFlg: boolean;
    FOMHWDD_HolidayWDType: string;
    HRMD_DepartmentName: string;
}

// Employee Shift Mapping Types
export interface IMasterEmployeeShiftMappingList {
    FOEST_Id: number;
    EmployeeName: string;
    ShiftName: string;
    DayType: string;
    Date: string;
    FDWHrMin: string;
    HDWHrMin: string;
    IHalfLogin: string;
    IHalfLogout: string;
    IIHalfLogin: string;
    IIHalfLogout: string;
    DelayPerShift: string;
    EarlyPerShift: string;
    LunchDuration: string;
}

// Employee Shift Mapping Dropdown Types
export interface IGroupType {
    HRMGT_Id: number;
    MI_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Code: string;
    HRMGT_Order: number;
    HRMGT_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface IHolidayType {
    Key: number;
    Value: string;
}

export interface IShiftName {
    Key: number;
    Value: string;
}

export interface IDepartment {
    Key: number;
    Value: string;
}

export interface IDesignation {
    Key: number;
    Value: string;
}

export interface IEmployee {
    Key: number;
    Value: string;
}
