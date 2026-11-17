'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { useClassDropdownDropdown, useFeeSectionListDefaulterreport } from '@/hooks/fees/useReports';
import { ClassWorkUploadedList } from '@/hooks/upload/transactions/useClassWork';
import { cn } from '@/lib/utils';
import { classWorkSchema } from '@/schemas/upload/transactions/ivrm-classwork.schema';
import {
    getClassDropDownByAcademicYearlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/cumulative-report';
import {
    getSubjectsDropDownByAcademicYearandClassandSectionlist,
    uploadClassWork
} from '@/server/upload/transactions/ivrm-classwork/server-action';
import type { IClassWorkDetails } from '@/types/upload/reports/classwork-upload-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface UpdateClassWorkFormProps {
    onSuccess: () => void;
    classList: any[];
    selectedRow: IClassWorkDetails;
}

type FormFields = z.infer<typeof classWorkSchema.addOrUpdate>;

export default function UpdateClassWorkForm({ onSuccess,selectedRow }: UpdateClassWorkFormProps) {
    const [sections, setSections] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<{ ismS_Id: number }[]>([]);
    const [showUrlSection, setShowUrlSection] = useState(false);

    const {
        handleSubmit,
        reset,
        setValue,
        control,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(classWorkSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmaY_Id:0,
        }
    });
    const payload = {
        asmaY_Id: 176
    };

    const { refetchAll } = ClassWorkUploadedList(payload);
    const { data: academicResponse } = useAcademicYearDropdown();
    const { data: classData } = useClassDropdownDropdown();
    const { data: sectionListResponse } = useFeeSectionListDefaulterreport();
    const [classes, setClasses] = useState<any[]>([]);
    const [isclassesLoading, setIsClassesLoading] = useState(false);
    const selectedClass = useWatch({ control, name: 'asmcL_Id' });
    const selectedSections = useWatch({
        control,
        name: 'hm_section_list'
    });
    const selectedYear = useWatch({ control, name: 'asmaY_Id' });
    const selectedAcademic=watch("asmaY_Id");

        useEffect(()=>{
        reset({
            asmaY_Id:selectedRow.asmaY_Id,
        })
    },[selectedRow])

    useEffect(() => {
        if (!selectedYear || selectedYear === 0) {
            setClasses([]);
            setSections([]);
            return;
        }
        setIsClassesLoading(true);
        (async () => {
            try {
                const { data } = await getClassDropDownByAcademicYearlist(selectedYear);
                setClasses(Array.isArray(data) ? data : []);
            } catch {
                toast.error('Failed to load classes');
                setClasses([]);
            }
        })();
        setIsClassesLoading(false);
    }, [selectedYear, setValue]);

    useEffect(() => {
        if (!selectedYear || !selectedClass || selectedClass === 0) {
            setSections([]);
            return;
        }
        (async () => {
            try {
                const { data } = await getSectionsDropDownByAcademicYearandClasslist(selectedYear, selectedClass);
                setSections(Array.isArray(data) ? data : []);
            } catch {
                toast.error('Failed to load sections');
                setSections([]);
            }
        })();
    }, [selectedYear, selectedClass, setValue]);

    useEffect(() => {
        if (!selectedYear || !selectedClass || !selectedSections?.length) return;
        let mounted = true;
        (async () => {
            try {
                const payload = {
                    asmaY_Id: selectedYear,
                    asmcL_Id: selectedClass,
                    hm_section_list: selectedSections
                };
                const { data } = await getSubjectsDropDownByAcademicYearandClassandSectionlist(payload);
                if (!mounted) return;
                setSubjects(Array.isArray(data) ? data : []);
                setValue('ismS_Id', 0);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                toast.error('Failed to load subjects');
            }
        })();
        return () => {
            mounted = false;
        };
    }, [selectedYear, selectedClass, selectedSections, setValue]);

    const handleUrlCheckboxChange = (checked: boolean) => {
        setShowUrlSection(checked);
        // if (checked && urlFields.length === 0) {
        //     appendUrl({ ICW_FilePath: '', FileName: '' });
        // } else if (!checked) {
        //     setValue('ICW_Attachment_Array', []);
        // }
    };

    const onSubmit = async (data: FormFields) => {
        try {
            const payload = {
                icW_Id: 0,
                mI_Id: 0,
                icW_Topic: data.icW_Topic,
                icW_SubTopic: data.icW_SubTopic,
                icW_Content: data.icW_Content,
                icW_TeachingAid: 0,
                icW_FromDate: data.icW_FromDate,
                icW_ToDate: data.icW_ToDate,
                icW_Evaluation: 'string',
                icW_Attachment: 'string',
                icwatT_Attachment: 'string',
                icwatT_FileName: 'string',
                asmaY_Id: data.asmaY_Id,
                login_Id: 0,
                asmcL_Id: data.asmcL_Id,
                ismS_Id: data.ismS_Id,
                icW_Assignment: '',
                asmS_Id: selectedSections,
                hm_section_list: data.hm_section_list,
                icW_FilePath_Array: [
                    {
                        icW_FilePath: 'string',
                        fileName: 'string'
                    }
                ],
                devicelist12: ['string']
            };
            const response = await uploadClassWork(payload);
            console.log('payload', payload);
            if (response?.success) {
                toast.success(response.message || 'Saved successfully');
                handleReset();
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(response?.message || 'Save failed');
            }
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error(err?.message || 'Something went wrong');
        }
    };

    const {
        fields: sectionFields,
        append: appendSection,
        remove: removeSection
    } = useFieldArray({
        control,
        name: 'hm_section_list'
    });

    const handleSectionChange = (sectionId: number, isChecked: boolean) => {
        if (isChecked) {
            appendSection({ asmS_Id: sectionId });
        } else {
            const index = selectedSections?.findIndex((x: any) => x.asmS_Id === sectionId);
            if (index !== undefined && index > -1) removeSection(index);
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {/* Academic Year */}
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
                                        <SelectValue placeholder='Select Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicResponse?.data?.map((year: any) => (
                                            <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                {year.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    {/* Class */}
                    <Controller
                        control={control}
                        name='asmcL_Id'
                        render={({ field, fieldState }) => (
                            <div>
                                <Label>
                                    Class <span className='text-red-500'>*</span>
                                </Label>
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(Number(val));
                                        setValue('hm_section_list', []);
                                        setSubjects([]);
                                    }}
                                    value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Class' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isclassesLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : (
                                            classes?.map((cls: any) => (
                                                <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                    {cls.asmcL_ClassName}
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
                        name='hm_section_list'
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col gap-3 sm:flex-row'>
                                <Label className='w-32 font-medium'>
                                    Section <span className='text-red-500'>*</span>
                                </Label>

                                <div className='flex-1'>
                                    <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                                        {sections.map((s) => {
                                            const checked = field.value?.some((x: any) => x.asmS_Id === s.asmS_Id) ?? false;

                                            return (
                                                <label key={s.asmS_Id} className='flex cursor-pointer items-center gap-2'>
                                                    <input
                                                        type='checkbox'
                                                        disabled={!selectedClass || selectedClass === 0}
                                                        checked={checked}
                                                        onChange={(e) => {
                                                            const current = field.value || [];

                                                            if (e.target.checked) {
                                                                field.onChange([...current, { asmS_Id: s.asmS_Id }]);
                                                            } else {
                                                                field.onChange(current.filter((x: any) => x.asmS_Id !== s.asmS_Id));
                                                            }
                                                        }}
                                                    />
                                                    <span>{s.asmC_SectionName}</span>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            </div>
                        )}
                    />

                    {/* Subject */}
                    <Controller
                        control={control}
                        name='ismS_Id'
                        render={({ field, fieldState }) => (
                            <div>
                                <Label>
                                    Subject <span className='text-red-500'>*</span>
                                </Label>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Subject' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((sub: any) => (
                                            <SelectItem key={sub.ismS_Id} value={sub.ismS_Id.toString()}>
                                                {sub.ismS_SubjectName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    {/* Topic */}
                    <Controller
                        control={control}
                        name='icW_Topic'
                        render={({ field, fieldState }) => (
                            <div>
                                <Label>
                                    Topic <span className='text-red-500'>*</span>
                                </Label>
                                <Input placeholder='Enter Topic' {...field} />
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    {/* Sub Topic */}
                    <Controller
                        control={control}
                        name='icW_SubTopic'
                        render={({ field, fieldState }) => (
                            <div>
                                <Label>
                                    Sub Topic <span className='text-red-500'>*</span>
                                </Label>
                                <Input placeholder='Enter Sub Topic' {...field} />
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    {/* Start Date */}
                    <Controller
                        control={control}
                        name='icW_FromDate'
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
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                        <Calendar
                                            mode='single'
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date('1900-01-01')}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    {/* End Date */}
                    <Controller
                        control={control}
                        name='icW_ToDate'
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
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                        <Calendar
                                            mode='single'
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date('1900-01-01')}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />
                </div>

                {/* Content */}
                <div className='grid grid-cols-1'>
                    <Controller
                        control={control}
                        name='icW_Content'
                        render={({ field, fieldState }) => (
                            <div>
                                <Label>
                                    Content <span className='text-red-500'>*</span>
                                </Label>
                                <Textarea placeholder='Enter Content' {...field} rows={3} />
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />
                </div>

                {/* File Upload Section */}
                {/* <div className='space-y-4 rounded-md border p-4'>
                        <h3 className='text-lg font-semibold'>Attachments</h3>
                        <div className='overflow-x-auto'>
                            <table className='w-full table-auto border-collaspe border text-left text-sm'>
                                <thead>
                                    <tr className='bg-muted'>
                                        <th className='border p-2 text-center'>SL NO</th>
                                        <th className='border p-2'>Upload File</th>
                                        <th className='border p-2'>File Name</th>
                                        <th className='border p-2 text-center'>View</th>
                                        <th className='border p-2 text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fileFields.map((field, index) => (
                                        <tr key={field.id}>
                                            <td className='border p-2 text-center'>{index + 1}</td>
                                            <td className='border p-2'>
                                                <Input
                                                    type='file'
                                                    onChange={(e) => handleFileChange(index, e)}
                                                />
                                            </td>
                                            <td className='border p-2'>
                                                <Controller
                                                    control={control}
                                                    name={`ICW_FilePath_Array.${index}.FileName`}
                                                    render={({ field }) => (
                                                        <Input {...field} disabled />
                                                    )}
                                                />
                                            </td>
                                            <td className='border p-2 text-center'>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='sm'
                                                    className='text-primary'
                                                    onClick={() => {
                                                        const filePath = control._getWatch(`ICW_FilePath_Array.${index}.icW_FilePath`);
                                                        if (filePath) window.open(filePath, '_blank');
                                                        else toast.error("No file uploaded to view");
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </td>
                                            <td className='border p-2 text-center'>
                                                <div className='flex items-center justify-center gap-2'>
                                                    {index === fileFields.length - 1 && (
                                                        <Button
                                                            type='button'
                                                            variant='outline'
                                                            size='icon'
                                                            onClick={() => appendFile({ icW_FilePath: '', FileName: '' })}
                                                        >
                                                            <PlusIcon className='h-4 w-4' />
                                                        </Button>
                                                    )}
                                                    {fileFields.length > 1 && (
                                                        <Button
                                                            type='button'
                                                            variant='destructive'
                                                            size='icon'
                                                            onClick={() => removeFile(index)}
                                                        >
                                                            <MinusIcon className='h-4 w-4' />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className='text-sm text-green-700'>
                            <span className='font-bold text-red-500'>Accept File:</span> jpg, jpeg, png, doc, ppt, excel, mp3, mp4, wmv, pdf
                        </p>
                    </div> */}

                {/* URL Section */}
                <div className='flex items-center space-x-2'>
                    <Checkbox
                        id='checklink'
                        checked={showUrlSection}
                        onCheckedChange={(checked) => handleUrlCheckboxChange(checked as boolean)}
                    />
                    <Label htmlFor='checklink'>If URL</Label>
                </div>

                {/* {showUrlSection && (
                        <div className='space-y-4 rounded-md border p-4'>
                            <h3 className='text-lg font-semibold'>URL Details</h3>
                            <div className='overflow-x-auto'>
                                <table className='w-full table-auto border-collaspe border text-left text-sm'>
                                    <thead>
                                        <tr className='bg-muted'>
                                            <th className='border p-2 text-center'>SL NO</th>
                                            <th className='border p-2'>URL</th>
                                            <th className='border p-2 text-center'>View</th>
                                            <th className='border p-2 text-center'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {urlFields.map((field, index) => (
                                            <tr key={field.id}>
                                                <td className='border p-2 text-center'>{index + 1}</td>
                                                <td className='border p-2'>
                                                    <Controller
                                                        control={control}
                                                        name={`ICW_Attachment_Array.${index}.ICW_FilePath`}
                                                        render={({ field }) => (
                                                            <Input {...field} placeholder='Enter URL' />
                                                        )}
                                                    />
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='sm'
                                                        className='text-primary'
                                                        onClick={() => {
                                                            //const url = methods.getValues(`ICW_Attachment_Array.${index}.ICW_FilePath`);

                                                             const url = watch(`ICW_Attachment_Array.${index}.ICW_FilePath`);
                                                            if (url) window.open(url, '_blank');
                                                            else toast.error("No URL provided");
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        {index === urlFields.length - 1 && (
                                                            <Button
                                                                type='button'
                                                                variant='outline'
                                                                size='icon'
                                                                onClick={() => appendUrl({ ICW_FilePath: '', FileName: '' })}
                                                            >
                                                                <PlusIcon className='h-4 w-4' />
                                                            </Button>
                                                        )}
                                                        {urlFields.length > 1 && (
                                                            <Button
                                                                type='button'
                                                                variant='destructive'
                                                                size='icon'
                                                                onClick={() => removeUrl(index)}
                                                            >
                                                                <MinusIcon className='h-4 w-4' />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )} */}

                {/* Checkboxes */}
                {/* <div className='flex flex-wrap gap-6'>
                        <Controller
                            control={control}
                            name='icW_Assignment'
                            render={({ field }) => (
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label className='font-normal'>Assignment</Label>
                                </div>
                            )}
                        />
                        <Controller
                            control={control}
                            name='icW_Evaluation'
                            render={({ field }) => (
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label className='font-normal'>Evaluation</Label>
                                </div>
                            )}
                        />
                        <Controller
                            control={control}
                            name='icW_TeachingAid'
                            render={({ field }) => (
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label className='font-normal'>Teaching Aid</Label>
                                </div>
                            )}
                        />
                    </div> */}

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
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

// Helper icons
// function PlusIcon(props: any) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M5 12h14" />
//             <path d="M12 5v14" />
//         </svg>
//     )
// }

// function MinusIcon(props: any) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M5 12h14" />
//         </svg>
//     )
// }
