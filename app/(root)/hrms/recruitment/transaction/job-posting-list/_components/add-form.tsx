'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Upload, X } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
const jobPostingSchema = z.object({
    position: z.string().min(1, 'Position is required'),
    priority: z.string().min(1, 'Priority is required'),
    qualification: z.string().min(1, 'Qualification is required'),
    noOfPosition: z.string().min(1, 'No. of Position is required'),
    jobDescription: z.string().min(1, 'Job Description is required'),
    gender: z.string().min(1, 'Gender is required'),
    remark: z.string().optional(),
    location: z.string().min(1, 'Location is required'),
    department: z.string().min(1, 'Department is required'),
    positionType: z.string().min(1, 'Position Type is required'),
    mrfNo: z.string().min(1, 'MRF No. is required'),
    skill: z.string().min(1, 'Skill is required'),
    experienceFrom: z.string().min(1, 'Experience From is required'),
    experienceTo: z.string().min(1, 'Experience To is required'),
    age: z.string().min(1, 'Age is required'),
    reason: z.string().min(1, 'Reason is required'),
    writtenTest: z.boolean().optional(),
    technicalInterview: z.boolean().optional(),
    onlineTest: z.boolean().optional()
});
type FormFields = z.infer<typeof jobPostingSchema>;
interface AddJobPostingFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
}
export default function AddJobPostingForm({ onSuccess, onCancel, className = '' }: AddJobPostingFormProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(jobPostingSchema),
        mode: 'onChange',
        defaultValues: {
            writtenTest: false,
            technicalInterview: false,
            onlineTest: false,
            location: 'HO'
        }
    });
    const onSubmit: SubmitHandler<FormFields> = async (_data) => {
        try {
            // TODO: Replace with actual API call
            toast.success('Job posting added successfully');
            reset();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to add job posting');
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4 ${className}`}>
            <div className='flex flex-col gap-5'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Left Column */}
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Position:<span className='text-red-500'>*</span>
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
                                            <SelectItem value='Software Engineer'>Software Engineer</SelectItem>
                                            <SelectItem value='Hardware Engineer'>Hardware Engineer</SelectItem>
                                            <SelectItem value='IT Executive'>IT Executive</SelectItem>
                                            <SelectItem value='Manager'>Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.position && <FormError>{errors.position.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Priority:<span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='priority'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='High'>High</SelectItem>
                                            <SelectItem value='Medium'>Medium</SelectItem>
                                            <SelectItem value='Low'>Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.priority && <FormError>{errors.priority.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Qualification:<span className='text-red-500'>*</span>
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
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                No. of Position:<span className='text-red-500'>*</span>
                            </label>
                            <InputText
                                type='number'
                                placeholder='Enter number of positions'
                                {...register('noOfPosition')}
                                error={errors.noOfPosition?.message}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Job Description:<span className='text-red-500'>*</span>
                            </label>
                            <InputTextarea placeholder='Enter job description' rows={4} {...register('jobDescription')} />
                            {errors.jobDescription && <FormError>{errors.jobDescription.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Gender:<span className='text-red-500'>*</span>
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
                                            <SelectItem value='Male'>Male</SelectItem>
                                            <SelectItem value='Female'>Female</SelectItem>
                                            <SelectItem value='Any'>Any</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.gender && <FormError>{errors.gender.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>Remark:</label>
                            <InputTextarea placeholder='Enter remarks' rows={3} {...register('remark')} />
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Location:<span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='location'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup value={field.value} onValueChange={field.onChange} className='flex flex-row gap-6'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='HO' id='ho' />
                                            <label htmlFor='ho' className='cursor-pointer font-normal text-sm'>
                                                HO
                                            </label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='Client' id='client' />
                                            <label htmlFor='client' className='cursor-pointer font-normal text-sm'>
                                                Client
                                            </label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='Location' id='location' />
                                            <label htmlFor='location' className='cursor-pointer font-normal text-sm'>
                                                Location
                                            </label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.location && <FormError>{errors.location.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Department:<span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='department'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='IT'>IT</SelectItem>
                                            <SelectItem value='HR'>HR</SelectItem>
                                            <SelectItem value='Finance'>Finance</SelectItem>
                                            <SelectItem value='Operations'>Operations</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.department && <FormError>{errors.department.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Position Type:<span className='text-red-500'>*</span>
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
                                MRF No.:<span className='text-red-500'>*</span>
                            </label>
                            <InputText placeholder='Enter MRF number' {...register('mrfNo')} error={errors.mrfNo?.message} />
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Skill:<span className='text-red-500'>*</span>
                            </label>
                            <InputText placeholder='Enter required skills' {...register('skill')} error={errors.skill?.message} />
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Experience:<span className='text-red-500'>*</span>
                            </label>
                            <div className='flex items-center gap-2'>
                                <InputText
                                    type='number'
                                    placeholder='From'
                                    {...register('experienceFrom')}
                                    error={errors.experienceFrom?.message}
                                />
                                <span className='text-sm'>
                                    to :<span className='text-red-500'>*</span>
                                </span>
                                <InputText
                                    type='number'
                                    placeholder='To'
                                    {...register('experienceTo')}
                                    error={errors.experienceTo?.message}
                                />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Age:<span className='text-red-500'>*</span>
                            </label>
                            <InputText type='number' placeholder='Enter age requirement' {...register('age')} error={errors.age?.message} />
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Reason:<span className='text-red-500'>*</span>
                            </label>
                            <InputText placeholder='Enter reason' {...register('reason')} error={errors.reason?.message} />
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>Attachment:</label>
                            <Button type='button' variant='outline' className='w-full justify-start'>
                                <Upload className='mr-2 h-4 w-4' />
                                Upload Employee Document
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Bottom Section - Checkboxes */}
                <div className='flex items-center gap-6 border-t pt-4'>
                    <div className='flex items-center space-x-2'>
                        <Checkbox id='writtenTest' {...register('writtenTest')} />
                        <label htmlFor='writtenTest' className='cursor-pointer font-medium text-sm'>
                            Written Test
                        </label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Checkbox id='technicalInterview' {...register('technicalInterview')} />
                        <label htmlFor='technicalInterview' className='cursor-pointer font-medium text-sm'>
                            Technical Interview
                        </label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Checkbox id='onlineTest' {...register('onlineTest')} />
                        <label htmlFor='onlineTest' className='cursor-pointer font-medium text-sm'>
                            Online Test
                        </label>
                    </div>
                </div>
            </div>
            <div className='flex flex-row items-center justify-center gap-2 border-t pt-4'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                        reset();
                        onCancel?.();
                    }}
                    disabled={isSubmitting}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-orange-500 text-white hover:bg-orange-600'
                    isLoading={isSubmitting}
                    loadingText='Saving...'>
                    <div className='flex items-center'>
                        <Save className='mr-2 h-4 w-4' />
                        Save & Proceed
                    </div>
                </Button>
                <Button type='button' variant='destructive' onClick={() => reset()} disabled={isSubmitting}>
                    <X className='mr-2 h-4 w-4' />
                    Clear
                </Button>
            </div>
        </form>
    );
}
