'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getItemTax, deactivateItemTax } from '@/server/inventory/masters/inv-master-item';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ItemTaxDialogProps {
    item: any;
    onClose: () => void;
}

export default function ItemTaxDialog({ item, onClose }: ItemTaxDialogProps) {
    const [taxData, setTaxData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchItemTaxes = async () => {
        setLoading(true);
        const res = await getItemTax(item.invmI_Id);
        if (res.success) {
            setTaxData(res.get_itemTax);
        } else {
            setTaxData([]);
            toast.error('Failed to fetch tax details');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (item) {
            fetchItemTaxes();
        }
    }, [item]);

    const handleToggleTax = async (taxRecord: any) => {
        try {
            const res = await deactivateItemTax(taxRecord);
            if (res.returnval || res.success) {
                toast.success('Tax status updated');
                fetchItemTaxes();
            } else {
                toast.error('Failed to update tax status');
            }
        } catch (error) {
            toast.error('Error toggling tax status');
        }
    };

    return (
        <Dialog open={!!item} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tax Details - {item?.invmI_ItemName}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {loading ? (
                        <p className="text-center text-muted-foreground">Loading tax details...</p>
                    ) : taxData.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>SL NO</TableHead>
                                    <TableHead>Tax Name</TableHead>
                                    <TableHead>Tax Alias</TableHead>
                                    <TableHead>Percentage</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {taxData.map((tax, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>{tax.invmT_TaxName}</TableCell>
                                        <TableCell>{tax.invmT_TaxAliasName}</TableCell>
                                        <TableCell>{tax.invmiT_TaxValue}%</TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant={tax.invmiT_ActiveFlg ? "destructive" : "default"}
                                                size="sm"
                                                onClick={() => handleToggleTax(tax)}
                                            >
                                                {tax.invmiT_ActiveFlg ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground">No tax details found for this item.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
