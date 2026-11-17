'use client';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useMasterFuelType, useMasterVehicle, useMasterVehicleType } from '@/hooks/transport/transportmodule/usemasters';
import { saveMasterVehicle, uploadVehicleFile } from '@/server/transport/transport-module/masters/master-vehicle';
import type { IMasterVehicleDocument } from '@/types/transport/transport-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Plus, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    TRMV_VehicleName: z.string().min(1, 'Vehicle Name is required').regex(/^[a-zA-Z0-9\s]+$/, 'Only Alphabets, Numbers and Spaces Allowed'),
    TRMFT_Id: z.coerce.number().min(1, 'Fuel Type is required'),
    TRMVT_Id: z.coerce.number().min(1, 'Vehicle Type is required'),
    TRMV_PurchaseDate: z.date().optional(),
    TRMV_VehicleNo: z.string().min(1, 'Vehicle No is required').regex(/^[a-zA-Z0-9\-\s]+$/, 'Invalid Vehicle No Format'),
    TRMV_ChassisNo: z.string().min(1, 'Chassis No is required').regex(/^[a-zA-Z0-9]+$/, 'Only Alphanumeric Allowed'),
    TRMV_EngineNo: z.string().min(1, 'Engine No is required').regex(/^[a-zA-Z0-9]+$/, 'Only Alphanumeric Allowed'),
    TRMV_PurchasedFrom: z.string().min(1, 'Purchased From is required'),
    TRMV_Cost: z.coerce.number().min(0, 'Cost must be valid'),
    TRMV_Capacity: z.coerce.number().min(1, 'Capacity must be valid'),
    TRMV_Desc: z.string().optional(),
    TRMV_CompanyName: z.string().min(1, 'Company Name is required'),
    TRMV_RegistrationDate: z.date().optional(),
    TRMV_ManufacturedDate: z.date().optional(),
    TRMV_RegFCUpToDate: z.date().optional(),
    TRMV_SWDOff: z.string().min(1, 'S/W/D Off is required'),
    TRMV_Address: z.string().min(1, 'Address is required'),
    TRMV_OwnersName: z.string().min(1, 'Owner Name is required'),

    // Additional Fields
    TRMV_Model: z.string().optional(),
    TRMV_Fuel: z.string().optional(),
    TRMV_Manufacturer: z.string().optional(),
    TRMV_Class: z.string().optional(),
    TRMV_Color: z.string().optional(),
    TRMV_Body: z.string().optional(),
    TRMV_NoOfCylinder: z.coerce.number().optional(),
    TRMV_WheelBase: z.string().optional(),
    TRMV_UnladenWeight: z.coerce.number().optional(),
    TRMV_CC: z.string().optional(),
    TRMV_TaxUpTo: z.string().optional(),

    // File Uploads
    TRMV_VehicleImage: z.string().optional(),
    vehicleDocuments: z.array(z.any()).optional(),
});

export default function AddVehicleForm({ onClose }: { onClose: () => void }) {
    const { refetchAll } = useMasterVehicle();
    const { data: fuelTypes } = useMasterFuelType();
    const { data: vehicleTypes } = useMasterVehicleType();
    const [currentTab, setCurrentTab] = useState('start');

    // File Upload State
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [tempDocs, setTempDocs] = useState<{ file: File, desc: string }[]>([]);
    const [currentDocDesc, setCurrentDocDesc] = useState('');
    const [currentDocFile, setCurrentDocFile] = useState<File | null>(null);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            TRMV_VehicleName: '',
            TRMFT_Id: 0,
            TRMVT_Id: 0,
            TRMV_VehicleNo: '',
            TRMV_ChassisNo: '',
            TRMV_EngineNo: '',
            TRMV_PurchasedFrom: '',
            TRMV_Cost: 0,
            TRMV_Capacity: 0,
            TRMV_Desc: '',
            TRMV_CompanyName: '',
            TRMV_SWDOff: '',
            TRMV_Address: '',
            TRMV_OwnersName: '',
            TRMV_Model: '',
            TRMV_Fuel: '',
            TRMV_Manufacturer: '',
            TRMV_Class: '',
            TRMV_Color: '',
            TRMV_Body: '',
            TRMV_NoOfCylinder: 0,
            TRMV_WheelBase: '',
            TRMV_UnladenWeight: 0,
            TRMV_CC: '',
            TRMV_TaxUpTo: '',
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddDocument = () => {
        if (currentDocFile && currentDocDesc) {
            setTempDocs([...tempDocs, { file: currentDocFile, desc: currentDocDesc }]);
            setCurrentDocFile(null);
            setCurrentDocDesc('');
            // Optional: reset file input value
            const fileInput = document.getElementById('doc-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } else {
            toast.error('Please select a file and enter a description');
        }
    };

    const handleRemoveDocument = (index: number) => {
        const newDocs = [...tempDocs];
        newDocs.splice(index, 1);
        setTempDocs(newDocs);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            let vehicleImagePath = '';

            // 1. Upload Image
            if (selectedImage) {
                const formData = new FormData();
                formData.append('File', selectedImage);
                const uploadRes = await uploadVehicleFile(formData);
                if (uploadRes.success && uploadRes.data && uploadRes.data.length > 0) {
                    vehicleImagePath = uploadRes.data[0].path;
                } else if (typeof uploadRes === 'string') {
                    vehicleImagePath = uploadRes;
                } else if (uploadRes.path) {
                    vehicleImagePath = uploadRes.path as string;
                }
            }

            // 2. Upload Documents
            const uploadedDocs: IMasterVehicleDocument[] = [];
            for (const doc of tempDocs) {
                const formData = new FormData();
                formData.append('File', doc.file);
                const uploadRes = await uploadVehicleFile(formData);
                let path = '';
                if (uploadRes.success && uploadRes.data && uploadRes.data.length > 0) {
                    path = uploadRes.data[0].path;
                } else if (uploadRes.path) {
                    path = uploadRes.path as string;
                }

                if (path) {
                    uploadedDocs.push({
                        cfilename: doc.file.name,
                        cfiledesc: doc.desc,
                        cfilepath: path
                    });
                }
            }

            const payload = {
                ...values,
                TRMV_Id: 0,
                TRMV_PurchaseDate: values.TRMV_PurchaseDate ? values.TRMV_PurchaseDate.toISOString() : undefined,
                TRMV_RegistrationDate: values.TRMV_RegistrationDate ? values.TRMV_RegistrationDate.toISOString() : undefined,
                TRMV_ManufacturedDate: values.TRMV_ManufacturedDate ? values.TRMV_ManufacturedDate.toISOString() : undefined,
                TRMV_RegFCUpToDate: values.TRMV_RegFCUpToDate ? values.TRMV_RegFCUpToDate.toISOString() : undefined,
                TRMV_VehicleImage: vehicleImagePath,
                vehicleDocuments: uploadedDocs
            };

            const response = await saveMasterVehicle(payload);

            if (response.message === 'Add') {
                if (response.retrunval === true) {
                    toast.success('Record Saved Successfully');
                    refetchAll();
                    onClose();
                } else {
                    toast.error('Failed To Saved Record');
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

                    <TabsContent value="start" className="space-y-4 pt-4">
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

                            {/* Image Upload in First Tab */}
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <FormLabel>Vehicle Photo</FormLabel>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <Upload className="h-8 w-8 text-gray-400" />
                                        )}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                            id="vehicle-image-input"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-2">Upload vehicle photo (JPG, PNG). Max 2MB.</p>
                                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('vehicle-image-input')?.click()}>
                                            Select Image
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button type="button" onClick={() => setCurrentTab('end')} className="bg-primary text-white">Next</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="end" className="space-y-4 pt-4">
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


                        {/* Documents Section in End Tab */}
                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-lg font-semibold mb-4">Transport Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 bg-gray-50 p-4 rounded-md">
                                <div className="space-y-2">
                                    <FormLabel>File Description</FormLabel>
                                    <Input
                                        value={currentDocDesc}
                                        onChange={(e) => setCurrentDocDesc(e.target.value)}
                                        placeholder="e.g., Insurance Policy"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Select File</FormLabel>
                                    <Input
                                        type="file"
                                        id="doc-upload"
                                        onChange={(e) => setCurrentDocFile(e.target.files?.[0] || null)}
                                        className="cursor-pointer"
                                    />
                                </div>
                                <Button type="button" onClick={handleAddDocument} className="bg-secondary text-white">
                                    <Plus className="h-4 w-4 mr-2" /> Add Document
                                </Button>
                            </div>

                            {tempDocs.length > 0 && (
                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-2 text-left">Document Name</th>
                                                <th className="p-2 text-left">Description</th>
                                                <th className="p-2 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tempDocs.map((doc, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="p-2 flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-blue-500" />
                                                        {doc.file.name}
                                                    </td>
                                                    <td className="p-2">{doc.desc}</td>
                                                    <td className="p-2 text-center">
                                                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveDocument(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className='flex justify-between gap-2 mt-4'>
                            <Button type='button' variant='outline' onClick={() => setCurrentTab('start')}>
                                Previous
                            </Button>
                            <div className="flex gap-2">
                                <Button type='button' variant='outline' onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type='submit'>Save</Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </form>
        </Form >
    );
}
