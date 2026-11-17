'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MainMenuModuleDTO } from '@/types/super-admin/configuration-setting/master-main-menu-ins';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Minus, Save, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Static lists for Icon and Color as per user requirement
const ICON_LIST = [
    { id: 'Graduation-Cap', value: 'graduation-cap' },
    { id: 'Users+', value: 'user-plus' },
    { id: 'users', value: 'users' },
    { id: 'CreditCard', value: 'credit-card-alt ' },
    { id: 'Desktop', value: 'desktop' },
    { id: 'Map', value: 'map' },
    { id: 'Server', value: 'server' },
    { id: 'Calendar', value: 'calendar-plus-o ' },
    { id: 'Cake', value: 'birthday-cake' },
    { id: 'Envelope', value: 'envelope' },
    { id: 'Bus ', value: 'bus ' },
    { id: 'Add Cart', value: 'cart-plus' },
    { id: 'Book', value: 'book' },
    { id: 'Reddit ', value: 'reddit ' },
    { id: 'Tie', value: 'black-tie' },
    { id: 'Fee-Money', value: 'money' },
    { id: 'Chart-Bar', value: 'bar-chart' },
    { id: 'Edit-Pencil', value: 'pencil-square-o  ' },
    { id: 'University', value: 'university' },
    { id: 'Soccer Ball', value: 'soccer-ball-o' },
    { id: 'Area Chart', value: 'area-chart' },
    { id: 'Download', value: 'cloud-download' },
    { id: 'Upload', value: 'cloud-upload' },
    { id: 'Comments', value: 'comments' },
    { id: 'Dashboard', value: 'tachometer' },
    { id: 'Database', value: 'database' },
    { id: 'Line-chart', value: 'line-chart' },
    { id: 'Mastercard', value: 'cc-mastercard' },
    { id: 'Pie-chart', value: 'pie-chart' }
];

const COLOR_LIST = [
    { id: 'color1', value: 'color1' },
    { id: 'color2', value: 'color2' },
    { id: 'color3', value: 'color3' },
    { id: 'color4', value: 'color4' },
    { id: 'color5', value: 'color5' },
    { id: 'color6', value: 'color6' },
    { id: 'color7', value: 'color7' },
    { id: 'color8', value: 'color8' },
    { id: 'color9', value: 'color9' },
    { id: 'color10', value: 'color10' },
    { id: 'color11', value: 'color11' },
    { id: 'color12', value: 'color12' },
    { id: 'color13', value: 'color13' },
    { id: 'color14', value: 'color14' },
    { id: 'color15', value: 'color15' },
    { id: 'color16', value: 'color16' },
    { id: 'color17', value: 'color17' },
    { id: 'color18', value: 'color18' },
    { id: 'color19', value: 'color19' },
    { id: 'color20', value: 'color20' },
    { id: 'color21', value: 'color21' },
    { id: 'color22', value: 'color22' },
    { id: 'color23', value: 'color23' },
    { id: 'color24', value: 'color24' },
    { id: 'color25', value: 'color25' },
    { id: 'color26', value: 'color26' },
    { id: 'color27', value: 'color27' },
    { id: 'color28', value: 'color28' },
    { id: 'color29', value: 'color29' },
    { id: 'color30', value: 'color30' }
];

interface ModuleMenuGridProps {
    data: MainMenuModuleDTO[];
    onSave: (items: MainMenuModuleDTO[]) => void;
    onCancel: () => void;
}

export default function ModuleMenuGrid({ data: initialData, onSave, onCancel }: ModuleMenuGridProps) {
    const [data, setData] = useState<MainMenuModuleDTO[]>([]);
    const [isOpen, setIsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        // Initialize local state with data and default values
        const mappedData = initialData.map((item) => ({
            ...item,
            customMenuName: item.ivrmmmI_MenuName,
            selectedIcon: '',
            selectedColor: '',
            checked: false
        }));
        setData(mappedData);
    }, [initialData]);

    const handleFieldChange = (id: number, field: keyof MainMenuModuleDTO, value: any) => {
        setData((prev) => prev.map((item) => (item.ivrmmM_Id === id ? { ...item, [field]: value } : item)));
    };

    // Filtering
    const filteredData = data.filter(
        (item) =>
            item.modulename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.ivrmmmI_MenuName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (key: keyof MainMenuModuleDTO) => {
        const sorted = [...data].sort((a, b) => {
            const valA = a[key] ?? '';
            const valB = b[key] ?? '';
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });
        setData(sorted);
    };

    const handleSave = () => {
        // Filter only checked items
        const checkedItems = data.filter((item) => item.checked);
        if (checkedItems.length === 0) {
            alert('Please select at least one item to save.');
            return;
        }
        // Basic validation
        const invalidItems = checkedItems.filter((item) => !item.selectedIcon || !item.selectedColor || !item.customMenuName);
        if (invalidItems.length > 0) {
            alert('Please select Icon and Color for all selected items.');
            return;
        }

        onSave(checkedItems);
    };

    return (
        <div className='box box-primary mt-4 rounded-md border bg-white shadow-sm'>
            <div className='box-header with-border flex items-center justify-between border-b bg-gray-50 p-3'>
                <h3 className='box-title font-medium text-lg'>Main Menu List</h3>
                <div className='box-tools pull-right'>
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant='ghost' size='sm' className='btn-box-tool'>
                                <Minus className='h-4 w-4' />
                            </Button>
                        </CollapsibleTrigger>
                    </Collapsible>
                </div>
            </div>

            <Collapsible open={isOpen}>
                <CollapsibleContent>
                    <div className='box-body p-4'>
                        {/* Search Bar */}
                        <div className='row mb-4 flex justify-end'>
                            <div className='col-sm-4'>
                                <div className='relative'>
                                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                                        <Search className='h-4 w-4 text-gray-400' />
                                    </div>
                                    <Input
                                        type='text'
                                        className='pl-10'
                                        placeholder='search here...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className='overflow-x-auto'>
                            <table className='table-hover table-bordered table w-full border-collapse text-left text-sm'>
                                <thead className='bg-gray-100 text-center font-bold'>
                                    <tr>
                                        <th className='border p-2 text-center'>SL.NO</th>
                                        <th className='cursor-pointer border p-2 text-blue-600' onClick={() => handleSort('modulename')}>
                                            Module Name <ArrowUpDown className='ml-1 inline h-3 w-3' />
                                        </th>
                                        <th
                                            className='cursor-pointer border p-2 text-blue-600'
                                            onClick={() => handleSort('ivrmmmI_MenuName')}>
                                            Main Menu Name <ArrowUpDown className='ml-1 inline h-3 w-3' />
                                        </th>
                                        <th className='border p-2 text-center'>Main Menu Icon</th>
                                        <th className='border p-2 text-center'>Main Menu Color</th>
                                        <th className='border p-2 text-center'>Preview</th>
                                        <th className='border p-2 text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((item, index) => (
                                        <tr key={`mod-grid-${item.ivrmmM_Id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className='border p-2 text-center'>{startIndex + index + 1}</td>
                                            <td className='border p-2 text-center'>{item.modulename}</td>

                                            {/* Editable Menu Name */}
                                            <td className='border p-2'>
                                                <Input
                                                    value={item.customMenuName || ''}
                                                    onChange={(e) => handleFieldChange(item.ivrmmM_Id, 'customMenuName', e.target.value)}
                                                    className='w-full'
                                                />
                                            </td>

                                            {/* Icon Select */}
                                            <td className='border p-2'>
                                                <Select
                                                    onValueChange={(val) => handleFieldChange(item.ivrmmM_Id, 'selectedIcon', val)}
                                                    value={item.selectedIcon}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select Icon' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ICON_LIST.map((opt) => (
                                                            <SelectItem key={opt.id} value={opt.value}>
                                                                {opt.id}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </td>

                                            {/* Color Select */}
                                            <td className='border p-2'>
                                                <Select
                                                    onValueChange={(val) => handleFieldChange(item.ivrmmM_Id, 'selectedColor', val)}
                                                    value={item.selectedColor}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select Color' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {COLOR_LIST.map((opt) => (
                                                            <SelectItem key={opt.id} value={opt.id}>
                                                                {opt.value}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </td>

                                            {/* Preview */}
                                            <td className='border p-2 text-center'>
                                                {item.selectedIcon && item.selectedColor && (
                                                    <div
                                                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full`}
                                                        style={{
                                                            backgroundColor:
                                                                item.selectedColor === 'color1'
                                                                    ? 'red'
                                                                    : item.selectedColor === 'color2'
                                                                      ? 'blue'
                                                                      : 'gray' /* Simple preview logic, expand if needed */
                                                        }}>
                                                        <i className={`fa fa-${item.selectedIcon} text-white`}></i>
                                                    </div>
                                                )}
                                                {/* Fallback text preview if visual color map is too complex for simple string */}
                                                {item.selectedIcon && !item.selectedColor && (
                                                    <i className={`fa fa-${item.selectedIcon}`}></i>
                                                )}
                                            </td>

                                            {/* Checkbox Action */}
                                            <td className='border p-2 text-center'>
                                                <Checkbox
                                                    checked={item.checked || false}
                                                    onCheckedChange={(checked) => handleFieldChange(item.ivrmmM_Id, 'checked', checked)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className='p-4 text-center'>
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className='mt-4 mb-4 flex items-center justify-between'>
                            <div className='text-muted-foreground text-sm'>
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
                                {filteredData.length} entries
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}>
                                    <ChevronsLeft className='h-4 w-4' />
                                </Button>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}>
                                    <ChevronLeft className='h-4 w-4' />
                                </Button>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}>
                                    <ChevronRight className='h-4 w-4' />
                                </Button>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}>
                                    <ChevronsRight className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>

                        <hr className='my-4' />

                        {/* Footer Buttons */}
                        <div className='flex justify-center gap-4'>
                            <Button className='bg-blue-600 text-white hover:bg-blue-700' onClick={handleSave}>
                                <Save className='mr-2 h-4 w-4' /> Save
                            </Button>
                            <Button variant='secondary' className='bg-red-500 text-white hover:bg-red-600' onClick={onCancel}>
                                <X className='mr-2 h-4 w-4' /> Cancel
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
