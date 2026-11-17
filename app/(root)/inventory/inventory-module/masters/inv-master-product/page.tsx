'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductTab from "./_components/product-tab";
import ProductQtyTab from "./_components/product-qty-tab";
import { parseAsInteger, useQueryState } from "nuqs";
import { tableSearchVariables } from "@/lib/data-table.config";

export default function InvMasterProductPage() {
    const [, setPage] = useQueryState(
        tableSearchVariables.page,
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [, setPageSize] = useQueryState(
        tableSearchVariables.page_size,
        parseAsInteger.withOptions({ shallow: false }).withDefault(10)
    );

    const [activeTab, setActiveTab] = useState("product");

    const onTabChange = (value: string) => {
        console.log("Tab switched to:", value);
        setActiveTab(value);
        setPage(1);
        setPageSize(10);
    };

    console.log("InvMasterProductPage Rendered. Active Tab:", activeTab);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-2 pb-2">
                <Package className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight">Product Master</h2>
            </div>
            <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="product">Product</TabsTrigger>
                    <TabsTrigger value="productQty">Product Quantity</TabsTrigger>
                </TabsList>
                <TabsContent value="product" className="space-y-4">
                    <ProductTab />
                </TabsContent>
                <TabsContent value="productQty" className="space-y-4">
                    {activeTab === 'productQty' && <ProductQtyTab />}
                </TabsContent>
            </Tabs>
        </div>
    );
}
