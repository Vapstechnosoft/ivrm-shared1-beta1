'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeBusRouteDefaulterreport, useFeeClassListDefaulterreport, useFeeDefaulterReport } from '@/hooks/fees/useReports';
import { transportApproveSchema } from '@/schemas/transport/transport-module/transaction/transport-approve';
import { searchTransportApprovedDetails } from '@/server/transport/transport-module/transaction/transport-approve';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface AddFormProps {
    onSearch: (data: any) => void;
}

const formSchema = transportApproveSchema.search;

export default function AddForm({ onSearch }: AddFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const { data: yearsResponse } = useFeeDefaulterReport();
    const { data: classesResponse } = useFeeClassListDefaulterreport();
    const { data: routesResponse } = useFeeBusRouteDefaulterreport();

    // Ensure data is array
    const academicYears = Array.isArray(yearsResponse) ? yearsResponse : yearsResponse?.data || [];
    const classes = Array.isArray(classesResponse) ? classesResponse : classesResponse?.data || [];
    const routes = Array.isArray(routesResponse) ? routesResponse : routesResponse?.data || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            asmaY_Id: undefined,
            asmcL_Id: 0,
            trmR_Id: 0,
            newreg: undefined
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const payload = {
                ASMAY_Id: values.asmaY_Id,
                ASMCL_Id: values.asmcL_Id,
                TRMR_Id: values.trmR_Id,
                RegularNew: values.newreg
            };
            console.log('search students', payload);
            const response = await searchTransportApprovedDetails(payload);
            if (response && response.data && response.data.length > 0) {
                onSearch(response.data);
            } else {
                toast.warning('No records found');
                onSearch([]);
            }
        } catch (error: any) {
            toast.error(error.message || 'Error occurred while searching');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 rounded-md border p-4 shadow-sm'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    {/* Academic Year */}
                    <FormField
                        control={form.control}
                        name='asmaY_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Academic Year <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Year' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {academicYears.map((item: any) => (
                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Class */}
                    <FormField
                        control={form.control}
                        name='asmcL_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Class <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Class' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='0'>All</SelectItem>
                                        {classes.map((item: any) => (
                                            <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                {item.asmcL_ClassName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Route */}
                    <FormField
                        control={form.control}
                        name='trmR_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Route <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Route' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='0'>All</SelectItem>
                                        {routes.map((item: any) => (
                                            <SelectItem key={item.trmR_Id} value={item.trmR_Id.toString()}>
                                                {item.trmR_RouteNo}: {item.trmR_RouteName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* New/Regular */}
                    <FormField
                        control={form.control}
                        name='newreg'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    New/Regular <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Status' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='New'>New</SelectItem>
                                        <SelectItem value='Regular'>Regular</SelectItem>
                                        <SelectItem value='Both'>Both</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex justify-center'>
                    <Button type='submit' disabled={isLoading}>
                        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        <Search className='mr-2 h-4 w-4' />
                        Search
                    </Button>
                </div>
            </form>
        </Form>
    );
}
