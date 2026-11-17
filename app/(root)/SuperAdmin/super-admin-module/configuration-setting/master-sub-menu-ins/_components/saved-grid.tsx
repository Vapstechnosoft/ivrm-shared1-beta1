'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Trash2, ArrowUpDown, Minus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MasterSubMenuINSDTO } from '@/types/super-admin/configuration-setting/master-sub-menu-ins';

import SetOrderModal from './set-order-modal';
import { SetOrderRequest } from '@/types/super-admin/configuration-setting/master-sub-menu-ins';

interface SavedGridProps {
    data: MasterSubMenuINSDTO[];
    onDelete: (item: MasterSubMenuINSDTO) => void;
    onSaveOrder?: (payload: SetOrderRequest) => Promise<void>;
}

export default function SavedGrid({ data, onDelete, onSaveOrder }: SavedGridProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof MasterSubMenuINSDTO; direction: 'asc' | 'desc' } | null>({
        key: 'ivrmmmI_MenuOrder',
        direction: 'asc'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [isOpen, setIsOpen] = useState(true);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const handleSort = (key: keyof MasterSubMenuINSDTO) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredData = sortedData.filter((item) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
            item.mI_Name.toLowerCase().includes(lowerSearch) ||
            item.modulename.toLowerCase().includes(lowerSearch) ||
            item.ivrmmmI_MenuName.toLowerCase().includes(lowerSearch)
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="box box-primary mt-4 border rounded-md shadow-sm">
            <div className="box-header with-border p-3 border-b flex justify-between items-center bg-gray-50">
                <h3 className="box-title text-lg font-medium">Institute Sub Menu List</h3>
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
                        {/* Search Bar */}
                        <div className="row mb-4 flex justify-end">
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <div className="relative">
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
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="table w-full text-sm text-left table-hover table-bordered border-collapse">
                                <thead className="bg-gray-100 text-center font-bold">
                                    <tr>
                                        <th className="p-2 border text-center">SL.NO</th>
                                        <th className="p-2 border cursor-pointer text-blue-600" onClick={() => handleSort('mI_Name')}>
                                            Institution Name <ArrowUpDown className="inline h-3 w-3 ml-1" />
                                        </th>
                                        <th className="p-2 border cursor-pointer text-blue-600" onClick={() => handleSort('modulename')}>
                                            Module Name <ArrowUpDown className="inline h-3 w-3 ml-1" />
                                        </th>
                                        <th className="p-2 border cursor-pointer text-blue-600" onClick={() => handleSort('ivrmmmI_MenuName')}>
                                            Sub Menu Name <ArrowUpDown className="inline h-3 w-3 ml-1" />
                                        </th>
                                        <th className="p-2 border cursor-pointer text-blue-600" onClick={() => handleSort('ivrmmmI_MenuOrder')}>
                                            Order <ArrowUpDown className="inline h-3 w-3 ml-1" />
                                        </th>
                                        <th className="p-2 border text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <tr key={`${item.ivrmmmI_Id}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="p-2 border text-center">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="p-2 border text-center">{item.mI_Name}</td>
                                                <td className="p-2 border text-center">{item.modulename}</td>
                                                <td className="p-2 border text-center">{item.ivrmmmI_MenuName}</td>
                                                <td className="p-2 border text-center">{item.ivrmmmI_MenuOrder}</td>
                                                <td className="p-2 border text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => onDelete(item)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center p-4">No Data Found</td>
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

                        <div className="p-4 border-t flex justify-center gap-4">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => setIsOrderModalOpen(true)}
                            >
                                <ArrowUpDown className="mr-2 h-4 w-4" /> Set Order
                            </Button>
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                <Trash2 className="mr-2 h-4 w-4" /> Clear
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Set Order Modal */}
            {onSaveOrder && (
                <SetOrderModal
                    isOpen={isOrderModalOpen}
                    onClose={() => setIsOrderModalOpen(false)}
                    data={data}
                    onSave={onSaveOrder}
                />
            )}
        </div>
    );
}
