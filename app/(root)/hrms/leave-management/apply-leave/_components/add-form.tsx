import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeLeaveDetails, useSaveOnlineLeaveApplication, useSaveLeaveRequestDocument } from '@/hooks/hrms/leave-management/useOnlineLeaveApplication';
import { Check, Loader2, RotateCcw, X, Eye, FileUp } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import type { ApplyLeave } from './columns';
import { Checkbox } from '@/components/ui/checkbox';

interface AddApplyLeaveFormProps {
    onSuccess?: () => void;
    className?: string;
    defaultEmployee: {
        id?: number;
        name: string;
        designation: string;
        doj: string;
        email?: string;
        phone?: string;
    };
}

type LeaveGridItem = {
    selected: boolean;
    leaveId: number;
    leaveName: string;
    total: number;
    balance: number;
    id: number; // hrelS_Id
    fromDate: string;
    toDate: string;
    numDays: number;
    isHalfDay: boolean;
}

export default function AddApplyLeaveForm({ onSuccess, className = '', defaultEmployee }: AddApplyLeaveFormProps) {
    const { data: balanceData, isLoading: isBalanceLoading } = useEmployeeLeaveDetails();
    const { mutate: saveLeave, isPending: isSaving } = useSaveOnlineLeaveApplication();
    const { mutate: uploadDocument, isPending: isUploading } = useSaveLeaveRequestDocument();

    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<{
        reason: string;
        contactNumber: string;
        dateReportingBack: string;
        leaveGrid: LeaveGridItem[];
        file?: FileList;
    }>({
        mode: 'onChange',
        defaultValues: {
            reason: '',
            contactNumber: defaultEmployee.phone || '',
            dateReportingBack: '',
            leaveGrid: []
        }
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'leaveGrid'
    });

    // Initialize grid when balance data is loaded
    useEffect(() => {
        if (balanceData?.leaveBalances) {
            const gridItems: LeaveGridItem[] = balanceData.leaveBalances.map(lb => ({
                selected: false,
                leaveId: lb.leaveId,
                leaveName: lb.leaveName,
                total: lb.totalLeaves,
                balance: lb.balance,
                id: lb.id,
                fromDate: new Date().toISOString().split('T')[0],
                toDate: new Date().toISOString().split('T')[0],
                numDays: lb.balance > 0 ? 1 : 0,
                isHalfDay: false
            }));
            reset({
                ...watch(),
                leaveGrid: gridItems
            });
        }
    }, [balanceData, reset]);

    const leaveGrid = watch('leaveGrid');

    // Handle date/halfday changes to update numDays
    const handleRowChange = (index: number, field: keyof LeaveGridItem, value: any) => {
        const row = { ...leaveGrid[index], [field]: value };

        if (field === 'fromDate' || field === 'toDate' || field === 'isHalfDay' || field === 'selected') {
            const start = new Date(row.fromDate);
            const end = new Date(row.toDate);

            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                if (row.isHalfDay && diffDays > 0) {
                    diffDays -= 0.5;
                }
                row.numDays = diffDays;
            } else {
                row.numDays = 0;
            }

            // If reporting date is empty or less than toDate, update it
            if (row.selected) {
                const reportingDate = new Date(row.toDate);
                reportingDate.setDate(reportingDate.getDate() + 1);
                setValue('dateReportingBack', reportingDate.toISOString().split('T')[0]);
            }
        }

        // If multiple selection is not allowed by API/Logic, unselect others
        if (field === 'selected' && value === true) {
            leaveGrid.forEach((item, i) => {
                if (i !== index && item.selected) {
                    update(i, { ...item, selected: false });
                }
            });
        }

        update(index, row);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !defaultEmployee.id) return;

        const formData = new FormData();
        formData.append('file', file);

        uploadDocument({ hrmeId: defaultEmployee.id, formData }, {
            onSuccess: (response) => {
                if (response.success && response.data) {
                    setUploadedFileUrl(response.data);
                }
            }
        });
    };

    const onSubmit: SubmitHandler<any> = async (data) => {
        const selectedRows = data.leaveGrid.filter((row: LeaveGridItem) => row.selected);

        if (selectedRows.length === 0) {
            alert('Please select at least one leave type to apply.');
            return;
        }

        if (!data.reason?.trim()) {
            alert('Please enter a reason for leave.');
            return;
        }

        const apiRequest = {
            HRME_Id: defaultEmployee.id || 0,
            asmay_id: 129, // Academic year
            HRELAP_ApplicationID: null,
            HRELAP_LeaveReason: data.reason,
            HRELT_LeaveReason: data.reason,
            HRELT_Reportingdate: data.dateReportingBack ? new Date(data.dateReportingBack).toISOString() : new Date().toISOString(),
            HRELT_SupportingDocument: uploadedFileUrl || data.file?.[0]?.name || '',
            HRELAP_ContactNoOnLeave: Number(data.contactNumber),
            // As per AngularJS ref: temp_table_data is the selected rows
            temp_table_data: selectedRows.map((row: LeaveGridItem) => ({
                HRML_Id: row.leaveId,
                HRML_LeaveName: row.leaveName,
                HRELS_Id: row.id,
                HRELS_CBLeaves: row.balance,
                hrelaP_TotalDays: row.numDays // From original JS logic
            })),
            // frmToDates is the date array
            frmToDates: selectedRows.map((row: LeaveGridItem) => ({
                HRELAP_FromDate: new Date(row.fromDate).toISOString(),
                HRELAP_ToDate: new Date(row.toDate).toISOString(),
                HRELAP_TotalDays: row.numDays
            }))
        };

        saveLeave(apiRequest, {
            onSuccess: () => {
                handleReset();
                onSuccess?.();
            },
            onError: (err: any) => {
                alert(err.message || 'Failed to apply leave');
            }
        });
    };

    const handleReset = () => {
        reset({
            reason: '',
            contactNumber: defaultEmployee.phone || '',
            dateReportingBack: '',
            leaveGrid: fields.map(f => ({ ...f, selected: false, numDays: 1, isHalfDay: false }))
        });
        setUploadedFileUrl('');
        const fileInput = document.getElementById('leave-document-file') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className={`${className} bg-white rounded-xl shadow-sm border p-6`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>

                {/* Employee Leave Details Grid (Reference UI Box 2) */}
                <div className='space-y-4'>
                    <h3 className='text-lg font-bold text-primary border-b pb-2 flex items-center gap-2'>
                        <Check className='h-5 w-5' />
                        Employee Leave Details
                    </h3>

                    <div className='overflow-x-auto rounded-lg border bg-muted/5'>
                        <table className='w-full text-sm text-left border-collapse'>
                            <thead className='bg-primary/5 text-primary-foreground font-semibold'>
                                <tr className='bg-muted/50'>
                                    <th className='p-3 text-center border w-[50px]'>Select</th>
                                    <th className='p-3 text-center border w-[60px]'>Sl No</th>
                                    <th className='p-3 border'>Leave Type</th>
                                    <th className='p-3 text-center border'>Total</th>
                                    <th className='p-3 text-center border font-bold'>Balance</th>
                                    <th className='p-3 border min-w-[150px]'>From Date</th>
                                    <th className='p-3 border min-w-[150px]'>To Date</th>
                                    <th className='p-3 text-center border min-w-[120px]'>No. of Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field, index) => {
                                    const row = leaveGrid[index] || field;
                                    const isLowBalance = row.balance === 0;

                                    return (
                                        <tr key={field.id} className={`transition-colors border-b ${row.selected ? 'bg-primary/10' : 'hover:bg-muted/30'}`}>
                                            <td className='p-3 text-center border'>
                                                <Checkbox
                                                    checked={row.selected}
                                                    disabled={isLowBalance}
                                                    onCheckedChange={(val) => handleRowChange(index, 'selected', val)}
                                                />
                                            </td>
                                            <td className='p-3 text-center border font-medium'>{index + 1}</td>
                                            <td className='p-3 border font-semibold'>{row.leaveName}</td>
                                            <td className='p-3 text-center border text-muted-foreground'>{row.total}</td>
                                            <td className='p-3 text-center border font-bold text-blue-600'>{row.balance}</td>
                                            <td className='p-3 border'>
                                                <InputText
                                                    type='date'
                                                    disabled={!row.selected}
                                                    value={row.fromDate}
                                                    onChange={(e) => handleRowChange(index, 'fromDate', e.target.value)}
                                                    className='h-9 text-xs'
                                                />
                                            </td>
                                            <td className='p-3 border'>
                                                <InputText
                                                    type='date'
                                                    disabled={!row.selected}
                                                    value={row.toDate}
                                                    min={row.fromDate}
                                                    onChange={(e) => handleRowChange(index, 'toDate', e.target.value)}
                                                    className='h-9 text-xs'
                                                />
                                            </td>
                                            <td className='p-3 border'>
                                                <div className='flex items-center flex-col gap-1'>
                                                    <InputText
                                                        readOnly
                                                        value={row.numDays}
                                                        className='h-8 w-16 text-center bg-muted/50 font-bold text-xs'
                                                    />
                                                    <label className='flex items-center gap-1.5 cursor-pointer mt-1'>
                                                        <Checkbox
                                                            disabled={!row.selected}
                                                            checked={row.isHalfDay}
                                                            onCheckedChange={(val) => handleRowChange(index, 'isHalfDay', val)}
                                                        />
                                                        <span className='text-[10px] text-muted-foreground uppercase font-semibold'>Half Day</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {isBalanceLoading && (
                                    <tr>
                                        <td colSpan={8} className='p-8 text-center'>
                                            <Loader2 className='h-6 w-6 animate-spin mx-auto text-primary' />
                                            <p className='mt-2 text-muted-foreground'>Syncing your leave balances...</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Additional Details (Reason, Contact, Reporting Date) */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/5 p-6 rounded-xl border border-dashed'>
                    <div className='space-y-4'>
                        <InputTextarea
                            label='Reasons for Leave'
                            required
                            placeholder='Briefly explain why you need this leave...'
                            {...register('reason', { required: 'Reason is required' })}
                            error={errors.reason?.message}
                            rows={3}
                        />
                        <div className='flex items-center gap-4'>
                            <div className='flex-1'>
                                <label className='block text-sm font-medium mb-1.5'>Supporting Document</label>
                                <div className='flex items-center gap-2'>
                                    <input
                                        id='leave-document-file'
                                        type='file'
                                        className='hidden'
                                        onChange={handleFileChange}
                                        accept='image/*,.pdf,.doc,.docx'
                                    />
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => document.getElementById('leave-document-file')?.click()}
                                        className='flex-1 bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm transition-all'
                                        disabled={isUploading}
                                    >
                                        {isUploading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <FileUp className='mr-2 h-4 w-4' />}
                                        {uploadedFileUrl ? 'Change Document' : 'Upload File (Max 2MB)'}
                                    </Button>
                                    {uploadedFileUrl && (
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            title='Preview Document'
                                            onClick={() => window.open(uploadedFileUrl, '_blank')}
                                        >
                                            <Eye className='h-4 w-4 text-blue-600' />
                                        </Button>
                                    )}
                                </div>
                                <p className='text-[10px] text-muted-foreground mt-1'>PDF, JPEG, PNG, DOC (Max 2MB)</p>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <InputText
                            label='Contact Number While on Leave'
                            required
                            placeholder='Enter 10-digit mobile number'
                            {...register('contactNumber', {
                                required: 'Contact number is required',
                                pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid mobile number' }
                            })}
                            error={errors.contactNumber?.message}
                            maxLength={10}
                        />
                        <InputText
                            label='Date Reporting Back'
                            required
                            type='date'
                            {...register('dateReportingBack', { required: 'Reporting date is required' })}
                            error={errors.dateReportingBack?.message}
                        />
                    </div>
                </div>

                {/* Submit Actions */}
                <div className='flex items-center justify-end gap-3 pt-6 border-t'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={handleReset}
                        className='text-muted-foreground hover:text-destructive transition-colors'
                        disabled={isSaving || isSubmitting}
                    >
                        <RotateCcw className='mr-2 h-4 w-4' />
                        Reset Form
                    </Button>
                    <Button
                        type='button'
                        variant='secondary'
                        onClick={onSuccess}
                        disabled={isSaving || isSubmitting}
                    >
                        <X className='mr-2 h-4 w-4' />
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        size='sm'
                        variant='outline'
                        className='shadow-lg hover:shadow-xl transition-all'
                        disabled={isSaving || isSubmitting}
                    >
                        {isSaving || isSubmitting ? (
                            <>
                                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                Submitting Leave Request...
                            </>
                        ) : (
                            <>
                                <Check className='mr-2 h-5 w-5' />

                                Apply Leave Now
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
