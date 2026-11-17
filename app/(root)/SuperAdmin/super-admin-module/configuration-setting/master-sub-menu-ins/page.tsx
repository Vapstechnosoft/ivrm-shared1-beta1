'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SelectionForm from './_components/selection-form';
import SavedGrid from './_components/saved-grid';
import SubMenuList from './_components/sub-menu-list';
import { toast } from 'sonner';
import { getMasterSubMenuINSList, getSubMenuOnChange, saveMasterSubMenuINS, setMasterSubMenuINSOrder } from '@/server/super-admin/configuration-setting/master-sub-menu-ins';
import { MasterSubMenuINSDTO, SubMenuOnChangeDTO } from '@/types/super-admin/configuration-setting/master-sub-menu-ins';

const formSchema = z.object({
    institution: z.string().min(1, 'Institution is required'),
    module: z.string().min(1, 'Module is required'),
    mainMenu: z.string().min(1, 'Main Menu is required')
});

type FormValues = z.infer<typeof formSchema>;

export default function MasterSubMenuINSPage() {
    const [gridData, setGridData] = useState<MasterSubMenuINSDTO[]>([]);
    const [subMenuData, setSubMenuData] = useState<SubMenuOnChangeDTO[]>([]);

    const methods = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            institution: '',
            module: '',
            mainMenu: ''
        }
    });

    const institutionId = methods.watch('institution');
    const mainMenuId = methods.watch('mainMenu');

    // Fetch Saved Grid (Bottom)
    useEffect(() => {
        const fetchGrid = async () => {
            try {
                const mi_id = institutionId ? parseInt(institutionId) : 0;
                const response = await getMasterSubMenuINSList(mi_id);
                if (response.success && response.data?.gridDetails) {
                    setGridData(response.data.gridDetails);
                } else {
                    setGridData([]);
                }
            } catch (e) {
                console.error("Error fetching grid data", e);
            }
        };
        fetchGrid();
    }, [institutionId]);

    // Fetch Sub Menu List (Middle) when Main Menu is selected
    useEffect(() => {
        const fetchSubMenus = async () => {
            if (institutionId && mainMenuId) {
                const response = await getSubMenuOnChange(parseInt(mainMenuId), parseInt(institutionId));
                if (response.success && response.data?.subMenuList) {
                    setSubMenuData(response.data.subMenuList);
                } else {
                    setSubMenuData([]);
                }
            } else {
                setSubMenuData([]);
            }
        };
        fetchSubMenus();
    }, [mainMenuId, institutionId]);

    const handleSaveSubMenus = async (selectedItems: SubMenuOnChangeDTO[]) => {
        if (selectedItems.length === 0) {
            toast.warning("Please select at least one sub menu");
            return;
        }

        if (!institutionId || !mainMenuId) {
            toast.error("Institution and Main Menu are required");
            return;
        }

        const payload: import("@/types/super-admin/configuration-setting/master-sub-menu-ins").SaveSubMenuINSRequest = {
            ivrmmmI_Id: 0,
            ivrmM_Id: 0, // Not available directly from dropdown unless we track it from MainMenuDTO or Module dropdown
            mI_Id: parseInt(institutionId),
            ivrmmmI_MenuName: "string", // Placeholder as per request body
            ivrmmmI_MenuOrder: 0, // Placeholder
            selectedMasterMenuDetails: selectedItems.map(item => ({
                ivrmmM_Id: item.ivrmmM_Id,
                ivrmmmI_MenuName: item.ivrmmmI_MenuName
            }))
        };

        // We might need ivrmM_Id (Module ID). 
        // We can get it from methods.watch('module')
        const moduleId = methods.watch('module');
        if (moduleId) {
            payload.ivrmM_Id = parseInt(moduleId);
        }

        try {
            const response = await saveMasterSubMenuINS(payload);
            if (response.success) {
                toast.success(response.message);
                // Refresh Grid
                const mi_id = parseInt(institutionId);
                const gridResponse = await getMasterSubMenuINSList(mi_id);
                if (gridResponse.success && gridResponse.data?.gridDetails) {
                    setGridData(gridResponse.data.gridDetails);
                }
                // Clear selection
                setSubMenuData([]);
                methods.setValue('mainMenu', '');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save data");
        }
    };

    const handleClearSubMenus = () => {
        setSubMenuData([]);
        methods.setValue('mainMenu', '');
    };

    const onSubmit = (data: FormValues) => {
        console.log("Form Request:", data);
        toast.info("Form Submitted (Placeholder)");
    };

    const handleDelete = (item: MasterSubMenuINSDTO) => {
        console.log("Delete item:", item);
        toast.info("Delete functionality pending implementation.");
    };



    const handleSaveOrder = async (payload: import("@/types/super-admin/configuration-setting/master-sub-menu-ins").SetOrderRequest) => {
        try {
            const response = await setMasterSubMenuINSOrder(payload);
            if (response.success) {
                toast.success(response.message);
                // Refresh Grid
                const mi_id = institutionId ? parseInt(institutionId) : 0;
                const gridResponse = await getMasterSubMenuINSList(mi_id);
                if (gridResponse.success && gridResponse.data?.gridDetails) {
                    setGridData(gridResponse.data.gridDetails);
                }
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Save Order error:", error);
            toast.error("Failed to save order");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Master Sub Menu INS</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                            <SelectionForm />
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>

            {subMenuData.length > 0 && (
                <SubMenuList
                    data={subMenuData}
                    onSave={handleSaveSubMenus}
                    onClear={handleClearSubMenus}
                />
            )}

            <SavedGrid data={gridData} onDelete={handleDelete} onSaveOrder={handleSaveOrder} />
        </div>
    );
}
