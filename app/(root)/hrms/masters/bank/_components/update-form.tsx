'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { useMasterBank } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterBank } from '@/server/hrms/hrmsConfig/master/bank';
import type { IMasterBankList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.bank.update>;

interface UpdateBankFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterBankList;
}

export default function UpdateBankForm({ onSuccess, className = '', selectedRow: row }: UpdateBankFormProps) {
    const { refetchAll } = useMasterBank();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.bank.update),
        mode: 'onChange'
    });
    useEffect(() => {
        if (row) {
            reset({
                hrmbD_Id: row.hrmbD_Id,
                hrmbD_BankName: row.hrmbD_BankName,
                hrmbD_BranchName: row.hrmbD_BranchName,
                hrmbD_BankAccountNo: row.hrmbD_BankAccountNo,
                hrmbD_IFSCCode: row.hrmbD_IFSCCode,
                hrmbD_BankAddress: row.hrmbD_BankAddress
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmbD_Id: data.hrmbD_Id,
                hrmbD_BankName: data.hrmbD_BankName?.trim() || '',
                hrmbD_BranchName: data.hrmbD_BranchName?.trim() || '',
                hrmbD_BankAccountNo: data.hrmbD_BankAccountNo,
                hrmbD_IFSCCode: data.hrmbD_IFSCCode,
                hrmbD_BankAddress: data.hrmbD_BankAddress?.trim() || '',
                hrmbD_ActiveFlag: true,
                retrunMsg: ''
            };
            const response = await addOrUpdateMasterBank(payload);

            if (response?.success) {
                toast.success(response?.message || 'Bank updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update bank');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update bank');
        }
    };

    const handleReset = () => {
        reset();
    };
    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <input type='hidden' {...register('hrmbD_Id', { valueAsNumber: true })} />
                        <InputText
                            label='Bank Name'
                            required
                            id='hrmbD_BankName'
                            placeholder='Enter bank name'
                            maxLength={50}
                            defaultValue={row.hrmbD_BankName}
                            {...register('hrmbD_BankName')}
                            error={errors.hrmbD_BankName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='Branch Name'
                            required
                            id='hrmbD_BranchName'
                            placeholder='Enter branch name'
                            maxLength={50}
                            defaultValue={row.hrmbD_BranchName}
                            {...register('hrmbD_BranchName')}
                            error={errors.hrmbD_BranchName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='Account Number'
                            required
                            id='hrmbD_BankAccountNo'
                            placeholder='Enter account number'
                            maxLength={18}
                            defaultValue={row.hrmbD_BankAccountNo}
                            {...register('hrmbD_BankAccountNo')}
                            error={errors.hrmbD_BankAccountNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputText
                            label='IFSC Code'
                            required
                            id='hrmbD_IFSCCode'
                            placeholder='Enter IFSC code (e.g., ABCD0123456)'
                            maxLength={11}
                            defaultValue={row.hrmbD_IFSCCode}
                            {...register('hrmbD_IFSCCode')}
                            error={errors.hrmbD_IFSCCode?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <div className='col-span-full'>
                            <InputTextarea
                                label='Bank Address'
                                id='hrmbD_BankAddress'
                                placeholder='Enter bank address'
                                maxLength={250}
                                defaultValue={row.hrmbD_BankAddress}
                                {...register('hrmbD_BankAddress')}
                                error={errors.hrmbD_BankAddress?.message}
                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                minHeight={20}
                            />
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
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
                        disabled={isSubmitting || !isDirty}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Bank
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
