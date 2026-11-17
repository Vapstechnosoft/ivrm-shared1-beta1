'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IAlumniAcademicYear, IAlumniClass } from '@/types/alumni/alumni-search';
import { Minus, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AlumniSearchCriteriaBuilderProps {
    years: IAlumniAcademicYear[];
    classes: IAlumniClass[];
    cities: string[];
    occupations: string[];
    onSearch: (criteria: any[]) => void;
    onClear: () => void;
}

const FIELDS = [
    { value: 'StudentName', name: 'Alumni Name' }
    // { value: 'ALMST_MobileNo', name: 'MobileNo' },
    // { value: 'ALMST_emailId', name: 'Email id' },
    // { value: 'IVRMMC_CountryName', name: 'Country' },
    // { value: 'IVRMMS_Name', name: 'State' },
    // { value: 'ALMST_PerCity', name: 'City' },
    // { value: 'ALSPR_Designation', name: 'Profession' },
    // { value: 'ALMST_BloodGroup', name: 'Blood Group' },
    // { value: 'ALMST_FatherName', name: 'Father Name' },
    // { value: 'ALMST_FullAddess', name: 'Full Address' },
    // { value: 'ASMCL_Id_Join', name: 'Class Joined' },
    // { value: 'ASMCL_Id_Left', name: 'Class Left' },
    // { value: 'ASMAY_Id_Join', name: 'Year Joined' },
    // { value: 'ASMAY_Id_Left', name: 'Year Left' },
    // { value: 'ALMST_MembershipId', name: 'Membership ID' },
    // { value: 'ALMMC_MembershipCategory', name: 'Membership Category' }
];

const DEFAULT_OPERATORS = [
    { value: '=', name: 'Equal to' },
    { value: '!=', name: 'Not Equal to' },
    { value: 'like', name: 'Like' }
];

const SELECT_OPERATORS = [
    { value: '=', name: 'Equal to' },
    { value: '!=', name: 'Not Equal to' }
];

const CONDITIONS = [
    { value: 'AND', name: 'AND' },
    { value: 'OR', name: 'OR' }
];

export default function AlumniSearchCriteriaBuilder({
    years,
    classes,
    cities,
    occupations,
    onSearch,
    onClear
}: AlumniSearchCriteriaBuilderProps) {
    const [rows, setRows] = useState<any[]>([{ field: '', operator: '', value: '', condition: 'AND' }]);

    const addRow = () => {
        setRows([...rows, { field: '', operator: '', value: '', condition: 'AND' }]);
    };

    const removeRow = (index: number) => {
        if (rows.length > 1) {
            setRows(rows.filter((_, i) => i !== index));
        }
    };

    const updateRow = (index: number, updates: any) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], ...updates };
        // Reset operator if the new field doesn't support the current operator
        if (updates.field) {
            const allowedOperators = getOperatorsForField(updates.field);
            if (!allowedOperators.some((o) => o.value === newRows[index].operator)) {
                newRows[index].operator = '';
            }
        }
        setRows(newRows);
    };

    const getOperatorsForField = (field: string) => {
        if (field.includes('ASMCL') || field.includes('ASMAY') || field === 'ALMST_PerCity' || field === 'ALSPR_Designation') {
            return SELECT_OPERATORS;
        }
        return DEFAULT_OPERATORS;
    };

    const handleSearch = () => {
        const validRows = rows.filter(
            (r) => r.field && r.operator && (r.value !== '' || r.field.includes('ASM') || r.field.includes('ASMAY'))
        );
        if (validRows.length === 0) {
            return;
        }
        onSearch(rows);
    };

    const renderValueInput = (row: any, index: number) => {
        if (row.field === 'ASMAY_Id_Join' || row.field === 'ASMAY_Id_Left') {
            return (
                <Select value={row.value} onValueChange={(v) => updateRow(index, { value: v })}>
                    <SelectTrigger className='h-9 w-full'>
                        <SelectValue placeholder='--Select Year--' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='0'>--All Year--</SelectItem>
                        {years.map((y) => (
                            <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                {y.asmaY_Year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }
        if (row.field === 'ASMCL_Id_Join' || row.field === 'ASMCL_Id_Left') {
            return (
                <Select value={row.value} onValueChange={(v) => updateRow(index, { value: v })}>
                    <SelectTrigger className='h-9 w-full'>
                        <SelectValue placeholder='--Select Class--' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='0'>--All Class--</SelectItem>
                        {classes.map((c) => (
                            <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>
                                {c.asmcL_ClassName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }
        if (row.field === 'ALMST_PerCity') {
            return (
                <Select value={row.value} onValueChange={(v) => updateRow(index, { value: v })}>
                    <SelectTrigger className='h-9 w-full'>
                        <SelectValue placeholder='--Select City--' />
                    </SelectTrigger>
                    <SelectContent>
                        {cities.map((city, idx) => (
                            <SelectItem key={idx} value={city}>
                                {city}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }
        if (row.field === 'ALSPR_Designation') {
            return (
                <Select value={row.value} onValueChange={(v) => updateRow(index, { value: v })}>
                    <SelectTrigger className='h-9 w-full'>
                        <SelectValue placeholder='--Select Profession--' />
                    </SelectTrigger>
                    <SelectContent>
                        {occupations.map((job, idx) => (
                            <SelectItem key={idx} value={job}>
                                {job}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }
        return (
            <InputText
                value={row.value}
                onChange={(e) => updateRow(index, { value: e.target.value })}
                placeholder='Enter value'
                className='h-9'
                maxLength={row.field === 'ALMST_MobileNo' ? 10 : 100}
            />
        );
    };

    return (
        <div className='space-y-4'>
            <div className='overflow-x-auto rounded-lg border'>
                <table className='w-full border-collapse'>
                    <thead className='bg-muted/50'>
                        <tr className='border-b font-medium text-muted-foreground text-xs uppercase tracking-wider'>
                            <th className='px-4 py-3 text-left'>Field *</th>
                            <th className='px-4 py-3 text-left'>Operator *</th>
                            <th className='px-4 py-3 text-left'>Value *</th>
                            <th className='px-4 py-3 text-left'>Condition</th>
                            <th className='w-[100px] px-4 py-3 text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y'>
                        {rows.map((row, index) => (
                            <tr key={index} className='group transition-colors hover:bg-muted/30'>
                                <td className='min-w-[200px] px-4 py-3'>
                                    <Select value={row.field} onValueChange={(v) => updateRow(index, { field: v, value: '' })}>
                                        <SelectTrigger className='h-9'>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FIELDS.map((f) => (
                                                <SelectItem key={f.value} value={f.value}>
                                                    {f.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>
                                <td className='min-w-[160px] px-4 py-3'>
                                    <Select value={row.operator} onValueChange={(v) => updateRow(index, { operator: v })}>
                                        <SelectTrigger className='h-9'>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getOperatorsForField(row.field).map((o) => (
                                                <SelectItem key={o.value} value={o.value}>
                                                    {o.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>
                                <td className='min-w-[220px] px-4 py-3'>{renderValueInput(row, index)}</td>
                                <td className='min-w-[120px] px-4 py-3'>
                                    {index < rows.length - 1 ? (
                                        <Select value={row.condition} onValueChange={(v) => updateRow(index, { condition: v })}>
                                            <SelectTrigger className='h-9'>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CONDITIONS.map((c) => (
                                                    <SelectItem key={c.value} value={c.value}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <span className='text-muted-foreground text-xs'>-</span>
                                    )}
                                </td>
                                <td className='px-2 py-2'>
                                    <div className='flex items-center justify-center gap-1'>
                                        <Button type='button' variant='ghost' size='icon' className='h-8 w-8 text-primary' onClick={addRow}>
                                            <Plus className='h-4 w-4' />
                                        </Button>
                                        {rows.length > 1 && (
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='icon'
                                                className='h-8 w-8 text-destructive'
                                                onClick={() => removeRow(index)}>
                                                <Minus className='h-4 w-4' />
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-center gap-2'>
                <Button onClick={handleSearch} className='w-32'>
                    <Search className='mr-2 h-4 w-4' /> Search
                </Button>
                <Button
                    variant='outline'
                    onClick={() => {
                        setRows([{ field: '', operator: '', value: '', condition: 'AND' }]);
                        onClear();
                    }}
                    className='w-32'>
                    <Trash2 className='mr-2 h-4 w-4' /> Clear
                </Button>
            </div>
        </div>
    );
}
