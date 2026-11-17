import { type BaseEntity } from '@/lib/localdb';

export interface LeaveCarryForward extends BaseEntity {
    fromYear: string;
    toYear: string;
    leaveName: string;
    employeeName: string;
    department: string;
    designation: string;
    carryDays: number;
    leaveCredit?: number;
    leaveBalance?: number;
    type?: string[];
}

export interface LeaveCreditAddition extends BaseEntity {
    leaveYear: string;
    leaveName: string;
    employeeName: string;
    department: string;
    designation: string;
    addDays: number;
    remarks?: string;
    leaveCredit?: number;
    leaveBalance?: number;
    type?: string[];
}

export interface LeaveCreditDeduction extends BaseEntity {
    leaveYear: string;
    leaveName: string;
    employeeName: string;
    department: string;
    designation: string;
    deductDays: number;
    remarks?: string;
    leaveCredit?: number;
    leaveBalance?: number;
    type?: string[];
}

