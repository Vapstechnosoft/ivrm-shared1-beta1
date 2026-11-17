'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import type { IInvMasterTax, IInvMasterTaxLedger } from '@/types/inventory/masters/inv-master-tax';
import { useInvMasterTaxDetails, useLedgerUnder, useInvMasterTax } from '@/hooks/inventory/masters/use-inv-master-tax';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invMasterTaxLedgerSchema, type InvMasterTaxLedgerSchema } from '@/schemas/inventory/masters/inv-master-tax';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { saveInvMasterTaxLedger } from '@/server/inventory/masters/inv-master-tax';
import { toast } from 'sonner';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { useMemo } from 'react';

interface TaxLedgerSheetProps {
    isOpen: boolean;
    onClose: () => void;
    tax: IInvMasterTax | null;
}

export default function TaxLedgerSheet({ isOpen, onClose, tax }: TaxLedgerSheetProps) {
    // ✅ Fetch tax details
    const { data: detailsData, isLoading: isLoadingDetails } = useInvMasterTaxDetails(tax?.invmT_Id || 0);
    const { data: allData, isLoading: isLoadingAll, refetchAll } = useInvMasterTax();

    // ✅ Safely default to empty arrays
    const companies = Array.isArray(detailsData?.companynames) ? detailsData.companynames : [];
    const ledgers = Array.isArray(detailsData?.ledgernames) ? detailsData.ledgernames : [];

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting, errors }
    } = useForm<InvMasterTaxLedgerSchema>({
        resolver: zodResolver(invMasterTaxLedgerSchema),
        defaultValues: {
            invmtleD_TaxName: '',
            INVMT_Id: tax?.invmT_Id,
            famcomP_Id: undefined,
            famleD_Id: undefined,
            ledgerunderids: []
        }
    });

    const selectedLedgerId = watch('famleD_Id');
    const { data: ledgerUnderData } = useLedgerUnder(selectedLedgerId);
    const ledgerUnderOptions = Array.isArray(ledgerUnderData?.ledgeunderrnames) ? ledgerUnderData.ledgeunderrnames : [];

    const onSubmit = async (data: InvMasterTaxLedgerSchema) => {
        try {
            const payload = { ...data, INVMT_Id: tax?.invmT_Id || 0 };
            const result = await saveInvMasterTaxLedger(payload);
            if (result.returnval) {
                toast.success('Ledger mapping saved successfully');
                refetchAll();
                reset({
                    invmtleD_TaxName: '',
                    famcomP_Id: undefined,
                    famleD_Id: undefined,
                    ledgerunderids: [],
                    INVMT_Id: tax?.invmT_Id
                });
            } else {
                toast.error('Failed to save ledger mapping');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const ledgerColumns: ColumnDef<IInvMasterTaxLedger>[] = useMemo(
        () => [
            {
                accessorKey: 'sno',
                header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
                cell: ({ row, table }) => (table.getSortedRowModel().flatRows.indexOf(row) + 1).toString()
            },
            {
                accessorKey: 'invmtleD_TaxName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Tax Ledger Name' />
            },
            {
                accessorKey: 'famcomP_CompanyName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Company' />
            },
            {
                accessorKey: 'famleD_LedgerName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Ledger' />
            },
            {
                accessorKey: 'famgrP_GroupName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Ledger Under' />
            }
        ],
        []
    );

    // ✅ Safely default to empty array for table and filter by tax ID
    const taxLedgers: IInvMasterTaxLedger[] = Array.isArray(allData?.getloaddata)
        ? (allData.getloaddata as IInvMasterTaxLedger[]).filter((item: any) => item.invmT_Id === tax?.invmT_Id)
        : [];

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Tax Ledger Mapping</SheetTitle>
                    <SheetDescription>
                        Manage ledger mappings for tax: {tax?.invmT_TaxName || 'N/A'}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 border p-4 rounded-md'>
                        <div className='space-y-2'>
                            <Label htmlFor='invmtleD_TaxName'>Ledger Tax Name</Label>
                            <Controller
                                name='invmtleD_TaxName'
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} id='invmtleD_TaxName' placeholder='Enter Ledger Tax Name' />
                                )}
                            />
                            {errors.invmtleD_TaxName && <p className='text-red-500 text-xs'>{errors.invmtleD_TaxName.message}</p>}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='famcomP_Id'>Company Name</Label>
                            <Controller
                                name='famcomP_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <SelectTrigger id='famcomP_Id'>
                                            <SelectValue placeholder="Select Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((c) => (
                                                <SelectItem key={c.famcomP_Id} value={c.famcomP_Id.toString()}>
                                                    {c.famcomP_CompanyName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.famcomP_Id && <p className='text-red-500 text-xs'>{errors.famcomP_Id.message}</p>}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='famleD_Id'>Ledger Name</Label>
                            <Controller
                                name='famleD_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <SelectTrigger id='famleD_Id'>
                                            <SelectValue placeholder="Select Ledger" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ledgers.map((l) => (
                                                <SelectItem key={l.famleD_Id} value={l.famleD_Id.toString()}>
                                                    {l.famleD_LedgerName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.famleD_Id && <p className='text-red-500 text-xs'>{errors.famleD_Id.message}</p>}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='ledgerunderids'>Ledger Under</Label>
                            <Controller
                                name='ledgerunderids'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={ledgerUnderOptions.map((l) => ({ label: l.famgrP_GroupName, value: l.famgrP_Id }))}
                                        onValueChange={(vals) => field.onChange(vals.map(Number))}
                                        value={field.value?.map(String) || []}
                                        placeholder="Select Ledger Under"
                                        variant="inverted"
                                        animation={2}
                                        maxCount={3}
                                    />
                                )}
                            />
                            {errors.ledgerunderids && <p className='text-red-500 text-xs'>{errors.ledgerunderids.message}</p>}
                        </div>

                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Mapping'}
                        </Button>
                    </form>

                    {/* Table */}
                    <div className='border rounded-md p-4'>
                        <h3 className='text-lg font-medium mb-4'>Existing Mappings</h3>
                        <GenericDataTable
                            data={taxLedgers}
                            columns={ledgerColumns}
                            isLoading={isLoadingAll || isLoadingDetails}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
