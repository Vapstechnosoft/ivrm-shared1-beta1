'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    FileImage,
    GraduationCap,
    MessageSquare,
    Plus,
    Save,
    Trash2,
    Upload,
    User,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { Candidate, DocumentDetail, ExperienceDetail, FamilyDetail, LanguageDetail, QualificationDetail } from './columns';
const candidateSchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last Name is required'),
    skill: z.string().min(1, 'Skill is required'),
    mobileNo: z.string().min(1, 'Mobile No is required'),
    emailId: z.string().email('Invalid email').min(1, 'Email Id is required'),
    qualification: z.string().min(1, 'Qualification is required'),
    jobTitle: z.string().min(1, 'Job Title is required'),
    currentCompany: z.string().optional(),
    totalExp: z.string().min(1, 'Total Experience is required'),
    lastCTC: z.string().min(1, 'Last CTC is required'),
    expectedCTC: z.string().min(1, 'Expected CTC is required'),
    applicationDate: z.string().min(1, 'Application Date is required'),
    interviewDate: z.string().min(1, 'Interview Date is required'),
    dateOfBirth: z.string().min(1, 'Date of Birth is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    religion: z.string().min(1, 'Religion is required'),
    caste: z.string().min(1, 'Caste is required'),
    gender: z.string().min(1, 'Gender is required'),
    maritalStatus: z.string().min(1, 'Marital Status is required'),
    bloodGroup: z.string().min(1, 'Blood Group is required'),
    positionType: z.string().min(1, 'Position Type is required'),
    position: z.string().min(1, 'Position is required'),
    aadharNo: z.string().optional(),
    panCardNo: z.string().optional(),
    refHR: z.string().min(1, 'Ref. Employee is required'),
    source: z.string().optional(),
    remark: z.string().optional(),
    consultency: z.string().optional(),
    resumeCV: z.string().optional(),
    localAddressLine1: z.string().min(1, 'Local Address Line 1 is required'),
    localAddressLine2: z.string().optional(),
    localPlace: z.string().min(1, 'Local Place is required'),
    localPincode: z.string().min(1, 'Local Pincode is required'),
    permanentAddressLine1: z.string().min(1, 'Permanent Address Line 1 is required'),
    permanentAddressLine2: z.string().optional(),
    permanentPlace: z.string().min(1, 'Permanent Place is required'),
    permanentPincode: z.string().min(1, 'Permanent Pincode is required'),
    sameAsLocalAddress: z.boolean().optional()
});
type FormFields = z.infer<typeof candidateSchema>;
interface AddCandidateFormProps {
    rowData?: Candidate | null;
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
}
const tabs = [
    { id: 'candidate', name: 'Candidate', icon: User },
    { id: 'qualification', name: 'Qualification', icon: GraduationCap },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'family', name: 'Family', icon: Users },
    { id: 'language', name: 'Language', icon: MessageSquare },
    { id: 'documents', name: 'Documents', icon: FileImage }
];
export default function AddCandidateForm({ rowData, onSuccess, onCancel, className = '' }: AddCandidateFormProps) {
    const [currentTab, setCurrentTab] = useState('candidate');
    const [qualifications, setQualifications] = useState<QualificationDetail[]>([]);
    const [experiences, setExperiences] = useState<ExperienceDetail[]>([]);
    const [familyMembers, setFamilyMembers] = useState<FamilyDetail[]>([]);
    const [languages, setLanguages] = useState<LanguageDetail[]>([]);
    const [documents, setDocuments] = useState<DocumentDetail[]>([]);
    const [hasExperience, setHasExperience] = useState(false);
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(candidateSchema),
        mode: 'onChange',
        defaultValues: {
            sameAsLocalAddress: false,
            applicationDate: new Date().toISOString().split('T')[0],
            interviewDate: new Date().toISOString().split('T')[0]
        }
    });
    const sameAsLocalAddress = watch('sameAsLocalAddress');
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // TODO: Replace with actual API call
            const _candidateData = {
                ...data,
                qualifications,
                experiences,
                familyMembers,
                languages,
                documents,
                status: 'New'
            };
            toast.success(rowData ? 'Candidate updated successfully' : 'Candidate added successfully');
            reset();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save candidate');
        }
    };
    const handleClear = () => {
        reset();
        setQualifications([]);
        setExperiences([]);
        setFamilyMembers([]);
        setLanguages([]);
        setDocuments([]);
        setHasExperience(false);
        toast.info('Form cleared');
    };
    const addQualification = () => {
        setQualifications([
            ...qualifications,
            {
                id: qualifications.length + 1,
                qualification: '',
                board: '',
                year: '',
                percentage: ''
            }
        ]);
    };
    const removeQualification = (index: number) => {
        setQualifications(qualifications.filter((_, i) => i !== index));
    };
    const addExperience = () => {
        setExperiences([
            ...experiences,
            {
                id: experiences.length + 1,
                company: '',
                designation: '',
                from: '',
                to: '',
                experience: ''
            }
        ]);
    };
    const removeExperience = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };
    const addFamilyMember = () => {
        setFamilyMembers([
            ...familyMembers,
            {
                id: familyMembers.length + 1,
                name: '',
                relation: '',
                occupation: '',
                contactNo: ''
            }
        ]);
    };
    const removeFamilyMember = (index: number) => {
        setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    };
    const addLanguage = () => {
        setLanguages([
            ...languages,
            {
                id: languages.length + 1,
                language: '',
                read: false,
                write: false,
                speak: false
            }
        ]);
    };
    const removeLanguage = (index: number) => {
        setLanguages(languages.filter((_, i) => i !== index));
    };
    const addDocument = () => {
        setDocuments([
            ...documents,
            {
                id: documents.length + 1,
                documentType: '',
                fileName: '',
                filePath: ''
            }
        ]);
    };
    const removeDocument = (index: number) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };
    const handlePrevious = () => {
        const currentIndex = tabs.findIndex((tab) => tab.id === currentTab);
        if (currentIndex > 0) {
            setCurrentTab(tabs[currentIndex - 1].id);
        }
    };
    const handleNext = () => {
        const currentIndex = tabs.findIndex((tab) => tab.id === currentTab);
        if (currentIndex < tabs.length - 1) {
            setCurrentTab(tabs[currentIndex + 1].id);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4 ${className}`}>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className='w-full'>
                <TabsList className='grid w-full grid-cols-6'>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <TabsTrigger key={tab.id} value={tab.id} className='flex items-center gap-2'>
                                <Icon className='h-4 w-4' />
                                {tab.name}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                {/* Candidate Tab */}
                <TabsContent value='candidate' className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        <InputText
                            label='First Name'
                            required
                            placeholder='Enter first name'
                            {...register('firstName')}
                            error={errors.firstName?.message}
                        />
                        <InputText label='Middle Name' placeholder='Enter middle name' {...register('middleName')} />
                        <InputText
                            label='Last Name'
                            required
                            placeholder='Enter last name'
                            {...register('lastName')}
                            error={errors.lastName?.message}
                        />
                        <InputText label='Skill' required placeholder='Enter skills' {...register('skill')} error={errors.skill?.message} />
                        <InputText
                            label='Mobile No'
                            required
                            placeholder='Enter mobile number'
                            {...register('mobileNo')}
                            error={errors.mobileNo?.message}
                        />
                        <InputText
                            label='Email Id'
                            required
                            type='email'
                            placeholder='Enter email'
                            {...register('emailId')}
                            error={errors.emailId?.message}
                        />
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Qualification <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='qualification'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='UG'>UG</SelectItem>
                                            <SelectItem value='PG'>PG</SelectItem>
                                            <SelectItem value='PhD'>PhD</SelectItem>
                                            <SelectItem value='Diploma'>Diploma</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.qualification && <FormError>{errors.qualification.message}</FormError>}
                        </div>
                        <InputText label='Job Portal Name' placeholder='Enter job portal name' {...register('currentCompany')} />
                        <InputText label='Current Company' placeholder='Enter current company' {...register('currentCompany')} />
                        <InputText
                            label='Total Exp.'
                            required
                            placeholder='Enter total experience'
                            {...register('totalExp')}
                            error={errors.totalExp?.message}
                        />
                        <InputText
                            label='Last CTC'
                            required
                            placeholder='Enter last CTC'
                            {...register('lastCTC')}
                            error={errors.lastCTC?.message}
                        />
                        <InputText
                            label='Expected CTC'
                            required
                            placeholder='Enter expected CTC'
                            {...register('expectedCTC')}
                            error={errors.expectedCTC?.message}
                        />
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Application Date <span className='text-red-500'>*</span>
                            </label>
                            <InputText type='date' {...register('applicationDate')} error={errors.applicationDate?.message} />
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Interview Date <span className='text-red-500'>*</span>
                            </label>
                            <InputText type='date' {...register('interviewDate')} error={errors.interviewDate?.message} />
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Date of Birth <span className='text-red-500'>*</span>
                            </label>
                            <InputText type='date' {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Nationality <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='nationality'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='India'>India</SelectItem>
                                            <SelectItem value='Other'>Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.nationality && <FormError>{errors.nationality.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Religion <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='religion'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='HINDU'>HINDU</SelectItem>
                                            <SelectItem value='MUSLIM'>MUSLIM</SelectItem>
                                            <SelectItem value='CHRISTIAN'>CHRISTIAN</SelectItem>
                                            <SelectItem value='SIKH'>SIKH</SelectItem>
                                            <SelectItem value='OTHER'>OTHER</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.religion && <FormError>{errors.religion.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Caste <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='caste'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='General'>General</SelectItem>
                                            <SelectItem value='OBC'>OBC</SelectItem>
                                            <SelectItem value='SC'>SC</SelectItem>
                                            <SelectItem value='ST'>ST</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.caste && <FormError>{errors.caste.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Gender <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='gender'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='MALE'>MALE</SelectItem>
                                            <SelectItem value='FEMALE'>FEMALE</SelectItem>
                                            <SelectItem value='OTHER'>OTHER</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.gender && <FormError>{errors.gender.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Marital Status <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='maritalStatus'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='MARRIED'>MARRIED</SelectItem>
                                            <SelectItem value='SINGLE'>SINGLE</SelectItem>
                                            <SelectItem value='DIVORCED'>DIVORCED</SelectItem>
                                            <SelectItem value='WIDOWED'>WIDOWED</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.maritalStatus && <FormError>{errors.maritalStatus.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Blood Group <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='bloodGroup'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='A+'>A+</SelectItem>
                                            <SelectItem value='A-'>A-</SelectItem>
                                            <SelectItem value='B+'>B+</SelectItem>
                                            <SelectItem value='B-'>B-</SelectItem>
                                            <SelectItem value='AB+'>AB+</SelectItem>
                                            <SelectItem value='AB-'>AB-</SelectItem>
                                            <SelectItem value='O+'>O+</SelectItem>
                                            <SelectItem value='O-'>O-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.bloodGroup && <FormError>{errors.bloodGroup.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Job Title <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='jobTitle'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Software Engineer'>Software Engineer</SelectItem>
                                            <SelectItem value='Hardware Engineer'>Hardware Engineer</SelectItem>
                                            <SelectItem value='IT Executive'>IT Executive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.jobTitle && <FormError>{errors.jobTitle.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Position Type <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='positionType'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Permanent'>Permanent</SelectItem>
                                            <SelectItem value='Contract'>Contract</SelectItem>
                                            <SelectItem value='Part-time'>Part-time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.positionType && <FormError>{errors.positionType.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Position <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='position'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Junior'>Junior</SelectItem>
                                            <SelectItem value='Senior'>Senior</SelectItem>
                                            <SelectItem value='Lead'>Lead</SelectItem>
                                            <SelectItem value='Manager'>Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.position && <FormError>{errors.position.message}</FormError>}
                        </div>
                        <InputText label='Aadhar No' placeholder='Enter Aadhar number' {...register('aadharNo')} />
                        <InputText label='PAN Card No' placeholder='Enter PAN number' {...register('panCardNo')} />
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Ref. Employee <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='refHR'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='HR1'>HR Manager 1</SelectItem>
                                            <SelectItem value='HR2'>HR Manager 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.refHR && <FormError>{errors.refHR.message}</FormError>}
                        </div>
                        <InputText label='Source' placeholder='Enter source' {...register('source')} />
                        <InputText label='Remark' placeholder='Enter remark' {...register('remark')} />
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>Consultency</label>
                            <Controller
                                name='consultency'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Internal'>Internal</SelectItem>
                                            <SelectItem value='External'>External</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Resume/CV <span className='text-red-500'>*</span>
                            </label>
                            <div className='flex items-center gap-3'>
                                <Button type='button' variant='outline' size='sm'>
                                    <Upload className='mr-2 h-4 w-4' />
                                    Choose File
                                </Button>
                                <span className='text-muted-foreground text-sm'>No file chosen</span>
                            </div>
                        </div>
                    </div>
                    {/* Photo Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-sm'>Upload Photo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-32 w-32 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed'>
                                    <div className='text-center'>
                                        <Upload className='mx-auto h-8 w-8 text-gray-400' />
                                        <p className='mt-2 text-gray-500 text-xs'>Upload Photo</p>
                                    </div>
                                </div>
                                <Button type='button' variant='outline'>
                                    Choose File
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Address Section */}
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-sm'>LOCAL ADDRESS</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <InputText
                                    label='Address Line 1'
                                    required
                                    placeholder='Enter address line 1'
                                    {...register('localAddressLine1')}
                                    error={errors.localAddressLine1?.message}
                                />
                                <InputText label='Address Line 2' placeholder='Enter address line 2' {...register('localAddressLine2')} />
                                <InputText
                                    label='Place'
                                    required
                                    placeholder='Enter place'
                                    {...register('localPlace')}
                                    error={errors.localPlace?.message}
                                />
                                <InputText
                                    label='Pincode'
                                    required
                                    placeholder='Enter pincode'
                                    {...register('localPincode')}
                                    error={errors.localPincode?.message}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2 text-sm'>
                                    PERMANENT ADDRESS
                                    <div className='flex items-center gap-2'>
                                        <Checkbox
                                            checked={sameAsLocalAddress}
                                            onCheckedChange={(checked) => setValue('sameAsLocalAddress', !!checked)}
                                        />
                                        <span className='text-xs'>Same as Local Address ?</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <InputText
                                    label='Address Line 1'
                                    required
                                    placeholder='Enter address line 1'
                                    {...register('permanentAddressLine1')}
                                    error={errors.permanentAddressLine1?.message}
                                    disabled={sameAsLocalAddress}
                                />
                                <InputText
                                    label='Address Line 2'
                                    placeholder='Enter address line 2'
                                    {...register('permanentAddressLine2')}
                                    disabled={sameAsLocalAddress}
                                />
                                <InputText
                                    label='Place'
                                    required
                                    placeholder='Enter place'
                                    {...register('permanentPlace')}
                                    error={errors.permanentPlace?.message}
                                    disabled={sameAsLocalAddress}
                                />
                                <InputText
                                    label='Pincode'
                                    required
                                    placeholder='Enter pincode'
                                    {...register('permanentPincode')}
                                    error={errors.permanentPincode?.message}
                                    disabled={sameAsLocalAddress}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                {/* Qualification Tab */}
                <TabsContent value='qualification' className='space-y-4'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle className='text-sm'>CANDIDATE QUALIFICATION DETAILS</CardTitle>
                            <Button type='button' onClick={addQualification} size='sm'>
                                <Plus className='h-4 w-4' />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {qualifications.map((qual, index) => (
                                    <div key={index} className='grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-5'>
                                        <div className='font-medium'>Serial No. {qual.id}</div>
                                        <InputText
                                            placeholder='Course*'
                                            value={qual.qualification}
                                            onChange={(e) => {
                                                const newQuals = [...qualifications];
                                                newQuals[index].qualification = e.target.value;
                                                setQualifications(newQuals);
                                            }}
                                        />
                                        <InputText
                                            placeholder='Board Name*'
                                            value={qual.board}
                                            onChange={(e) => {
                                                const newQuals = [...qualifications];
                                                newQuals[index].board = e.target.value;
                                                setQualifications(newQuals);
                                            }}
                                        />
                                        <InputText
                                            placeholder='Year Of Passing*'
                                            value={qual.year}
                                            onChange={(e) => {
                                                const newQuals = [...qualifications];
                                                newQuals[index].year = e.target.value;
                                                setQualifications(newQuals);
                                            }}
                                        />
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => removeQualification(index)}
                                            className='text-red-600 hover:text-red-800'>
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Experience Tab */}
                <TabsContent value='experience' className='space-y-4'>
                    <div className='flex items-center gap-2'>
                        <Checkbox checked={hasExperience} onCheckedChange={(checked) => setHasExperience(!!checked)} />
                        <label className='font-medium text-sm'>Candidate Having Experience?</label>
                    </div>
                    {hasExperience && (
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between'>
                                <CardTitle className='text-sm'>CANDIDATE EXPERIENCE DETAILS</CardTitle>
                                <Button type='button' onClick={addExperience} size='sm'>
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    {experiences.map((exp, index) => (
                                        <div key={index} className='grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-6'>
                                            <div className='font-medium'>Serial No. {exp.id}</div>
                                            <InputText
                                                placeholder='Company Name'
                                                value={exp.company}
                                                onChange={(e) => {
                                                    const newExps = [...experiences];
                                                    newExps[index].company = e.target.value;
                                                    setExperiences(newExps);
                                                }}
                                            />
                                            <InputText
                                                placeholder='Designation'
                                                value={exp.designation}
                                                onChange={(e) => {
                                                    const newExps = [...experiences];
                                                    newExps[index].designation = e.target.value;
                                                    setExperiences(newExps);
                                                }}
                                            />
                                            <InputText
                                                type='date'
                                                placeholder='Date of Join'
                                                value={exp.from}
                                                onChange={(e) => {
                                                    const newExps = [...experiences];
                                                    newExps[index].from = e.target.value;
                                                    setExperiences(newExps);
                                                }}
                                            />
                                            <InputText
                                                type='date'
                                                placeholder='Date of Leave'
                                                value={exp.to}
                                                onChange={(e) => {
                                                    const newExps = [...experiences];
                                                    newExps[index].to = e.target.value;
                                                    setExperiences(newExps);
                                                }}
                                            />
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => removeExperience(index)}
                                                className='text-red-600 hover:text-red-800'>
                                                <Trash2 className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                {/* Family Tab */}
                <TabsContent value='family' className='space-y-4'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle className='text-sm'>CANDIDATE FAMILY DETAILS</CardTitle>
                            <Button type='button' onClick={addFamilyMember} size='sm'>
                                <Plus className='h-4 w-4' />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {familyMembers.map((member, index) => (
                                    <div key={index} className='grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-6'>
                                        <div className='font-medium'>Serial No. {member.id}</div>
                                        <InputText
                                            placeholder='Family Member Name*'
                                            value={member.name}
                                            onChange={(e) => {
                                                const newMembers = [...familyMembers];
                                                newMembers[index].name = e.target.value;
                                                setFamilyMembers(newMembers);
                                            }}
                                        />
                                        <InputText
                                            placeholder='Relationship*'
                                            value={member.relation}
                                            onChange={(e) => {
                                                const newMembers = [...familyMembers];
                                                newMembers[index].relation = e.target.value;
                                                setFamilyMembers(newMembers);
                                            }}
                                        />
                                        <InputText
                                            placeholder='Occupation*'
                                            value={member.occupation}
                                            onChange={(e) => {
                                                const newMembers = [...familyMembers];
                                                newMembers[index].occupation = e.target.value;
                                                setFamilyMembers(newMembers);
                                            }}
                                        />
                                        <InputText
                                            placeholder='Work Place'
                                            value={member.contactNo}
                                            onChange={(e) => {
                                                const newMembers = [...familyMembers];
                                                newMembers[index].contactNo = e.target.value;
                                                setFamilyMembers(newMembers);
                                            }}
                                        />
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => removeFamilyMember(index)}
                                            className='text-red-600 hover:text-red-800'>
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Language Tab */}
                <TabsContent value='language' className='space-y-4'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle className='text-sm'>CANDIDATE LANGUAGE DETAILS</CardTitle>
                            <Button type='button' onClick={addLanguage} size='sm'>
                                <Plus className='h-4 w-4' />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {languages.map((lang, index) => (
                                    <div key={index} className='grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-5'>
                                        <div className='font-medium'>Serial No. {lang.id}</div>
                                        <InputText
                                            placeholder='To Read'
                                            value={lang.language}
                                            onChange={(e) => {
                                                const newLangs = [...languages];
                                                newLangs[index].language = e.target.value;
                                                setLanguages(newLangs);
                                            }}
                                        />
                                        <InputText
                                            placeholder='To Write'
                                            value={lang.language}
                                            onChange={(e) => {
                                                const newLangs = [...languages];
                                                newLangs[index].language = e.target.value;
                                                setLanguages(newLangs);
                                            }}
                                        />
                                        <InputText
                                            placeholder='To Speak'
                                            value={lang.language}
                                            onChange={(e) => {
                                                const newLangs = [...languages];
                                                newLangs[index].language = e.target.value;
                                                setLanguages(newLangs);
                                            }}
                                        />
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => removeLanguage(index)}
                                            className='text-red-600 hover:text-red-800'>
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Documents Tab */}
                <TabsContent value='documents' className='space-y-4'>
                    <div className='text-red-500 text-xs'>
                        <p>* File Must Be Upload jpeg, Png, pdf, Document</p>
                        <p>* File size should be less than 5 MB</p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-sm'>Final Submission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {documents.map((doc, index) => (
                                    <div key={index} className='grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-5'>
                                        <div className='font-medium'>Sl.No. {doc.id}</div>
                                        <Button type='button' variant='outline' className='bg-yellow-400 text-black'>
                                            Choose File
                                        </Button>
                                        <div>View</div>
                                        <InputText
                                            placeholder='Remark'
                                            value={doc.documentType}
                                            onChange={(e) => {
                                                const newDocs = [...documents];
                                                newDocs[index].documentType = e.target.value;
                                                setDocuments(newDocs);
                                            }}
                                        />
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => removeDocument(index)}
                                            className='text-red-600 hover:text-red-800'>
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                ))}
                                <Button type='button' onClick={addDocument} size='sm'>
                                    <Plus className='h-4 w-4' />
                                    Add Document
                                </Button>
                            </div>
                            <div className='mt-6 rounded-lg bg-gray-50 p-4'>
                                <div className='space-y-2 text-sm'>
                                    <p>
                                        I consent to the collection and use of my personal data in accordance with the company's privacy
                                        policy.
                                    </p>
                                    <p>I acknowledge that I have received and understood the company's code of conduct.</p>
                                    <p>I agree to comply with all company policies and procedures.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            {/* Form Actions */}
            <div className='flex flex-row items-center justify-center gap-2 border-t pt-6'>
                <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
                {currentTab !== 'candidate' && (
                    <Button type='button' variant='outline' onClick={handlePrevious} disabled={isSubmitting}>
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        Previous
                    </Button>
                )}
                {currentTab !== 'documents' ? (
                    <Button
                        type='button'
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className='bg-orange-500 text-white hover:bg-orange-600'>
                        Save & Proceed
                        <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                ) : (
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        className='bg-orange-500 text-white hover:bg-orange-600'>
                        <Save className='mr-2 h-4 w-4' />
                        Save & Proceed
                    </Button>
                )}
                <Button type='button' variant='destructive' onClick={handleClear} disabled={isSubmitting}>
                    <X className='mr-2 h-4 w-4' />
                    Clear
                </Button>
            </div>
        </form>
    );
}
