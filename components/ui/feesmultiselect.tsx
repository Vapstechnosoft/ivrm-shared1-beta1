'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import type React from 'react';
import { useState } from 'react';

interface Option {
    label: string;
    value: string;
    disabled?: boolean;
}

interface CustomMultiSelectBoxProps {
    options: Option[];
    value: string[];
    onChange: (vals: string[]) => void;
    label?: string;
    height?: string;
    isSearchRequired?: boolean;
    error?: string;
    placeholder?: string;
    isRequired?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
}

export const FeesCustomMultiSelectBox: React.FC<CustomMultiSelectBoxProps> = ({
    options,
    value,
    onChange,
    label,
    height = '200px',
    isSearchRequired = false,
    error,
    isRequired = false,
    disabled = false,
    isLoading = false
}) => {
    const [search, setSearch] = useState('');

    const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));

    const allSelected = filteredOptions.length > 0 && filteredOptions.every((opt) => value.includes(opt.value));

    const allCheckboxesDisabled = filteredOptions.length > 0 && filteredOptions.every((opt) => opt.disabled);

    const handleSelectOption = (optionValue: string) => {
        if (disabled) return;

        const newValues = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue];

        onChange(newValues);
    };

    const handleSelectAll = () => {
        if (disabled || allCheckboxesDisabled) return;

        const allOptionValues = filteredOptions.map((opt) => opt.value);

        if (allSelected) {
            // Deselect all filtered options
            const newValues = value.filter((v) => !allOptionValues.includes(v));
            onChange(newValues);
        } else {
            // Select all filtered options that aren't already selected
            const newValues = [...new Set([...value, ...allOptionValues])];
            onChange(newValues);
        }
    };

    return (
        <div className={`flex flex-col gap-1 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
            {label && (
                <Label>
                    {label} {isRequired && <span className='text-destructive'>*</span>}
                </Label>
            )}

            <div className='relative overflow-hidden rounded-md border' style={{ height }}>
                {isSearchRequired && (
                    <div className='sticky top-0 z-10 border-b bg-white p-2'>
                        <input
                            type='text'
                            placeholder='Search...'
                            value={search}
                            onChange={(e) => !disabled && setSearch(e.target.value)}
                            disabled={disabled}
                            className='w-full rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:cursor-not-allowed'
                        />
                    </div>
                )}

                <div
                    className='overflow-y-auto p-2 text-sm'
                    style={{
                        height: `calc(${height} - ${isSearchRequired ? '48px' : '0px'})`
                    }}>
                    {/* Select All - ONLY checkbox handles the click */}
                    {filteredOptions.length > 0 && (
                        <div className='mb-2 flex items-center gap-2 rounded-md p-1 font-medium text-sm'>
                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={handleSelectAll}
                                    disabled={disabled || allCheckboxesDisabled}
                                />
                                <span
                                    className={`${disabled || allCheckboxesDisabled ? '' : 'cursor-pointer hover:underline'}`}
                                    onClick={() => !disabled && !allCheckboxesDisabled && handleSelectAll()}>
                                    Select All
                                </span>
                            </div>
                        </div>
                    )}

                    {filteredOptions.map((opt) => (
                        <div key={opt.value} className='mb-1 flex items-center gap-2 rounded-md p-1 text-sm'>
                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    checked={value.includes(opt.value)}
                                    onCheckedChange={() => handleSelectOption(opt.value)}
                                    disabled={disabled || opt.disabled}
                                />
                                <span
                                    className={`${disabled || opt.disabled ? '' : 'cursor-pointer hover:underline'}`}
                                    onClick={() => !disabled && !opt.disabled && handleSelectOption(opt.value)}>
                                    {opt.label}
                                </span>
                            </div>
                        </div>
                    ))}

                    {isLoading && <div className='text-muted-foreground text-sm'>Loading...</div>}

                    {!isLoading && filteredOptions.length === 0 && <div className='text-muted-foreground text-sm'>No options found</div>}
                </div>
            </div>

            {error && <FormError>{error}</FormError>}
        </div>
    );
};
