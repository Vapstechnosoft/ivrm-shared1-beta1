'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveDialog } from '@/components/ui/extension/adaptive-dialog';
import { useCheckPreadmissionLive } from '@/hooks/admission/preadmission/useConfigurations';
import { cn } from '@/lib/utils';
import { ArrowUpRight, LockKeyhole, LockKeyholeOpen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import AddPreadmissionRegistrationForm from './_components/registration-form';

export default function PreadmissionRegistration() {
    const { sub_domain } = useParams();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data: preadmissionLive, refetch: refetchAll } = useCheckPreadmissionLive(sub_domain?.toString() || '');

    const handleEdit = () => {
        setIsDialogOpen(true);
    };

    function closeDialog() {
        setIsDialogOpen(false);
        refetchAll();
    }

    const isPreadmissionLive: boolean = !(preadmissionLive === undefined || preadmissionLive?.data === false);

    return (
        <>
            <Button
                type='button'
                variant='outline'
                className={cn('h-12 w-full border-2 border-gray-200', isPreadmissionLive && 'bg-success')}
                onClick={() => handleEdit()}
                toolTip={
                    isPreadmissionLive === false ? 'Preadmission Registration is not available yet.' : 'Preadmission Registration is live.'
                }
                disabled={isPreadmissionLive === false}>
                {isPreadmissionLive === false ? (
                    <LockKeyhole className='mr-2 h-4 w-4 text-gray-600 ' />
                ) : (
                    <LockKeyholeOpen className='mr-2 h-4 w-4 text-white ' />
                )}
                <span className={isPreadmissionLive === false ? 'flex-1 font-medium text-gray-600' : 'flex-1 text-white tracking-widest'}>
                    Preadmission Registration
                </span>
                {isPreadmissionLive === true && <ArrowUpRight className={'h-4 w-4 text-white'} />}
            </Button>
            <AdaptiveDialog title='Preadmission Registration' isOpen={isDialogOpen} onClose={closeDialog} size='lg'>
                <AddPreadmissionRegistrationForm sub_domain={sub_domain?.toString() || ''} closeDialog={closeDialog} />
            </AdaptiveDialog>
        </>
    );
}
