
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invRGRNSchema, type InvRGRNSchema } from '@/schemas/inventory/reports/inv-r-grn';
import { useInvRGRNLoadData, useInvRGRNReport } from '@/hooks/inventory/reports/use-inv-r-grn';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import { useEffect, useMemo } from 'react';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FileText, Filter, Printer, RefreshCcw } from 'lucide-react';
import { FormError } from '@/components/ui/extension/field';
import { format } from 'date-fns';

interface ReportFormProps {
    onReportGenerated: (data: any, payload: any, total: number) => void;
}

export default function ReportForm({ onReportGenerated }: ReportFormProps) {
    const form = useForm<InvRGRNSchema>({
        resolver: zodResolver(invRGRNSchema),
        defaultValues: {
            typeflag: 'All',
            bw_dates: false,
            startdate: undefined,
            enddate: undefined,
            optionflag: undefined,
            grnArray: [],
            itemArray: [],
            supplierArray: []
        }
    });

    const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = form;

    // Watched values
    const typeflag = watch('typeflag');
    const optionflag = watch('optionflag');
    const bw_dates = watch('bw_dates');

    // Data Fetching
    const { data: loadData, refetch: refetchLoadData, isFetching: isLoadDataFetching } = useInvRGRNLoadData(optionflag || '');
    const generateReportMutation = useInvRGRNReport();

    // Effect to refetch when optionflag changes
    useEffect(() => {
        if (optionflag) {
            refetchLoadData();
            // Clear previous selections for other arrays to avoid confusion? 
            // The angular code keeps separate arrays. We can do the same.
            // But we might want to clear the current relevant array to force fresh selection
            if (optionflag === 'Individual_1') setValue('grnArray', []);
            if (optionflag === 'Item_1') setValue('itemArray', []);
            if (optionflag === 'Supplier') setValue('supplierArray', []);
        }
    }, [optionflag, refetchLoadData, setValue]);

    // Derived options for MultiSelects
    const grnOptions = useMemo(() => {
        return loadData?.data?.get_grn_item_supplier?.map((item: any) => ({
            label: item.invmgrN_GRNNo,
            value: item.invmgrN_Id?.toString()
        })) || [];
    }, [loadData, optionflag]);

    const itemOptions = useMemo(() => {
        return loadData?.data?.get_grn_item_supplier?.map((item: any) => ({
            label: item.invmI_ItemName,
            value: item.invmI_Id?.toString()
        })) || [];
    }, [loadData, optionflag]);

    const supplierOptions = useMemo(() => {
        return loadData?.data?.get_grn_item_supplier?.map((item: any) => ({
            label: item.invmS_SupplierName,
            value: item.invmS_Id?.toString()
        })) || [];
    }, [loadData, optionflag]);

    const onSubmit = (data: InvRGRNSchema) => {
        generateReportMutation.mutate(
            // @ts-ignore - casting simpler types for mock payload
            { payload: data },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        onReportGenerated(res.data.get_grnreport, data, res.total || 0);
                    }
                }
            });
    };

    const handleCancel = () => {
        reset();
        onReportGenerated([], null, 0);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CollapsibleSection
                title="Report Configuration"
                defaultOpen={true}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                    {/* Report Type Selection */}
                    <div className="space-y-3 bg-muted/20 p-4 rounded-md border">
                        <Label className="font-semibold text-primary">Report Type</Label>
                        <Controller
                            name="typeflag"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        setValue('optionflag', undefined); // Reset sub-option
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="All" id="r1" />
                                        <Label htmlFor="r1" className="cursor-pointer">All</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Overall" id="r2" />
                                        <Label htmlFor="r2" className="cursor-pointer">Overall</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Detailed" id="r3" />
                                        <Label htmlFor="r3" className="cursor-pointer">Detailed</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>

                    {/* Sub Options (Visible only for Overall/Detailed) */}
                    {(typeflag === 'Overall' || typeflag === 'Detailed') && (
                        <div className="space-y-3 bg-muted/20 p-4 rounded-md border">
                            <Label className="font-semibold text-primary">Filter By</Label>
                            <Controller
                                name="optionflag"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {/* Individual option only for Detailed? Angular logic:
                                            <label class="radio-inline" ng-show="typeflag=='Detailed'">
                                                <input type="radio" value="Individual_1" ...>
                                        */}
                                        {typeflag === 'Detailed' && (
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Individual_1" id="sub1" />
                                                <Label htmlFor="sub1" className="cursor-pointer">Individual (GRN)</Label>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Item_1" id="sub2" />
                                            <Label htmlFor="sub2" className="cursor-pointer">Item-wise</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Supplier" id="sub3" />
                                            <Label htmlFor="sub3" className="cursor-pointer">Supplier</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.optionflag && <FormError>{errors.optionflag.message}</FormError>}
                        </div>
                    )}

                    {/* Date Filters */}
                    {typeflag !== 'All' && (
                        <div className="space-y-3 bg-muted/20 p-4 rounded-md border">
                            <div className="flex items-center space-x-2 mb-4">
                                <Controller
                                    name="bw_dates"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="bw_dates"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor="bw_dates" className="font-semibold cursor-pointer">Between Dates</Label>
                            </div>

                            {bw_dates && (
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-1.5">
                                        <Label>Start Date <span className="text-destructive">*</span></Label>
                                        <Controller
                                            name="startdate"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type='date'
                                                    className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            )}
                                        />
                                        {errors.startdate && <FormError>{errors.startdate.message}</FormError>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label>End Date <span className="text-destructive">*</span></Label>
                                        <Controller
                                            name="enddate"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type='date'
                                                    className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            )}
                                        />
                                        {errors.enddate && <FormError>{errors.enddate.message}</FormError>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Specific Filters (Multi Selects) */}
                {(optionflag === 'Individual_1' || optionflag === 'Item_1' || optionflag === 'Supplier') && (
                    <div className="p-4 pt-0">
                        <div className="bg-background rounded-md border border-dashed p-4">
                            {optionflag === 'Individual_1' && (
                                <div className="space-y-2 max-w-xl">
                                    <Label>Select GRN No <span className="text-destructive">*</span></Label>
                                    <Controller
                                        name="grnArray"
                                        control={control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                options={grnOptions}
                                                onValueChange={(val) => {
                                                    // Map string values back to full objects if needed, or just send IDs
                                                    // The schema expects array/any, server expects object array. 
                                                    // We'll just map IDs for now and let server handle or map objects here.
                                                    // Angular code sent full objects. Let's send basic objects.
                                                    const selectedObjects = loadData?.data?.get_grn_item_supplier
                                                        ?.filter((i: any) => val.includes(i.invmgrN_Id.toString()))
                                                        .map((i: any) => ({ ...i, checked: true }));
                                                    field.onChange(selectedObjects);
                                                }}
                                                defaultValue={field.value?.map((v: any) => v.invmgrN_Id.toString())}
                                                placeholder="Select GRN..."
                                            />
                                        )}
                                    />
                                    {errors.optionflag && !watch('grnArray')?.length && <FormError>Please select at least one GRN</FormError>}
                                </div>
                            )}

                            {optionflag === 'Item_1' && (
                                <div className="space-y-2 max-w-xl">
                                    <Label>Select Item <span className="text-destructive">*</span></Label>
                                    <Controller
                                        name="itemArray"
                                        control={control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                options={itemOptions}
                                                onValueChange={(val) => {
                                                    const selectedObjects = loadData?.data?.get_grn_item_supplier
                                                        ?.filter((i: any) => val.includes(i.invmI_Id.toString()))
                                                        .map((i: any) => ({ ...i, checked: true }));
                                                    field.onChange(selectedObjects);
                                                }}
                                                defaultValue={field.value?.map((v: any) => v.invmI_Id.toString())}
                                                placeholder="Select Item..."
                                            />
                                        )}
                                    />
                                    {errors.optionflag && !watch('itemArray')?.length && <FormError>Please select at least one Item</FormError>}
                                </div>
                            )}

                            {optionflag === 'Supplier' && (
                                <div className="space-y-2 max-w-xl">
                                    <Label>Select Supplier <span className="text-destructive">*</span></Label>
                                    <Controller
                                        name="supplierArray"
                                        control={control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                options={supplierOptions}
                                                onValueChange={(val) => {
                                                    const selectedObjects = loadData?.data?.get_grn_item_supplier
                                                        ?.filter((i: any) => val.includes(i.invmS_Id.toString()))
                                                        .map((i: any) => ({ ...i, checked: true }));
                                                    field.onChange(selectedObjects);
                                                }}
                                                defaultValue={field.value?.map((v: any) => v.invmS_Id.toString())}
                                                placeholder="Select Supplier..."
                                            />
                                        )}
                                    />
                                    {errors.optionflag && !watch('supplierArray')?.length && <FormError>Please select at least one Supplier</FormError>}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-center gap-4 p-4 border-t bg-muted/10">
                    <Button
                        type="submit"
                        size="lg"
                        className="w-32"
                        isLoading={generateReportMutation.isPending}
                    >
                        <FileText className="mr-2 h-4 w-4" /> Report
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        size="lg"
                        className="w-32"
                        onClick={handleCancel}
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                </div>

            </CollapsibleSection>
        </form>
    );
}
