'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
    useBankdropdowndatathirdpartytransaction,
    useFeeThirdParty,
    useGroupdropdowndatathirdpartytransaction,
    useHeaddropdowndatathirdpartytransaction,
    useStudentdowndatathirdpartytransaction,
    useacademicyerdropdowndatafee,
    useeditThirdpartytrasaction
} from '@/hooks/fees/useTrasactions';

import { cn } from '@/lib/utils';
import { thirdPartyTransactionSchema } from '@/schemas/fees/trasactions';
import { ThirdPartyTrasactionfeeReceiptNoflg, saveorUpdateThirdPartyTrasaction } from '@/server/fees/trasactions/thirdPartyTrasaction';
import type { IFeeThirdPartyTransaction } from '@/types/fees/transactions/transactions';
import type { z } from 'zod';

type FormFields = z.infer<typeof thirdPartyTransactionSchema.addOrUpdate>;

interface UpdateThirdPartyFormProps {
    onSuccess?: () => void;
    selectedRow: IFeeThirdPartyTransaction;
}

export default function UpdateThirdPartyForm({ onSuccess, selectedRow: row }: UpdateThirdPartyFormProps) {
    const { refetchAll } = useFeeThirdParty();

    const receiptnoflg = ThirdPartyTrasactionfeeReceiptNoflg();

    const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('B');
    const [loading, setLoading] = useState(false);
    const [receiptnoflgdata, setReceiptnoflgdata] = useState(false);
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(thirdPartyTransactionSchema.addOrUpdate),
        mode: 'onChange'
    });

    const watchPaymentMode = watch('paymentMode');

    const watchAcademicYearId = watch('academicYearId');
    const studentType = watch('studentType');

    const { data: academicYear } = useacademicyerdropdowndatafee();
    const { data: groupData } = useGroupdropdowndatathirdpartytransaction();
    const { data: headdata } = useHeaddropdowndatathirdpartytransaction();
    const { data: bankdata } = useBankdropdowndatathirdpartytransaction();

    const {
        data: studentdata,
        isLoading: studentDataLoading,
        refetch: fetchStudents
    } = useStudentdowndatathirdpartytransaction(Number(watchAcademicYearId || 0));

    const {
        data: editDataResponse,
        isFetching: isEditFetching,
        refetch: refetchEditData
    } = useeditThirdpartytrasaction(Number(row.mI_Id), Number(row.asmaY_Id), row?.fyP_Id ?? 0, {
        enabled: !!row?.fyP_Id
    });

    useEffect(() => {
        const fetchReceiptFlag = async () => {
            try {
                const res = await ThirdPartyTrasactionfeeReceiptNoflg();

                // assuming API response shape: { data: IThirdPartyReceiptFlag[] }
                if (res?.data?.length) {
                    //setReceiptnoflgdata(res.data);
                    setReceiptnoflgdata(true);
                } else {
                    setReceiptnoflgdata(false);
                }
            } catch (error) {
                console.error('Error fetching receipt flag', error);
            }
        };

        fetchReceiptFlag();
    }, []);

    useEffect(() => {
        if (!row?.fyP_Id) return;

        setLoading(true);

        refetchEditData()
            .then(() => {
                const editeddata = editDataResponse?.data?.[0];

                console.log('Edited Data:', editeddata);
                if (editeddata) {
                    const matchedBank = bankdata?.data?.find((b) => b.fmbanK_BankName === editeddata.fyP_Bank_Name);
                    reset({
                        studentType: editeddata.amsT_Id ? 'student' : 'other',
                        academicYearId: editeddata.asmaY_Id,
                        studentId: editeddata.amsT_Id || undefined,
                        studentName: editeddata.fyptP_Name || '',
                        groupId: editeddata.fmG_Id,
                        headId: editeddata.fmH_Id,
                        amount: editeddata.fyP_Tot_Amount,
                        towards: editeddata.fyP_Remarks,
                        fyP_Receipt_No: editeddata.fyP_Receipt_No,
                        date: editeddata.fyP_Date ? format(new Date(editeddata.fyP_Date), 'yyyy-MM-dd') : '',
                        chequeDate: editeddata.fyP_DD_Cheque_Date ? format(new Date(editeddata.fyP_DD_Cheque_Date), 'yyyy-MM-dd') : '',
                        chequeNo: editeddata.fyP_DD_Cheque_No || '',
                        paymentMode: editeddata.fyP_Bank_Or_Cash as 'B' | 'C' | 'R' | 'S',
                        //bankName: editeddata.fyP_Bank_Name,
                        bankId: matchedBank?.fmbanK_Id ?? undefined
                    });
                    // editeddata
                    // setSelectedPaymentMode(data.fyP_Bank_Or_Cash ?? "B");
                }
            })
            .finally(() => setLoading(false));
    }, [row, refetchEditData, reset, editDataResponse]);

    // Re-fetch students when academic year/studentType changes
    useEffect(() => {
        if (watchAcademicYearId && studentType === 'student') {
            fetchStudents();
            setValue('studentId', undefined);
        }
    }, [watchAcademicYearId, studentType]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const bankName = bankdata?.data?.find((x) => x.fmbanK_Id === data.bankId)?.fmbanK_BankName || '';

            const payload = {
                // mI_Id: 30,
                fyptP_Name: data.studentName,
                asmaY_Id: Number(data.academicYearId),
                fmG_Id: Number(data.groupId),
                fmH_Id: Number(data.headId),

                fyP_Bank_Name: bankName,
                fyP_Tot_Amount: Number(data.amount),

                fyP_DD_Cheque_Date: data.chequeDate ? format(new Date(data.chequeDate), 'yyyy-MM-dd') : null,

                fyP_DD_Cheque_No: data.chequeNo || '',
                fyP_Date: data.date ? format(new Date(data.date), 'yyyy-MM-dd') : null,
                //FYP_Receipt_No: row.fyP_Receipt_No,
                fyP_Remarks: data.towards,
                //user_id: 21602,
                FYP_Bank_Or_Cash: data.paymentMode,
                fyP_Id: row.fyP_Id
            };

            const payloaddata = JSON.stringify(payload);
            console.log('Payload to be sent:', payloaddata);

            const response = await saveorUpdateThirdPartyTrasaction(payload);

            if (response.success) {
                toast.success('Updated Successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return <div className='flex items-center justify-center p-8 font-medium text-lg'>Loading data...</div>;
    }

    const handleReset = () => {
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
            {/* Student Type */}
            <div className='flex items-center justify-center space-x-6 rounded-lg border bg-white px-4 py-2'>
                <Controller
                    control={control}
                    name='studentType'
                    render={({ field }) => (
                        <div className='flex flex-wrap gap-4'>
                            {[
                                { label: 'Existing Student', value: 'student' },
                                { label: 'Other', value: 'other' }
                            ].map((opt) => (
                                <label key={opt.value} className='flex items-center gap-2'>
                                    <input
                                        type='radio'
                                        value={opt.value}
                                        checked={field.value === opt.value}
                                        onChange={() => field.onChange(opt.value)}
                                    />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                />
            </div>

            {/* Academic Year */}
            <div className='flex items-center gap-4'>
                <Label className='min-w-[150px] text-right'>
                    Academic Year <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    name='academicYearId'
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                            <SelectTrigger className='min-w-[400px]'>
                                <SelectValue placeholder='Select Academic Year' />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYear?.data?.map((item) => (
                                    <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                        {item.asmaY_Year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Student */}
            {studentType === 'student' ? (
                <div className='flex items-center gap-4'>
                    <Label className='min-w-[150px] text-right'>Select Student</Label>
                    <Controller
                        name='studentName'
                        control={control}
                        render={({ field }) => (
                            <Select disabled={!watchAcademicYearId} value={field.value ?? ''} onValueChange={(v) => field.onChange(v)}>
                                <SelectTrigger className='min-w-[400px]'>
                                    <SelectValue placeholder={watchAcademicYearId ? 'Select Student' : 'Select Academic Year First'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {studentDataLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading students...
                                        </SelectItem>
                                    ) : studentdata ? (
                                        studentdata.data?.map((std) => (
                                            <SelectItem key={std.amsT_Id} value={String(std.amsT_FirstName)}>
                                                {std.amsT_FirstName}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value='none' disabled>
                                            No students found
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            ) : (
                <div className='flex items-center gap-4'>
                    <Label className='min-w-[150px] text-right'>
                        Student Name<span className='text-red-500'>*</span>
                    </Label>
                    <InputText {...register('studentName')} className='min-w-[400px]' />
                </div>
            )}

            {/* Group */}
            <div className='flex items-center gap-4'>
                <Label className='min-w-[150px] text-right'>
                    Group<span className='text-red-500'>*</span>
                </Label>
                <Controller
                    name='groupId'
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                            <SelectTrigger className='min-w-[400px]'>
                                <SelectValue placeholder='Select Group' />
                            </SelectTrigger>
                            <SelectContent>
                                {groupData?.data?.map((g) => (
                                    <SelectItem key={g.fmG_Id} value={String(g.fmG_Id)}>
                                        {g.fmG_GroupName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Head */}
            <div className='flex items-center gap-4'>
                <Label className='min-w-[150px] text-right'>
                    Head<span className='text-red-500'>*</span>
                </Label>
                <Controller
                    name='headId'
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                            <SelectTrigger className='min-w-[400px]'>
                                <SelectValue placeholder='Select Head' />
                            </SelectTrigger>
                            <SelectContent>
                                {headdata?.data?.map((h) => (
                                    <SelectItem key={h.fmH_Id} value={String(h.fmH_Id)}>
                                        {h.fmH_FeeName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Amount */}
            <div className='flex items-center gap-4'>
                <Label className='min-w-[150px] text-right'>
                    Amount<span className='text-red-500'>*</span>
                </Label>
                <Controller
                    name='amount'
                    control={control}
                    render={({ field }) => <InputNumber value={field.value ?? 0} onChange={(v) => field.onChange(Number(v))} />}
                />
            </div>

            {(watch('fyP_Receipt_No') || row.fyP_Receipt_No) && receiptnoflgdata && (
                <div className='flex items-center gap-4'>
                    <Label htmlFor='receiptNo' className='min-w-[150px] text-right'>
                        Receipt No <span className='text-red-500'>*</span>
                    </Label>
                    <InputText
                        id='receiptNo'
                        {...register('fyP_Receipt_No')}
                        placeholder='Enter Receipt No'
                        error={errors.fyP_Receipt_No?.message}
                        className='min-w-[400px]'
                    />
                </div>
            )}

            {/* Towards */}
            <div className='flex items-center gap-4'>
                <Label className='min-w-[150px] text-right'>Towards</Label>
                <InputText {...register('towards')} className='min-w-[400px]' />
            </div>

            <div className='flex items-center gap-4'>
                <Label className='min-w-[150px] text-right'>
                    Date <span className='text-red-500'>*</span>
                </Label>

                <Controller
                    name='date'
                    control={control}
                    defaultValue={format(new Date(), 'yyyy-MM-dd')}
                    render={({ field }) => {
                        const selectedDate = field.value ? new Date(field.value) : new Date();
                        return (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        className={cn('justify-start text-left font-normal', errors.date ? 'border-red-500' : '')}>
                                        <Calendar className='mr-2 h-4 w-4' />
                                        {format(selectedDate, 'dd/MM/yyyy')}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0'>
                                    <CalendarPicker
                                        mode='single'
                                        selected={selectedDate}
                                        onSelect={(d) => field.onChange(d ? format(d, 'yyyy-MM-dd') : '')}
                                    />
                                </PopoverContent>
                            </Popover>
                        );
                    }}
                />
            </div>

            {/* Payment Mode */}
            <div className='flex items-center justify-center space-x-6 rounded-lg border bg-white px-4 py-2'>
                <Controller
                    control={control}
                    name='paymentMode'
                    render={({ field }) => (
                        <div className='flex flex-wrap gap-4'>
                            {[
                                { label: 'Bank', value: 'B' },
                                { label: 'Cash', value: 'C' },
                                { label: 'RTGS/NEFT', value: 'R' },
                                { label: 'Card', value: 'S' }
                            ].map((option) => (
                                <label key={option.value} className='flex items-center gap-2'>
                                    <input
                                        type='radio'
                                        checked={field.value === option.value}
                                        onChange={() => field.onChange(option.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    )}
                />

                {/* <Controller
          control={control}
          name="paymentMode"
          render={({ field }) => (
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Bank", value: "B" },
                { label: "Cash", value: "C" },
                { label: "RTGS/NEFT", value: "R" },
                { label: "Card", value: "S" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={field.value === option.value}
                    onChange={() => {
                      field.onChange(option.value);
                      setSelectedPaymentMode(option.value);
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        /> */}
            </div>

            {/* Bank & Cheque */}
            {(watchPaymentMode === 'B' || watchPaymentMode === 'R') && (
                <>
                    <div className='flex items-center gap-4'>
                        <Label className='min-w-[150px] text-right'>
                            Bank Name<span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='bankId'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                                    <SelectTrigger className='min-w-[400px]'>
                                        <SelectValue placeholder='Select Bank' />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {bankdata?.data?.map((b) => (
                                            <SelectItem key={b.fmbanK_Id} value={String(b.fmbanK_Id)}>
                                                {b.fmbanK_BankName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className='flex items-center gap-4'>
                        <Label className='min-w-[150px] text-right'>
                            Cheque Date<span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='chequeDate'
                            control={control}
                            render={({ field }) => {
                                const d = field.value ? new Date(field.value) : new Date();
                                return (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button type='button' variant='outline'>
                                                <Calendar className='mr-2 h-4 w-4' />
                                                {format(d, 'dd/MM/yyyy')}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0'>
                                            <CalendarPicker
                                                mode='single'
                                                selected={d}
                                                onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                );
                            }}
                        />
                    </div>

                    <div className='flex items-center gap-4'>
                        <Label className='min-w-[150px] text-right'>
                            Cheque No<span className='text-red-500'>*</span>
                        </Label>
                        <InputText {...register('chequeNo')} error={errors.chequeNo?.message} />
                    </div>
                </>
            )}

            {watchPaymentMode === 'S' && (
                <>
                    <div className='flex items-center gap-4'>
                        <Label className='min-w-[150px] text-right'>
                            Transaction Date<span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='chequeDate'
                            control={control}
                            render={({ field }) => {
                                const d = field.value ? new Date(field.value) : new Date();
                                return (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button type='button' variant='outline'>
                                                <Calendar className='mr-2 h-4 w-4' />
                                                {format(d, 'dd/MM/yyyy')}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0'>
                                            <CalendarPicker
                                                mode='single'
                                                selected={d}
                                                onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                );
                            }}
                        />
                    </div>

                    {/* Card No */}
                    <div className='flex items-center gap-4'>
                        <Label className='min-w-[150px] text-right'>
                            Card No <span className='text-red-500'>*</span>
                        </Label>
                        {/* <InputText {...register('chequeNo')} placeholder='Enter Card Number' error={errors.chequeNo?.message} /> */}
                        <InputText
                            {...register('chequeNo', {
                                onChange: (e) => {
                                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                                    e.target.value = onlyNumbers; // force update input
                                }
                            })}
                            placeholder='Enter Card Number'
                            error={errors.chequeNo?.message}
                        />
                    </div>
                </>
            )}

            {/* Submit Button */}
            {/* <div className='flex gap-3 border-t pt-4'>
                <Button type='submit' disabled={isSubmitting}>
                    <Save className='mr-2 h-4 w-4' /> Update Third Party Transaction
                </Button>
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
                        <Save className='mr-2 h-4 w-4' />
                        Update Third Party Transaction
                    </div>
                </Button>
            </div>
        </form>
    );
}
