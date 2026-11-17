export interface CompOffRequestItem {
    id: number;
    createdAt: Date;
    employeeId?: number;
    slNo: number;
    date: string;
    inTime: string;
    outTime: string;
    compOffToBeCredit: number;
    reason: string;
    drStatus: string;
    status: 'Available' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
}

export interface EmployeeDetails {
    employeeName: string;
    doj: string;
    designation: string;
    email: string;
    phone: string;
}

export interface EmployeeLeaveDetail {
    id: number;
    createdAt: Date;
    employeeId?: number;
    slNo: number;
    leaveName: string;
    leaveReason: string;
    fromDate: string;
    toDate: string;
    noOfDays: number;
    status: string;
}

export interface CompOffRequest {
    employeeDetails: EmployeeDetails;
    compOffRequests: CompOffRequestItem[];
    leaveDetails: EmployeeLeaveDetail[];
}

export interface CompOffRequestResponse {
    success: boolean;
    data: CompOffRequest;
    message: string;
}

