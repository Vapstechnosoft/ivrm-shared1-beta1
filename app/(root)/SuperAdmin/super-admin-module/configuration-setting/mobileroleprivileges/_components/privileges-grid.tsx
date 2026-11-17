'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import type { IMobileRolePrivilege } from '@/types/super-admin/configuration-setting/mobileroleprivileges';
import { Filter, ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PrivilegesGridProps {
    data: IMobileRolePrivilege[];
    onChange: (data: IMobileRolePrivilege[]) => void;
    onDelete?: (item: IMobileRolePrivilege) => void;
    title: string;
    isCart?: boolean;
}

export function PrivilegesGrid({ data, onChange, onDelete, title, isCart }: PrivilegesGridProps) {
    if (!data || data.length === 0) return null;

    const [searchTerm, setSearchTerm] = useState('');

    const handleCheckChange = (index: number, field: keyof IMobileRolePrivilege, checked: boolean) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: checked };
        onChange(newData);
    };

    const toggleAll = (field: keyof IMobileRolePrivilege, checked: boolean) => {
        const newData = data.map((item) => ({ ...item, [field]: checked }));
        onChange(newData);
    };

    const filteredData = data.filter((item) => item.ivrmmaP_AppPageName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg'>
            <div className='flex flex-wrap items-center justify-between gap-4 border-b bg-gradient-to-r bg-slate-50/80 from-slate-50 to-white p-4'>
                <div className='flex items-center gap-2'>
                    <ShieldCheck className='h-5 w-5 text-[#7C3AED]' />
                    <h3 className='font-bold text-lg text-slate-800'>{title}</h3>
                    <span className='ml-2 rounded-full bg-slate-200 px-2 py-0.5 font-semibold text-slate-600 text-xs'>
                        {data.length} {data.length === 1 ? 'Page' : 'Pages'}
                    </span>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='relative w-64'>
                        <InputText
                            placeholder='Filter mapping...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='border-slate-200 bg-white pl-8'
                        />
                        <Filter className='-translate-y-1/2 absolute top-1/2 left-2.5 h-4 w-4 text-slate-400' />
                    </div>
                </div>
            </div>
            <div className='max-h-[500px] overflow-x-auto overflow-y-auto'>
                <table className='w-full border-collapse text-left text-sm'>
                    <thead className='sticky top-0 z-10 border-b bg-slate-50/50 text-slate-500 text-xs uppercase backdrop-blur-sm'>
                        <tr>
                            <th className='px-6 py-4 font-semibold'>SL.NO</th>
                            <th className='px-6 py-4 font-semibold'>Page Name</th>
                            <th
                                className='group cursor-pointer px-6 py-4 text-center font-semibold transition-colors hover:text-[#7C3AED]'
                                onClick={() => toggleAll('ivrmrP_AddFlag', !data.every((d) => d.ivrmrP_AddFlag))}>
                                Add
                            </th>
                            <th
                                className='group cursor-pointer px-6 py-4 text-center font-semibold transition-colors hover:text-red-500'
                                onClick={() => toggleAll('ivrmrP_DeleteFlag', !data.every((d) => d.ivrmrP_DeleteFlag))}>
                                Delete
                            </th>
                            <th
                                className='group cursor-pointer px-6 py-4 text-center font-semibold transition-colors hover:text-blue-500'
                                onClick={() => toggleAll('ivrmrP_UpdateFlag', !data.every((d) => d.ivrmrP_UpdateFlag))}>
                                Update
                            </th>
                            <th
                                className='group cursor-pointer px-6 py-4 text-center font-semibold transition-colors hover:text-green-500'
                                onClick={() => toggleAll('ivrmrP_ReportFlag', !data.every((d) => d.ivrmrP_ReportFlag))}>
                                Report
                            </th>
                            {isCart && <th className='px-6 py-4 text-center font-semibold'>Action</th>}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {filteredData.map((item, index) => (
                            <tr key={index} className='group transition-colors hover:bg-slate-50/50'>
                                <td className='px-6 py-4 font-medium text-slate-500'>{index + 1}</td>
                                <td className='px-6 py-4 font-semibold text-slate-800'>{item.ivrmmaP_AppPageName}</td>
                                <td className='px-6 py-4 text-center'>
                                    <Checkbox
                                        checked={item.ivrmrP_AddFlag}
                                        onCheckedChange={(c) => handleCheckChange(index, 'ivrmrP_AddFlag', c as boolean)}
                                        className='border-slate-300 data-[state=checked]:border-[#7C3AED] data-[state=checked]:bg-[#7C3AED]'
                                    />
                                </td>
                                <td className='px-6 py-4 text-center'>
                                    <Checkbox
                                        checked={item.ivrmrP_DeleteFlag}
                                        onCheckedChange={(c) => handleCheckChange(index, 'ivrmrP_DeleteFlag', c as boolean)}
                                        className='border-slate-300 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500'
                                    />
                                </td>
                                <td className='px-6 py-4 text-center'>
                                    <Checkbox
                                        checked={item.ivrmrP_UpdateFlag}
                                        onCheckedChange={(c) => handleCheckChange(index, 'ivrmrP_UpdateFlag', c as boolean)}
                                        className='border-slate-300 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500'
                                    />
                                </td>
                                <td className='px-6 py-4 text-center'>
                                    <Checkbox
                                        checked={item.ivrmrP_ReportFlag}
                                        onCheckedChange={(c) => handleCheckChange(index, 'ivrmrP_ReportFlag', c as boolean)}
                                        className='border-slate-300 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500'
                                    />
                                </td>
                                {isCart && onDelete && (
                                    <td className='px-6 py-4 text-center'>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            className='rounded-full text-slate-400 transition-all hover:bg-red-50 hover:text-red-500'
                                            onClick={() => onDelete(item)}>
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!filteredData.length && (
                <div className='p-12 text-center'>
                    <p className='font-medium text-slate-400 italic'>No mappings found matching your search</p>
                </div>
            )}
        </div>
    );
}
