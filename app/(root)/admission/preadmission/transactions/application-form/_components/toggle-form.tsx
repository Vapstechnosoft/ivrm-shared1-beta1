'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useActivePreadmissionDetails, useStudentApplicationList } from '@/hooks/admission/preadmission/useTransactions';
import { studentApplicationFormSchema } from '@/schemas/admission/preadmission/transactions';
import { toggleStudentApplication } from '@/server/admission/preadmission/transactions/application_form';
import type { IPreadmissionStudentApplicationList } from '@/types/admission/preadmission/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Power, PowerOff } from 'lucide-react';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof studentApplicationFormSchema.delete>;

export default function ToggleStudentApplicationForm({ cell }: { cell: any }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isActive, setIsActive] = useState(Number(cell.getValue().pasR_ActiveFlag) === 0);
    const [selectedRow, setSelectedRow] = useState<IPreadmissionStudentApplicationList>();
    const { data: activePreadmission } = useActivePreadmissionDetails();
    const { refetchAll } = useStudentApplicationList(activePreadmission?.data?.asmaY_Id ?? 0);

    const handleToggle = () => {
        setSelectedRow(cell.getValue());
        setIsDialogOpen(true);
    };

    function closeDialog() {
        setIsDialogOpen(false);
        reset();
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(studentApplicationFormSchema.delete),
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { pasr_id } = data;
            const newStatus = !isActive;

            const response = await toggleStudentApplication(Number(pasr_id));

            if (response.success) {
                toast.success(response.message);
                setIsActive(newStatus);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='flex items-center gap-2 rounded-md px-2 py-1 transition-all duration-200 hover:bg-gray-50'>
                        <div className='flex cursor-default items-center gap-1'>
                            {isActive ? <Power className='h-3 w-3 text-green-600' /> : <PowerOff className='h-3 w-3 text-red-500' />}
                            <span className={`font-medium text-xs ${isActive ? 'text-green-700' : 'text-red-600'}`}>
                                {isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <Switch
                            checked={isActive}
                            onCheckedChange={handleToggle}
                            className='data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400'
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isActive ? 'Deactivate' : 'Activate'}</p>
                </TooltipContent>
            </Tooltip>

            {selectedRow && (
                <AdaptiveDialog title='Active/Inactive Brand' isOpen={isDialogOpen} onClose={closeDialog}>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                        <AdaptiveBody className='flex flex-col gap-5'>
                            <input type='text' hidden={true} {...register('pasr_id')} defaultValue={selectedRow.pasr_id} />
                            <p>
                                Are you sure you want to {isActive ? 'inactivate' : 'activate'} {selectedRow.student_name}?
                            </p>

                            <FormError>{errors.pasr_id?.message}</FormError>
                            <FormError>{errors.root?.message}</FormError>
                        </AdaptiveBody>
                        <AdaptiveFooter>
                            <Button variant='secondary' onClick={closeDialog}>
                                Cancel
                            </Button>
                            <Button type='submit' isLoading={isSubmitting}>
                                {isActive ? 'Inactivate' : 'Activate'}
                            </Button>
                        </AdaptiveFooter>
                    </form>
                </AdaptiveDialog>
            )}
        </>
    );
}
