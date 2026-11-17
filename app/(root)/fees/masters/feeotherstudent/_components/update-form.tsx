'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputText } from '@/components/ui/extension/input-text';
import { useFeeOtherStudent } from '@/hooks/fees/useMasters';
import { masterFeeOtherStudentSchema } from '@/schemas/fees/masters';
import { saveFeeOtherStudent } from '@/server/fees/masters/fee_other_student';
import type { MasterFeeOtherStudentType } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface UpdateFeeOtherStudentFromProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: MasterFeeOtherStudentType;
    onClose?: () => void;
}

// interface FormData {
//     studentName: string;
//     mobileno: string;
//     emailno: string;
// }
type FormFields = z.infer<typeof masterFeeOtherStudentSchema.addOrUpdate>;
export default function UpdtaeFeeOtherStudentFrom({ onSuccess, className = '', selectedRow, onClose }: UpdateFeeOtherStudentFromProps) {
    const { refetchAll } = useFeeOtherStudent();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting, isValid }
    } = useForm<FormFields>({
        resolver: zodResolver(masterFeeOtherStudentSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            studentName: '',
            mobileno: '',
            emailno: ''
        }
    });
    const studentName = watch('studentName');
    const studentMobileNo = watch('mobileno');
    const studentEmailNo = watch('emailno');

    useEffect(() => {
        if (!selectedRow) return;
        reset({
            studentName: selectedRow.fmosT_StudentName,
            mobileno: selectedRow.fmosT_StudentMobileNo.toString(),
            emailno: selectedRow.fmosT_StudentEmailId
        });
    }, [selectedRow]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        const buildpayload = () => {
            return {
                // mI_Id: 30,
                fmosT_Id: selectedRow.fmosT_Id,
                fmosT_StudentName: studentName,
                fmosT_StudentMobileNo: studentMobileNo,
                fmosT_StudentEmailId: studentEmailNo
            };
        };
        const payload = buildpayload();
        try {
            const res = await saveFeeOtherStudent(payload);
            if (res?.success) {
                toast.success(res.message || 'Updated successfully');
                refetchAll();
                handleReset();
                onSuccess?.();
                onClose?.();
            } else {
                toast.error(res?.message || 'Update failed');
            }
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error(err?.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className} w-full`}>
            <Card className='mx-auto w-full max-w-4xl border-gray-300 shadow-md'>
                <CardContent className='p-6'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        <InputText
                            label='Name'
                            required
                            id='studentName'
                            placeholder='Enter Student Name'
                            {...register('studentName', {})}
                            error={errors.studentName?.message}
                        />

                        <InputText
                            label='Mobile No'
                            required
                            id='mobileno'
                            placeholder='Enter Student Mobile Number'
                            type='tel'
                            {...register('mobileno', {
                                required: 'Mobile number is required',
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: 'Enter a valid 10-digit mobile number'
                                }
                            })}
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                const input = e.currentTarget;
                                // Remove non-digit characters
                                input.value = input.value.replace(/\D/g, '');
                                // Limit to 10 digits
                                if (input.value.length > 10) {
                                    input.value = input.value.slice(0, 10);
                                }
                            }}
                            error={errors.mobileno?.message}
                        />

                        <InputText
                            label='Email'
                            required
                            id='emailno'
                            type='email'
                            placeholder='Enter Student Email'
                            {...register('emailno', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Enter a valid email address'
                                }
                            })}
                            error={errors.emailno?.message}
                        />

                        {/* Buttons */}
                        <div className='flex justify-start gap-3 border-t pt-5'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleReset}
                                disabled={isSubmitting}
                                className='flex items-center gap-2'>
                                <RotateCcw className='h-4 w-4' />
                                Reset
                            </Button>

                            <Button type='submit' disabled={isSubmitting} className='flex items-center gap-2'>
                                <Save className='h-4 w-4' />
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
