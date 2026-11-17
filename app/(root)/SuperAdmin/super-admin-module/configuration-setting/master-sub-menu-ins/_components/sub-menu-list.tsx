'use client';

import { useState, useEffect } from 'react';
import { SubMenuOnChangeDTO } from '@/types/super-admin/configuration-setting/master-sub-menu-ins';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Minus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Save, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SubMenuListProps {
    data: SubMenuOnChangeDTO[];
    onSelectionChange?: (selectedItems: SubMenuOnChangeDTO[]) => void;
    onSave?: (items: SubMenuOnChangeDTO[]) => void;
    onClear?: () => void;
}

export default function SubMenuList({ data: initialData, onSelectionChange, onSave, onClear }: SubMenuListProps) {
    const [data, setData] = useState<SubMenuOnChangeDTO[]>(initialData);
    const [isOpen, setIsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Filtering
    const filteredData = data.filter((item) =>
        item.ivrmmmI_MenuName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleCheckboxChange = (id: number, checked: boolean) => {
        const newData = data.map(item => item.ivrmmM_Id === id ? { ...item, checked } : item);
        setData(newData);
        if (onSelectionChange) {
            onSelectionChange(newData.filter(i => i.checked));
        }
    };

    const handleSort = (key: keyof SubMenuOnChangeDTO) => {
        // Implement simple client-side sort if needed, simplified for now based on snippet
    };

    const handleNameChange = (id: number, newName: string) => {
        const newData = data.map(item => item.ivrmmM_Id === id ? { ...item, ivrmmmI_MenuName: newName } : item);
        setData(newData);
    };

    return (
        <div className="box box-primary mt-4 border rounded-md shadow-sm bg-white">
            <div className="box-header with-border p-3 border-b flex justify-between items-center bg-gray-50">
                <h3 className="box-title text-lg font-medium text-[#3a0ca3]">Sub Menu List</h3>
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
                        {/* Search */}
                        <div className="flex justify-end mb-4">
                            <div className="relative w-1/3">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type="text"
                                    className="pl-10"
                                    placeholder="search here..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="table w-full text-sm text-left table-hover table-bordered border-collapse">
                                <thead className="bg-gray-100 text-center font-bold">
                                    <tr>
                                        <th className="p-2 border w-16 text-center">SL.NO</th>
                                        <th className="p-2 border cursor-pointer hover:text-blue-600">
                                            Sub Menu Name
                                        </th>
                                        <th className="p-2 border text-center w-24">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <tr key={item.ivrmmM_Id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="p-2 border text-center">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="p-2 border text-center">
                                                    <Input
                                                        value={item.ivrmmmI_MenuName}
                                                        onChange={(e) => handleNameChange(item.ivrmmM_Id, e.target.value)}
                                                        className="w-full text-center"
                                                    // allow-pattern logic is typical regex in React, controlled via onChange
                                                    />
                                                </td>
                                                <td className="p-2 border text-center">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={item.checked || false}
                                                            onCheckedChange={(checked) => handleCheckboxChange(item.ivrmmM_Id, checked as boolean)}
                                                            title="Add Cart"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center p-4">No Data Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}><ChevronRight className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}><ChevronsRight className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        <hr className="my-4" />

                        {/* Footer Buttons */}
                        <div className="flex justify-center gap-4">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => onSave && onSave(data.filter(i => i.checked))}
                            >
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                            <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={onClear}
                            >
                                <X className="mr-2 h-4 w-4" /> Clear
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
