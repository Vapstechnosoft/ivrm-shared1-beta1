'use client';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import {
    useBankdropdowndatathirdpartytransaction,
    useFeeThirdParty,
    useGroupdropdowndatathirdpartytransaction,
    useHeaddropdowndatathirdpartytransaction,
    useStudentdowndatathirdpartytransaction,
    useacademicyerdropdowndatafee
} from '@/hooks/fees/useTrasactions';

import { cn } from '@/lib/utils';
import { thirdPartyTransactionSchema } from '@/schemas/fees/trasactions';
import {
    ThirdPartyTrasactionfeeReceiptNoflg,
    get_Receipt_number,
    saveorUpdateThirdPartyTrasaction
} from '@/server/fees/trasactions/thirdPartyTrasaction';

type FormFields = z.infer<typeof thirdPartyTransactionSchema.addOrUpdate>;

interface AddThirdPartyTransactionProps {
    onSuccess?: () => void;
    thirdparty?: string;
}

export default function AddThirdPartyTransactionForm({ onSuccess, thirdparty = '' }: AddThirdPartyTransactionProps) {
    const { refetchAll } = useFeeThirdParty();
    //const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('B');

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
        mode: 'onChange',
        //     defaultValues: {
        //   studentType: "other",
        //   paymentMode: "B",
        //},

        defaultValues: {
            studentType: 'other',
            academicYearId: undefined,
            studentId: undefined,
            studentName: '',
            groupId: undefined,
            headId: undefined,
            amount: undefined,
            towards: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            paymentMode: 'B',
            bankId: undefined,
            chequeDate: format(new Date(), 'yyyy-MM-dd'),
            chequeNo: ''
        }
    });

    const [receiptnumberdata, setReceiptnumberdata] = useState<any[] | null>(null);
    const [receiptDataLoading, setReceiptDataLoading] = useState(true);
    const [receiptnoflgdata, setReceiptnoflgdata] = useState(false);
    const studentType = watch('studentType');
    const watchAcademicYearId = watch('academicYearId');

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

    const { data: academicYear, isLoading: academicYearLoading } = useacademicyerdropdowndatafee();

    const { data: groupData, isLoading: groupDataLoading } = useGroupdropdowndatathirdpartytransaction();

    const { data: headdata, isLoading: headDataLoading } = useHeaddropdowndatathirdpartytransaction();

    const { data: bankdata } = useBankdropdowndatathirdpartytransaction();

    // async function fetchReceipt() {
    //     const receiptnumberdata = await get_Receipt_number();
    //     console.log('Receipt Number Data:', receiptnumberdata);
    // }

    useEffect(() => {
        const fetchReceipt = async () => {
            setReceiptDataLoading(true);

            const response = await get_Receipt_number(); // returns ApiResponse<INumberGeneration[]>
            setReceiptnumberdata(response?.data ?? []); // ✅ use the actual array
            setReceiptDataLoading(false);
        };

        fetchReceipt();
    }, []);

    const {
        data: studentdata,
        isLoading: studentDataLoading,
        error: studentDataError,
        refetch: fetchStudents
    } = useStudentdowndatathirdpartytransaction(Number(watchAcademicYearId || 0));

    console.log('studentdata', studentdata);

    useEffect(() => {
        if (watchAcademicYearId && studentType === 'student') {
            fetchStudents(); // API CALL
            setValue('studentName', undefined);
        }
    }, [watchAcademicYearId, studentType]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (studentType === 'student') {
            if (!data.studentName) {
                toast.error('Please select a student');
                return;
            }
        }
        if (studentType === 'other') {
            const name = data.studentName ?? '';

            if (name.trim() === '') {
                toast.error('Please enter a student name');
                return;
            }

            if (name.length < 1) {
                toast.error('Minimum 1 character required for Student Name');
                return;
            }

            if (name.length > 100) {
                toast.error('Maximum 100 characters allowed for Student Name');
                return;
            }

            if (!/^[A-Za-z\s]+$/.test(name)) {
                toast.error('Student Name must contain only letters');
                return;
            }

            if (name.trim() !== name) {
                toast.error('Student Name cannot have leading or trailing spaces');
                return;
            }
        }

        try {
            const bankName = bankdata?.data?.find((b) => b.fmbanK_Id === Number(data.bankId))?.fmbanK_BankName ?? '';

            const payload = {
                // mI_Id: 30,
                fyptP_Name: data.studentName,
                asmaY_Id: Number(data.academicYearId),
                fmG_Id: Number(data.groupId),
                fmH_Id: Number(data.headId),
                //fyP_Receipt_No: '',
                fyP_Receipt_No: data.fyP_Receipt_No,
                fyP_Bank_Name: bankName,

                //fyptP_Name: data.towards, // "Name" or "Testing", depends on your field

                fyP_Tot_Amount: Number(data.amount),

                fyP_DD_Cheque_Date: data.chequeDate ? format(new Date(data.chequeDate), 'yyyy-MM-dd') : null,

                fyP_DD_Cheque_No: data.chequeNo || '',
                fyP_Date: data.date ? format(new Date(data.date), 'yyyy-MM-dd') : null,

                fyP_Remarks: data.towards,
                //user_id: 21602,
                FYP_Bank_Or_Cash: data.paymentMode
            };

            console.log('FINAL PAYLOAD:', JSON.stringify(payload));

            const response = await saveorUpdateThirdPartyTrasaction(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
        setSelectedPaymentMode('');
    };

    return (
        <div className={`${thirdparty}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                <div className='flex items-center justify-center space-x-6 rounded-lg border border-gray-300 bg-white px-4 py-2'>
                    <Controller
                        control={control}
                        name='studentType'
                        render={({ field }) => {
                            const options = [
                                { label: 'Existing Student', value: 'student' },
                                { label: 'Other', value: 'other' }
                            ];

                            return (
                                <div className='flex flex-wrap gap-4'>
                                    {options.map((option) => (
                                        <label key={option.value} className='flex cursor-pointer items-center gap-2'>
                                            <input
                                                type='radio'
                                                value={option.value}
                                                checked={field.value === option.value}
                                                onChange={() => field.onChange(option.value)}
                                                className='accent-primary'
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            );
                        }}
                    />
                </div>

                <div className='flex items-center gap-4'>
                    <Label className='min-w-[150px] text-right'>
                        Academic Year <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='academicYearId'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                <SelectTrigger className='min-w-[400px]'>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYearLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : (
                                        academicYear?.data?.map((item) => (
                                            <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.academicYearId && <FormError>{errors.academicYearId.message}</FormError>}
                </div>

                {studentType && (
                    <div className='flex items-center gap-4'>
                        <Label className='min-w-[150px] text-right'>
                            {studentType === 'student' ? 'Select Student' : 'Student Name'}
                            <span className='text-red-500'>*</span>
                        </Label>

                        {studentType === 'student' ? (
                            <Controller
                                name='studentName'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        disabled={!watchAcademicYearId}
                                        // onValueChange={(value) => field.onChange(Number(value))}
                                        // value={field.value?.toString()}
                                        onValueChange={(value) => field.onChange(value)} // keep string
                                        value={field.value ?? ''}>
                                        <SelectTrigger className='min-w-[400px]'>
                                            <SelectValue
                                                placeholder={watchAcademicYearId ? 'Select Student' : 'Select Academic Year First'}
                                            />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {studentDataLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading students...
                                                </SelectItem>
                                            ) : studentdata ? (
                                                studentdata.data?.map((std, index) => (
                                                    <SelectItem
                                                        key={std.amsT_Id}
                                                        // key={`${std.amsT_Id ?? 'no-id'}-${index}`}
                                                        value={String(std.amsT_FirstName)}
                                                    >
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
                        ) : (
                            <InputText
                                id='studentName'
                                placeholder='Enter Student Name'
                                {...register('studentName')}
                                error={errors.studentName?.message}
                                className='min-w-[400px]'
                            />
                        )}
                    </div>
                )}

                <div className='flex items-center gap-4'>
                    <Label className='min-w-[150px] text-right'>
                        Group Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='groupId'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                <SelectTrigger className='min-w-[400px]'>
                                    <SelectValue placeholder='Select Group' />
                                </SelectTrigger>
                                <SelectContent>
                                    {groupDataLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : (
                                        groupData?.data?.map((g) => (
                                            <SelectItem key={g.fmG_Id} value={String(g.fmG_Id)}>
                                                {g.fmG_GroupName}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.groupId && <FormError>{errors.groupId.message}</FormError>}
                </div>

                <div className='flex items-center gap-4'>
                    <Label className='min-w-[150px] text-right'>
                        Head Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='headId'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                <SelectTrigger className='min-w-[400px]'>
                                    <SelectValue placeholder='Select Head' />
                                </SelectTrigger>
                                <SelectContent>
                                    {headDataLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : (
                                        headdata?.data?.map((h) => (
                                            <SelectItem key={h.fmH_Id} value={String(h.fmH_Id)}>
                                                {h.fmH_FeeName}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.headId && <FormError>{errors.headId.message}</FormError>}
                </div>
                {receiptnoflgdata === true && (
                    <div className='flex items-center gap-4'>
                        {!receiptDataLoading && (!receiptnumberdata || receiptnumberdata.length === 0) && (
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
                    </div>
                )}

                <div className='flex items-center gap-4'>
                    <Label htmlFor='amount' className='min-w-[150px] text-right'>
                        Amount <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='amount'
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                id='amount'
                                value={field.value ?? 0}
                                onChange={(value) => field.onChange(Number(value))}
                                error={errors.amount?.message}
                            />
                        )}
                    />
                    {errors.amount && <FormError>{errors.amount.message}</FormError>}
                </div>

                <div className='flex items-center gap-4'>
                    <Label className='min-w-[150px] text-right'>Towards</Label>
                    <InputText {...register('towards')} error={errors.towards?.message} className='min-w-[400px]' />
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

                <div className='flex items-center justify-center space-x-6 rounded-lg border border-gray-300 bg-white px-4 py-2'>
                    <Controller
                        control={control}
                        name='paymentMode'
                        render={({ field }) => {
                            const options = [
                                { label: 'Bank', value: 'B' },
                                { label: 'Cash', value: 'C' },
                                { label: 'RTGS/NEFT', value: 'R' },
                                { label: 'Card', value: 'S' }
                            ];

                            return (
                                <div className='flex flex-wrap gap-4'>
                                    {options.map((option) => (
                                        <label key={option.value} className='flex cursor-pointer items-center gap-2'>
                                            <input
                                                type='radio'
                                                value={option.value}
                                                checked={field.value === option.value}
                                                onChange={() => {
                                                    field.onChange(option.value);
                                                    setSelectedPaymentMode(option.value);
                                                }}
                                                className='accent-primary'
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            );
                        }}
                    />
                </div>

                {(selectedPaymentMode === 'B' || selectedPaymentMode === 'R') && (
                    <>
                        {/* Bank Name */}
                        <div className='flex items-center gap-4'>
                            <Label className='min-w-[150px] text-right'>Bank Name</Label>

                            <Controller
                                name='bankId'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
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

                        {/* Cheque Date */}
                        <div className='flex items-center gap-4'>
                            <Label className='min-w-[150px] text-right'>
                                Cheque Date <span className='text-red-500'>*</span>
                            </Label>

                            <Controller
                                name='chequeDate'
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
                                                    className={cn(
                                                        'justify-start text-left font-normal',
                                                        errors.chequeDate ? 'border-red-500' : ''
                                                    )}>
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

                        {/* Cheque No */}
                        <div className='flex items-center gap-4'>
                            <Label className='min-w-[150px] text-right'>
                                Cheque No <span className='text-red-500'>*</span>
                            </Label>
                            <InputText {...register('chequeNo')} error={errors.chequeNo?.message} />
                        </div>
                    </>
                )}

                {/* ---------------- CARD PAYMENT ---------------- */}
                {selectedPaymentMode === 'S' && (
                    <>
                        {/* Transaction Date */}
                        <div className='flex items-center gap-4'>
                            <Label className='min-w-[150px] text-right'>
                                Transaction Date <span className='text-red-500'>*</span>
                            </Label>

                            <Controller
                                name='chequeDate'
                                control={control}
                                defaultValue={format(new Date(), 'yyyy-MM-dd')}
                                render={({ field }) => {
                                    const selectedDate = field.value ? new Date(field.value) : new Date();
                                    return (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button type='button' variant='outline'>
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

                {/* ---------------- BUTTONS ---------------- */}
                <div className='flex gap-3 border-t pt-4'>
                    <Button variant='outline' onClick={handleReset} type='button'>
                        Reset
                    </Button>
                    <Button type='submit' disabled={isSubmitting}>
                        <Save className='mr-2 h-4 w-4' /> Save Third Party Transaction
                    </Button>
                </div>
            </form>
        </div>
    );
}
