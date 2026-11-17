'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Spinner as LoadingSpinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { masterMenuPageMappingSchema, type MasterMenuPageMappingSchema } from '@/schemas/super-admin/super-admin-module/general-setting/master-menu-page-mapping';
import { saveMasterMenuPageMapping, getMainMenuDropdown, getSubMenuDropdown, getMasterPagesOnChangeSubMenu, getSavedMasterMenuOnChangeSubMenu } from '@/server/super-admin/super-admin-module/general-setting/master-menu-page-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IModuleDropdownItem, IMainMenuDropdownItem, ISubMenuDropdownItem, IMasterPageItem } from '@/types/super-admin/super-admin-module/general-setting/master-menu-page-mapping';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface AddMasterMenuPageMappingFormProps {
    onSuccess?: () => void;
    modules: IModuleDropdownItem[];
    allPages: IMasterPageItem[];
}

export default function AddMasterMenuPageMappingForm({ onSuccess, modules, allPages }: AddMasterMenuPageMappingFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [mainMenus, setMainMenus] = useState<IMainMenuDropdownItem[]>([]);
    const [subMenus, setSubMenus] = useState<ISubMenuDropdownItem[]>([]);

    // Master Pages state
    const [masterPages, setMasterPages] = useState<IMasterPageItem[]>([]);
    const [savedMenus, setSavedMenus] = useState<any[]>([]);

    // Page selection state
    const [selectedPages, setSelectedPages] = useState<IMasterPageItem[]>([]);
    const [pageSearch, setPageSearch] = useState('');

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<MasterMenuPageMappingSchema>({
        resolver: zodResolver(masterMenuPageMappingSchema),
        defaultValues: {
            ivrmM_Id: 0,
            ivrmmM_Id: 0,
            ivrmmS_Id: 0,
        },
    });

    const selectedModuleId = watch('ivrmM_Id');
    const selectedMainMenuId = watch('ivrmmM_Id');
    const selectedSubMenuId = watch('ivrmmS_Id');

    // Fetch dropdowns when module changes
    useEffect(() => {
        if (selectedModuleId) {
            getMainMenuDropdown(selectedModuleId).then(res => {
                if (res.success && res.data) {
                    setMainMenus(res.data);
                } else {
                    setMainMenus([]);
                }
            });

            getSubMenuDropdown(selectedModuleId).then(res => {
                if (res.success && res.data) {
                    setSubMenus(res.data);
                } else {
                    setSubMenus([]);
                }
            });
        } else {
            setMainMenus([]);
            setSubMenus([]);
        }
    }, [selectedModuleId]);

    // Fetch master pages when sub menu changes
    useEffect(() => {
        if (Number(selectedSubMenuId) > 0) {
            setIsLoading(true);
            getMasterPagesOnChangeSubMenu(Number(selectedSubMenuId)).then(res => {
                if (res.success && res.data) {
                    setMasterPages(res.data);
                } else {
                    setMasterPages([]);
                }
                setIsLoading(false);
            });

            getSavedMasterMenuOnChangeSubMenu(Number(selectedModuleId), Number(selectedSubMenuId)).then(res => {
                if (res.success && res.data) {
                    setSavedMenus(res.data);
                } else {
                    setSavedMenus([]);
                }
            });
        } else {
            setMasterPages([]);
            setSavedMenus([]);
        }
    }, [selectedSubMenuId]);


    const handleAddPage = (page: IMasterPageItem) => {
        if (!selectedPages.some(p => p.ivrmP_Id === page.ivrmP_Id)) {
            setSelectedPages([...selectedPages, page]);
        }
    };

    const handleRemovePage = (pageId: number) => {
        setSelectedPages(selectedPages.filter(p => p.ivrmP_Id !== pageId));
    };

    const filteredPages = masterPages.filter(page =>
        page.pagename.toLowerCase().includes(pageSearch.toLowerCase())
    );

    const filteredSubMenus = selectedMainMenuId
        ? subMenus.filter(m => m.ivrmmM_Id === selectedMainMenuId)
        : subMenus;

    const onSubmit = async (data: MasterMenuPageMappingSchema) => {
        if (selectedPages.length === 0) {
            toast.error('Please select at least one page');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ivrmmM_Id: Number(data.ivrmmS_Id),
                savetmpdata: selectedPages.map(p => ({
                    ivrmP_Id: p.ivrmP_Id,
                    createdDate: new Date(),
                    updatedDate: new Date()
                })),
                returnval: true
            };

            const result = await saveMasterMenuPageMapping(payload);
            if (result.success) {
                toast.success('Saved Successfully');
                reset();
                setSelectedPages([]);
                onSuccess?.();
            } else {
                toast.error(result.message || 'Failed to save data');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='p-4'>
                <div className='mx-auto max-w-4xl space-y-4'>
                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Module Name <span className='text-red-500'>*</span></Label>
                            <Controller
                                control={control}
                                name='ivrmM_Id'
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? field.value.toString() : ''}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                            setValue('ivrmmM_Id', 0);
                                            setValue('ivrmmS_Id', 0);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Module" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modules.map((module) => (
                                                <SelectItem key={module.ivrmM_Id} value={module.ivrmM_Id.toString()}>
                                                    {module.ivrmM_ModuleName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError>{errors.ivrmM_Id?.message}</FormError>
                        </div>
                        <div className="space-y-2">
                            <Label>Main Menu Name <span className='text-red-500'>*</span></Label>
                            <Controller
                                control={control}
                                name='ivrmmM_Id'
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? field.value.toString() : ''}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                            setValue('ivrmmS_Id', 0);
                                        }}
                                        disabled={!selectedModuleId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Main Menu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mainMenus.map((menu) => (
                                                <SelectItem key={menu.ivrmmM_Id} value={menu.ivrmmM_Id.toString()}>
                                                    {menu.ivrmmM_MenuName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError>{errors.ivrmmM_Id?.message}</FormError>
                        </div>
                        <div className="space-y-2">
                            <Label>Sub Menu Name <span className='text-red-500'>*</span></Label>
                            <Controller
                                control={control}
                                name='ivrmmS_Id'
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? field.value.toString() : ''}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        disabled={!selectedModuleId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Sub Menu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredSubMenus.map((menu) => (
                                                <SelectItem key={menu.ivrmmS_Id} value={menu.ivrmmS_Id.toString()}>
                                                    {menu.ivrmmS_SubMenuName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError>{errors.ivrmmS_Id?.message}</FormError>
                        </div>
                    </div>

                    {/* Grids */}
                    {Number(selectedSubMenuId) > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {/* Master Pages Grid */}
                            <div className="border rounded-md p-4 shadow-sm bg-background">
                                <h3 className="font-semibold mb-2">Master Pages</h3>
                                <div className="relative mb-4">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search pages..."
                                        className="pl-8"
                                        value={pageSearch}
                                        onChange={(e) => setPageSearch(e.target.value)}
                                    />
                                </div>
                                <div className="h-64 overflow-y-auto border rounded-md">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 sticky top-0">
                                            <tr>
                                                <th className="p-2">Page Name</th>
                                                <th className="p-2 text-center">Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPages.map((page) => {
                                                const isSelected = selectedPages.some(p => p.ivrmP_Id === page.ivrmP_Id);
                                                return (
                                                    <tr key={page.ivrmP_Id} className="border-b hover:bg-muted/50">
                                                        <td className="p-2">{page.pagename}</td>
                                                        <td className="p-2 text-center">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) handleAddPage(page);
                                                                    else handleRemovePage(page.ivrmP_Id);
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredPages.length === 0 && (
                                                <tr>
                                                    <td colSpan={2} className="p-4 text-center text-muted-foreground">No pages found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Selected Pages Grid */}
                            <div className="border rounded-md p-4 shadow-sm bg-background">
                                <h3 className="font-semibold mb-2">Selected Pages</h3>
                                <div className="h-[21rem] overflow-y-auto border rounded-md mt-14"> {/* Added top margin to align with search box height */}
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 sticky top-0">
                                            <tr>
                                                <th className="p-2">Page Name</th>
                                                <th className="p-2 text-center">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPages.map((page) => (
                                                <tr key={page.ivrmP_Id} className="border-b hover:bg-muted/50">
                                                    <td className="p-2">{page.pagename}</td>
                                                    <td className="p-2 text-center">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 text-destructive p-0 hover:bg-destructive/10"
                                                            onClick={() => handleRemovePage(page.ivrmP_Id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {selectedPages.length === 0 && (
                                                <tr>
                                                    <td colSpan={2} className="p-4 text-center text-muted-foreground">No pages selected</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Saved Master Menu Grid */}
                    {Number(selectedSubMenuId) > 0 && (
                        <div className="border rounded-md p-4 shadow-sm bg-background mt-6">
                            <h3 className="font-semibold mb-2">Previous Grid Details</h3>
                            <div className="overflow-x-auto max-h-64 border rounded-md">
                                <table className="w-full text-sm text-left table-auto">
                                    <thead className="bg-muted/50 sticky top-0">
                                        <tr>
                                            <th className="p-2 text-center border">SL.NO</th>
                                            <th className="p-2 text-center border">Sub Menu Name</th>
                                            <th className="p-2 text-center border">Module Name</th>
                                            <th className="p-2 text-center border">Page Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedMenus.map((menu, index) => (
                                            <tr key={index} className="border-b hover:bg-muted/50">
                                                <td className="p-2 text-center border">{index + 1}</td>
                                                <td className="p-2 border">{menu.submenuname}</td>
                                                <td className="p-2 border">{menu.modulename}</td>
                                                <td className="p-2 border">{menu.pagename}</td>
                                            </tr>
                                        ))}
                                        {savedMenus.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-muted-foreground border">No records found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {Number(selectedSubMenuId) > 0 && (
                    <div className='mt-8 flex justify-center gap-4 border-t pt-4'>
                        <Button
                            type='button'
                            variant='destructive'
                            onClick={() => { reset(); setSelectedPages([]); onSuccess?.(); }}
                            className='bg-red-500 hover:bg-red-600 w-32'
                        >
                            <X className='mr-2 h-4 w-4' />
                            Cancel
                        </Button>

                        <Button
                            type='submit'
                            disabled={isLoading}
                            className='bg-blue-600 hover:bg-blue-700 w-32'
                        >
                            {isLoading ? <LoadingSpinner /> : <Save className='mr-2 h-4 w-4' />}
                            Save
                        </Button>
                    </div>
                )}
            </div>
        </form>
    );
}
