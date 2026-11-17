'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { eventSponsorSchema } from '@/schemas/sports/transactions/events-sponsor';
import { useEventsSponsor } from '@/hooks/sports/useEventsSponsor';
import type { IEventSponsorMapping } from '@/types/sports/transactions/events-sponsor';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface AddEventSponsorMappingFormProps {
    onSuccess: () => void;
}

export default function AddEventSponsorMappingForm({ onSuccess }: AddEventSponsorMappingFormProps) {
    const { details, saveMutation } = useEventsSponsor();

    if (details.isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <GenericForm<IEventSponsorMapping, (typeof eventSponsorSchema)['addOrUpdate']>
            schema={eventSponsorSchema.addOrUpdate}
            initialValues={{ spccesP_Id: 0, mI_Id: 1, spccE_Id: 0, spccmsP_Id: 0, spccesP_ActiveFlag: true } as any}
            onSubmit={async (values) => {
                await saveMutation.mutateAsync(values);
            }}
            successMessage='Mapping saved successfully'
            errorMessage='Failed to save mapping'
            onSuccess={onSuccess}
            className='space-y-6'>
            <FormFields details={details.data?.data} />
        </GenericForm>
    );
}

function FormFields({ details }: { details: any }) {
    const { watch, setValue } = useFormContext();

    const allPrograms = details?.events || [];
    // Deduplicate by Event ID + Program Name to ensure all unique choices are available.
    const programs = Array.from(new Map(allPrograms.map((item: any) => [
        `${item.spccE_Id}::${item.spccpM_Name}`,
        item
    ])).values()) as any[];

    const sponsors = details?.sponsorList || [];

    return (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='flex flex-col gap-2'>
                <Label className="after:ml-0.5 after:text-red-500 after:content-['*'] text-sm font-semibold">
                    Program Name
                </Label>
                <Controller
                    name='spccE_Id'
                    render={({ field, fieldState: { error } }) => (
                        <div className="flex flex-col gap-1">
                            <Select
                                onValueChange={(val) => {
                                    const [id, name] = val.split('::');
                                    field.onChange(Number.parseInt(id));
                                    setValue('spccpM_Name', name);
                                }}
                                value={field.value && watch('spccpM_Name') ? `${field.value}::${watch('spccpM_Name')}` : undefined}>
                                <SelectTrigger className={error ? 'border-destructive ring-destructive/20' : 'hover:border-primary/50 transition-colors'}>
                                    <SelectValue placeholder='Select Program' />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((prog, idx) => (
                                        <SelectItem key={`${prog.spccE_Id}-${prog.spccpM_Id}-${idx}`} value={`${prog.spccE_Id}::${prog.spccpM_Name}`}>
                                            {prog.spccpM_Name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {error && <span className='text-xs text-destructive font-medium'>{error.message}</span>}
                        </div>
                    )}
                />
            </div>

            <div className='flex flex-col gap-2'>
                <Label className="after:ml-0.5 after:text-red-500 after:content-['*'] text-sm font-semibold">
                    Sponsor Name
                </Label>
                <Controller
                    name='spccmsP_Id'
                    render={({ field, fieldState: { error } }) => (
                        <div className="flex flex-col gap-1">
                            <Select
                                onValueChange={(val) => field.onChange(Number.parseInt(val))}
                                value={field.value?.toString()}>
                                <SelectTrigger className={error ? 'border-destructive ring-destructive/20' : 'hover:border-primary/50 transition-colors'}>
                                    <SelectValue placeholder='Select Sponsor' />
                                </SelectTrigger>
                                <SelectContent>
                                    {sponsors.map((sponsor: any) => (
                                        <SelectItem key={sponsor.spccmsP_Id} value={sponsor.spccmsP_Id.toString()}>
                                            {sponsor.spccmsP_SponsorName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {error && <span className='text-xs text-destructive font-medium'>{error.message}</span>}
                        </div>
                    )}
                />
            </div>
        </div>
    );
}
