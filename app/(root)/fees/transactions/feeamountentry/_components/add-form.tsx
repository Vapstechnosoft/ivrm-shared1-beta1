import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeAmountEntry, useacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { amountEntrySchema } from '@/schemas/fees/trasactions';
import {
    addOrUpdateAmountEntry,
    getAmountentrydetails,
    getCategorydrodowndata,
    getgroupdrodown
} from '@/server/fees/trasactions/feeAmountEntry';
import type { IFeeClassCategoryDropDownList, IFeeGroupDropDownList } from '@/types/fees/transactions/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import FineSlabModal from './fineSlabModal';

// 🔹 Form type from Zod schema
type FormFields = z.infer<typeof amountEntrySchema.addOrUpdate>;

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

export default function AddAmountEntryForm({ onSuccess, headname = '' }: AddAmountEntryProps) {
    const { refetchAll } = useFeeAmountEntry();

    // 🔹 State for dropdown data
    const [categoryData, setCategoryData] = useState<IFeeClassCategoryDropDownList[]>([]);
    const [groupData, setGroupData] = useState<IFeeGroupDropDownList[]>([]);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [loadingGroup, setLoadingGroup] = useState(false);

    // 🔹 Selected values
    const [selectedFeeGroup, setSelectedFeeGroup] = useState<number | null>(null);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [feeGridData, setFeeGridData] = useState<any[]>([]);

    const [isFineSlabModalOpen, setIsFineSlabModalOpen] = useState(false);
    const [currentHeadId, setCurrentHeadId] = useState<number | null>(null);
    const [currentInstallmentId, setCurrentInstallmentId] = useState<number | null>(null);
    const [savedFineSlabs, setSavedFineSlabs] = useState<{
        [key: string]: { regular: FineSlab[]; ecs: FineSlab[] };
    }>({});

    // 🔹 Academic Year Dropdown (hook)
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useacademicyerdropdowndatafee();

    // 🔹 React Hook Form setup
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(amountEntrySchema.addOrUpdate),
        mode: 'onChange'
    });

    // 🔹 Fetch Category & Group when Academic Year changes
    useEffect(() => {
        const fetchDropdowns = async () => {
            if (!selectedAcademicYear) {
                setCategoryData([]);
                setGroupData([]);
                return;
            }

            try {
                setLoadingCategory(true);
                setLoadingGroup(true);

                const [categoryRes, groupRes] = await Promise.all([
                    getCategorydrodowndata(selectedAcademicYear),
                    getgroupdrodown(selectedAcademicYear)
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

    // 🔹 Fetch Fee Amount Details when all three are selected
    useEffect(() => {
        const fetchFeeAmountDetails = async () => {
            if (selectedAcademicYear && selectedCategoryId && selectedFeeGroup) {
                try {
                    const loadingToast = toast.loading('Fetching fee amount details...');

                    const response = await getAmountentrydetails(selectedAcademicYear, selectedCategoryId, selectedFeeGroup);

                    console.log('Fee Amount Details Response:', JSON.stringify(response)); // Add this line to log the response

                    if (response?.data) {
                        const details = Array.isArray(response.data) ? response.data : [response.data];
                        setFeeGridData(details);

                        toast.success('Fee amount details loaded successfully', {
                            id: loadingToast
                        });
                    } else {
                        setFeeGridData([]);
                    }
                } catch (error) {
                    console.error('Error fetching fee amount details:', error);
                    toast.error('Failed to fetch fee amount entry details');
                    setFeeGridData([]);
                }
            } else {
                setFeeGridData([]);
            }
        };

        fetchFeeAmountDetails();
    }, [selectedAcademicYear, selectedCategoryId, selectedFeeGroup]);

    // 🔹 Update Fee Grid Data when any input changes
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

            // Only save if there are selected slabs
            if (regularSlabs.length > 0 || ecsSlabs.length > 0) {
                setSavedFineSlabs((prev) => ({
                    ...prev,
                    [key]: { regular: regularSlabs, ecs: ecsSlabs }
                }));

                // Update the corresponding row's fine flag
                const rowIndex = feeGridData.findIndex((row) => row.fmH_Id === currentHeadId && row.ftI_Id === currentInstallmentId);
                if (rowIndex !== -1) {
                    handleGridChange(rowIndex, 'fyghM_FineApplicableFlag', 'Y');
                }
            } else {
                // If no slabs selected, uncheck the checkbox
                const rowIndex = feeGridData.findIndex((row) => row.fmH_Id === currentHeadId && row.ftI_Id === currentInstallmentId);
                if (rowIndex !== -1) {
                    handleGridChange(rowIndex, 'fyghM_FineApplicableFlag', 'N');
                }
            }

            // Close modal
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

    const prepareFineSlabsForAPI = () => {
        const savefineslabreg: any[] = [];
        const savefineslabecs: any[] = [];

        // Collect all saved fine slabs
        Object.values(savedFineSlabs).forEach(({ regular, ecs }) => {
            // Add regular slabs
            regular.forEach((slab) => {
                savefineslabreg.push({
                    fmfS_Id: slab.fmfS_Id,
                    ftfS_Amount: slab.ftfS_Amount || '0',
                    FTFS_FineType: slab.FTFS_FineType || '',
                    fmH_Id: slab.fmH_Id,
                    ftI_Id: slab.ftI_Id,
                    // fmG_Id: slab.fmG_Id,
                    // fmcC_Id: slab.fmcC_Id,
                    // asmaY_Id: slab.asmaY_Id,
                    // Add any other required fields
                    fmfS_FineType: slab.fmfS_FineType,
                    fmfS_FromDay: slab.fmfS_FromDay,
                    fmfS_ToDay: slab.fmfS_ToDay,
                    fmfS_ECSFlag: slab.fmfS_ECSFlag
                });
            });

            // Add ECS slabs
            ecs.forEach((slab) => {
                savefineslabecs.push({
                    fmfS_Id: slab.fmfS_Id,
                    ftfsE_Amount: slab.ftfsE_Amount || '0',
                    FTFSE_FineType: slab.FTFSE_FineType || '',
                    fmH_Id: slab.fmH_Id,
                    ftI_Id: slab.ftI_Id,
                    // fmG_Id: slab.fmG_Id,
                    // fmcC_Id: slab.fmcC_Id,
                    // asmaY_Id: slab.asmaY_Id,
                    // Add any other required fields
                    fmfS_FineType: slab.fmfS_FineType,
                    fmfS_FromDay: slab.fmfS_FromDay,
                    fmfS_ToDay: slab.fmfS_ToDay,
                    fmfS_ECSFlag: slab.fmfS_ECSFlag
                });
            });
        });

        return { savefineslabreg, savefineslabecs };
    };
    // 🔹 Submit Handler
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const invalidRows = feeGridData.filter((item) => !item.fmA_Amount || Number(item.fmA_Amount) <= 0);

        if (invalidRows.length > 0) {
            toast.error('Amount Is Required');
            return;
        }

        try {
            const { savefineslabreg, savefineslabecs } = prepareFineSlabsForAPI();
            const payload = {
                // mI_Id: 30,
                asmaY_Id: data.asmaY_Id,
                fmcC_Id: data.categoryId,
                fmG_Id: data.feeGroupId,
                savetmpdata: feeGridData.map((item) => ({
                    fmA_Id: item.fmA_Id,
                    // mI_Id: 30,
                    fmG_Id: item.fmG_Id,
                    asmaY_Id: data.asmaY_Id,
                    fmcC_Id: data.categoryId,
                    ftI_Id: item.ftI_Id,
                    fmA_Amount: item.fmA_Amount,
                    fmA_Flag: item.fmA_Flag,
                    ftdD_Month: item.ftdD_Month,
                    ftdD_Day: item.ftdD_Day,
                    ftddE_Month: item.ftddE_Month,
                    ftddE_Day: item.ftdD_Day,
                    fmH_Id: item.fmH_Id,
                    fyghM_FineApplicableFlag: item.fyghM_FineApplicableFlag,
                    fmA_PartialRebateApplicableDate: item.fmA_PartialRebateApplicableDate,
                    fmA_DueDate: item.fmA_DueDate,
                    ftddE_DueDate: item.ftddE_DueDate
                })),
                savefineslabreg: savefineslabreg.length > 0 ? savefineslabreg : [],
                savefineslabecs: savefineslabecs.length > 0 ? savefineslabecs : []
            };

            const js = JSON.stringify(payload);
            console.log('Payload JSON:', js);

            const response = await addOrUpdateAmountEntry(payload);
            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset({
            asmaY_Id: undefined,
            categoryId: undefined,
            feeGroupId: undefined
        });
        setSelectedFeeGroup(null);
        setSelectedCategoryId(null);
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
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedCategoryId(id);
                                    }}
                                    //value={field.value ? String(field.value) : undefined}
                                    value={field.value?.toString() || ''}
                                    disabled={loadingCategory || !selectedAcademicYear}>
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Category--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingCategory ? (
                                            <SelectItem value='loading' disabled>
                                                Loading categories...
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
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedFeeGroup(id);
                                    }}
                                    //value={field.value ? String(field.value) : undefined}
                                    value={field.value?.toString() || ''}
                                    disabled={loadingGroup || !selectedAcademicYear}>
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Fee Group--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingGroup ? (
                                            <SelectItem value='loading' disabled>
                                                Loading groups...
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
                    <div className='mt-6 w-full overflow-x-auto rounded-md border'>
                        <table className='min-w-full border-collapse text-sm'>
                            <thead>
                                <tr>
                                    <th>SL No</th>
                                    <th>Fee Head</th>
                                    <th>Installment</th>
                                    <th>Amount</th>
                                    <th>Due Date</th>
                                    <th>Rebate Date</th>
                                    <th>Fine Slab</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeGridData.map((row, index) => (
                                    <tr key={index} className='border-t text-center'>
                                        <td>{index + 1}</td>
                                        <td>{row.fmH_FeeName}</td>
                                        <td>{row.fmI_Name}</td>
                                        {/* <td>
                      <InputText
                        type="number"
                        value={row.fmA_Amount}
                        onChange={(e) =>
                          handleGridChange(index, "fmA_Amount", e.target.value)
                        }
                      />
                    </td> */}

                                        <td>
                                            <InputText
                                                type='text'
                                                inputMode='numeric' // brings up number keyboard on mobile
                                                value={row.fmA_Amount && Number(row.fmA_Amount) !== 0 ? row.fmA_Amount : ''} // 👈 Convert 0 → ''
                                                onChange={(e) => {
                                                    const value = e.target.value.trim();

                                                    // Allow empty (for editing)
                                                    if (value === '') {
                                                        handleGridChange(index, 'fmA_Amount', '');
                                                        return;
                                                    }

                                                    // ✅ Accept only digits (no letters, symbols, or negatives)
                                                    if (/^\d+$/.test(value)) {
                                                        // ❌ If value is "0" or starts with "0" (like "01"), clear it
                                                        if (Number(value) === 0) {
                                                            handleGridChange(index, 'fmA_Amount', '');
                                                        } else {
                                                            handleGridChange(index, 'fmA_Amount', value);
                                                        }
                                                    }
                                                    // ❌ Ignore anything else
                                                }}
                                            />
                                        </td>

                                        {/* <td>
                                            <input
                                                type='date'
                                                value={row.fmA_DueDate?.split('T')[0] || ''}
                                                onChange={(e) => handleGridChange(index, 'fmA_DueDate', e.target.value)}
                                                className='rounded border px-2 py-1'
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='date'
                                                value={row.fmA_PartialRebateApplicableDate?.split('T')[0] || ''}
                                                onChange={(e) => handleGridChange(index, 'fmA_PartialRebateApplicableDate', e.target.value)}
                                                className='rounded border px-2 py-1'
                                            />
                                        </td> */}

                                        <td>
                                            {/* <input
                                                type='date'
                                                value={
                                                    row.fmA_DueDate && row.fmA_DueDate.split('T')[0] !== getTodayDateString()
                                                        ? row.fmA_DueDate.split('T')[0]
                                                        : ''
                                                }
                                                onChange={(e) => handleGridChange(index, 'fmA_DueDate', e.target.value || null)}
                                                className='rounded border px-2 py-1'
                                            /> */}
                                            <input
                                                type='date'
                                                value={row.fmA_DueDate ? row.fmA_DueDate.split('T')[0] : ''}
                                                onChange={(e) => handleGridChange(index, 'fmA_DueDate', e.target.value || null)}
                                                className='rounded border px-2 py-1'
                                            />
                                        </td>
                                        <td>
                                            {/* <input
                                                type='date'
                                                value={
                                                    row.fmA_PartialRebateApplicableDate &&
                                                    row.fmA_PartialRebateApplicableDate.split('T')[0] !== getTodayDateString()
                                                        ? row.fmA_PartialRebateApplicableDate.split('T')[0]
                                                        : ''
                                                }
                                                onChange={(e) =>
                                                    handleGridChange(index, 'fmA_PartialRebateApplicableDate', e.target.value || null)
                                                }
                                                className='rounded border px-2 py-1'
                                            /> */}

                                            <input
                                                type='date'
                                                value={
                                                    row.fmA_PartialRebateApplicableDate
                                                        ? row.fmA_PartialRebateApplicableDate.split('T')[0]
                                                        : ''
                                                }
                                                onChange={(e) =>
                                                    handleGridChange(index, 'fmA_PartialRebateApplicableDate', e.target.value || null)
                                                }
                                                className='rounded border px-2 py-1'
                                            />
                                        </td>

                                        {/* <td>
                                            <Checkbox
                                                checked={row.fyghM_FineApplicableFlag === true || row.fyghM_FineApplicableFlag === 'Y'}
                                                onChange={(e: any) => {
                                                    // Some Checkbox implementations call onChange with an event, others with a boolean.
                                                    // Normalize to a boolean checked value before converting to "Y"/"N".
                                                    const checked =
                                                        typeof e === 'boolean' ? e : (e?.target?.checked ?? (e as any)?.checked ?? false);
                                                    const newValue = checked ? 'Y' : 'N';

                                                    if (checked) {
                                                        // Open the modal when checkbox is checked
                                                        setCurrentHeadId(row.fmH_Id);
                                                        setCurrentInstallmentId(row.ftI_Id);
                                                        setIsFineSlabModalOpen(true);
                                                    } else {
                                                        // Just update the flag if unchecked
                                                        handleGridChange(index, 'fyghM_FineApplicableFlag', newValue);

                                                        // Clear saved fine slabs for this head/installment
                                                        const key = `${row.fmH_Id}-${row.ftI_Id}`;
                                                        setSavedFineSlabs(prev => {
                                                            const updated = { ...prev };
                                                            delete updated[key];
                                                            return updated;
                                                        });
                                                    }
                                                    // handleGridChange(index, 'fyghM_FineApplicableFlag', newValue);
                                                }}
                                            // disabled={
                                            //     row.fyghM_FineApplicableFlag === null ||
                                            //     row.fyghM_FineApplicableFlag === undefined ||
                                            //     row.fyghM_FineApplicableFlag === 'N'
                                            // }
                                            />
                                        </td> */}

                                        <td>
                                            <div className='flex items-center justify-center'>
                                                <Checkbox
                                                    checked={row.fyghM_FineApplicableFlag === true || row.fyghM_FineApplicableFlag === 'Y'}
                                                    onCheckedChange={async (checked: boolean) => {
                                                        // Handle the checkbox state change
                                                        if (checked) {
                                                            // Open the modal when checkbox is checked
                                                            setCurrentHeadId(row.fmH_Id);
                                                            setCurrentInstallmentId(row.ftI_Id);
                                                            setIsFineSlabModalOpen(true);

                                                            // Wait for modal to close to check if slabs were actually saved
                                                            // This is handled by the modal's onSave callback
                                                        } else {
                                                            // If unchecking, update the flag and clear saved slabs
                                                            handleGridChange(index, 'fyghM_FineApplicableFlag', 'N');

                                                            // Clear saved fine slabs for this head/installment
                                                            const key = `${row.fmH_Id}-${row.ftI_Id}`;
                                                            setSavedFineSlabs((prev) => {
                                                                const updated = { ...prev };
                                                                delete updated[key];
                                                                return updated;
                                                            });
                                                        }
                                                    }}
                                                    // disabled={
                                                    //     row.fyghM_FineApplicableFlag === null ||
                                                    //     row.fyghM_FineApplicableFlag === undefined ||
                                                    //     row.fyghM_FineApplicableFlag === 'N'
                                                    // }
                                                />
                                            </div>
                                        </td>

                                        {/* <td>
                      <Checkbox
                        checked={
                          row.fyghM_FineApplicableFlag === true ||
                          row.fyghM_FineApplicableFlag === "Y"
                        }
                        disabled={
                          row.fyghM_FineApplicableFlag === null ||
                          row.fyghM_FineApplicableFlag === undefined ||
                          row.fyghM_FineApplicableFlag === "N"
                        }
                      />
                    </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {isFineSlabModalOpen && currentHeadId && currentInstallmentId && (
                    <FineSlabModal
                        isOpen={isFineSlabModalOpen}
                        onClose={() => {
                            // If modal closes without saving (cancel), uncheck the checkbox
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
                        headId={currentHeadId}
                        installmentId={currentInstallmentId}
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
                    <Button type='submit' disabled={isSubmitting}>
                        <Save className='mr-2 h-4 w-4' /> Save Fee Amount Entry
                    </Button>
                </div>
            </form>
        </div>
    );
}
