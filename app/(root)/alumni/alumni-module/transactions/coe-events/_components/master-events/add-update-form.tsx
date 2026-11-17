'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { getPageDetails, saveMasterEventsData } from '@/server/alumni/master-coe';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type MasterEventsFormValues, masterEventsSchema } from './schema';

interface MasterEventsFormProps {
    onSuccess?: () => void;
    parameterlist: any[];
    editData?: any;
}

export default function MasterEventsForm({ onSuccess, parameterlist, editData }: MasterEventsFormProps) {
    const form = useForm<MasterEventsFormValues>({
        resolver: zodResolver(masterEventsSchema),
        defaultValues: {
            COEME_Id: 0,
            radiotype: 'Manual',
            COEME_EventName: '',
            COEME_EventDesc: '',
            COEME_SMSMessage: '',
            COEME_MailSubject: '',
            COEME_MailHeader: '',
            COEME_Mail_Message: '',
            COEME_MailFooter: '',
            COEME_ActiveFlag: true
        }
    });

    useEffect(() => {
        if (editData) {
            const fetchDetails = async () => {
                try {
                    const coemeId = editData.COEME_Id || (editData as any).coemE_Id;
                    const res = await getPageDetails(coemeId);

                    // The API might return data in 'data' array or 'master_event_list'
                    const list = (res as any).data || (res as any).master_event_list || [];

                    if (list && list.length > 0) {
                        const data = list[0];
                        form.reset({
                            COEME_Id: data.coemE_Id || data.COEME_Id,
                            radiotype:
                                (data.coemE_ManualDefault_Flag || data.COEME_ManualDefault_Flag) === 'Default' ? 'Default' : 'Manual',
                            COEME_EventName: data.coemE_EventName || data.COEME_EventName || '',
                            COEME_EventDesc: data.coemE_EventDesc || data.COEME_EventDesc || '',
                            COEME_SMSMessage: data.coemE_SMSMessage || data.COEME_SMSMessage || '',
                            COEME_MailSubject: data.coemE_MailSubject || data.COEME_MailSubject || '',
                            COEME_MailHeader: data.coemE_MailHeader || data.COEME_MailHeader || '',
                            COEME_Mail_Message: data.coemE_Mail_Message || data.COEME_Mail_Message || '',
                            COEME_MailFooter: data.coemE_MailFooter || data.COEME_MailFooter || '',
                            COEME_ActiveFlag: data.coemE_ActiveFlag ?? data.COEME_ActiveFlag ?? true
                        });
                    }
                } catch (error) {
                    toast.error('Failed to fetch event details');
                }
            };
            fetchDetails();
        }
    }, [editData, form]);

    const onSubmit = async (values: MasterEventsFormValues) => {
        try {
            const res = await saveMasterEventsData(values);
            if (res.success || res.returnval === true) {
                toast.success(res.message || (editData ? 'Event updated successfully' : 'Event saved successfully'));
                form.reset();
                onSuccess?.();
            } else {
                toast.error(res.message || 'Failed to save event');
            }
        } catch (error) {
            toast.error('An error occurred while saving');
        }
    };

    const insertParameter = (fieldName: 'COEME_SMSMessage' | 'COEME_Mail_Message', paramValue: string) => {
        const current = form.getValues(fieldName) || '';
        form.setValue(fieldName, current + ` ${paramValue} `);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='flex justify-center'>
                    <FormField
                        control={form.control}
                        name='radiotype'
                        render={({ field }) => (
                            <FormItem className='space-y-3'>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex space-x-4'>
                                        <FormItem className='flex items-center space-x-2 space-y-0'>
                                            <FormControl>
                                                <RadioGroupItem value='Manual' />
                                            </FormControl>
                                            <FormLabel className='font-normal'>Manual</FormLabel>
                                        </FormItem>
                                        <FormItem className='flex items-center space-x-2 space-y-0'>
                                            <FormControl>
                                                <RadioGroupItem value='Default' />
                                            </FormControl>
                                            <FormLabel className='font-normal'>Default</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='COEME_EventName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Event Name <span className='text-destructive'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value as string} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='COEME_EventDesc'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Event Description <span className='text-destructive'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value as string} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {form.watch('radiotype') === 'Manual' && (
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                            control={form.control}
                            name='COEME_SMSMessage'
                            render={({ field }) => (
                                <FormItem className='md:col-span-1'>
                                    <FormLabel>SMS Content</FormLabel>
                                    <FormControl>
                                        <Textarea rows={4} {...field} value={field.value as string} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-wrap gap-2 pt-8'>
                            {parameterlist?.map((p: any, idx: number) => (
                                <Button
                                    key={`sms-param-${p.ismP_ID || p.id || idx}`}
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => insertParameter('COEME_SMSMessage', p.ismP_NAME || p.name)}>
                                    {p.ismP_NAME || p.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='COEME_MailSubject'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email Subject <span className='text-destructive'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value as string} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='COEME_MailHeader'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email Header <span className='text-destructive'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value as string} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {form.watch('radiotype') === 'Manual' && (
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                            control={form.control}
                            name='COEME_Mail_Message'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Message</FormLabel>
                                    <FormControl>
                                        <Textarea rows={4} {...field} value={field.value as string} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-wrap gap-2 pt-8'>
                            {parameterlist?.map((p: any, idx: number) => (
                                <Button
                                    key={`email-param-${p.ismP_ID || p.id || idx}`}
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => insertParameter('COEME_Mail_Message', p.ismP_NAME || p.name)}>
                                    {p.ismP_NAME || p.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <FormField
                    control={form.control}
                    name='COEME_MailFooter'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email Footer <span className='text-destructive'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Input {...field} value={field.value as string} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex justify-end gap-3'>
                    <Button type='button' variant='outline' onClick={() => form.reset()}>
                        <RotateCcw className='mr-2 h-4 w-4' />
                        Clear
                    </Button>
                    <Button type='submit' disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <RotateCcw className='mr-2 h-4 w-4 animate-spin' /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className='mr-2 h-4 w-4' /> {editData ? 'Update' : 'Save'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
