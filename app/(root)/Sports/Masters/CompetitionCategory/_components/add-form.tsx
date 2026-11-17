'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveMasterCompetitionCategory } from '@/server/sports/masters/competition-category';
import { masterCompetitionCategorySchema } from '@/types/sports/masters/competition-category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface AddMasterCompetitionCategoryFormProps {
    onSuccess: () => void;
}

export default function AddMasterCompetitionCategoryForm({ onSuccess }: AddMasterCompetitionCategoryFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof masterCompetitionCategorySchema>>({
        resolver: zodResolver(masterCompetitionCategorySchema),
        defaultValues: {
            spccmcC_Id: 0,
            spccmcC_CompitionCategory: '',
            spccmcC_CCDesc: '',
            spccmcC_CCAgeFlag: false,
            spccmcC_CCWeightFlag: false,
            spccmcC_ActiveFlag: true,
            spccmcC_FromCCAgeYear: null,
            spccmcC_ToCCAgeYear: null,
            spccmcC_FromCCAgeMonth: null,
            spccmcC_ToCCAgeMonth: null,
            spccmcC_FromCCAgeDays: null,
            spccmcC_ToCCAgeDays: null,
            spccmcC_CCWeight: null
        }
    });

    const isAgeFlagChecked = form.watch('spccmcC_CCAgeFlag');
    const isWeightFlagChecked = form.watch('spccmcC_CCWeightFlag');

    const onSubmit = async (values: z.infer<typeof masterCompetitionCategorySchema>) => {
        try {
            // Debugging toast to confirm onSubmit is hit
            // toast.info('Submitting category...');

            // Send camelCase payload as requested
            const payload = {
                spccmcC_Id: 0,
                spccmcC_CompitionCategory: values.spccmcC_CompitionCategory,
                spccmcC_CCDesc: values.spccmcC_CCDesc,
                spccmcC_CCAgeFlag: values.spccmcC_CCAgeFlag,
                spccmcC_CCWeightFlag: values.spccmcC_CCWeightFlag,
                spccmcC_FromCCAgeYear: values.spccmcC_FromCCAgeYear,
                spccmcC_ToCCAgeYear: values.spccmcC_ToCCAgeYear,
                spccmcC_FromCCAgeMonth: values.spccmcC_FromCCAgeMonth,
                spccmcC_ToCCAgeMonth: values.spccmcC_ToCCAgeMonth,
                spccmcC_FromCCAgeDays: values.spccmcC_FromCCAgeDays,
                spccmcC_ToCCAgeDays: values.spccmcC_ToCCAgeDays,
                spccmcC_CCWeight: values.spccmcC_CCWeightFlag ? (values.spccmcC_CCWeight ?? 0) : 0,
                spccmcC_ActiveFlag: values.spccmcC_ActiveFlag
            };

            const result = await saveMasterCompetitionCategory(payload);
            if (result.success || result?.returnval === true || result?.returnVal === 'saved') {
                toast.success('Competition Category saved successfully');
                await queryClient.invalidateQueries({ queryKey: ['master-competition-categories'] });
                form.reset();
                onSuccess();
            } else if (result?.returnVal === 'duplicate') {
                toast.warning('Record already exists');
            } else {
                toast.error(result.message || 'Failed to save record');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    const onError = (errors: any) => {
        console.error('Form Validation Errors:', errors);
        const firstError = Object.values(errors)[0] as any;
        const message = firstError?.message || 'Please fix the validation errors before saving';
        toast.error(message);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className='space-y-4 pt-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Competition Category Name */}
                    <FormField
                        control={form.control}
                        name='spccmcC_CompitionCategory'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Competition Category</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter competition category' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name='spccmcC_CCDesc'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='Enter category description' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Age Flag */}
                    <FormField
                        control={form.control}
                        name='spccmcC_CCAgeFlag'
                        render={({ field }) => (
                            <FormItem className='flex flex-col rounded-md border p-4 shadow'>
                                <div className='flex flex-row items-start space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>Age Calculation Flag</FormLabel>
                                    </div>
                                </div>
                                <FormMessage className='mt-2' />
                            </FormItem>
                        )}
                    />

                    {/* Weight Flag */}
                    <FormField
                        control={form.control}
                        name='spccmcC_CCWeightFlag'
                        render={({ field }) => (
                            <FormItem className='flex flex-col rounded-md border p-4 shadow'>
                                <div className='flex flex-row items-start space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>Weight Calculation Flag</FormLabel>
                                    </div>
                                </div>
                                <FormMessage className='mt-2' />
                            </FormItem>
                        )}
                    />
                </div>

                {isAgeFlagChecked && (
                    <div className='rounded-lg border bg-muted/50 p-4 space-y-4'>
                        <h3 className='font-medium text-primary'>Age Configuration</h3>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <FormField
                                control={form.control}
                                name='spccmcC_FromCCAgeYear'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Year</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='0'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;
                                                    field.onChange(Number.isNaN(val) ? null : val);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='spccmcC_FromCCAgeMonth'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Month</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='0'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;
                                                    field.onChange(Number.isNaN(val) ? null : val);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='spccmcC_FromCCAgeDays'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Days</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='0'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;
                                                    field.onChange(Number.isNaN(val) ? null : val);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <FormField
                                control={form.control}
                                name='spccmcC_ToCCAgeYear'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To Year</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='0'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;
                                                    field.onChange(Number.isNaN(val) ? null : val);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='spccmcC_ToCCAgeMonth'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To Month</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='0'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;
                                                    field.onChange(Number.isNaN(val) ? null : val);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='spccmcC_ToCCAgeDays'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To Days</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='0'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;
                                                    field.onChange(Number.isNaN(val) ? null : val);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )}

                {isWeightFlagChecked && (
                    <div className='rounded-lg border bg-muted/50 p-4 space-y-4'>
                        <h3 className='font-medium text-primary'>Weight Configuration</h3>
                        <FormField
                            control={form.control}
                            name='spccmcC_CCWeight'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (In kg)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='0.00'
                                            step='0.01'
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const val = e.target.valueAsNumber;
                                                field.onChange(Number.isNaN(val) ? null : val);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <div className='flex justify-end gap-3 pt-4 border-t'>
                    <Button type='submit' className='min-w-[120px] shadow-md transition-all active:scale-95' disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Category'
                        )}
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => {
                        form.reset();
                        onSuccess();
                    }}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
