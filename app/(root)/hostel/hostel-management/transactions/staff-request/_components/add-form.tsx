'use client';

import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffRequestSchema, StaffRequestValues } from '@/schemas/hostel/transactions/hostel-requests.schema';
import { FormError, Label } from '@/components/ui/extension/field';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { DateField } from '@/components/ui/dateField';
import { getStaffRequestLoadData, saveStaffRequest } from '@/server/hostel/hostel-management/transactions/staff-request-actions';

export default function StaffRequestForm({
    onSaveSuccess,
    editData
}: {
    onSaveSuccess: () => void,
    editData?: any
}) {
    const [loading, setLoading] = useState(false);
    const [hostels, setHostels] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [staffProfile, setStaffProfile] = useState<any>(null);

    const form = useForm<StaffRequestValues>({
        resolver: zodResolver(staffRequestSchema),
        defaultValues: {
            HLHSTREQ_Id: 0,
            HLHSTREQ_RequestDate: new Date(),
            HLHSTREQ_ACRoomFlg: false,
            HLHSTREQ_SingleRoomFlg: false,
            HLHSTREQ_VegMessFlg: false,
            HLHSTREQ_NonVegMessFlg: false,
        },
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (editData) {
            form.reset({
                HLHSTREQ_Id: editData.HLHSTREQ_Id,
                HLHSTREQ_RequestDate: new Date(editData.HLHSTREQ_RequestDate),
                HLMH_Id: editData.HLMH_Id.toString(),
                HLMRCA_Id: editData.HLMRCA_Id.toString(),
                HLHSTREQ_ACRoomFlg: editData.HLHSTREQ_ACRoomFlg,
                HLHSTREQ_SingleRoomFlg: editData.HLHSTREQ_SingleRoomFlg,
                HLHSTREQ_VegMessFlg: editData.HLHSTREQ_VegMessFlg,
                HLHSTREQ_NonVegMessFlg: editData.HLHSTREQ_NonVegMessFlg,
                HLHSTREQ_Remarks: editData.HLHSTREQ_Remarks || '',
            });
        }
    }, [editData]);

    async function loadData() {
        const response = await getStaffRequestLoadData();
        if (response.success && response.data) {
            setHostels(response.data.hostel_list || []);
            setCategories(response.data.room_list || []);
            if (response.data.staff_wisedata?.length > 0) {
                setStaffProfile(response.data.staff_wisedata[0]);
            }
        }
    }

    async function onSubmit(values: StaffRequestValues) {
        setLoading(true);
        const payload = {
            ...values,
            HLHSTREQ_RequestDate: format(values.HLHSTREQ_RequestDate, 'yyyy-MM-dd'),
            HLMH_Id: parseInt(values.HLMH_Id),
            HLMRCA_Id: parseInt(values.HLMRCA_Id),
        };

        const result = await saveStaffRequest(payload);
        if (result?.success) {
            toast.success("Request saved successfully!");
            onSaveSuccess();
            form.reset();
        } else {
            toast.error(result?.message || "Failed to save request");
        }
        setLoading(false);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hostel Staff Request</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/20 rounded-lg">
                    <p><strong>Name:</strong> {staffProfile?.empName || '-'}</p>
                    <p><strong>Dept:</strong> {staffProfile?.HRMD_DepartmentName || '-'}</p>
                    <p><strong>Code:</strong> {staffProfile?.HRME_EmployeeCode || '-'}</p>
                    <p><strong>Desig:</strong> {staffProfile?.HRMDES_DesignationName || '-'}</p>
                </div>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name="HLMH_Id"
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>Hostel</Label>
                                        <CustomMultiSelectBox
                                            options={hostels.map(h => ({ label: h.hlmH_Name, value: h.hlmH_Id.toString() }))}
                                            value={field.value ? [field.value] : []}
                                            onChange={(vals) => field.onChange(vals.length > 0 ? vals[vals.length - 1] : "")}
                                        />
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
                                        <CustomMultiSelectBox
                                            options={categories.map(c => ({ label: c.hlmrcA_RoomCategory, value: c.hlmrcA_Id.toString() }))}
                                            value={field.value ? [field.value] : []}
                                            onChange={(vals) => field.onChange(vals.length > 0 ? vals[vals.length - 1] : "")}
                                        />
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="HLHSTREQ_RequestDate"
                                render={({ field, fieldState }) => (
                                    <DateField
                                        label="Request Date"
                                        field={field}
                                        fieldState={fieldState}
                                        disabled
                                        outputFormat="date"
                                    />
                                )}
                            />

                            <div className="grid grid-cols-2 gap-2 pt-8">
                                <Controller
                                    control={form.control}
                                    name="HLHSTREQ_VegMessFlg"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2 space-y-0">
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            <Label>Veg Mess</Label>
                                        </div>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="HLHSTREQ_NonVegMessFlg"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2 space-y-0">
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            <Label>Non-Veg Mess</Label>
                                        </div>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="HLHSTREQ_ACRoomFlg"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2 space-y-0">
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            <Label>AC Room</Label>
                                        </div>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="HLHSTREQ_SingleRoomFlg"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2 space-y-0">
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            <Label>Single Room</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <Controller
                            control={form.control}
                            name="HLHSTREQ_Remarks"
                            render={({ field, fieldState }) => (
                                <div>
                                    <Label>Remarks</Label>
                                    <Textarea {...field} />
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button>
                            <Button type="submit" disabled={loading}>Submit Request</Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
