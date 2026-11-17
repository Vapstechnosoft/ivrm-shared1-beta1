'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadDocument } from '@/server/document_upload';
import {
    editDetails,
    onChangeClass,
    onChangeSection,
    onChangeSubject,
    onChangeUnit,
    onChangeYear,
    saveDetails,
    viewUploadFiles
} from '@/server/lesson-planner/transactions/school-subject-master-topic-mapping';
import type { ISchoolSubjectTopicMapping } from '@/types/lesson-planner/transactions/school-subject-master-topic-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FileUploadSection } from './file-upload-section';

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

// Reuse the useFileState helper or just standard state
const useFileState = () => {
    const [files, setFiles] = useState<{ id: string; lpmtR_Resources: string; lpmtR_FileName: string }[]>([
        { id: '1', lpmtR_Resources: '', lpmtR_FileName: '' }
    ]);
    return { files, setFiles };
};

export default function UpdateSchoolSubjectTopicMappingForm({
    selectedRow,
    masterYear,
    onSuccess
}: {
    selectedRow: ISchoolSubjectTopicMapping;
    masterYear: any[];
    onSuccess: () => void;
}) {
    // Dropdown states
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
            ASMAY_Id: selectedRow.asmaY_Id || 0,
            ASMCL_Id: selectedRow.asmcL_Id || 0,
            ASMS_Id: selectedRow.asmS_Id || 0,
            ISMS_Id: selectedRow.ismS_Id || 0,
            LPMU_Id: selectedRow.lpmU_Id || 0,
            LPMMT_Id: selectedRow.lpmmT_Id || 0,
            LPMT_TopicName: selectedRow.lpmT_TopicName || '',
            LPMT_LessonPlan: selectedRow.lpmT_LessonPlan || '',
            LPMT_TotalHrs: selectedRow.lpmT_TotalHrs || 0,
            LPMT_TotalPeriods: selectedRow.lpmT_TotalPeriods || 0,
            LPMT_TeacherGuide: selectedRow.lpmT_TeacherGuide || '',
            LPMT_StudentGuide: selectedRow.lpmT_StudentGuide || '',
            LPMT_MaterialNeeded: selectedRow.lpmT_MaterialNeeded || '',
            LPMT_References: selectedRow.lpmT_References || '',
            LPMT_Homework: selectedRow.lpmT_Homework || ''
        }
    });

    // Validating and setting default values is tricky because we need the dropdown options to be loaded first
    // We will use useEffect to fetch edit details and THEN set all states and form values.

    useEffect(() => {
        const fetchDetails = async () => {
            const rowId = selectedRow?.lpmT_Id || (selectedRow as any)?.LPMT_Id;
            if (!rowId) return;

            const getList = (apiRes: any, key: string, alternatives: string[]) => {
                if (!apiRes) return [];

                const extractRaw = (obj: any): any[] | null => {
                    if (!obj) return null;
                    if (Array.isArray(obj)) return obj;
                    if (obj.$values && Array.isArray(obj.$values)) return obj.$values;

                    if (obj[key]) {
                        if (Array.isArray(obj[key])) return obj[key];
                        if (obj[key].$values && Array.isArray(obj[key].$values)) return obj[key].$values;
                    }

                    const altKey = alternatives.find((alt) => obj[alt]);
                    if (altKey) {
                        if (Array.isArray(obj[altKey])) return obj[altKey];
                        if (obj[altKey].$values && Array.isArray(obj[altKey].$values)) return obj[altKey].$values;
                    }
                    return null;
                };

                const res = extractRaw(apiRes) || extractRaw(apiRes.data);
                if (res) return res;

                // Nuclear search: find the first available array
                const findFirstArray = (obj: any): any[] | null => {
                    if (!obj || typeof obj !== 'object') return null;
                    for (const k in obj) {
                        if (Array.isArray(obj[k])) return obj[k];
                        if (obj[k]?.$values && Array.isArray(obj[k].$values)) return obj[k].$values;
                    }
                    return null;
                };

                return findFirstArray(apiRes) || findFirstArray(apiRes.data) || [];
            };

            try {
                console.info('UpdateForm selectedRow:', selectedRow);
                const apiRes: any = await editDetails(
                    selectedRow.lpmU_Id || (selectedRow as any).LPMU_Id,
                    selectedRow.ismS_Id || (selectedRow as any).ISMS_Id,
                    selectedRow.lpmT_Id || (selectedRow as any).LPMT_Id,
                    selectedRow.lpmmT_Id || (selectedRow as any).LPMMT_Id,
                    Number(selectedRow.asmaY_Id || (selectedRow as any).ASMAY_Id),
                    Number(selectedRow.asmcL_Id || (selectedRow as any).ASMCL_Id)
                );

                console.info('UpdateForm Edit Details RAW:', JSON.stringify(apiRes));
                const dataObject = apiRes?.data || apiRes;
                const data =
                    dataObject?.geteditdetials?.[0] ||
                    dataObject?.topicdetails?.[0] ||
                    (Array.isArray(dataObject) ? dataObject[0] : dataObject);

                if (dataObject && data) {
                    // 1. Finalize IDs (IDs are critical for binding and subsequent fetches)
                    const asmayId = Number(data.asmaY_Id || data.ASMAY_Id || selectedRow.asmaY_Id || (selectedRow as any).ASMAY_Id || 0);
                    const asmcLId = Number(data.asmcL_Id || data.ASMCL_Id || selectedRow.asmcL_Id || (selectedRow as any).ASMCL_Id || 0);
                    const asmsId = Number(data.asmS_Id || data.ASMS_Id || selectedRow.asmS_Id || (selectedRow as any).ASMS_Id || 0);
                    const ismsId = Number(data.ismS_Id || data.ISMS_Id || selectedRow.ismS_Id || (selectedRow as any).ISMS_Id || 0);
                    const lpmuId = Number(data.lpmU_Id || data.LPMU_Id || selectedRow.lpmU_Id || (selectedRow as any).LPMU_Id || 0);
                    const lpmmTId = Number(data.lpmmT_Id || data.LPMMT_Id || selectedRow.lpmmT_Id || (selectedRow as any).LPMMT_Id || 0);

                    // 2. Extract initial master lists from response
                    const classesList = getList(dataObject, 'getclass', ['classes']);
                    let unitList = getList(dataObject, 'unitdetails', ['units']);
                    let topicList = getList(dataObject, 'topicdetails', ['mainTopics']);
                    let sectionsList = getList(dataObject, 'getSection', ['mastersection', 'sections']);
                    let subjectsList = getList(dataObject, 'getsubjectlist', ['subjects']);

                    // 3. Proactive / Sequential fetching for missing lists
                    // If Section list is empty, fetch using Class
                    console.info('Initial sectionsList length:', sectionsList.length);
                    console.info('Will fetch sections?', sectionsList.length === 0 && asmayId && asmcLId);

                    if (sectionsList.length === 0 && asmayId && asmcLId) {
                        console.info('Fetching sections using onChangeClass with:', { asmayId, asmcLId });
                        const secRes: any = await onChangeClass(asmayId, asmcLId);
                        console.info('onChangeClass RAW response:', JSON.stringify(secRes, null, 2));

                        // Extract data - try multiple ways
                        let fetchedData = getList(secRes, 'getSection', ['mastersection', 'sections']);
                        console.info('After getList with mastersection:', fetchedData);

                        // If not found, try getting directly from data array
                        if (fetchedData.length === 0 && secRes.data && Array.isArray(secRes.data)) {
                            console.info('Trying to extract from secRes.data directly');
                            fetchedData = secRes.data;
                        } else if (fetchedData.length === 0 && Array.isArray(secRes)) {
                            console.info('Trying to extract from secRes as array');
                            fetchedData = secRes;
                        }

                        console.info('Final fetchedData:', fetchedData);
                        console.info('fetchedData first item:', fetchedData[0]);

                        // Check if subjects or sections are returned
                        if (fetchedData.length > 0 && (fetchedData[0].ismS_Id || fetchedData[0].ISMS_Id)) {
                            console.info('Data contains subjects, setting to subjectsList');
                            subjectsList = fetchedData;
                            sectionsList = [];
                        } else if (fetchedData.length > 0 && (fetchedData[0].asmS_Id || fetchedData[0].ASMS_Id)) {
                            console.info('Data contains sections, setting to sectionsList');
                            sectionsList = fetchedData;
                        } else if (fetchedData.length > 0) {
                            // Fallback: assume sections
                            console.info('Fallback: assuming sections');
                            sectionsList = fetchedData;
                        }

                        console.info('After assignment - sectionsList:', sectionsList);
                    }

                    // If Subjects list is empty, fetch using Section
                    if (subjectsList.length === 0 && asmayId && asmcLId && asmsId) {
                        const subRes: any = await onChangeSection(asmayId, asmcLId, asmsId);
                        subjectsList = getList(subRes, 'getsubjectlist', ['subjects']);
                    }

                    // If Units list is empty, fetch using Subject
                    if (unitList.length === 0 && asmayId && asmcLId && ismsId) {
                        const unitRes: any = await onChangeSubject(asmayId, asmcLId, ismsId);
                        unitList = getList(unitRes, 'unitdetails', ['units']);
                    }

                    // If Main Topic list is empty, fetch using Unit
                    if (topicList.length === 0 && asmayId && asmcLId && ismsId && lpmuId) {
                        const topRes: any = await onChangeUnit(asmayId, asmcLId, ismsId, lpmuId);
                        topicList = getList(topRes, 'topicdetails', ['mainTopics']);
                    }

                    // 4. Update state with finalized lists
                    console.info('Setting state with lists:', {
                        classesCount: classesList.length,
                        sectionsCount: sectionsList.length,
                        subjectsCount: subjectsList.length,
                        unitsCount: unitList.length,
                        topicsCount: topicList.length
                    });
                    console.info('Sections data:', sectionsList);
                    console.info('Form will be reset with IDs:', {
                        ASMAY_Id: asmayId,
                        ASMCL_Id: asmcLId,
                        ASMS_Id: asmsId,
                        ISMS_Id: ismsId,
                        LPMU_Id: lpmuId,
                        LPMMT_Id: lpmmTId
                    });

                    setClasses(classesList);
                    setSections(sectionsList);
                    setSubjects(subjectsList);
                    setUnits(unitList);
                    setMainTopics(topicList);

                    // 5. Reset form with finalized values
                    form.reset({
                        ASMAY_Id: asmayId,
                        ASMCL_Id: asmcLId,
                        ASMS_Id: asmsId,
                        ISMS_Id: ismsId,
                        LPMU_Id: lpmuId,
                        LPMMT_Id: lpmmTId,
                        LPMT_TopicName: data.lpmT_TopicName || data.LPMT_TopicName || selectedRow.lpmT_TopicName || '',
                        LPMT_LessonPlan: data.lpmT_LessonPlan || data.LPMT_LessonPlan || selectedRow.lpmT_LessonPlan || '',
                        LPMT_TotalHrs: Number(data.lpmT_TotalHrs || data.LPMT_TotalHrs || selectedRow.lpmT_TotalHrs || 0),
                        LPMT_TotalPeriods: Number(data.lpmT_TotalPeriods || data.LPMT_TotalPeriods || selectedRow.lpmT_TotalPeriods || 0),
                        LPMT_TeacherGuide: data.lpmT_TeacherGuide || data.LPMT_TeacherGuide || selectedRow.lpmT_TeacherGuide || '',
                        LPMT_StudentGuide: data.lpmT_StudentGuide || data.LPMT_StudentGuide || selectedRow.lpmT_StudentGuide || '',
                        LPMT_MaterialNeeded: data.lpmT_MaterialNeeded || data.LPMT_MaterialNeeded || selectedRow.lpmT_MaterialNeeded || '',
                        LPMT_References: data.lpmT_References || data.LPMT_References || selectedRow.lpmT_References || '',
                        LPMT_Homework: data.lpmT_Homework || data.LPMT_Homework || selectedRow.lpmT_Homework || ''
                    });

                    // 6. Fetch resources (Upload Files)
                    const recordId = Number(data.lpmT_Id || data.LPMT_Id || selectedRow.lpmT_Id);
                    const [tgRes, sgRes, mgRes, rgRes] = await Promise.all([
                        viewUploadFiles(recordId, ismsId, lpmuId, 'Teacher Guide'),
                        viewUploadFiles(recordId, ismsId, lpmuId, 'Student Guide'),
                        viewUploadFiles(recordId, ismsId, lpmuId, 'Materials Needed'),
                        viewUploadFiles(recordId, ismsId, lpmuId, 'References')
                    ]);

                    const mapFilesToState = (res: any) => {
                        const list = getList(res, 'uploadfiles', ['files']);
                        return list.length > 0
                            ? list.map((f: any, i: number) => ({
                                  id: (i + 1).toString(),
                                  lpmtR_Resources: f.lpmtR_Resources,
                                  lpmtR_FileName: f.lpmtR_FileName,
                                  lpmtR_Id: f.lpmtR_Id
                              }))
                            : [{ id: '1', lpmtR_Resources: '', lpmtR_FileName: '' }];
                    };

                    teacherGuides.setFiles(mapFilesToState(tgRes));
                    studentGuides.setFiles(mapFilesToState(sgRes));
                    materials.setFiles(mapFilesToState(mgRes));
                    references.setFiles(mapFilesToState(rgRes));
                }
            } catch (e: any) {
                console.error('UpdateForm Initialization Error:', e);
                toast.error(`Failed to load edit details: ${e.message || 'Unknown error'}`);
            }
        };
        fetchDetails();
    }, [selectedRow, form]);

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
                lpmT_Id: selectedRow.lpmT_Id,
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
                toast.success(res.message || 'Updated successfully');
                onSuccess();
            } else {
                toast.error(res.message || 'Failed to update');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    // Handlers (Cascading logic same as Add Form, but pre-filled initially)
    const handleYearChange = async (yearId: string) => {
        const id = Number(yearId);
        form.setValue('ASMAY_Id', id);
        startTransition(async () => {
            try {
                const yearRes: any = await onChangeYear(id);
                console.info('Update handleYearChange RAW:', JSON.stringify(yearRes));
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
                console.info('Update handleClassChange RAW:', JSON.stringify(res));

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
                console.info('Update handleSectionChange RAW:', JSON.stringify(res));
                const finalData = extractArray(res, 'getsubjectlist');
                setSubjects(finalData);
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
                console.info('Update handleSubjectChange RAW:', JSON.stringify(res));
                const finalData = extractArray(res, 'unitdetails');
                setUnits(finalData);
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
                console.info('Update handleUnitChange RAW:', JSON.stringify(res));
                const finalData = extractArray(res, 'topicdetails');
                setMainTopics(finalData);
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch topics');
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Only showing disabled dropdowns for Year/Class as per legacy requirement `ng-disabled="editdata==true"` ?
                        Legacy: `ng-disabled="editdata==true"` for Year, Class.
                        It seems they lock key fields on edit. I will follow that.
                    */}
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
                                <FormLabel>Section </FormLabel>
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

                    {/* Other fields... allow edit? Legacy allows editing topics and descriptions etc. */}
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
                    {/* File uploads section reused */}
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
                    <Button type='submit'>Update</Button>
                    <Button type='button' variant='outline' onClick={onSuccess}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
