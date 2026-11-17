'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDetailsByType, getDistricts, getStates } from '@/server/alumni/alumni-report';
import type { ICountry, IDistrict, IState } from '@/types/alumni/alumni-report';
import type { IAlumniAcademicYear, IAlumniClass } from '@/types/alumni/alumni-search';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type AlumniReportFormValues, alumniReportSchema } from './schema';

interface AlumniReportFilterFormProps {
    initialData: {
        yearList: IAlumniAcademicYear[];
        classList: IAlumniClass[];
        countrylist: ICountry[];
        citylist: { almsT_ConCity: string }[];
        occupationlist: { designation: string }[];
    };
    onSubmit: (values: AlumniReportFormValues) => void;
    onReset: () => void;
    loading: boolean;
}

export function AlumniReportFilterForm({ initialData, onSubmit, onReset, loading }: AlumniReportFilterFormProps) {
    const [states, setStates] = useState<IState[]>([]);
    const [districts, setDistricts] = useState<IDistrict[]>([]);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [filterType, setFilterType] = useState<string>('City');
    const [cityOptions, setCityOptions] = useState<{ almsT_ConCity: string }[]>(initialData.citylist || []);
    const [occupationOptions, setOccupationOptions] = useState<{ designation: string }[]>(initialData.occupationlist || []);
    const [fetchingFilterData, setFetchingFilterData] = useState(false);

    const handleFilterTypeChange = async (value: string) => {
        setFilterType(value);
        if (value === 'City' && cityOptions.length === 0) {
            setFetchingFilterData(true);
            try {
                const res = await getDetailsByType('City');
                if (res && res.success) {
                    const data = res.data || res;
                    console.log('City Response Data:', data);
                    const list = data.citylist || data.searchResult || data.retObject || (Array.isArray(data) ? data : []) || [];
                    setCityOptions(
                        list
                            .map((c: any) => ({
                                almsT_ConCity: c.almsT_PerCity || c.cityName || c.city || c.almsT_ConCity || c
                            }))
                            .filter((c: any) => c.almsT_ConCity)
                    );
                }
            } catch (e) {
                toast.error('Failed to fetch cities');
            } finally {
                setFetchingFilterData(false);
            }
        } else if (value === 'Occupation' && occupationOptions.length === 0) {
            setFetchingFilterData(true);
            try {
                const res = await getDetailsByType('Occupation');
                if (res && res.success) {
                    const data = res.data || res;
                    console.log('Occupation Response Data:', data);
                    const list = data.occupationlist || data.searchResult || data.retObject || (Array.isArray(data) ? data : []) || [];
                    setOccupationOptions(
                        list
                            .map((o: any) => ({
                                designation: o.alspR_Designation || o.designation || o
                            }))
                            .filter((o: any) => o.designation)
                    );
                }
            } catch (e) {
                toast.error('Failed to fetch occupations');
            } finally {
                setFetchingFilterData(false);
            }
        }
    };

    const form = useForm<AlumniReportFormValues>({
        resolver: zodResolver(alumniReportSchema),
        defaultValues: {
            sall: 1,
            batchIds: [],
            countryIds: [],
            stateIds: [],
            districtIds: [],
            classIds: [],
            city: '',
            occupation: '',
            showEmail: true,
            showPhone: true
        }
    });

    const selectedCountries = form.watch('countryIds');
    const selectedStates = form.watch('stateIds');

    useEffect(() => {
        const fetchStates = async () => {
            if (selectedCountries && selectedCountries.length > 0) {
                setLoadingStates(true);
                try {
                    const response = await getStates(selectedCountries.map((id) => ({ IVRMMC_Id: id })));
                    console.log('States Response:', response);
                    if (response.success && response.data) {
                        let data = [];
                        if (Array.isArray(response.data)) {
                            data = response.data;
                        } else {
                            data = response.data.statelist || response.data.retObject || [];
                        }
                        setStates(data);
                    }
                } catch (error) {
                    toast.error('Failed to fetch states');
                } finally {
                    setLoadingStates(false);
                }
            } else {
                setStates([]);
                form.setValue('stateIds', []);
            }
        };
        fetchStates();
    }, [selectedCountries, form]);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedStates && selectedStates.length > 0) {
                setLoadingDistricts(true);
                try {
                    const response = await getDistricts(selectedStates.map((id) => ({ IVRMMS_Id: id })));
                    console.log('Districts Response:', response);
                    if (response.success && response.data) {
                        let data = [];
                        if (Array.isArray(response.data)) {
                            data = response.data;
                        } else {
                            data = response.data.districtlist || response.data.retObject || [];
                        }
                        setDistricts(data);
                    }
                } catch (error) {
                    toast.error('Failed to fetch districts');
                } finally {
                    setLoadingDistricts(false);
                }
            } else {
                setDistricts([]);
                form.setValue('districtIds', []);
            }
        };
        fetchDistricts();
    }, [selectedStates, form]);

    const handleReset = () => {
        form.reset();
        onReset();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Left Column */}
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='sall'
                            render={({ field }) => (
                                <FormItem className='space-y-3'>
                                    <FormLabel>Report Type</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value.toString()}
                                            className='flex space-x-4'>
                                            <FormItem className='flex items-center space-x-2 space-y-0'>
                                                <FormControl>
                                                    <RadioGroupItem value='1' />
                                                </FormControl>
                                                <FormLabel className='font-normal'>Alumni Report</FormLabel>
                                            </FormItem>
                                            <FormItem className='flex items-center space-x-2 space-y-0'>
                                                <FormControl>
                                                    <RadioGroupItem value='0' />
                                                </FormControl>
                                                <FormLabel className='font-normal'>Address Book</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='batchIds'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Batch <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={initialData.yearList.map((y) => ({
                                                label: y.asmaY_Year,
                                                value: y.asmaY_Id.toString()
                                            }))}
                                            onValueChange={(vals) => field.onChange(vals.map((v) => Number.parseInt(v)))}
                                            defaultValue={field.value.map((v) => v.toString())}
                                            placeholder='Select Batches'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='countryIds'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={initialData.countrylist.map((c) => ({
                                                label: c.ivrmmC_CountryName,
                                                value: c.ivrmmC_Id.toString()
                                            }))}
                                            onValueChange={(vals) => field.onChange(vals.map((v) => Number.parseInt(v)))}
                                            defaultValue={field.value?.map((v) => v.toString()) || []}
                                            placeholder='Select Countries'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='stateIds'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={states.map((s) => ({ label: s.ivrmmS_Name, value: s.ivrmmS_Id.toString() }))}
                                            onValueChange={(vals) => field.onChange(vals.map((v) => Number.parseInt(v)))}
                                            defaultValue={field.value?.map((v) => v.toString()) || []}
                                            placeholder={loadingStates ? 'Loading states...' : 'Select States'}
                                            disabled={!selectedCountries?.length}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Right Column */}
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='districtIds'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>District</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={districts.map((d) => ({ label: d.ivrmmD_Name, value: d.ivrmmD_Id.toString() }))}
                                            onValueChange={(vals) => field.onChange(vals.map((v) => Number.parseInt(v)))}
                                            defaultValue={field.value?.map((v) => v.toString()) || []}
                                            placeholder={loadingDistricts ? 'Loading districts...' : 'Select Districts'}
                                            disabled={!selectedStates?.length}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='classIds'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={initialData.classList.map((c) => ({
                                                label: c.asmcL_ClassName,
                                                value: c.asmcL_Id.toString()
                                            }))}
                                            onValueChange={(vals) => field.onChange(vals.map((v) => Number.parseInt(v)))}
                                            defaultValue={field.value?.map((v) => v.toString()) || []}
                                            placeholder='Select Classes'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='space-y-4 rounded-md border p-4'>
                            <h3 className='font-medium text-sm'>Filter Options</h3>
                            <RadioGroup defaultValue={filterType} onValueChange={handleFilterTypeChange} className='mb-4 flex space-x-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='City' id='r-city' />
                                    <label htmlFor='r-city' className='cursor-pointer text-sm'>
                                        City
                                    </label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Occupation' id='r-occupation' />
                                    <label htmlFor='r-occupation' className='cursor-pointer text-sm'>
                                        Occupation
                                    </label>
                                </div>
                            </RadioGroup>

                            {filterType === 'City' && (
                                <FormField
                                    control={form.control}
                                    name='city'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={fetchingFilterData ? 'Loading Cities...' : 'Select City'}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {cityOptions.map((c, i) => (
                                                        <SelectItem key={i} value={c.almsT_ConCity}>
                                                            {c.almsT_ConCity}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {filterType === 'Occupation' && (
                                <FormField
                                    control={form.control}
                                    name='occupation'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Occupation</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                fetchingFilterData ? 'Loading Occupations...' : 'Select Occupation'
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {occupationOptions.map((o, i) => (
                                                        <SelectItem key={i} value={o.designation}>
                                                            {o.designation}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <div className='flex space-x-6 rounded-md border bg-muted/50 p-4'>
                            <FormField
                                control={form.control}
                                name='showEmail'
                                render={({ field }) => (
                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className='cursor-pointer font-normal'>Show Email</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='showPhone'
                                render={({ field }) => (
                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className='cursor-pointer font-normal'>Show Phone No.</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className='flex justify-center space-x-4'>
                    <Button type='submit' disabled={loading}>
                        <FileText className='mr-2 h-4 w-4' />
                        {loading ? 'Generating...' : 'Show Report'}
                    </Button>
                    <Button type='button' variant='outline' onClick={handleReset} disabled={loading}>
                        <RotateCcw className='mr-2 h-4 w-4' />
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
