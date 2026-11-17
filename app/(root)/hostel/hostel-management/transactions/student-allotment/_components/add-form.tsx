'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { studentAllotmentSchema, StudentAllotmentSchema } from '@/schemas/hostel/transactions/student-allotment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormError, Label } from '@/components/ui/extension/field';
import { getRoomDetails, getStudentInfo, saveStudentAllotment } from '@/server/hostel/hostel-management/transactions/student-allotment';

interface AddFormProps {
    dropdowns: {
        yearlist: any[];
        hostel_list: any[];
        roomcatgry_list: any[];
        room_list: any[];
        dropdowns?: any;
    };
    onSuccess?: () => void;
}

export default function StudentAllotmentForm({ dropdowns, onSuccess }: AddFormProps) {
    const methods = useForm<StudentAllotmentSchema>({
        resolver: zodResolver(studentAllotmentSchema),
        mode: 'onSubmit',
        defaultValues: {
            HLHSALT_Id: 0,
            ASMAY_Id: 0,
            HLHSALT_AllotmentDate: new Date(),
            HLMH_Id: 0,
            AMST_Id: 0,
            ASMCL_Id: 0,
            ASMS_Id: 0,
            HLMRCA_Id: 0,
            HRMRM_Id: 0,
            HLHSALT_NoOfBeds: 0,
            HLHSALT_AllotRemarks: '',
            HLHSREQC_VegMessFlg: false,
            HLHSREQC_NonVegMessFlg: false,
            HLHSREQC_ACRoomFlg: false,
            HLHSREQC_SingleRoomFlg: false,
            HLHSALT_VacateFlg: false,
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

    const [students, setStudents] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const selectedHostel = useWatch({ control, name: 'HLMH_Id' });
    const selectedStudentId = useWatch({ control, name: 'AMST_Id' });
    const selectedRoomId = useWatch({ control, name: 'HRMRM_Id' });

    // Load Students when Hostel Changes
    useEffect(() => {
        if (!selectedHostel) return;

        let mounted = true;
        (async () => {
            setLoadingStudents(true);
            try {
                const res = await getStudentInfo(Number(selectedHostel));
                if (mounted) {
                    setStudents(res.data?.housewise_studentList || []);
                    // Reset student dependent fields
                    setValue('AMST_Id', 0);
                    setValue('ASMCL_Id', 0);
                    setValue('ASMS_Id', 0);
                    setValue('HLMRCA_Id', 0);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load students');
            } finally {
                if (mounted) setLoadingStudents(false);
            }
        })();
        return () => { mounted = false; };
    }, [selectedHostel, setValue]);

    // Update details when Student Selected
    useEffect(() => {
        if (!selectedStudentId || students.length === 0) return;

        const student = students.find(s => s.AMST_Id === Number(selectedStudentId));
        if (student) {
            setValue('ASMCL_Id', student.ASMCL_Id);
            setValue('ASMS_Id', student.ASMS_Id);
            setValue('HLMRCA_Id', student.HLMRCA_Id);
            setValue('HLHSREQC_VegMessFlg', student.HLHSREQC_VegMessFlg === true);
            setValue('HLHSREQC_NonVegMessFlg', student.HLHSREQC_NonVegMessFlg === true);
            setValue('HLHSREQC_ACRoomFlg', student.HLHSREQC_ACRoomFlg === true);
            setValue('HLHSREQC_SingleRoomFlg', student.HLHSREQC_SingleRoomFlg === true);
        }
    }, [selectedStudentId, students, setValue]);

    // Load Room Details when Room Selected
    useEffect(() => {
        if (!selectedRoomId) return;
        (async () => {
            const res = await getRoomDetails(Number(selectedRoomId));
            if (res.data) {
                setValue('HLHSALT_NoOfBeds', res.data.hrmrM_BedCapacity);
            }
        })();
    }, [selectedRoomId, setValue]);

    const onSubmit = async (data: StudentAllotmentSchema) => {
        try {
            const res = await saveStudentAllotment(data);
            if (res.data?.returnval) {
                toast.success(res.message || 'Saved successfully');
                reset();
                onSuccess?.();
            } else {
                toast.error(res.message || 'Failed to save');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hostel Allotment For Student</CardTitle>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Academic Year */}
                            <Controller
                                control={control}
                                name="ASMAY_Id"
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Academic Year</Label>
                                        <Select
                                            value={String(field.value || '')}
                                            onValueChange={(v) => field.onChange(Number(v))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dropdowns.yearlist.map((y: any) => (
                                                    <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                                        {y.asmaY_Year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* Allotment Date */}
                            <Controller
                                control={control}
                                name="HLHSALT_AllotmentDate"
                                render={({ field, fieldState }) => (
                                    <div className="flex flex-col">
                                        <Label>Allotment Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* Hostel */}
                            <Controller
                                control={control}
                                name="HLMH_Id"
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Hostel</Label>
                                        <Select
                                            value={String(field.value || '')}
                                            onValueChange={(v) => field.onChange(Number(v))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Hostel" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dropdowns.hostel_list.map((h: any) => (
                                                    <SelectItem key={h.hlmH_Id} value={String(h.hlmH_Id)}>
                                                        {h.hlmH_Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* Student */}
                            <Controller
                                control={control}
                                name="AMST_Id"
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Student Name</Label>
                                        <Select
                                            value={String(field.value || '')}
                                            onValueChange={(v) => field.onChange(Number(v))}
                                            disabled={!selectedHostel || loadingStudents}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={loadingStudents ? "Loading..." : "Select Student"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {students.map((s: any) => (
                                                    <SelectItem key={s.AMST_Id} value={String(s.AMST_Id)}>
                                                        {s.studentName} : {s.AMST_AdmNo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* Class (Readonly) */}
                            <Controller
                                control={control}
                                name="ASMCL_Id"
                                render={({ field }) => (
                                    <div>
                                        <Label>Class</Label>
                                        <div className="p-2 border rounded-md bg-muted/50 text-sm h-10 flex items-center">
                                            {dropdowns.dropdowns?.classlist?.find((c: any) => c.asmcL_Id === field.value)?.asmcL_ClassName || 'N/A'}
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Section (Readonly) */}
                            <Controller
                                control={control}
                                name="ASMS_Id"
                                render={({ field }) => (
                                    <div>
                                        <Label>Section</Label>
                                        <div className="p-2 border rounded-md bg-muted/50 text-sm h-10 flex items-center">
                                            {dropdowns.dropdowns?.sectionlist?.find((s: any) => s.asmS_Id === field.value)?.asmC_SectionName || 'N/A'}
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Room Category */}
                            <Controller
                                control={control}
                                name="HLMRCA_Id"
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Room Category</Label>
                                        <Select value={String(field.value || '')} disabled>
                                            <SelectTrigger className="bg-muted/50">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dropdowns.roomcatgry_list.map((r: any) => (
                                                    <SelectItem key={r.hlmrcA_Id} value={String(r.hlmrcA_Id)}>
                                                        {r.hlmrcA_RoomCategory}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* Room No */}
                            <Controller
                                control={control}
                                name="HRMRM_Id"
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Room No</Label>
                                        <Select
                                            value={String(field.value || '')}
                                            onValueChange={(v) => field.onChange(Number(v))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Room" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dropdowns.room_list.map((r: any) => (
                                                    <SelectItem key={r.hrmrM_Id} value={String(r.hrmrM_Id)}>
                                                        {r.hrmrM_RoomNo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            {/* No of Beds (Readonly) */}
                            <Controller
                                control={control}
                                name="HLHSALT_NoOfBeds"
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>No of Bed</Label>
                                        <Input {...field} disabled className="bg-muted/50" />
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Flags */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-lg">
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Mess Type</Label>
                                <div className="flex flex-row space-x-6">
                                    <Controller
                                        control={control}
                                        name="HLHSREQC_VegMessFlg"
                                        render={({ field }) => (
                                            <div className="flex flex-row items-center space-x-2 space-y-0">
                                                <Checkbox checked={field.value} disabled />
                                                <Label className="font-normal">Veg</Label>
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="HLHSREQC_NonVegMessFlg"
                                        render={({ field }) => (
                                            <div className="flex flex-row items-center space-x-2 space-y-0">
                                                <Checkbox checked={field.value} disabled />
                                                <Label className="font-normal">Non-Veg</Label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Room Type</Label>
                                <div className="flex flex-row space-x-6">
                                    <Controller
                                        control={control}
                                        name="HLHSREQC_ACRoomFlg"
                                        render={({ field }) => (
                                            <div className="flex flex-row items-center space-x-2 space-y-0">
                                                <Checkbox checked={field.value} disabled />
                                                <Label className="font-normal">AC</Label>
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="HLHSREQC_SingleRoomFlg"
                                        render={({ field }) => (
                                            <div className="flex flex-row items-center space-x-2 space-y-0">
                                                <Checkbox checked={field.value} disabled />
                                                <Label className="font-normal">Single</Label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Remarks */}
                        <Controller
                            control={control}
                            name="HLHSALT_AllotRemarks"
                            render={({ field, fieldState }) => (
                                <div>
                                    <Label>Allot Remarks</Label>
                                    <Textarea {...field} placeholder="Enter remarks" />
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
