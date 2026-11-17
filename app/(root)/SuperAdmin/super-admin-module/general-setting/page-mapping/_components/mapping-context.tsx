'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IPageMappingData, IModuleDropdown, ISavedMapping } from '@/types/super-admin/super-admin-module/general-setting/page-mapping';
import { getModulesForDropdown, getAvailablePages, getSavedMappings, savePageMapping, deletePageMapping } from '@/server/super-admin/super-admin-module/general-setting/page-mapping';
import { toast } from 'sonner';

interface PageMappingContextType {
    modules: IModuleDropdown[];
    selectedModuleId: number | null;
    availablePages: IPageMappingData[];
    cartPages: IPageMappingData[];
    savedMappings: ISavedMapping[];
    isLoading: boolean;
    setSelectedModuleId: (id: number) => void;
    addToCart: (pages: IPageMappingData[]) => void;
    removeFromCart: (pageIds: number[]) => void;
    saveCart: () => Promise<void>;
    clearCart: () => void;
    deleteMapping: (id: number) => Promise<void>;
}

const PageMappingContext = createContext<PageMappingContextType | undefined>(undefined);

export function PageMappingProvider({ children }: { children: React.ReactNode }) {
    const [modules, setModules] = useState<IModuleDropdown[]>([]);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [availablePages, setAvailablePages] = useState<IPageMappingData[]>([]);
    const [cartPages, setCartPages] = useState<IPageMappingData[]>([]);
    const [savedMappings, setSavedMappings] = useState<ISavedMapping[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load available pages when Module changes
    useEffect(() => {
        if (!selectedModuleId) {
            setAvailablePages([]);
            return;
        }

        const fetchPages = async () => {
            setIsLoading(true);
            const pagesRes = await getAvailablePages(selectedModuleId);
            if (pagesRes.success && pagesRes.data) {
                setAvailablePages(pagesRes.data);
            }
            setIsLoading(false);
        };
        fetchPages();
    }, [selectedModuleId]);

    // Initial Load: Modules and All Saved Mappings
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            // Modules
            const modRes = await getModulesForDropdown();
            if (modRes.success && modRes.data) {
                setModules(modRes.data);
            }

            // Saved Mappings (All)
            const savedRes = await getSavedMappings(0); // 0 or any val, API returns all
            if (savedRes.success && savedRes.data) {
                setSavedMappings(savedRes.data);
            }
            setIsLoading(false);
        };
        fetchInitialData();
    }, []);

    const addToCart = (pagesToAdd: IPageMappingData[]) => {
        // Filter out duplicates
        const newPages = pagesToAdd.filter(p => !cartPages.some(cp => cp.ivrmP_Id === p.ivrmP_Id));
        setCartPages(prev => [...prev, ...newPages]);
        // Ideally remove from available? Or just keep? 
        // Logic: Move from Available to Cart usually visually removes from Available.
        setAvailablePages(prev => prev.filter(p => !newPages.some(np => np.ivrmP_Id === p.ivrmP_Id)));
    };

    const removeFromCart = (pageIdsToRemove: number[]) => {
        const pagesToRemove = cartPages.filter(p => pageIdsToRemove.includes(p.ivrmP_Id));
        setCartPages(prev => prev.filter(p => !pageIdsToRemove.includes(p.ivrmP_Id)));
        // Return to available
        setAvailablePages(prev => [...prev, ...pagesToRemove]);
    };
    const clearCart = () => {
        setAvailablePages(prev => [...prev, ...cartPages]);
        setCartPages([]);
    };

    const saveCart = async () => {
        if (!selectedModuleId || cartPages.length === 0) return;

        setIsLoading(true);
        const payload = {
            ivrmM_Id: selectedModuleId,
            pages: cartPages
        };
        const res = await savePageMapping(payload);
        if (res.success) {
            toast.success(res.message);
            setCartPages([]);
            // Refresh saved mappings
            const savedRes = await getSavedMappings(0);
            if (savedRes.success && savedRes.data) {
                setSavedMappings(savedRes.data);
            }
        } else {
            toast.error(res.message);
        }
        setIsLoading(false);
    };

    const deleteMapping = async (id: number) => {
        if (!confirm("Are you sure you want to delete this mapping?")) return;

        setIsLoading(true);
        const res = await deletePageMapping(id);
        if (res.success) {
            toast.success(res.message);
            const savedRes = await getSavedMappings(0);
            if (savedRes.success && savedRes.data) {
                setSavedMappings(savedRes.data);
            }
        } else {
            toast.error(res.message);
        }
        setIsLoading(false);
    };

    return (
        <PageMappingContext.Provider value={{
            modules,
            selectedModuleId,
            availablePages,
            cartPages,
            savedMappings,
            isLoading,
            setSelectedModuleId,
            addToCart,
            removeFromCart,
            saveCart,
            clearCart,
            deleteMapping
        }}>
            {children}
        </PageMappingContext.Provider>
    );
}

export const usePageMapping = () => {
    const context = useContext(PageMappingContext);
    if (!context) {
        throw new Error('usePageMapping must be used within a PageMappingProvider');
    }
    return context;
};
