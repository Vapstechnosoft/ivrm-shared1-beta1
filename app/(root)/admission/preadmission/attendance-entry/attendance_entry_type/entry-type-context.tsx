'use client';

import type { IAttendanceEntryTypeList } from '@/types/admission/preadmission/attendance_entry';
import { createContext, useContext } from 'react';

// Create context for edit functionality
export const EditContext = createContext<{
    setEditingRecord: (record: IAttendanceEntryTypeList | null) => void;
} | null>(null);

export const useEditContext = () => {
    const context = useContext(EditContext);
    if (!context) throw new Error('useEditContext must be used within EditContext.Provider');
    return context;
};
