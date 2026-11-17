'use client';

import React from 'react';
import { usePageMapping } from './mapping-context';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ModuleSelection() {
    const { modules, selectedModuleId, setSelectedModuleId } = usePageMapping();

    return (
        <div className="grid grid-cols-12 gap-4 items-center mb-6 p-4 border rounded-md bg-white shadow-sm">
            <Label className="col-span-12 md:col-span-2 text-md font-semibold">Select Module:</Label>
            <div className="col-span-12 md:col-span-4">
                <Select
                    value={selectedModuleId ? String(selectedModuleId) : ''}
                    onValueChange={(val) => setSelectedModuleId(Number(val))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="-- Select Module --" />
                    </SelectTrigger>
                    <SelectContent>
                        {modules.map((mod) => (
                            <SelectItem key={mod.ivrmM_Id} value={String(mod.ivrmM_Id)}>
                                {mod.ivrmM_ModuleName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
