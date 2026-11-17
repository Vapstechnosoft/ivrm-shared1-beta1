'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    deleteMasterMenuPageMapping,
    getMasterPageGrid,
    getOnloadGrid,
    getSavedMappingGrid,
    getSetOrderList,
    saveMasterMenuPageMapping,
    saveSetOrder
} from '@/server/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';
import type {
    GridDetailDTO,
    MasterPageDTO,
    SaveMasterMenuPageMappingRequest,
    SavedMappingDTO,
    SetOrderDTO,
    SetOrderRequest
} from '@/types/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DeleteMappingGrid from './_components/delete-mapping-grid';
import MappingGrid from './_components/mapping-grid';
import MasterPagesGrid from './_components/master-pages-grid';
import SavedMappingGrid from './_components/saved-mapping-grid';
import SelectedMasterPagesGrid from './_components/selected-master-pages-grid';
import SelectionForm from './_components/selection-form';
import SetOrderModal from './_components/set-order-modal';

const formSchema = z.object({
    institution: z.string().min(1, 'Institution is required'),
    module: z.string().min(1, 'Module is required'),
    mainMenu: z.string().min(1, 'Main Menu is required'),
    subMenu: z.string().min(1, 'Sub Menu is required')
});

type FormValues = z.infer<typeof formSchema>;

export default function MasterMenuPageMappingInstitutionwisePage() {
    const [gridData, setGridData] = useState<GridDetailDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    // nuqs states for URL-synced pagination
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ shallow: false }));
    const [pageSize, setPageSize] = useQueryState('page_size', parseAsInteger.withDefault(10).withOptions({ shallow: false }));
    const [searchQuery, setSearchQuery] = useQueryState(
        'search',
        parseAsString.withDefault('').withOptions({ shallow: false, throttleMs: 500 })
    );

    const [masterPages, setMasterPages] = useState<MasterPageDTO[]>([]);
    const [isMasterPagesLoading, setIsMasterPagesLoading] = useState(false);

    const [savedMappings, setSavedMappings] = useState<SavedMappingDTO[]>([]);
    const [isSavedMappingsLoading, setIsSavedMappingsLoading] = useState(false);

    const [isSetOrderModalOpen, setIsSetOrderModalOpen] = useState(false);
    const [setOrderList, setSetOrderList] = useState<SetOrderDTO[]>([]);
    const [isSetOrderLoading, setIsSetOrderLoading] = useState(false);

    const selectedPages = useMemo(() => masterPages.filter((p) => p.checked), [masterPages]);
    const selectedDeleteItems = useMemo(() => gridData.filter((item) => item.checked), [gridData]);

    const methods = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            institution: '',
            module: '',
            mainMenu: '',
            subMenu: ''
        }
    });

    const selectedMI_Id = methods.watch('institution');
    const selectedIVRMM_Id = methods.watch('module');
    const selectedIVRMMMI_Id = methods.watch('subMenu');

    // Fetch Master Pages when Sub Menu changes
    const fetchMasterPages = useCallback(async () => {
        if (!selectedMI_Id || !selectedIVRMM_Id || !selectedIVRMMMI_Id) {
            setMasterPages([]);
            return;
        }

        setIsMasterPagesLoading(true);
        try {
            const response = await getMasterPageGrid(
                Number.parseInt(selectedMI_Id),
                Number.parseInt(selectedIVRMM_Id),
                Number.parseInt(selectedIVRMMMI_Id)
            );

            if (response.success) {
                setMasterPages(response.data?.masterPages || []);
            } else {
                toast.error(response.message || 'Failed to load master pages');
                setMasterPages([]);
            }
        } catch (error: any) {
            console.error('fetchMasterPages error:', error);
            toast.error('An error occurred while fetching master pages');
        } finally {
            setIsMasterPagesLoading(false);
        }
    }, [selectedMI_Id, selectedIVRMM_Id, selectedIVRMMMI_Id]);

    useEffect(() => {
        fetchMasterPages();
    }, [fetchMasterPages]);

    // Fetch Saved Mappings when Sub Menu changes
    const fetchSavedMappings = useCallback(async () => {
        if (!selectedMI_Id || !selectedIVRMM_Id || !selectedIVRMMMI_Id) {
            setSavedMappings([]);
            return;
        }

        setIsSavedMappingsLoading(true);
        try {
            const response = await getSavedMappingGrid(
                Number.parseInt(selectedMI_Id),
                Number.parseInt(selectedIVRMM_Id),
                Number.parseInt(selectedIVRMMMI_Id)
            );

            if (response.success) {
                setSavedMappings(response.data?.savedMappings || []);
            } else {
                setSavedMappings([]);
            }
        } catch (error: any) {
            console.error('fetchSavedMappings error:', error);
            setSavedMappings([]);
        } finally {
            setIsSavedMappingsLoading(false);
        }
    }, [selectedMI_Id, selectedIVRMM_Id, selectedIVRMMMI_Id]);

    useEffect(() => {
        fetchSavedMappings();
    }, [fetchSavedMappings]);

    // Fetch Grid Data (Server-side)
    const fetchGrid = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: page,
                page_size: pageSize,
                search_query: searchQuery
            };
            const response = await getOnloadGrid(params);

            if (response.success) {
                const gridDetails = response.data?.gridDetails || [];
                setGridData(gridDetails);
                setTotalItems(response.total || gridDetails.length || 0);
            } else {
                toast.error(response.message || 'Failed to load mapping grid');
                setGridData([]);
                setTotalItems(0);
            }
        } catch (error: any) {
            console.error('fetchGrid error:', error);
            toast.error(error.message || 'An error occurred while fetching grid data');
            setGridData([]);
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, searchQuery]);

    useEffect(() => {
        fetchGrid();
    }, [fetchGrid]);

    const handleToggleRow = (row: GridDetailDTO) => {
        setGridData((prev) => prev.map((item) => (item.ivrmmmpmI_Id === row.ivrmmmpmI_Id ? { ...item, checked: !item.checked } : item)));
    };

    const handleToggleAll = (checked: boolean) => {
        setGridData((prev) => prev.map((item) => ({ ...item, checked })));
    };

    // Master Pages handlers
    const handleToggleMasterPageRow = (row: MasterPageDTO) => {
        setMasterPages((prev) => prev.map((item) => (item.ivrmP_Id === row.ivrmP_Id ? { ...item, checked: !item.checked } : item)));
    };

    const handleMasterPageDisplayNameChange = (row: MasterPageDTO, displayName: string) => {
        setMasterPages((prev) => prev.map((item) => (item.ivrmP_Id === row.ivrmP_Id ? { ...item, displayname: displayName } : item)));
    };

    const handleRemoveSelectedPage = (row: MasterPageDTO) => {
        setMasterPages((prev) => prev.map((item) => (item.ivrmP_Id === row.ivrmP_Id ? { ...item, checked: false } : item)));
    };

    const handleCancel = () => {
        methods.reset();
        setMasterPages([]);
        setSavedMappings([]);
        setSetOrderList([]);
    };

    const handleSetOrder = async () => {
        if (!selectedMI_Id || !selectedIVRMM_Id || !selectedIVRMMMI_Id) {
            toast.warning('Please select Institution, Module and Sub Menu.');
            return;
        }

        setIsSetOrderLoading(true);
        try {
            const response = await getSetOrderList(
                Number.parseInt(selectedMI_Id),
                Number.parseInt(selectedIVRMM_Id),
                Number.parseInt(selectedIVRMMMI_Id)
            );

            if (response.success) {
                setSetOrderList(response.data?.setOrderList || []);
                setIsSetOrderModalOpen(true);
            } else {
                toast.error(response.message || 'Failed to fetch order list');
            }
        } catch (error: any) {
            console.error('handleSetOrder error:', error);
            toast.error(error.message || 'An error occurred while fetching the order list');
        } finally {
            setIsSetOrderLoading(false);
        }
    };

    const onSaveOrder = async (updatedList: SetOrderDTO[]) => {
        setIsLoading(true);
        try {
            const payload: SetOrderRequest = {
                pages: updatedList.map((item) => ({
                    ivrmimP_Id: item.ivrmimP_Id,
                    ivrmmmpmI_Id: item.ivrmmmpmI_Id,
                    ivrmimP_PageOrder: item.pageorder,
                    displayTitle: item.displayname
                }))
            };

            const response = await saveSetOrder(payload);
            console.log('onSaveOrder Server Response:', response);
            if (response.success) {
                toast.success(response.message || 'Order updated successfully');
                setIsSetOrderModalOpen(false);
                fetchSavedMappings();
            } else {
                toast.error(response.message || 'Failed to update order');
            }
        } catch (error: any) {
            console.error('onSaveOrder error:', error);
            toast.error(error.message || 'An error occurred while saving the order');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        handleCancel();
    };

    const handleDelete = useCallback(
        async (selectedItems: GridDetailDTO[]) => {
            if (!selectedItems.length) return;

            const confirmation = window.confirm(`Are you sure you want to delete ${selectedItems.length} selected mapping(s)?`);
            if (!confirmation) return;

            setIsLoading(true);
            try {
                const payload = {
                    pageMappingIds: selectedItems.map((item) => item.ivrmmmpmI_Id),
                    mi_id: Number.parseInt(selectedMI_Id)
                };

                const response = await deleteMasterMenuPageMapping(payload);

                if (response.success) {
                    toast.success(response.message || 'Mapping(s) deleted successfully');
                    fetchGrid();
                } else {
                    const detail = response.message || 'Unknown error';
                    const raw = JSON.stringify(response);
                    toast.error(`Delete Failed: ${detail}. Data: ${raw.substring(0, 100)}...`, {
                        duration: 10000
                    });
                }
            } catch (error: any) {
                console.error('handleDelete error:', error);
                toast.error(error.message || 'An unexpected error occurred');
            } finally {
                setIsLoading(false);
                handleToggleAll(false);
            }
        },
        [selectedMI_Id, fetchGrid, handleToggleAll]
    );

    const onSubmit = async (data: FormValues) => {
        if (selectedPages.length === 0) {
            toast.warning('Please select at least one page from the Master Pages grid.');
            return;
        }

        const payload: SaveMasterMenuPageMappingRequest = {
            ivrmmmI_Id: Number.parseInt(data.subMenu),
            saveTmpData: selectedPages.map((page: MasterPageDTO) => ({
                ivrmmmI_Id: Number.parseInt(data.subMenu),
                ivrmP_Id: page.ivrmP_Id,
                displayname: page.displayname
            })),
            returnVal: ''
        };

        console.log('Save Payload:', payload);
        setIsLoading(true);
        try {
            const response = await saveMasterMenuPageMapping(payload);
            if (response.success) {
                toast.success(response.message || 'Mapping saved successfully');
                handleCancel();
                fetchGrid();
            } else {
                toast.error(response.message || 'Failed to save mapping');
            }
        } catch (error: any) {
            console.error('onSubmit error:', error);
            toast.error(error.message || 'An error occurred while saving the mapping');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container mx-auto space-y-8 p-6'>
            <Card className='w-full border-t-4 border-t-primary shadow-lg'>
                <CardHeader>
                    <CardTitle className='text-center font-bold text-2xl text-primary'>Master Menu Page Mapping Institutionwise</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-6'>
                            <SelectionForm />
                            {selectedIVRMMMI_Id && (
                                <MasterPagesGrid
                                    data={masterPages}
                                    onToggleRow={handleToggleMasterPageRow}
                                    onDisplayNameChange={handleMasterPageDisplayNameChange}
                                    isLoading={isMasterPagesLoading}
                                />
                            )}
                            <SelectedMasterPagesGrid
                                data={selectedPages}
                                onRemove={handleRemoveSelectedPage}
                                onSave={methods.handleSubmit(onSubmit)}
                                onCancel={handleCancel}
                            />
                            {selectedIVRMMMI_Id && (
                                <SavedMappingGrid
                                    data={savedMappings}
                                    isLoading={isSavedMappingsLoading}
                                    onSetOrder={handleSetOrder}
                                    onClear={handleClear}
                                />
                            )}
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>

            <Card className='w-full border-t-4 border-t-primary shadow-lg'>
                <CardContent className='pt-6'>
                    <MappingGrid
                        data={gridData}
                        onToggleRow={handleToggleRow}
                        onToggleAll={handleToggleAll}
                        isLoading={isLoading}
                        totalItems={totalItems}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        onSearchChange={setSearchQuery}
                        initialSearch={searchQuery}
                    />
                </CardContent>
            </Card>

            {selectedDeleteItems.length > 0 && (
                <Card className='w-full border-t-4 border-t-red-500 shadow-lg'>
                    <CardContent className='pt-6'>
                        <DeleteMappingGrid data={selectedDeleteItems} onDelete={handleDelete} onCancel={() => handleToggleAll(false)} />
                    </CardContent>
                </Card>
            )}

            <SetOrderModal
                isOpen={isSetOrderModalOpen}
                onClose={() => setIsSetOrderModalOpen(false)}
                onSave={onSaveOrder}
                data={setOrderList}
                // Need to find the institution name from the list.
                // Wait, I need to check where 'institutions' list is.
                // It's likely in SelectionForm or fetched in page.tsx?
                // Looking at page.tsx, it's not there. It must be inside SelectionForm.
                // I might need to lift the institutions state or just use a placeholder for now.
                // Actually, let's just pass undefined or use a prop if I find it.
            />
        </div>
    );
}
