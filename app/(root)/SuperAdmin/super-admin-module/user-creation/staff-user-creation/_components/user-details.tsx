'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CategoryDTO, ModuleDTO } from '@/types/super-admin/user-creation/staff-user-creation';
import { useFormContext } from 'react-hook-form';

interface UserDetailsProps {
    categories: CategoryDTO[];
    onCategoryChange: (categories: CategoryDTO[]) => void;
    modules: ModuleDTO[];
    onModuleChange: (modules: ModuleDTO[]) => void;
    onSelectAllCategories: () => void;
    onSelectAllModules: () => void;
    isUserNameDisabled?: boolean;
    onChangeUsernameToggle?: () => void;
}

export default function UserDetails({
    categories,
    onCategoryChange,
    modules,
    onModuleChange,
    onSelectAllCategories,
    onSelectAllModules,
    isUserNameDisabled = false,
    onChangeUsernameToggle
}: UserDetailsProps) {
    const { register, watch } = useFormContext();
    const filterData = watch('filterData');

    const handleCategoryCheck = (catId: number, checked: boolean) => {
        const updatedCategories = categories.map((cat) => (cat.amC_Id === catId ? { ...cat, catid: checked } : cat));
        onCategoryChange(updatedCategories);
    };

    const handleModuleCheck = (modId: number, checked: boolean) => {
        const updatedModules = modules.map((mod) => (mod.ivrmM_Id === modId ? { ...mod, model: checked } : mod));
        onModuleChange(updatedModules);
    };

    return (
        <div className='grid grid-cols-1 gap-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2'>
            {/* User Credentials */}
            <div className={`space-y-6 ${filterData === 'Multiple' ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                <div className='space-y-2'>
                    <Label className='font-semibold text-sm'>User Name:</Label>
                    <div className='flex gap-2'>
                        <Input
                            {...register('userName')}
                            className='bg-gray-50 uppercase'
                            placeholder={filterData === 'Multiple' ? 'N/A FOR MULTIPLE' : 'USERNAME'}
                            readOnly={isUserNameDisabled}
                            disabled={filterData === 'Multiple'}
                        />
                        <button
                            type='button'
                            onClick={onChangeUsernameToggle}
                            disabled={filterData === 'Multiple' || !isUserNameDisabled}
                            className='btn btn-info btn-xs whitespace-nowrap rounded bg-blue-500 px-3 py-1 text-[10px] text-white transition-colors hover:bg-blue-600 disabled:bg-gray-400'>
                            Change Username
                        </button>
                    </div>
                </div>

                <div className='rounded-md border-orange-400 border-l-4 bg-orange-50 p-4'>
                    <p className='font-medium text-orange-800 text-sm'>
                        {filterData === 'Multiple'
                            ? "Password settings will be managed individually for each selected staff."
                            : <>Initial password for staff is "<strong>vaps@123</strong>"</>
                        }
                    </p>
                </div>
            </div>

            {/* Selection Lists */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {/* Categories */}
                <div className='space-y-2'>
                    <Label className='flex items-center justify-between font-semibold text-sm'>
                        Select Category:
                        <span onClick={onSelectAllCategories} className='cursor-pointer text-[10px] text-primary hover:underline'>
                            Select All
                        </span>
                    </Label>
                    <div className='rounded-md border bg-gray-50 p-2'>
                        <ScrollArea className='h-40'>
                            {categories.map((cat) => (
                                <div key={cat.amC_Id} className='flex items-center space-x-2 rounded p-1 transition-colors hover:bg-white'>
                                    <Checkbox
                                        id={`cat-${cat.amC_Id}`}
                                        checked={cat.catid}
                                        onCheckedChange={(checked) => handleCategoryCheck(cat.amC_Id, !!checked)}
                                    />
                                    <label htmlFor={`cat-${cat.amC_Id}`} className='cursor-pointer select-none text-xs'>
                                        {cat.amC_Name}
                                    </label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>

                {/* Modules */}
                <div className='space-y-2'>
                    <Label className='flex items-center justify-between font-semibold text-sm'>
                        Select Module:
                        <span onClick={onSelectAllModules} className='cursor-pointer text-[10px] text-primary hover:underline'>
                            Select All
                        </span>
                    </Label>
                    <div className='rounded-md border bg-gray-50 p-2'>
                        <ScrollArea className='h-40'>
                            {modules.map((mod) => (
                                <div
                                    key={mod.ivrmM_Id}
                                    className='flex items-center space-x-2 rounded p-1 transition-colors hover:bg-white'>
                                    <Checkbox
                                        id={`mod-${mod.ivrmM_Id}`}
                                        checked={mod.model}
                                        onCheckedChange={(checked) => handleModuleCheck(mod.ivrmM_Id, !!checked)}
                                    />
                                    <label htmlFor={`mod-${mod.ivrmM_Id}`} className='cursor-pointer select-none text-xs'>
                                        {mod.ivrmM_ModuleName}
                                    </label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}
