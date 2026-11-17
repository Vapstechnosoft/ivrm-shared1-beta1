'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Textarea } from '@/components/ui/textarea';
import { Award } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { IAlumnusMembershipFormValues } from './schema';

interface AchievementSectionProps {
    form: UseFormReturn<IAlumnusMembershipFormValues>;
}

export default function AchievementSection({ form }: AchievementSectionProps) {
    return (
        <CollapsibleSection title='Achievements & Remarks' defaultOpen={true} icon={<Award className='h-5 w-5' />}>
            <div className='space-y-6'>
                <FormField
                    control={form.control}
                    name='ALSAC_Achievement'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Achievements</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='List your achievements, awards, or recognitions...'
                                    className='min-h-[120px]'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='ALSAC_Remarks'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Any additional remarks or comments...' className='min-h-[100px]' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </CollapsibleSection>
    );
}
