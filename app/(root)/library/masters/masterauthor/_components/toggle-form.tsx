'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useLibraryMasterAuthor } from '@/hooks/library/useMasters';
import { masterAuthorSchema } from '@/schemas/library/masters';
import { toggleMasterAuthor } from '@/server/library/masters/master_author';
import type { IMasterAuthorList } from '@/types/library/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterAuthorSchema.delete>;

interface toggleMasterAuthorFormProps {
    rowData: IMasterAuthorList;
    onClose: () => void;
}

export default function ToggleMasterAuthorForm({ rowData, onClose }: toggleMasterAuthorFormProps) {
    const { refetchAll } = useLibraryMasterAuthor();
    const isActive = rowData.lmaU_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterAuthorSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            //console.log('Toggling Master Author with ID:', rowData.lmaU_Id);

            const response = await toggleMasterAuthor(Number(rowData.lmaU_Id));

            // console.log('Toggle Response:', response);

            if (response.success) {
                toast.success(response.message);
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
        <AdaptiveDialog title='Toggle Library Master' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('lmaU_Id')} defaultValue={rowData.lmaU_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.lmaU_AuthorFirstName}</strong>?
                    </p>
                    <FormError>{errors.lmaU_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
