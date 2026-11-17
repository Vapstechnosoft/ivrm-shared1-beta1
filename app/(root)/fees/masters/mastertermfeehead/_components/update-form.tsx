'use client';
import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MASTER_HEADS_DROPDOWN, MASTER_INSTALLMENT_DROPDOWN, TERM_DROPDOWN_DATA, useMasterTermsHead } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { masterTermFeeHeadSchema } from '@/schemas/fees/masters';
import { addOrUpdateFeeTermHead } from '@/server/fees/masters/fee-term-heads';
import type { IMasterTermFeeHeadList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, ChevronsUpDown, Save, Search, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTermFeeHeadSchema.addOrUpdate>;

interface UpdateFeeTermHeadFormProps {
    onSuccess?: () => void;
    fineslab?: string;
    selectedRow: IMasterTermFeeHeadList;
}

export default function UpdateFeeTermHeadForm({ onSuccess, fineslab = '', selectedRow: row }: UpdateFeeTermHeadFormProps) {
    const { refetchAll } = useMasterTermsHead();

    const isEditMode = !!row;

    const [selectedHeadsItems, setSelectedHeadsItems] = useState<{ fmH_Id: string }[]>([]);
    const [SelectedInstallmentsItems, setSelectedInstallmentsItems] = useState<{ ftI_ID: string }[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const [isHeadPopoverOpen, setIsHeadPopoverOpen] = useState(false);
    const [isInstallPopoverOpen, setIsInstallPopoverOpen] = useState(false);

    const [headSearch, setHeadSearch] = useState('');
    const [installSearch, setInstallSearch] = useState('');
    const [search, setSearch] = useState('');

    const { data: terms, isLoading: termsLoading, error: termsError, refetchAll: refetchterms } = TERM_DROPDOWN_DATA();

    const {
        data: masterInstallment,
        isLoading: masterInstallmentLoading,
        error: masterInstallmentError,
        refetchAll: refetchmasterInstallment
    } = MASTER_INSTALLMENT_DROPDOWN();

    const { data: masterHeads, isLoading: masterHeadsLoading, refetchAll: refetchMasterHeads } = MASTER_HEADS_DROPDOWN();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTermFeeHeadSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fmT_Id: row.fmT_Id || 0
        }
    });

    console.log('Selected row data :', row);

    function OnReset() {
        reset();
        setSelectedHeadsItems([]);
        setSelectedInstallmentsItems([]);
        refetchAll();
        refetchterms();
        refetchmasterInstallment();
        refetchMasterHeads();
    }
    useEffect(() => {
        if (row && masterHeads?.data && masterInstallment?.data) {
            // Preselect heads (single ID)
            const preselectedHeads = masterHeads.data
                .filter((head) => head.fmH_Id === row.fmH_Id) // direct comparison
                .map((head) => ({ fmH_Id: head.fmH_Id.toString() }));

            setSelectedHeadsItems(preselectedHeads);

            // Preselect installments (single ID)
            const preselectedInstallments = masterInstallment.data
                .filter((inst) => inst.ftI_ID === row.ftI_Id) // direct comparison
                .map((inst) => ({ ftI_ID: inst.ftI_ID.toString() }));

            setSelectedInstallmentsItems(preselectedInstallments);

            // Preselect term in react-hook-form
            reset({
                fmT_Id: row.fmT_Id, // Term
                heads: preselectedHeads.map((h) => h.fmH_Id),
                installments: preselectedInstallments.map((i) => i.ftI_ID)
            });
        }
    }, [row, masterHeads, masterInstallment, reset]);

    const selectedheads =
        masterHeads?.data && selectedHeadsItems.length > 0
            ? masterHeads.data.find((fh) => fh.fmH_Id.toString() === selectedHeadsItems[0].fmH_Id)?.fmH_FeeName || 'Select Fee Heads'
            : 'Select Fee Heads';

    const selectedInstallemnts =
        masterInstallment?.data && SelectedInstallmentsItems.length > 0
            ? masterInstallment.data.find((fh) => fh.ftI_ID.toString() === SelectedInstallmentsItems[0].ftI_ID)?.ftI_NAME ||
              'Select Fee Installemnts'
            : 'Select Fee Installemnts';

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { fmT_Id } = data;

            const payload = {
                fmtfH_Id: row.idforedt,
                FMT_Id: fmT_Id,
                // mI_Id: 30,
                feeHeadList: selectedHeadsItems.map((item) => ({
                    fmH_Id: Number(item.fmH_Id)
                })),
                feeInsatallmentList: SelectedInstallmentsItems.map((item) => ({
                    fmI_Id: Number(item.ftI_ID)
                }))
            };

            const js = JSON.stringify(payload);
            console.log('Payload JSON:', js);

            const response = await addOrUpdateFeeTermHead(payload);

            // Handle response as per your business logic
            if (response.success) {
                toast.success(response.message);
                OnReset();
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
    };

    const handleHeadSelection = (selectedValues: string[]) => {
        setSelectedHeadsItems(
            selectedValues.map((value) => ({
                fmH_Id: value.toString() // Store only the fmH_Id as a string
            }))
        );
    };

    const handleInstallmentSelection = (selectedValues: string[]) => {
        setSelectedInstallmentsItems(
            selectedValues.map((value) => ({
                ftI_ID: value.toString() // Store only the ftI_ID as a string
            }))
        );
    };

    return (
        <div className={`${fineslab}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Term' htmlFor='fmT_Id'>
                                Term Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='fmT_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                        value={field.value?.toString() || undefined}
                                        disabled={isEditMode}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Term' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {termsLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Terms...
                                                </SelectItem>
                                            ) : termsError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Terms
                                                </SelectItem>
                                            ) : (
                                                terms?.data?.map((item) => (
                                                    <SelectItem key={item.fmT_Id} value={item.fmT_Id.toString()}>
                                                        {item.fmT_Name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.fmT_Id && <FormError>{errors.fmT_Id.message}</FormError>}
                        </div>

                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Heads' htmlFor='fmH_Id'>
                                Fees Head <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            {/* <Controller
                                name='heads'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            masterHeads?.data?.map((data) => ({
                                                label: data.fmH_FeeName || '',
                                                value: data.fmH_Id.toString()
                                            })) ?? []
                                        }
                                        onValueChange={(selectedValues) => {
                                            field.onChange(selectedValues);
                                            handleHeadSelection(selectedValues);
                                        }}
                                        defaultValue={selectedHeadsItems.map((data) =>
                                            data.fmH_Id !== undefined ? data.fmH_Id.toString() : ''
                                        )}
                                        value={selectedHeadsItems.map((data) => (data.fmH_Id !== undefined ? data.fmH_Id.toString() : ''))}
                                        placeholder='Select Heads'
                                        variant='inverted'
                                        disabled={masterHeadsLoading}
                                    />
                                )}
                            /> */}

                            <Controller
                                name='heads'
                                control={control}
                                render={({ field }) => {
                                    const selectedValue = field.value?.[0] || ''; // Only 1 selected (single-select)

                                    return (
                                        <Popover open={isHeadPopoverOpen} onOpenChange={setIsHeadPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    onClick={() => setIsHeadPopoverOpen(!isHeadPopoverOpen)}
                                                    className={cn(
                                                        'w-full justify-between',
                                                        errors.heads ? 'border-red-500' : 'border-primary/30'
                                                    )}>
                                                    <span className='truncate'>
                                                        {masterHeads?.data?.find((h) => h.fmH_Id.toString() === selectedValue)
                                                            ?.fmH_FeeName || 'Select Fee Head'}
                                                    </span>
                                                    <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className='w-[260px] p-2 sm:w-[300px]'>
                                                {/* Search */}
                                                <div className='relative mb-2'>
                                                    <Search className='absolute top-2.5 left-2 h-4 w-4 text-gray-400' />
                                                    <InputText
                                                        placeholder='Search heads...'
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        className='h-8 pl-8 text-sm'
                                                    />
                                                </div>

                                                {/* List */}
                                                <div className='max-h-[260px] overflow-y-auto rounded-md border p-1'>
                                                    {masterHeads?.data
                                                        ?.filter((h) => h.fmH_FeeName.toLowerCase().includes(search.toLowerCase()))
                                                        .map((h) => {
                                                            const isSelected = selectedValue === h.fmH_Id.toString();

                                                            return (
                                                                <div
                                                                    key={h.fmH_Id}
                                                                    onClick={() => {
                                                                        field.onChange([h.fmH_Id.toString()]);

                                                                        setSelectedHeadsItems([{ fmH_Id: h.fmH_Id.toString() }]);

                                                                        //setIsHeadPopoverOpen(false);
                                                                    }}
                                                                    className={cn(
                                                                        'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm',
                                                                        isSelected
                                                                            ? 'border-primary bg-primary/5'
                                                                            : 'border-gray-200 hover:border-primary/40'
                                                                    )}>
                                                                    {isSelected ? (
                                                                        <CheckSquare className='h-4 w-4 text-primary' />
                                                                    ) : (
                                                                        <Square className='h-4 w-4 text-gray-400' />
                                                                    )}
                                                                    <span>{h.fmH_FeeName}</span>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    );
                                }}
                            />
                        </div>

                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Installments' htmlFor='ftI_Id'>
                                Installment Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            {/* <Controller
                                name='installments'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            masterInstallment?.data?.map((data) => ({
                                                label: data.ftI_NAME || '',
                                                value: data.ftI_ID.toString()
                                            })) ?? []
                                        }
                                        onValueChange={(selectedValues) => {
                                            field.onChange(selectedValues);
                                            handleInstallmentSelection(selectedValues);
                                        }}
                                        defaultValue={SelectedInstallmentsItems.map((data) =>
                                            data.ftI_ID !== undefined ? data.ftI_ID.toString() : ''
                                        )}
                                        value={SelectedInstallmentsItems.map((data) =>
                                            data.ftI_ID !== undefined ? data.ftI_ID.toString() : ''
                                        )}
                                        placeholder='Select Installments'
                                        variant='inverted'
                                        disabled={masterInstallmentLoading}
                                    />
                                )}
                            /> */}

                            <Controller
                                name='installments'
                                control={control}
                                render={({ field }) => {
                                    const selectedValue = field.value?.[0] || '';

                                    return (
                                        <Popover open={isInstallPopoverOpen} onOpenChange={setIsInstallPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    onClick={() => setIsInstallPopoverOpen(!isInstallPopoverOpen)}
                                                    className={cn(
                                                        'w-full justify-between',
                                                        errors.heads ? 'border-red-500' : 'border-primary/30'
                                                    )}>
                                                    <span className='truncate'>
                                                        {masterInstallment?.data?.find((h) => h.ftI_ID.toString() === selectedValue)
                                                            ?.ftI_NAME || 'Select Fee Installments'}
                                                    </span>
                                                    <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className='w-[260px] p-2 sm:w-[300px]'>
                                                <div className='relative mb-2'>
                                                    <Search className='absolute top-2.5 left-2 h-4 w-4 text-gray-400' />
                                                    <InputText
                                                        placeholder='Search Installments...'
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        className='h-8 pl-8 text-sm'
                                                    />
                                                </div>

                                                <div className='max-h-[260px] overflow-y-auto rounded-md border p-1'>
                                                    {masterInstallment?.data
                                                        ?.filter((h) => h.ftI_NAME.toLowerCase().includes(search.toLowerCase()))
                                                        .map((h) => {
                                                            const isSelected = selectedValue === h.ftI_ID.toString();

                                                            return (
                                                                <div
                                                                    key={h.ftI_ID}
                                                                    onClick={() => {
                                                                        field.onChange([h.ftI_ID.toString()]);

                                                                        setSelectedInstallmentsItems([{ ftI_ID: h.ftI_ID.toString() }]);

                                                                        // setIsPopoverOpen(false);
                                                                    }}
                                                                    className={cn(
                                                                        'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm',
                                                                        isSelected
                                                                            ? 'border-primary bg-primary/5'
                                                                            : 'border-gray-200 hover:border-primary/40'
                                                                    )}>
                                                                    {isSelected ? (
                                                                        <CheckSquare className='h-4 w-4 text-primary' />
                                                                    ) : (
                                                                        <Square className='h-4 w-4 text-gray-400' />
                                                                    )}
                                                                    <span>{h.ftI_NAME}</span>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    );
                                }}
                            />
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
                            Update
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
