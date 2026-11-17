'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { homeWorkSchema, type IHomeWork } from '@/schemas/upload/transactions/ivrm-homework.schema';
import { fetchSections, fetchSubjects, saveHomeWork } from '@/server/upload/transactions/ivrm-homework/server-action';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface AddHomeWorkFormProps {
    onSuccess: () => void;
    yearList: any[];
    classList: any[];
}

export default function AddHomeWorkForm({ onSuccess, yearList, classList }: AddHomeWorkFormProps) {
    const [sections, setSections] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [isUrlMode, setIsUrlMode] = useState(false);

    const methods = useForm<IHomeWork>({
        resolver: zodResolver(homeWorkSchema),
        defaultValues: {
            ihW_ActiveFlag: true,
            hm_section_list: [],
            ihW_FilePath_Array: [{ ihW_FilePath: '', fileName: '' }],
            ihW_Date: new Date()
        }
    });

    const { control, handleSubmit, formState: { isSubmitting }, setValue } = methods;
    const selectedYear = useWatch({ control, name: 'asmaY_Id' });
    const selectedClass = useWatch({ control, name: 'asmcL_Id' });
    const selectedSections = useWatch({ control, name: 'hm_section_list' });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ihW_FilePath_Array'
    });

    useEffect(() => {
        const loadSections = async () => {
            if (selectedClass && selectedYear) {
                try {
                    const result = await fetchSections(selectedClass, selectedYear);
                    setSections(result.sectionlist || []);
                } catch (error) {
                    toast.error('Failed to load sections');
                }
            } else {
                setSections([]);
            }
        };
        loadSections();
    }, [selectedClass, selectedYear]);

    useEffect(() => {
        const loadSubjects = async () => {
            if (selectedClass && selectedYear && selectedSections?.length > 0) {
                try {
                    const result = await fetchSubjects(selectedClass, selectedYear, selectedSections);
                    setSubjects(result.subjectlist || []);
                } catch (error) {
                    toast.error('Failed to load subjects');
                }
            } else {
                setSubjects([]);
            }
        };
        loadSubjects();
    }, [selectedClass, selectedYear, selectedSections]);

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue(`ihW_FilePath_Array.${index}.fileName`, file.name);
            setValue(`ihW_FilePath_Array.${index}.ihW_FilePath`, URL.createObjectURL(file));
        }
    };

    const handleSectionChange = (sectionId: number, isChecked: boolean) => {
        if (isChecked) {
            appendSection({ asmS_Id: sectionId });
        } else {
            const index = selectedSections?.findIndex((x: any) => x.asmS_Id === sectionId);
            if (index !== undefined && index > -1) removeSection(index);
        }
    };

    const { append: appendSection, remove: removeSection } = useFieldArray({
        control,
        name: 'hm_section_list'
    });

    const onSubmit = async (data: IHomeWork) => {
        try {
            const result = await saveHomeWork(data);
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('An error occurred while saving');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 rounded-xl bg-card p-6 shadow-sm border'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-4'>
                    <Controller
                        control={control}
                        name='asmaY_Id'
                        render={({ field, fieldState }) => (
                            <div className='space-y-2'>
                                <Label >Academic Year <span className='text-destructive'>*</span></Label>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {yearList.map((year: any) => (
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

                    <Controller
                        control={control}
                        name='asmcL_Id'
                        render={({ field, fieldState }) => (
                            <div className='space-y-2'>
                                <Label >Class <span className='text-destructive'>*</span></Label>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Class' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classList.map((cls: any) => (
                                            <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                {cls.asmcL_ClassName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    <div className='space-y-2'>
                        <Label >Section <span className='text-destructive'>*</span></Label>
                        <div className='grid grid-cols-2 gap-2 rounded-md border p-3'>
                            {sections.map((sec) => (
                                <div key={sec.asmS_Id} className='flex items-center space-x-2'>
                                    <Checkbox
                                        id={`sec-${sec.asmS_Id}`}
                                        checked={selectedSections?.some((x: any) => x.asmS_Id === sec.asmS_Id)}
                                        onCheckedChange={(checked) => handleSectionChange(sec.asmS_Id, checked as boolean)}
                                    />
                                    <label htmlFor={`sec-${sec.asmS_Id}`} className='text-sm cursor-pointer'>{sec.asmC_SectionName}</label>
                                </div>
                            ))}
                        </div>
                        {methods.formState.errors.hm_section_list && <FormError>{methods.formState.errors.hm_section_list.message}</FormError>}
                    </div>

                    <Controller
                        control={control}
                        name='ismS_Id'
                        render={({ field, fieldState }) => (
                            <div className='space-y-2'>
                                <Label >Subject <span className='text-destructive'>*</span></Label>
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

                    <Controller
                        control={control}
                        name='ihW_Topic'
                        render={({ field, fieldState }) => (
                            <div className='space-y-2'>
                                <Label >Topic</Label>
                                <Input {...field} placeholder='Enter Topic' />
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />
                </div>

                <div className='space-y-4'>
                    <Controller
                        control={control}
                        name='ihW_Date'
                        render={({ field, fieldState }) => (
                            <div className='space-y-2'>
                                <Label >H.W Date <span className='text-destructive'>*</span></Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant='outline' className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0'>
                                        <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                            </div>
                        )}
                    />

                    <Controller
                        control={control}
                        name='ihW_Assignment'
                        render={({ field }) => (
                            <div className='space-y-2'>
                                <Label>Assignment <span className='text-destructive'>*</span></Label>
                                <Textarea {...field} value={field.value || ''} placeholder='Enter Assignment' rows={4} />
                            </div>
                        )}
                    />

                    <Controller
                        control={control}
                        name='ihW_AssignmentNo'
                        render={({ field }) => (
                            <div className='space-y-2'>
                                <Label>Assignment No </Label>
                                <Input {...field} value={field.value || ''} placeholder='Enter Assignment Number' />
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <Label className='text-lg font-semibold'>Attachments</Label>
                </div>

                <div className='rounded-md border p-4 space-y-4'>
                    <div className="flex items-center space-x-2 mb-4">
                        <Checkbox id="url-mode" checked={isUrlMode} onCheckedChange={(checked) => setIsUrlMode(checked as boolean)} />
                        <Label htmlFor="url-mode" className="font-normal">If URL</Label>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b'>
                                    <th className='p-2 text-left'>SL NO</th>
                                    <th className='p-2 text-left'>{isUrlMode ? 'URL' : 'Upload File'}</th>
                                    {!isUrlMode && <th className='p-2 text-left'>File Name</th>}
                                    <th className='p-2 text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((item, index) => (
                                    <tr key={item.id} className='border-b last:border-0'>
                                        <td className='p-2'>{index + 1}</td>
                                        <td className='p-2'>
                                            {isUrlMode ? (
                                                <Controller
                                                    control={control}
                                                    name={`ihW_FilePath_Array.${index}.ihW_FilePath`}
                                                    render={({ field }) => <Input {...field} placeholder='Enter URL' />}
                                                />
                                            ) : (
                                                <Input type='file' onChange={(e) => handleFileChange(index, e)} />
                                            )}
                                        </td>
                                        {!isUrlMode && (
                                            <td className='p-2'>
                                                <Controller
                                                    control={control}
                                                    name={`ihW_FilePath_Array.${index}.fileName`}
                                                    render={({ field }) => <Input {...field} disabled placeholder='FileName' />}
                                                />
                                            </td>
                                        )}
                                        <td className='p-2'>
                                            <div className='flex items-center justify-center gap-2'>
                                                {index === fields.length - 1 && (
                                                    <Button type='button' variant='outline' size='icon' onClick={() => append({ ihW_FilePath: '', fileName: '' })}>
                                                        <Plus className='h-4 w-4' />
                                                    </Button>
                                                )}
                                                {fields.length > 1 && (
                                                    <Button type='button' variant='outline' size='icon' className='text-destructive' onClick={() => remove(index)}>
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
                </div>
            </div>

            <div className='flex justify-center pt-4'>
                <Button type='submit' size='lg' disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}
