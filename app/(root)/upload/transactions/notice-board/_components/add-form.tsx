'use client';

import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Minus, Plus, Eye, Save, X } from 'lucide-react';
import { noticeBoardSchema, type INoticeBoard } from '@/schemas/upload/transactions/notice-board.schema';
import { useMemo, useState } from 'react';
import { FormError, Label } from '@/components/ui/extension/field';
import { saveNoticeBoard } from '@/server/upload/transactions/notice-board/server-action';
import { toast } from 'sonner';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';

interface AddNoticeBoardFormProps {
    onSuccess: () => void;
    yearList: any[];
    classList: any[];
    sectionList: any[];
    departmentList: any[];
    designationList: any[];
    staffList: any[];
    studentList?: any[];
    routeList?: any[];
    feeGroupList?: any[];
    subjectList?: any[];
}

export default function AddNoticeBoardForm({
    onSuccess,
    yearList,
    classList,
    sectionList,
    departmentList,
    designationList,
    staffList,
    studentList = [],
    routeList = [],
    feeGroupList = [],
    subjectList = []
}: AddNoticeBoardFormProps) {
    const [isUrlMode, setIsUrlMode] = useState(false);
    const methods = useForm<INoticeBoard>({
        resolver: zodResolver(noticeBoardSchema),
        defaultValues: {
            intB_FilePath_Array: [{ intbfL_FilePath: '', fileName: '' }],
            // Provide sensible defaults matching schema
            asmaY_Id: undefined,
            ntB_TTSylabusFlg: undefined,
            intB_Title: '',
            intB_Description: '',
            intB_FilePath: '',
            intB_ActiveFlag: true,
            intB_DispalyDisableFlg: true,
            check_student: false,
            check_staff: false,
            asmcL_Id: [],
            asmS_Id: [],
            amsT_Id: [],
            hrmd_Id: [],
            hrmdeS_Id: [],
            hrmE_Id: [],
            ismS_Id: [],
            fee_def: false,
            select_route: false
        }
    });

    const { control, handleSubmit, setValue, register } = methods;

    // Field Array for Attachments
    const { fields, append, remove } = useFieldArray({
        control,
        name: "intB_FilePath_Array"
    });

    const check_student = useWatch({ control, name: 'check_student' });
    const check_staff = useWatch({ control, name: 'check_staff' });
    const intB_DispalyDisableFlg = useWatch({ control, name: 'intB_DispalyDisableFlg' });
    const selectedClasses = useWatch({ control, name: 'asmcL_Id' }) || [];
    const selectedSections = useWatch({ control, name: 'asmS_Id' }) || [];
    const intB_FilePath = useWatch({ control, name: 'intB_FilePath' });

    // Watch new flags
    const select_route = useWatch({ control, name: 'select_route' });
    const fee_def = useWatch({ control, name: 'fee_def' });

    // Filter Sections based on Selected Classes
    const filteredSectionList = useMemo(() => {
        if (!selectedClasses || selectedClasses.length === 0) return [];
        const classIds = selectedClasses.map((c: any) => c.asmcL_Id);
        return sectionList.filter((section) => classIds.includes(section.asmcL_Id));
    }, [selectedClasses, sectionList]);

    // Filter Students based on Selected Sections
    const filteredStudentList = useMemo(() => {
        if (!selectedSections || selectedSections.length === 0) return [];
        const sectionIds = selectedSections.map((s: any) => s.asmS_Id);
        return studentList.filter((student) => sectionIds.includes(student.asmS_Id));
    }, [selectedSections, studentList]);

    // Filter Subjects based on Selected Sections
    const filteredSubjectList = useMemo(() => {
        if (!selectedSections || selectedSections.length === 0) return [];
        const sectionIds = selectedSections.map((s: any) => s.asmS_Id);
        // Assuming subjects are linked to sections/classes in mock data structure
        return subjectList.filter((subject) => sectionIds.includes(subject.asmS_Id));
    }, [selectedSections, subjectList]);

    const onSubmit = async (data: INoticeBoard) => {
        try {
            const result = await saveNoticeBoard(data);
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Error saving notice:", error);
            toast.error("An unexpected error occurred.");
        }
    };

    // Helper to simulate file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const file = e.target.files?.[0];
        if (file) {
            if (index !== undefined) {
                // Update specific attachment
                setValue(`intB_FilePath_Array.${index}.intbfL_FilePath`, URL.createObjectURL(file));
                setValue(`intB_FilePath_Array.${index}.fileName`, file.name);
            } else {
                // Update main file
                setValue('intB_FilePath', URL.createObjectURL(file));
            }
        }
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md'>
                {/* Top Toggle Section */}
                <div className="flex flex-wrap gap-6 border-b pb-4">
                    <Controller
                        control={control}
                        name="check_student"
                        render={({ field }) => (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        if (checked) {
                                            setValue('check_staff', false);
                                            setValue('select_route', false);
                                            setValue('fee_def', false);
                                        }
                                    }}
                                />
                                <Label className="font-normal">Student</Label>
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="check_staff"
                        render={({ field }) => (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        if (checked) {
                                            setValue('check_student', false);
                                            setValue('select_route', false);
                                            setValue('fee_def', false);
                                        }
                                    }}
                                />
                                <Label className="font-normal">Staff</Label>
                            </div>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Academic Year */}
                    <Controller
                        control={control}
                        name='asmaY_Id'
                        render={({ field, fieldState }) => (
                            <div>
                                <Label>Academic Year <span className="text-red-500">*</span></Label>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {yearList.map((year) => (
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

                    {/* Notice Type */}
                    <Controller
                        control={control}
                        name='ntB_TTSylabusFlg'
                        render={({ field, fieldState }) => (
                            <div>
                                <Label>Notice Type <span className="text-red-500">*</span></Label>
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

                    {/* Notice Title */}
                    <div>
                        <Label>Notice Title <span className="text-red-500">*</span></Label>
                        <Input placeholder='Enter Notice Title' {...register('intB_Title')} />
                        {methods.formState.errors.intB_Title && <FormError>{methods.formState.errors.intB_Title.message}</FormError>}
                    </div>

                    {/* Start Date */}
                    <Controller
                        control={control}
                        name='intB_StartDate'
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col'>
                                <Label>Start Date <span className="text-red-500">*</span></Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
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

                    {/* End Date */}
                    <Controller
                        control={control}
                        name='intB_EndDate'
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col'>
                                <Label>End Date <span className="text-red-500">*</span></Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
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

                    {/* Display Date Toggle */}
                    <div className="flex items-end pb-2">
                        <Controller
                            control={control}
                            name="intB_DispalyDisableFlg"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="display-date-check" />
                                    <Label htmlFor="display-date-check" className="cursor-pointer font-normal">Display Date</Label>
                                </div>
                            )}
                        />
                    </div>

                    {/* Display Date Picker (Conditional) */}
                    {intB_DispalyDisableFlg && (
                        <Controller
                            control={control}
                            name='intB_DisplayDate'
                            render={({ field }) => (
                                <div className='flex flex-col'>
                                    <Label>Display Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                                {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Pick a date</span>}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <Calendar mode='single' selected={field.value || undefined} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}
                        />
                    )}

                    {/* Description (Full Width) */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <Label>Description</Label>
                        <Textarea placeholder='Enter Description' {...register('intB_Description')} className="min-h-[80px]" />
                    </div>
                </div>

                {/* Attachments Section */}
                <div className="space-y-4 rounded-md border p-4">
                    <h3 className="text-lg font-semibold">Attachments</h3>

                    {/* File Upload Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse border text-left text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="border p-2 text-center w-12">SL. NO</th>
                                    <th className="border p-2 text-center">Upload File</th>
                                    <th className="border p-2 text-center">File Name</th>
                                    <th className="border p-2 text-center w-16">View</th>
                                    <th className="border p-2 text-center w-16">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="border p-2 text-center">1</td>
                                    <td className="border p-2">
                                        {/* <div className="flex flex-col gap-1">
                                            <label className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold cursor-pointer rounded hover:bg-primary/90 w-full">
                                                Browse
                                                <Input type="file" className="hidden" onChange={(e) => handleFileChange(e)} />
                                            </label>
                                            <span className="text-[10px] text-red-500">Accept File: jpg, jpeg, png, doc, ppt, excel, mp3, mp4, wmv, pdf</span>
                                        </div> */}
                                    </td>
                                    <td className="border p-2">
                                        <Input value={intB_FilePath || ''} readOnly className="h-9 text-xs bg-muted" />
                                    </td>
                                    <td className="border p-2 text-center">
                                        {intB_FilePath && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => window.open(intB_FilePath, '_blank')}>
                                                <Eye className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        )}
                                    </td>
                                    <td className="border p-2 text-center">
                                        <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={() => { }}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* URL Checkbox */}
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="url-mode-check" checked={isUrlMode} onCheckedChange={(c) => setIsUrlMode(c as boolean)} />
                        <Label htmlFor="url-mode-check" className="font-semibold text-xs">If URL</Label>
                    </div>

                    {/* URL Table */}
                    {isUrlMode && (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse border text-left text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="border p-2 text-center w-12">SL NO</th>
                                        <th className="border p-2 text-center">URL</th>
                                        <th className="border p-2 text-center w-16">View</th>
                                        <th className="border p-2 text-center w-16">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((item, index) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="border p-2 text-center">{index + 1}</td>
                                            <td className="border p-2">
                                                <Controller
                                                    control={control}
                                                    name={`intB_FilePath_Array.${index}.intbfL_FilePath`}
                                                    render={({ field }) => <Input {...field} placeholder="Enter URL" className="h-9" />}
                                                />
                                            </td>
                                            <td className="border p-2 text-center">
                                                {/* Preview logic if needed */}
                                            </td>
                                            <td className="border p-2 text-center">
                                                <div className="flex justify-center gap-1">
                                                    {index === fields.length - 1 && (
                                                        <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={() => append({ intbfL_FilePath: '', fileName: '' })}>
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {fields.length > 0 && (
                                                        <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={() => remove(index)}>
                                                            <Minus className="h-4 w-4" />
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

                {/* Student Mode Options */}
                {check_student && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex flex-wrap items-center gap-6">
                            <Controller
                                control={control}
                                name="select_route"
                                render={({ field }) => (
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <Label className="font-normal">Select Route</Label>
                                    </div>
                                )}
                            />
                            <Controller
                                control={control}
                                name="fee_def"
                                render={({ field }) => (
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <Label className="font-normal">Fee Defaulters</Label>
                                    </div>
                                )}
                            />
                        </div>

                        {/* Additional Filters: Route / Fee */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {select_route && (
                                <Controller
                                    control={control}
                                    name="routeList"
                                    render={({ field }) => (
                                        <CustomMultiSelectBox
                                            label="Route Name"
                                            options={routeList.map(r => ({ label: `${r.trmR_RouteName} - ${r.trmR_RouteNo}`, value: r.trmR_Id.toString() }))}
                                            value={field.value?.map((v) => v.trmR_Id.toString()) || []}
                                            onChange={(vals) => field.onChange(vals.map((v) => ({ trmR_Id: Number(v) })))}
                                            isSearchRequired
                                        />
                                    )}
                                />
                            )}

                            {fee_def && (
                                <Controller
                                    control={control}
                                    name="feeGroupList"
                                    render={({ field }) => (
                                        <CustomMultiSelectBox
                                            label="Fee Group"
                                            options={feeGroupList.map(f => ({ label: f.fmg_GroupName, value: f.fmg_Id.toString() }))}
                                            value={field.value?.map((v) => v.fmg_Id.toString()) || []}
                                            onChange={(vals) => field.onChange(vals.map((v) => ({ fmg_Id: Number(v) })))}
                                            isSearchRequired
                                        />
                                    )}
                                />
                            )}
                        </div>

                        {/* Standard Student Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Controller
                                control={control}
                                name="asmcL_Id"
                                render={({ field }) => (
                                    <CustomMultiSelectBox
                                        label="Class Name"
                                        isRequired
                                        options={classList.map((c) => ({ label: c.asmcL_ClassName, value: c.asmcL_Id.toString() }))}
                                        value={field.value?.map((v) => v.asmcL_Id.toString()) || []}
                                        onChange={(vals) => {
                                            field.onChange(vals.map((v) => ({ asmcL_Id: Number(v) })));
                                            // Trigger cascading updates
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
                                name="asmS_Id"
                                render={({ field }) => (
                                    <CustomMultiSelectBox
                                        label="Section Name"
                                        isRequired
                                        options={filteredSectionList.map((s) => ({ label: s.asmC_SectionName, value: s.asmS_Id.toString() }))}
                                        value={field.value?.map((v) => v.asmS_Id.toString()) || []}
                                        onChange={(vals) => {
                                            field.onChange(vals.map((v) => ({ asmS_Id: Number(v) })));
                                            setValue('ismS_Id', []);
                                            setValue('amsT_Id', []);
                                        }}
                                        isSearchRequired
                                        disabled={!selectedClasses.length}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="ismS_Id"
                                render={({ field }) => (
                                    <CustomMultiSelectBox
                                        label="Subject Name"
                                        options={filteredSubjectList.map((s) => ({ label: s.ismS_IVRSSubjectName, value: s.ismS_Id.toString() }))}
                                        value={field.value?.map((v) => v.ismS_Id.toString()) || []}
                                        onChange={(vals) => field.onChange(vals.map((v) => ({ ismS_Id: Number(v) })))}
                                        isSearchRequired
                                        disabled={!selectedSections.length}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="amsT_Id"
                                render={({ field }) => (
                                    <CustomMultiSelectBox
                                        label="Student Name"
                                        options={filteredStudentList.map((s) => ({ label: s.amsT_FirstName, value: s.amsT_Id.toString() }))}
                                        value={field.value?.map((v) => v.amsT_Id.toString()) || []}
                                        onChange={(vals) => field.onChange(vals.map((v) => ({ amsT_Id: Number(v) })))}
                                        isSearchRequired
                                        disabled={!selectedSections.length}
                                    />
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* Staff Mode Options */}
                {check_staff && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        <Controller
                            control={control}
                            name="hrmd_Id"
                            render={({ field }) => (
                                <CustomMultiSelectBox
                                    label="Department Name"
                                    options={departmentList.map((d) => ({ label: d.hrmd_DepartmentName, value: d.hrmd_Id.toString() }))}
                                    value={field.value?.map((v) => v.hrmd_Id.toString()) || []}
                                    onChange={(vals) => {
                                        field.onChange(vals.map((v) => ({ hrmd_Id: Number(v) })));
                                        setValue('hrmdeS_Id', []); // Clear child dropdowns
                                        setValue('hrmE_Id', []);
                                    }}
                                    isSearchRequired
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="hrmdeS_Id"
                            render={({ field }) => (
                                <CustomMultiSelectBox
                                    label="Designation Name"
                                    options={designationList.map((d) => ({ label: d.hrmdes_DesignationName, value: d.hrmdeS_Id.toString() }))}
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
                            name="hrmE_Id"
                            render={({ field }) => (
                                <CustomMultiSelectBox
                                    label="Employee Name"
                                    options={staffList.map((s) => ({ label: s.hrmE_EmployeeName, value: s.hrmE_Id.toString() }))}
                                    value={field.value?.map((v) => v.hrmE_Id.toString()) || []}
                                    onChange={(vals) => field.onChange(vals.map((v) => ({ hrmE_Id: Number(v) })))}
                                    isSearchRequired
                                />
                            )}
                        />
                    </div>
                )}

                <div className='flex justify-center gap-2 pt-6 pb-2'>
                    <Button type='submit'>
                        <Save className='mr-2 h-4 w-4' /> SAVE
                    </Button>
                    <Button type='button' variant='destructive' onClick={() => methods.reset()}>
                        <X className='mr-2 h-4 w-4' /> CANCEL
                    </Button>
                </div>
            </form >
        </div>
    );
}
