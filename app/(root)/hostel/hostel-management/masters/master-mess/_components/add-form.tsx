'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { useFormContext } from '@/components/ui/form/form-provider';
import { FormInput } from '@/components/ui/form/form-input';
import { Checkbox } from '@/components/ui/checkbox';
import { MasterMessSchema, MasterMessSchemaType } from '@/schemas/hostel/master-mess.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormTimePicker } from '@/components/ui/form/form-time-picker';
import { saveMess } from '@/server/hostel/hostel-management/masters/mess';

interface AddMasterMessFormProps {
    onSuccess: () => void;
}

export default function AddMasterMessForm({ onSuccess }: AddMasterMessFormProps) {
    const { closeAddForm } = useFormContext();

    const form = useForm<MasterMessSchemaType>({
        resolver: zodResolver(MasterMessSchema),
        defaultValues: {
            hlmM_Name: '',
            hlmM_VegFlg: false,
            hlmM_NonVegFlg: false,
            hlmM_BFSStartTime: '',
            hlmM_BFSEndTime: '',
            hlmM_LNStartTime: '',
            hlmM_LNEndTime: '',
            hlmM_LNTSStartTime: '',
            hlmM_LNTSEndTime: '',
            hlmM_DNSStartTime: '',
            hlmM_DNSEndTime: '',
        },
    });

    const { control, handleSubmit, watch, formState: { isSubmitting } } = form;

    const onSubmit = async (data: MasterMessSchemaType) => {
        const result = await saveMess(data);
        if (result.success) {
            toast.success(result.message);
            onSuccess();
            closeAddForm();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="p-4 bg-background rounded-lg border">
            {/* Remove the outer form tag and spread form props directly */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <FormInput
                            control={control}
                            name="hlmM_Name"
                            label="Mess Name"
                            placeholder="Enter Mess Name"
                            required
                        />
                    </div>
                    <div className="space-y-4">
                        <Label>Flag Type</Label>
                        <div className="flex gap-6 pt-2">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="hlmM_VegFlg"
                                    render={({ field }) => (
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <span>Veg</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="hlmM_NonVegFlg"
                                    render={({ field }) => (
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <span>Non-Veg</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormTimePicker control={control} name="hlmM_BFSStartTime" label="Breakfast - Start Time" />
                            <FormTimePicker
                                control={control}
                                name="hlmM_BFSEndTime"
                                label="Breakfast - End Time"
                                disabled={!watch('hlmM_BFSStartTime')}
                                min={watch('hlmM_BFSStartTime') || undefined}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormTimePicker control={control} name="hlmM_LNStartTime" label="Lunch - Start Time" />
                            <FormTimePicker
                                control={control}
                                name="hlmM_LNEndTime"
                                label="Lunch - End Time"
                                disabled={!watch('hlmM_LNStartTime')}
                                min={watch('hlmM_LNStartTime') || undefined}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormTimePicker control={control} name="hlmM_LNTSStartTime" label="Tea/Coffee - Start Time" />
                            <FormTimePicker
                                control={control}
                                name="hlmM_LNTSEndTime"
                                label="Tea/Coffee - End Time"
                                disabled={!watch('hlmM_LNTSStartTime')}
                                min={watch('hlmM_LNTSStartTime') || undefined}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormTimePicker control={control} name="hlmM_DNSStartTime" label="Dinner - Start Time" />
                            <FormTimePicker
                                control={control}
                                name="hlmM_DNSEndTime"
                                label="Dinner - End Time"
                                disabled={!watch('hlmM_DNSStartTime')}
                                min={watch('hlmM_DNSStartTime') || undefined}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-4 border-t mt-4">
                    <Button type="submit" disabled={isSubmitting} className="w-32">
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                    <Button type="button" variant="destructive" onClick={closeAddForm} className="w-32">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}