'use client';
import { DateField as BaseDateField } from '@/components/ui/dateField';
import { useEffect, useRef } from 'react';
interface HRMSDateFieldProps {
    field: any;
    fieldState: any;
    label: string;
    placeholder?: string;
    fromDate?: Date;
    toDate?: Date;
    disabled?: boolean;
}
/**
 * HRMS-specific wrapper for DateField that prevents infinite loops
 * by stabilizing the field value reference
 */
export const HRMSDateField: React.FC<HRMSDateFieldProps> = ({ field, fieldState, label, placeholder, fromDate }) => {
    // Use ref to track the actual value string to prevent infinite loops
    const valueRef = useRef<string | undefined>(field.value);
    // Update ref only when value actually changes (string comparison)
    useEffect(() => {
        const currentValue = field.value ? String(field.value) : '';
        const refValue = valueRef.current ? String(valueRef.current) : '';
        if (currentValue !== refValue) {
            valueRef.current = field.value;
        }
    }, [field.value]);
    // Create a stable field object with the ref value
    const stableField = {
        ...field,
        value: valueRef.current || ''
    };
    return <BaseDateField field={stableField} fieldState={fieldState} label={label} placeholder={placeholder} fromDate={fromDate} />;
};
