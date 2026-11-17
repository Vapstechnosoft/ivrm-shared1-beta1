'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAcademicYearDropdown,
    useClassTeacherEmployee, // Add this import
    useMasterClassDropdown,
    useMasterSectionDropdown
} from '@/hooks/admission/preadmission/useMasters';
import { masterClassTeacherSchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterClassTeacher } from '@/server/admission/preadmission/masters/class_teacher';
import type { IMasterClassTeacherList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftRight, Save } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import ExchangeClassTeacherForm from './exchange-class-teacher';

type FormFields = z.infer<typeof masterClassTeacherSchema.addOrUpdate>;

interface AddMasterClassTeacherFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterClassTeacherForm({ onSuccess, className = '' }: AddMasterClassTeacherFormProps) {
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | undefined>();
    const [showExchangeModal, setShowExchangeModal] = useState(false);

    const {
        watch,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassTeacherSchema.addOrUpdate),
        mode: 'onChange'
    });
    const {
        data: academicYear,
        isLoading: academicYearLoading,
        error: academicYearError,
        refetchAll: refetchAcademicYear
    } = useAcademicYearDropdown();
    const {
        data: masterClass,
        isLoading: masterClassLoading,
        error: masterClassError,
        refetchAll: refetchMasterClass
    } = useMasterClassDropdown();
    const {
        data: masterSection,
        isLoading: masterSectionLoading,
        error: masterSectionError,
        refetchAll: refetchMasterSection
    } = useMasterSectionDropdown();
    const {
        data: employeeData,
        isLoading: employeeLoading,
        error: employeeError,
        refetchAll: refetchEmployee
    } = useClassTeacherEmployee(watch('asmaY_Id'));

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                imcT_Id: 0,
                asmaY_Id: data.asmaY_Id,
                asmcL_Id: data.asmcL_Id,
                asmS_Id: data.asmS_Id,
                hrmE_Id: data.hrmE_Id
            };

            const response = await addOrUpdateMasterClassTeacher(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchMasterClass();
                refetchMasterSection();
                refetchAcademicYear();
                refetchEmployee();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
        setSelectedClassId('');
        setSelectedAcademicYearId(undefined);
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='academic-year' htmlFor='asmaY_Id'>
                                Academic Year <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            const numValue = Number(value);
                                            field.onChange(numValue);
                                            setSelectedAcademicYearId(numValue); // Update state to trigger employee fetch
                                        }}
                                        value={field.value?.toString() || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYearLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Academic Year...
                                                </SelectItem>
                                            ) : academicYearError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Academic Year
                                                </SelectItem>
                                            ) : (
                                                academicYear?.data?.map((item) => (
                                                    <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                        {item.asmaY_Year}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Class' htmlFor='asmcL_Id'>
                                Class <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmcL_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                            setSelectedClassId(value);
                                        }}
                                        value={field.value?.toString() || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Class' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterClassLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Class...
                                                </SelectItem>
                                            ) : masterClassError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Class
                                                </SelectItem>
                                            ) : (
                                                masterClass?.data?.map((item) => (
                                                    <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                        {item.asmcL_ClassName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmcL_Id && <FormError>{errors.asmcL_Id.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Section' htmlFor='asmS_Id'>
                                Section <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmS_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                        value={field.value?.toString() || ''}
                                        disabled={!selectedClassId}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Section' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterSectionLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Section...
                                                </SelectItem>
                                            ) : masterSectionError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Section
                                                </SelectItem>
                                            ) : (
                                                masterSection?.data?.map((item) => (
                                                    <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                        {item.asmC_SectionName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmS_Id && <FormError>{errors.asmS_Id.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Employee' htmlFor='hrmE_Id'>
                                Employee Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='hrmE_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                        value={field.value?.toString() || ''}
                                        disabled={!selectedAcademicYearId}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Employee' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employeeLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Employee Name...
                                                </SelectItem>
                                            ) : employeeError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Employee Name
                                                </SelectItem>
                                            ) : !selectedAcademicYearId ? (
                                                <SelectItem value='no-year' disabled>
                                                    Please select Academic Year first
                                                </SelectItem>
                                            ) : (
                                                employeeData?.data?.map((item: any) => (
                                                    <SelectItem key={item.hrmE_Id} value={item.hrmE_Id.toString()}>
                                                        {item.employee_name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.hrmE_Id && <FormError>{errors.hrmE_Id.message}</FormError>}
                        </div>
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
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
                    <Button
                        type='button'
                        disabled={isSubmitting}
                        onClick={() => setShowExchangeModal(true)}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                        <div className='flex items-center'>
                            <ArrowLeftRight className='mr-2 h-4 w-4' />
                            Exchange
                        </div>
                    </Button>

                    {showExchangeModal && (
                        <ExchangeClassTeacherForm
                            rowData={{} as IMasterClassTeacherList}
                            isOpen={showExchangeModal}
                            onClose={() => setShowExchangeModal(false)}
                        />
                    )}
                </div>
            </form>
        </div>
    );
}
