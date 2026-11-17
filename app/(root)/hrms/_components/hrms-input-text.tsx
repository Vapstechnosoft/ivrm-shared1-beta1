'use client';
import { InputText } from '@/components/ui/extension/input-text';
import { cn } from '@/lib/utils';
import React from 'react';
export interface HRMSInputTextProps extends React.ComponentProps<typeof InputText> {
    error?: string;
}
/**
 * HRMS-specific InputText component that adds error styling to the input field
 * This component wraps the base InputText and adds red border styling when there's an error
 * Uses CSS selectors to target the input element inside the wrapper
 */
const HRMSInputText = React.forwardRef<HTMLInputElement, HRMSInputTextProps>(({ error, className, ...props }, ref) => {
    return (
        <InputText
            ref={ref}
            error={error}
            className={cn(
                // Use CSS selector to target the input element inside the wrapper
                error && '[&>input]:border-destructive [&>input]:focus-visible:ring-destructive',
                className
            )}
            {...props}
        />
    );
});
HRMSInputText.displayName = 'HRMSInputText';
export { HRMSInputText };
