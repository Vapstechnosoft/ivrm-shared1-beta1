import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeAmountEntry, useacademicyerdropofStThomas } from '@/hooks/fees/useTrasactions';
import { amountEntrySchemastThomas } from '@/schemas/fees/trasactions';
import {
    addOrUpdateAmountEntrystthomas,
    getAmountentrydetailsstthomas,
    getCategorydrodowndatastthomas,
    getgroupdrodownstthomas
} from '@/server/fees/trasactions/feeAmountEntryStThomas';
import type {
    IFeeClassCategoryDropDownList,
    IFeeGroupDropDownList,
    IMasterAmountEntryDetails,
    TAmountEntryStThomasInstallment
} from '@/types/fees/transactions/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import FineSlabModal from './fineSlabModal';

type FormFields = z.infer<typeof amountEntrySchemastThomas.addOrUpdate>;

interface AddAmountEntryProps {
    onSuccess?: () => void;
    headname?: string;
}

interface FineSlab {
    fmfS_Id: number;
    fmfS_FineType: string;
    fmfS_FromDay: number;
    fmfS_ToDay: number;
    fmfS_ECSFlag: string;
    ftfS_Id?: number;
    ftfS_Amount?: string;
    FTFS_FineType?: string;
    FTFSE_FineType?: string;
    ftfsE_Id?: number;
    ftfsE_Amount?: string;
    isSelected: boolean;
    fmH_Id?: number;
    ftI_Id?: number;
}

export default function AddAmountEntryFormStThomas({ onSuccess, headname = '' }: AddAmountEntryProps) {
    const { refetchAll } = useFeeAmountEntry();
    const [categoryData, setCategoryData] = useState<IFeeClassCategoryDropDownList[]>([]);
    const [groupData, setGroupData] = useState<IFeeGroupDropDownList[]>([]);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [loadingGroup, setLoadingGroup] = useState(false);
    const [selectedFeeGroup, setSelectedFeeGroup] = useState<number | null>(null);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [feeGridData, setFeeGridData] = useState<IMasterAmountEntryDetails[]>([]);
    const [feeInstallmentData, setFeeInstallmentData] = useState<TAmountEntryStThomasInstallment[]>([]);
    const [isFineSlabModalOpen, setIsFineSlabModalOpen] = useState(false);
    const [currentHeadId, setCurrentHeadId] = useState<number | null>(null);
    const [currentInstallmentId, setCurrentInstallmentId] = useState<number | null>(null);
    const [savedFineSlabs, setSavedFineSlabs] = useState<{
        [key: string]: { regular: FineSlab[]; ecs: FineSlab[] };
    }>({});

    const [installmentAmount, setInstallmentAmount] = useState<{
        [key: string]: string;
    }>({});

    const [selectedInstallment, setSelectedInstallment] = useState('');
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const [grandTotal, setGrandTotal] = useState(0);

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useacademicyerdropofStThomas();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(amountEntrySchemastThomas.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmaY_Id: undefined,
            feeGroupId: undefined,
            categoryId: undefined
        }
    });

    useEffect(() => {
        const fetchDropdowns = async () => {
            if (!selectedAcademicYear) {
                setSelectedCategoryId(null);
                setSelectedFeeGroup(null);
                setCategoryData([]);
                setGroupData([]);
                return;
            }

            try {
                setLoadingCategory(true);
                setLoadingGroup(true);

                const [categoryRes, groupRes] = await Promise.all([
                    getCategorydrodowndatastthomas(selectedAcademicYear),
                    getgroupdrodownstthomas(selectedAcademicYear)
                ]);

                const normalizedCategory = Array.isArray(categoryRes.data) ? categoryRes.data : categoryRes.data ? [categoryRes.data] : [];
                const normalizedGroup = Array.isArray(groupRes.data) ? groupRes.data : groupRes.data ? [groupRes.data] : [];

                setCategoryData(normalizedCategory);
                setGroupData(normalizedGroup);
            } catch (err) {
                console.error(err);
                toast.error('Error loading category/group data.');
            } finally {
                setLoadingCategory(false);
                setLoadingGroup(false);
            }
        };

        fetchDropdowns();
    }, [selectedAcademicYear]);

    useEffect(() => {
        const fetchFeeAmountDetails = async () => {
            if (selectedAcademicYear && selectedCategoryId && selectedFeeGroup) {
                const loadingToast = toast.loading('Fetching fee amount details...');
                try {
                    const response = await getAmountentrydetailsstthomas(selectedAcademicYear, selectedCategoryId, selectedFeeGroup);
                    if (response?.data) {
                        const headdetails = JSON.parse(JSON.stringify((response as any)?.data?.allgroupheaddata || []));
                        const installmentdetails = JSON.parse(JSON.stringify((response as any)?.data?.instllmentdetails || []));
                        setFeeGridData(headdetails);
                        setFeeInstallmentData(installmentdetails);

                        if (headdetails.length > 0) {
                            toast.success('Fee amount details loaded successfully', {
                                id: loadingToast
                            });
                        } else {
                            toast.warning('No Results Found!!', {
                                id: loadingToast
                            });
                        }
                    } else {
                        setFeeGridData([]);
                    }
                } catch (error) {
                    console.error('Error fetching fee amount details:', error);
                    toast.error('Failed to fetch fee amount entry details', {
                        id: loadingToast
                    });
                    setFeeGridData([]);
                }
            } else {
                setFeeGridData([]);
            }
        };

        fetchFeeAmountDetails();
    }, [selectedAcademicYear, selectedCategoryId, selectedFeeGroup]);

    const handleGridChange = (index: number, field: string, value: any) => {
        const updatedFeeGridData = [...feeGridData];
        updatedFeeGridData[index] = {
            ...updatedFeeGridData[index],
            [field]: value
        };
        setFeeGridData(updatedFeeGridData);
    };

    const handleSaveFineSlabs = (regularSlabs: FineSlab[], ecsSlabs: FineSlab[]) => {
        if (currentHeadId && currentInstallmentId) {
            const key = `${currentHeadId}-${currentInstallmentId}`;
            if (regularSlabs.length > 0 || ecsSlabs.length > 0) {
                setSavedFineSlabs((prev) => ({
                    ...prev,
                    [key]: { regular: regularSlabs, ecs: ecsSlabs }
                }));
                const rowIndex = feeGridData.findIndex((row) => row.fmH_Id === currentHeadId && row.ftI_Id === currentInstallmentId);
                if (rowIndex !== -1) {
                    handleGridChange(rowIndex, 'fyghM_FineApplicableFlag', 'Y');
                }
            } else {
                const rowIndex = feeGridData.findIndex((row) => row.fmH_Id === currentHeadId && row.ftI_Id === currentInstallmentId);
                if (rowIndex !== -1) {
                    handleGridChange(rowIndex, 'fyghM_FineApplicableFlag', 'N');
                }
            }
            setIsFineSlabModalOpen(false);
            setCurrentHeadId(null);
            setCurrentInstallmentId(null);
        }
    };

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const onSubmit = async () => {
        try {
            const hasEmptyAmounts = feeInstallmentData.some((installment) => {
                return feeGridData.some((row) => {
                    const cellKey = `${row.fmA_Id}-${installment.ftI_Id}`;
                    const amount = installmentAmount[cellKey];
                    return !amount || Number(amount) <= 0;
                });
            });

            if (hasEmptyAmounts) {
                toast.error('Please enter valid amounts for all fee heads');
                return;
            }

            const amountEntries = feeGridData.map((row) => {
                const cellKey = `${row.fmA_Id}-${row.ftI_Id}`;
                const amount = installmentAmount[cellKey] !== undefined ? installmentAmount[cellKey] : row.fmA_Amount || 0;

                const fineKey = `${row.fmH_Id}-${row.ftI_Id}`;
                const savedSlabs = savedFineSlabs[fineKey] || { regular: [], ecs: [] };

                const fineSlabDetails = [
                    ...savedSlabs.ecs.map((slab) => ({
                        fmH_Id: slab.fmH_Id || row.fmH_Id,
                        ftI_Id: slab.ftI_Id || row.ftI_Id,
                        ftfS_FineType: slab.FTFSE_FineType || slab.fmfS_FineType || 'ECS',
                        ftfS_Amount: slab.ftfsE_Amount || '0',
                        fmfS_Duedate: getTodayDateString(),
                        ftfS_ID: slab.ftfsE_Id || 0
                    }))
                ];

                return {
                    fmA_Id: row.fmA_Id || 0,
                    fmH_Id: row.fmH_Id,
                    ftI_Id: row.ftI_Id,
                    fmA_Amount: Number(amount),
                    fmA_DueDate: row.fmA_DueDate || getTodayDateString(),
                    ftddE_DueDate: row.ftddE_DueDate || getTodayDateString(),
                    fmA_PartialRebateApplicableDate: row.fmA_PartialRebateApplicableDate || getTodayDateString(),
                    fineSlabDetails: fineSlabDetails.length > 0 ? fineSlabDetails : []
                };
            });

            const payload = {
                asmaY_Id: selectedAcademicYear,
                fmG_Id: selectedFeeGroup,
                fmcC_Id: selectedCategoryId,
                fmA_Flag: 'A',
                amountEntries: amountEntries
            };

            console.log('Submitting payload:', payload); // For debugging

            const response = await addOrUpdateAmountEntrystthomas(payload);
            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to save fee amount entry');
            }
        } catch (error: any) {
            console.error('Error in onSubmit:', error);
            toast.error(error.message || 'An error occurred while saving');
        }
    };

    const handleReset = () => {
        reset({
            asmaY_Id: undefined,
            categoryId: undefined,
            feeGroupId: undefined
        });
        setSelectedAcademicYear(null);
        setSelectedCategoryId(null);
        setSelectedFeeGroup(null);
        setCategoryData([]);
        setGroupData([]);
        setFeeGridData([]);
    };

    return (
        <div className={`${headname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                {/* Academic Year */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        Academic Year:<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='asmaY_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedAcademicYear(id);
                                    }}
                                    value={field.value?.toString() || ''}
                                    // value={field.value ? String(field.value) || ''}
                                    disabled={academicYearLoading}
                                >
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Academic Year--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : academicYearError ? (
                                            <SelectItem value='error' disabled>
                                                Error loading
                                            </SelectItem>
                                        ) : (
                                            academicYear?.data?.map((item: any, index: number) => (
                                                <SelectItem key={`${item.asmaY_Id}-${index}`} value={item.asmaY_Id.toString()}>
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
                </div>

                {/* Category */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        Category:<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='categoryId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedCategoryId(id);
                                    }}
                                    //value={field.value ? String(field.value) : undefined}
                                    value={field.value?.toString() || ''}
                                    //   disabled={loadingCategory || !selectedAcademicYear}
                                >
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Category--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingCategory ? (
                                            <SelectItem value='loading' disabled>
                                                Loading categories...
                                            </SelectItem>
                                        ) : categoryData.length === 0 ? (
                                            <SelectItem value='nodata' disabled>
                                                No Results Found
                                            </SelectItem>
                                        ) : (
                                            categoryData.map((item, index) => (
                                                <SelectItem key={`${item.fmcC_Id}-${index}`} value={item.fmcC_Id.toString()}>
                                                    {item.fmcC_ClassCategoryName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.categoryId && <FormError>{errors.categoryId.message}</FormError>}
                    </div>
                </div>

                {/* Fee Group */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        Fee Group:<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='feeGroupId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedFeeGroup(id);
                                    }}
                                    //value={field.value ? String(field.value) : undefined}
                                    value={field.value?.toString() || ''}
                                    //   disabled={loadingGroup || !selectedAcademicYear}
                                >
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Fee Group--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingGroup ? (
                                            <SelectItem value='loading' disabled>
                                                Loading groups...
                                            </SelectItem>
                                        ) : groupData.length === 0 ? (
                                            <SelectItem value='nodata' disabled>
                                                No Results Found
                                            </SelectItem>
                                        ) : (
                                            groupData.map((item, index) => (
                                                <SelectItem key={`${item.fmG_Id}-${index}`} value={item.fmG_Id.toString()}>
                                                    {item.fmG_GroupName ?? `Group ${item.fmG_Id}`}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.feeGroupId && <FormError>{errors.feeGroupId.message}</FormError>}
                    </div>
                </div>

                {/* Fee Grid */}
                {feeGridData.length > 0 && (
                    <Card className='w-[90%] p-4'>
                        <div className='overflow-x-auto'>
                            <table className='w-full min-w-max border text-center text-sm'>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th className='border p-2'>SL No</th>
                                        <th className='border p-2'>Fee Head</th>

                                        {feeInstallmentData.map((installmentName) => (
                                            <th key={installmentName.ftI_Id} className='border p-2'>
                                                <div className='flex flex-col items-center justify-center gap-1'>
                                                    <span>{installmentName.ftI_Name}</span>
                                                    <Eye
                                                        className='mt-1 h-4 w-4 cursor-pointer text-gray-500 hover:text-primary'
                                                        onClick={() => {
                                                            setSelectedInstallment(installmentName.ftI_Name);
                                                            setIsFineSlabModalOpen(true);
                                                        }}
                                                    />
                                                </div>
                                            </th>
                                        ))}
                                        <th className='border p-2'>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeGridData.map((row, index) => {
                                        let numericAmount = 0;
                                        feeInstallmentData.forEach((install) => {
                                            const cellKey = `${row.fmA_Id}-${install.ftI_Id}`;
                                            const amount = installmentAmount[cellKey];
                                            numericAmount += Number.parseFloat(amount) || 0;
                                        });

                                        return (
                                            <tr key={`${row.fmA_Id}-${index}`} className='border-t text-center'>
                                                <td className='border p-2'>{index + 1}</td>
                                                <td className='border p-2'>{row.fmH_FeeName}</td>

                                                {feeInstallmentData.map((install) => {
                                                    const cellKey = `${row.fmA_Id}-${install.ftI_Id}`;
                                                    return (
                                                        <td key={`${row.fmA_Id}-${install.ftI_Id}`} className='border p-2'>
                                                            {
                                                                <input
                                                                    type='number'
                                                                    defaultValue={0}
                                                                    // value={
                                                                    //   0
                                                                    // }
                                                                    onChange={(e) => {
                                                                        const v = e.target.value;
                                                                        if (v === '') {
                                                                            setInstallmentAmount((prev) => ({
                                                                                ...prev,
                                                                                [cellKey]: ''
                                                                            }));
                                                                            return;
                                                                        }
                                                                        if (/^\d*\.?\d*$/.test(v)) {
                                                                            setInstallmentAmount((prev) => ({
                                                                                ...prev,
                                                                                [cellKey]: v
                                                                            }));
                                                                        }
                                                                    }}
                                                                    className='w-full rounded border px-2 py-1 font-semibold text-sm'
                                                                />
                                                            }
                                                        </td>
                                                    );
                                                })}

                                                <td className='border p-2 font-semibold'>₹{numericAmount.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}

                                    <tr className='bg-gray-100 font-bold'>
                                        <td className='p-2 text-center' colSpan={2}>
                                            Total
                                        </td>
                                        {feeInstallmentData.map((install, index) => {
                                            let installmentTotal = 0;
                                            feeGridData.forEach((row) => {
                                                const cellKey = `${row.fmA_Id}-${install.ftI_Id}`;
                                                const amount = installmentAmount[cellKey];
                                                installmentTotal += Number.parseFloat(amount) || 0;
                                            });

                                            return (
                                                <td key={`total-${index}`} className='p-2 text-center'>
                                                    ₹{installmentTotal.toFixed(2)}
                                                </td>
                                            );
                                        })}

                                        {/* Grand total */}
                                        <td className='p-2 text-center'>₹{grandTotal.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {isFineSlabModalOpen && (
                    <FineSlabModal
                        isOpen={isFineSlabModalOpen}
                        selectedInstallment={selectedInstallment}
                        onClose={() => {
                            const rowIndex = feeGridData.findIndex(
                                (row) => row.fmH_Id === currentHeadId && row.ftI_Id === currentInstallmentId
                            );
                            if (rowIndex !== -1) {
                                handleGridChange(rowIndex, 'fyghM_FineApplicableFlag', 'N');
                            }

                            setIsFineSlabModalOpen(false);
                            setCurrentHeadId(null);
                            setCurrentInstallmentId(null);
                        }}
                        headId={currentHeadId ?? 0}
                        installmentId={currentInstallmentId ?? 0}
                        feeGroupId={selectedFeeGroup!}
                        categoryId={selectedCategoryId!}
                        academicYearId={selectedAcademicYear!}
                        selectionType='stud'
                        onSave={handleSaveFineSlabs}
                        existingRegularSlabs={savedFineSlabs[`${currentHeadId}-${currentInstallmentId}`]?.regular || []}
                        existingEcsSlabs={savedFineSlabs[`${currentHeadId}-${currentInstallmentId}`]?.ecs || []}
                    />
                )}

                {/* Buttons */}
                <div className='flex gap-3 pt-4'>
                    <Button type='button' variant='outline' onClick={handleReset}>
                        Reset
                    </Button>
                    <Button type='submit' disabled={isSubmitting || feeGridData.length === 0}>
                        <Save className='mr-2 h-4 w-4' /> Save Fee Amount Entry
                    </Button>
                </div>
            </form>
        </div>
    );
}
