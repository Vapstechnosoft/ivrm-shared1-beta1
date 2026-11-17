
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invRSalesSchema, type InvRSalesSchema } from '@/schemas/inventory/reports/inv-r-sales';
import { useInvRSalesLoadData, useInvRSalesDetails, useInvRSalesClassData, useInvRSalesStudentList, useInvRSalesSectionList, useInvRSalesReport } from '@/hooks/inventory/reports/use-inv-r-sales';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import { useEffect, useMemo, useState } from 'react';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FileText, Filter, RefreshCcw } from 'lucide-react';
import { FormError } from '@/components/ui/extension/field';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';

interface ReportFormProps {
    onSubmit: (payload: InvRSalesSchema) => void;
    isLoading?: boolean;
}

export default function ReportForm({ onSubmit, isLoading }: ReportFormProps) {
    const form = useForm<InvRSalesSchema>({
        resolver: zodResolver(invRSalesSchema),
        defaultValues: {
            typeflag: 'All',
            bw_dates: false,
            startdate: undefined,
            enddate: undefined,
            optionflag: undefined,
            individualflag: undefined,
            showTax: false,
            showDiscount: false,
            salesArray: [],
            itemArray: [],
            studentArray: [],
            classId: undefined,
            sectionId: undefined,
            singleStudentId: undefined,
            singleStaffId: undefined,
            singleCustomerId: undefined,
        }
    });

    const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = form;

    // Watched values
    const typeflag = watch('typeflag');
    const optionflag = watch('optionflag');
    const individualflag = watch('individualflag');
    const bw_dates = watch('bw_dates');
    const classId = watch('classId');
    const sectionId = watch('sectionId'); // For triggering student fetch in CS mode

    // 1. Initial Load (mostly usually for sales array, but Angular fetches based on optionflag)
    const { data: loadData } = useInvRSalesLoadData();

    // 2. Fetch Details based on Option Flag (Items, Staff, Customer, SaleNo, All Students for single select)
    const { data: detailsData, refetch: refetchDetails } = useInvRSalesDetails(optionflag);

    // 3. Fetch Class Data (when student -> individualflag C/CS)
    const { data: classData, refetch: refetchClasses } = useInvRSalesClassData(individualflag);

    // 4. Fetch Sections (when Class selected in CS mode)
    const { data: sectionData, refetch: refetchSections } = useInvRSalesSectionList(classId, individualflag);

    // 5. Fetch Student List (when Class/Section selected)
    const { data: studentListData, refetch: refetchStudentList } = useInvRSalesStudentList(classId, sectionId, individualflag);

    // Effect: Option Flag Changes
    useEffect(() => {
        if (optionflag) {
            refetchDetails();
            setValue('individualflag', undefined);
            setValue('classId', undefined);
            setValue('sectionId', undefined);
            setValue('studentArray', []);
            setValue('itemArray', []);
            setValue('salesArray', []);
            setValue('singleStudentId', undefined);
            setValue('singleStaffId', undefined);
            setValue('singleCustomerId', undefined);
        }
    }, [optionflag, refetchDetails, setValue]);

    // Effect: Individual Flag Changes
    useEffect(() => {
        if (individualflag) {
            refetchClasses();
            setValue('classId', undefined);
            setValue('sectionId', undefined);
            setValue('studentArray', []);
        }
    }, [individualflag, refetchClasses, setValue]);

    // Effect: Class Changes -> Fetch Sections (CS) or Students (C)
    useEffect(() => {
        if (classId) {
            if (individualflag === 'CS') {
                refetchSections();
                setValue('sectionId', undefined);
                setValue('studentArray', []);
            } else if (individualflag === 'C') {
                refetchStudentList();
                setValue('studentArray', []);
            }
        }
    }, [classId, individualflag, refetchSections, refetchStudentList, setValue]);

    // Effect: Section Changes -> Fetch Students (CS)
    useEffect(() => {
        if (classId && sectionId && individualflag === 'CS') {
            refetchStudentList();
            setValue('studentArray', []);
        }
    }, [classId, sectionId, individualflag, refetchStudentList, setValue]);


    // Memoized Options
    const grnSalesOptions = useMemo(() => {
        return detailsData?.data?.get_salesdetails?.map((item: any) => ({
            label: item.invmsL_SalesNo,
            value: item.invmsL_Id?.toString()
        })) || [];
    }, [detailsData]);

    const itemOptions = useMemo(() => detailsData?.data?.get_salesdetails?.map((item: any) => ({
        label: item.invmI_ItemName,
        value: item.invmI_Id?.toString()
    })) || [], [detailsData]);

    const staffOptions = useMemo(() => detailsData?.data?.get_salesdetails?.map((item: any) => ({
        label: item.employeename,
        value: item.hrmE_Id
    })) || [], [detailsData]);

    const customerOptions = useMemo(() => detailsData?.data?.get_salesdetails?.map((item: any) => ({
        label: item.invmC_CustomerName,
        value: item.invmC_Id
    })) || [], [detailsData]);

    const allStudentsOptions = useMemo(() => detailsData?.data?.get_salesdetails?.map((item: any) => ({
        label: `${item.studentname} : ${item.amsT_AdmNo}`,
        value: item.amsT_Id
    })) || [], [detailsData]); // This is from detailsData when optionflag=Student (mock logic)

    const classOptions = useMemo(() => {
        if (Array.isArray(classData?.data)) return classData.data;
        return classData?.data?.get_class || [];
    }, [classData]);
    const sectionOptions = useMemo(() => {
        if (Array.isArray(sectionData?.data)) return sectionData.data;
        return sectionData?.data?.get_Section || [];
    }, [sectionData]);
    const studentList = useMemo(() => Array.isArray(studentListData?.data) ? studentListData.data : (studentListData?.data?.get_Studentlist || []), [studentListData]);

    const studentListOptions = useMemo(() => studentList.map((item: any) => ({
        label: `${item.studentName || item.studentname} : ${item.amsT_AdmNo}`,
        value: item.amsT_Id?.toString()
    })), [studentList]);


    const handleFormSubmit = (data: InvRSalesSchema) => {
        onSubmit(data);
    };

    const handleCancel = () => {
        reset();
        onSubmit({} as InvRSalesSchema);
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <CollapsibleSection title="Report Configuration" defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">

                    {/* Report Type */}
                    <div className="space-y-3 bg-muted/20 p-4 rounded-md border">
                        <Label className="font-semibold text-primary">Report Type</Label>
                        <Controller
                            name="typeflag"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup onValueChange={(val: any) => { field.onChange(val); setValue('optionflag', undefined); }} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="All" id="r1" /><Label htmlFor="r1">All</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Overall" id="r2" /><Label htmlFor="r2">Overall</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Detailed" id="r3" /><Label htmlFor="r3">Detailed</Label></div>
                                </RadioGroup>
                            )}
                        />
                        <div className="flex space-x-4 mt-2">
                            <Controller name="showTax" control={control} render={({ field }) => (
                                <div className="flex items-center space-x-2"><Checkbox id="tax" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="tax">Tax</Label></div>
                            )} />
                            <Controller name="showDiscount" control={control} render={({ field }) => (
                                <div className="flex items-center space-x-2"><Checkbox id="disc" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="disc">Discount</Label></div>
                            )} />
                        </div>
                    </div>

                    {/* Sub Options */}
                    {(typeflag === 'Overall' || typeflag === 'Detailed') && (
                        <div className="space-y-3 bg-muted/20 p-4 rounded-md border">
                            <Label className="font-semibold text-primary">Filter By</Label>
                            <Controller
                                name="optionflag"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Item" id="sub1" /><Label htmlFor="sub1">Item</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Student" id="sub2" /><Label htmlFor="sub2">Student</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Staff" id="sub3" /><Label htmlFor="sub3">Staff</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Customer" id="sub4" /><Label htmlFor="sub4">Customer</Label></div>
                                        {typeflag === 'Detailed' && (
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="Saleno" id="sub5" /><Label htmlFor="sub5">Sale No.</Label></div>
                                        )}
                                    </RadioGroup>
                                )}
                            />
                            {errors.optionflag && <FormError>{errors.optionflag.message}</FormError>}
                        </div>
                    )}

                    {/* Individual Flag (Class/Section) for Student */}
                    {optionflag === 'Student' && (
                        <div className="space-y-3 bg-muted/20 p-4 rounded-md border">
                            <Label className="font-semibold text-primary">Student Selection Mode</Label>
                            <Controller
                                name="individualflag"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value || ""} className="flex flex-col space-y-1">
                                        {/* Implicitly "Search" if neither is selected. Add a radio for clarity? Angular uses lack of C/CS as search mode */}
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="" id="ind0" /><Label htmlFor="ind0">Direct Search</Label></div>
                                        {/* Actually Angular code has radios for C and CS. If neither selected, it's direct search. But radio group usually needs value. 
                                            Let's assume "Search" is default if none selected. We can add a "Search" radio value for UI clarity.
                                         */}
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="C" id="ind1" /><Label htmlFor="ind1">Class</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="CS" id="ind2" /><Label htmlFor="ind2">Class/Section</Label></div>
                                    </RadioGroup>
                                )}
                            />
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

                {/* Dynamic Content Based on Selection */}
                <div className="p-4 pt-0">
                    <div className="bg-background rounded-md border border-dashed p-4 space-y-4">

                        {/* 1. MultiSelects */}
                        {optionflag === 'Saleno' && (
                            <div className="space-y-2 max-w-xl">
                                <Label>Select Sale No <span className="text-destructive">*</span></Label>
                                <Controller name="salesArray" control={control} render={({ field }) => (
                                    <MultiSelect options={grnSalesOptions} onValueChange={(val) => field.onChange(detailsData?.data?.get_salesdetails?.filter((i: any) => val.includes(i.invmsL_Id.toString())))} defaultValue={field.value?.map((v: any) => v.invmsL_Id.toString())} placeholder="Select Sale No..." />
                                )} />
                                {errors.salesArray && <FormError>{errors.salesArray.message}</FormError>}
                            </div>
                        )}

                        {optionflag === 'Item' && (
                            <div className="space-y-2 max-w-xl">
                                <Label>Select Item <span className="text-destructive">*</span></Label>
                                <Controller name="itemArray" control={control} render={({ field }) => (
                                    <MultiSelect options={itemOptions} onValueChange={(val) => field.onChange(detailsData?.data?.get_salesdetails?.filter((i: any) => val.includes(i.invmI_Id.toString())))} defaultValue={field.value?.map((v: any) => v.invmI_Id.toString())} placeholder="Select Item..." />
                                )} />
                                {errors.itemArray && <FormError>{errors.itemArray.message}</FormError>}
                            </div>
                        )}

                        {/* 2. Single Selects */}
                        {optionflag === 'Staff' && (
                            <div className="space-y-2 max-w-xl">
                                <Label>Select Staff <span className="text-destructive">*</span></Label>
                                <Controller name="singleStaffId" control={control} render={({ field }) => (
                                    <GenericCombobox options={staffOptions} value={field.value} onChange={field.onChange} placeholder="Staff" />
                                )} />
                                {errors.singleStaffId && <FormError>{errors.singleStaffId.message}</FormError>}
                            </div>
                        )}

                        {optionflag === 'Customer' && (
                            <div className="space-y-2 max-w-xl">
                                <Label>Select Customer <span className="text-destructive">*</span></Label>
                                <Controller name="singleCustomerId" control={control} render={({ field }) => (
                                    <GenericCombobox options={customerOptions} value={field.value} onChange={field.onChange} placeholder="Customer" />
                                )} />
                                {errors.singleCustomerId && <FormError>{errors.singleCustomerId.message}</FormError>}
                            </div>
                        )}

                        {/* 3. Student Complex */}
                        {optionflag === 'Student' && (
                            <div className="space-y-4">
                                {/* Direct Search */}
                                {(!individualflag || individualflag === '') && (
                                    <div className="space-y-2 max-w-xl">
                                        <Label>Student Name <span className="text-destructive">*</span></Label>
                                        <Controller name="singleStudentId" control={control} render={({ field }) => (
                                            <GenericCombobox options={allStudentsOptions} value={field.value} onChange={field.onChange} placeholder="Student" />
                                        )} />
                                        {errors.singleStudentId && <FormError>{errors.singleStudentId.message}</FormError>}
                                    </div>
                                )}

                                {/* Class Selection */}
                                {(individualflag === 'C' || individualflag === 'CS') && (
                                    <div className="space-y-2 max-w-xl">
                                        <Label>Class <span className="text-destructive">*</span></Label>
                                        <Controller name="classId" control={control} render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                                                <SelectContent>
                                                    {classOptions.map((c: any) => <SelectItem key={c.asmcL_Id} value={c.asmcL_Id.toString()}>{c.asmcL_ClassName}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )} />
                                        {errors.classId && <FormError>{errors.classId.message}</FormError>}
                                    </div>
                                )}

                                {/* Section Selection */}
                                {individualflag === 'CS' && classId && (
                                    <div className="space-y-2 max-w-xl">
                                        <Label>Section <span className="text-destructive">*</span></Label>
                                        <Controller name="sectionId" control={control} render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                                                <SelectContent>
                                                    {sectionOptions.map((s: any) => <SelectItem key={s.asmS_Id} value={s.asmS_Id.toString()}>{s.asmC_SectionName}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )} />
                                        {errors.sectionId && <FormError>{errors.sectionId.message}</FormError>}
                                    </div>
                                )}

                                {/* Student List (Multi Select) */}
                                {(individualflag === 'C' || individualflag === 'CS') && studentListOptions.length > 0 && (
                                    <div className="space-y-2 max-w-xl">
                                        <Label>Select Students <span className="text-destructive">*</span></Label>
                                        <Controller name="studentArray" control={control} render={({ field }) => (
                                            <MultiSelect options={studentListOptions} onValueChange={(val) => field.onChange(studentList.filter((s: any) => val.includes(s.amsT_Id.toString())))} defaultValue={field.value?.map((v: any) => v.amsT_Id.toString())} placeholder="Select Students..." />
                                        )} />
                                        {errors.studentArray && <FormError>{errors.studentArray.message}</FormError>}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                <div className="flex justify-center gap-4 p-4 border-t bg-muted/10">
                    <Button type="submit" size="lg" className="w-32" isLoading={isLoading}><FileText className="mr-2 h-4 w-4" /> Report</Button>
                    <Button type="button" variant="destructive" size="lg" className="w-32" onClick={handleCancel}><RefreshCcw className="mr-2 h-4 w-4" /> Reset</Button>
                </div>

            </CollapsibleSection>
        </form>
    );
}
