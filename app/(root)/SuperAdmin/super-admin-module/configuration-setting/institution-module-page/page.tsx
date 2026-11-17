'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SelectionForm from './_components/selection-form';
import SavedGrid from './_components/saved-grid';
import PageListGrid from './_components/page-list-grid';
import PrivilegeGrid from './_components/privilege-grid';
import DeleteGrid from './_components/delete-grid';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getInstitutionRolePrivileges, getPageList, saveInstitutionRolePrivileges, deleteInstitutionRolePrivileges } from '@/server/super-admin/configuration-setting/institution-module-page';
import { useState, useEffect } from 'react';
import { InstitutionRolePrivilegeDTO, PageDTO } from '@/types/super-admin/configuration-setting/institution-module-page';

const formSchema = z.object({
    institution: z.string().min(1, 'Select institute'),
    module: z.string().min(1, 'Select module'),
    roleid: z.string().min(1, 'Select Role name'),
});

type FormValues = z.infer<typeof formSchema>;

export default function InstitutionModulePage() {
    const methods = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            institution: '',
            module: '',
            roleid: ''
        }
    });

    const [gridData, setGridData] = useState<InstitutionRolePrivilegeDTO[]>([]);
    const [pageListData, setPageListData] = useState<PageDTO[]>([]);
    const [cartData, setCartData] = useState<PageDTO[]>([]);
    const [deleteCartData, setDeleteCartData] = useState<InstitutionRolePrivilegeDTO[]>([]);
    const selectedModule = methods.watch('module');

    // ... (existing handleAddToCart, etc)

    const handleSavedGridSelection = (selectedItems: InstitutionRolePrivilegeDTO[]) => {
        setDeleteCartData(selectedItems);
    };

    const handleDelete = async (itemsToDelete: InstitutionRolePrivilegeDTO[]) => {
        console.log("Deleting items:", itemsToDelete);

        const payload = {
            "privilagedata": itemsToDelete.map(item => ({
                "ivrmirP_Id": item.ivrmirP_Id
            }))
        };
        console.log("Delete Payload:", JSON.stringify(payload, null, 2));

        const result = await deleteInstitutionRolePrivileges(payload);
        if (result.success) {
            alert(result.message);
            // Clear delete cart
            setDeleteCartData([]);
            // Refresh grid
            const response = await getInstitutionRolePrivileges();
            if (response.success && response.data?.institutionRolePrivilegesList) {
                setGridData(response.data.institutionRolePrivilegesList);
            }
        } else {
            alert(result.message);
        }
    };

    const handleCancelDelete = () => {
        setDeleteCartData([]);
        // Ideally should also clear selection in SavedGrid, but SavedGrid controls its own state currently.
        // For a perfect sync, SavedGrid selection state should be lifted up, but for now this hides the grid.
    };

    const handleAddToCart = (item: PageDTO) => {
        // Prevent duplicates
        if (!cartData.some(c => c.ivrmP_Id === item.ivrmP_Id)) {
            const newItem = {
                ...item,
                ivrmrP_AddFlag: false,
                ivrmrP_DeleteFlag: false,
                ivrmrP_UpdateFlag: false,
                ivrmrP_ProcessFlag: false,
                ivrmrP_ReportFlag: false,
                ivrmrP_SearchFlag: false
            };
            setCartData([...cartData, newItem]);
        }
    };

    const handleCartUpdate = (updatedCart: PageDTO[]) => {
        setCartData(updatedCart);
    };

    const handleSave = async (dataToSave: PageDTO[]) => {
        console.log("Saving Mapping:", dataToSave);
        const formValues = methods.getValues();

        if (!formValues.institution || !formValues.module || !formValues.roleid) {
            alert('Please select Institution, Module and Role');
            return;
        }

        const payload = {
            "ivrmirP_Id": 0,
            "ivrmrT_Id": Number(formValues.roleid),
            "ivrmimP_Id": 0,
            "mI_Id": Number(formValues.institution),
            "ivrmM_Id": Number(formValues.module),
            "roleId": Number(formValues.roleid),
            // Mapping cart data to savetmpdata with expected keys
            "savetmpdata": dataToSave.map(item => ({
                "ivrmP_Id": item.ivrmP_Id,
                "ivrmirP_AddFlag": item.ivrmrP_AddFlag || false,
                "ivrmirP_UpdateFlag": item.ivrmrP_UpdateFlag || false,
                "ivrmirP_DeleteFlag": item.ivrmrP_DeleteFlag || false,
                "ivrmirP_ReportFlag": item.ivrmrP_ReportFlag || false,
                "ivrmirP_SearchFlag": item.ivrmrP_SearchFlag || false,
                "ivrmirP_ProcessFlag": item.ivrmrP_ProcessFlag || false,
                "ivrmimP_Id": 0,
                "ivrmrT_Id": Number(formValues.roleid)
            })),
            "privilagedata": [], // As per requirements
            "menuid": []        // As per requirements
        };

        const result = await saveInstitutionRolePrivileges(payload);
        if (result.success) {
            alert(result.message);
            setCartData([]);
            // Optionally refresh grid
            // const response = await getInstitutionRolePrivileges(); 
            // if(response.success && response.data?.institutionRolePrivilegesList) setGridData(response.data.institutionRolePrivilegesList);
        } else {
            alert(result.message);
        }
    };

    const handleCancel = () => {
        setCartData([]);
    };

    useEffect(() => {
        const fetchGridData = async () => {
            console.log("Fetching grid data...");
            const response = await getInstitutionRolePrivileges();
            console.log("Grid Data Response:", response);
            if (response.success && response.data?.institutionRolePrivilegesList) {
                setGridData(response.data.institutionRolePrivilegesList);
            }
        };
        fetchGridData();
    }, []);

    useEffect(() => {
        const fetchPageList = async () => {
            if (selectedModule) {
                console.log("Module Selected:", selectedModule, "Fetching Page List...");
                const response = await getPageList(Number(selectedModule));
                if (response.success && response.data?.pageList) {
                    setPageListData(response.data.pageList);
                } else {
                    setPageListData([]);
                }
            } else {
                setPageListData([]);
            }
        };
        fetchPageList();
    }, [selectedModule]);

    const onSubmit = (data: FormValues) => {
        console.log("Form Submitted", data);
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Institution Module Page</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                            <SelectionForm />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    {/* Page List Grid appears when Module is selected */}
                                    {pageListData.length > 0 && <PageListGrid data={pageListData} onAddToCart={handleAddToCart} />}
                                    {/* Ideally showing empty grid or message if module selected but no pages? 
                                        User requirement: "ng-show='pagelist.length>0'" so we match that behavior. 
                                    */}
                                </div>
                                <div>
                                    {/* Selected Institute Role (Cart) Grid */}
                                    {cartData.length > 0 && (
                                        <PrivilegeGrid
                                            data={cartData}
                                            onUpdate={handleCartUpdate}
                                            onSave={handleSave}
                                            onCancel={handleCancel}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Delete Grid (appears when items are selected in SavedGrid) */}
                            {deleteCartData.length > 0 && (
                                <DeleteGrid
                                    data={deleteCartData}
                                    onDelete={handleDelete}
                                    onCancel={handleCancelDelete}
                                />
                            )}

                            <SavedGrid data={gridData} onSelectionChange={handleSavedGridSelection} />
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    );
}
