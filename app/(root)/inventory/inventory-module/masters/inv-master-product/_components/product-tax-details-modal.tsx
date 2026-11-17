'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useInvMasterProduct } from "@/hooks/inventory/masters/use-inv-master-product";

interface ProductTaxModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number | null;
}

export const ProductTaxModal = ({ isOpen, onClose, productId }: ProductTaxModalProps) => {
    const { getProductTaxMutation, deactiveProductTaxMutation } = useInvMasterProduct();
    const [taxData, setTaxData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [productName, setProductName] = useState('');

    useEffect(() => {
        if (isOpen && productId) {
            setLoading(true);
            getProductTaxMutation.mutate({ INVMP_Id: productId }, {
                onSuccess: (res: any) => {
                    setTaxData(res.gridproductTax || []);
                    if (res.gridproductTax && res.gridproductTax.length > 0) {
                        setProductName(res.gridproductTax[0].invmP_ProductName);
                    } else {
                        setProductName('');
                    }
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                    setTaxData([]);
                    setProductName('');
                }
            });
        }
    }, [isOpen, productId, getProductTaxMutation]);

    const handleDeactive = (taxItem: any) => {
        deactiveProductTaxMutation.mutate(taxItem, {
            onSuccess: (res: any) => {
                // Refresh data
                if (res.returnval === true && productId) {
                    getProductTaxMutation.mutate({ INVMP_Id: productId }, {
                        onSuccess: (res: any) => {
                            setTaxData(res.gridproductTax || []);
                        }
                    });
                }
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Tax Details {productName ? `- ${productName}` : ''}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 text-sm border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">SL NO</th>
                                    <th className="px-4 py-2 text-left">Tax Name</th>
                                    <th className="px-4 py-2 text-left">Tax Alias</th>
                                    <th className="px-4 py-2 text-left">Tax Percentage</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {taxData.map((row: any, index: number) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{row.invmT_TaxName}</td>
                                        <td className="px-4 py-2">{row.invmT_TaxAliasName}</td>
                                        <td className="px-4 py-2">{row.invmpT_TaxValue}</td>
                                        <td className="px-4 py-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleDeactive(row)}>
                                                {row.invmpT_ActiveFlg ? (
                                                    <span className="text-red-500">Deactivate</span>
                                                ) : (
                                                    <span className="text-green-500">Activate</span>
                                                )}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {taxData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">No taxes found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
