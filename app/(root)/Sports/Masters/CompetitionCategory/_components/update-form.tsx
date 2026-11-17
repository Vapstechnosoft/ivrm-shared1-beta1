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
import { masterCompetitionCategorySchema, type IMasterCompetitionCategory } from '@/types/sports/masters/competition-category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterCompetitionCategories, useMasterCompetitionCategoryDetails } from '@/hooks/sports/useMasterCompetitionCategory';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface UpdateMasterCompetitionCategoryFormProps {
    selectedRow: IMasterCompetitionCategory;
    onSuccess: () => void;
}

export default function UpdateMasterCompetitionCategoryForm({ selectedRow, onSuccess }: UpdateMasterCompetitionCategoryFormProps) {
    const queryClient = useQueryClient();
    const { data: editData, isLoading: isEditDataLoading } = useMasterCompetitionCategoryDetails(selectedRow.spccmcC_Id!);

    const form = useForm<z.infer<typeof masterCompetitionCategorySchema>>({
        resolver: zodResolver(masterCompetitionCategorySchema),
        defaultValues: {
            spccmcC_Id: selectedRow.spccmcC_Id,
            spccmcC_CompitionCategory: selectedRow.spccmcC_CompitionCategory,
            spccmcC_CCDesc: selectedRow.spccmcC_CCDesc,
            spccmcC_CCAgeFlag: selectedRow.spccmcC_CCAgeFlag,
            spccmcC_CCWeightFlag: selectedRow.spccmcC_CCWeightFlag,
            spccmcC_ActiveFlag: selectedRow.spccmcC_ActiveFlag,
            spccmcC_FromCCAgeYear: selectedRow.spccmcC_FromCCAgeYear,
            spccmcC_ToCCAgeYear: selectedRow.spccmcC_ToCCAgeYear,
            spccmcC_FromCCAgeMonth: selectedRow.spccmcC_FromCCAgeMonth,
            spccmcC_ToCCAgeMonth: selectedRow.spccmcC_ToCCAgeMonth,
            spccmcC_FromCCAgeDays: selectedRow.spccmcC_FromCCAgeDays,
            spccmcC_ToCCAgeDays: selectedRow.spccmcC_ToCCAgeDays,
            spccmcC_CCWeight: selectedRow.spccmcC_CCWeight
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (editData?.data && editData.success) {
            const dataToSet = Array.isArray(editData.data) ? editData.data[0] : editData.data;
            if (dataToSet) {
                form.reset({
                    spccmcC_Id: dataToSet.spccmcC_Id,
                    spccmcC_CompitionCategory: dataToSet.spccmcC_CompitionCategory,
                    spccmcC_CCDesc: dataToSet.spccmcC_CCDesc,
                    spccmcC_CCAgeFlag: dataToSet.spccmcC_CCAgeFlag,
                    spccmcC_CCWeightFlag: dataToSet.spccmcC_CCWeightFlag,
                    spccmcC_ActiveFlag: dataToSet.spccmcC_ActiveFlag,
                    spccmcC_FromCCAgeYear: dataToSet.spccmcC_FromCCAgeYear,
                    spccmcC_ToCCAgeYear: dataToSet.spccmcC_ToCCAgeYear,
                    spccmcC_FromCCAgeMonth: dataToSet.spccmcC_FromCCAgeMonth,
                    spccmcC_ToCCAgeMonth: dataToSet.spccmcC_ToCCAgeMonth,
                    spccmcC_FromCCAgeDays: dataToSet.spccmcC_FromCCAgeDays,
                    spccmcC_ToCCAgeDays: dataToSet.spccmcC_ToCCAgeDays,
                    spccmcC_CCWeight: dataToSet.spccmcC_CCWeight
                });
            }
        } else if (selectedRow) {
            form.reset({
                spccmcC_Id: selectedRow.spccmcC_Id,
                spccmcC_CompitionCategory: selectedRow.spccmcC_CompitionCategory,
                spccmcC_CCDesc: selectedRow.spccmcC_CCDesc,
                spccmcC_CCAgeFlag: selectedRow.spccmcC_CCAgeFlag,
                spccmcC_CCWeightFlag: selectedRow.spccmcC_CCWeightFlag,
                spccmcC_ActiveFlag: selectedRow.spccmcC_ActiveFlag,
                spccmcC_FromCCAgeYear: selectedRow.spccmcC_FromCCAgeYear,
                spccmcC_ToCCAgeYear: selectedRow.spccmcC_ToCCAgeYear,
                spccmcC_FromCCAgeMonth: selectedRow.spccmcC_FromCCAgeMonth,
                spccmcC_ToCCAgeMonth: selectedRow.spccmcC_ToCCAgeMonth,
                spccmcC_FromCCAgeDays: selectedRow.spccmcC_FromCCAgeDays,
                spccmcC_ToCCAgeDays: selectedRow.spccmcC_ToCCAgeDays,
                spccmcC_CCWeight: selectedRow.spccmcC_CCWeight
            });
        }
    }, [editData, selectedRow, form]);

    const isAgeFlagChecked = form.watch('spccmcC_CCAgeFlag');
    const isWeightFlagChecked = form.watch('spccmcC_CCWeightFlag');

    const onSubmit = async (values: z.infer<typeof masterCompetitionCategorySchema>) => {
        try {
            // Send camelCase payload as requested
            const payload = {
                spccmcC_Id: values.spccmcC_Id,
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
            if (result.success || result?.returnval === true || result?.returnVal === 'updated') {
                toast.success('Competition Category updated successfully');
                await queryClient.invalidateQueries({ queryKey: ['master-competition-categories'] });
                await queryClient.invalidateQueries({ queryKey: ['master-competition-category-details', selectedRow.spccmcC_Id] });
                form.reset();
                onSuccess();
            } else if (result?.returnVal === 'duplicate') {
                toast.warning('Record already exists');
            } else {
                toast.error(result.message || 'Failed to update record');
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

    if (isEditDataLoading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading record details...</span>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="spccmcC_CompitionCategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Competition Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Competition Category" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="spccmcC_CCDesc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter Description" {...field} />
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
                                Updating...
                            </>
                        ) : (
                            'Update Category'
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
