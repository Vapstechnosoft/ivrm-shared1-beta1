'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { gpsLocationAttendanceSchema } from '@/schemas/hrms/attendance-management-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, RefreshCw, Save, X } from 'lucide-react';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
export type GPSForm = z.infer<typeof gpsLocationAttendanceSchema.addOrUpdate> & {
    designation?: string;
    doj?: string;
    email?: string;
    phone?: string;
    location?: string;
};
interface GPSAttendanceFormProps {
    onSubmit: (data: GPSForm) => void;
    onCancel: () => void;
}
export function GPSAttendanceForm({ onSubmit, onCancel }: GPSAttendanceFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<GPSForm>({
        resolver: zodResolver(gpsLocationAttendanceSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            punchFlag: false,
            employeeName: '',
            clientName: '',
            salesLead: '',
            remarks: '',
            location: 'Ringwood Circle, Doctor B R Ambedkar Veedhi, Gandhinagar, Bengaluru - 560001, Karnataka, India'
        }
    });
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const handleFormSubmit: SubmitHandler<GPSForm> = (data) => {
        onSubmit(data);
        reset({ punchFlag: false } as any);
    };
    const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
        try {
            // Using OpenStreetMap Nominatim API for reverse geocoding (free, no API key required)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'IVRMNext-HRMS-App' // Required by Nominatim
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch address');
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            // Format the address from the response
            const address = data.display_name || `${latitude}, ${longitude}`;
            return address;
        } catch (_error) {
            // Fallback to coordinates if reverse geocoding fails
            return `${latitude}, ${longitude}`;
        }
    };
    const handleGetCurrentLocation = async () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const address = await reverseGeocode(latitude, longitude);
                    setValue('location', address);
                    toast.success('Location captured successfully');
                } catch (_error) {
                    toast.error('Failed to retrieve address. Using coordinates instead.');
                    const { latitude, longitude } = position.coords;
                    setValue('location', `${latitude}, ${longitude}`);
                } finally {
                    setIsGettingLocation(false);
                }
            },
            (error) => {
                setIsGettingLocation(false);
                let errorMessage = 'Failed to get current location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                toast.error(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };
    // Mock employee data - in real app, this would come from a database/API
    const mockEmployees = [
        { name: 'John Doe', designation: 'Manager', doj: '2020-01-15', email: 'john.doe@example.com', phone: '1234567890' },
        { name: 'Jane Smith', designation: 'Developer', doj: '2021-03-20', email: 'jane.smith@example.com', phone: '0987654321' }
    ];
    const handleEmployeeChange = (value: string) => {
        setValue('employeeName', value);
        const selectedEmployee = mockEmployees.find((emp) => emp.name === value);
        if (selectedEmployee) {
            setValue('designation', selectedEmployee.designation);
            setValue('doj', selectedEmployee.doj);
            setValue('email', selectedEmployee.email);
            setValue('phone', selectedEmployee.phone);
        } else {
            setValue('designation', '');
            setValue('doj', '');
            setValue('email', '');
            setValue('phone', '');
        }
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
            {/* Section 1: GPS LOCATION ATTENDANCE */}
            <div className='border-primary border-t-2 pt-4'>
                <h3 className='mb-4 font-semibold text-base text-foreground'>GPS LOCATION ATTENDANCE</h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='employeeName'>
                            Employee Name <span className='text-red-500'>*</span>
                        </label>
                        <Select onValueChange={handleEmployeeChange} value={watch('employeeName')}>
                            <SelectTrigger id='employeeName' className={errors.employeeName ? 'border-red-500' : ''}>
                                <SelectValue placeholder='Select Employee' />
                            </SelectTrigger>
                            <SelectContent>
                                {mockEmployees.map((emp) => (
                                    <SelectItem key={emp.name} value={emp.name}>
                                        {emp.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.employeeName && <FormError>{errors.employeeName.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='doj'>
                            DOJ (Date of Joining)
                        </label>
                        <InputText id='doj' type='date' {...register('doj')} readOnly />
                    </div>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='designation'>
                            Designation
                        </label>
                        <InputText id='designation' placeholder='Designation' {...register('designation')} readOnly />
                    </div>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='email'>
                            Email
                        </label>
                        <InputText id='email' type='email' placeholder='Email' {...register('email')} readOnly />
                    </div>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='phone'>
                            Phone
                        </label>
                        <InputText id='phone' type='tel' placeholder='Phone' {...register('phone')} readOnly />
                    </div>
                </div>
            </div>
            {/* Section 2: GPS LOCATION PARAMETERS */}
            <div className='border-primary border-t-2 pt-4'>
                <h3 className='mb-4 font-semibold text-base text-foreground'>GPS LOCATION PARAMETERS</h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='clientName'>
                            Client Name <span className='text-red-500'>*</span>
                        </label>
                        <Select onValueChange={(v) => setValue('clientName', v)} value={watch('clientName')}>
                            <SelectTrigger id='clientName' className={errors.clientName ? 'border-red-500' : ''}>
                                <SelectValue placeholder='Select or Search Client Name' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Client A'>Client A</SelectItem>
                                <SelectItem value='Client B'>Client B</SelectItem>
                                <SelectItem value='Client C'>Client C</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.clientName && <FormError>{errors.clientName.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <label className='font-medium text-sm' htmlFor='salesLead'>
                            Sales Lead <span className='text-red-500'>*</span>
                        </label>
                        <Select onValueChange={(v) => setValue('salesLead', v)} value={watch('salesLead')}>
                            <SelectTrigger id='salesLead' className={errors.salesLead ? 'border-red-500' : ''}>
                                <SelectValue placeholder='Select or Search Sales Lead' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Lead 1'>Lead 1</SelectItem>
                                <SelectItem value='Lead 2'>Lead 2</SelectItem>
                                <SelectItem value='Lead 3'>Lead 3</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.salesLead && <FormError>{errors.salesLead.message}</FormError>}
                    </div>
                </div>
                <div className='mt-4 space-y-2'>
                    <div className='font-medium text-sm'>Location Display</div>
                    <div className='flex items-start gap-2 rounded-md border border-input bg-muted p-3'>
                        <button
                            type='button'
                            onClick={handleGetCurrentLocation}
                            disabled={isGettingLocation}
                            className='mt-0.5 flex-shrink-0 cursor-pointer transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50'
                            title='Click to capture current location'>
                            {isGettingLocation ? (
                                <RefreshCw className='h-5 w-5 animate-spin text-destructive' />
                            ) : (
                                <MapPin className='h-5 w-5 text-destructive hover:text-destructive/80' />
                            )}
                        </button>
                        <span className='flex-1 break-words text-muted-foreground text-sm'>
                            {watch('location') ||
                                'Ringwood Circle, Doctor B R Ambedkar Veedhi, Gandhinagar, Bengaluru - 560001, Karnataka, India'}
                        </span>
                    </div>
                </div>
                <div className='mt-4 space-y-2'>
                    <label className='font-medium text-sm' htmlFor='remarks'>
                        Remark <span className='text-red-500'>*</span>
                    </label>
                    <Textarea
                        id='remarks'
                        placeholder='Enter Remark'
                        {...register('remarks')}
                        maxLength={250}
                        rows={3}
                        className='resize-none'
                    />
                    {errors.remarks?.message && <FormError>{errors.remarks.message}</FormError>}
                    <div className='text-right text-muted-foreground text-xs'>{watch('remarks')?.length || 0}/250 characters</div>
                </div>
                <div className='mt-4 flex items-center gap-2'>
                    <Checkbox checked={watch('punchFlag')} onCheckedChange={(v) => setValue('punchFlag', Boolean(v))} />
                    <span className='font-medium text-sm'>Punch Flag</span>
                </div>
            </div>
            <div className='flex justify-end gap-4 border-t pt-6'>
                <Button type='button' variant='outline' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' /> CANCEL
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <RefreshCw className='mr-2 h-4 w-4 animate-spin' /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className='mr-2 h-4 w-4' /> SAVE
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
