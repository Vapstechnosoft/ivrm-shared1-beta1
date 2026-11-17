'use client';
export type LeavingReason = {
    id: string;
    company: string;
    reason: string;
    reasonType: string;
    noticePeriodInDays: number | null;
    isActive: boolean;
};
