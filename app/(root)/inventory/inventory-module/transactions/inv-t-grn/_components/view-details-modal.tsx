'use client';

import { useEffect, useState } from 'react';
import {
    AdaptiveDialog,
    AdaptiveBody,
    AdaptiveFooter
} from '@/components/ui/extension/adaptive-dialog';
import { Button } from '@/components/ui/button';
import { getInvTGRNItemDetails } from '@/server/inventory/transactions/inv-t-grn';
import type { IInvTGRN, IInvTGRNItem } from '@/types/inventory/transactions/inv-t-grn';

interface ViewGRNDetailsModalProps {
    rowData: IInvTGRN;
    isOpen: boolean;
    onClose: () => void;
}

export default function ViewGRNDetailsModal({ rowData, isOpen, onClose }: ViewGRNDetailsModalProps) {
    const [details, setDetails] = useState<IInvTGRNItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDetails() {
            if (isOpen && rowData.invmgrN_Id) {
                setIsLoading(true);
                try {
                    const res = await getInvTGRNItemDetails(rowData.invmgrN_Id);
                    if (res.success && res.data) {
                        setDetails(res.data || []);
                    }
                } catch (error) {
                    console.error('Error fetching GRN details:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        fetchDetails();
    }, [isOpen, rowData.invmgrN_Id]);

    return (
        <AdaptiveDialog
            isOpen={isOpen}
            onClose={onClose}
            title={`GRN Details - ${rowData.invmgrN_GRNNo}`}
            size='xl'
        >
            <AdaptiveBody className='p-6'>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg'>
                    <div>
                        <p className='text-xs text-muted-foreground uppercase font-semibold'>Store</p>
                        <p className='text-sm font-medium'>{rowData.invmS_StoreName}</p>
                    </div>
                    <div>
                        <p className='text-xs text-muted-foreground uppercase font-semibold'>Supplier</p>
                        <p className='text-sm font-medium'>{rowData.invmS_SupplierName}</p>
                    </div>
                    <div>
                        <p className='text-xs text-muted-foreground uppercase font-semibold'>Date</p>
                        <p className='text-sm font-medium'>{rowData.invmgrN_PurchaseDate ? new Date(rowData.invmgrN_PurchaseDate).toLocaleDateString() : '-'}</p>
                    </div>
                    <div>
                        <p className='text-xs text-muted-foreground uppercase font-semibold'>Total Value</p>
                        <p className='text-sm font-bold text-primary'>₹{Number(rowData.invmgrN_PurchaseValue).toFixed(2)}</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className='flex justify-center p-8'>Loading item details...</div>
                ) : (
                    <div className='border rounded-lg overflow-hidden'>
                        <table className='w-full text-sm'>
                            <thead className='bg-muted'>
                                <tr>
                                    <th className='p-2 border text-left'>SL</th>
                                    <th className='p-2 border text-left'>Item</th>
                                    <th className='p-2 border text-left'>UOM</th>
                                    <th className='p-2 border text-center'>Batch</th>
                                    <th className='p-2 border text-right'>Qty</th>
                                    <th className='p-2 border text-right'>Rate</th>
                                    <th className='p-2 border text-right'>Discount</th>
                                    <th className='p-2 border text-right'>Tax</th>
                                    <th className='p-2 border text-right'>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((item, index) => (
                                    <tr key={index} className='hover:bg-muted/30'>
                                        <td className='p-2 border text-center'>{index + 1}</td>
                                        <td className='p-2 border'>{item.invmI_ItemName}</td>
                                        <td className='p-2 border'>{item.invmuoM_UOMName}</td>
                                        <td className='p-2 border text-center'>{item.invtgrN_BatchNo}</td>
                                        <td className='p-2 border text-right'>{item.invtgrN_Qty}</td>
                                        <td className='p-2 border text-right'>₹{Number(item.invtgrN_PurchaseRate).toFixed(2)}</td>
                                        <td className='p-2 border text-right'>₹{Number(item.invtgrN_DiscountAmt).toFixed(2)}</td>
                                        <td className='p-2 border text-right'>₹{Number(item.invtgrN_TaxAmt).toFixed(2)}</td>
                                        <td className='p-2 border text-right font-medium'>₹{Number(item.invtgrN_Amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AdaptiveBody>
            <AdaptiveFooter>
                <Button onClick={onClose} variant='secondary'>Close</Button>
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}
