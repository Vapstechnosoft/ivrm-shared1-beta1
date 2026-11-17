'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useFeeRefundableList, useopeningacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { feesRefundableSchema } from '@/schemas/fees/trasactions';
import { deleteFeeRefundableDetails } from '@/server/fees/trasactions/fee_refundable';
import type { IFeeRefundableList } from '@/types/fees/transactions/transactions';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof feesRefundableSchema.delete>;

interface DeleteFeeRefundableFormProps {
    rowData: IFeeRefundableList;
    onClose: () => void;
}

export default function DeleteFeeRefundableForm({ rowData, onClose }: DeleteFeeRefundableFormProps) {
    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);

    const { data: academicYearData, isLoading: loadingYears } = useopeningacademicyerdropdowndatafee();

    useEffect(() => {
        if (!loadingYears && academicYearData?.data?.length && selectedAsmayId === null) {
            setSelectedAsmayId(Number(academicYearData.data[0].asmaY_Id));
        }
    }, [loadingYears, academicYearData, selectedAsmayId]);

    const { refetchAll } = useFeeRefundableList(selectedAsmayId ?? 0, {});

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feesRefundableSchema.delete),
        mode: 'onChange'
        // defaultValues: {
        //     fR_Id: rowData.fr_id.toString()
        // }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    console.log('rowData', rowData);
    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            console.log('rowData', rowData.fR_ID);
            const response = await deleteFeeRefundableDetails(Number(rowData.fR_ID));
            if (response?.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Delete Fee Refundable' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fR_ID')} defaultValue={rowData.fR_ID} />
                    <p>Are you sure you want to permanently delete The selected Data</p>
                    <FormError>{errors.fR_ID?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant='destructive'>
                        <Trash2 className='mr-2 h-4 w-4' />
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                        Delete
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
