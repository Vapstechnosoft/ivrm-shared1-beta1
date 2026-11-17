'use client';

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CirculationParameterFormValues } from '@/types/library/transactions/circulationParameter';
import { useFormContext } from 'react-hook-form';

interface CirculationParameterFormProps {
    categoryList: any[];
    bookTypeList?: any[];
    classList: any[];
    departmentList?: any[];
    employeeGroupList: any[];
    guestList?: any[];
}

export const CirculationParameterForm = ({
    categoryList = [],
    bookTypeList = [],
    classList = [],
    departmentList = [],
    employeeGroupList = [],
    guestList = []
}: CirculationParameterFormProps) => {
    const form = useFormContext<CirculationParameterFormValues>();
    const { watch, setValue } = form;

    const bookParameterFlag = watch('bookParameterFlag');
    const issuerType = watch('issuerType');

    return (
        <div className='space-y-6'>
            <div className='mb-6 flex flex-wrap justify-center gap-8'>
                {/* Book vs Non Book Toggle */}
                <FormField
                    control={form.control}
                    name='bookParameterFlag'
                    render={({ field }) => (
                        <FormItem className='space-y-3'>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        setValue('categoryId', undefined);
                                        setValue('categoryName', undefined);
                                        setValue('bookType', undefined);
                                    }}
                                    value={field.value || 'BP'}
                                    className='flex space-x-4'>
                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='BP' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Book Parameter</FormLabel>
                                    </FormItem>
                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='NBP' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Non Book Parameter</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <div className='mb-8 flex flex-wrap justify-center gap-8'>
                {/* Issuer Type Toggle */}
                <FormField
                    control={form.control}
                    name='issuerType'
                    render={({ field }) => (
                        <FormItem className='space-y-3'>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        setValue('classId', undefined);
                                        setValue('employeeGroupId', undefined);
                                        setValue('departmentId', undefined);
                                        setValue('guestId', undefined);
                                    }}
                                    value={field.value || 'STUDENT'}
                                    className='flex flex-wrap space-x-4'>
                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='STUDENT' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Student</FormLabel>
                                    </FormItem>
                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='STAFF' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Staff</FormLabel>
                                    </FormItem>
                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='DEPARTMENT' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Department</FormLabel>
                                    </FormItem>
                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='GUEST' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Guest</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Conditional Book Fields */}
                {bookParameterFlag === 'BP' ? (
                    <FormField
                        control={form.control}
                        name='bookType'
                        render={({ field }) => {
                            const resolvedBookTypes = (() => {
                                const typesSet = new Set<string>();
                                if (Array.isArray(bookTypeList) && bookTypeList.length > 0) {
                                    for (const item of bookTypeList) {
                                        if (typeof item === 'string' && item.trim()) {
                                            typesSet.add(item.trim());
                                        } else if (item && typeof item === 'object') {
                                            const val = item.lmB_BookType || item.lmb_BookType || item.bookType || item.name || item.value;
                                            if (typeof val === 'string' && val.trim()) {
                                                typesSet.add(val.trim());
                                            }
                                        }
                                    }
                                }
                                ['Issue', 'Reference', 'Both', 'Book'].forEach((t) => typesSet.add(t));
                                if (field.value && typeof field.value === 'string' && field.value.trim()) {
                                    typesSet.add(field.value.trim());
                                }
                                return Array.from(typesSet);
                            })();

                            return (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>
                                        Book Type <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <Select
                                        key={field.value || 'empty-bookType'}
                                        onValueChange={field.onChange}
                                        value={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Book Type' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {resolvedBookTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                ) : (
                    <FormField
                        control={form.control}
                        name='categoryId'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>
                                    Category Name <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select
                                    key={field.value ? String(field.value) : 'empty-category'}
                                    onValueChange={(val) => {
                                        field.onChange(Number(val));
                                        const category = categoryList.find((c: any) => Number(c.lmC_Id ?? c.lmc_id ?? c.LMC_Id ?? c.id) === Number(val));
                                        if (category) setValue('categoryName', category.lmC_CategoryName ?? category.categoryName);
                                    }}
                                    value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Category Name' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categoryList.map((c: any) => {
                                            const catId = c.lmC_Id ?? c.lmc_id ?? c.LMC_Id ?? c.id;
                                            const catName = c.lmC_CategoryName ?? c.categoryName ?? c.name;
                                            return (
                                                <SelectItem key={catId} value={String(catId)}>
                                                    {catName}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Conditional Issuer Fields */}
                {issuerType === 'STUDENT' && (
                    <FormField
                        control={form.control}
                        name='classId'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>
                                    Class <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select
                                    key={field.value ? String(field.value) : 'empty-class'}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Class' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {classList.map((c: any) => {
                                            const cId = c.asmcL_Id ?? c.asmcl_id ?? c.ASMCL_Id ?? c.id;
                                            const cName = c.asmcL_ClassName ?? c.className ?? c.name;
                                            return (
                                                <SelectItem key={cId} value={String(cId)}>
                                                    {cName}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {issuerType === 'STAFF' && (
                    <FormField
                        control={form.control}
                        name='employeeGroupId'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>
                                    Employee Group <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select
                                    key={field.value ? String(field.value) : 'empty-employeeGroup'}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Employee Group' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {employeeGroupList.map((e: any) => {
                                            const empId = e.hrmgT_Id ?? e.hrmgt_id ?? e.HRMGT_Id ?? e.id;
                                            const empName = e.hrmgT_EmployeeGroupType ?? e.groupName ?? e.name;
                                            return (
                                                <SelectItem key={empId} value={String(empId)}>
                                                    {empName}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {issuerType === 'DEPARTMENT' && (
                    <FormField
                        control={form.control}
                        name='departmentId'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>
                                    Department <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select
                                    key={field.value ? String(field.value) : 'empty-department'}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Department' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {departmentList.map((d: any) => {
                                            const dId = d.hrmD_Id ?? d.hrmd_id ?? d.HRMD_Id ?? d.id;
                                            const dName = d.hrmD_DepartmentName ?? d.departmentName ?? d.name;
                                            return (
                                                <SelectItem key={dId} value={String(dId)}>
                                                    {dName}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {issuerType === 'GUEST' && (
                    <FormField
                        control={form.control}
                        name='guestId'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>
                                    Guest Name <span className='text-red-500'>*</span>
                                </FormLabel>
                                <Select
                                    key={field.value ? String(field.value) : 'empty-guest'}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Guest' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {guestList.map((g: any) => {
                                            const gId = g.guest_Id ?? g.guestId ?? g.guest_id ?? g.hrmG_Id ?? g.id;
                                            const gName = g.guest_Name ?? g.guestName ?? g.name;
                                            return (
                                                <SelectItem key={gId} value={String(gId)}>
                                                    {gName}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Number Inputs */}
                <FormField
                    control={form.control}
                    name='maxIssueItems'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>No. Of Items</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Enter max items'
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='maxIssueDays'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Issue Days</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Enter max issue days'
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='maxRenewals'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Renewals</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Enter max renewals'
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};
