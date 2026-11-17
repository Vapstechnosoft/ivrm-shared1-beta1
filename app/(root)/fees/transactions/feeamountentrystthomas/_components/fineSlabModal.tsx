import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFineslabDetails } from '@/server/fees/trasactions/feeAmountEntry';
import type { IAmountEntryFineSlabDetails } from '@/types/fees/transactions/transactions';
import { format } from 'date-fns';
import { CalendarIcon, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface FineSlabModalProps {
    isOpen: boolean;
    onClose: () => void;
    headId: number;
    installmentId: number;
    feeGroupId: number;
    categoryId: number;
    academicYearId: number;
    selectionType: string;
    onSave: (regularSlabs: FineSlab[], ecsSlabs: FineSlab[]) => void;
    existingRegularSlabs?: FineSlab[];
    existingEcsSlabs?: FineSlab[];
    selectedInstallment: string;
}

interface RowData {
    id: number | string;
    date: Date | null;
    type: string;
    amount: string;
}

export default function FineSlabModal({
    isOpen,
    onClose,
    headId,
    installmentId,
    feeGroupId,
    categoryId,
    academicYearId,
    selectionType,
    onSave,
    existingRegularSlabs = [],
    existingEcsSlabs = [],
    selectedInstallment
}: FineSlabModalProps) {
    const [showRegularSlab, setShowRegularSlab] = useState(false);
    const [showEcsSlab, setShowEcsSlab] = useState(false);
    const [regularSlabs, setRegularSlabs] = useState<FineSlab[]>([]);
    const [ecsSlabs, setEcsSlabs] = useState<FineSlab[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRegular, setSelectedRegular] = useState<number[]>([]);
    const [selectedEcs, setSelectedEcs] = useState<number[]>([]);
    const [validationError, setValidationError] = useState<string>('');
    const [todaysDate, setTodaysDate] = useState<Date | undefined>(new Date());
    const fineTypeOptions = [
        { value: 'Per Day', label: 'Per Day' },
        { value: 'Day Slab', label: 'Day Slab' }
    ];

    const [selectedType, setSelectedType] = useState<string>('');

    useEffect(() => {
        if (isOpen && headId && installmentId) {
            fetchFineSlabs();
        }
    }, [isOpen, headId, installmentId]);

    // Initialize with existing selected slabs - DON'T auto-check checkboxes
    useEffect(() => {
        if (existingRegularSlabs.length > 0) {
            const regularIds = existingRegularSlabs.map((slab) => slab.fmfS_Id);
            setSelectedRegular(regularIds);
        }

        if (existingEcsSlabs.length > 0) {
            const ecsIds = existingEcsSlabs.map((slab) => slab.fmfS_Id);
            setSelectedEcs(ecsIds);
        }
    }, [existingRegularSlabs, existingEcsSlabs]);

    const fetchFineSlabs = async () => {
        setLoading(true);
        try {
            // Call API based on selection type
            let response: IAmountEntryFineSlabDetails;
            if (selectionType === 'stud') {
                // For students, fetch both regular and ECS slabs
                response = (await getFineslabDetails('R', 'E')) as unknown as IAmountEntryFineSlabDetails;
            } else {
                // For non-students (stfoth, stfothamt), fetch only regular slabs
                response = (await getFineslabDetails('R')) as unknown as IAmountEntryFineSlabDetails;
            }

            if (response?.data) {
                // Transform API response to match your interface
                const regularData: FineSlab[] = response.data.fillslab.map((slab) => ({
                    fmfS_Id: slab.fmfS_Id,
                    fmfS_FineType: slab.fmfS_FineType,
                    fmfS_FromDay: slab.fmfS_FromDay,
                    fmfS_ToDay: slab.fmfS_ToDay,
                    fmfS_ECSFlag: slab.fmfS_ECSFlag,
                    isSelected: false, // Don't auto-select
                    FTFS_FineType: '',
                    ftfS_Amount: ''
                }));

                const ecsData: FineSlab[] = response.data.fillslabecs.map((slab) => ({
                    fmfS_Id: slab.fmfS_Id,
                    fmfS_FineType: slab.fmfS_FineType,
                    fmfS_FromDay: slab.fmfS_FromDay,
                    fmfS_ToDay: slab.fmfS_ToDay,
                    fmfS_ECSFlag: slab.fmfS_ECSFlag,
                    isSelected: false, // Don't auto-select
                    FTFSE_FineType: '',
                    ftfsE_Amount: ''
                }));

                setRegularSlabs(regularData);
                setEcsSlabs(ecsData);

                // DON'T auto-show sections - let user decide
                setShowRegularSlab(false);
                setShowEcsSlab(false);

                // Only pre-fill data if we have existing slabs
                if (existingRegularSlabs.length > 0) {
                    const updatedRegular = regularData.map((slab) => {
                        const existing = existingRegularSlabs.find((existing) => existing.fmfS_Id === slab.fmfS_Id);
                        if (existing) {
                            return {
                                ...slab,
                                FTFS_FineType: existing.FTFS_FineType || '',
                                ftfS_Amount: existing.ftfS_Amount || '',
                                isSelected: true
                            };
                        }
                        return slab;
                    });
                    setRegularSlabs(updatedRegular);
                    setShowRegularSlab(true);
                }

                if (existingEcsSlabs.length > 0 && selectionType === 'stud') {
                    const updatedEcs = ecsData.map((slab) => {
                        const existing = existingEcsSlabs.find((existing) => existing.fmfS_Id === slab.fmfS_Id);
                        if (existing) {
                            return {
                                ...slab,
                                FTFSE_FineType: existing.FTFSE_FineType || '',
                                ftfsE_Amount: existing.ftfsE_Amount || '',
                                isSelected: true
                            };
                        }
                        return slab;
                    });
                    setEcsSlabs(updatedEcs);
                    setShowEcsSlab(true);
                }

                // Update selected arrays only if we have existing data
                setSelectedRegular(existingRegularSlabs.map((slab) => slab.fmfS_Id));
                setSelectedEcs(existingEcsSlabs.map((slab) => slab.fmfS_Id));
            }
        } catch (error) {
            console.error('Error fetching fine slabs:', error);
            // Handle error state if needed
        } finally {
            setLoading(false);
        }
    };

    const handleRegularCheckboxChange = (slabId: number) => {
        setSelectedRegular((prev) => {
            if (prev.includes(slabId)) {
                return prev.filter((id) => id !== slabId);
            }
            return [...prev, slabId];
        });
    };

    const handleEcsCheckboxChange = (slabId: number) => {
        setSelectedEcs((prev) => {
            if (prev.includes(slabId)) {
                return prev.filter((id) => id !== slabId);
            }
            return [...prev, slabId];
        });
    };

    const handleFineTypeChange = (index: number, value: string, isEcs = false) => {
        setValidationError('');
        if (isEcs) {
            const updated = [...ecsSlabs];
            updated[index].FTFSE_FineType = value;
            setEcsSlabs(updated);
        } else {
            const updated = [...regularSlabs];
            updated[index].FTFS_FineType = value;
            setRegularSlabs(updated);
        }
    };

    const handleAmountChange = (index: number, value: string, isEcs = false) => {
        setValidationError('');
        if (isEcs) {
            const updated = [...ecsSlabs];
            updated[index].ftfsE_Amount = value;
            setEcsSlabs(updated);
        } else {
            const updated = [...regularSlabs];
            updated[index].ftfS_Amount = value;
            setRegularSlabs(updated);
        }
    };

    const validateSelectedSlabs = () => {
        // Check regular slabs
        for (const slab of regularSlabs) {
            if (selectedRegular.includes(slab.fmfS_Id)) {
                if (!slab.FTFS_FineType || slab.FTFS_FineType.trim() === '') {
                    return `Please select Type for "${slab.fmfS_FineType}" in Regular Slab`;
                }
                if (!slab.ftfS_Amount || slab.ftfS_Amount.trim() === '' || Number.parseFloat(slab.ftfS_Amount) <= 0) {
                    return `Please enter valid Amount (> 0) for "${slab.fmfS_FineType}" in Regular Slab`;
                }
            }
        }

        // Check ECS slabs
        for (const slab of ecsSlabs) {
            if (selectedEcs.includes(slab.fmfS_Id)) {
                if (!slab.FTFSE_FineType || slab.FTFSE_FineType.trim() === '') {
                    return `Please select Type for "${slab.fmfS_FineType}" in ECS Slab`;
                }
                if (!slab.ftfsE_Amount || slab.ftfsE_Amount.trim() === '' || Number.parseFloat(slab.ftfsE_Amount) <= 0) {
                    return `Please enter valid Amount (> 0) for "${slab.fmfS_FineType}" in ECS Slab`;
                }
            }
        }

        return '';
    };

    const handleAddToCart = () => {
        // Validate that all selected rows have Type and Amount
        const error = validateSelectedSlabs();
        if (error) {
            setValidationError(error);
            return;
        }

        // Prepare selected slabs with additional info
        const selectedRegularSlabs = regularSlabs
            .filter((slab) => selectedRegular.includes(slab.fmfS_Id))
            .map((slab) => ({
                ...slab,
                isSelected: true,
                fmH_Id: headId,
                ftI_Id: installmentId,
                fmG_Id: feeGroupId,
                fmcC_Id: categoryId,
                asmaY_Id: academicYearId
            }));

        const selectedEcsSlabs = ecsSlabs
            .filter((slab) => selectedEcs.includes(slab.fmfS_Id))
            .map((slab) => ({
                ...slab,
                isSelected: true,
                fmH_Id: headId,
                ftI_Id: installmentId,
                fmG_Id: feeGroupId,
                fmcC_Id: categoryId,
                asmaY_Id: academicYearId
            }));

        // Call parent save function
        onSave(selectedRegularSlabs, selectedEcsSlabs);
        setValidationError('');
        onClose();
    };

    const handleCheckboxTypeChange = (type: 'regular' | 'ecs', checked: boolean) => {
        setValidationError('');
        if (type === 'regular') {
            setShowRegularSlab(checked);
            if (!checked) {
                setSelectedRegular([]);
            }
        } else {
            setShowEcsSlab(checked);
            if (!checked) {
                setSelectedEcs([]);
            }
        }
    };
    const [rows, setRows] = useState<RowData[]>([
        {
            id: 1,
            date: null,
            type: '',
            amount: ''
        }
    ]);
    const handleAddRow = () => {
        const newRow = {
            id: rows.length + 1,
            date: null,
            type: '',
            amount: ''
        };
        setRows([...rows, newRow]);
    };
    const handleRemoveRow = (id: any) => {
        if (rows.length > 1) {
            const updatedRows = rows.filter((row) => row.id !== id);
            const renumberedRows = updatedRows.map((row, index) => ({
                ...row,
                id: index + 1
            }));
            setRows(renumberedRows);
        }
    };

    const handleClose = () => {
        setRegularSlabs([]);
        setEcsSlabs([]);
        setSelectedRegular([]);
        setSelectedEcs([]);
        setShowRegularSlab(false);
        setShowEcsSlab(false);
        setValidationError('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='flex max-h-[80vh] max-w-4xl flex-col'>
                <DialogHeader>
                    <DialogTitle className='rounded-t-lg bg-primary p-4 text-white'>Fine Slab Details</DialogTitle>
                </DialogHeader>
                <div className='flex-1 overflow-y-auto rounded-lg border p-4'>
                    <div className='mt-6 w-full overflow-x-auto rounded-md border'>
                        <div className='p-4'>
                            Installment Name : <strong>{selectedInstallment}</strong>
                        </div>
                        <table className='min-w-full border-collapse text-sm'>
                            <thead>
                                <tr>
                                    <th className='border p-2'>SL No</th>
                                    <th className='border p-2'>From Date</th>
                                    <th className='border p-2'>Type</th>
                                    <th className='border p-2'>Amount</th>
                                    <th className='border p-2'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={row.id} className='border-t text-center'>
                                        <td className='border p-2'>{index + 1}</td>
                                        <td className='border p-2'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant='outline' className='w-full justify-start text-left font-normal'>
                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                        {row.date ? format(row.date, 'PPP') : 'Select Date'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0' align='start'>
                                                    <Calendar
                                                        mode='single'
                                                        selected={row.date ?? undefined}
                                                        onSelect={(date) => {
                                                            const updatedRows = [...rows];
                                                            updatedRows[index].date = date ?? null;
                                                            setRows(updatedRows);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </td>
                                        <td className='border p-2'>
                                            <Select
                                                value={row.type}
                                                onValueChange={(val) => {
                                                    const updatedRows = [...rows];
                                                    updatedRows[index].type = val;
                                                    setRows(updatedRows);
                                                }}>
                                                <SelectTrigger className='min-w-[400px] text-center'>
                                                    <SelectValue placeholder='--Select Type--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fineTypeOptions.map((item: any) => (
                                                        <SelectItem key={item.value} value={item.value.toString()}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className='border p-2'>
                                            <input
                                                type='number'
                                                value={row.amount}
                                                onChange={(e) => {
                                                    const updatedRows = [...rows];
                                                    updatedRows[index].amount = e.target.value;
                                                    setRows(updatedRows);
                                                }}
                                                className='w-full rounded border px-2 py-1 text-center'
                                                placeholder='Enter amount'
                                            />
                                        </td>
                                        <td className='border p-2'>
                                            <div className='flex flex-col-2 items-center justify-center gap-1'>
                                                {rows.length === 1 && index === 0 ? (
                                                    <Plus
                                                        className='mt-1 h-4 w-4 cursor-pointer text-gray-500 hover:text-primary'
                                                        onClick={() => handleAddRow()}
                                                    />
                                                ) : index === rows.length - 1 ? (
                                                    <>
                                                        <Minus
                                                            className='mt-1 h-4 w-4 cursor-pointer text-gray-500 hover:text-red-500'
                                                            onClick={() => handleRemoveRow(row.id)}
                                                        />
                                                        <Plus
                                                            className='mt-1 h-4 w-4 cursor-pointer text-gray-500 hover:text-primary'
                                                            onClick={() => handleAddRow()}
                                                        />
                                                    </>
                                                ) : (
                                                    <Minus
                                                        className='mt-1 h-4 w-4 cursor-pointer text-gray-500 hover:text-red-500'
                                                        onClick={() => handleRemoveRow(row.id)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <DialogFooter className='px-6 pb-6'>
                    <Button variant='outline' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddToCart} className='gap-2'>
                        <Plus className='h-4 w-4' />
                        Add to Cart
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
