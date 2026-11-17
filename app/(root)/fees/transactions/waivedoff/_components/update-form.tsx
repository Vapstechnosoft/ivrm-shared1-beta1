'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormError, Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import {
    useClassdropdowndatafee,
    useFeeTransactionWaivedOffGrid,
    useSectiondropdowndatafee,
    useacademicyerdropdowndatafee
} from '@/hooks/fees/useTrasactions';

import { feeTransactionWaivedOffSchema } from '@/schemas/fees/trasactions';
import {
    getEditGroupList,
    getEditHeadList,
    getStudentdetails,
    saveFeeWivedOff,
    uploadDocument
} from '@/server/fees/trasactions/waived_off';
import type { ApiSearchparams } from '@/types';
import type {
    feeTransactionWaivedOffGrid,
    feeTransactionWaivedOffGroup,
    feeTransactionWaivedOffHead,
    feeTransactionWaivedOffStudentDetails
} from '@/types/fees/transactions/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { FeeTransactionHeadUpdateList } from './head-update-list';

type FormFields = z.infer<typeof feeTransactionWaivedOffSchema.addOrUpdate>;

interface UpdateFeeTransactionWaiveOffFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: feeTransactionWaivedOffGrid;
}

export default function UpdateFeeTransactionWaiveOffForm({
    onSuccess,
    className = '',
    selectedRow
}: UpdateFeeTransactionWaiveOffFormProps) {
    const {
        handleSubmit,
        reset,
        setValue,
        control,
        watch,
        trigger,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeTransactionWaivedOffSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            academicYear: 0,
            class: 0,
            section: 0,
            student: 0,
            remarks: '',
            date: undefined,
            uploadedPhotoPath: '',
            feeGroupIds: [] // Initialize as empty array, not undefined
        }
    });

    // Add this useEffect to log form state
    useEffect(() => {
        console.log('📝 Form initialized with values:', getValues());
        console.log('Selected Row:', selectedRow);
    }, [getValues, selectedRow]);

    const { refetchAll } = useFeeTransactionWaivedOffGrid();

    const [academicYear, setAcademicYear] = useState<number | null>(null);
    const [classWise, setclassWise] = useState<number | null>(null);
    const [sectionWise, setsectionWise] = useState<number | null>(null);
    const [studentWise, setstudentWise] = useState<number | null>(null);
    const [remarks, setRemarks] = useState<string>('');
    const [grouplist, setgrouplist] = useState<string[]>([]);
    const [refundableType, setRefundableType] = useState<string>('Refundable');
    const [fineWaiveOff, setFineWaiveOff] = useState<boolean>(false);
    const [completeFineWaiveOff, setCompleteFineWaiveOff] = useState<boolean>(false);
    const [nameType, setnameType] = useState<string>('NameReg.No');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [studentDetails, setStudentDetails] = useState<feeTransactionWaivedOffStudentDetails[]>([]);
    const [studentDetailsLoading, setStudentDetailsLoading] = useState(false);
    const [studentDetailsError, setStudentDetailsError] = useState<any>(null);
    const [groupList, setGroupList] = useState<feeTransactionWaivedOffGroup[]>([]);
    const [groupListLoading, setGroupListLoading] = useState(false);
    const [groupListError, setGroupListError] = useState<any>(null);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isViewing, setIsViewing] = useState(false);
    const [selectedHead, setSelectedHead] = useState<any[]>([]);
    const [apisearchParams_, setApisearchParams_] = useState<ApiSearchparams>({});
    //const [tableProps, setTableProps] = useState<any>(null);
    const [headList, setHeadList] = useState<feeTransactionWaivedOffHead[]>([]);
    const [headListLoading, setHeadListLoading] = useState(false);
    const [headListError, setHeadListError] = useState<any>(null);
    const [dateopen, setDateOpen] = useState(false);
    const [uploadedLogo, setUploadedLogo] = useState<{
        document_Path: string;
        documentName: string;
        isUploading: boolean;
    } | null>(null);
    const [preSelectedInstallmentIds, setPreSelectedInstallmentIds] = useState<string[]>([]);
    const tableConfig = useMemo(() => {
        return {
            data: headList,
            total: headList.length,
            page: 1,
            pageSize: headList.length
        };
    }, [headList]);
    const tableProps = useDataTableProps(tableConfig);

    useEffect(() => {
        if (!selectedRow) return;
        setAcademicYear(selectedRow.asmaY_Id);
        setclassWise(selectedRow.asmcL_Id);
        setsectionWise(selectedRow.asmS_Id);
        setstudentWise(selectedRow.amsT_Id);
        setRemarks(selectedRow.fswO_WaivedOffRemarks);
        reset({
            academicYear: selectedRow.asmaY_Id,
            class: selectedRow.asmcL_Id,
            section: selectedRow.asmS_Id,
            student: selectedRow.amsT_Id,
            remarks: selectedRow.fswO_WaivedOffRemarks,
            date: new Date(selectedRow.fswO_Date)
        });
    }, [selectedRow, reset]);

    const { data: academicYears, isLoading: academicYearLoading, error: academicYearError } = useacademicyerdropdowndatafee();

    const { data: classdata, isLoading: classloading, error: classerror } = useClassdropdowndatafee();

    const { data: sectiondata, isLoading: secloading, error: sectionerror } = useSectiondropdowndatafee();

    const asmay_Id = watch('academicYear');
    const asmcl_Id = watch('class');
    const asms_Id = watch('section');
    const amst_Id = watch('student');

    //--------------------Student List---------------------
    const fetchStudentDetails = async () => {
        if (!asmay_Id) return;
        if (!asmcl_Id) return;
        if (!asms_Id) return;
        try {
            setStudentDetailsLoading(true);
            setStudentDetailsError(null);

            const res = await getStudentdetails(Number(asmay_Id), Number(asmcl_Id), Number(asms_Id));
            setStudentDetails(res.data ?? []);
            setValue('student', 0);
        } catch (error) {
            console.error('Error fetching student class mapping', error);
            setStudentDetailsError(error);
        } finally {
            setStudentDetailsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentDetails();
    }, [asmay_Id, asmcl_Id, asms_Id]);

    //---------------------Bind Student Data-------------------------
    useEffect(() => {
        if (!selectedRow) return;
        if (studentDetails.length === 0) return;
        const exists = studentDetails.some((s) => s.amsT_Id === selectedRow.amsT_Id);

        if (exists) {
            setValue('student', selectedRow.amsT_Id, { shouldValidate: true });
        }
    }, [studentDetails, selectedRow, setValue]);

    //---------------------------------Group List-------------------
    const fetcthGroupList = async () => {
        if (!asmay_Id) return;
        if (!amst_Id) return;
        try {
            setGroupListLoading(true);
            setGroupListError(null);

            const res = await getEditGroupList(Number(asmay_Id), Number(amst_Id), selectedRow.fmG_Id);
            setGroupList(res.data ?? []);
        } catch (error) {
            console.error('Error fetching student class mapping', error);
            setGroupListError(error);
        } finally {
            setGroupListLoading(false);
        }
    };

    useEffect(() => {
        setGroupList([]);
        setSelectedGroups([]);
        fetcthGroupList();
    }, [asmay_Id, amst_Id, refundableType]);

    //----------------------Bind Group List-------------------------
    useEffect(() => {
        if (!selectedRow) return;
        if (groupList.length === 0) return;
        const gid = selectedRow.fmG_Id;
        if (groupList.some((g) => g.fmG_Id === gid)) {
            setSelectedGroups([gid]);
        }
    }, [groupList, selectedRow]);

    //-----------------------------Head List---------------------
    const fetcthHeadList = async () => {
        if (!asmay_Id) return;
        if (!amst_Id) return;
        if (!selectedGroups) return;
        try {
            setHeadListLoading(true);
            setHeadListError(null);

            const res = await getEditHeadList(
                Number(asmay_Id),
                Number(amst_Id),
                selectedRow.fmG_Id,
                selectedRow.fmH_Id,
                selectedRow.ftI_Id,
                selectedRow.fmA_Id
            );
            const updatedHeadList =
                res.data?.map((item) => {
                    if (item.fmH_Id === selectedRow?.fmH_Id && item.ftI_Id === selectedRow?.ftI_Id) {
                        return {
                            ...item,
                            waivedOff: selectedRow.fswO_WaivedOffAmount ?? 0
                        };
                    }
                    return item;
                }) ?? [];
            console.log('updatedheadlist', updatedHeadList, res.data);
            const preselectedIds = updatedHeadList.reduce<string[]>((acc, s, ind) => {
                if (s.fmH_Id === selectedRow.fmH_Id && s.ftI_Id === selectedRow.ftI_Id) {
                    acc.push(ind.toString());
                }
                return acc;
            }, []);
            setPreSelectedInstallmentIds(preselectedIds);
            setHeadList(updatedHeadList ?? []);
            //res.data = updatedHeadList;
            //setTableProps(useDataTableProps(res ?? []));
        } catch (error) {
            console.error('Error fetching student class mapping', error);
            setHeadListError(error);
        } finally {
            setHeadListLoading(false);
        }
    };

    useEffect(() => {
        fetcthHeadList();
    }, [amst_Id, selectedGroups, fineWaiveOff]);

    useEffect(() => {
        setGroupList([]);
        setSelectedGroups([]);
    }, [asmay_Id, asmcl_Id, asms_Id]);

    //--------------------Bind Head List---------------------------
    // useEffect(() => {
    //     if (!selectedRow || headList.length === 0) return;
    //     const preselectedIds = headList.reduce<string[]>((acc, s, ind) => {
    //         if (s.fmH_Id === selectedRow.fmH_Id && s.ftI_Id === selectedRow.ftI_Id) {
    //             acc.push(ind.toString());
    //         }
    //         return acc;
    //     }, []);
    //     setPreSelectedInstallmentIds(preselectedIds);
    // }, [selectedRow, headList]);

    useEffect(() => {
        if (!selectedRow) return;
        if (selectedRow.fswO_FineFlg === 1) {
            fineWaiveOff === true;
        } else {
            fineWaiveOff === false;
        }
        if (selectedRow.fswO_FullFineWaiveOffFlg === 1) {
            completeFineWaiveOff === true;
        } else {
            completeFineWaiveOff === false;
        }
    }, [selectedRow]);

    const handleApiParmasChange = (apiparmas: ApiSearchparams) => {
        setApisearchParams_((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(apiparmas)) return prev;
            return apiparmas;
        });
    };

    const feeHeads = useMemo(() => {
        return FeeTransactionHeadUpdateList.filter((col) => {
            if (fineWaiveOff && 'accessorKey' in col && col.accessorKey === 'totalTobepaid') {
                return false;
            }
            return true;
        });
    }, [fineWaiveOff]);

    //---------------------Upload Image----------------------------
    const handleLogoUpload = async (file: File) => {
        try {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size should not exceed 2MB');
                return;
            }

            setUploadedLogo({
                document_Path: '',
                documentName: file.name,
                isUploading: true
            });

            const formData = new FormData();
            formData.forEach((v, k) => console.log(k, v));
            formData.append('file', file);
            formData.append('FileName', file.name);
            formData.append('ContentType', file.type);
            formData.append('subContainerName', 'fees_waivedoff_document');

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                setUploadedLogo({
                    document_Path: response.data,
                    documentName: file.name,
                    isUploading: false
                });

                toast.success('Photo uploaded successfully');
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            setUploadedLogo(null);
            toast.error(`Failed to upload : ${errorMessage}`);
        }
    };

    useEffect(() => {
        if (!selectedRow) return;

        console.log('Initializing form with selectedRow:', selectedRow);

        setAcademicYear(selectedRow.asmaY_Id);
        setclassWise(selectedRow.asmcL_Id);
        setsectionWise(selectedRow.asmS_Id);
        setstudentWise(selectedRow.amsT_Id);
        setRemarks(selectedRow.fswO_WaivedOffRemarks);

        // Set feeGroupIds
        const initialFeeGroupIds = selectedRow.fmG_Id ? [selectedRow.fmG_Id] : [];
        setSelectedGroups(initialFeeGroupIds);

        reset({
            academicYear: selectedRow.asmaY_Id,
            class: selectedRow.asmcL_Id,
            section: selectedRow.asmS_Id,
            student: selectedRow.amsT_Id,
            remarks: selectedRow.fswO_WaivedOffRemarks,
            date: new Date(selectedRow.fswO_Date),
            uploadedPhotoPath: '',
            feeGroupIds: initialFeeGroupIds // Make sure this is set
        });

        console.log('Form initialized with feeGroupIds:', initialFeeGroupIds);
    }, [selectedRow, reset, setValue]);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];

        if (!f) return;

        setPhotoFile(f);
        setPhotoPreview(URL.createObjectURL(f));

        await handleLogoUpload(f);
    };

    const onSubmit = async (data: FormFields) => {
        if (selectedHead.length < 1) {
            toast.error('Please Select a Atleast one Head!!');
            return;
        }
        try {
            const formattedHeadList = selectedHead.map((row: feeTransactionWaivedOffHead) => ({
                fmG_Id: row.fmG_Id,
                fmH_Id: row.fmH_Id,
                ftI_Id: row.ftI_Id,
                fmA_Id: row.fmA_Id,
                fswO_WaivedOffAmount: Number(row.waivedOff ?? 0)
            }));
            function formatDateToYMD(date: any) {
                if (!date) return null;
                const d = new Date(date);
                return d.toISOString();
            }
            const payload = {
                fswO_Id: selectedRow.fswO_Id,
                amsT_Id: amst_Id,
                asmaY_Id: asmay_Id,
                fswO_Date: format(data.date, 'yyyy-MM-dd'),
                finewaiveoff: fineWaiveOff === true ? 1 : 0,
                fswO_WaivedOffRemarks: data.remarks || '',
                completefinewaiveoff: completeFineWaiveOff === true ? 1 : 0,
                filepath: uploadedLogo?.document_Path || '',
                filename: uploadedLogo?.documentName || '',
                headlist: formattedHeadList
            };

            const response = await saveFeeWivedOff(payload);

            if (response?.success) {
                toast.success('Fee WaivedOff Updated Successfully');
                handleReset();
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(response?.message || 'Update failed');
            }
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error(err?.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        reset();
        setAcademicYear(null);
        setclassWise(null);
        setsectionWise(null);
        setstudentWise(null);
        setRefundableType('Refundable');
        setFineWaiveOff(false);
        setCompleteFineWaiveOff(false);
        setnameType('NameReg.No');
        setRemarks('');
        setPhotoFile(null);
    };
    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='flex gap-6'>
                    <div className='flex-1 space-y-6'>
                        <div>
                            <Label className='min-w-[150px] text-right' htmlFor='academicYear'>
                                Academic Year:<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='flex w-full max-w-[400px] flex-col'>
                                <Controller
                                    name='academicYear'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(val) => {
                                                const id = Number(val);
                                                field.onChange(id);
                                                setAcademicYear(id);
                                            }}
                                            value={
                                                typeof field.value === 'number' || typeof field.value === 'string'
                                                    ? String(field.value)
                                                    : ''
                                            }
                                            disabled={true}>
                                            <SelectTrigger className='min-w-[400px] text-center'>
                                                <SelectValue placeholder='--Select Academic Year--' />
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
                                    )}
                                />
                                {errors.academicYear && <FormError>{errors.academicYear.message}</FormError>}
                            </div>
                        </div>
                        <div>
                            <Label className='min-w-[150px] text-right' htmlFor='class'>
                                Class:<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='flex w-full max-w-[400px] flex-col'>
                                <Controller
                                    name='class'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(val) => {
                                                const id = Number(val);
                                                field.onChange(id);
                                                setclassWise(id);
                                            }}
                                            value={
                                                typeof field.value === 'number' || typeof field.value === 'string'
                                                    ? String(field.value)
                                                    : ''
                                            }
                                            disabled={true}>
                                            <SelectTrigger className='min-w-[400px] text-center'>
                                                <SelectValue placeholder='--Select Class --' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classloading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : classerror ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading
                                                    </SelectItem>
                                                ) : (
                                                    classdata?.data?.map((item: any) => (
                                                        <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                            {item.asmcL_ClassName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.class && <FormError>{errors.class.message}</FormError>}
                            </div>
                        </div>

                        <div>
                            <Label className='min-w-[150px] text-right' htmlFor='section'>
                                Section:<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='flex w-full max-w-[400px] flex-col'>
                                <Controller
                                    name='section'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(val) => {
                                                const id = Number(val);
                                                field.onChange(id);
                                                setsectionWise(id);
                                            }}
                                            value={
                                                typeof field.value === 'number' || typeof field.value === 'string'
                                                    ? String(field.value)
                                                    : ''
                                            }
                                            disabled={true}>
                                            <SelectTrigger className='min-w-[400px] text-center'>
                                                <SelectValue placeholder='--Select Section --' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {secloading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : sectionerror ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading
                                                    </SelectItem>
                                                ) : (
                                                    sectiondata?.data?.map((item: any) => (
                                                        <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                            {item.asmC_SectionName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.section && <FormError>{errors.section.message}</FormError>}
                            </div>
                        </div>
                        <div className='flex flex-row items-center justify-start gap-4 rounded-lg border border-gray-300 bg-white px-3 py-2'>
                            <label className='inline-flex cursor-pointer items-center space-x-2'>
                                <input
                                    type='radio'
                                    name='NameReg.NoFlg'
                                    value='NameReg.No'
                                    className='form-radio h-4 w-4 text-blue-600'
                                    checked={nameType === 'NameReg.No'}
                                    onChange={(e) => setnameType(e.target.value)}
                                    disabled={true}
                                />
                                <span className='text-gray-900 text-sm'>Name:Reg.No</span>
                            </label>

                            <label className='inline-flex cursor-pointer items-center space-x-2'>
                                <input
                                    type='radio'
                                    name='NameReg.NoFlg'
                                    value='Reg.NoName'
                                    className='form-radio h-4 w-4 text-gray-600'
                                    checked={nameType === 'Reg.NoName'}
                                    onChange={(e) => setnameType(e.target.value)}
                                    disabled={true}
                                />
                                <span className='text-gray-900 text-sm'>Reg.No:Name</span>
                            </label>
                        </div>

                        <div>
                            <Label htmlFor='student'>
                                Student Name:<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='flex w-full max-w-[400px] flex-col'>
                                <Controller
                                    name='student'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value}
                                            value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                            onValueChange={(val) => {
                                                const id = Number(val);
                                                field.onChange(id);
                                                setstudentWise(id);
                                            }}>
                                            <SelectTrigger disabled className='min-w-[400px] text-center'>
                                                <SelectValue placeholder='--Select student --' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {studentDetailsLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : studentDetailsError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading
                                                    </SelectItem>
                                                ) : studentDetails.length === 0 ? (
                                                    <SelectItem value='nodata' disabled>
                                                        No Results
                                                    </SelectItem>
                                                ) : (
                                                    studentDetails?.map((item: any) => (
                                                        <SelectItem key={item.amsT_Id} value={item.amsT_Id.toString()}>
                                                            {item.studentName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.student && <FormError>{errors.student.message}</FormError>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor='remarks' className='inline-flex cursor-pointer items-center space-x-2'>
                                Remarks: <span className='ml-1 text-red-500'>*</span>
                            </Label>

                            <Controller
                                name='remarks'
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        id='remarks'
                                        rows={5}
                                        // onChange={(e)=>setRemarks(e.target.value)}
                                        {...field}
                                        className='mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm'
                                    />
                                )}
                            />

                            {errors.remarks && <FormError>{errors.remarks.message}</FormError>}
                        </div>
                    </div>

                    <div className='flex-1 space-y-6'>
                        <div>
                            <Label htmlFor='date'>
                                Date:<span className='ml-1 text-red-500'>*</span>
                            </Label>

                            <Controller
                                name='date'
                                control={control}
                                render={({ field }) => (
                                    <Popover open={dateopen} onOpenChange={setDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant='outline' className='w-full justify-start text-left font-normal'>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {field.value ? format(field.value, 'yyyy-MM-dd') : 'Select Date'}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <Calendar
                                                mode='single'
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    field.onChange(date);
                                                    setDateOpen(false);
                                                }}
                                                initialFocus
                                                disabled={(date) => {
                                                    return date < new Date(new Date().setHours(0, 0, 0, 0));
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />

                            {errors.date && <FormError>{errors.date.message}</FormError>}
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Type:<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='flex flex-row items-center justify-around rounded-lg border border-gray-300 bg-white px-3 py-2'>
                                <label className='inline-flex cursor-pointer items-center space-x-2'>
                                    <input
                                        type='radio'
                                        name='RefundableFlg'
                                        value='Refundable'
                                        className='form-radio h-4 w-4 text-blue-600'
                                        checked={refundableType === 'Refundable'}
                                        onChange={(e) => setRefundableType(e.target.value)}
                                        disabled={true}
                                    />
                                    <span className='text-gray-900 text-sm'>Refundable</span>
                                </label>

                                <label className='inline-flex cursor-pointer items-center space-x-2'>
                                    <input
                                        type='radio'
                                        name='RefundableFlg'
                                        value='NonRefundable'
                                        className='form-radio h-4 w-4 text-gray-600'
                                        checked={refundableType === 'NonRefundable'}
                                        onChange={(e) => setRefundableType(e.target.value)}
                                        disabled={true}
                                    />
                                    <span className='text-gray-900 text-sm'>Non Refundable</span>
                                </label>
                            </div>
                        </div>

                        <Controller
                            name='feeGroupIds'
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => {
                                const [searchTerm, setSearchTerm] = useState('');
                                const filteredGroups = groupList.filter((grp) =>
                                    grp.fmG_GroupName?.toLowerCase().includes(searchTerm.toLowerCase())
                                );
                                return (
                                    <div>
                                        <Label htmlFor='feeGroupIds' className='inline-flex cursor-pointer items-center space-x-2'>
                                            Group List:<span className='ml-1 text-red-500'>*</span>
                                        </Label>
                                        <div className='group flex flex-col gap-1.5 md:col-span-2'>
                                            {/* Search Input */}
                                            <div className='relative mb-2'>
                                                <input
                                                    type='text'
                                                    placeholder='Search groups...'
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                                                />
                                                {searchTerm && (
                                                    <button
                                                        type='button'
                                                        onClick={() => setSearchTerm('')}
                                                        className='-translate-y-1/2 absolute top-1/2 right-2 text-gray-400 hover:text-gray-600'>
                                                        ✕
                                                    </button>
                                                )}
                                            </div>

                                            {/* Groups List */}
                                            <div className='min-h-[40px] rounded-md border bg-white px-3 py-2'>
                                                <div className='flex max-h-40 flex-col gap-2 overflow-y-auto'>
                                                    {groupListLoading ? (
                                                        <div className='flex items-center justify-center py-4'>
                                                            <span className='text-gray-400 text-sm'>Loading Groups...</span>
                                                        </div>
                                                    ) : filteredGroups.length > 0 ? (
                                                        filteredGroups.map((grp) => {
                                                            const optVal = Number(grp.fmG_Id);
                                                            return (
                                                                <label
                                                                    key={grp.fmG_Id}
                                                                    className='flex cursor-pointer items-center rounded p-1 hover:bg-gray-50'>
                                                                    <input
                                                                        type='checkbox'
                                                                        value={grp.fmG_Id}
                                                                        disabled={true}
                                                                        checked={selectedGroups.includes(optVal)}
                                                                        onChange={async (e) => {
                                                                            const checked = e.target.checked;
                                                                            const newSelected = checked
                                                                                ? [...selectedGroups, optVal]
                                                                                : selectedGroups.filter((p) => p !== optVal);
                                                                            setSelectedGroups(newSelected);
                                                                            field.onChange(newSelected);
                                                                        }}
                                                                        className='mr-2 h-4 w-4 accent-blue-600'
                                                                    />
                                                                    <span className='truncate'>{grp.fmG_GroupName}</span>
                                                                </label>
                                                            );
                                                        })
                                                    ) : groupListError ? (
                                                        <div className='flex items-center justify-center py-4'>
                                                            <span className='text-gray-400 text-sm'>Error loading groups</span>
                                                        </div>
                                                    ) : searchTerm ? (
                                                        <div className='flex items-center justify-center py-4'>
                                                            <span className='text-gray-400 text-sm'>
                                                                No groups found for "{searchTerm}"
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className='flex items-center justify-center py-4'>
                                                            <span className='text-gray-400 text-sm'>No groups available</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Show selected count */}
                                                {selectedGroups.length > 0 && (
                                                    <div className='mt-2 flex items-center justify-between border-t pt-2'>
                                                        <span className='text-blue-600 text-sm'>
                                                            {selectedGroups.length} Group(s) selected
                                                        </span>
                                                        {searchTerm && filteredGroups.length > 0 && (
                                                            <span className='text-gray-500 text-xs'>
                                                                Showing {filteredGroups.length} of {groupList.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {errors.feeGroupIds && <p className='text-red-500 text-sm'>{errors.feeGroupIds.message}</p>}
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        <div className='flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2'>
                            <label className='inline-flex cursor-pointer items-center space-x-2'>
                                <input
                                    type='checkbox'
                                    name='FineWaiveOff'
                                    value='FineWaiveOff'
                                    className='form-checkbox h-4 w-4 text-blue-600'
                                    checked={fineWaiveOff}
                                    disabled={true}
                                    onChange={(e) => setFineWaiveOff(e.target.checked)}
                                />
                                <span className='text-gray-900 text-sm'>Fine WaiveOff</span>
                            </label>

                            <label className='inline-flex cursor-pointer items-center space-x-2'>
                                <input
                                    type='checkbox'
                                    name='CompleteFineWaiveOff'
                                    value='CompleteFineWaiveOff'
                                    className='form-checkbox h-4 w-4 text-gray-600'
                                    checked={completeFineWaiveOff}
                                    disabled={true}
                                    onChange={(e) => setCompleteFineWaiveOff(e.target.checked)}
                                />
                                <span className='text-gray-900 text-sm'>Complete Fine WaiveOff</span>
                            </label>
                        </div>
                        <div>
                            <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />

                            <div>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSubmitting}
                                    className='order-2 w-fit bg-blue-500 transition-all duration-200 hover:scale-105 sm:order-1'>
                                    Upload Photo
                                </Button>

                                {uploadedLogo?.document_Path && (
                                    <div className='mt-2 flex items-center gap-3'>
                                        <div className='text-gray-600 text-sm'>{photoFile?.name}</div>

                                        <Button type='button' variant='secondary' onClick={() => setIsViewing(true)} className='px-3'>
                                            View
                                        </Button>

                                        <Button
                                            type='button'
                                            variant='ghost'
                                            onClick={() => {
                                                setPhotoFile(null);
                                                setPhotoPreview(null);
                                                setUploadedLogo(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}>
                                            <Trash className='text-red-600' />
                                        </Button>
                                    </div>
                                )}
                                {isViewing && photoPreview && (
                                    <div
                                        onClick={() => setIsViewing(false)}
                                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'>
                                        <img src={photoPreview} alt='preview' className='max-h-[90%] max-w-[150%] rounded-lg shadow-lg' />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-2 md:grid-cols-1 '>
                    <div className='container mx-auto w-[1000px] space-y-4 p-1'>
                        {' '}
                        <CollapsibleSection
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <GenericDataTable
                                {...tableProps}
                                columns={feeHeads}
                                onRowSelectionChange={(selectedRows: feeTransactionWaivedOffHead[]) => {
                                    console.log('selectedRows', selectedRows);
                                    const selectedRowIds = selectedRows.map((r) => String(r.ftI_Id));
                                    const selected = headList.filter((head) => selectedRows.some((row) => row.ftI_Id === head.ftI_Id));

                                    setSelectedHead(selected);
                                    setPreSelectedInstallmentIds(preSelectedInstallmentIds);

                                    setSelectedHead(selected);
                                }}
                                defaultSelectedRowIds={preSelectedInstallmentIds}
                                isLoading={headListLoading}
                                error={headListError}
                                columnPinning={{ right: ['actions'] }}
                                loadingMessage='Loading Student Head List...'
                                noDataTitle='No Student Head List Found'
                                noDataDescription='Get started by creating your first Student Head List'
                                errorTitle='Error Student Head List'
                                onSearchQueryChange={handleApiParmasChange}
                                showSearch={false}
                                searchQuery=''
                                showPagination={false}
                                currentApiParams={apisearchParams_}
                                // enableRowSelection={true}
                            />
                        </CollapsibleSection>
                    </div>
                </div>

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
                            Update
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
