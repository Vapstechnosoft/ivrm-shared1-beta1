'use client';

import { createContext, useContext } from 'react';

interface ModuleContextType {
    refreshData: () => void;
}

const ModuleContext = createContext<ModuleContextType | null>(null);

export function ModuleProvider({ children, refreshData }: { children: React.ReactNode; refreshData: () => void }) {
    return (
        <ModuleContext.Provider value={{ refreshData }}>
            {children}
        </ModuleContext.Provider>
    );
}

export function useModuleContext() {
    const context = useContext(ModuleContext);
    if (!context) {
        throw new Error('useModuleContext must be used within a ModuleProvider');
    }
    return context;
}
