'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useDriverDropDown,
    useSessionDropDown,
    useVehicleDriverMapping,
    useVehicleDropDown
} from '@/hooks/transport/transportmodule/usetransaction';
import { cn } from '@/lib/utils';
import { vehicleDriverMappingSchema } from '@/schemas/transport/transaction';
import { saveVehicleDriverMapping } from '@/server/transport/transport-module/transaction/vehicle-driver-mapping';
import type { IVehicleDriverMapping } from '@/types/transport/transport-module/transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface UpdateFormProps {
    onClose: () => void;
    selectedRow: IVehicleDriverMapping;
}

const formSchema = vehicleDriverMappingSchema.addOrUpdate;

export default function UpdateForm({ onClose, selectedRow: row }: UpdateFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { refetchAll } = useVehicleDriverMapping();

    // Fetch master data directly in the form
    const { data: vehicleData, isLoading: vehicleLoading } = useVehicleDropDown();
    const { data: driverData, isLoading: driverLoading } = useDriverDropDown();
    const { data: sessionData, isLoading: sessionLoading } = useSessionDropDown();

    const vehicles = useMemo(() => (Array.isArray(vehicleData) ? vehicleData : vehicleData?.data || []), [vehicleData]);
    const drivers = useMemo(() => (Array.isArray(driverData) ? driverData : driverData?.data || []), [driverData]);
    const sessions = useMemo(() => (Array.isArray(sessionData) ? sessionData : sessionData?.data || []), [sessionData]);

    const isDataLoading = vehicleLoading || driverLoading || sessionLoading;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            trvD_Id: row?.trvD_Id,
            trmV_Id: row?.trmV_Id || 0,
            trmD_Id: row?.trmD_Id || 0,
            trmS_Id: row?.trmS_Id || 0,
            trmS_Flag: row?.trmS_Flag || 'PickUp',
            trvD_Date: row?.trvD_Date ? new Date(row.trvD_Date).toISOString() : new Date().toISOString(),
            trmV_VehicleNo: row?.trmV_VehicleNo,
            trmD_DriverName: row?.trmD_DriverName,
            trmS_SessionName: row?.trmS_SessionName
        }
    });

    const { reset } = form;

    useEffect(() => {
        if (row && !isDataLoading) {
            let flagValue = row.trmS_Flag;
            if (flagValue === 'Pick Up' || flagValue === 'Pickup') flagValue = 'PickUp';

            // Resolve Vehicle ID: Direct ID -> Casing variants -> Lookup by No
            let vehicleId = row.trmV_Id || (row as any).trmV_Id || (row as any).TrmV_Id || (row as any).TRMV_Id || 0;
            if (!vehicleId && row.trmV_VehicleNo && vehicles.length > 0) {
                const match = vehicles.find((v: any) => v.trmV_VehicleNo === row.trmV_VehicleNo);
                if (match) vehicleId = match.trmV_Id;
            }

            // Resolve Driver ID: Direct ID -> Casing variants -> Lookup by Name
            let driverId = row.trmD_Id || (row as any).trmD_Id || (row as any).TrmD_Id || (row as any).TRMD_Id || 0;
            if (!driverId && row.trmD_DriverName && drivers.length > 0) {
                const match = drivers.find((d: any) => d.trmD_DriverName === row.trmD_DriverName);
                if (match) driverId = match.trmD_Id;
            }

            reset({
                trvD_Id: row.trvD_Id,
                trmV_Id: Number(vehicleId),
                trmD_Id: Number(driverId),
                trmS_Id: row.trmS_Id, // Session seems to work fine directly
                trmS_Flag: flagValue || 'PickUp',

                trvD_Date: new Date().toISOString(),
                trmV_VehicleNo: row.trmV_VehicleNo,
                trmD_DriverName: row.trmD_DriverName,
                trmS_SessionName: row.trmS_SessionName
            });
        }
    }, [row, reset, vehicles, drivers, isDataLoading]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const response = await saveVehicleDriverMapping(values);
            if (response.success) {
                toast.success(response.message);
                refetchAll();
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isDataLoading) {
        return (
            <div className='flex h-60 w-full items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                <span className='ml-2'>Loading data...</span>
            </div>
        );
    }

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
                                <FormLabel>
                                    Vehicle <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Select
                                    key={field.value} // Force remount on value change
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Vehicle' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {vehicles.map((item: any) => (
                                            <SelectItem key={item.trmV_Id} value={String(item.trmV_Id)}>
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
                                <FormLabel>
                                    Driver <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Select
                                    key={field.value} // Force remount on value change
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Driver' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {drivers.map((item: any) => (
                                            <SelectItem key={item.trmD_Id} value={String(item.trmD_Id)}>
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
                                <FormLabel>
                                    Date <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}>
                                                {field.value && new Date(field.value).toString() !== 'Invalid Date' ? (
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
                                            disabled={(date) => date < new Date('1900-01-01')}
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
                                <FormLabel>
                                    Session Name <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Select
                                    key={field.value} // Force remount on value change
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Session' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sessions.map((item: any) => (
                                            <SelectItem key={item.trmS_Id} value={String(item.trmS_Id)}>
                                                {item.trmS_SessionName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pickup/Drop Flag */}
                    <FormField
                        control={form.control}
                        name='trmS_Flag'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PickUp / Drop</FormLabel>
                                <Select key={field.value} onValueChange={field.onChange} value={field.value || 'PickUp'}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Flag' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='PickUp'>PickUp</SelectItem>
                                        <SelectItem value='Drop'>Drop</SelectItem>
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
                        Update
                    </Button>
                </div>
            </form>
        </Form>
    );
}
