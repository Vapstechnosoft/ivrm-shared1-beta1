'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentEligibleReportSchema, IStudentEligibleReport } from '@/types/sports/reports/student-eligible-report';
import { useStudentEligibleReport } from '@/hooks/sports/useStudentEligibleReport';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { FileText, X, Printer, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ReportFormProps {
    onReport: (data: any) => void;
    onReset: () => void;
    onPrint: () => void;
    onExcel: () => void;
    hasData: boolean;
}

export default function ReportForm({ onReport, onReset, onPrint, onExcel, hasData }: ReportFormProps) {
    const { data: loadGridData, getClasses, getSections, getStudents, showDetails } = useStudentEligibleReport();
    const [showStudentList, setShowStudentList] = useState(false);

    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<IStudentEligibleReport>({
        resolver: zodResolver(studentEligibleReportSchema),
        defaultValues: {
            asmaY_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            studentList: []
        }
    });

    const { fields, replace, update } = useFieldArray({
        control,
        name: 'studentList'
    });

    const watchedAsmaY_Id = watch('asmaY_Id');
    const watchedAsmcL_Id = watch('asmcL_Id');
    const watchedAsmS_Id = watch('asmS_Id');

    // Cascade: Year -> Class
    useEffect(() => {
        if (watchedAsmaY_Id) {
            getClasses.mutate({ ASMAY_Id: watchedAsmaY_Id });
        }
    }, [watchedAsmaY_Id, getClasses.mutate]);

    // Cascade: Class -> Section
    useEffect(() => {
        if (watchedAsmaY_Id && watchedAsmcL_Id) {
            getSections.mutate({ ASMAY_Id: watchedAsmaY_Id, ASMCL_Id: watchedAsmcL_Id });
        }
    }, [watchedAsmaY_Id, watchedAsmcL_Id, getSections.mutate]);

    // Cascade: Section -> Students
    useEffect(() => {
        if (watchedAsmaY_Id && watchedAsmcL_Id && watchedAsmS_Id) {
            getStudents.mutateAsync({
                ASMAY_Id: watchedAsmaY_Id,
                ASMCL_Id: watchedAsmcL_Id,
                ASMS_Id: watchedAsmS_Id
            }).then(data => {
                if (data && data.length > 0) {
                    replace(data.map((s: any) => ({ ...s, Selected: false })));
                    setShowStudentList(true);
                } else {
                    replace([]);
                    setShowStudentList(false);
                }
            });
        }
    }, [watchedAsmaY_Id, watchedAsmcL_Id, watchedAsmS_Id, getStudents.mutateAsync, replace]);

    const onSubmit = (values: IStudentEligibleReport) => {
        const selectedStudents = values.studentList?.filter(s => s.Selected) || [];
        if (selectedStudents.length === 0) {
            toast.error('Please select at least one student');
            return;
        }

        const payload = {
            asmaY_Id: values.asmaY_Id,
            asmcL_Id: values.asmcL_Id,
            asmS_Id: values.asmS_Id,
            studentList: selectedStudents.map(s => ({ amsT_Id: s.amsT_Id }))
        };

        showDetails.mutate(payload, {
            onSuccess: (data: any) => {
                if (data && data.length > 0) {
                    onReport({ data });
                } else {
                    toast.error('No records found');
                }
            },
            onError: (error) => {
                toast.error('Failed to generate report');
            }
        });
    };

    const handleCancel = () => {
        reset();
        setShowStudentList(false);
        onReset();
    };

    // Toggle Select All
    const handleSelectAll = (checked: boolean) => {
        fields.forEach((_, index) => {
            update(index, { ...fields[index], Selected: checked } as any);
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {/* Academic Year */}
                <div className='flex flex-col gap-2'>
                    <Label>Academic Year <span className='text-destructive'>*</span></Label>
                    <Controller
                        name='asmaY_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? field.value.toString() : ''}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadGridData?.yearlist?.map((y: any) => (
                                        <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>{y.asmaY_Year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmaY_Id && <span className='text-xs text-destructive'>{errors.asmaY_Id.message}</span>}
                </div>

                {/* Class */}
                <div className='flex flex-col gap-2'>
                    <Label>Class <span className='text-destructive'>*</span></Label>
                    <Controller
                        name='asmcL_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? field.value.toString() : ''}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Class' />
                                </SelectTrigger>
                                <SelectContent>
                                    {getClasses.data?.map((c: any) => (
                                        <SelectItem key={c.asmcL_Id} value={c.asmcL_Id.toString()}>{c.asmcL_ClassName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmcL_Id && <span className='text-xs text-destructive'>{errors.asmcL_Id.message}</span>}
                </div>

                {/* Section */}
                <div className='flex flex-col gap-2'>
                    <Label>Section <span className='text-destructive'>*</span></Label>
                    <Controller
                        name='asmS_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? field.value.toString() : ''}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Section' />
                                </SelectTrigger>
                                <SelectContent>
                                    {getSections.data?.map((s: any) => (
                                        <SelectItem key={s.asmS_Id} value={s.asmS_Id.toString()}>{s.asmC_SectionName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmS_Id && <span className='text-xs text-destructive'>{errors.asmS_Id.message}</span>}
                </div>

                {/* Students Multiselect */}
                {showStudentList && (
                    <div className='flex flex-col gap-2'>
                        <Label>Student <span className='text-destructive'>*</span></Label>
                        <div className='h-32 overflow-y-auto rounded-md border p-2 space-y-1'>
                            <div className='flex items-center space-x-2 pb-1 border-b mb-1'>
                                <Checkbox
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                />
                                <span className='text-xs font-medium'>Select All</span>
                            </div>
                            {fields.map((field, index) => (
                                <div key={field.id} className='flex items-center space-x-2'>
                                    <Controller
                                        name={`studentList.${index}.Selected`}
                                        control={control}
                                        render={({ field: checkField }) => (
                                            <Checkbox checked={!!checkField.value} onCheckedChange={checkField.onChange} />
                                        )}
                                    />
                                    <span className='text-sm'>{field.studentname}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className='flex justify-center gap-4'>
                <Button type='submit' className='bg-primary' disabled={showDetails.isPending}>
                    {showDetails.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <FileText className='mr-2 h-4 w-4' />}
                    Report
                </Button>
                <Button type='button' variant='destructive' onClick={handleCancel}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
                <Button type='button' variant='outline' onClick={onPrint} disabled={!hasData}>
                    <Printer className='mr-2 h-4 w-4' />
                    Print
                </Button>
                <Button type='button' variant='outline' onClick={onExcel} disabled={!hasData}>
                    <FileSpreadsheet className='mr-2 h-4 w-4' />
                    Excel
                </Button>
            </div>
        </form>
    );
}
