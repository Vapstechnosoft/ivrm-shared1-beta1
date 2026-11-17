'use client';

import { useState, useEffect } from 'react';
import { PageDTO } from '@/types/super-admin/configuration-setting/institution-module-page';
import { Button } from '@/components/ui/button';
import { Minus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Save, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';

interface PrivilegeGridProps {
    data: PageDTO[];
    onUpdate: (data: PageDTO[]) => void;
    onSave: (data: PageDTO[]) => void;
    onCancel: () => void;
}

export default function PrivilegeGrid({ data: initialData, onUpdate, onSave, onCancel }: PrivilegeGridProps) {
    const [data, setData] = useState<PageDTO[]>(initialData);
    const [isOpen, setIsOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Global toggle states
    const [addAll, setAddAll] = useState(false);
    const [deleteAll, setDeleteAll] = useState(false);
    const [updateAll, setUpdateAll] = useState(false);
    const [processAll, setProcessAll] = useState(false);
    const [reportAll, setReportAll] = useState(false);
    const [searchAll, setSearchAll] = useState(false);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleSort = (key: keyof PageDTO) => {
        const sorted = [...data].sort((a, b) => {
            const valA = a[key] ?? '';
            const valB = b[key] ?? '';
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });
        setData(sorted);
    };

    // Toggle All Logic
    const toggleAllColumn = (key: keyof PageDTO, checked: boolean) => {
        const newData = data.map(item => ({ ...item, [key]: checked }));
        setData(newData);
        onUpdate(newData);
    };

    // Toggle Individual Logic
    const toggleRow = (id: number, key: keyof PageDTO, checked: boolean) => {
        const newData = data.map(item => item.ivrmP_Id === id ? { ...item, [key]: checked } : item);
        setData(newData);
        onUpdate(newData);
    };

    // Pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="box box-primary mt-4 border rounded-md shadow-sm">
            <div className="box-header with-border p-3 border-b flex justify-between items-center bg-gray-50">
                <h3 className="box-title text-lg font-medium">SELECTED INSTITUTE ROLE</h3>
                <div className="box-tools pull-right">
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="btn-box-tool">
                                <Minus className="h-4 w-4" />
                            </Button>
                        </CollapsibleTrigger>
                    </Collapsible>
                </div>
            </div>

            <Collapsible open={isOpen}>
                <CollapsibleContent>
                    <div className="box-body p-4">
                        <div className="overflow-x-auto">
                            <table className="table w-full text-sm text-center table-hover table-bordered border-collapse">
                                <thead className="bg-gray-100 font-bold">
                                    <tr>
                                        <th className="p-2 border">SL.NO</th>
                                        <th className="p-2 border cursor-pointer text-blue-600" onClick={() => handleSort('ivrmmP_PageName')}>Page Name</th>
                                        {/* Dynamic Headers with "Select All" logic */}
                                        {[
                                            { key: 'ivrmrP_AddFlag', label: 'Add', state: addAll, setState: setAddAll },
                                            { key: 'ivrmrP_DeleteFlag', label: 'Delete', state: deleteAll, setState: setDeleteAll },
                                            { key: 'ivrmrP_UpdateFlag', label: 'Update', state: updateAll, setState: setUpdateAll },
                                            { key: 'ivrmrP_ProcessFlag', label: 'Process', state: processAll, setState: setProcessAll },
                                            { key: 'ivrmrP_ReportFlag', label: 'Report', state: reportAll, setState: setReportAll },
                                            { key: 'ivrmrP_SearchFlag', label: 'Search', state: searchAll, setState: setSearchAll },
                                        ].map((col) => (
                                            <th key={col.key} className="p-2 border">
                                                <div className="flex flex-col items-center">
                                                    <span className="cursor-pointer text-blue-600" onClick={() => handleSort(col.key as keyof PageDTO)}>{col.label}</span>
                                                    <Checkbox
                                                        checked={col.state}
                                                        onCheckedChange={(c) => {
                                                            col.setState(c as boolean);
                                                            toggleAllColumn(col.key as keyof PageDTO, c as boolean);
                                                        }}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((item, index) => (
                                        <tr key={item.ivrmP_Id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="p-2 border">{startIndex + index + 1}</td>
                                            <td className="p-2 border text-left">{item.ivrmmP_PageName}</td>
                                            {['ivrmrP_AddFlag', 'ivrmrP_DeleteFlag', 'ivrmrP_UpdateFlag', 'ivrmrP_ProcessFlag', 'ivrmrP_ReportFlag', 'ivrmrP_SearchFlag'].map((flagKey) => (
                                                <td key={flagKey} className="p-2 border">
                                                    <Checkbox
                                                        checked={!!item[flagKey as keyof PageDTO]}
                                                        onCheckedChange={(c) => toggleRow(item.ivrmP_Id, flagKey as keyof PageDTO, c as boolean)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {paginatedData.length === 0 && (
                                        <tr><td colSpan={8} className="text-center p-4">No Data Selected</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-4 mb-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} entries
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        <hr className="my-4" />

                        {/* Actions */}
                        <div className="flex justify-center gap-4">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onSave(data)}>
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                            <Button variant="destructive" onClick={onCancel}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
