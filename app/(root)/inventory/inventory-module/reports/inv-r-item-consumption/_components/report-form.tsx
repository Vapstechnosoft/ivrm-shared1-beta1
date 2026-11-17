
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invRItemConsumptionSchema, type InvRItemConsumptionSchema } from '@/schemas/inventory/reports/inv-r-item-consumption';
import { useInvRItemConsumptionLoadData, useInvRItemConsumptionReport } from '@/hooks/inventory/reports/use-inv-r-item-consumption';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FileText, Filter, RefreshCcw, Check, ChevronsUpDown } from 'lucide-react';
import { FormError } from '@/components/ui/extension/field';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

interface ReportFormProps {
    onReportGenerated: (payload: any) => void;
    isLoading: boolean;
}

export default function ReportForm({ onReportGenerated, isLoading }: ReportFormProps) {
    const form = useForm<InvRItemConsumptionSchema>({
        resolver: zodResolver(invRItemConsumptionSchema),
        defaultValues: {
            typeflag: 'All',
            optionflag: undefined,
            bw_dates: false,
            startdate: undefined,
            enddate: undefined,
            invmI_Id: undefined,
            hrmD_Id: undefined,
            amsT_Id: undefined,
            staffArray: []
        }
    });

    const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = form;

    const typeflag = watch('typeflag');
    const optionflag = watch('optionflag');
    const bw_dates = watch('bw_dates');

    // Fetch Details based on Option Flag
    // Angular logic: "loaddata(scope.optionflag)". Only when optionflag is set (Item/Staff/etc) it calls API.
    const { data: detailsData, refetch: refetchDetails } = useInvRItemConsumptionLoadData(optionflag);

    // Effect: Reset fields when typeflag changes (Angular `typerdochange`)
    useEffect(() => {
        if (typeflag === 'All') {
            setValue('optionflag', undefined);
            // Clear other fields? Angular code clears date, grid, etc.
        } else {
            // If switching to Overall or Detailed, maybe set default optionflag? 
            // Angular: "if (optionflag == null) optionflag = 'Item'"
            if (!optionflag) setValue('optionflag', 'Item');
        }
    }, [typeflag, setValue, optionflag]);

    // Effect: Fetch data when optionflag changes
    useEffect(() => {
        if (optionflag) {
            refetchDetails();
            setValue('invmI_Id', undefined);
            setValue('hrmD_Id', undefined);
            setValue('amsT_Id', undefined);
            setValue('staffArray', []);
        }
    }, [optionflag, refetchDetails, setValue]);



    const itemOptions = useMemo(() => detailsData?.data?.get_ICreportdetails?.map((item: any) => ({
        label: item.invmI_ItemCode ? `${item.invmI_ItemName} : ${item.invmI_ItemCode}` : item.invmI_ItemName,
        value: item.invmI_Id
    })) || [], [detailsData]);

    const staffOptions = useMemo(() => detailsData?.data?.get_ICreportdetails?.map((item: any) => ({
        label: item.employeename,
        value: item.hrmE_Id?.toString()
    })) || [], [detailsData]);

    const deptOptions = useMemo(() => detailsData?.data?.get_ICreportdetails?.map((item: any) => ({
        label: item.hrmD_DepartmentName,
        value: item.hrmD_Id
    })) || [], [detailsData]);

    const studentOptions = useMemo(() => detailsData?.data?.get_ICreportdetails?.map((item: any) => ({
        label: item.studentname,
        value: item.amsT_Id
    })) || [], [detailsData]);


    const onSubmit = (data: InvRItemConsumptionSchema) => {
        onReportGenerated(data);
    };

    const handleCancel = () => {
        reset();
        onReportGenerated(null);
    };

    // Generic Combobox for Single Selects
    const GenericCombobox = ({ options, value, onChange, placeholder }: any) => {
        const [open, setOpen] = useState(false);
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                        {value
                            ? options.find((option: any) => option.value === value)?.label
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder={`Search ${placeholder}...`} />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option: any) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        )
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CollapsibleSection title="Report Configuration" defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">

                    {/* Report Type */}
                    <div className="space-y-3 bg-muted/20 p-4 rounded-md border">
                        <Label className="font-semibold text-primary">Report Type</Label>
                        <Controller
                            name="typeflag"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="All" id="r1" /><Label htmlFor="r1">All</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Overall" id="r2" /><Label htmlFor="r2">Overall</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Detailed" id="r3" /><Label htmlFor="r3">Detailed</Label></div>
                                </RadioGroup>
                            )}
                        />
                    </div>

                    {/* Filter By (Conditional) */}
                    {(typeflag === 'Overall' || typeflag === 'Detailed') && (
                        <div className="space-y-3 bg-muted/20 p-4 rounded-md border">
                            <Label className="font-semibold text-primary">Filter By</Label>
                            <Controller
                                name="optionflag"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Item" id="sub1" /><Label htmlFor="sub1">Item</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Staff" id="sub2" /><Label htmlFor="sub2">Staff</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Department" id="sub3" /><Label htmlFor="sub3">Department</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Student" id="sub4" /><Label htmlFor="sub4">Student</Label></div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.optionflag && <FormError>{errors.optionflag.message}</FormError>}
                        </div>
                    )}

                    {/* Date Filters */}
                    <div className="space-y-3 bg-muted/20 p-4 rounded-md border">
                        <div className="flex items-center space-x-2 mb-4">
                            <Controller name="bw_dates" control={control} render={({ field }) => <Checkbox id="bw_dates" checked={field.value} onCheckedChange={field.onChange} />} />
                            <Label htmlFor="bw_dates" className="font-semibold">Between Dates</Label>
                        </div>
                        {bw_dates && (
                            <div className="space-y-3">
                                <div className="flex flex-col gap-1.5"><Label>Start Date</Label><Controller name="startdate" control={control} render={({ field }) => <input type='date' className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm' value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />} />{errors.startdate && <FormError>{errors.startdate.message}</FormError>}</div>
                                <div className="flex flex-col gap-1.5"><Label>End Date</Label><Controller name="enddate" control={control} render={({ field }) => <input type='date' className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm' value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />} />{errors.enddate && <FormError>{errors.enddate.message}</FormError>}</div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Dynamic Content */}
                {(optionflag) && (
                    <div className="p-4 pt-0">
                        <div className="bg-background rounded-md border border-dashed p-4 space-y-4">

                            {optionflag === 'Item' && (
                                <div className="space-y-2 max-w-xl">
                                    <Label>Select Item <span className="text-destructive">*</span></Label>
                                    <Controller name="invmI_Id" control={control} render={({ field }) => (
                                        <GenericCombobox options={itemOptions} value={field.value} onChange={field.onChange} placeholder="Item" />
                                    )} />
                                    {errors.invmI_Id && <FormError>{errors.invmI_Id.message}</FormError>}
                                </div>
                            )}

                            {optionflag === 'Staff' && (
                                <div className="space-y-2 max-w-xl">
                                    <Label>Select Staff <span className="text-destructive">*</span></Label>
                                    <Controller name="staffArray" control={control} render={({ field }) => (
                                        <MultiSelect options={staffOptions} onValueChange={(val) => field.onChange(detailsData?.data?.get_ICreportdetails.filter((s: any) => val.includes(s.hrmE_Id.toString())))} defaultValue={field.value?.map((v: any) => v.hrmE_Id.toString())} placeholder="Select Staff..." />
                                    )} />
                                    {errors.staffArray && <FormError>{errors.staffArray.message}</FormError>}
                                </div>
                            )}

                            {optionflag === 'Department' && (
                                <div className="space-y-2 max-w-xl">
                                    <Label>Select Department <span className="text-destructive">*</span></Label>
                                    <Controller name="hrmD_Id" control={control} render={({ field }) => (
                                        <GenericCombobox options={deptOptions} value={field.value} onChange={field.onChange} placeholder="Department" />
                                    )} />
                                    {errors.hrmD_Id && <FormError>{errors.hrmD_Id.message}</FormError>}
                                </div>
                            )}

                            {optionflag === 'Student' && (
                                <div className="space-y-2 max-w-xl">
                                    <Label>Select Student <span className="text-destructive">*</span></Label>
                                    <Controller name="amsT_Id" control={control} render={({ field }) => (
                                        <GenericCombobox options={studentOptions} value={field.value} onChange={field.onChange} placeholder="Student" />
                                    )} />
                                    {errors.amsT_Id && <FormError>{errors.amsT_Id.message}</FormError>}
                                </div>
                            )}

                        </div>
                    </div>
                )}

                <div className="flex justify-center gap-4 p-4 border-t bg-muted/10">
                    <Button type="submit" size="lg" className="w-32" isLoading={isLoading}><FileText className="mr-2 h-4 w-4" /> Report</Button>
                    <Button type="button" variant="destructive" size="lg" className="w-32" onClick={handleCancel}><RefreshCcw className="mr-2 h-4 w-4" /> Reset</Button>
                </div>
            </CollapsibleSection>
        </form>
    );
}
