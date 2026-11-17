'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { IAlumnusMembershipFormValues } from './schema';

interface ProfessionalSectionProps {
    form: UseFormReturn<IAlumnusMembershipFormValues>;
}

export default function ProfessionalSection({ form }: ProfessionalSectionProps) {
    return (
        <CollapsibleSection title='Professional Details' defaultOpen={true} icon={<Briefcase className='h-5 w-5' />}>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                    control={form.control}
                    name='ALSPR_CompanyName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Current company' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='ALSPR_Designation'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Designation</FormLabel>
                            <FormControl>
                                <Input placeholder='Job title' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='ALSPR_WorkingSince'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Working Since (Year)</FormLabel>
                            <FormControl>
                                <Input placeholder='YYYY' maxLength={4} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='ALSPR_EmailId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Work Email</FormLabel>
                            <FormControl>
                                <Input placeholder='work@company.com' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='md:col-span-2'>
                    <FormField
                        control={form.control}
                        name='ALSPR_CompanyAddress'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Address</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='Full company address' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='md:col-span-2'>
                    <FormField
                        control={form.control}
                        name='ALSPR_OtherDetails'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Other Professional Details</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='Any other info...' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </CollapsibleSection>
    );
}
