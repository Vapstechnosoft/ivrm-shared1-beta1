'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMasterFuelType, useMasterVehicle, useMasterVehicleType } from '@/hooks/transport/transportmodule/usemasters';
import { saveMasterVehicle } from '@/server/transport/transport-module/masters/master-vehicle';
import type { IMasterVehicle } from '@/types/transport/transport-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useState } from 'react';

const formSchema = z.object({
    TRMV_VehicleName: z.string().min(1, 'Vehicle Name is required').regex(/^[a-zA-Z\s]+$/, 'Only Alphabets and Spaces Allowed'),
    TRMFT_Id: z.coerce.number().min(1, 'Fuel Type is required'),
    TRMVT_Id: z.coerce.number().min(1, 'Vehicle Type is required'),
    TRMV_PurchaseDate: z.date().optional(),
    TRMV_VehicleNo: z.string().min(1, 'Vehicle No is required'),
    TRMV_ChassisNo: z.string().min(1, 'Chassis No is required'),
    TRMV_EngineNo: z.string().min(1, 'Engine No is required'),
    TRMV_PurchasedFrom: z.string().min(1, 'Purchased From is required'),
    TRMV_Cost: z.coerce.number().min(0, 'Cost must be valid'),
    TRMV_Capacity: z.coerce.number().min(1, 'Capacity must be valid'),
    TRMV_Desc: z.string().min(1, 'Description is required'),
    TRMV_CompanyName: z.string().min(1, 'Company Name is required'),
    TRMV_RegistrationDate: z.date().optional(),
    TRMV_ManufacturedDate: z.date().optional(),
    TRMV_RegFCUpToDate: z.date().optional(),
    TRMV_SWDOff: z.string().min(1, 'S/W/D Off is required'),
    TRMV_Address: z.string().min(1, 'Address is required'),
    TRMV_OwnersName: z.string().min(1, 'Owner Name is required'),

    // Additional Fields
    TRMV_Model: z.string().optional(),
    TRMV_Fuel: z.string().optional(), // Text version
    TRMV_Manufacturer: z.string().optional(),
    TRMV_Class: z.string().optional(),
    TRMV_Color: z.string().optional(),
    TRMV_Body: z.string().optional(),
    TRMV_NoOfCylinder: z.coerce.number().optional(),
    TRMV_WheelBase: z.string().optional(),
    TRMV_UnladenWeight: z.coerce.number().optional(),
    TRMV_CC: z.string().optional(),
    TRMV_TaxUpTo: z.string().optional(),
});

export default function UpdateVehicleForm({
    rowData,
    onClose
}: {
    rowData: IMasterVehicle;
    onClose: () => void;
}) {
    const { refetchAll } = useMasterVehicle();
    const { data: fuelTypes } = useMasterFuelType();
    const { data: vehicleTypes } = useMasterVehicleType();
    const [currentTab, setCurrentTab] = useState('start');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            TRMV_VehicleName: rowData.trmV_VehicleName,
            TRMFT_Id: rowData.trmfT_Id,
            TRMVT_Id: rowData.trmvT_Id,
            TRMV_PurchaseDate: rowData.trmV_PurchaseDate ? new Date(rowData.trmV_PurchaseDate) : undefined,
            TRMV_VehicleNo: rowData.trmV_VehicleNo,
            TRMV_ChassisNo: rowData.trmV_ChassisNo,
            TRMV_EngineNo: rowData.trmV_EngineNo,
            TRMV_PurchasedFrom: rowData.trmV_PurchasedFrom,
            TRMV_Cost: rowData.trmV_Cost,
            TRMV_Capacity: rowData.trmV_Capacity,
            TRMV_Desc: rowData.trmV_Desc,
            TRMV_CompanyName: rowData.trmV_CompanyName,
            TRMV_RegistrationDate: rowData.trmV_RegistrationDate ? new Date(rowData.trmV_RegistrationDate) : undefined,
            TRMV_ManufacturedDate: rowData.trmV_ManufacturedDate ? new Date(rowData.trmV_ManufacturedDate) : undefined,
            TRMV_RegFCUpToDate: rowData.trmV_RegFCUpToDate ? new Date(rowData.trmV_RegFCUpToDate) : undefined,
            TRMV_SWDOff: rowData.trmV_SWDOff,
            TRMV_Address: rowData.trmV_Address,
            TRMV_OwnersName: rowData.trmV_OwnersName,
            TRMV_Model: rowData.trmV_Model,
            TRMV_Fuel: rowData.trmV_Fuel,
            TRMV_Manufacturer: rowData.trmV_Manufacturer,
            TRMV_Class: rowData.trmV_Class,
            TRMV_Color: rowData.trmV_Color,
            TRMV_Body: rowData.trmV_Body,
            TRMV_NoOfCylinder: rowData.trmV_NoOfCylinder,
            TRMV_WheelBase: rowData.trmV_WheelBase,
            TRMV_UnladenWeight: rowData.trmV_UnladenWeight,
            TRMV_CC: rowData.trmV_CC,
            TRMV_TaxUpTo: rowData.trmV_TaxUpTo,
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const payload = {
                ...values,
                TRMV_Id: rowData.trmV_Id,
                TRMV_PurchaseDate: values.TRMV_PurchaseDate ? values.TRMV_PurchaseDate.toISOString() : undefined,
                TRMV_RegistrationDate: values.TRMV_RegistrationDate ? values.TRMV_RegistrationDate.toISOString() : undefined,
                TRMV_ManufacturedDate: values.TRMV_ManufacturedDate ? values.TRMV_ManufacturedDate.toISOString() : undefined,
                TRMV_RegFCUpToDate: values.TRMV_RegFCUpToDate ? values.TRMV_RegFCUpToDate.toISOString() : undefined,
            };

            const response = await saveMasterVehicle(payload);

            if (response.message === 'Update') {
                if (response.retrunval === true) {
                    toast.success('Record Updated Successfully');
                    refetchAll();
                    onClose();
                } else {
                    toast.error('Failed To Update Record');
                }
            } else if (response.message === 'Duplicate') {
                toast.error('Record Already Exists');
            } else {
                toast.error('Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="start">START</TabsTrigger>
                        <TabsTrigger value="end">END</TabsTrigger>
                    </TabsList>

                    <TabsContent value="start" className="space-y-4">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='TRMV_VehicleName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vehicle Name <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Vehicle Name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMFT_Id'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fuel Type <span className='text-red-500'>*</span></FormLabel>
                                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Fuel Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {fuelTypes?.data?.map((fuel: any) => (
                                                    <SelectItem key={fuel.trmfT_Id} value={fuel.trmfT_Id.toString()}>
                                                        {fuel.trmfT_FuelType}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMVT_Id'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vehicle Type <span className='text-red-500'>*</span></FormLabel>
                                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Vehicle Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {vehicleTypes?.data?.map((vc: any) => (
                                                    <SelectItem key={vc.trmvT_Id} value={vc.trmvT_Id.toString()}>
                                                        {vc.trmvT_VehicleType}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_PurchaseDate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date Of Purchase <span className='text-red-500'>*</span></FormLabel>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            placeholder='Select Date'
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_VehicleNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vehicle No <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Vehicle No' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_ChassisNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chassis No <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Chassis No' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_EngineNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Engine No <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Engine No' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_PurchasedFrom'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchased From <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Purchased From' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_Capacity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Seating <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} placeholder='Enter Capacity' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_Cost'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Approximate Cost <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} placeholder='Enter Cost' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_CompanyName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Company Name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_SWDOff'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>S/W/D OFF <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter S/W/D OFF' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_OwnersName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Owner Name <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Owner Name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_Desc'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder='Enter Description' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_Address'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address <span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder='Enter Address' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="button" onClick={() => setCurrentTab('end')} className="bg-primary text-white">Next</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="end" className="space-y-4">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='TRMV_Model'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Model Name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_RegistrationDate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Registration Date</FormLabel>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            placeholder='Select Date'
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_Manufacturer'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Manufacturer Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Manufacturer Name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_ManufacturedDate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Manufactured Date</FormLabel>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            placeholder='Select Date'
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_Fuel'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fuel</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Fuel' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_Class'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Class' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_Color'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Colour</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Colour' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_Body'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Body</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Body' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_NoOfCylinder'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>No Of Cylinder</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} placeholder='Enter No Of Cylinder' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_WheelBase'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wheel Base</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Wheel Base' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_UnladenWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unladen Weight</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} placeholder='Enter Unladen Weight' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_CC'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>STDG/SLPRCC</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter STDG/SLPRCC' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_TaxUpTo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tax UpTo</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter Tax UpTo' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='TRMV_RegFCUpToDate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>REG/FC UpTo</FormLabel>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            placeholder='Select Date'
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex justify-between gap-2 mt-4'>
                            <Button type='button' variant='outline' onClick={() => setCurrentTab('start')}>
                                Previous
                            </Button>
                            <div className="flex gap-2">
                                <Button type='button' variant='outline' onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type='submit'>Update</Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    );
}
