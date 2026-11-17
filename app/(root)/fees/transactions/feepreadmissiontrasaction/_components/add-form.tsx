import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { feePreadmissionTransactionSchema } from '@/schemas/fees/trasactions';
import {
    addOrUpdatepaymentgatewaydetails,
    getPreadmissionStudentDropdownData,
    getPreadmissionStudentInformation,
    getPreadmissionStudentTermsData,
    getPreadmissionStudentTrasactionData
} from '@/server/fees/trasactions/feepreadmissiontrasaction';
import type {
    IFeePreAdmissionStudentInformation,
    IFeePreAdmissionStudentTermsDetails,
    IFeePreAdmissionStudentsDropDownList,
    IFeePreAdmissionTransactionDetails
} from '@/types/fees/transactions/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

// Form type from Zod schema
type FormFields = z.infer<typeof feePreadmissionTransactionSchema.addOrUpdate>;

interface AddFeePreAdmissionTransactionProps {
    onSuccess?: () => void;
    headname?: string;
}

type SelectableStudentTerm = IFeePreAdmissionStudentTermsDetails & {
    selected?: boolean;
};

export default function AddFeePreAdmissionTransactionForm({ onSuccess }: AddFeePreAdmissionTransactionProps) {
    const today = new Date().toISOString().split('T')[0];
    const { data: academicYeardata, isLoading: academicYearLoading, error: academicYearError } = useacademicyerdropdowndatafee();

    const [date, setDate] = useState(today); // Dynamic: today
    const [admissionType, setAdmissionType] = useState<'prospectus' | 'Preadmission'>('prospectus');
    const [termName, setTermName] = useState(false);
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<IFeePreAdmissionStudentsDropDownList | null>(null);
    const [studentInfo, setStudentInfo] = useState<IFeePreAdmissionStudentInformation | null>(null);
    const [selectedStudentTerms, setSelectedStudentTerms] = useState<SelectableStudentTerm[]>([]);
    const [loadingStudentTerms, setLoadingStudentTerms] = useState(false);
    const [loadingStudentInfo, setLoadingStudentInfo] = useState(false);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
    const [transactionData, setTransactionData] = useState<IFeePreAdmissionTransactionDetails[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [students, setStudents] = useState<IFeePreAdmissionStudentsDropDownList[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [paymentMode, setPaymentMode] = useState<string>('Cash');

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feePreadmissionTransactionSchema.addOrUpdate),
        mode: 'onChange'
    });

    const calculations = useMemo(() => {
        const selected = transactionData.filter((_, i) => selectedRows.includes(i));

        const totalFee = selected.reduce((sum, r) => sum + (r.totalCharges || 0), 0);
        const concession = selected.reduce((sum, r) => sum + (r.concessionAmount || 0), 0);
        const fine = selected.reduce((sum, r) => sum + (r.fineAmount || 0), 0);
        const nowPaying = selected.reduce((sum, r) => sum + (r.toBePaid || 0), 0);

        // Correct Remaining Balance = (Total + Fine - Concession) - Now Paying
        const remainingBalance = nowPaying;

        return {
            totalFee,
            concession,
            fine,
            nowPaying,
            remainingBalance: nowPaying > 0 ? remainingBalance : 0
        };
    }, [transactionData, selectedRows]);
    // Dynamic payment data
    const [paymentData, setPaymentData] = useState({
        narration: '',
        chequeDate: today,
        chequeNo: '',
        bankName: '',
        totalFee: calculations.totalFee,
        concession: calculations.concession,
        fine: calculations.fine,
        nowPaying: calculations.nowPaying,
        currentBalance: calculations.nowPaying
    });

    // Update payment summary when calculations change
    useEffect(() => {
        setPaymentData((prev) => ({
            ...prev,
            totalFee: calculations.totalFee,
            concession: calculations.concession,
            fine: calculations.fine,
            nowPaying: calculations.nowPaying,
            currentBalance: calculations.nowPaying
        }));
    }, [calculations]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPaymentData((prev) => ({ ...prev, [name]: value }));
    };

    const studentLabel = admissionType === 'prospectus' ? 'Prospectus No.' : 'Student Name';

    useEffect(() => {
        if (!studentSearch.trim()) {
            setStudents([]);
            return;
        }

        const fetchStudents = async () => {
            setLoadingStudents(true);
            try {
                const studentsArray = await getPreadmissionStudentDropdownData(studentSearch, admissionType, Number(selectedAcademicYear));
                setStudents(studentsArray || []);
            } catch (error) {
                console.error('Failed to fetch students:', error);
                setStudents([]);
            } finally {
                setLoadingStudents(false);
            }
        };

        fetchStudents();
    }, [studentSearch, admissionType]);

    useEffect(() => {
        setSelectedStudent(null);
        setStudents([]);
        setStudentInfo(null);
        setSelectedStudentTerms([]);
        setTransactionData([]);
        setSelectedRows([]);
    }, [admissionType]);

    useEffect(() => {
        if (!selectedStudent) {
            setSelectedStudentTerms([]);
            return;
        }

        const fetchStudentTerms = async () => {
            setLoadingStudentTerms(true);
            try {
                const information = await getPreadmissionStudentTermsData(Number(selectedStudent.amsT_Id));
                const mappedTerms = (information || []).map((term: IFeePreAdmissionStudentTermsDetails) => ({
                    ...term,
                    selected: false
                }));
                setSelectedStudentTerms(mappedTerms);
            } catch (error) {
                console.error('Failed to fetch student terms:', error);
                setSelectedStudentTerms([]);
            } finally {
                setLoadingStudentTerms(false);
            }
        };

        fetchStudentTerms();
    }, [selectedStudent]);

    useEffect(() => {
        if (!selectedStudent) {
            setStudentInfo(null);
            return;
        }

        const fetchStudentInfo = async () => {
            setLoadingStudentInfo(true);
            try {
                const information = await getPreadmissionStudentInformation(
                    selectedAcademicYear ?? 0, // asmay_Id – comes from selected academic year
                    Number(selectedStudent.amsT_Id), // studentId
                    admissionType
                );
                const info = Array.isArray(information) ? (information[0] ?? null) : information;
                setStudentInfo(info);
            } catch (error) {
                console.error('Failed to fetch student info:', error);
                setStudentInfo(null);
            } finally {
                setLoadingStudentInfo(false);
            }
        };

        fetchStudentInfo();
    }, [selectedStudent, selectedAcademicYear, admissionType]);

    useEffect(() => {
        const selectedTermIds = selectedStudentTerms.filter((t) => t.selected).map((t) => t.fmT_Id);

        if (!selectedStudent || selectedTermIds.length === 0) {
            setTransactionData([]);
            setSelectedRows([]);
            return;
        }
        const termgrpflag = 'T';

        const fetchTransactions = async () => {
            setLoadingTransactions(true);
            try {
                // CORRECTED: Pass both student ID and selected term IDs
                const res = await getPreadmissionStudentTrasactionData(
                    Number(selectedStudent.amsT_Id),
                    selectedTermIds,

                    admissionType,
                    termgrpflag
                    // if your API expects this too, otherwise remove
                );

                const initialized = (res || []).map((item) => ({
                    ...item,
                    toBePaid: item.toBePaid ?? item.totalCharges ?? 0
                }));

                setTransactionData(initialized);
                // Optionally auto-select all rows
                //setSelectedRows(initialized.map((_, i) => i));
            } catch (err) {
                console.error('Failed to fetch transactions', err);
                toast.error('Failed to load fee details');
                setTransactionData([]);
            } finally {
                setLoadingTransactions(false);
            }
        };

        fetchTransactions();
    }, [selectedStudentTerms, selectedStudent, admissionType]); // Add dependencies
    const handleRowSelect = (index: number) => {
        setSelectedRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedRows(transactionData.map((_, idx) => idx));
        } else {
            setSelectedRows([]);
        }
    };

    const handlePayableChange = (index: number, value: number) => {
        setTransactionData((prev) => prev.map((item, i) => (i === index ? { ...item, toBePaid: value } : item)));
    };

    const allSelected = selectedRows.length === transactionData.length && transactionData.length > 0;

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            if (selectedRows.length === 0) {
                toast.error('Please select at least one transaction row');
                return;
            }

            const selectedTransactions = transactionData.filter((_, idx) => selectedRows.includes(idx));

            const headInstallments = selectedTransactions.map((row) => ({
                FMG_Id: row.fmG_Id ?? 0,
                FMH_Id: row.fmH_Id ?? 0,
                FMA_Id: row.fmA_Id ?? 0,
                ToBePaid: row.toBePaid ?? 0,
                ConcessionAmount: row.concessionAmount ?? 0,
                FineAmount: row.fineAmount ?? 0
            }));

            const totalAmount = selectedTransactions.reduce((sum, r) => sum + (r.toBePaid ?? 0), 0);
            const totalConcession = selectedTransactions.reduce((sum, r) => sum + (r.concessionAmount ?? 0), 0);
            const totalFine = selectedTransactions.reduce((sum, r) => sum + (r.fineAmount ?? 0), 0);

            const payload = {
                asmaY_Id: data.asmaY_Id ?? selectedAcademicYear ?? 0,
                auto_receipt_flag: 1,
                automanualreceiptno: '',
                filterInitialData: admissionType,
                fyP_Bank_Name: paymentMode !== 'Cash' ? paymentData.bankName : '',
                fyP_Bank_Or_Cash: paymentMode,
                fyP_DD_Cheque_Date: paymentMode !== 'Cash' ? new Date(paymentData.chequeDate).toISOString() : new Date(date).toISOString(),
                fyP_DD_Cheque_No: paymentMode !== 'Cash' ? paymentData.chequeNo : '',
                fyP_Date: new Date(date).toISOString(),
                fyP_Remarks: paymentData.narration,
                fyP_Tot_Amount: totalAmount,
                fyP_Tot_Concession_Amt: totalConcession,
                fyP_Tot_Fine_Amt: totalFine,
                fyP_Tot_Waived_Amt: 0,
                grp_count: selectedTransactions.length,
                head_installments: headInstallments,
                // mI_Id: 30,
                pasR_Id: selectedStudent?.amsT_Id ?? 0
                // userId: 0
            };

            const loadingToast = toast.loading('Saving transaction...');
            await addOrUpdatepaymentgatewaydetails(payload);
            toast.dismiss(loadingToast);
            toast.success('Transaction saved successfully!');
            onSuccess?.();
        } catch (error: any) {
            const msg = error?.response?.data?.message ?? error?.message ?? 'Failed to save transaction';
            toast.error(msg);
            console.error('Submit error:', error);
        }
    };

    const handleReset = () => {
        reset();
        setSelectedRows([]);
        setPaymentData((prev) => ({ ...prev, narration: '', chequeNo: '', bankName: '' }));
    };

    return (
        <div className='mx-auto max-w-7xl p-2'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='flex gap-8'>
                    {/* First Column: Date + Radio */}
                    <div className='max-h-[400px] overflow-auto rounded border bg-gray-50 p-3 shadow-inner' style={{ width: '30%' }}>
                        <label htmlFor='dateInput' className='mr-4 whitespace-nowrap font-semibold'>
                            Date:
                        </label>
                        <input
                            id='dateInput'
                            type='date'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className='rounded border px-1 py-1'
                        />

                        <fieldset className='mt-4 flex space-x-6'>
                            <label className='inline-flex cursor-pointer items-center space-x-2'>
                                <input
                                    type='radio'
                                    name='admissionType'
                                    value='Prospectus'
                                    checked={admissionType === 'prospectus'}
                                    onChange={() => setAdmissionType('prospectus')}
                                    className='cursor-pointer'
                                />
                                <span>Prospectus</span>
                            </label>
                            <label className='inline-flex cursor-pointer items-center space-x-2'>
                                <input
                                    type='radio'
                                    name='admissionType'
                                    value='Preadmission'
                                    checked={admissionType === 'Preadmission'}
                                    onChange={() => setAdmissionType('Preadmission')}
                                    className='cursor-pointer'
                                />
                                <span>Preadmission</span>
                            </label>
                        </fieldset>
                    </div>

                    {/* Second Column: Academic Year, Student Search, Term Checkbox */}
                    <div className='max-h-[600px] overflow-auto rounded border bg-gray-50 p-6 shadow-inner' style={{ width: '40%' }}>
                        <div className='mb-4 flex items-center space-x-4'>
                            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                            <label className='whitespace-nowrap font-semibold'>
                                Academic Year:<span className='ml-1 text-red-600'>*</span>
                            </label>
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
                                        disabled={academicYearLoading}>
                                        <SelectTrigger className='min-w-[100px] text-center'>
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
                                                academicYeardata?.data?.map((item: any, index: number) => (
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

                        <div className='mb-4'>
                            <div className='flex items-center space-x-4'>
                                {/* <label htmlFor='studentSearchInput' className='whitespace-nowrap font-semibold'>
                                    Student Name:<span className='ml-1 text-red-600'>*</span>
                                </label> */}
                                <label htmlFor='studentSearchInput' className='whitespace-nowrap font-semibold'>
                                    {studentLabel}:<span className='ml-1 text-red-600'>*</span>
                                </label>

                                <div className='relative'>
                                    <input
                                        id='studentSearchInput'
                                        type='text'
                                        placeholder='Search student...'
                                        value={studentSearch}
                                        onChange={(e) => {
                                            setStudentSearch(e.target.value);
                                            setSelectedStudent(null);
                                        }}
                                        className='w-72 rounded border px-3 py-2'
                                        autoComplete='off'
                                    />

                                    {studentSearch.trim() !== '' && !selectedStudent && (
                                        <ul className='absolute top-full left-0 z-10 mt-1 max-h-40 w-72 overflow-y-auto rounded border bg-white shadow-md'>
                                            {loadingStudents ? (
                                                <li className='px-3 py-2 text-gray-500'>Loading...</li>
                                            ) : students.length === 0 ? (
                                                <li className='px-3 py-2 text-gray-500'>No students found</li>
                                            ) : (
                                                students.map((student) => (
                                                    <li
                                                        key={student.amsT_Id}
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setStudentSearch(
                                                                admissionType === 'prospectus'
                                                                    ? student.prospectusNo || student.studentName
                                                                    : student.studentName
                                                            );
                                                        }}
                                                        className='cursor-pointer px-3 py-2 hover:bg-blue-100'>
                                                        {admissionType === 'prospectus'
                                                            ? student.prospectusNo || student.studentName
                                                            : student.studentName}
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='mt-14'>
                            <div className='mt-10 flex items-start space-x-4'>
                                <div className='flex items-center space-x-2'>
                                    <label htmlFor='termName' className='whitespace-nowrap font-semibold'>
                                        Term Name:
                                    </label>
                                    <input
                                        type='checkbox'
                                        id='termName'
                                        checked={termName}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setTermName(checked);
                                            setSelectedStudentTerms((prev) => prev.map((t) => ({ ...t, selected: checked })));
                                        }}
                                        className='cursor-pointer'
                                    />
                                </div>

                                <div className='max-h-40 w-72 overflow-y-auto rounded-md border border-blue-300 bg-white p-2 shadow-sm'>
                                    {loadingStudentTerms ? (
                                        <p className='text-gray-500 italic'>Loading terms...</p>
                                    ) : selectedStudentTerms.length === 0 ? (
                                        <p className='text-gray-500 italic'>No terms available</p>
                                    ) : (
                                        selectedStudentTerms.map((term, index) => (
                                            <div key={term.fmT_Id || index} className='flex items-center space-x-2'>
                                                <input
                                                    type='checkbox'
                                                    id={`term-${term.fmT_Id}`}
                                                    checked={term.selected || false}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const updated = selectedStudentTerms.map((t) =>
                                                            t.fmT_Id === term.fmT_Id ? { ...t, selected: checked } : t
                                                        );
                                                        setSelectedStudentTerms(updated);
                                                        const allChecked = updated.every((t) => t.selected);
                                                        setTermName(allChecked);
                                                    }}
                                                    className='cursor-pointer'
                                                />
                                                <label htmlFor={`term-${term.fmT_Id}`} className='cursor-pointer'>
                                                    {term.fmT_Name}
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Third Column: Student Info Panel */}
                    <div className='max-h-[400px] overflow-auto rounded border bg-gray-50 p-4 shadow-inner' style={{ width: '30%' }}>
                        <h3 className='mb-3 font-bold text-lg'>Student Information</h3>

                        {loadingStudentInfo ? (
                            <p className='text-gray-500 italic'>Loading student info...</p>
                        ) : (
                            <table className='w-full text-left text-sm'>
                                <tbody>
                                    <tr>
                                        <td className='w-32 font-semibold'>Name</td>
                                        <td>: {studentInfo?.studentName || ''}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-semibold'>Reg No</td>
                                        <td>: {studentInfo?.regNo || ''}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-semibold'>Class</td>
                                        <td>: {studentInfo?.className || ''}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-semibold'>Mobile</td>
                                        <td>: {studentInfo?.mobileNo || ''}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-semibold'>Email</td>
                                        <td>: {studentInfo?.emailId || ''}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-semibold'>Father</td>
                                        <td>: {studentInfo?.fatherName || ''}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {loadingTransactions && (
                    <div className='mt-6 rounded border bg-gray-50 p-4 text-center text-gray-600 italic shadow-inner'>
                        Loading transaction data...
                    </div>
                )}

                {!loadingTransactions && selectedStudent && transactionData.length === 0 && (
                    <div className='mt-6 rounded border bg-gray-50 p-4 text-center text-gray-600 italic shadow-inner'>
                        No transaction data available for this student.
                    </div>
                )}

                {transactionData.length > 0 && (
                    <div className='mt-6 rounded border bg-white p-4 shadow-md'>
                        <h3 className='mb-3 font-bold text-gray-700 text-lg'>Transaction Details</h3>

                        <div className='overflow-x-auto'>
                            <table className='min-w-full border-collapse border text-sm'>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th className='w-12 border border-gray-400 px-2 py-2'>Sno</th>
                                        <th className='w-8 border border-gray-400 px-2 py-2'>
                                            <input type='checkbox' checked={allSelected} onChange={handleSelectAll} />
                                        </th>
                                        <th className='border px-4 py-2 text-left'>Fee Group</th>
                                        <th className='border px-4 py-2 text-left'>Fee Head</th>
                                        <th className='border px-4 py-2 text-right'>Installment</th>
                                        <th className='border px-4 py-2 text-right'>Current Charges</th>
                                        <th className='border px-4 py-2 text-right'>Total Charges</th>
                                        <th className='border px-4 py-2 text-right'>Concession</th>
                                        <th className='border px-4 py-2 text-right'>Fine</th>
                                        <th className='border px-4 py-2 text-right'>Payable Amount</th>
                                        <th className='border px-4 py-2 text-right'>Net Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactionData.map((row, index) => {
                                        const isSelected = selectedRows.includes(index);

                                        return (
                                            <tr key={index} className='transition-colors duration-150 hover:bg-blue-50'>
                                                {/* S.No */}
                                                <td className='border border-gray-400 px-2 py-2 text-center'>{index + 1}</td>

                                                {/* Checkbox */}
                                                <td className='border border-gray-400 px-2 py-2 text-center'>
                                                    <input
                                                        type='checkbox'
                                                        checked={isSelected}
                                                        onChange={() => handleRowSelect(index)}
                                                        className='cursor-pointer'
                                                    />
                                                </td>

                                                {/* Fee Group */}
                                                <td className='select-none border border-gray-400 px-2 py-2'>{row.fmG_GroupName ?? ''}</td>

                                                {/* Fee Head */}
                                                <td className='select-none border border-gray-400 px-2 py-2'>{row.fmH_FeeName ?? ''}</td>

                                                {/* Installment */}
                                                <td className='select-none border border-gray-400 px-2 py-2 text-right'>
                                                    {row.ftI_Id ?? ''}
                                                </td>

                                                {/* Current Year Charges */}
                                                <td className='border border-gray-400 px-2 py-2 text-right'>
                                                    <input
                                                        type='text'
                                                        readOnly
                                                        value={row.currentYrCharges ?? ''}
                                                        className='w-full rounded border border-gray-300 bg-gray-50 text-center'
                                                    />
                                                </td>

                                                {/* Total Charges */}
                                                <td className='border border-gray-400 px-2 py-2 text-right'>
                                                    <input
                                                        type='text'
                                                        readOnly
                                                        value={row.totalCharges ?? ''}
                                                        className='w-full rounded border border-gray-300 bg-gray-50 text-center'
                                                    />
                                                </td>

                                                {/* Concession */}
                                                <td className='border border-gray-400 px-2 py-2 text-right'>
                                                    <input
                                                        type='text'
                                                        readOnly
                                                        value={row.concessionAmount ?? ''}
                                                        className='w-full rounded border border-gray-300 bg-gray-50 text-center'
                                                    />
                                                </td>

                                                {/* Fine */}
                                                <td className='border border-gray-400 px-2 py-2 text-right'>
                                                    <input
                                                        type='text'
                                                        readOnly
                                                        value={row.fineAmount ?? ''}
                                                        className='w-full rounded border border-gray-300 bg-gray-50 text-center'
                                                    />
                                                </td>

                                                {/* Payable Amount (Editable when selected) */}
                                                <td className='border border-gray-400 px-2 py-2'>
                                                    <input
                                                        type='number'
                                                        readOnly={!isSelected}
                                                        min={0}
                                                        step='0.01'
                                                        value={row.toBePaid ?? ''}
                                                        onKeyDown={(e) => ['-', 'e', 'E', '+'].includes(e.key) && e.preventDefault()}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if ((val === '' || Number(val) >= 0) && isSelected) {
                                                                handlePayableChange(index, Number(val) || 0);
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            if (isSelected && e.target.value !== '') {
                                                                // biome-ignore lint/style/useNumberNamespace: <explanation>
                                                                const rounded = Number(parseFloat(e.target.value).toFixed(2));
                                                                handlePayableChange(index, rounded);
                                                            }
                                                        }}
                                                        className={`w-full rounded text-center transition-all ${
                                                            isSelected
                                                                ? 'border border-blue-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                                : 'border border-gray-300 bg-gray-50'
                                                        }`}
                                                    />
                                                </td>

                                                {/* Net Amount */}
                                                <td className='border border-gray-400 px-2 py-2 text-right'>
                                                    <input
                                                        type='text'
                                                        readOnly
                                                        value={row.netAmount ?? ''}
                                                        className='w-full rounded border border-gray-300 bg-gray-50 text-center'
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {transactionData.length > 0 && (
                    <div className='mt-6 grid grid-cols-2 gap-6 rounded-lg border border-gray-300 p-4 shadow-sm'>
                        <div>
                            <div className='mb-3'>
                                <label htmlFor='narrationInput' className='mr-2 font-semibold'>
                                    Narration :
                                </label>
                                <input
                                    id='narrationInput'
                                    type='text'
                                    name='narration'
                                    value={paymentData.narration}
                                    onChange={handleChange}
                                    className='w-2/3 rounded border border-gray-300 px-2 py-1'
                                    placeholder='Enter remarks...'
                                />
                            </div>

                            <div className='mb-3 flex gap-6'>
                                {['Cash', 'Bank', 'RTGS/NTF', 'Card No'].map((mode) => (
                                    <label key={mode} className='flex items-center space-x-2'>
                                        <input
                                            type='radio'
                                            name='paymentMode'
                                            checked={paymentMode === mode}
                                            onChange={() => setPaymentMode(mode)}
                                            className='cursor-pointer'
                                        />
                                        <span className='font-medium'>{mode}</span>
                                    </label>
                                ))}
                            </div>

                            {paymentMode !== 'Cash' && (
                                <>
                                    <div className='mb-3 flex items-center gap-2'>
                                        <label htmlFor='chequeDateInput' className='w-32 font-semibold'>
                                            Cheque/DD Date :
                                        </label>
                                        <input
                                            id='chequeDateInput'
                                            type='date'
                                            name='chequeDate'
                                            value={paymentData.chequeDate}
                                            onChange={handleChange}
                                            className='rounded border border-gray-300 px-2 py-1'
                                        />
                                    </div>
                                    <div className='mb-3 flex items-center gap-2'>
                                        <label htmlFor='chequeNoInput' className='w-32 font-semibold'>
                                            Cheque/DD No :
                                        </label>
                                        <input
                                            id='chequeNoInput'
                                            type='text'
                                            name='chequeNo'
                                            value={paymentData.chequeNo}
                                            onChange={handleChange}
                                            className='w-2/3 rounded border border-gray-300 px-2 py-1'
                                            placeholder='Enter number'
                                        />
                                    </div>
                                    <div className='mb-3 flex items-center gap-2'>
                                        <label htmlFor='bankNameInput' className='w-32 font-semibold'>
                                            Bank Name :
                                        </label>
                                        <input
                                            id='bankNameInput'
                                            type='text'
                                            name='bankName'
                                            value={paymentData.bankName}
                                            onChange={handleChange}
                                            className='w-2/3 rounded border border-gray-300 px-2 py-1'
                                            placeholder='Enter bank name'
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            {[
                                { label: 'Total Fee', key: 'totalFee', value: calculations.totalFee },
                                { label: 'Concession', key: 'concession', value: calculations.concession },
                                { label: 'Fine', key: 'fine', value: calculations.fine },
                                { label: 'Now Paying', key: 'nowPaying', value: calculations.nowPaying },
                                { label: 'Current Balance', key: 'remainingBalance', value: calculations.remainingBalance }
                            ].map((item) => (
                                <div key={item.key} className='mb-2 flex items-center gap-2'>
                                    {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                                    <label className='w-32 font-semibold'>{item.label}:</label>
                                    <input
                                        type='text'
                                        readOnly
                                        value={
                                            item.key === 'concession'
                                                ? `${item.value.toFixed(2)}`
                                                : item.key === 'fine'
                                                  ? `${item.value.toFixed(2)}`
                                                  : `${item.value.toFixed(2)}`
                                        }
                                        className='w-2/3 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-right font-medium'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {transactionData.length > 0 && (
                    <div className='flex justify-center gap-4 pt-6'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleReset}
                            disabled={isSubmitting}
                            className='order-2 w-fit sm:order-1'>
                            Reset
                        </Button>
                        <Button
                            type='submit'
                            disabled={isSubmitting || selectedRows.length === 0}
                            className='order-1 w-fit sm:order-2'
                            isLoading={isSubmitting}
                            loadingText='Saving...'>
                            <div className='flex items-center'>
                                <Save className='mr-2 h-4 w-4' />
                                Save Preadmission Transaction
                            </div>
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
