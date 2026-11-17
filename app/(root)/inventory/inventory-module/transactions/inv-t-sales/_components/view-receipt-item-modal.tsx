'use client';

import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Button } from '@/components/ui/button';
import { useInvTSales } from '@/hooks/inventory/transactions/use-inv-t-sales';
import type { IInvTSales } from '@/types/inventory/transactions/inv-t-sales';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface ViewReceiptItemModalProps {
    rowData: IInvTSales;
    onClose: () => void;
}

interface ReceiptItem {
    invmI_ItemName: string;
    invtsL_SalesQty: number;
    invtsL_SalesPrice: number;
    invtsL_Amount: number;
    invtsL_BatchNo: string;
    invmuoM_UOMName: string;
    [key: string]: any;
}

export function ViewReceiptItemModal({ rowData, onClose }: ViewReceiptItemModalProps) {
    const { getSaleItemDetailsMutation } = useInvTSales();
    const [items, setItems] = useState<ReceiptItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response: any = await getSaleItemDetailsMutation.mutateAsync(rowData.invmsL_Id);

                if (response) {
                    const data = response.data || response;
                    if (Array.isArray(data)) {
                        setItems(data);
                    } else if (data.data && Array.isArray(data.data)) {
                        setItems(data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching item details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (rowData.invmsL_Id) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [rowData.invmsL_Id, getSaleItemDetailsMutation.mutateAsync]);

    return (
        <AdaptiveDialog title={`Item Details: ${rowData.invmsL_SalesNo}`} isOpen={true} onClose={onClose} size="xl">
            <AdaptiveBody className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="text-lg text-muted-foreground">Loading item details...</div>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[80vh]">
                        <div className="p-4">
                            <table className="w-full border-collapse border border-gray-200 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2 text-center w-12">SL.No</th>
                                        <th className="border p-2 text-left">Item Name</th>
                                        <th className="border p-2 text-center">UOM</th>
                                        <th className="border p-2 text-center">Batch No</th>
                                        <th className="border p-2 text-center">Qty</th>
                                        <th className="border p-2 text-right">Price</th>
                                        <th className="border p-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border p-2 text-center">{index + 1}</td>
                                            <td className="border p-2">{item.invmI_ItemName}</td>
                                            <td className="border p-2 text-center">{item.invmuoM_UOMName}</td>
                                            <td className="border p-2 text-center">{item.invtsL_BatchNo}</td>
                                            <td className="border p-2 text-center">{item.invtsL_SalesQty}</td>
                                            <td className="border p-2 text-right">{item.invtsL_SalesPrice?.toFixed(2)}</td>
                                            <td className="border p-2 text-right">{item.invtsL_Amount?.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="border p-4 text-center text-muted-foreground">No items found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </ScrollArea>
                )}
            </AdaptiveBody>
            <AdaptiveFooter>
                <Button onClick={onClose} variant="outline">Close</Button>
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}
