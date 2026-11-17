'use client';

import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BookRegisterPayload } from '@/types/library/masters/bookRegister';
import { Controller, useFormContext } from 'react-hook-form';

export default function TabBookDetails({ dropdownData }: { dropdownData: any }) {
    const {
        control,
        register,
        formState: { errors }
    } = useFormContext<BookRegisterPayload>();

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <InputText label='Book Title' required {...register('LMB_BookTitle')} error={errors.LMB_BookTitle?.message} />
            <InputText label='Subtitle' {...register('MB_Subtitle')} error={errors.MB_Subtitle?.message} />

            <div className='flex flex-col gap-1.5'>
                <Label>
                    Book Type <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='LMB_BookType'
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Book Type' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Issue'>Issue</SelectItem>
                                <SelectItem value='Issuable'>Issuable</SelectItem>
                                <SelectItem value='NotIssuable'>Not Issuable</SelectItem>
                                <SelectItem value='ReferenceonlyIssuable'>Reference only Issuable</SelectItem>
                                <SelectItem value='ReferenceonlyNon-Issuable'>Reference only Non-Issuable</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.LMB_BookType && <FormError>{errors.LMB_BookType.message}</FormError>}
            </div>

            <div className='flex flex-col gap-1.5'>
                <Label>
                    Category <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='LMC_Id'
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? field.value.toString() : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Category' />
                            </SelectTrigger>
                            <SelectContent>
                                {dropdownData?.categorylist?.map((item: any) => (
                                    <SelectItem key={item.lmC_Id} value={item.lmC_Id.toString()}>
                                        {item.lmC_CategoryName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.LMC_Id && <FormError>{errors.LMC_Id.message}</FormError>}
            </div>

            <div className='flex flex-col gap-1.5'>
                <Label>
                    Subject <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='LMS_Id'
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? field.value.toString() : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Subject' />
                            </SelectTrigger>
                            <SelectContent>
                                {dropdownData?.subjectlist?.map((item: any) => (
                                    <SelectItem key={item.lmS_Id} value={item.lmS_Id.toString()}>
                                        {item.lmS_SubjectName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.LMS_Id && <FormError>{errors.LMS_Id.message}</FormError>}
            </div>

            <div className='flex flex-col gap-1.5'>
                <Label>
                    Department <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='LMD_Id'
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? field.value.toString() : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Department' />
                            </SelectTrigger>
                            <SelectContent>
                                {dropdownData?.deptlist?.map((item: any) => (
                                    <SelectItem key={item.lmD_Id} value={item.lmD_Id.toString()}>
                                        {item.lmD_DepartmentName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.LMD_Id && <FormError>{errors.LMD_Id.message}</FormError>}
            </div>

            <InputText label='ISBN No' required {...register('LMB_ISBNNo')} error={errors.LMB_ISBNNo?.message} />

            <InputText label='Published Year' required {...register('LMB_PublishedYear')} error={errors.LMB_PublishedYear?.message} />

            <div className='flex flex-col gap-1.5'>
                <Label>
                    Library <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='LMAL_Id'
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? field.value.toString() : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Library' />
                            </SelectTrigger>
                            <SelectContent>
                                {dropdownData?.liblist?.map((item: any) => (
                                    <SelectItem key={item.lmaL_Id} value={item.lmaL_Id.toString()}>
                                        {item.lmaL_LibraryName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.LMAL_Id && <FormError>{errors.LMAL_Id.message}</FormError>}
            </div>
        </div>
    );
}
