// app/(root)/fees/feereports/feedefaulterreport/page.tsx
'use client';

import { useAcademicYearDropdown, useStudentClassDropDown } from '@/hooks/fees/useMasters';
import {
    useFeeBusRouteDefaulterreport,
    useFeeClassListDefaulterreport,
    useFeeCustomGroupDefaulterreport,
    useFeeDefaulterReport,
    useFeeGroupDefaulterreport,
    useFeeSectionListDefaulterreport,
    useFeeTermDefaulterreport,
    useFeeTransInstallmentYearlyfeecollectionreport
} from '@/hooks/fees/useReports';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { FormError } from '@/components/ui/extension/field';
import { feesStudentTransactionSchema } from '@/schemas/fees/trasactions';
import { useRef, useState } from 'react';
import { coeReportSchema } from '@/schemas/coe/master';


// Checkbox with full indeterminate support
const Checkbox = ({ checked, indeterminate, onCheckedChange, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);

    //   useEffect(() => {
    //     if (ref.current) {
    //       ref.current.indeterminate = !!indeterminate;
    //     }
    //   }, [indeterminate]);

    return <BaseCheckbox ref={ref} checked={checked} onCheckedChange={onCheckedChange} {...props} />;
};

type FormFields = z.infer<typeof coeReportSchema.addOrUpdate>;

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

export default function coeReport() {
    // ---------------------------- FORM ----------------------------
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(coeReportSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmaY_Id: undefined
        }
    });







 

    // Load data effects (unchanged)


    // Toggle handlers


    const handleReset = () => {
        reset();
        window.location.reload();
    };

   //  const totalRow = createTotalRow(reportData.filter((r): r is IFeeYearlyCollectionReportRow => !('__isTotal' in r)));

   //  const tableData: FeeYearlyTableRow[] = [...reportData.filter((r) => !('__isTotal' in r)), totalRow];

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
       
    };



        const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);
   const [selectedclassId, setSelectedClassId] = useState<number | null>(null);
const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();
const { data: feeclassData, isLoading: feeclassDataLoading } = useStudentClassDropDown(true);
    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='flex flex-col items-center justify-center space-y-6 p-6'>
                            {/* Academic Year */}
                            <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                <Label htmlFor='asmaY_Id' className='whitespace-nowrap font-semibold'>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='asmaY_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(val) => {
                                                const id = Number(val);
                                                field.onChange(id);
                                                setSelectedAsmayId(id);
                                            }}
                                            value={
                                                typeof field.value === 'number' || typeof field.value === 'string'
                                                    ? String(field.value)
                                                    : ''
                                            }>
                                            <SelectTrigger className='w-64'>
                                                <SelectValue placeholder='--Select Academic Year--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {loadingYears ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : (
                                                    academicYearData?.data?.map((item: any) => (
                                                        <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                            {item.asmaY_Year}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            {errors.asmaY_Id && (
                                <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                    <div className='w-[145px]'>
                                        </div> {/* Empty spacer to match label width */}
                                    <FormError>{errors.asmaY_Id.message}</FormError>
                                </div>
                            )}

                            {/* Class */}
                            <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                <Label htmlFor='asmcl_Id' className='whitespace-nowrap font-semibold'>
                                    Class <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='asmcl_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(val) => {
                                                const id = Number(val);
                                                field.onChange(id);
                                                setSelectedClassId(id);
                                            }}
                                            value={
                                                typeof field.value === 'number' || typeof field.value === 'string'
                                                    ? String(field.value)
                                                    : ''
                                            }
                                            disabled={feeclassDataLoading}>
                                            <SelectTrigger className='w-64'>
                                                <SelectValue placeholder='Select Class' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {feeclassData?.data?.map((item) => (
                                                    <SelectItem key={item.asmcL_Id} value={String(item.asmcL_Id)}>
                                                        {item.asmcL_ClassName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            {errors.asmcl_Id && (
                                <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                    <div className='w-[145px]'>
                                        </div> {/* Empty spacer to match label width */}
                                    <FormError>{errors.asmcl_Id.message}</FormError>
                                </div>
                            )}

                            {/* Action Buttons (Centered) */}
                            <div className='flex w-full max-w-md justify-center gap-4 pt-4'>
                                <Button type='submit' disabled={isSubmitting} className='min-w-[120px]'>
                                    {isSubmitting ? 'Loading...' : 'Submit'}
                                </Button>
                                <Button type='button' variant='outline' onClick={handleReset} className='min-w-[120px]'>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}