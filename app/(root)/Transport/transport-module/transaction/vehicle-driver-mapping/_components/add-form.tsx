'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterDriver, useMasterSession, useMasterVehicle } from '@/hooks/transport/transportmodule/usemasters';
import { useDriverDropDown, useSessionDropDown, useVehicleDriverMapping, useVehicleDropDown } from '@/hooks/transport/transportmodule/usetransaction';
import { cn } from '@/lib/utils';
import { vehicleDriverMappingSchema } from '@/schemas/transport/transaction';
import { saveVehicleDriverMapping } from '@/server/transport/transport-module/transaction/vehicle-driver-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface AddFormProps {
    onClose?: () => void;
}

const formSchema = vehicleDriverMappingSchema.addOrUpdate;

export default function AddForm({ onClose }: AddFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { refetchAll } = useVehicleDriverMapping();

    // Fetch master data directly in the form
    const { data: vehicleData } = useVehicleDropDown();
    const { data: driverData } = useDriverDropDown();
    const { data: sessionData } = useSessionDropDown();

    const vehicles = Array.isArray(vehicleData) ? vehicleData : vehicleData?.data || [];
    const drivers = Array.isArray(driverData) ? driverData : driverData?.data || [];
    const sessions = Array.isArray(sessionData) ? sessionData : sessionData?.data || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            trmV_Id: undefined,
            trmD_Id: undefined,
            trmS_Id: undefined,
            trmS_Flag: 'PickUp', // Default to PickUp as per legacy logic seems to imply flags
            trvD_Date: new Date().toISOString()
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {

            console.log("vehicledrivermapping", values);

            const response = await saveVehicleDriverMapping(values);

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                onClose?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Vehicle */}
                    <FormField
                        control={form.control}
                        name='trmV_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehicle <span className='text-destructive'>*</span></FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Vehicle' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {vehicles.map((item: any) => (
                                            <SelectItem key={item.trmV_Id} value={item.trmV_Id.toString()}>
                                                {item.trmV_VehicleNo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Driver */}
                    <FormField
                        control={form.control}
                        name='trmD_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Driver <span className='text-destructive'>*</span></FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Driver' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {drivers.map((item: any) => (
                                            <SelectItem key={item.trmD_Id} value={item.trmD_Id.toString()}>
                                                {item.trmD_DriverName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date */}
                    <FormField
                        control={form.control}
                        name='trvD_Date'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>Date <span className='text-destructive'>*</span></FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    <span>{new Date(field.value).toLocaleDateString()}</span>
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                        <Calendar
                                            mode='single'
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date?.toISOString())}
                                            disabled={(date) =>
                                                date < new Date('1900-01-01')
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Session */}
                    <FormField
                        control={form.control}
                        name='trmS_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Session Name <span className='text-destructive'>*</span></FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Session' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sessions.map((item: any) => (
                                            <SelectItem key={item.trmS_Id} value={item.trmS_Id.toString()}>
                                                {item.trmS_SessionName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pickup/Drop Flag - Optional/Hidden if unused or inferred */}
                    <FormField
                        control={form.control}
                        name='trmS_Flag'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PickUp / Drop</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Flag" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PickUp">PickUp</SelectItem>
                                        <SelectItem value="Drop">Drop</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <div className='flex justify-end space-x-2'>
                    <Button type='button' variant='outline' onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type='submit' disabled={isLoading}>
                        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        <Save className='mr-2 h-4 w-4' />
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
}
