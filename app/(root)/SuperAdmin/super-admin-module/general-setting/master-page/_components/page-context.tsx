'use client';

import { createContext, useContext } from 'react';

interface PageContextType {
    refreshData: () => void;
}

const PageContext = createContext<PageContextType | null>(null);

export function PageProvider({ children, refreshData }: { children: React.ReactNode; refreshData: () => void }) {
    return (
        <PageContext.Provider value={{ refreshData }}>
            {children}
        </PageContext.Provider>
    );
}

export function usePageContext() {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('usePageContext must be used within a PageProvider');
    }
    return context;
}
