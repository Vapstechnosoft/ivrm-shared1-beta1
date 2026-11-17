'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { useMasterBank } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterBank } from '@/server/hrms/hrmsConfig/master/bank';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.bank.add>;

interface AddBankFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddBankForm({ onSuccess, className = '' }: AddBankFormProps) {
    const { refetchAll } = useMasterBank();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.bank.add),
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmbD_Id: 0,
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
                toast.success(response?.message || 'Bank saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save bank');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save bank');
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
                        <InputText
                            label='Bank Name'
                            required
                            id='hrmbD_BankName'
                            placeholder='Enter bank name'
                            maxLength={50}
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
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Bank
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
