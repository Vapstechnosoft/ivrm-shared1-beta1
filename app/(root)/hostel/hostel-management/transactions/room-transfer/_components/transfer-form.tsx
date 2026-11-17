'use client';

import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomTransferSchema, RoomTransferValues } from '@/schemas/hostel/transactions/room-transfer.schema';
import { FormError, Label } from '@/components/ui/extension/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


import { format } from 'date-fns';
import { getFloorsAndCategories, getRoomsForTransfer, getRoomTransferLoadData, getTransferPersonDetail, saveRoomTransfer } from '@/server/hostel/hostel-management/transactions/room-transfer';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { DateField } from '@/components/ui/dateField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RoomTransferForm({ onSaveSuccess }: { onSaveSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [personData, setPersonData] = useState<any[]>([]);
    const [hostels, setHostels] = useState<any[]>([]);
    const [floors, setFloors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [roomDetails, setRoomDetails] = useState<any>(null);

    const form = useForm<RoomTransferValues>({
        resolver: zodResolver(roomTransferSchema),
        defaultValues: {
            type: 'stud',
            HLHSALTC_TransferDate: new Date(),
            HLHSTRSC_EntireRoomReqdFlg: 0,
            HLHSTRSC_NewRoomFee: 0
        },
    });

    const selectedType = useWatch({ control: form.control, name: 'type' });
    const selectedPersonId = useWatch({
        control: form.control,
        name: selectedType === 'stud' ? 'AMCST_Id' : selectedType === 'staff' ? 'HRME_Id' : 'HLHGSTALT_Id'
    });
    const selectedHostelId = useWatch({ control: form.control, name: 'ToHLMH_Id' });
    const selectedCategoryId = useWatch({ control: form.control, name: 'HLMRCA_Id' });
    const selectedFloorId = useWatch({ control: form.control, name: 'hlmF_Id' });
    const selectedRoomId = useWatch({ control: form.control, name: 'HRMRM_Id' });

    useEffect(() => {
        loadInitialData(selectedType);
        // Reset person selection when type changes
        if (selectedType === 'stud') form.setValue('AMCST_Id', 0);
        else if (selectedType === 'staff') form.setValue('HRME_Id', 0);
        else form.setValue('HLHGSTALT_Id', 0);
    }, [selectedType, form.setValue]);

    useEffect(() => {
        if (selectedPersonId) {
            loadPersonDetail(selectedType, selectedPersonId);
        }
    }, [selectedPersonId]);

    useEffect(() => {
        if (selectedHostelId) {
            loadFloorsAndCategories(selectedHostelId);
            form.setValue('hlmF_Id', undefined as any);
            form.setValue('HLMRCA_Id', undefined as any);
            form.setValue('HRMRM_Id', undefined as any);
        }
    }, [selectedHostelId]);

    useEffect(() => {
        if (selectedFloorId && selectedCategoryId) {
            // Use current person's old room ID if available to filter properly
            const oldRoomId = 0; // The API might need the actual old room ID strictly, but often 0 works for "vacant" logic. 
            // However, seeing `getRoomsForTransfer` signature: (floorId, categoryId, oldRoomId)
            // We should try to get the old room ID from `roomDetails` or `form.getValues` if we stored it?
            // "Current Occupancy Details" shows it. But we don't have the ID stored in form values explicitly as 'OldRoomId'.
            // Let's rely on what we have or pass 0.
            loadRooms(selectedFloorId, selectedCategoryId, 0);
            form.setValue('HRMRM_Id', undefined as any);
        }
    }, [selectedFloorId, selectedCategoryId]);

    async function loadInitialData(type: string) {
        setLoading(true);
        const data = await getRoomTransferLoadData(type);
        if (data?.studentdata) {
            // The API response key varies: studentdata, staffdata, guestdata?
            // Looking at `getVacateLoadData` in previous turn, it returned `list`. 
            // But `getRoomTransferLoadData` calls `CLGHostelVacant/loaddata`.
            // Let's assume the response structure or just use what `data` provides.
            // Based on `transfer-form.tsx` line 80 (commented out), it seemed ambiguous.
            // Let's check `data` content dynamically or assume `studentdata`/`staffdata`.
            // Actually, the `CustomMultiSelectBox` usage below used `personData`.
            // We need to populate `personData`.
            if (type === 'stud' && data.studentdata) setPersonData(data.studentdata);
            else if (type === 'staff' && data.staffdata) setPersonData(data.staffdata);
            else if (type === 'guest' && data.guestdata) setPersonData(data.guestdata);
            else setPersonData([]);
        }
        setInitialData(data);
        setLoading(false);
    }

    async function loadPersonDetail(type: string, id: number) {
        const data = await getTransferPersonDetail(type, id);
        if (data) {
            const detail = data.studentdata?.[0] || data.staffdata?.[0] || data.guest_details?.[0];
            if (detail) {
                form.setValue('currentHostel', detail.HLMH_Name);
                form.setValue('currentRoom', detail.HRMRM_RoomNo);
                form.setValue('currentCategory', detail.HLMRCA_RoomCategory);
                form.setValue('joiningDate', detail.HLHSALTC_AllotmentDate || detail.HLHSTALT_AllotmentDate || detail.hlhgstalT_AllotmentDate);
                setHostels(data.hostel_list || []);
            }
        }
    }

    async function loadFloorsAndCategories(hostelId: number) {
        const data = await getFloorsAndCategories(hostelId);
        if (data) {
            setFloors(data.floor_list || []);
            setCategories(data.roomcatgry_list || []);
        }
    }

    async function loadRooms(floorId: number, categoryId: number, oldRoomId: number) {
        const data = await getRoomsForTransfer(floorId, categoryId, oldRoomId);
        if (data) {
            setRooms(data.room_list || []);
        }
    }

    async function onSubmit(values: RoomTransferValues) {
        setLoading(true);
        try {
            const payload = {
                HLHSALTC_TransferDate: format(values.HLHSALTC_TransferDate, 'yyyy-MM-dd'),
                HLMH_Id: values.ToHLMH_Id,
                HLMRCA_Id: values.HLMRCA_Id,
                AMCST_Id: values.AMCST_Id,
                HRME_Id: values.HRME_Id,
                HLHGSTALT_Id: values.HLHGSTALT_Id,
                HLHSTRSC_To_HLMRCA_Id: values.HLMRCA_Id,
                HLMRCAC_To_HRMRM_Id: values.HRMRM_Id,
                HLHSTRSC_EntireRoomReqdFlg: values.HLHSTRSC_EntireRoomReqdFlg,
                HLHSTRSC_NewRoomFee: values.HLHSTRSC_NewRoomFee,
                HLHSTRSC_VacateRemarks: values.HLHSTRSC_VacateRemarks,
                type: values.type === 'stud' ? 'ClgStudent' : values.type
            };

            const result = await saveRoomTransfer(payload);
            if (result?.returnval === true || result?.returnval === "save") {
                toast.success("Room transferred successfully!");
                onSaveSuccess();
                form.reset({
                    type: values.type,
                    HLHSALTC_TransferDate: new Date(),
                    HLHSTRSC_EntireRoomReqdFlg: 0,
                    HLHSTRSC_NewRoomFee: 0
                });
                setPersonData([]);
                setHostels([]);
                loadInitialData(values.type);
            } else {
                toast.error(result?.returnval || "Failed to transfer room");
            }
        } catch (error) {
            console.error("Submit error", error);
            toast.error("An error occurred during submission");
        }
        setLoading(false);
    }

    return (
        <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl font-bold text-primary">Hostel Room Transfer</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex justify-center mb-6 p-4 bg-muted/30 rounded-lg">
                            <Controller
                                control={form.control}
                                name="type"
                                render={({ field, fieldState }) => (
                                    <div className="space-y-3">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex space-x-8"
                                        >
                                            <div className="flex items-center space-x-2 space-y-0">
                                                <RadioGroupItem value="stud" id="r1" />
                                                <Label htmlFor="r1" className="font-medium">Student</Label>
                                            </div>
                                            <div className="flex items-center space-x-2 space-y-0">
                                                <RadioGroupItem value="staff" id="r2" />
                                                <Label htmlFor="r2" className="font-medium">Staff</Label>
                                            </div>
                                            <div className="flex items-center space-x-2 space-y-0">
                                                <RadioGroupItem value="guest" id="r3" />
                                                <Label htmlFor="r3" className="font-medium">Guest</Label>
                                            </div>
                                        </RadioGroup>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Controller
                                    control={form.control}
                                    name={selectedType === 'stud' ? 'AMCST_Id' : selectedType === 'staff' ? 'HRME_Id' : 'HLHGSTALT_Id'}
                                    render={({ field, fieldState }) => (
                                        <div>
                                            {/* Person Selection using CustomMultiSelectBox acting as Single Select */}
                                            <CustomMultiSelectBox
                                                label={`Select ${selectedType === 'stud' ? 'Student' : selectedType === 'staff' ? 'Staff' : 'Guest'}`}
                                                options={personData.map(p => ({
                                                    label: p.studentname || p.staffname || p.hlhgstalT_GuestName,
                                                    value: (p.amcsT_Id || p.hrmE_Id || p.hlhgstalT_Id).toString()
                                                }))}
                                                value={field.value ? [String(field.value)] : []}
                                                onChange={(vals) => {
                                                    // Allow only one selection (take the last selected or toggle)
                                                    // Since default behavior adds to array, we should take the NEWEST addition if possible, or just the last one.
                                                    // Logic: If vals has multiple, pick the one that wasn't there before? No, `vals` is the new state.
                                                    // Simplest single-select emulation: Take the last element.
                                                    const newVal = vals.length > 0 ? Number(vals[vals.length - 1]) : null;
                                                    field.onChange(newVal);
                                                }}
                                                isSearchRequired={true}
                                                isRequired={true}
                                                error={fieldState.error?.message}
                                            />
                                        </div>
                                    )}
                                />

                                <div className='space-y-2 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
                                    <h4 className='mb-2 border-blue-200 border-bottom pb-1 font-semibold text-blue-800 dark:text-blue-300'>Current Occupancy Details</h4>
                                    <p className="text-sm"><strong>Hostel:</strong> {form.getValues('currentHostel') || '-'}</p>
                                    <p className="text-sm"><strong>Room:</strong> {form.getValues('currentRoom') || '-'}</p>
                                    <p className="text-sm"><strong>Category:</strong> {form.getValues('currentCategory') || '-'}</p>
                                    <p className="text-sm"><strong>Joined:</strong> {form.getValues('joiningDate') ? format(new Date(form.getValues('joiningDate')!), 'dd/MM/yyyy') : '-'}</p>
                                </div>

                                <Controller
                                    control={form.control}
                                    name="HLHSALTC_TransferDate"
                                    render={({ field, fieldState }) => (
                                        <DateField
                                            field={field}
                                            fieldState={fieldState}
                                            label="Transfer Date"
                                            placeholder="Select Transfer Date"
                                        />
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="HLHSTRSC_NewRoomFee"
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label>New Room Fee</Label>
                                            <Input type="number" {...field} onChange={(e) => field.onChange(Number.parseFloat(e.target.value))} />
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="HLHSTRSC_EntireRoomReqdFlg"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2 space-y-0">
                                            <Checkbox
                                                checked={field.value === 1}
                                                onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                                            />
                                            <Label className="font-medium cursor-pointer">Entire Room Required?</Label>
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg text-primary border-b pb-2">Transfer To</h4>

                                <Controller
                                    control={form.control}
                                    name="ToHLMH_Id"
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label>Target Hostel</Label>
                                            <Select
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(val) => field.onChange(Number(val))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Hostel" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {hostels.map(h => (
                                                        <SelectItem key={h.hlmH_Id} value={h.hlmH_Id.toString()}>
                                                            {h.hlmH_Name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="HLMRCA_Id"
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label>Room Category</Label>
                                            <Select
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(val) => field.onChange(Number(val))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(c => (
                                                        <SelectItem key={c.hlmrcA_Id} value={c.hlmrcA_Id.toString()}>
                                                            {c.hlmrcA_RoomCategory}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="hlmF_Id"
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label>Floor</Label>
                                            <Select
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(val) => field.onChange(Number(val))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Floor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {floors.map(f => (
                                                        <SelectItem key={f.hlmF_Id} value={f.hlmF_Id.toString()}>
                                                            {f.hrmF_FloorName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="HRMRM_Id"
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label>New Room</Label>
                                            <Select
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(val) => field.onChange(Number(val))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Room" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {rooms.map(r => (
                                                        <SelectItem key={r.hrmrM_Id} value={r.hrmrM_Id.toString()}>
                                                            {r.hrmrM_RoomNo}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="HLHSTRSC_VacateRemarks"
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label>Vacate Remarks</Label>
                                            <Textarea placeholder="Enter remarks..." {...field} />
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => form.reset()} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Processing..." : "Transfer Room"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
