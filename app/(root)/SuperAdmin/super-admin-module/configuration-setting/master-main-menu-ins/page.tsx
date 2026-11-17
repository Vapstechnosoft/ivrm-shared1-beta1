'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    deleteMainMenuINS,
    getMainMenuListINS,
    getModuleMenuList,
    saveMainMenuINS
} from '@/server/super-admin/configuration-setting/master-main-menu-ins';
import type { MainMenuModuleDTO, MasterMainMenuINSDTO } from '@/types/super-admin/configuration-setting/master-main-menu-ins';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import MainMenuGrid from './_components/main-menu-grid';
import ModuleMenuGrid from './_components/module-menu-grid';
import SelectionForm from './_components/selection-form';

const formSchema = z.object({
    institution: z.string().min(1, 'Institution is required'),
    module: z.string().min(1, 'Module is required'),
    roleid: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function MasterMainMenuINSPage() {
    const methods = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            institution: '',
            module: ''
        }
    });

    const [gridData, setGridData] = useState<MasterMainMenuINSDTO[]>([]);
    const [moduleMenuData, setModuleMenuData] = useState<MainMenuModuleDTO[]>([]);

    useEffect(() => {
        const fetchGridData = async () => {
            // Fetch Existing Grid Data
            try {
                const response = await getMainMenuListINS();
                if (response.success && response.data?.gridDetails) {
                    // Strict deduplication using String(id) to handle mixed types (3 vs "3")
                    const uniqueData = Array.from(
                        new Map(
                            response.data.gridDetails
                                .filter((item) => item && item.ivrmmmI_Id != null)
                                .map((item) => [String(item.ivrmmmI_Id), item])
                        ).values()
                    );

                    if (uniqueData.length !== response.data.gridDetails.length) {
                        console.warn(
                            `Removed ${response.data.gridDetails.length - uniqueData.length} duplicate records from Main Menu Grid`
                        );
                    }
                    setGridData(uniqueData);
                }
            } catch (error) {
                console.error('Error in fetchGridData:', error);
            }

            // Fetch Module Menu List (New Grid)
            try {
                const modResponse = await getModuleMenuList();
                if (modResponse.success && modResponse.data?.moduleList) {
                    // Strict deduplication for Module List
                    const uniqueData = Array.from(
                        new Map(
                            modResponse.data.moduleList
                                .filter((item) => item && item.ivrmmM_Id != null)
                                .map((item) => [String(item.ivrmmM_Id), item])
                        ).values()
                    );

                    if (uniqueData.length !== modResponse.data.moduleList.length) {
                        console.warn(
                            `Removed ${modResponse.data.moduleList.length - uniqueData.length} duplicate records from Module Menu Grid`
                        );
                    }
                    setModuleMenuData(uniqueData);
                }
            } catch (error) {
                console.error('Error in fetchModuleList:', error);
            }
        };
        fetchGridData();
    }, []);

    const handleDelete = async (item: MasterMainMenuINSDTO) => {
        if (confirm(`Are you sure you want to delete ${item.ivrmmmI_MenuName}?`)) {
            const res = await deleteMainMenuINS(item);
            if (res.success) {
                toast.success('Deleted successfully');
                // Refresh grid
                const response = await getMainMenuListINS();
                if (response.success && response.data?.gridDetails) {
                    setGridData(response.data.gridDetails);
                }
            } else {
                toast.error('Failed to delete: ' + res.message);
            }
        }
    };

    const handleSaveModules = async (items: MainMenuModuleDTO[]) => {
        const institutionId = methods.getValues('institution');
        const moduleId = methods.getValues('module');

        if (!institutionId || !moduleId) {
            toast.error('Please select Institution and Module first.');
            return;
        }

        let successCount = 0;
        let failCount = 0;

        // Iterate and save each item individually as the API structure seems to imply per-item config
        for (const item of items) {
            const payload = {
                ivrmmmI_Id: 0,
                ivrmM_Id: Number.parseInt(moduleId),
                mI_Id: Number.parseInt(institutionId),
                ivrmmmI_MenuName: item.customMenuName || item.modulename, // Use custom or default
                ivrmmmI_Icon: item.selectedIcon || '',
                ivrmmmI_Color: item.selectedColor || '',
                selectedMasterMenuDetails: [
                    {
                        ivrmmM_Id: item.ivrmmM_Id,
                        ivrmmmI_MenuName: item.customMenuName || item.modulename
                    }
                ]
            };

            const res = await saveMainMenuINS(payload);
            if (res.success) {
                successCount++;
            } else {
                failCount++;
                console.error(`Failed to save ${item.modulename}:`, res.message);
            }
        }

        if (successCount > 0) {
            toast.success(`Saved ${successCount} items successfully.${failCount > 0 ? ` Failed: ${failCount}` : ''}`);
            // Refresh grid
            const response = await getMainMenuListINS();
            if (response.success && response.data?.gridDetails) {
                setGridData(response.data.gridDetails);
            }
            // Optionally clear selection or reload page
            // window.location.reload();
        } else if (failCount > 0) {
            toast.error('Failed to save selected items.');
        }
    };

    const handleClear = () => {
        window.location.reload();
    };

    const handleOrder = () => {
        alert('Set Order functionality coming soon');
    };

    const onSubmit = (data: FormValues) => {
        console.log('Form Request:', data);
        // Implement save or add logic here if required by user later (HTML didn't explicitly show 'Add' button for form, just grid loaded on load?)
        // User request: "on load two dropdown ... and need onload grid also".
        // HTML has no 'Save' button for the form, only 'Set Order' and 'Clear' at bottom of grid.
        // It seems this page might be for viewing/deleting/ordering existing mappings.
    };

    return (
        <div className='container mx-auto p-6'>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle className='text-center font-bold text-2xl'>Master Main Menu INS</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-6'>
                            <SelectionForm />

                            {/* New Module Menu Grid (Selection) */}
                            <ModuleMenuGrid data={moduleMenuData} onSave={handleSaveModules} onCancel={handleClear} />

                            {/* Existing Saved Grid */}
                            {gridData.length > 0 && (
                                <MainMenuGrid data={gridData} onDelete={handleDelete} onOrder={handleOrder} onClear={handleClear} />
                            )}
                            {gridData.length === 0 && <div className='p-4 text-center text-gray-500'>No records found.</div>}
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    );
}
