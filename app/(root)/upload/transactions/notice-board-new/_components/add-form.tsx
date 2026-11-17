'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useClassdropdowndatafee, useSectiondropdowndatafee, useacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import {
    useBusRoutingForNoticeBoard,
    useDepartmentsForNoticeBoard,
    useDesignationForNoticeBoard,
    useEmployeesForNoticeBoard,
    useGroupForNoticeBoard,
    useTermForNoticeBoard
} from '@/hooks/upload/transactions/use-notice-board';
import { cn } from '@/lib/utils';
import { noticeBoardSchemaNew } from '@/schemas/upload/transactions/notice-board.schema';
import { uploadDocument } from '@/server/fees/trasactions/waived_off';
import { saveNoticeBoard } from '@/server/upload/transactions/notice-board/server-action';
import type { feeTransactionWaivedOffStudentDetails } from '@/types/fees/transactions/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Eye, Loader2, Minus, Plus, Save, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof noticeBoardSchemaNew.addOrUpdate>;
interface AddNoticeBoardFormProps {
    onSuccess: () => void;
}

export default function AddUploadNoticeBoardForm({ onSuccess }: AddNoticeBoardFormProps) {
    const [isUrlMode, setIsUrlMode] = useState(false);
    const methods = useForm<FormFields>({
        resolver: zodResolver(noticeBoardSchemaNew.addOrUpdate),
        defaultValues: {
            intB_FilePath_Array: [{ intbfL_FilePath: '', fileName: '' }],
            intB_UrlPath_Array: [{ intbfL_FilePath: '', fileName: '' }],
            asmaY_Id: undefined,
            ntB_TTSylabusFlg: undefined,
            intB_Title: '',
            intB_Description: '',
            intB_FilePath: '',
            intB_ActiveFlag: true,
            intB_DispalyDisableFlg: true,
            check_student: true,
            check_staff: false,
            selectedStudent: true,
            asmcL_Id: [],
            asmS_Id: [],
            amsT_Id: [],
            hrmd_Id: [],
            hrmdeS_Id: [],
            hrmE_Id: [],
            ismS_Id: []
        }
    });

    const {
        control,
        handleSubmit,
        setValue,
        register,
        formState: { isSubmitting },
        reset
    } = methods;

    const {
        fields: fileFields,
        append: appendFile,
        remove: removeFile,
        update: updateFile
    } = useFieldArray({
        control,
        name: 'intB_FilePath_Array'
    });

    const {
        fields: urlFields,
        append: appendUrl,
        remove: removeUrl
    } = useFieldArray({
        control,
        name: 'intB_UrlPath_Array'
    });

    const check_student = useWatch({ control, name: 'check_student' });
    const check_staff = useWatch({ control, name: 'check_staff' });
    const selectedRoute = useWatch({ control, name: 'selectedRoute' });
    const feedefaulters = useWatch({ control, name: 'feedefaulters' });
    const intB_DispalyDisableFlg = useWatch({
        control,
        name: 'intB_DispalyDisableFlg'
    });

    const selectedClasses = useWatch({ control, name: 'asmcL_Id' }) || [];
    const selectedSections = useWatch({ control, name: 'asmS_Id' }) || [];
    const intB_FilePath = useWatch({ control, name: 'intB_FilePath' });
    const [studentDetails, setStudentDetails] = useState<feeTransactionWaivedOffStudentDetails[]>([]);

    const [studentDetailsLoading, setStudentDetailsLoading] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    const { data: academicYears, isLoading: academicYearLoading, error: academicYearError } = useacademicyerdropdowndatafee();
    useEffect(() => {
        if (academicYears) {
            if (academicYears?.data && Array.isArray(academicYears.data)) {
                const firstId = academicYears.data[0].asmaY_Id;
                setValue('asmaY_Id', firstId || 0);
            }
        }
    }, [academicYears]);

    const { data: classdata, isLoading: classloading } = useClassdropdowndatafee();
    const { data: sectiondata, isLoading: secloading } = useSectiondropdowndatafee();
    const { data: departmentdata, isLoading: departmentloading } = useDepartmentsForNoticeBoard();
    const { data: designationdata, isLoading: designationloading } = useDesignationForNoticeBoard();
    const { data: employeesdata, isLoading: employeesloading } = useEmployeesForNoticeBoard();

    const { data: routedata, isLoading: routeloading } = useBusRoutingForNoticeBoard();
    const { data: gorupdata, isLoading: grouploading } = useGroupForNoticeBoard();

    const { data: termdata, isLoading: termloading } = useTermForNoticeBoard();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only PNG, JPG, and JPEG formats are allowed');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size should not exceed 2MB');
            return;
        }

        try {
            const previewUrl = URL.createObjectURL(file);
            updateFile(index, {
                intbfL_FilePath: previewUrl,
                fileName: file.name,
                file: file.toString(),
                isUploading: true
            });

            const formData = new FormData();
            formData.append('file', file);
            formData.append('FileName', file.name);
            formData.append('ContentType', file.type);
            formData.append('subContainerName', 'fees_waivedoff_document');

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                updateFile(index, {
                    intbfL_FilePath: response.data,
                    fileName: file.name,
                    file: file.toString(),
                    isUploading: false
                });
                toast.success('Photo uploaded successfully');
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            updateFile(index, {
                intbfL_FilePath: '',
                fileName: '',
                file: '',
                isUploading: false
            });
            toast.error(`Failed to upload: ${errorMessage}`);
        } finally {
            if (fileInputRefs.current[index]) {
                fileInputRefs.current[index].value = '';
            }
        }
    };

    const handleViewImage = (imageUrl: string) => {
        setViewingImage(imageUrl);
        setIsViewing(true);
    };

    //   const fetchStudentDetails = async (data: FormFields) => {
    //     if (!data.asmaY_Id) return;
    //     if (!data.asmcL_Id) return;
    //     if (!data.asmS_Id) return;
    //     try {
    //       setStudentDetailsLoading(true);
    //       const res = await getStudentdetails(
    //         Number(data.asmaY_Id),
    //         Number(data.asmcL_Id),
    //         Number(data.asmS_Id),
    //       );
    //       setStudentDetails(res.data ?? []);
    //     } catch (error) {
    //       console.error("Error fetching student class mapping", error);
    //     } finally {
    //       setStudentDetailsLoading(false);
    //     }
    //   };

    //   useEffect(() => {
    //       fetchStudentDetails(data);
    //   }, [asmay_Id, asmcl_Id, asms_Id]);

    const onSubmit = async (data: FormFields) => {
        try {
            const result = await saveNoticeBoard(data);
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error saving notice:', error);
            toast.error('An unexpected error occurred.');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md'>
                <div className='flex flex-wrap justify-center gap-6 pb-4'>
                    <Controller
                        control={control}
                        name='check_student'
                        render={({ field }) => (
                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        // field.onChange(checked);
                                        if (checked) {
                                            //   setValue("check_staff", false);
                                            setValue('selectedRoute', false);
                                            setValue('feedefaulters', false);
                                        }
                                        if (check_staff === true) {
                                            field.onChange(checked);
                                        }
                                    }}
                                />
                                <Label className='font-normal'>Student</Label>
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name='check_staff'
                        render={({ field }) => (
                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        if (checked) {
                                            setValue('selectedRoute', false);
                                            setValue('feedefaulters', false);
                                        }
                                        if (check_student === false) {
                                            setValue('check_student', true);
                                        }
                                    }}
                                />
                                <Label className='font-normal'>Staff</Label>
                            </div>
                        )}
                    />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <Controller
                        control={control}
                        name='asmaY_Id'
                        render={({ field, fieldState }) => (
                            <div>
                                <Label>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : academicYearError ? (
                                            <SelectItem value='error' disabled>
                                                Error loading
                                            </SelectItem>
                                        ) : (
                                            academicYears?.data?.map((item: any) => (
                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                    {item.asmaY_Year}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    <Controller
                        control={control}
                        name='ntB_TTSylabusFlg'
                        render={({ field, fieldState }) => (
                            <div>
                                <Label>
                                    Notice Type <span className='text-red-500'>*</span>
                                </Label>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Notice Type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='TT'>TimeTable</SelectItem>
                                        <SelectItem value='S'>Syllabus</SelectItem>
                                        <SelectItem value='P'>Portion</SelectItem>
                                        <SelectItem value='O'>Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    <div>
                        <Label>
                            Notice Title <span className='text-red-500'>*</span>
                        </Label>
                        <Input placeholder='Enter Notice Title' {...register('intB_Title')} />
                        {methods.formState.errors.intB_Title && <FormError>{methods.formState.errors.intB_Title.message}</FormError>}
                    </div>

                    <Controller
                        control={control}
                        name='intB_StartDate'
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col'>
                                <Label>
                                    Start Date <span className='text-red-500'>*</span>
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                            {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Pick a date</span>}
                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                        <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    <Controller
                        control={control}
                        name='intB_EndDate'
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col'>
                                <Label>
                                    End Date <span className='text-red-500'>*</span>
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                            {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Pick a date</span>}
                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                        <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />
                    <div className='flex items-end pb-2'>
                        <Controller
                            control={control}
                            name='intB_DispalyDisableFlg'
                            render={({ field }) => (
                                <div className='flex items-center space-x-2'>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id='display-date-check' />
                                    <Label htmlFor='display-date-check' className='cursor-pointer font-normal'>
                                        Display Date
                                    </Label>
                                </div>
                            )}
                        />
                    </div>

                    {intB_DispalyDisableFlg && (
                        <Controller
                            control={control}
                            name='intB_DisplayDate'
                            render={({ field }) => (
                                <div className='flex flex-col'>
                                    <Label>Display Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}>
                                                {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Pick a date</span>}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <Calendar
                                                mode='single'
                                                selected={field.value || undefined}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}
                        />
                    )}
                    <div className='col-span-1 md:col-span-2 lg:col-span-3'>
                        <Label>Description</Label>
                        <Textarea placeholder='Enter Description' {...register('intB_Description')} className='min-h-[80px]' />
                    </div>
                    {check_student && (
                        <Controller
                            control={control}
                            name='selectedStudent'
                            render={({ field }) => (
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        checked={field.value}
                                        disabled
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                        }}
                                    />
                                    <Label className='font-normal'> Select Student</Label>
                                </div>
                            )}
                        />
                    )}

                    <Controller
                        control={control}
                        name='selectedRoute'
                        render={({ field }) => (
                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                    }}
                                />
                                <Label className='font-normal'> Select Route</Label>
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name='feedefaulters'
                        render={({ field }) => (
                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                    }}
                                />
                                <Label className='font-normal'>Fee Defaulters</Label>
                            </div>
                        )}
                    />
                </div>
                {check_student && (
                    <div className='space-y-4 pt-4'>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <Controller
                                control={control}
                                name='asmcL_Id'
                                render={({ field }) => (
                                    <CustomMultiSelectBox
                                        label='Class Name'
                                        isRequired
                                        isLoading={classloading}
                                        options={
                                            classdata?.data?.map((c) => ({
                                                label: c.asmcL_ClassName,
                                                value: c.asmcL_Id.toString()
                                            })) || []
                                        }
                                        value={field.value?.map((v) => v.asmcL_Id.toString()) || []}
                                        onChange={(vals) => {
                                            field.onChange(vals.map((v) => ({ asmcL_Id: Number(v) })));
                                            setValue('asmS_Id', []);
                                            setValue('ismS_Id', []);
                                            setValue('amsT_Id', []);
                                        }}
                                        isSearchRequired
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='asmS_Id'
                                render={({ field }) => (
                                    <CustomMultiSelectBox
                                        label='Section Name'
                                        isRequired
                                        isLoading={secloading}
                                        options={
                                            sectiondata?.data?.map((c) => ({
                                                label: c.asmC_SectionName,
                                                value: c.asmS_Id.toString()
                                            })) || []
                                        }
                                        value={field.value?.map((v) => v.asmS_Id.toString()) || []}
                                        onChange={(vals) => {
                                            field.onChange(vals.map((v) => ({ asmS_Id: Number(v) })));
                                            setValue('ismS_Id', []);
                                            setValue('amsT_Id', []);
                                        }}
                                        isSearchRequired
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='amsT_Id'
                                render={({ field }) => (
                                    <CustomMultiSelectBox
                                        label='Student Name'
                                        isRequired
                                        isLoading={studentDetailsLoading}
                                        options={
                                            studentDetails?.map((c) => ({
                                                label: c.studentName,
                                                value: c.amsT_Id.toString()
                                            })) || []
                                        }
                                        value={field.value?.map((v) => v.amsT_Id.toString()) || []}
                                        onChange={(vals) => {
                                            field.onChange(vals.map((v) => ({ asmS_Id: Number(v) })));
                                            setValue('ismS_Id', []);
                                            setValue('amsT_Id', []);
                                        }}
                                        isSearchRequired
                                    />
                                )}
                            />
                            {selectedRoute === true && (
                                <Controller
                                    control={control}
                                    name='routeList'
                                    render={({ field }) => (
                                        <CustomMultiSelectBox
                                            label='Route Name'
                                            isRequired
                                            isLoading={routeloading}
                                            options={
                                                routedata?.data?.map((c) => ({
                                                    label: c.trmR_RouteName,
                                                    value: c.trmR_Id.toString()
                                                })) || []
                                            }
                                            value={field.value?.map((v) => v.trmR_Id.toString()) || []}
                                            onChange={(vals) => {
                                                field.onChange(vals.map((v) => ({ routeList: Number(v) })));
                                                setValue('ismS_Id', []);
                                                setValue('amsT_Id', []);
                                            }}
                                            isSearchRequired
                                        />
                                    )}
                                />
                            )}

                            {feedefaulters === true && (
                                <Controller
                                    control={control}
                                    name='feeGroupList'
                                    render={({ field }) => (
                                        <CustomMultiSelectBox
                                            label='Fee Group Name'
                                            isRequired
                                            isLoading={grouploading}
                                            options={
                                                gorupdata?.data?.map((c) => ({
                                                    label: c.fmG_GroupName,
                                                    value: c.fmG_Id.toString()
                                                })) || []
                                            }
                                            value={field.value?.map((v) => v.fmg_Id.toString()) || []}
                                            onChange={(vals) => {
                                                field.onChange(vals.map((v) => ({ feeGroupList: Number(v) })));
                                                setValue('ismS_Id', []);
                                                setValue('amsT_Id', []);
                                            }}
                                            isSearchRequired
                                        />
                                    )}
                                />
                            )}

                            {feedefaulters === true && (
                                <Controller
                                    control={control}
                                    name='feeTermList'
                                    render={({ field }) => (
                                        <CustomMultiSelectBox
                                            label='Fee Term Name'
                                            isRequired
                                            isLoading={termloading}
                                            options={
                                                termdata?.data?.map((c) => ({
                                                    label: c.fmT_Name,
                                                    value: c.fmT_Id.toString()
                                                })) || []
                                            }
                                            value={field.value?.map((v) => v.fmT_Id.toString()) || []}
                                            onChange={(vals) => {
                                                field.onChange(vals.map((v) => ({ feeTermList: Number(v) })));
                                                setValue('ismS_Id', []);
                                                setValue('amsT_Id', []);
                                            }}
                                            isSearchRequired
                                        />
                                    )}
                                />
                            )}
                        </div>
                    </div>
                )}

                {check_staff && (
                    <div className='grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3'>
                        <Controller
                            control={control}
                            name='hrmd_Id'
                            render={({ field }) => (
                                <CustomMultiSelectBox
                                    label='Department Name'
                                    isRequired
                                    isLoading={departmentloading}
                                    options={
                                        departmentdata?.data?.map((c: any) => ({
                                            label: c.value,
                                            value: c.key.toString()
                                        })) || []
                                    }
                                    value={field.value?.map((v) => v.hrmd_Id.toString()) || []}
                                    onChange={(vals) => {
                                        field.onChange(vals.map((v) => ({ hrmd_Id: Number(v) })));
                                        setValue('hrmdeS_Id', []);
                                        setValue('hrmE_Id', []);
                                    }}
                                    isSearchRequired
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='hrmdeS_Id'
                            render={({ field }) => (
                                <CustomMultiSelectBox
                                    label='Designation Name'
                                    isRequired
                                    isLoading={designationloading}
                                    options={
                                        designationdata?.data?.map((d: any) => ({
                                            label: d.value,
                                            value: d.key.toString()
                                        })) || []
                                    }
                                    value={field.value?.map((v) => v.hrmdeS_Id.toString()) || []}
                                    onChange={(vals) => {
                                        field.onChange(vals.map((v) => ({ hrmdeS_Id: Number(v) })));
                                        setValue('hrmE_Id', []);
                                    }}
                                    isSearchRequired
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='hrmE_Id'
                            render={({ field }) => (
                                <CustomMultiSelectBox
                                    label='Employee Name'
                                    isRequired
                                    isLoading={employeesloading}
                                    options={
                                        employeesdata?.data?.map((s: any) => ({
                                            label: s.value,
                                            value: s.key.toString()
                                        })) || []
                                    }
                                    value={field.value?.map((v) => v.hrmE_Id.toString()) || []}
                                    onChange={(vals) => field.onChange(vals.map((v) => ({ hrmE_Id: Number(v) })))}
                                    isSearchRequired
                                />
                            )}
                        />
                    </div>
                )}

                <div className='space-y-4 rounded-md border p-4'>
                    <h3 className='font-semibold text-lg'>Attachments</h3>
                    <div className='overflow-x-auto'>
                        <table className='w-full table-auto border-collapse border text-left text-sm'>
                            <thead className='bg-muted'>
                                <tr>
                                    <th className='w-12 border p-2 text-center'>SL. NO</th>
                                    <th className='border p-2 text-center'>Upload File</th>
                                    <th className='border p-2 text-center'>File Name</th>
                                    <th className='w-16 border p-2 text-center'>View</th>
                                    <th className='w-16 border p-2 text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fileFields.map((item, index) => (
                                    <tr key={item.id} className='border-b'>
                                        <td className='border p-2 text-center'>{index + 1}</td>
                                        <td className='border p-2'>
                                            <div className='flex justify-center'>
                                                <input
                                                    ref={(el) => {
                                                        fileInputRefs.current[index] = el;
                                                    }}
                                                    type='file'
                                                    accept='image/*'
                                                    className='hidden'
                                                    onChange={(e) => handleFileUpload(e, index)}
                                                />
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => fileInputRefs.current[index]?.click()}
                                                    className='h-8'
                                                    disabled={item.isUploading}>
                                                    {item.isUploading ? (
                                                        <>
                                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className='mr-2 h-4 w-4' />
                                                            Choose File
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                        <td className='border p-2'>
                                            <Controller
                                                control={control}
                                                name={`intB_FilePath_Array.${index}.fileName`}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        disabled
                                                        placeholder='No file chosen'
                                                        className='h-9 bg-muted text-xs'
                                                        value={field.value || ''}
                                                    />
                                                )}
                                            />
                                        </td>
                                        <td className='border p-2 text-center'>
                                            <Controller
                                                control={control}
                                                name={`intB_FilePath_Array.${index}.intbfL_FilePath`}
                                                render={({ field }) => (
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => handleViewImage(field.value)}
                                                        disabled={!field.value || item.isUploading}
                                                        className={!field.value ? 'cursor-not-allowed opacity-50' : ''}>
                                                        {item.isUploading ? (
                                                            <Loader2 className='h-4 w-4 animate-spin text-gray-400' />
                                                        ) : (
                                                            <Eye className='h-4 w-4 text-blue-600' />
                                                        )}
                                                    </Button>
                                                )}
                                            />
                                        </td>
                                        <td className='border p-2 text-center'>
                                            <div className='flex justify-center gap-1'>
                                                {fileFields.length > 1 && (
                                                    <Button
                                                        type='button'
                                                        size='icon'
                                                        variant='destructive'
                                                        className='h-8 w-8'
                                                        onClick={() => removeFile(index)}
                                                        disabled={item.isUploading}>
                                                        <Minus className='h-4 w-4' />
                                                    </Button>
                                                )}
                                                {index === fileFields.length - 1 && (
                                                    <Button
                                                        type='button'
                                                        size='icon'
                                                        variant='outline'
                                                        className='h-8 w-8'
                                                        onClick={() =>
                                                            appendFile({
                                                                intbfL_FilePath: '',
                                                                fileName: '',
                                                                file: '',
                                                                isUploading: false
                                                            })
                                                        }>
                                                        <Plus className='h-4 w-4' />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {isViewing && viewingImage && (
                            <div
                                onClick={() => {
                                    setIsViewing(false);
                                    setViewingImage(null);
                                }}
                                className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'>
                                <img src={viewingImage} alt='preview' className='max-h-[90%] max-w-[90%] rounded-lg shadow-lg' />
                                <Button
                                    onClick={() => {
                                        setIsViewing(false);
                                        setViewingImage(null);
                                    }}
                                    className='absolute top-4 right-4'
                                    variant='destructive'
                                    size='icon'>
                                    <X className='h-4 w-4' />
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className='flex items-center space-x-2 pt-2'>
                        <Checkbox id='url-mode-check' checked={isUrlMode} onCheckedChange={(c) => setIsUrlMode(c as boolean)} />
                        <Label htmlFor='url-mode-check' className='font-semibold text-xs'>
                            If URL
                        </Label>
                    </div>

                    {isUrlMode && (
                        <div className='overflow-x-auto'>
                            <table className='w-full table-auto border-collapse border text-left text-sm'>
                                <thead className='bg-muted'>
                                    <tr>
                                        <th className='w-12 border p-2 text-center'>SL NO</th>
                                        <th className='border p-2 text-center'>URL</th>
                                        <th className='w-16 border p-2 text-center'>View</th>
                                        <th className='w-16 border p-2 text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {urlFields.map((item, index) => (
                                        <tr key={item.id} className='border-b'>
                                            <td className='border p-2 text-center'>{index + 1}</td>
                                            <td className='border p-2'>
                                                <Controller
                                                    control={control}
                                                    name={`intB_FilePath_Array.${index}.intbfL_FilePath`}
                                                    render={({ field }) => <Input {...field} placeholder='Enter URL' className='h-9' />}
                                                />
                                            </td>
                                            <td className='border p-2 text-center'>
                                                <Controller
                                                    control={control}
                                                    name={`intB_FilePath_Array.${index}.intbfL_FilePath`}
                                                    render={({ field }) => (
                                                        <Button
                                                            type='button'
                                                            variant='ghost'
                                                            size='sm'
                                                            onClick={() => {
                                                                field.value?.startsWith('http')
                                                                    ? window.open(field.value, '_blank')
                                                                    : toast.error('No File Found');
                                                            }}>
                                                            <Eye className='h-4 w-4 text-blue-600' />
                                                        </Button>
                                                    )}
                                                />
                                                {/* <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          // onClick={() => window.open(field.value, '_blank')}
                          // disabled={!field?.value}
                        >
                          <Eye className="h-4 w-4" />
                        </Button> */}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                <div className='flex justify-center gap-1'>
                                                    {index === urlFields.length - 1 && (
                                                        <Button
                                                            type='button'
                                                            size='icon'
                                                            variant='outline'
                                                            className='h-8 w-8'
                                                            onClick={() => appendUrl({ intbfL_FilePath: '', fileName: '' })}>
                                                            <Plus className='h-4 w-4' />
                                                        </Button>
                                                    )}
                                                    {urlFields.length > 1 && (
                                                        <Button
                                                            type='button'
                                                            size='icon'
                                                            variant='destructive'
                                                            className='h-8 w-8'
                                                            onClick={() => removeUrl(index)}
                                                            disabled={urlFields.length === 1}>
                                                            <Minus className='h-4 w-4' />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button type='button' size='lg' variant='outline' onClick={handleReset} disabled={isSubmitting} className='px-12'>
                        Reset
                    </Button>
                    <Button type='submit' disabled={isSubmitting} className='px-12' isLoading={isSubmitting} loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className=' h-4 w-4' />
                            Save
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
