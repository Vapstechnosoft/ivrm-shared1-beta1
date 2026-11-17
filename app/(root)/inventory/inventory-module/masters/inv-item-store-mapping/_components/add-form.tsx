'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { invItemStoreMappingSchema, type InvItemStoreMappingSchema } from '@/schemas/inventory/masters/inv-item-store-mapping';
import { useInvItemStoreMapping } from '@/hooks/inventory/masters/use-inv-item-store-mapping';
import { toast } from 'sonner';

interface AddInvItemStoreMappingFormProps {
    response: any;
    onSuccess?: () => void;
}

export default function AddInvItemStoreMappingForm({ response, onSuccess }: AddInvItemStoreMappingFormProps) {
    const { saveMutation } = useInvItemStoreMapping();

    const form = useForm<InvItemStoreMappingSchema>({
        resolver: zodResolver(invItemStoreMappingSchema),
        defaultValues: {
            invmsT_Id: 0,
            invmG_Id: 0,
            mappedItems: []
        }
    });

    const { control, handleSubmit, register, reset, watch, setValue } = form;
    const { fields, replace } = useFieldArray({
        control,
        name: 'mappedItems'
    });

    const watchedStoreId = watch('invmsT_Id');
    const watchedMainGroupId = watch('invmG_Id');

    // Populate Mapped Items based on Store and Items
    useEffect(() => {
        if (!response?.data) return;

        const allItems = response.data.get_item || [];
        const existingMappings = response.data.get_mapped_items || [];

        // Prepare form items
        // We want to list ALL items, and check the ones that are mapped to the selected store
        const formItems = allItems.map((item: any) => {
            const mapping = existingMappings.find((m: any) =>
                m.invmsT_Id === Number(watchedStoreId) && m.invmI_Id === item.invmI_Id
            );

            return {
                invmI_Id: item.invmI_Id,
                invmisM_Id: mapping ? mapping.invmisM_Id : 0,
                checked: !!mapping && mapping.invmisM_ActiveFlg !== false, // Assuming active by default if mapped
                // Helper fields for display (not in schema but useful if we could pass them, strictly schema forbids extra fields usually so we rely on index or separate lookup)
            };
        });

        replace(formItems);
    }, [watchedStoreId, response, replace]);

    // Derived state for filtering
    const visibleFields = useMemo(() => {
        // We need to map the fields back to the original item data to check the group
        if (!response?.data?.get_item) return [];

        return fields.map((field, index) => {
            const originalItem = response.data.get_item.find((i: any) => i.invmI_Id === field.invmI_Id);

            // Filter logic
            if (watchedMainGroupId && watchedMainGroupId !== 0) {
                if (originalItem?.invmG_Id !== Number(watchedMainGroupId)) {
                    return null;
                }
            }

            return { ...field, index, itemName: originalItem?.invmI_ItemName, itemGroup: originalItem?.invmG_Id };
        }).filter(Boolean); // Create a list of visible fields with their original index
    }, [fields, watchedMainGroupId, response]);

    const onSubmit = (data: InvItemStoreMappingSchema) => {
        // Filter out unchecked items to send only selected ones? 
        // Or the server expects the full list? 
        // Schema says: min(1, 'Select at least one item').
        // Usually we send only checked items.

        const selectedItems = data.mappedItems.filter(item => item.checked);

        if (selectedItems.length === 0) {
            toast.error('Please select at least one item to map');
            return;
        }

        const payload = {
            invmsT_Id: data.invmsT_Id,
            mappedItems: selectedItems
        };

        saveMutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.success) {
                    // toast handled in hook
                    onSuccess?.();
                }
            }
        });
    };

    const handleSelectAll = (checked: boolean) => {
        // Toggle check for all VISIBLE items
        visibleFields?.forEach((field: any) => {
            setValue(`mappedItems.${field.index}.checked`, checked);
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CollapsibleSection
                title="Map Items to Store"
                defaultOpen={true}
                className="shadow-md border-primary/20"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Store</label>
                        <Controller
                            name="invmsT_Id"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Store" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {response?.data?.get_store?.map((store: any) => (
                                            <SelectItem key={store.invmsT_Id} value={store.invmsT_Id.toString()}>
                                                {store.invmS_StoreName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Main Group Filter</label>
                        <Controller
                            name="invmG_Id"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() || '0'}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Groups" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">All Groups</SelectItem>
                                        {response?.data?.get_maingroup?.map((group: any) => (
                                            <SelectItem key={group.invmG_Id} value={group.invmG_Id.toString()}>
                                                {group.invmG_GroupName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                <div className="border rounded-md mx-4 mb-4 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[50px] text-center">
                                    <Checkbox
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Item Group</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="max-h-[400px] overflow-y-auto">
                            {visibleFields?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No items found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                visibleFields?.map((field: any) => (
                                    <TableRow key={field.id}>
                                        <TableCell className="text-center">
                                            <Controller
                                                name={`mappedItems.${field.index}.checked`}
                                                control={control}
                                                render={({ field: checkboxField }) => (
                                                    <Checkbox
                                                        checked={checkboxField.value}
                                                        onCheckedChange={checkboxField.onChange}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>{field.itemName}</TableCell>
                                        <TableCell>
                                            {/* Ideally lookup group name but ID is fine or we can extend visibleFields lookup */}
                                            {response?.data?.get_maingroup?.find((g: any) => g.invmG_Id === field.itemGroup)?.invmG_GroupName || field.itemGroup}
                                        </TableCell>
                                        <TableCell>
                                            {field.invmisM_Id ? <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Mapped</span> : <span className="text-xs text-muted-foreground">Unmapped</span>}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" /> Reset
                    </Button>
                    <Button type="submit" disabled={saveMutation.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {saveMutation.isPending ? 'Saving...' : 'Save Mapping'}
                    </Button>
                </div>
            </CollapsibleSection>
        </form>
    );
}
