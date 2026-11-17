'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { staffAllotmentSchema, type StaffAllotmentSchema } from '@/schemas/hostel/transactions/staff-allotment.schema';
import { getStaffInfo, getRoomDetails, saveStaffAllotment } from '@/server/hostel/hostel-management/transactions/staff-allotment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface AddFormProps {
    dropdowns: {
        hostel_list: any[];
        roomcatgry_list: any[];
        deptlist: any[];
        desglist: any[];
        room_list: any[];
    };
    onSuccess?: () => void;
}

export default function StaffAllotmentForm({ dropdowns, onSuccess }: AddFormProps) {
    const methods = useForm<StaffAllotmentSchema>({
        resolver: zodResolver(staffAllotmentSchema),
        mode: 'onSubmit',
        defaultValues: {
            HLHSTALT_Id: 0,
            HLHSTALT_AllotmentDate: new Date(),
            HLMH_Id: 0,
            HRME_Id: 0,
            HRMD_Id: 0,
            HRMDES_Id: 0,
            HLMRCA_Id: 0,
            HRMRM_Id: 0,
            HLHSTALT_NoOfBeds: 0,
            HLHSTALT_AllotRemarks: '',
            HLHSTREQC_VegMessFlg: false,
            HLHSTREQC_NonVegMessFlg: false,
            HLHSTREQC_ACRoomFlg: false,
            HLHSTREQC_SingleRoomFlg: false,
            HLHSTALT_VacateFlg: false,
        }
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors, isSubmitting }
    } = methods;

    const [staffList, setStaffList] = useState<any[]>([]);
    const [loadingStaff, setLoadingStaff] = useState(false);

    const selectedHostel = useWatch({ control, name: 'HLMH_Id' });
    const selectedStaffId = useWatch({ control, name: 'HRME_Id' });
    const selectedRoomId = useWatch({ control, name: 'HRMRM_Id' });

    // Load Staff when Hostel Changes
    useEffect(() => {
        if (!selectedHostel) return;

        let mounted = true;
        (async () => {
            setLoadingStaff(true);
            try {
                const res = await getStaffInfo({ HLMH_Id: Number(selectedHostel) });
                if (mounted && res) {
                    setStaffList(res.data?.housewise_studentList || []);
                    // Reset staff dependent fields
                    setValue('HRME_Id', 0);
                    setValue('HRMD_Id', 0);
                    setValue('HRMDES_Id', 0);
                    setValue('HLMRCA_Id', 0);
                    setValue('HRMRM_Id', 0);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load staff list');
            } finally {
                if (mounted) setLoadingStaff(false);
            }
        })();
        return () => { mounted = false; };
    }, [selectedHostel, setValue]);

    // Update details when Staff Selected
    useEffect(() => {
        if (!selectedStaffId || staffList.length === 0) return;

        const staff = staffList.find(s => s.HRME_Id === Number(selectedStaffId));
        if (staff) {
            setValue('HRMD_Id', staff.HRMD_Id);
            setValue('HRMDES_Id', staff.HRMDES_Id);
            setValue('HLMRCA_Id', staff.HLMRCA_Id);
            // Pre-fill fields if available
            setValue('HLHSTREQC_VegMessFlg', staff.HLHSTREQC_VegMessFlg === true);
            setValue('HLHSTREQC_NonVegMessFlg', staff.HLHSTREQC_NonVegMessFlg === true);
            setValue('HLHSTREQC_ACRoomFlg', staff.HLHSTREQC_ACRoomFlg === true);
            setValue('HLHSTREQC_SingleRoomFlg', staff.HLHSTREQC_SingleRoomFlg === true);

            // If room is pre-assigned in request
            if (staff.hrmrM_Id) {
                setValue('HRMRM_Id', staff.hrmrM_Id);
            }
        }
    }, [selectedStaffId, staffList, setValue]);

    // Load Room Details when Room Selected
    useEffect(() => {
        if (!selectedRoomId) return;
        (async () => {
            const res = await getRoomDetails({ HRMRM_Id: Number(selectedRoomId) });
            if (res) {
                // Note: Legacy sets bed capacity to state. We set to form field.
                //setValue('HLHSTALT_NoOfBeds', res?.hrmrM_BedCapacity);
            }
        })();
    }, [selectedRoomId, setValue]);

    const onSubmit = async (data: StaffAllotmentSchema) => {
        try {
            const res = await saveStaffAllotment(data);
            if (res.success) {
                toast.success(res.message);
                reset();
                onSuccess?.();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    return (
        <div className="w-full rounded-2xl bg-white p-6 shadow-sm border">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Hostel Allotment For Staff</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Hostel */}
                        <Controller
                            control={control}
                            name="HLMH_Id"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <Label>Hostel <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={String(field.value || '')}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Hostel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dropdowns.hostel_list?.map((h: any) => (
                                                <SelectItem key={h.hlmH_Id} value={String(h.hlmH_Id)}>
                                                    {h.hlmH_Name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.HLMH_Id && <FormError>{errors.HLMH_Id.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Allotment Date */}
                        <Controller
                            control={control}
                            name="HLHSTALT_AllotmentDate"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <Label>Allotment Date <span className="text-red-500">*</span></Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.HLHSTALT_AllotmentDate && <FormError>{errors.HLHSTALT_AllotmentDate.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Staff */}
                        <Controller
                            control={control}
                            name="HRME_Id"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <Label>Employee Name <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={String(field.value || '')}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                        disabled={!selectedHostel || loadingStaff}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingStaff ? "Loading..." : "Select Employee"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {staffList.map((s: any) => (
                                                <SelectItem key={s.HRME_Id} value={String(s.HRME_Id)}>
                                                    {s.staffname} : {s.HRME_EmployeeCode}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.HRME_Id && <FormError>{errors.HRME_Id.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Department (Readonly) */}
                        <Controller
                            control={control}
                            name="HRMD_Id"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <Label>Department</Label>
                                    <Select value={String(field.value || '')} disabled>
                                        <SelectTrigger className="bg-gray-50"><SelectValue placeholder="Department" /></SelectTrigger>
                                        <SelectContent>
                                            {dropdowns.deptlist?.map((c: any) => <SelectItem key={c.hrmD_Id} value={String(c.hrmD_Id)}>{c.hrmD_DepartmentName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        />

                        {/* Designation (Readonly) */}
                        <Controller
                            control={control}
                            name="HRMDES_Id"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <Label>Designation</Label>
                                    <Select value={String(field.value || '')} disabled>
                                        <SelectTrigger className="bg-gray-50"><SelectValue placeholder="Designation" /></SelectTrigger>
                                        <SelectContent>
                                            {dropdowns.desglist?.map((c: any) => <SelectItem key={c.hrmdeS_Id} value={String(c.hrmdeS_Id)}>{c.hrmdeS_DesignationName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        />

                        {/* Room Category */}
                        <Controller
                            control={control}
                            name="HLMRCA_Id"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <Label>Room Category <span className="text-red-500">*</span></Label>
                                    <Select value={String(field.value || '')} disabled>
                                        <SelectTrigger className="bg-gray-50"><SelectValue placeholder="Room Category" /></SelectTrigger>
                                        <SelectContent>
                                            {dropdowns.roomcatgry_list?.map((r: any) => <SelectItem key={r.hlmrcA_Id} value={String(r.hlmrcA_Id)}>{r.hlmrcA_RoomCategory}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.HLMRCA_Id && <FormError>{errors.HLMRCA_Id.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Room No */}
                        <Controller
                            control={control}
                            name="HRMRM_Id"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <Label>Room No <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={String(field.value || '')}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dropdowns.room_list?.map((r: any) => (
                                                <SelectItem key={r.hrmrM_Id} value={String(r.hrmrM_Id)}>
                                                    {r.hrmrM_RoomNo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.HRMRM_Id && <FormError>{errors.HRMRM_Id.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* No of Beds (Readonly) */}
                        <Controller
                            control={control}
                            name="HLHSTALT_NoOfBeds"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <Label>No of Bed</Label>
                                    <Input {...field} disabled className="bg-gray-50" />
                                </div>
                            )}
                        />
                    </div>

                    {/* Flags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                            <Label>Mess Type</Label>
                            <div className="flex gap-4">
                                <Controller
                                    control={control}
                                    name="HLHSTREQC_VegMessFlg"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox checked={field.value} disabled />
                                            <label className="text-sm font-medium leading-none">Veg</label>
                                        </div>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="HLHSTREQC_NonVegMessFlg"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox checked={field.value} disabled />
                                            <label className="text-sm font-medium leading-none">Non-Veg</label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Room Type</Label>
                            <div className="flex gap-4">
                                <Controller
                                    control={control}
                                    name="HLHSTREQC_ACRoomFlg"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox checked={field.value} disabled />
                                            <label className="text-sm font-medium leading-none">AC</label>
                                        </div>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="HLHSTREQC_SingleRoomFlg"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox checked={field.value} disabled />
                                            <label className="text-sm font-medium leading-none">Single</label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-1">
                        <Label>Allot Remarks</Label>
                        <Controller
                            control={control}
                            name="HLHSTALT_AllotRemarks"
                            render={({ field }) => (
                                <Textarea {...field} placeholder="Enter remarks" />
                            )}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>Save</Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
