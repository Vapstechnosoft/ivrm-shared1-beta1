'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Label, FormError } from '@/components/ui/extension/field';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { applyTransferCertificate } from '../actions';
import { useState } from 'react';
import { Loader2, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
    ASTC_Reason: z.string().min(1, 'Reason is required'),
    ASTC_Date: z.date({
        required_error: "Date is required",
    }),
});

export default function TransferCertificateForm({ onClose, onSuccess }: { onClose?: () => void, onSuccess?: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ASTC_Reason: '',
            ASTC_Date: new Date(),
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Convert date to string format expected by API
            const payload = {
                ...values,
                ASTC_Date: values.ASTC_Date.toISOString(),
            };

            const result = await applyTransferCertificate(payload);
            if (result && result.returnval === true) {
                toast.success('Transfer Certificate applied successfully');
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            } else {
                toast.error(result?.message || 'Failed to apply');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ASTC_Date">Apply Date</Label>
                    <Controller
                        control={control}
                        name="ASTC_Date"
                        render={({ field }) => (
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
                                    <DatePickerWithYear
                                        mode="single"
                                        selected={field.value}
                                        onDayClick={(day) => field.onChange(day)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.ASTC_Date && <FormError>{errors.ASTC_Date.message}</FormError>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <InputTextarea
                        label="Reason"
                        id="ASTC_Reason"
                        placeholder="Reason for transfer"
                        {...register("ASTC_Reason")}
                        error={errors.ASTC_Reason?.message}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                {onClose && (
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Apply
                </Button>
            </div>
        </form>
    );
}
