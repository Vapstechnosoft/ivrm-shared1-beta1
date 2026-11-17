'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterAreaDropDown } from '@/hooks/transport/transportmodule/usemasters';
import { useRouteLocationMapping } from '@/hooks/transport/transportmodule/usetransaction';
import { routeLocationMappingSchema } from '@/schemas/transport/transaction';
import { getLocationsByRoute, getRoutesByArea, saveRouteLocationMapping } from '@/server/transport/transport-module/transaction/route-location-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof routeLocationMappingSchema.addOrUpdate>;

interface AddFormProps {
    areas?: any[];
    onClose: () => void;
    className?: string;
}

export default function AddForm({ areas = [], onClose, className = '' }: AddFormProps) {

    const { data: areaData, isLoading: areaLoading, error: areaError } = useMasterAreaDropDown();

    const { refetchAll } = useRouteLocationMapping();
    const [searchTerm, setSearchTerm] = useState('');
    const [routeOptions, setRouteOptions] = useState<any[]>([]);
    const [locationOptions, setLocationOptions] = useState<any[]>([]);
    const [routesLoading, setRoutesLoading] = useState(false);
    const [locationsLoading, setLocationsLoading] = useState(false);



    const methods = useForm<FormFields>({
        resolver: zodResolver(routeLocationMappingSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            trmrL_Id: 0,
            trmA_Id: 0,
            trmR_Id: 0,
            selectedLocationIds: []
        }
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isSubmitting, errors }
    } = methods;

    const selectedAreaId = watch('trmA_Id');
    const selectedRouteId = watch('trmR_Id');
    const selectedLocationIds = watch('selectedLocationIds');



    const handleReset = () => {
        reset();
        setRouteOptions([]);
        setLocationOptions([]);
    };

    // Fetch Routes when Area changes
    useEffect(() => {
        const fetchRoutes = async () => {
            if (selectedAreaId && selectedAreaId !== 0) {
                setRoutesLoading(true);
                try {
                    const res = await getRoutesByArea(selectedAreaId);
                    console.log("routes", res);

                    if (res && res.data) {
                        setRouteOptions(res.data);
                    } else {
                        setRouteOptions([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch routes", error);
                    toast.error("Failed to fetch routes");
                } finally {
                    setRoutesLoading(false);
                }
            } else {
                setRouteOptions([]);
            }
        };

        if (selectedAreaId) {
            fetchRoutes();
            setValue('trmR_Id', 0);
            setValue('selectedLocationIds', []);
            setLocationOptions([]);
        }
    }, [selectedAreaId, setValue]);

    // Fetch Locations when Route changes
    useEffect(() => {
        const fetchLocations = async () => {
            if (selectedRouteId && selectedRouteId !== 0) {
                setLocationsLoading(true);
                try {
                    const res = await getLocationsByRoute(selectedRouteId);

                    if (res && res.data) {
                        setLocationOptions(res.data);
                    } else {
                        setLocationOptions([]);
                        toast.info("All Locations Is Mapped For This Route");
                    }
                } catch (error) {
                    console.error("Failed to fetch locations", error);
                    toast.error("Failed to fetch locations");
                } finally {
                    setLocationsLoading(false);
                }
            } else {
                setLocationOptions([]);
            }
        };

        if (selectedRouteId) {
            fetchLocations();
            setValue('selectedLocationIds', []);
        }
    }, [selectedRouteId, setValue]);


    const filteredLocations = locationOptions?.filter((loc: any) =>
        loc?.trmL_LocationName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setValue('selectedLocationIds', filteredLocations.map((l: any) => l.trmL_Id));
        } else {
            setValue('selectedLocationIds', []);
        }
    };

    const handleLocationToggle = (locationId: number) => {
        const current = selectedLocationIds || [];
        if (current.includes(locationId)) {
            setValue('selectedLocationIds', current.filter((id) => id !== locationId));
        } else {
            setValue('selectedLocationIds', [...current, locationId]);
        }
    };

    const onSubmit = async (data: FormFields) => {
        try {
            const selectedLocationObjects = data.selectedLocationIds.map(id => {
                const loc = locationOptions.find(l => l.trmL_Id === id);
                return {
                    TRML_Id: id,
                    locationname: loc?.trmL_LocationName || ''
                };
            });

            const payload = {
                TRMR_Id: data.trmR_Id,
                TRMRL_Id: 0,
                selectedlocations: selectedLocationObjects
            };
            console.log("save payload", payload)
            const response = await saveRouteLocationMapping(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onClose?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <div className={className}>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-6'
                    noValidate>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Area Selection */}
                        <Controller
                            control={control}
                            name='trmA_Id'
                            render={({ field, fieldState }) => (
                                <div className='space-y-2'>
                                    <Label>
                                        Area <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        disabled={areaLoading}
                                        value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                        onValueChange={(val) => field.onChange(Number(val))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={areaLoading ? 'Loading Areas...' : 'Select Area'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(areaData?.data || areas || []).map((area: any) => (
                                                <SelectItem key={area.trmA_Id} value={area.trmA_Id.toString()}>
                                                    {area.trmA_AreaName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Route Selection */}
                        <Controller
                            control={control}
                            name='trmR_Id'
                            render={({ field, fieldState }) => (
                                <div className='space-y-2'>
                                    <Label>
                                        Route <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        disabled={!selectedAreaId || selectedAreaId === 0 || routesLoading}
                                        value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                        onValueChange={(val) => field.onChange(Number(val))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={routesLoading ? 'Loading Routes...' : 'Select Route'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {routeOptions.map((route: any) => (
                                                <SelectItem key={route.trmR_Id} value={route.trmR_Id.toString()}>
                                                    {route.trmR_RouteName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />
                    </div>

                    {/* Location Selection */}
                    <div className='flex flex-col gap-2'>
                        <Label>
                            Location/Boarding Point <span className='text-red-500'>*</span>
                        </Label>
                        <div className='border rounded-md p-2 h-60 flex flex-col gap-2'>
                            <Input
                                placeholder='Search Location...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='mb-2'
                                disabled={!selectedRouteId || selectedRouteId === 0}
                            />

                            <div className='flex flex-col overflow-y-auto h-full px-1'>
                                {locationsLoading ? (
                                    <div className="text-center py-4 text-muted-foreground">Loading Locations...</div>
                                ) : locationOptions.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        {!selectedRouteId ? "Select a route to view locations" : "No locations available"}
                                    </div>
                                ) : (
                                    <>
                                        <div className='flex items-center space-x-2 pb-2 border-b mb-2 sticky top-0 bg-white z-10'>
                                            <Checkbox
                                                checked={filteredLocations.length > 0 && selectedLocationIds.length === filteredLocations.length}
                                                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                            />
                                            <label className='text-sm font-medium'>Select All</label>
                                        </div>

                                        <div className="space-y-2">
                                            <Controller
                                                control={control}
                                                name='selectedLocationIds'
                                                render={({ fieldState }) => (
                                                    <>
                                                        {filteredLocations.map((loc: any) => (
                                                            <div key={loc.trmL_Id} className='flex items-center space-x-2'>
                                                                <Checkbox
                                                                    checked={selectedLocationIds.includes(loc.trmL_Id)}
                                                                    onCheckedChange={() => handleLocationToggle(loc.trmL_Id)}
                                                                />
                                                                <label className='text-sm cursor-pointer' onClick={() => handleLocationToggle(loc.trmL_Id)}>
                                                                    {loc.trmL_LocationName}
                                                                </label>
                                                            </div>
                                                        ))}

                                                    </>
                                                )}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {errors.selectedLocationIds && (
                            <FormError>{errors.selectedLocationIds.message}</FormError>
                        )}
                    </div>

                    <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={onClose}
                            disabled={isSubmitting}
                            className='order-3 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                            isLoading={isSubmitting}
                            loadingText='Saving...'>
                            <div className='flex items-center'>
                                <Save className='mr-2 h-4 w-4' />
                                Save
                            </div>
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
