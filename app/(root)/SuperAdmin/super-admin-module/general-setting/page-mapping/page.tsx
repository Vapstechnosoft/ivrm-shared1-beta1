'use client';

import React from 'react';
import { PageMappingProvider } from './_components/mapping-context';
import ModuleSelection from './_components/module-selection';
import SavedGrid from './_components/saved-grid';
import AvailableGrid from './_components/available-grid';
import CartGrid from './_components/cart-grid';
import SuperAdminGrid from './_components/super-admin-grid';

import { usePageMapping } from './_components/mapping-context';

function PageMappingContentInner() {
    const { selectedModuleId } = usePageMapping();

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-2xl font-bold mb-4 text-blue-900">Master Page Mapping</h1>

            <ModuleSelection />

            <div className="mt-6 flex flex-col gap-6">
                <AvailableGrid />
                <SuperAdminGrid />
                <SavedGrid />
            </div>
        </div>
    );
}

export default function PageMappingPage() {
    return (
        <PageMappingProvider>
            <PageMappingContentInner />
        </PageMappingProvider>
    );
}
