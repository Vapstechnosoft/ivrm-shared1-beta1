'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getAlumniStudentData, getStudentList, onCountryChange, onStateChange, saveAlumnusData } from '@/server/alumni/alumni-membership';
import { uploadDocument } from '@/server/document_upload';
import type { ICountry, IDistrict, IMemberCategory, IState, IYear } from '@/types/alumni/alumni-membership';
import type { ICity } from '@/types/alumni/alumni-report';
import type { IClass } from '@/types/staff-portal/attendance-entry';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown, Image as ImageIcon, Loader2, RotateCcw, Save, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AchievementSection from './achievement-section';
import ProfessionalSection from './professional-section';
import QualificationSection from './qualification-section';
import ReadmittedSection from './readmitted-section';
import { type IAlumnusMembershipFormValues, alumnusMembershipSchema, alumnusMembershipUpdateSchema } from './schema';

interface AlumniFormProps {
    initialData?: any;
    years: IYear[];
    classes: IClass[];
    categories: IMemberCategory[];
    countries: ICountry[];
    states: IState[];
    districts: IDistrict[];
    cities?: ICity[];
    onCancel: () => void;
    onSuccess: () => void;
    isAdmin: boolean;
}

export default function AlumniForm({
    initialData,
    years,
    classes,
    categories,
    countries,
    states: initialStates,
    districts: initialDistricts,
    cities: initialCities = [],
    onCancel,
    onSuccess,
    isAdmin
}: AlumniFormProps) {
    const [currentStates, setCurrentStates] = useState<IState[]>(initialStates);
    const [currentDistricts, setCurrentDistricts] = useState<IDistrict[]>(initialDistricts);
    const [currentCities, setCurrentCities] = useState<ICity[]>(initialCities);
    const [stuPhoto, setStuPhoto] = useState<string>(initialData?.almsT_StudentPhoto || '');
    const [famPhoto, setFamPhoto] = useState<string>(initialData?.almsT_FamilyPhoto || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [noCityMatch, setNoCityMatch] = useState(false);
    const [localStudentList, setLocalStudentList] = useState<any[]>([]);
    const [isStudentLoading, setIsStudentLoading] = useState(false);
    const [openStudentCombo, setOpenStudentCombo] = useState(false);

    const form = useForm<IAlumnusMembershipFormValues>({
        resolver: zodResolver(initialData ? alumnusMembershipUpdateSchema : alumnusMembershipSchema),
        defaultValues: {
            ALMST_Id: initialData?.almsT_Id || 0,
            ALMST_FirstName: initialData?.amsT_FirstName || '',
            ALMST_MiddleName: initialData?.almsT_MiddleName || '',
            ALMST_LastName: initialData?.almsT_LastName || '',
            ALMST_NickName: initialData?.almsT_NickName || '',
            ALMST_AdmNo: initialData?.almsT_AdmNo || '',
            AMST_ID: initialData?.amsT_ID || 0,
            ALMST_DOB: initialData?.almsT_DOB ? new Date(initialData.almsT_DOB) : new Date(),
            ALMST_MobileNo: (initialData?.almsT_MobileNo ?? '').toString(),
            ALMST_FatherName: initialData?.almsT_FatherName || '',
            ALMST_PhoneNo: initialData?.almsT_PhoneNo || '',
            ALMST_emailId: initialData?.almsT_emailId || '',
            ALMST_BloodGroup: initialData?.almsT_BloodGroup || '',
            ALMST_Marital_Status: initialData?.almsT_Marital_Status === 'Married' || initialData?.almsT_Marital_Status === '1' ? '1' : '0',

            ALMST_SpouseName: initialData?.almsT_SpouseName || '',
            ALMST_SpouseContactNo: initialData?.almsT_SpouseContactNo || '',
            ALMST_SpouseEmailId: initialData?.almsT_SpouseEmailId || '',
            ALMST_SpouseQulaification: initialData?.almsT_SpouseQulaification || '',
            ALMST_SpouseProfession: initialData?.almsT_SpouseProfession || '',
            ALMST_WeddingAnniversaryDate: initialData?.almsT_WeddingAnniversaryDate
                ? new Date(initialData.almsT_WeddingAnniversaryDate)
                : undefined,

            ALMST_PerCountry: initialData?.ivrmmC_Id?.toString() || '',
            ALMST_PerState: initialData?.almsT_ConState?.toString() || '',
            ALMST_PerDistrict: initialData?.almsT_PerDistrict?.toString() || '',
            ALMST_ConCity: initialData?.almsT_ConCity || '',
            ALMST_ConArea: initialData?.almsT_ConArea || '',
            ALMST_ConStreet: initialData?.almsT_ConStreet || '',
            ALMST_ConPincode: (initialData?.almsT_ConPincode ?? '').toString(),
            ALMST_FullAddess: initialData?.almsT_FullAddess || '',

            ASMAY_Id_Join: initialData?.asmaY_Id_Join?.toString() || '',
            ASMAY_Id_Left: initialData?.asmaY_Id_Left?.toString() || '',
            ASMCL_Id_Join: initialData?.asmcL_Id_Join?.toString() || '',
            ASMCL_Id_Left: initialData?.asmcL_Id_Left?.toString() || '',

            ALMST_MembershipCategory: initialData?.almsT_MembershipCategory?.toString() || '',
            ALMST_AmountPaid: initialData?.almsT_AmountPaid || '',
            ALMST_MembershipId: initialData?.almsT_MembershipId || '',

            ALSPR_CompanyName: initialData?.alspR_CompanyName || '',
            ALSPR_Designation: initialData?.alspR_Designation || '',
            ALSPR_WorkingSince: initialData?.alspR_WorkingSince?.toString() || '',
            ALSPR_CompanyAddress: initialData?.alspR_CompanyAddress || '',
            ALSPR_EmailId: initialData?.alspR_EmailId || '',
            ALSPR_OtherDetails: initialData?.alspR_OtherDetails || '',

            ALSAC_Achievement: initialData?.alsaC_Achievement || '',
            ALSAC_Remarks: initialData?.alsaC_Remarks || '',

            qualification_array:
                initialData?.studentquali?.map((q: any) => ({
                    Qualification: q.alsqU_Qulification || '',
                    ALMST_PUC_INS_NAME: q.alsqU_University || '',
                    ALMST_PUC_PASSED_OUT: q.alsqU_YearOfPassing || '',
                    ALSQU_Percentage: q.alsqU_Percentage?.toString() || '',
                    ALMST_PLACE: q.alsqU_Place || '',
                    ALMST_PerState: q.almsT_PerState,
                    ALSQU_OtherDetails: q.alsqU_OtherDetails || ''
                })) || [],
            ReadmittedStudentDTO:
                initialData?.readmittedDetails?.map((r: any) => ({
                    ALMSTRADM_YearJoined: r.almstradM_YearJoined || 0,
                    ALMSTRADM_YearLeft: r.almstradM_YearLeft || 0,
                    ALMSTRADM_ClassJoined: r.almstradM_ClassJoined || 0,
                    ALMSTRADM_ClassLeft: r.almstradM_ClassLeft || 0
                })) || [],
            ALMSTRADM_Id: initialData?.almstradM_Id || 0,
            Readmitted_student: !!initialData?.readmitted_student
        }
    });

    const maritalStatus = form.watch('ALMST_Marital_Status');

    // Update full address when address fields change
    const updateFullAddress = () => {
        const area = form.getValues('ALMST_ConArea');
        const street = form.getValues('ALMST_ConStreet');
        const city = form.getValues('ALMST_ConCity');
        const pincode = form.getValues('ALMST_ConPincode');
        const stateId = form.getValues('ALMST_PerState');
        const countryId = form.getValues('ALMST_PerCountry');
        const districtId = form.getValues('ALMST_PerDistrict');

        let fullAddress = '';
        if (area) fullAddress += area + '\n';
        if (street) fullAddress += street + '\n';
        if (city && pincode) {
            fullAddress += city + ' - ' + pincode + '\n';
        } else if (city) {
            fullAddress += city + '\n';
        }

        const stateName = currentStates.find((s) => s.ivrmmS_Id?.toString() === stateId)?.ivrmmS_Name || '';
        const countryName = countries.find((c) => c.ivrmmC_Id?.toString() === countryId)?.ivrmmC_CountryName || '';
        const districtName = currentDistricts.find((d) => d.ivrmmD_Id?.toString() === districtId)?.ivrmmD_Name || '';

        if (stateName) fullAddress += stateName;
        if (districtName) fullAddress += ', ' + districtName;
        if (countryName) fullAddress += ', ' + countryName;

        form.setValue('ALMST_FullAddess', fullAddress.trim());
    };

    const handleCountryChange = async (countryId: string) => {
        form.setValue('ALMST_PerCountry', countryId);
        form.setValue('ALMST_PerState', '');
        form.setValue('ALMST_PerDistrict', '');
        if (!countryId) return;
        const res = await onCountryChange(Number.parseInt(countryId));
        if (res.success) {
            const data = res.data || res;
            setCurrentStates(data.statedropdown || []);
        }
        updateFullAddress();
    };

    const handleStateChange = async (stateId: string) => {
        form.setValue('ALMST_PerState', stateId);
        form.setValue('ALMST_PerDistrict', '');
        if (!stateId) return;
        const res = await onStateChange(Number.parseInt(stateId));
        if (res.success) {
            const data = res.data || res;
            setCurrentDistricts(data.districtdropdown || []);
        }
        updateFullAddress();
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'stu' | 'fam') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset the input value so the same file can be selected again
        e.target.value = '';

        const formData = new FormData();
        formData.append('File', file);
        formData.append('folder', 'Alumni_Details');

        const toastId = toast.loading('Uploading photo...');
        try {
            const res = await uploadDocument(formData);
            if (res.success && res.data) {
                const url = res.data;
                if (type === 'stu') {
                    setStuPhoto(url);
                } else {
                    setFamPhoto(url);
                }
                toast.success('Photo uploaded successfully', { id: toastId });
            } else {
                toast.error(res.message || 'Upload failed', { id: toastId });
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('An error occurred during upload', { id: toastId });
        }
    };

    const handleBatchChange = async (yearId: string) => {
        form.setValue('ASMAY_Id_Left', yearId);
        form.setValue('ALMST_FirstName', '');
        form.setValue('AMST_ID', 0);
        form.setValue('ALMST_AdmNo', '');
        setLocalStudentList([]);

        if (!yearId) return;

        setIsStudentLoading(true);
        const res = await getStudentList(Number.parseInt(yearId));
        if (res.success) {
            let list = [];
            if (Array.isArray(res.data)) {
                list = res.data;
            } else if (res.data && typeof res.data === 'object') {
                const data = res.data;
                list = data.fillstudent || data.stu_name || data.studentDetails || [];
            }
            setLocalStudentList(Array.isArray(list) ? list : []);
        } else {
            toast.error(res.message || 'Failed to fetch student list');
        }
        setIsStudentLoading(false);
    };

    const handleStudentSelect = async (student: any) => {
        setOpenStudentCombo(false);
        setIsStudentLoading(true);

        const res = await getAlumniStudentData({
            ALMST_Id: student.almsT_Id || 0,
            ALSREG_Id: student.alsreG_Id,
            ASMCL_Id_Left: student.asmcL_Id_Left,
            ASMCL_Id_Join: student.asmcL_Id_Join,
            ASMAY_Id_Left: student.asmaY_Id_Left,
            ALMST_ConState: student.almsT_ConState,
            ASMAY_Id_Join: student.asmaY_Id_Join,
            Readmitted_student: student.readmitted_student
        });

        if (res.success) {
            let details = null;
            if (Array.isArray(res.data) && res.data.length > 0) {
                details = res.data[0].studentDetails?.[0];
            } else if (res.data?.studentDetails?.length > 0) {
                details = res.data.studentDetails[0];
            }

            if (details) {
                // Populate forms
                form.setValue('ALMST_FirstName', details.amsT_FirstName || details.almsT_FirstName || '');
                form.setValue('ALMST_AdmNo', details.almsT_AdmNo || '');
                form.setValue('AMST_ID', details.amsT_ID || 0);
                if (details.almsT_DOB) {
                    form.setValue('ALMST_DOB', new Date(details.almsT_DOB));
                }
                form.setValue('ALMST_MobileNo', (details.almsT_MobileNo || '').toString());
                form.setValue('ALMST_emailId', details.almsT_emailId || '');
                form.setValue('ALMST_FatherName', details.almsT_FatherName || '');
                form.setValue('ALMST_NickName', details.almsT_NickName || '');

                if (details.asmaY_Id_Join) form.setValue('ASMAY_Id_Join', details.asmaY_Id_Join.toString());
                if (details.asmcL_Id_Join) form.setValue('ASMCL_Id_Join', details.asmcL_Id_Join.toString());
                if (details.asmcL_Id_Left) form.setValue('ASMCL_Id_Left', details.asmcL_Id_Left.toString());
                if (details.ivrmmC_Id) form.setValue('ALMST_PerCountry', details.ivrmmC_Id.toString());
                if (details.almsT_ConState) form.setValue('ALMST_PerState', details.almsT_ConState.toString());

                toast.success('Student details loaded');
            } else {
                toast.error('No details found for selected student');
            }
        } else {
            toast.error(res.message || 'Failed to fetch student details');
        }
        setIsStudentLoading(false);
    };

    const onSubmit = async (values: IAlumnusMembershipFormValues) => {
        setIsSubmitting(true);
        try {
            // Prepare the payload according to the user's specific request for /api/AlumniMembership/save_data
            const payload: any = {
                almsT_Id: initialData?.almsT_Id || 0,
                almsT_FirstName: values.ALMST_FirstName,
                almsT_MiddleName: values.ALMST_MiddleName || '',
                almsT_LastName: values.ALMST_LastName || '',
                almsT_DOB: format(values.ALMST_DOB, 'yyyy-MM-dd'),
                almsT_NickName: values.ALMST_NickName,
                almsT_FatherName: values.ALMST_FatherName,
                almsT_MobileNo: Number(values.ALMST_MobileNo) || 0,
                almsT_PhoneNo: values.ALMST_PhoneNo || '',
                almsT_AdmNo: values.ALMST_AdmNo,
                almsT_emailId: values.ALMST_emailId,
                almsT_ConCountryId: values.ALMST_PerCountry ? Number(values.ALMST_PerCountry) : 0,
                almsT_ConState: values.ALMST_PerState ? Number(values.ALMST_PerState) : 0,
                almsT_ConCity: values.ALMST_ConCity,
                almsT_ConArea: values.ALMST_ConArea,
                almsT_ConStreet: values.ALMST_ConStreet || '',
                almsT_ConPincode: values.ALMST_ConPincode ? Number(values.ALMST_ConPincode) : 0,
                almsT_Marital_Status: values.ALMST_Marital_Status === '1' ? 'Married' : 'Single',
                almsT_BloodGroup: values.ALMST_BloodGroup,
                asmaY_Id_Join: values.ASMAY_Id_Join ? Number(values.ASMAY_Id_Join) : 0,
                asmaY_Id_Left: values.ASMAY_Id_Left ? Number(values.ASMAY_Id_Left) : 0,
                asmcL_Id_Join: values.ASMCL_Id_Join ? Number(values.ASMCL_Id_Join) : 0,
                asmcL_Id_Left: values.ASMCL_Id_Left ? Number(values.ASMCL_Id_Left) : 0,
                almsT_StudentPhoto: stuPhoto || '',
                almsT_FamilyPhoto: famPhoto || '',
                almsT_SpouseName: values.ALMST_SpouseName || '',
                almsT_SpouseContactNo: values.ALMST_SpouseContactNo || '',
                almsT_SpouseEmailId: values.ALMST_SpouseEmailId || '',
                almsT_SpouseQulaification: values.ALMST_SpouseQulaification || '',
                almsT_SpouseProfession: values.ALMST_SpouseProfession || '',
                // almsT_WeddingAnniversaryDate: values.ALMST_WeddingAnniversaryDate ? format(values.ALMST_WeddingAnniversaryDate, 'yyyy-MM-dd') : null,
                qualification_array:
                    values.qualification_array?.map((q) => ({
                        qualification: q.Qualification,
                        almsT_PUC_PASSED_OUT: q.ALMST_PUC_PASSED_OUT ? Number(q.ALMST_PUC_PASSED_OUT) : 0,
                        almsT_PUC_INS_NAME: q.ALMST_PUC_INS_NAME,
                        almsT_PLACE: q.ALMST_PLACE || '',
                        alsqU_OtherDetails: q.ALSQU_OtherDetails || '',
                        alsqU_Percentage: q.ALSQU_Percentage ? Number(q.ALSQU_Percentage) : 0,
                        almsT_PerState: q.ALMST_PerState || 0
                    })) || [],
                alspR_CompanyName: values.ALSPR_CompanyName || '',
                alspR_CompanyAddress: values.ALSPR_CompanyAddress || '',
                alspR_Designation: values.ALSPR_Designation || '',
                alspR_EmailId: values.ALSPR_EmailId || '',
                alspR_WorkingSince: values.ALSPR_WorkingSince ? Number(values.ALSPR_WorkingSince) : 0,
                alspR_OtherDetails: values.ALSPR_OtherDetails || '',
                alsaC_Achievement: values.ALSAC_Achievement || '',
                alsaC_Remarks: values.ALSAC_Remarks || ''
            };

            // If new student, add ReadmittedStudentDTO if needed
            if (!initialData && values.ReadmittedStudentDTO) {
                payload.ReadmittedStudentDTO = values.ReadmittedStudentDTO;
            }

            const res = await saveAlumnusData(payload);

            // Handle backend quirk where success might be false but message indicates success
            if (res.success || res.message === 'Records updated Successfully' || res.message === 'Saved Successfully') {
                const message = res.message || (initialData ? 'Alumni updated successfully' : 'Alumni registered successfully');
                toast.success(message);
                onSuccess();
            } else {
                toast.error(res.message || 'Failed to save data');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('An error occurred while saving the data');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                {/* Main Section - ALUMNUS DETAILS */}
                <Card className='border-2 border-primary/20'>
                    <div className='border-b bg-primary/10 px-4 py-3'>
                        <h2 className='font-semibold text-lg text-primary'>ALUMNUS DETAILS</h2>
                    </div>
                    <CardContent className='p-6'>
                        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                            {/* LEFT COLUMN */}
                            <div className='space-y-4'>
                                {/* Batch (Admin only) */}
                                <FormField
                                    control={form.control}
                                    name='ASMAY_Id_Left'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Batch :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={handleBatchChange} value={field.value} disabled={!!initialData}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select Batch Year--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {years.map((y) => (
                                                        <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                            {y.asmaY_Year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* Alumnus Name */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_FirstName'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Alumnus Name :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <div className='relative'>
                                                {!initialData ? (
                                                    <Popover open={openStudentCombo} onOpenChange={setOpenStudentCombo}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant='outline'
                                                                    role='combobox'
                                                                    className={cn(
                                                                        'w-full justify-between',
                                                                        !field.value && 'text-muted-foreground'
                                                                    )}
                                                                    disabled={!form.watch('ASMAY_Id_Left')}>
                                                                    {field.value || 'Select or search Student in the list...'}
                                                                    {isStudentLoading ? (
                                                                        <Loader2 className='ml-2 h-4 w-4 shrink-0 animate-spin opacity-50' />
                                                                    ) : (
                                                                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                                                    )}
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
                                                            <Command>
                                                                <CommandInput placeholder='Search student...' />
                                                                <CommandList>
                                                                    <CommandEmpty>No student found.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {localStudentList.map((student) => {
                                                                            const name =
                                                                                student.membername ||
                                                                                student.alsreG_MemberName ||
                                                                                student.amsT_FirstName ||
                                                                                student.almsT_FirstName ||
                                                                                '--';
                                                                            const admNo = student.almsT_AdmNo || student.amsT_AdmNo || '';
                                                                            const label = admNo ? `${name} : ${admNo}` : name;
                                                                            return (
                                                                                <CommandItem
                                                                                    key={
                                                                                        student.almsT_Id ||
                                                                                        student.alsreG_Id ||
                                                                                        Math.random()
                                                                                    }
                                                                                    value={label}
                                                                                    onSelect={() => handleStudentSelect(student)}>
                                                                                    <Check
                                                                                        className={cn(
                                                                                            'mr-2 h-4 w-4',
                                                                                            field.value === name
                                                                                                ? 'opacity-100'
                                                                                                : 'opacity-0'
                                                                                        )}
                                                                                    />
                                                                                    {label}
                                                                                </CommandItem>
                                                                            );
                                                                        })}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : (
                                                    <FormControl>
                                                        <Input placeholder='Alumnus Name' {...field} disabled={!!initialData} />
                                                    </FormControl>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Nick Name */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_NickName'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Nick Name :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter Nick Name' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Admission Number */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_AdmNo'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Admission Number :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter Admission Number' {...field} disabled />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='ASMAY_Id_Join'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>Year of Admission :</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select Year of Admission--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {years.map((y) => (
                                                        <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                            {y.asmaY_Year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='ASMCL_Id_Join'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>Class Joined :</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select Joined Class--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {classes.map((c) => (
                                                        <SelectItem key={c.asmcL_Id} value={c.asmcL_Id.toString()}>
                                                            {c.asmcL_ClassName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='ASMCL_Id_Left'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>Class Passed Out :</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select Passed Out Class--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {classes.map((c) => (
                                                        <SelectItem key={c.asmcL_Id} value={c.asmcL_Id.toString()}>
                                                            {c.asmcL_ClassName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* Date of Birth */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_DOB'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Date of Birth :<span className='text-destructive'>*</span>
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
                                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                                            {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Enter date</span>}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0' align='start'>
                                                    <Calendar
                                                        mode='single'
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />

                                {/* Mobile Number */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_MobileNo'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Mobile Number :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter Mobile Number' maxLength={10} {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Father's Name */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_FatherName'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Father's Name :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter Father Name' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Phone Number */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_PhoneNo'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Phone Number :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter Phone Number'
                                                    maxLength={10}
                                                    {...field}
                                                    onInput={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        target.value = target.value.replace(/[^0-9]/g, '');
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Email Id */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_emailId'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Email Id :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter Valid Email' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Blood Group */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_BloodGroup'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Blood Group :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select Blood Group--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                                                        <SelectItem key={bg} value={bg}>
                                                            {bg}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* Membership ID */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_MembershipId'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>Membership ID :</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Membership ID' {...field} disabled={!isAdmin} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Membership Fee */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_AmountPaid'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>Membership Fee :</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Membership Amount' {...field} disabled={!isAdmin} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Category */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_MembershipCategory'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Category :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!isAdmin}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select Category--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((c) => (
                                                        <SelectItem key={c.almmC_Id} value={c.almmC_Id.toString()}>
                                                            {c.almmC_MembershipCategory}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className='space-y-4'>
                                {/* Photo Upload Section */}
                                <div className='mb-4 grid grid-cols-2 gap-4'>
                                    {/* Profile Photo */}
                                    <div className='space-y-2'>
                                        <div className='relative flex h-32 w-full items-center justify-center overflow-hidden rounded border-2 border-primary/30 bg-muted'>
                                            {stuPhoto ? (
                                                <img src={stuPhoto} alt='Student' className='h-full w-full object-cover' />
                                            ) : (
                                                <ImageIcon className='h-12 w-12 text-muted-foreground opacity-30' />
                                            )}
                                        </div>
                                        <label className='block w-full'>
                                            <Button variant='outline' className='w-full border-primary text-primary' asChild>
                                                <span>
                                                    <Upload className='mr-2 h-4 w-4' />
                                                    Upload Profile Photo
                                                    <input
                                                        type='file'
                                                        className='hidden'
                                                        accept='image/jpeg,image/jpg,image/png'
                                                        onChange={(e) => handlePhotoUpload(e, 'stu')}
                                                    />
                                                </span>
                                            </Button>
                                        </label>
                                    </div>

                                    {/* Family Photo */}
                                    <div className='space-y-2'>
                                        <div className='relative flex h-32 w-full items-center justify-center overflow-hidden rounded border-2 border-primary/30 bg-muted'>
                                            {famPhoto ? (
                                                <img src={famPhoto} alt='Family' className='h-full w-full object-cover' />
                                            ) : (
                                                <ImageIcon className='h-12 w-12 text-muted-foreground opacity-30' />
                                            )}
                                        </div>
                                        <label className='block w-full'>
                                            <Button variant='outline' className='w-full border-primary text-primary' asChild>
                                                <span>
                                                    <Upload className='mr-2 h-4 w-4' />
                                                    Upload Family Photo
                                                    <input
                                                        type='file'
                                                        className='hidden'
                                                        accept='image/jpeg,image/jpg,image/png'
                                                        onChange={(e) => handlePhotoUpload(e, 'fam')}
                                                    />
                                                </span>
                                            </Button>
                                        </label>
                                    </div>
                                </div>

                                {/* Note */}
                                <p className='text-muted-foreground text-sm'>
                                    <span className='font-bold'>Note:</span>
                                    <span className='text-destructive'>*</span> 1. File Format JPG, JPEG and PNG Only &nbsp;&nbsp; 2. Max
                                    Size 2MB
                                </p>

                                {/* Marital Status */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_Marital_Status'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>Marital status :</FormLabel>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className='flex items-center gap-6'>
                                                <div className='flex items-center space-x-2'>
                                                    <RadioGroupItem value='1' id='married-yes' />
                                                    <Label htmlFor='married-yes'>Yes</Label>
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <RadioGroupItem value='0' id='married-no' />
                                                    <Label htmlFor='married-no'>No</Label>
                                                </div>
                                            </RadioGroup>
                                        </FormItem>
                                    )}
                                />

                                {/* Spouse Details (shown when married) */}
                                {maritalStatus === '1' && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='ALMST_SpouseName'
                                            render={({ field }) => (
                                                <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                                    <FormLabel className='text-right'>Spouse Name :</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Enter Spouse Name' {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='ALMST_SpouseContactNo'
                                            render={({ field }) => (
                                                <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                                    <FormLabel className='text-right'>Spouse Contact No :</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='Enter Spouse Contact No'
                                                            maxLength={10}
                                                            {...field}
                                                            onInput={(e) => {
                                                                const target = e.target as HTMLInputElement;
                                                                target.value = target.value.replace(/[^0-9]/g, '');
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='ALMST_SpouseEmailId'
                                            render={({ field }) => (
                                                <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                                    <FormLabel className='text-right'>Spouse Email Id :</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Enter Email Id' {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='ALMST_SpouseQulaification'
                                            render={({ field }) => (
                                                <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                                    <FormLabel className='text-right'>Spouse Qualification :</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Enter Spouse Qualification' {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='ALMST_SpouseProfession'
                                            render={({ field }) => (
                                                <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                                    <FormLabel className='text-right'>Spouse Profession :</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Enter Spouse Profession' {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='ALMST_WeddingAnniversaryDate'
                                            render={({ field }) => (
                                                <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                                    <FormLabel className='text-right'>Wedding Date:</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={'outline'}
                                                                    className={cn(
                                                                        'w-full pl-3 text-left font-normal',
                                                                        !field.value && 'text-muted-foreground'
                                                                    )}>
                                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                                    {field.value ? (
                                                                        format(field.value, 'dd/MM/yyyy')
                                                                    ) : (
                                                                        <span>Enter date</span>
                                                                    )}
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='w-auto p-0' align='start'>
                                                            <Calendar
                                                                mode='single'
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {/* Country */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_PerCountry'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Country :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={handleCountryChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select Country--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {countries.map((c) => (
                                                        <SelectItem key={c.ivrmmC_Id} value={c.ivrmmC_Id.toString()}>
                                                            {c.ivrmmC_CountryName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* State */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_PerState'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                State :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={handleStateChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select State--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {currentStates.map((s) => (
                                                        <SelectItem key={s.ivrmmS_Id} value={s.ivrmmS_Id.toString()}>
                                                            {s.ivrmmS_Name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* District */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_PerDistrict'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                District :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    updateFullAddress();
                                                }}
                                                value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select District--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {currentDistricts.map((d) => (
                                                        <SelectItem key={d.ivrmmD_Id} value={d.ivrmmD_Id.toString()}>
                                                            {d.ivrmmD_Name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* Pincode */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_ConPincode'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Pincode :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter Pincode'
                                                    maxLength={6}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        updateFullAddress();
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* City */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_ConCity'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                City :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Select or search City in the list'
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        updateFullAddress();
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* If No City Match */}
                                <div className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                    <div className='flex items-center justify-end gap-2'>
                                        <Checkbox
                                            id='noCityMatch'
                                            checked={noCityMatch}
                                            onCheckedChange={(checked) => setNoCityMatch(!!checked)}
                                        />
                                        <Label htmlFor='noCityMatch' className='text-sm'>
                                            If No City Match :
                                        </Label>
                                    </div>
                                    {noCityMatch && (
                                        <Input
                                            placeholder='Enter City Name'
                                            onChange={(e) => {
                                                form.setValue('ALMST_ConCity', e.target.value);
                                                updateFullAddress();
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Address line1 */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_ConArea'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>
                                                Address line1 :<span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter Address'
                                                    maxLength={40}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        updateFullAddress();
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Address line2 */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_ConStreet'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-center gap-4'>
                                            <FormLabel className='text-right'>Address line2 :</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter Street Name'
                                                    maxLength={40}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        updateFullAddress();
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Full Address */}
                                <FormField
                                    control={form.control}
                                    name='ALMST_FullAddess'
                                    render={({ field }) => (
                                        <FormItem className='grid grid-cols-[140px_1fr] items-start gap-4'>
                                            <FormLabel className='pt-2 text-right'>Full Address :</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder='Enter Full Address'
                                                    className='min-h-[80px] resize-none'
                                                    {...field}
                                                    disabled={!isAdmin}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Qualification & Professional Details */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    <QualificationSection form={form} states={initialStates} />
                    <div className='space-y-6'>
                        <AchievementSection form={form} />
                        <ProfessionalSection form={form} />
                    </div>
                </div>

                {/* Readmitted Section */}
                <ReadmittedSection form={form} years={years} classes={classes} />

                {/* Submit Buttons */}
                <Card className='border-2 border-primary/20'>
                    <CardContent className='p-6'>
                        <div className='flex justify-center gap-4'>
                            <Button type='submit' size='lg' className='w-32 bg-primary hover:bg-primary/90' disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className='mr-2 h-5 w-5 animate-spin' /> : <Save className='mr-2 h-5 w-5' />}
                                Save
                            </Button>
                            <Button type='button' variant='destructive' size='lg' className='w-32' onClick={onCancel}>
                                <RotateCcw className='mr-2 h-5 w-5' />
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
