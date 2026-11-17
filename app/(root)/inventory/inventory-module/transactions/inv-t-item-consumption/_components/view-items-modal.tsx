'use client';

import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Button } from '@/components/ui/button';
import { useInvTItemConsumption } from '@/hooks/inventory/transactions/use-inv-t-item-consumption';
import type { InvTItemConsumption } from '@/types/inventory/transactions/inv-t-item-consumption';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ViewItemsModalProps {
    rowData: InvTItemConsumption;
    onClose: () => void;
}

export function ViewItemsModal({ rowData, onClose }: ViewItemsModalProps) {
    const { getICItemDetailsMutation } = useInvTItemConsumption();
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await getICItemDetailsMutation.mutateAsync(rowData.invmiC_Id);
                const data = response?.data || response;
                if (Array.isArray(data)) {
                    setItems(data);
                } else if (data?.data && Array.isArray(data.data)) {
                    setItems(data.data);
                }
            } catch (error) {
                console.error('Error fetching IC item details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (rowData.invmiC_Id) {
            fetchData();
        }
    }, [rowData.invmiC_Id]);

    return (
        <AdaptiveDialog title={`Consumption Items: ${rowData.invmiC_ICNo}`} isOpen={true} onClose={onClose} size="xl">
            <AdaptiveBody className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-1">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider">
                                        <th className="border p-3 text-center w-12">#</th>
                                        <th className="border p-3 text-left">Item Name</th>
                                        <th className="border p-3 text-left">Product</th>
                                        <th className="border p-3 text-center">UOM</th>
                                        <th className="border p-3 text-center">Batch No</th>
                                        <th className="border p-3 text-right">Qty</th>
                                        <th className="border p-3 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {items.map((item, index) => (
                                        <tr key={index} className="hover:bg-muted/50 transition-colors">
                                            <td className="border p-2 text-center text-muted-foreground">{index + 1}</td>
                                            <td className="border p-2 font-medium">{item.invmI_ItemName || item.invmi_itemname}</td>
                                            <td className="border p-2 text-muted-foreground">{(item.invmP_ProductName || item.invmp_productname) || '-'}</td>
                                            <td className="border p-2 text-center">{item.invmuoM_UOMName || item.invmuom_uomname}</td>
                                            <td className="border p-2 text-center text-muted-foreground font-mono">{item.invtiC_BatchNo || item.invtic_batchno}</td>
                                            <td className="border p-2 text-right font-bold text-primary">{item.invtiC_ICQty || item.invtic_icqty}</td>
                                            <td className="border p-2 text-right">{(item.invtiC_ICPrice || item.invtic_icprice)?.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="border p-8 text-center text-muted-foreground italic">
                                                No item details found for this consumption record.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </ScrollArea>
                )}
            </AdaptiveBody>
            <AdaptiveFooter>
                <Button onClick={onClose} variant="outline" className="min-w-[100px]">Close</Button>
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}
