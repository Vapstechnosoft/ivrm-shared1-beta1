export interface Staff {
    hrmE_Id: number;
    staffName: string;
}

export interface StaffReplacementInUnallocatedMasters {
    staff: Staff[];
}
