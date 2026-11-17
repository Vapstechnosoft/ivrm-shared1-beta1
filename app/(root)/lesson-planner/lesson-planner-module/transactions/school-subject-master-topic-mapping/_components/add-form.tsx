'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadDocument } from '@/server/document_upload';
import {
    onChangeClass,
    onChangeSection,
    onChangeSubject,
    onChangeUnit,
    onChangeYear,
    saveDetails
} from '@/server/lesson-planner/transactions/school-subject-master-topic-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FileUploadSection } from './file-upload-section';

// Helper to create file array state helper
const useFileState = () => {
    const [files, setFiles] = useState<{ id: string; lpmtR_Resources: string; lpmtR_FileName: string }[]>([
        { id: '1', lpmtR_Resources: '', lpmtR_FileName: '' }
    ]);
    return { files, setFiles };
};

const formSchema = z.object({
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    ASMCL_Id: z.number().min(1, 'Class is required'),
    ASMS_Id: z.number().min(1, 'Section is required').optional(),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    LPMU_Id: z.number().min(1, 'Unit is required'),
    LPMMT_Id: z.number().min(1, 'Main Topic is required'),
    LPMT_TopicName: z.string().min(1, 'Topic Name is required'),
    LPMT_LessonPlan: z.string().min(1, 'Description is required'),
    LPMT_TotalHrs: z.coerce.number().min(1, 'Total Hours is required'),
    LPMT_TotalPeriods: z.coerce.number().min(1, 'Total Periods is required'),
    LPMT_TeacherGuide: z.string().optional(),
    LPMT_StudentGuide: z.string().optional(),
    LPMT_MaterialNeeded: z.string().optional(),
    LPMT_References: z.string().optional(),
    LPMT_Homework: z.string().optional()
});

export default function AddSchoolSubjectTopicMappingForm({
    masterYear,
    onSuccess
}: {
    masterYear: any[];
    onSuccess: () => void;
}) {
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [mainTopics, setMainTopics] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();

    const extractArray = (res: any, fallbackKey: string): any[] => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        const data = res.data || res;
        if (Array.isArray(data)) return data;
        if (data.$values && Array.isArray(data.$values)) return data.$values;

        // Prioritize known keys for this module
        if (data.getSection) {
            if (Array.isArray(data.getSection)) return data.getSection;
            if (data.getSection.$values && Array.isArray(data.getSection.$values)) return data.getSection.$values;
        }
        if (data.getsubjectlist) {
            if (Array.isArray(data.getsubjectlist)) return data.getsubjectlist;
            if (data.getsubjectlist.$values && Array.isArray(data.getsubjectlist.$values)) return data.getsubjectlist.$values;
        }

        if (data[fallbackKey]) {
            if (Array.isArray(data[fallbackKey])) return data[fallbackKey];
            if (data[fallbackKey].$values && Array.isArray(data[fallbackKey].$values)) return data[fallbackKey].$values;
        }

        // Nuclear search
        for (const key in data) {
            if (Array.isArray(data[key])) return data[key];
            if (data[key]?.$values && Array.isArray(data[key].$values)) return data[key].$values;
        }
        return [];
    };

    const teacherGuides = useFileState();
    const studentGuides = useFileState();
    const materials = useFileState();
    const references = useFileState();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ASMAY_Id: 0,
            ASMCL_Id: 0,
            ASMS_Id: 0,
            ISMS_Id: 0,
            LPMU_Id: 0,
            LPMMT_Id: 0,
            LPMT_TopicName: '',
            LPMT_LessonPlan: '',
            LPMT_TotalHrs: 0,
            LPMT_TotalPeriods: 0,
            LPMT_TeacherGuide: '',
            LPMT_StudentGuide: '',
            LPMT_MaterialNeeded: '',
            LPMT_References: '',
            LPMT_Homework: ''
        }
    });

    // Cascading handlers
    const handleYearChange = async (yearId: string) => {
        const id = Number(yearId);
        form.setValue('ASMAY_Id', id);
        startTransition(async () => {
            try {
                const yearRes: any = await onChangeYear(id);
                console.info('Add handleYearChange RAW:', JSON.stringify(yearRes));
                const classList = extractArray(yearRes, 'getclass');
                setClasses(classList);
                setSections([]);
                setSubjects([]);
                setUnits([]);
                setMainTopics([]);
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch classes');
            }
        });
    };

    const handleClassChange = async (classId: string) => {
        const id = Number(classId);
        form.setValue('ASMCL_Id', id);
        startTransition(async () => {
            try {
                const res: any = await onChangeClass(form.getValues('ASMAY_Id'), id);
                console.info('Add handleClassChange RAW:', JSON.stringify(res));

                // Extract data - the API returns sections directly in data array or under 'getSection'
                let data = extractArray(res, 'getSection');

                // If extractArray didn't find getSection, try mastersection
                if (data.length === 0) {
                    data = extractArray(res, 'mastersection');
                }

                // If still empty, try getting data directly
                if (data.length === 0 && res.data && Array.isArray(res.data)) {
                    data = res.data;
                } else if (data.length === 0 && Array.isArray(res)) {
                    data = res;
                }

                // Check if the data contains subjects (ismS_Id) or sections (asmS_Id)
                if (data.length > 0) {
                    if (data[0].ismS_Id || data[0].ISMS_Id) {
                        // Data contains subjects
                        setSubjects(data);
                        setSections([]);
                    } else if (data[0].asmS_Id || data[0].ASMS_Id) {
                        // Data contains sections
                        setSections(data);
                        setSubjects([]);
                    } else {
                        // Fallback: assume it's sections
                        setSections(data);
                        setSubjects([]);
                    }
                }
                setUnits([]);
                setMainTopics([]);
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch sections/subjects');
            }
        });
    };

    const handleSectionChange = async (sectionId: string) => {
        const id = Number(sectionId);
        form.setValue('ASMS_Id', id);
        startTransition(async () => {
            try {
                const res: any = await onChangeSection(form.getValues('ASMAY_Id'), form.getValues('ASMCL_Id'), id);
                console.info('Add handleSectionChange RAW:', JSON.stringify(res));
                const subjectList = extractArray(res, 'getsubjectlist');
                setSubjects(subjectList);
                setUnits([]);
                setMainTopics([]);
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch subjects');
            }
        });
    };

    const handleSubjectChange = async (subjectId: string) => {
        const id = Number(subjectId);
        form.setValue('ISMS_Id', id);
        startTransition(async () => {
            try {
                const res: any = await onChangeSubject(form.getValues('ASMAY_Id'), form.getValues('ASMCL_Id'), id);
                console.info('Add handleSubjectChange RAW:', JSON.stringify(res));
                const unitList = extractArray(res, 'unitdetails');
                setUnits(unitList);
                setMainTopics([]);
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch units');
            }
        });
    };

    const handleUnitChange = async (unitId: string) => {
        const id = Number(unitId);
        form.setValue('LPMU_Id', id);
        startTransition(async () => {
            try {
                const res: any = await onChangeUnit(form.getValues('ASMAY_Id'), form.getValues('ASMCL_Id'), form.getValues('ISMS_Id'), id);
                console.info('Add handleUnitChange RAW:', JSON.stringify(res));
                const topicList = extractArray(res, 'topicdetails');
                setMainTopics(topicList);
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch topics');
            }
        });
    };

    const handleFileUpload = async (index: number, file: File, setter: any) => {
        const formData = new FormData();
        formData.append('File', file);
        try {
            const response: any = await uploadDocument(formData);
            let path = '';
            if (Array.isArray(response) && response.length > 0) {
                path = response[0].path || response[0];
            } else if (typeof response === 'string') {
                path = response;
            } else if (response?.path) {
                path = response.path;
            } else if (response?.data) {
                if (Array.isArray(response.data) && response.data.length > 0) {
                    path = response.data[0].path || response.data[0];
                } else if (typeof response.data === 'string') {
                    path = response.data;
                } else if (response.data?.path) {
                    path = response.data.path;
                }
            }

            if (path) {
                setter.setFiles((prev: any) => {
                    const newFiles = [...prev];
                    newFiles[index] = { ...newFiles[index], lpmtR_Resources: path, lpmtR_FileName: file.name };
                    return newFiles;
                });
                toast.success('File uploaded successfully');
            } else {
                toast.error('File upload failed: No path returned');
            }
        } catch (error) {
            toast.error('File upload failed');
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const payload = {
                lpmT_Id: 0,
                lpmmt_Id: values.LPMMT_Id,
                lpmT_TopicName: values.LPMT_TopicName,
                lpmT_LessonPlan: values.LPMT_LessonPlan,
                lpmT_TotalHrs: values.LPMT_TotalHrs,
                lpmT_TotalPeriods: values.LPMT_TotalPeriods,
                lpmT_TeacherGuide: values.LPMT_TeacherGuide,
                lpmT_StudentGuide: values.LPMT_StudentGuide,
                lpmT_MaterialNeeded: values.LPMT_MaterialNeeded,
                lpmT_References: values.LPMT_References,
                lpmT_Homework: values.LPMT_Homework,
                ismS_Id: values.ISMS_Id,
                asmaY_Id: values.ASMAY_Id,
                asmcL_Id: values.ASMCL_Id,
                asmS_Id: values.ASMS_Id,
                lpmU_Id: values.LPMU_Id,
                teacherGuideUploadDTO: teacherGuides.files
                    .filter((f) => f.lpmtR_Resources)
                    .map((f) => ({
                        lpmtR_Resources: f.lpmtR_Resources,
                        lpmtR_FileName: f.lpmtR_FileName
                    })),
                studnetGuideUploadDTO: studentGuides.files
                    .filter((f) => f.lpmtR_Resources)
                    .map((f) => ({
                        lpmtR_Resources: f.lpmtR_Resources,
                        lpmtR_FileName: f.lpmtR_FileName
                    })),
                materalGuideUploadDTO: materials.files
                    .filter((f) => f.lpmtR_Resources)
                    .map((f) => ({
                        lpmtR_Resources: f.lpmtR_Resources,
                        lpmtR_FileName: f.lpmtR_FileName
                    })),
                referenceGuideUploadDTO: references.files
                    .filter((f) => f.lpmtR_Resources)
                    .map((f) => ({
                        lpmtR_Resources: f.lpmtR_Resources,
                        lpmtR_FileName: f.lpmtR_FileName
                    }))
            };
            const res = await saveDetails(payload);
            if (res.success) {
                toast.success(res.message || 'Saved successfully');
                onSuccess();
            } else {
                toast.error(res.message || 'Failed to save');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='ASMAY_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Academic Year <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={handleYearChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Year' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {masterYear
                                            .filter((item) => item.asmaY_Id)
                                            .map((item: any, index: number) => (
                                                <SelectItem key={`${item.asmaY_Id}-${index}`} value={item.asmaY_Id.toString()}>
                                                    {item.asmaY_Year}
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
                        name='ASMCL_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Class <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={handleClassChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Class' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {classes
                                            .filter((item) => item.asmcL_Id)
                                            .map((item: any, index: number) => (
                                                <SelectItem key={`${item.asmcL_Id}-${index}`} value={item.asmcL_Id.toString()}>
                                                    {item.asmcL_ClassName}
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
                        name='ASMS_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Section</FormLabel>
                                <Select onValueChange={handleSectionChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Section' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sections
                                            .filter((item) => item.asmS_Id || item.ASMS_Id)
                                            .map((item: any, index: number) => (
                                                <SelectItem
                                                    key={`${item.asmS_Id || item.ASMS_Id || index}`}
                                                    value={(item.asmS_Id || item.ASMS_Id).toString()}>
                                                    {item.asmC_SectionName || item.asmS_SectionName || item.sectionName}
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
                        name='ISMS_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Subject <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={handleSubjectChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Subject' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subjects
                                            .filter((item) => item.ismS_Id)
                                            .map((item: any, index: number) => (
                                                <SelectItem key={`${item.ismS_Id}-${index}`} value={item.ismS_Id.toString()}>
                                                    {item.ismS_SubjectName}
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
                        name='LPMU_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Unit <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={handleUnitChange} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Unit' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {units
                                            .filter((item) => item.lpmU_Id)
                                            .map((item: any, index: number) => (
                                                <SelectItem key={`${item.lpmU_Id}-${index}`} value={item.lpmU_Id.toString()}>
                                                    {item.lpmU_UnitName}
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
                        name='LPMMT_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Main Topic <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Topic' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {mainTopics
                                            .filter((item) => item.lpmmT_Id)
                                            .map((item: any, index: number) => (
                                                <SelectItem key={`${item.lpmmT_Id}-${index}`} value={item.lpmmT_Id.toString()}>
                                                    {item.lpmmT_TopicName}
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
                        name='LPMT_TopicName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Topic Name <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='LPMT_LessonPlan'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Topic Description <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='LPMT_TotalPeriods'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Total Periods <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='LPMT_TotalHrs'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Total Hours <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Additional fields from legacy form */}
                    <FormField
                        control={form.control}
                        name='LPMT_TeacherGuide'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teacher Guide</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='LPMT_StudentGuide'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Student Guide</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='LPMT_MaterialNeeded'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Material Needed</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='LPMT_References'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>References</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='LPMT_Homework'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Home Work</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FileUploadSection
                        name='teacherGuides'
                        label="Teachers' Guide Upload"
                        files={teacherGuides.files}
                        onAdd={() =>
                            teacherGuides.setFiles((prev) => [
                                ...prev,
                                { id: Date.now().toString(), lpmtR_Resources: '', lpmtR_FileName: '' }
                            ])
                        }
                        onRemove={(i) => {
                            teacherGuides.setFiles((prev) => {
                                const n = [...prev];
                                n.splice(i, 1);
                                return n;
                            });
                        }}
                        onUpload={(i, f) => handleFileUpload(i, f, teacherGuides)}
                    />
                    <FileUploadSection
                        name='studentGuides'
                        label="Students' Guide Upload"
                        files={studentGuides.files}
                        onAdd={() =>
                            studentGuides.setFiles((prev) => [
                                ...prev,
                                { id: Date.now().toString(), lpmtR_Resources: '', lpmtR_FileName: '' }
                            ])
                        }
                        onRemove={(i) => {
                            studentGuides.setFiles((prev) => {
                                const n = [...prev];
                                n.splice(i, 1);
                                return n;
                            });
                        }}
                        onUpload={(i, f) => handleFileUpload(i, f, studentGuides)}
                    />
                    <FileUploadSection
                        name='materials'
                        label='Material Files Upload'
                        files={materials.files}
                        onAdd={() =>
                            materials.setFiles((prev) => [...prev, { id: Date.now().toString(), lpmtR_Resources: '', lpmtR_FileName: '' }])
                        }
                        onRemove={(i) => {
                            materials.setFiles((prev) => {
                                const n = [...prev];
                                n.splice(i, 1);
                                return n;
                            });
                        }}
                        onUpload={(i, f) => handleFileUpload(i, f, materials)}
                    />
                    <FileUploadSection
                        name='references'
                        label='Reference Files Upload'
                        files={references.files}
                        onAdd={() =>
                            references.setFiles((prev) => [...prev, { id: Date.now().toString(), lpmtR_Resources: '', lpmtR_FileName: '' }])
                        }
                        onRemove={(i) => {
                            references.setFiles((prev) => {
                                const n = [...prev];
                                n.splice(i, 1);
                                return n;
                            });
                        }}
                        onUpload={(i, f) => handleFileUpload(i, f, references)}
                    />
                </div>

                <div className='flex justify-center gap-2'>
                    <Button type='submit'>Save</Button>
                    <Button type='button' variant='outline' onClick={onSuccess}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
