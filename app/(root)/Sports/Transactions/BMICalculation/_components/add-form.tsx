'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bmiCalculationSchema, IBMICalculation } from '@/types/sports/transactions/bmi-calculation';
import { useBMICalculation } from '@/hooks/sports/useBMICalculation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Search, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BMICalculationFormProps {
    onSuccess?: () => void;
    selectedRow?: IBMICalculation | null;
}

export default function BMICalculationForm({ onSuccess, selectedRow }: BMICalculationFormProps) {
    const { data: loadGridData, classes, sections, students, save } = useBMICalculation();
    const [showStudentTable, setShowStudentTable] = useState(!!selectedRow);

    const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<IBMICalculation>({
        resolver: zodResolver(bmiCalculationSchema),
        defaultValues: {
            // Upper case keys to match API
            ASMAY_Id: selectedRow?.ASMAY_Id || 0,
            ASMCL_Id: selectedRow?.ASMCL_Id || 0,
            ASMS_Id: selectedRow?.ASMS_Id || 0,
            SPCCSHW_AsOnDate: selectedRow?.SPCCSHW_AsOnDate ? new Date(selectedRow.SPCCSHW_AsOnDate) : new Date(),
            student: selectedRow?.student || []
        }
    });

    const { fields, replace, update } = useFieldArray({
        control,
        name: 'student'
    });

    const watchedAsmaY_Id = watch('ASMAY_Id');
    const watchedAsmcL_Id = watch('ASMCL_Id');
    const watchedAsmS_Id = watch('ASMS_Id');

    // Fetch Classes when Year changes
    // Fetch Classes when Year changes
    useEffect(() => {
        if (watchedAsmaY_Id) {
            classes.mutate({ ASMAY_Id: watchedAsmaY_Id });

            // Logic to determine if we should reset dependent fields
            const shouldReset = !selectedRow || watchedAsmaY_Id !== selectedRow.ASMAY_Id;

            if (shouldReset) {
                setValue('ASMCL_Id', 0);
                setValue('ASMS_Id', 0);
            }
        }
    }, [watchedAsmaY_Id]);

    // Fetch Sections when Class changes
    useEffect(() => {
        if (watchedAsmaY_Id && watchedAsmcL_Id) {
            sections.mutate({ ASMAY_Id: watchedAsmaY_Id, ASMCL_Id: watchedAsmcL_Id });

            const shouldReset = !selectedRow || watchedAsmcL_Id !== selectedRow.ASMCL_Id;

            if (shouldReset) {
                setValue('ASMS_Id', 0);
            }
        }
    }, [watchedAsmaY_Id, watchedAsmcL_Id]);

    const handleGetStudents = async () => {
        const asonDate = watch('SPCCSHW_AsOnDate');
        if (!watchedAsmaY_Id || !watchedAsmcL_Id || !watchedAsmS_Id || !asonDate) {
            toast.error('Please select all filters');
            return;
        }

        const result = await students.mutateAsync({
            ASMAY_Id: watchedAsmaY_Id,
            ASMCL_Id: watchedAsmcL_Id,
            ASMS_Id: watchedAsmS_Id,
            SPCCSHW_AsOnDate: asonDate
        });

        if (result.success && result.data) {
            const studentData = result.data.map((s: any) => ({
                AMST_Id: s.AMST_Id || s.amsT_Id,
                studentName: s.studentName || s.StudentName,
                AMST_AdmNo: s.AMST_AdmNo || s.amsT_AdmNo,
                SPCCSHW_Weight: s.SPCCSHW_Weight || s.spccshW_Weight || 0,
                SPCCSHW_Height: s.SPCCSHW_Height || s.spccshW_Height || 0,
                SPCCSHW_BMI: s.SPCCSHW_BMI || s.spccshW_BMI || 0,
                SPCCSHW_BMIRemark: s.SPCCSHW_BMIRemark || s.spccshW_BMIRemark || '',
                selected: false
            }));
            replace(studentData);
            setShowStudentTable(true);
        } else {
            toast.error(result.message || 'No students found');
            replace([]);
            setShowStudentTable(false);
        }
    };

    const calculateBMI = (weight: number, height: number) => {
        if (!weight || !height) return { bmi: 0, remark: '' };
        const heightMeters = height / 100;
        const bmi = parseFloat((weight / (heightMeters * heightMeters)).toFixed(2));

        let remark = '';
        if (bmi <= 18.5) remark = 'Underweight';
        else if (bmi > 18.5 && bmi <= 24.9) remark = 'Normal';
        else if (bmi >= 25 && bmi <= 29.9) remark = 'Overweight';
        else if (bmi >= 30.0 && bmi <= 39.5) remark = 'Obese';
        else if (bmi > 39.5) remark = 'Extreme Obese';

        return { bmi, remark };
    };

    const handleWeightHeightChange = (index: number, type: 'weight' | 'height', value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return; // Prevent NaN

        const student = fields[index];
        const newWeight = type === 'weight' ? numValue : (Number(student.SPCCSHW_Weight) || 0);
        const newHeight = type === 'height' ? numValue : (Number(student.SPCCSHW_Height) || 0);

        const { bmi, remark } = calculateBMI(newWeight, newHeight);

        update(index, {
            ...student,
            [type === 'weight' ? 'SPCCSHW_Weight' : 'SPCCSHW_Height']: numValue,
            SPCCSHW_BMI: bmi,
            SPCCSHW_BMIRemark: remark,
            selected: true // Auto-select on change
        });
    };

    const onSubmit = async (values: IBMICalculation) => {
        console.log('📝 [BMI FORM] onSubmit triggered with values:', values);

        const selectedStudents = values.student?.filter((s) => s.selected);
        if (!selectedStudents || selectedStudents.length === 0) {
            console.warn('⚠️ [BMI FORM] No students selected');
            toast.error('Please select at least one student');
            return;
        }

        // Format date to local ISO string without milliseconds/Z if needed, 
        // but normally Date object is fine for server actions. 
        // Let's ensure it's a clean payload.
        const dataToSave = {
            ASMAY_Id: Number(values.ASMAY_Id),
            ASMCL_Id: Number(values.ASMCL_Id),
            ASMS_Id: Number(values.ASMS_Id),
            SPCCSHW_AsOnDate: values.SPCCSHW_AsOnDate,
            SPCCSHW_Id: selectedRow?.SPCCSHW_Id || (selectedRow as any)?.spccshW_Id || 0,
            student: selectedStudents.map(s => ({
                AMST_Id: s.AMST_Id,
                AMST_AdmNo: s.AMST_AdmNo,
                studentName: s.studentName,
                SPCCSHW_Height: Number(s.SPCCSHW_Height),
                SPCCSHW_Weight: Number(s.SPCCSHW_Weight),
                SPCCSHW_BMI: Number(s.SPCCSHW_BMI),
                SPCCSHW_BMIRemark: s.SPCCSHW_BMIRemark
            }))
        };

        console.log('📤 [BMI FORM] Sending payload to saveBMIRecord:', dataToSave);

        try {
            const result = await save.mutateAsync(dataToSave as any);
            console.log('✅ [BMI FORM] Save result:', result);

            if (result.success || result.returnVal === 'saved' || result.returnVal === 'update' || result.message?.includes('Successfully')) {
                toast.success(result.message || 'Record saved successfully');
                onSuccess?.();
            } else {
                toast.error(result.message || 'Failed to save record');
            }
        } catch (error) {
            console.error('❌ [BMI FORM] Mutation failed:', error);
            toast.error('An error occurred during save');
        }
    };

    const onInvalid = (errors: any) => {
        console.error('❌ [BMI FORM] Validation failed:', errors);
        toast.error('Please fix the errors in the form');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                {/* Academic Year */}
                <div className='flex flex-col gap-2'>
                    <Label>Academic Year</Label>
                    <Controller
                        name='ASMAY_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {((loadGridData as any)?.academicYear || (loadGridData as any)?.data?.academicYear || []).map((y: any) => (
                                        <SelectItem key={y.ASMAY_Id || y.asmaY_Id} value={(y.ASMAY_Id || y.asmaY_Id).toString()}>
                                            {y.ASMAY_Year || y.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.ASMAY_Id && <span className='text-xs text-destructive'>{errors.ASMAY_Id.message}</span>}
                </div>

                {/* Class */}
                <div className='flex flex-col gap-2'>
                    <Label>Class Name</Label>
                    <Controller
                        name='ASMCL_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Class' />
                                </SelectTrigger>
                                <SelectContent>
                                    {(classes.data?.data?.classlist || classes.data?.classlist || []).map((c: any) => (
                                        <SelectItem key={c.ASMCL_Id || c.asmcL_Id} value={(c.ASMCL_Id || c.asmcL_Id).toString()}>
                                            {c.ASMCL_ClassName || c.asmcL_ClassName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.ASMCL_Id && <span className='text-xs text-destructive'>{errors.ASMCL_Id.message}</span>}
                </div>

                {/* Section */}
                <div className='flex flex-col gap-2'>
                    <Label>Section Name</Label>
                    <Controller
                        name='ASMS_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Section' />
                                </SelectTrigger>
                                <SelectContent>
                                    {(sections.data?.data || sections.data?.sectionList || []).map((s: any) => (
                                        <SelectItem key={s.ASMS_Id || s.asmS_Id} value={(s.ASMS_Id || s.asmS_Id).toString()}>
                                            {s.ASMC_SectionName || s.asmC_SectionName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.ASMS_Id && <span className='text-xs text-destructive'>{errors.ASMS_Id.message}</span>}
                </div>

                {/* Date */}
                <div className='flex flex-col gap-2'>
                    <Label>Date</Label>
                    <Controller
                        name='SPCCSHW_AsOnDate'
                        control={control}
                        render={({ field }) => (
                            <DatePicker date={field.value as Date} setDate={field.onChange} />
                        )}
                    />
                    {errors.SPCCSHW_AsOnDate && <span className='text-xs text-destructive'>{errors.SPCCSHW_AsOnDate.message as string}</span>}
                </div>
            </div>

            <div className='flex justify-center'>
                <Button type='button' onClick={handleGetStudents} disabled={students.isPending}>
                    {students.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className='mr-2 h-4 w-4' />}
                    Student Details
                </Button>
            </div>

            {showStudentTable && fields.length > 0 && (
                <div className='mt-8 overflow-x-auto rounded-md border'>
                    <table className='w-full text-sm'>
                        <thead className='bg-muted/50'>
                            <tr className='border-b'>
                                <th className='p-2 w-10 text-center'>
                                    <Checkbox onCheckedChange={(checked) => fields.forEach((_, i) => update(i, { ...fields[i], selected: !!checked }))} />
                                </th>
                                <th className='p-2 text-center w-12'>SL.No</th>
                                <th className='p-2 text-left'>Student Name</th>
                                <th className='p-2 text-left'>Adm No.</th>
                                <th className='p-2 text-left w-24'>Weight(kg)</th>
                                <th className='p-2 text-left w-24'>Height(cm)</th>
                                <th className='p-2 text-left w-20'>BMI</th>
                                <th className='p-2 text-left w-24'>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id} className='border-b hover:bg-muted/20'>
                                    <td className='p-2 text-center'>
                                        <Controller
                                            name={`student.${index}.selected`}
                                            control={control}
                                            render={({ field: checkField }) => (
                                                <Checkbox checked={!!checkField.value} onCheckedChange={checkField.onChange} />
                                            )}
                                        />
                                    </td>
                                    <td className='p-2 text-center'>{index + 1}</td>
                                    <td className='p-2'>{field.studentName}</td>
                                    <td className='p-2'>{field.AMST_AdmNo}</td>
                                    <td className='p-2'>
                                        <Input
                                            type='number'
                                            step='0.1'
                                            className='h-8 w-20'
                                            value={field.SPCCSHW_Weight}
                                            onChange={(e) => handleWeightHeightChange(index, 'weight', e.target.value)}
                                        />
                                    </td>
                                    <td className='p-2'>
                                        <Input
                                            type='number'
                                            step='0.1'
                                            className='h-8 w-20'
                                            value={field.SPCCSHW_Height}
                                            onChange={(e) => handleWeightHeightChange(index, 'height', e.target.value)}
                                        />
                                    </td>
                                    <td className='p-2'>{field.SPCCSHW_BMI}</td>
                                    <td className='p-2'>
                                        {field.SPCCSHW_BMIRemark && (
                                            <Badge variant={
                                                field.SPCCSHW_BMIRemark === 'Normal' ? 'default' :
                                                    field.SPCCSHW_BMIRemark === 'Overweight' ? 'secondary' :
                                                        field.SPCCSHW_BMIRemark === 'Obese' ? 'destructive' : 'outline'
                                            }>
                                                {field.SPCCSHW_BMIRemark}
                                            </Badge>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showStudentTable && (
                <div className='flex justify-center gap-4'>
                    <Button type='submit' className='w-32' disabled={save.isPending}>
                        {save.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Save'}
                    </Button>
                    <Button type='button' variant='outline' className='w-32' onClick={() => { setShowStudentTable(false); reset(); }}>
                        Cancel
                    </Button>
                </div>
            )}
        </form>
    );
}
