'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventMappingSchema, IEventMappingDTO, ISponsor } from '@/types/sports/transactions/events-mapping';
import { useEventMapping } from '@/hooks/sports/useEventMapping';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UpdateEventsMappingFormProps {
    onSuccess?: () => void;
    data: any;
}

export default function UpdateEventsMappingForm({ onSuccess, data: selectedRow }: UpdateEventsMappingFormProps) {
    const { edit } = useEventMapping();
    const [fetchedData, setFetchedData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEditData = async () => {
            setIsLoading(true);
            try {
                const result = await edit.mutateAsync({
                    ASMAY_Id: selectedRow.asmaY_Id,
                    SPCCE_Id: selectedRow.spccE_Id
                });

                if (result.success && result.data && result.data.length > 0) {
                    const editDetails = result.data[0];
                    // Map sponsors from the list. 
                    // Note: API response in user request shows spccmsP_Id but not the name.
                    // The name is not strictly required for the checkbox state if we just match IDs, 
                    // but we'll try to match it with the loaded sponsorList if possible, or leave it blank.
                    const sponsors = result.data
                        .filter((d: any) => d.spccmsP_Id && d.spccmsP_Id > 0)
                        .map((d: any) => ({
                            spccmsP_Id: d.spccmsP_Id,
                            spccmsP_SponsorName: '', // Name not in edit response, will be matched by ID in UI
                            selected: true
                        }));

                    setFetchedData({
                        ASMAY_Id: editDetails.asmaY_Id,
                        SPCCME_Id: editDetails.spccmE_Id,
                        SPCCMEV_Id: editDetails.spccmeV_Id,
                        SPCCE_Id: editDetails.spccE_id, // Note: response has spccE_id (lowercase d)
                        SPCCE_StartDate: new Date(editDetails.spccE_StartDate),
                        SPCCE_EndDate: new Date(editDetails.spccE_EndDate),
                        // Ensure time is in HH:mm format for input type="time"
                        SPCCE_StartTime: editDetails.spccE_StartTime?.substring(0, 5),
                        SPCCE_EndTime: editDetails.spccE_EndTime?.substring(0, 5),
                        SPCCE_Remarks: editDetails.spccE_Remarks,
                        SPCCE_SponsorFlag: editDetails.spccE_SponsorFlag,
                        sponsorData: sponsors
                    });
                } else {
                    toast.error('No data found for editing.');
                }
            } catch (error) {
                console.error('Failed to fetch edit data', error);
                toast.error('Failed to load edit data');
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedRow && (selectedRow.spccE_Id || selectedRow.SPCCE_Id) && (selectedRow.asmaY_Id || selectedRow.ASMAY_Id)) {
            fetchEditData();
        } else {
            setIsLoading(false);
            toast.error('Invalid row data for editing.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRow.asmaY_Id, selectedRow.ASMAY_Id, selectedRow.spccE_Id, selectedRow.SPCCE_Id]);


    if (isLoading) {
        return <div className="flex h-40 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!fetchedData) {
        return <div className="text-center text-destructive">Failed to load data or no data found.</div>;
    }

    return (
        <AddEventsMappingFormWithValues initialValues={fetchedData} onSuccess={onSuccess} />
    );
}

function AddEventsMappingFormWithValues({ initialValues, onSuccess }: { initialValues: any, onSuccess?: () => void }) {
    const { loadGrid, save } = useEventMapping();
    const { academicYear, eventsList, venuelist, sponsorList } = (loadGrid.data as any)?.data || {
        academicYear: [], eventsList: [], venuelist: [], sponsorList: []
    };

    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<IEventMappingDTO>({
        resolver: zodResolver(eventMappingSchema),
        defaultValues: initialValues
    });

    const sponsorFlag = watch('SPCCE_SponsorFlag');

    const onSubmit = async (values: IEventMappingDTO) => {
        const payload = {
            ...values,
            SPCCE_Id: values.SPCCE_Id ? Number(values.SPCCE_Id) : 0,
            ASMAY_Id: Number(values.ASMAY_Id),
            SPCCME_Id: Number(values.SPCCME_Id),
            SPCCMEV_Id: Number(values.SPCCMEV_Id),
            SPCCE_SponsorFlag: values.SPCCE_SponsorFlag || false,
            sponsorData: values.sponsorData?.map(s => ({
                spccmsP_Id: s.spccmsP_Id,
                selected: true,
                spccmsP_ActiveFlag: true
            })) || []
        };

        const result = await save.mutateAsync(payload);
        if (result.success || result.message === 'Record Saved Successfully') {
            toast.success('Record Updated Successfully');
            onSuccess?.();
        } else {
            toast.error(result.message || 'Failed to update record');
        }
    };

    const handleSponsorChange = (sponsor: ISponsor, isChecked: boolean) => {
        const currentSponsors = watch('sponsorData') || [];
        if (isChecked) {
            if (!currentSponsors.some(s => s.spccmsP_Id === sponsor.spccmsP_Id)) {
                setValue('sponsorData', [...currentSponsors, { spccmsP_Id: sponsor.spccmsP_Id, spccmsP_SponsorName: sponsor.spccmsP_SponsorName, selected: true }]);
            }
        } else {
            setValue('sponsorData', currentSponsors.filter(s => s.spccmsP_Id !== sponsor.spccmsP_Id));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {/* Academic Year */}
                <div className='flex flex-col gap-2'>
                    <Label>Academic Year</Label>
                    <Controller
                        name='ASMAY_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number.parseInt(val))} value={field.value?.toString()}>
                                <SelectTrigger className={errors.ASMAY_Id ? 'border-destructive' : ''}>
                                    <SelectValue placeholder='Select Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYear.map((y: any) => (
                                        <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                            {y.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.ASMAY_Id && <span className='text-xs text-destructive'>{errors.ASMAY_Id.message}</span>}
                </div>

                {/* Event */}
                <div className='flex flex-col gap-2'>
                    <Label>Event</Label>
                    <Controller
                        name='SPCCME_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number.parseInt(val))} value={field.value?.toString()}>
                                <SelectTrigger className={errors.SPCCME_Id ? 'border-destructive' : ''}>
                                    <SelectValue placeholder='Select Event' />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventsList.map((e: any) => (
                                        <SelectItem key={e.spccmE_Id} value={e.spccmE_Id.toString()}>
                                            {e.spccmE_EventName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.SPCCME_Id && <span className='text-xs text-destructive'>{errors.SPCCME_Id.message}</span>}
                </div>

                {/* Venue */}
                <div className='flex flex-col gap-2'>
                    <Label>Venue</Label>
                    <Controller
                        name='SPCCMEV_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number.parseInt(val))} value={field.value?.toString()}>
                                <SelectTrigger className={errors.SPCCMEV_Id ? 'border-destructive' : ''}>
                                    <SelectValue placeholder='Select Venue' />
                                </SelectTrigger>
                                <SelectContent>
                                    {venuelist.map((v: any) => (
                                        <SelectItem key={v.spccmeV_Id} value={v.spccmeV_Id.toString()}>
                                            {v.spccmeV_EventVenue}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.SPCCMEV_Id && <span className='text-xs text-destructive'>{errors.SPCCMEV_Id.message}</span>}
                </div>

                {/* Start Date */}
                <div className='flex flex-col gap-2'>
                    <Label>Start Date</Label>
                    <Controller
                        name='SPCCE_StartDate'
                        control={control}
                        render={({ field }) => (
                            <DatePicker date={field.value as Date} setDate={field.onChange} />
                        )}
                    />
                    {errors.SPCCE_StartDate && <span className='text-xs text-destructive'>{errors.SPCCE_StartDate.message as string}</span>}
                </div>

                {/* Start Time */}
                <div className='flex flex-col gap-2'>
                    <Label>Start Time</Label>
                    <Input type='time' {...control.register('SPCCE_StartTime')} />
                    {errors.SPCCE_StartTime && <span className='text-xs text-destructive'>{errors.SPCCE_StartTime.message}</span>}
                </div>

                {/* End Date */}
                <div className='flex flex-col gap-2'>
                    <Label>End Date</Label>
                    <Controller
                        name='SPCCE_EndDate'
                        control={control}
                        render={({ field }) => (
                            <DatePicker date={field.value as Date} setDate={field.onChange} />
                        )}
                    />
                    {errors.SPCCE_EndDate && <span className='text-xs text-destructive'>{errors.SPCCE_EndDate.message as string}</span>}
                </div>

                {/* End Time */}
                <div className='flex flex-col gap-2'>
                    <Label>End Time</Label>
                    <Input type='time' {...control.register('SPCCE_EndTime')} />
                    {errors.SPCCE_EndTime && <span className='text-xs text-destructive'>{errors.SPCCE_EndTime.message}</span>}
                </div>
            </div>

            {/* Remarks */}
            <div className='flex flex-col gap-2'>
                <Label>Remarks</Label>
                <Textarea {...control.register('SPCCE_Remarks')} />
            </div>

            {/* Sponsor Checkbox */}
            <div className='flex items-center space-x-2'>
                <Controller
                    name='SPCCE_SponsorFlag'
                    control={control}
                    render={({ field }) => (
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    )}
                />
                <Label>Sponsor Required?</Label>
            </div>

            {/* Sponsor List */}
            {sponsorFlag && (
                <div className='border rounded-md p-4'>
                    <Label className='mb-2 block'>Select Sponsors</Label>
                    <ScrollArea className='h-48'>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {sponsorList.map((sponsor: ISponsor) => (
                                <div key={sponsor.spccmsP_Id} className='flex items-center space-x-2'>
                                    <Checkbox
                                        checked={(watch('sponsorData') || []).some(s => s.spccmsP_Id === sponsor.spccmsP_Id)}
                                        onCheckedChange={(checked) => handleSponsorChange(sponsor, !!checked)}
                                    />
                                    <Label className='font-normal cursor-pointer' onClick={() => handleSponsorChange(sponsor, !(watch('sponsorData') || []).some(s => s.spccmsP_Id === sponsor.spccmsP_Id))}>
                                        {sponsor.spccmsP_SponsorName}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}

            <div className='flex justify-center gap-4'>
                <Button type='submit' className='w-32' disabled={save.isPending}>
                    {save.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Update'}
                </Button>
                <Button type='button' variant='outline' className='w-32' onClick={() => { onSuccess?.(); }}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
