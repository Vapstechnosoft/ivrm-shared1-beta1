'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterAreaDropDown, useMasterRoute, useMasterRouteDropDown } from '@/hooks/transport/transportmodule/usemasters';
import { routeAreaMappingSchema } from '@/schemas/transport/masters';
import { saveRouteAreaMapping } from '@/server/transport/transport-module/masters/route';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof routeAreaMappingSchema.addOrUpdate>;

interface AddMappingFormProps {
    routes?: any[];
    areas?: any[];
    onClose: () => void;
}

export default function AddMappingForm({ routes = [], areas = [], onClose }: AddMappingFormProps) {
    const { refetchAll } = useMasterRoute();
    const [searchTerm, setSearchTerm] = useState('');


    const { data: routesData, isLoading: routesLoading, error: routesError } = useMasterRouteDropDown();
    const { data: areaData, isLoading: areaLoading, error: areaError } = useMasterAreaDropDown();

    const [routeOptions, setRouteOptions] = useState<any[]>([]);
    const [areaOptions, setAreaOptions] = useState<any[]>([]);

    useEffect(() => {
        if (Array.isArray(routesData)) {
            setRouteOptions(routesData);
        } else if (routesData?.data && Array.isArray(routesData.data)) {
            setRouteOptions(routesData.data);
        } else if (routes.length > 0) {
            setRouteOptions(routes);
        }
    }, [routesData, routes]);

    useEffect(() => {
        if (Array.isArray(areaData)) {
            setAreaOptions(areaData);
        } else if (areaData?.data && Array.isArray(areaData.data)) {
            setAreaOptions(areaData.data);
        } else if (areas.length > 0) {
            setAreaOptions(areas);
        }
    }, [areaData, areas]);


    const methods = useForm<FormFields>({
        resolver: zodResolver(routeAreaMappingSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            trmR_Id: 0,
            selectedAreaIds: []
        }
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isSubmitting }
    } = methods;

    const filteredAreas = areaOptions?.filter((area: any) =>
        area?.trmA_AreaName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const selectedAreaIds = watch('selectedAreaIds');

    const handleSelectAll = () => {
        if (filteredAreas.length > 0 && selectedAreaIds.length === filteredAreas.length) {
            setValue('selectedAreaIds', []);
        } else {
            setValue('selectedAreaIds', filteredAreas.map((a: any) => a.trmA_Id));
        }
    };

    const handleAreaToggle = (areaId: number) => {
        const current = selectedAreaIds || [];
        if (current.includes(areaId)) {
            setValue('selectedAreaIds', current.filter((id) => id !== areaId));
        } else {
            setValue('selectedAreaIds', [...current, areaId]);
        }
    };

    const onSubmit = async (data: FormFields) => {
        try {
            const payload = {
                trmR_Id: data.trmR_Id,
                arealistarr: data.selectedAreaIds.map((id) => ({ trmA_Id: id }))
            };
            console.log("payloadarea", payload)
            const response = await saveRouteAreaMapping(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                // onSuccess?.();
                onClose?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit, (errs) => {
                        const firstError = Object.values(errs)[0] as any;
                        toast.error(firstError?.message ?? 'Please fill all required fields');
                    })}
                    className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md'
                    noValidate>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Route Selection */}
                        <Controller
                            control={control}
                            name='trmR_Id'
                            render={({ field, fieldState }) => (
                                <div>
                                    <Label>
                                        Route <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        key={field.value}
                                        value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                        onValueChange={(val) => field.onChange(Number(val))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Route' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {routesLoading ? (
                                                <SelectItem value='loading' disabled>Loading Routes...</SelectItem>
                                            ) : (
                                                routeOptions?.map((route: any) => (
                                                    <SelectItem key={route.trmR_Id} value={route.trmR_Id.toString()}>
                                                        {route.trmR_RouteName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Area Selection */}
                        <div className='flex flex-col gap-2'>
                            <Label>
                                Area <span className='text-red-500'>*</span>
                            </Label>
                            <div className='border rounded-md p-2 h-60 overflow-y-auto flex flex-col gap-2'>
                                <Input
                                    placeholder='Search Area...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='mb-2'
                                />
                                <div className='flex items-center space-x-2 pb-2 border-b'>
                                    <Checkbox
                                        checked={filteredAreas.length > 0 && selectedAreaIds.length === filteredAreas.length}
                                        onCheckedChange={handleSelectAll}
                                    />
                                    <label className='text-sm font-medium text-muted-foreground'>Select All</label>
                                </div>

                                <Controller
                                    control={control}
                                    name='selectedAreaIds'
                                    render={({ fieldState }) => (
                                        <>
                                            {areaLoading ? (
                                                <div className="p-2 text-sm text-center">Loading Areas...</div>
                                            ) : (
                                                filteredAreas.map((area: any) => (
                                                    <div key={area.trmA_Id} className='flex items-center space-x-2'>
                                                        <Checkbox
                                                            checked={selectedAreaIds.includes(area.trmA_Id)}
                                                            onCheckedChange={() => handleAreaToggle(area.trmA_Id)}
                                                        />
                                                        <label className='text-sm'>{area.trmA_AreaName}</label>
                                                    </div>
                                                ))
                                            )}
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end gap-2 mt-4'>
                        <Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
